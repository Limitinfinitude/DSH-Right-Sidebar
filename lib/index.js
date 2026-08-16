import { createReadStream, realpathSync } from "node:fs";
import { readdir, realpath, stat, writeFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";

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
		kind: "code",
		mime: "text/javascript; charset=utf-8"
	},
	jsx: {
		kind: "code",
		mime: "text/javascript; charset=utf-8"
	},
	ts: {
		kind: "code",
		mime: "text/plain; charset=utf-8"
	},
	tsx: {
		kind: "code",
		mime: "text/plain; charset=utf-8"
	},
	css: {
		kind: "code",
		mime: "text/css; charset=utf-8"
	},
	scss: {
		kind: "code",
		mime: "text/plain; charset=utf-8"
	},
	less: {
		kind: "code",
		mime: "text/plain; charset=utf-8"
	},
	py: {
		kind: "code",
		mime: "text/x-python; charset=utf-8"
	},
	sh: {
		kind: "code",
		mime: "text/x-shellscript; charset=utf-8"
	},
	ps1: {
		kind: "code",
		mime: "text/plain; charset=utf-8"
	},
	sql: {
		kind: "code",
		mime: "application/sql; charset=utf-8"
	},
	go: {
		kind: "code",
		mime: "text/plain; charset=utf-8"
	},
	rs: {
		kind: "code",
		mime: "text/plain; charset=utf-8"
	},
	java: {
		kind: "code",
		mime: "text/x-java-source; charset=utf-8"
	},
	c: {
		kind: "code",
		mime: "text/x-c; charset=utf-8"
	},
	h: {
		kind: "code",
		mime: "text/x-c; charset=utf-8"
	},
	cpp: {
		kind: "code",
		mime: "text/x-c++; charset=utf-8"
	},
	hpp: {
		kind: "code",
		mime: "text/x-c++; charset=utf-8"
	},
	vue: {
		kind: "code",
		mime: "text/plain; charset=utf-8"
	},
	svelte: {
		kind: "code",
		mime: "text/plain; charset=utf-8"
	}
};
/** Whether a produced output is an HTTP(S) resource rather than a local path. */
function isNetworkOutput(value) {
	try {
		const url = new URL(value);
		return (url.protocol === "http:" || url.protocol === "https:") && url.username === "" && url.password === "";
	} catch {
		return false;
	}
}
/** Path portion used for format checks and labels, excluding URL query/hash data. */
function outputPathname(value) {
	if (isNetworkOutput(value)) try {
		return decodeURIComponent(new URL(value).pathname);
	} catch {
		return new URL(value).pathname;
	}
	return value.split(/[?#]/, 1)[0] ?? value;
}
/** Lowercase output extension without URL query or fragment suffixes. */
function outputExtension(value) {
	const path = outputPathname(value);
	const dot = path.lastIndexOf(".");
	return dot < 0 ? "" : path.slice(dot + 1).toLowerCase();
}

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
const AUTHORIZED_ROOT_LIMIT = 256;
const AUTHORIZED_ROOT_TTL = 360 * 60 * 1e3;
const REMOTE_TIMEOUT_MS = 1e4;
const SEARCH_ENTRY_LIMIT = 2e4;
const SEARCH_DEPTH_LIMIT = 12;
const ALLOWED_EXTENSIONS = new Set(Object.keys(OUTPUT_FORMATS));
const authorizedRoots = /* @__PURE__ */ new Map();
const authorizedUrls = /* @__PURE__ */ new Map();
const SKIPPED_SEARCH_DIRECTORIES = new Set([
	".git",
	".dsh",
	"node_modules",
	".venv",
	"venv"
]);
function activeAuthorizedRoots(now = Date.now()) {
	for (const [root, authorizedAt] of authorizedRoots) if (now - authorizedAt > AUTHORIZED_ROOT_TTL) authorizedRoots.delete(root);
	return [...authorizedRoots.keys()];
}
function authorizeRoot(root) {
	authorizedRoots.delete(root);
	authorizedRoots.set(root, Date.now());
	while (authorizedRoots.size > AUTHORIZED_ROOT_LIMIT) {
		const oldest = authorizedRoots.keys().next().value;
		if (oldest === void 0) break;
		authorizedRoots.delete(oldest);
	}
}
function activeAuthorizedUrl(url, now = Date.now()) {
	for (const [candidate, authorizedAt] of authorizedUrls) if (now - authorizedAt > AUTHORIZED_ROOT_TTL) authorizedUrls.delete(candidate);
	return authorizedUrls.has(url);
}
function authorizeUrl(url) {
	authorizedUrls.delete(url);
	authorizedUrls.set(url, Date.now());
	while (authorizedUrls.size > AUTHORIZED_ROOT_LIMIT) {
		const oldest = authorizedUrls.keys().next().value;
		if (oldest === void 0) break;
		authorizedUrls.delete(oldest);
	}
}
function isSameOrigin(req) {
	const origin = req.headers.origin;
	const host = req.headers.host;
	if (origin === void 0) return true;
	if (typeof origin !== "string" || typeof host !== "string") return false;
	try {
		return new URL(origin).host === host;
	} catch {
		return false;
	}
}
async function supportedFile(raw) {
	if (raw === "" || !isAbsolute(raw)) return null;
	try {
		const real = await realpath(raw);
		return ALLOWED_EXTENSIONS.has(extname(real).slice(1).toLowerCase()) ? real : null;
	} catch {
		return null;
	}
}
async function searchWorkspaceFile(raw, roots) {
	if (raw === "" || isAbsolute(raw) || isNetworkOutput(raw)) return { kind: "missing" };
	const parts = raw.replaceAll("\\", "/").replace(/^(?:\.{3}|…)\/+/, "").split("/").filter((part) => part !== "" && part !== ".");
	if (parts.length === 0 || parts.includes("..")) return { kind: "missing" };
	const suffix = parts.join("/").toLowerCase();
	if (!ALLOWED_EXTENSIONS.has(outputExtension(suffix))) return { kind: "missing" };
	const matches = /* @__PURE__ */ new Set();
	let visited = 0;
	for (const root of roots) {
		const pending = [{
			directory: root,
			depth: 0
		}];
		while (pending.length > 0 && visited < SEARCH_ENTRY_LIMIT) {
			const current = pending.shift();
			if (current === void 0) break;
			let entries;
			try {
				entries = await readdir(current.directory, { withFileTypes: true });
			} catch {
				continue;
			}
			for (const entry of entries) {
				visited += 1;
				if (visited > SEARCH_ENTRY_LIMIT) break;
				const candidate = join(current.directory, entry.name);
				if (entry.isDirectory()) {
					if (current.depth < SEARCH_DEPTH_LIMIT && !SKIPPED_SEARCH_DIRECTORIES.has(entry.name)) pending.push({
						directory: candidate,
						depth: current.depth + 1
					});
					continue;
				}
				if (!entry.isFile() || !ALLOWED_EXTENSIONS.has(outputExtension(entry.name))) continue;
				const rel = relative(root, candidate).replaceAll("\\", "/").toLowerCase();
				if (rel !== suffix && !rel.endsWith(`/${suffix}`)) continue;
				try {
					matches.add(await realpath(candidate));
				} catch {
					continue;
				}
				if (matches.size > 1) return { kind: "ambiguous" };
			}
		}
	}
	const match = matches.values().next().value;
	return match === void 0 ? { kind: "missing" } : {
		kind: "found",
		path: match
	};
}
async function remoteBytes(response) {
	const declared = Number(response.headers.get("content-length"));
	if (Number.isFinite(declared) && declared > MAX_BYTES) return null;
	if (response.body === null) return Buffer.alloc(0);
	const reader = response.body.getReader();
	const chunks = [];
	let size = 0;
	while (true) {
		const result = await reader.read();
		if (result.done) break;
		const chunk = Buffer.from(result.value);
		size += chunk.length;
		if (size > MAX_BYTES) {
			await reader.cancel();
			return null;
		}
		chunks.push(chunk);
	}
	return Buffer.concat(chunks);
}
async function proxyNetworkOutput(raw, req, res) {
	if (!activeAuthorizedUrl(raw)) {
		res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
		res.end("output-dock: network output is not authorized");
		return;
	}
	if (req.method !== "GET" && req.method !== "HEAD") {
		res.writeHead(405, { Allow: "GET, HEAD, POST" });
		res.end();
		return;
	}
	const format = OUTPUT_FORMATS[outputExtension(raw)];
	if (format === void 0) {
		res.writeHead(400);
		res.end("output-dock: unsupported network output");
		return;
	}
	try {
		const upstream = await fetch(raw, {
			method: req.method,
			redirect: "follow",
			headers: { Accept: format.mime },
			signal: AbortSignal.timeout(REMOTE_TIMEOUT_MS)
		});
		if (!upstream.ok) {
			res.writeHead(upstream.status);
			res.end("output-dock: upstream request failed");
			return;
		}
		if (req.method === "HEAD") {
			res.writeHead(200, {
				"Content-Type": format.mime,
				"Cache-Control": "no-store"
			});
			res.end();
			return;
		}
		const content = await remoteBytes(upstream);
		if (content === null) {
			res.writeHead(413);
			res.end("output-dock: network output exceeds the size limit");
			return;
		}
		res.writeHead(200, {
			"Content-Type": format.mime,
			"Content-Length": String(content.length),
			"Cache-Control": "no-store"
		});
		res.end(content);
	} catch {
		res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
		res.end("output-dock: network output request failed");
	}
}
function editableFile(file) {
	const kind = OUTPUT_FORMATS[extname(file).slice(1).toLowerCase()]?.kind;
	return kind !== void 0 && kind !== "image" && kind !== "pdf";
}
async function requestText(req) {
	const chunks = [];
	let size = 0;
	for await (const chunk of req) {
		const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		size += bytes.length;
		if (size > MAX_BYTES) return null;
		chunks.push(bytes);
	}
	return Buffer.concat(chunks).toString("utf8");
}
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
			const workspaceRoots = [...new Set(ctx.workspaceRegistry.list().map((workspace) => workspace.path))];
			const roots = [...new Set([bootRoot(), ...workspaceRoots])];
			const rawPath = new URL(req.url ?? "/", "http://localhost").searchParams.get("path") ?? "";
			if (req.method === "POST") {
				if (!isSameOrigin(req)) {
					res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
					res.end("output-dock: cross-origin authorization rejected");
					return;
				}
				if (isNetworkOutput(rawPath)) {
					if (!ALLOWED_EXTENSIONS.has(outputExtension(rawPath))) {
						res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
						res.end("output-dock: unsupported network output");
						return;
					}
					authorizeUrl(rawPath);
					res.writeHead(204, {
						"Cache-Control": "no-store",
						"X-Output-Dock-Resolved": encodeURIComponent(rawPath)
					});
					res.end();
					return;
				}
				let produced = await workspaceFile(rawPath, roots) ?? await supportedFile(rawPath);
				if (produced === null) {
					const searched = await searchWorkspaceFile(rawPath, workspaceRoots);
					if (searched.kind === "ambiguous") {
						res.writeHead(409, { "Content-Type": "text/plain; charset=utf-8" });
						res.end("output-dock: produced path matches multiple workspace files");
						return;
					}
					if (searched.kind === "found") produced = searched.path;
				}
				if (produced === null) {
					res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
					res.end("output-dock: unsupported produced path");
					return;
				}
				const info$1 = await stat(produced);
				if (!info$1.isFile() || info$1.size > MAX_BYTES) {
					res.writeHead(404);
					res.end("not found");
					return;
				}
				authorizeRoot(dirname(produced));
				res.writeHead(204, {
					"Cache-Control": "no-store",
					"X-Output-Dock-Resolved": encodeURIComponent(produced)
				});
				res.end();
				return;
			}
			if (isNetworkOutput(rawPath)) {
				await proxyNetworkOutput(rawPath, req, res);
				return;
			}
			const file = await workspaceFile(rawPath, [...roots, ...activeAuthorizedRoots()]);
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
			if (req.method === "PUT") {
				if (!editableFile(file)) {
					res.writeHead(415, { "Content-Type": "text/plain; charset=utf-8" });
					res.end("output-dock: this file type is read-only");
					return;
				}
				const content = await requestText(req);
				if (content === null) {
					res.writeHead(413, { "Content-Type": "text/plain; charset=utf-8" });
					res.end("output-dock: file content exceeds the size limit");
					return;
				}
				await writeFile(file, content, "utf8");
				res.writeHead(204, { "Cache-Control": "no-cache" });
				res.end();
				return;
			}
			if (req.method !== "GET" && req.method !== "HEAD") {
				res.writeHead(405, { Allow: "GET, HEAD, POST, PUT" });
				res.end();
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