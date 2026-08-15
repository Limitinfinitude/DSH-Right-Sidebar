import { createReadStream, realpathSync } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import { extname, isAbsolute, join, relative, resolve } from "node:path";

//#region src/route.ts
/** Shared route path for the dock's file-content endpoint. */
const ROUTE_PATH = "/api/output-dock/file";

//#endregion
//#region src/formats.ts
/** Extension metadata shared by the node route and browser collection path. */
const OUTPUT_FORMATS = {
	md: {
		kind: "md",
		mime: "text/markdown; charset=utf-8"
	},
	mdx: {
		kind: "md",
		mime: "text/markdown; charset=utf-8"
	},
	svg: {
		kind: "svg",
		mime: "image/svg+xml"
	},
	png: {
		kind: "image",
		mime: "image/png"
	},
	jpg: {
		kind: "image",
		mime: "image/jpeg"
	},
	jpeg: {
		kind: "image",
		mime: "image/jpeg"
	},
	webp: {
		kind: "image",
		mime: "image/webp"
	},
	gif: {
		kind: "image",
		mime: "image/gif"
	},
	avif: {
		kind: "image",
		mime: "image/avif"
	},
	bmp: {
		kind: "image",
		mime: "image/bmp"
	},
	html: {
		kind: "html",
		mime: "text/html; charset=utf-8"
	},
	htm: {
		kind: "html",
		mime: "text/html; charset=utf-8"
	},
	pdf: {
		kind: "pdf",
		mime: "application/pdf"
	},
	txt: {
		kind: "text",
		mime: "text/plain; charset=utf-8"
	},
	log: {
		kind: "text",
		mime: "text/plain; charset=utf-8"
	},
	json: {
		kind: "text",
		mime: "application/json; charset=utf-8"
	},
	jsonl: {
		kind: "text",
		mime: "application/x-ndjson; charset=utf-8"
	},
	csv: {
		kind: "text",
		mime: "text/csv; charset=utf-8"
	},
	tsv: {
		kind: "text",
		mime: "text/tab-separated-values; charset=utf-8"
	},
	yaml: {
		kind: "text",
		mime: "application/yaml; charset=utf-8"
	},
	yml: {
		kind: "text",
		mime: "application/yaml; charset=utf-8"
	},
	toml: {
		kind: "text",
		mime: "application/toml; charset=utf-8"
	},
	xml: {
		kind: "text",
		mime: "application/xml; charset=utf-8"
	},
	ini: {
		kind: "text",
		mime: "text/plain; charset=utf-8"
	},
	conf: {
		kind: "text",
		mime: "text/plain; charset=utf-8"
	},
	js: {
		kind: "text",
		mime: "text/javascript; charset=utf-8"
	},
	jsx: {
		kind: "text",
		mime: "text/javascript; charset=utf-8"
	},
	ts: {
		kind: "text",
		mime: "text/plain; charset=utf-8"
	},
	tsx: {
		kind: "text",
		mime: "text/plain; charset=utf-8"
	},
	css: {
		kind: "text",
		mime: "text/css; charset=utf-8"
	},
	scss: {
		kind: "text",
		mime: "text/plain; charset=utf-8"
	},
	less: {
		kind: "text",
		mime: "text/plain; charset=utf-8"
	},
	py: {
		kind: "text",
		mime: "text/x-python; charset=utf-8"
	},
	sh: {
		kind: "text",
		mime: "text/x-shellscript; charset=utf-8"
	},
	ps1: {
		kind: "text",
		mime: "text/plain; charset=utf-8"
	},
	sql: {
		kind: "text",
		mime: "application/sql; charset=utf-8"
	},
	go: {
		kind: "text",
		mime: "text/plain; charset=utf-8"
	},
	rs: {
		kind: "text",
		mime: "text/plain; charset=utf-8"
	},
	java: {
		kind: "text",
		mime: "text/x-java-source; charset=utf-8"
	},
	c: {
		kind: "text",
		mime: "text/x-c; charset=utf-8"
	},
	h: {
		kind: "text",
		mime: "text/x-c; charset=utf-8"
	},
	cpp: {
		kind: "text",
		mime: "text/x-c++; charset=utf-8"
	},
	hpp: {
		kind: "text",
		mime: "text/x-c++; charset=utf-8"
	},
	vue: {
		kind: "text",
		mime: "text/plain; charset=utf-8"
	},
	svelte: {
		kind: "text",
		mime: "text/plain; charset=utf-8"
	}
};

//#endregion
//#region src/index.ts
/**
* dsh-right-sidebar, node half. Serves preview bytes for the browser dock:
* one read-only HTTP route that resolves a workspace file path against the
* authoritative roots — the boot cwd plus every registered workspace — then
* enforces a size cap and an extension allowlist. No session, settings, or
* Typert surface — the dock is read-only.
*/
const name = "output-dock";
const inject = ["webServer", "workspaceRegistry"];
const MAX_BYTES = 16 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(Object.keys(OUTPUT_FORMATS));
/**
* Resolve a requested path against the workspace roots, keeping the result
* inside one of them. Absolute paths are accepted only when they already live
* under a root; relative paths try every root; traversal, cross-drive hops,
* and non-allowlisted extensions answer null. The final file is canonicalized
* through realpath so symlink escapes cannot widen the surface.
* @param raw - the raw `path` query parameter.
* @param roots - canonical absolute roots (boot cwd plus registered workspaces).
* @returns the resolved absolute file path, or null when rejected.
*/
async function workspaceFile(raw, roots) {
	if (raw === "") return null;
	const candidates = isAbsolute(raw) ? [raw] : roots.map((root) => join(root, raw));
	for (const candidate of candidates) {
		let real;
		try {
			real = await realpath(candidate);
		} catch {
			continue;
		}
		if (!ALLOWED_EXTENSIONS.has(extname(real).slice(1).toLowerCase())) return null;
		for (const root of roots) {
			const rel = relative(root, real);
			if (rel !== "" && !rel.startsWith("..") && !isAbsolute(rel)) return real;
		}
	}
	return null;
}
/**
* Register the file-content route. The handler is plain Node HTTP: path
* validation first, then a stat gate (file, size cap), then stream or 404.
* @param ctx - host context carrying the webserver and workspace services.
*/
function apply(ctx) {
	const bootRoot = () => {
		try {
			return realpathSync(resolve(process.cwd()));
		} catch {
			return resolve(process.cwd());
		}
	};
	ctx.webServer.register({
		kind: "route",
		path: ROUTE_PATH,
		async handler(req, res) {
			const roots = [...new Set([bootRoot(), ...ctx.workspaceRegistry.list().map((workspace) => workspace.path)])];
			const file = await workspaceFile(new URL(req.url ?? "/", "http://localhost").searchParams.get("path") ?? "", roots);
			if (file === null) {
				res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
				res.end("output-dock: rejected path (outside any workspace or unsupported extension)");
				return;
			}
			let info;
			try {
				info = await stat(file);
			} catch {
				res.writeHead(404);
				res.end("not found");
				return;
			}
			if (!info.isFile() || info.size > MAX_BYTES) {
				res.writeHead(404);
				res.end("not found");
				return;
			}
			const type = OUTPUT_FORMATS[extname(file).slice(1).toLowerCase()]?.mime ?? "application/octet-stream";
			res.writeHead(200, {
				"Content-Type": type,
				"Content-Length": info.size,
				"Cache-Control": "no-cache"
			});
			if (req.method === "HEAD") {
				res.end();
				return;
			}
			createReadStream(file).pipe(res);
		}
	});
}

//#endregion
export { apply, inject, name };