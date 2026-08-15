window.__ModuleLoader__.load({ id: "dsh-output-dock", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
//#region rolldown:runtime
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

//#endregion
let __deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
let react = require("react");
let react_jsx_runtime = require("react/jsx-runtime");

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
/** Preview category for one path, or null when the dock does not collect it. */
function kindOfPath(path) {
	const dot = path.lastIndexOf(".");
	if (dot < 0) return null;
	return OUTPUT_FORMATS[path.slice(dot + 1).toLowerCase()]?.kind ?? null;
}

//#endregion
//#region src/client/collect.ts
/** Trailing path segment, the part that identifies the file at a glance. */
function basename(path) {
	const at = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
	return at === -1 ? path : path.slice(at + 1);
}
/**
* Paths a call view reports having created or changed, by render intent
* rather than tool name: a diff card, or a generic card whose kind is `edit`.
* Reads, deletes, and failed calls contribute nothing.
*/
function producedPaths(view) {
	if (view === null) return [];
	if (view.card === "diff") return (view.locations ?? []).map((location) => location.path);
	if (view.card === "generic" && view.kind === "edit") return (view.locations ?? []).map((location) => location.path);
	return [];
}
function nodeFor(context) {
	const state = context.state;
	if (state === void 0 || state.produced.length === 0) return null;
	const last = state.produced[state.produced.length - 1];
	if (last === void 0) return null;
	const payload = {
		turn: state.turn,
		produced: state.produced
	};
	return {
		key: context.key,
		kind: context.kind,
		id: context.id,
		target: "outputDock",
		anchorSeq: last.seq,
		location: context.start?.location ?? { kind: "unresolved" },
		data: payload
	};
}
/** Turn-local successful mutation accumulator with the dock's extension filter. */
const outputDockDefinition = {
	kind: "output-dock-turn",
	target: "outputDock",
	match: (event) => {
		if (event.type === "turn/start") return {
			id: String(event.data.turn),
			role: "start"
		};
		if (event.type === "tool/call") return {
			id: String(event.data.turn),
			role: "update"
		};
		if (event.type === "tool/result" && (0, __deepseek_ai_dsh_client_runtime_client.isAppendSurfaceEvent)(event)) return {
			id: String(event.data.turn),
			role: "update"
		};
		return null;
	},
	start: (_context, match) => {
		if (match.event.type !== "turn/start") throw new Error("output-dock start requires turn/start");
		return {
			turn: match.event.data.turn,
			calls: /* @__PURE__ */ new Map(),
			produced: []
		};
	},
	update: (context, match) => {
		if (match.event.type === "tool/call") {
			const calls = new Map(context.state.calls);
			calls.set(String(match.event.data.callId), match.view?.for === "call" ? match.view.view : null);
			return {
				...context.state,
				calls
			};
		}
		if (match.event.type !== "tool/result") return context.state;
		if (match.event.data.message.content[0].isError === true) return context.state;
		const callId = String(match.event.data.message.source.callId);
		const additions = producedPaths(context.state.calls.get(callId) ?? null).map((path) => ({
			seq: match.event.seq,
			path
		})).filter((entry) => kindOfPath(entry.path) !== null);
		return additions.length === 0 ? context.state : {
			...context.state,
			produced: [...context.state.produced, ...additions]
		};
	},
	publication: (_match) => "immediate",
	buildViewNode: nodeFor
};

//#endregion
//#region node_modules/lucide-react/dist/cjs/lucide-react.js
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var require_lucide_react = /* @__PURE__ */ __commonJSMin(((exports) => {
	var react$1 = require("react");
	const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
	const mergeClasses = (...classes) => classes.filter((className, index, array) => {
		return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
	}).join(" ").trim();
	var defaultAttributes = {
		xmlns: "http://www.w3.org/2000/svg",
		width: 24,
		height: 24,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round"
	};
	const Icon = react$1.forwardRef(({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => {
		return react$1.createElement("svg", {
			ref,
			...defaultAttributes,
			width: size,
			height: size,
			stroke: color,
			strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
			className: mergeClasses("lucide", className),
			...rest
		}, [...iconNode.map(([tag$1, attrs]) => react$1.createElement(tag$1, attrs)), ...Array.isArray(children) ? children : [children]]);
	});
	const createLucideIcon = (iconName, iconNode) => {
		const Component$1 = react$1.forwardRef(({ className, ...props }, ref) => react$1.createElement(Icon, {
			ref,
			iconNode,
			className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
			...props
		}));
		Component$1.displayName = `${iconName}`;
		return Component$1;
	};
	const AArrowDown = createLucideIcon("AArrowDown", [
		["path", {
			d: "M3.5 13h6",
			key: "p1my2r"
		}],
		["path", {
			d: "m2 16 4.5-9 4.5 9",
			key: "ndf0b3"
		}],
		["path", {
			d: "M18 7v9",
			key: "pknjwm"
		}],
		["path", {
			d: "m14 12 4 4 4-4",
			key: "buelq4"
		}]
	]);
	const AArrowUp = createLucideIcon("AArrowUp", [
		["path", {
			d: "M3.5 13h6",
			key: "p1my2r"
		}],
		["path", {
			d: "m2 16 4.5-9 4.5 9",
			key: "ndf0b3"
		}],
		["path", {
			d: "M18 16V7",
			key: "ty0viw"
		}],
		["path", {
			d: "m14 11 4-4 4 4",
			key: "1pu57t"
		}]
	]);
	const ALargeSmall = createLucideIcon("ALargeSmall", [
		["path", {
			d: "M21 14h-5",
			key: "1vh23k"
		}],
		["path", {
			d: "M16 16v-3.5a2.5 2.5 0 0 1 5 0V16",
			key: "1wh10o"
		}],
		["path", {
			d: "M4.5 13h6",
			key: "dfilno"
		}],
		["path", {
			d: "m3 16 4.5-9 4.5 9",
			key: "2dxa0e"
		}]
	]);
	const Accessibility = createLucideIcon("Accessibility", [
		["circle", {
			cx: "16",
			cy: "4",
			r: "1",
			key: "1grugj"
		}],
		["path", {
			d: "m18 19 1-7-6 1",
			key: "r0i19z"
		}],
		["path", {
			d: "m5 8 3-3 5.5 3-2.36 3.5",
			key: "9ptxx2"
		}],
		["path", {
			d: "M4.24 14.5a5 5 0 0 0 6.88 6",
			key: "10kmtu"
		}],
		["path", {
			d: "M13.76 17.5a5 5 0 0 0-6.88-6",
			key: "2qq6rc"
		}]
	]);
	const Activity = createLucideIcon("Activity", [["path", {
		d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
		key: "169zse"
	}]]);
	const AirVent = createLucideIcon("AirVent", [
		["path", {
			d: "M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
			key: "larmp2"
		}],
		["path", {
			d: "M6 8h12",
			key: "6g4wlu"
		}],
		["path", {
			d: "M18.3 17.7a2.5 2.5 0 0 1-3.16 3.83 2.53 2.53 0 0 1-1.14-2V12",
			key: "1bo8pg"
		}],
		["path", {
			d: "M6.6 15.6A2 2 0 1 0 10 17v-5",
			key: "t9h90c"
		}]
	]);
	const Airplay = createLucideIcon("Airplay", [["path", {
		d: "M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1",
		key: "ns4c3b"
	}], ["path", {
		d: "m12 15 5 6H7Z",
		key: "14qnn2"
	}]]);
	const AlarmClockCheck = createLucideIcon("AlarmClockCheck", [
		["circle", {
			cx: "12",
			cy: "13",
			r: "8",
			key: "3y4lt7"
		}],
		["path", {
			d: "M5 3 2 6",
			key: "18tl5t"
		}],
		["path", {
			d: "m22 6-3-3",
			key: "1opdir"
		}],
		["path", {
			d: "M6.38 18.7 4 21",
			key: "17xu3x"
		}],
		["path", {
			d: "M17.64 18.67 20 21",
			key: "kv2oe2"
		}],
		["path", {
			d: "m9 13 2 2 4-4",
			key: "6343dt"
		}]
	]);
	const AlarmClockMinus = createLucideIcon("AlarmClockMinus", [
		["circle", {
			cx: "12",
			cy: "13",
			r: "8",
			key: "3y4lt7"
		}],
		["path", {
			d: "M5 3 2 6",
			key: "18tl5t"
		}],
		["path", {
			d: "m22 6-3-3",
			key: "1opdir"
		}],
		["path", {
			d: "M6.38 18.7 4 21",
			key: "17xu3x"
		}],
		["path", {
			d: "M17.64 18.67 20 21",
			key: "kv2oe2"
		}],
		["path", {
			d: "M9 13h6",
			key: "1uhe8q"
		}]
	]);
	const AlarmClockOff = createLucideIcon("AlarmClockOff", [
		["path", {
			d: "M6.87 6.87a8 8 0 1 0 11.26 11.26",
			key: "3on8tj"
		}],
		["path", {
			d: "M19.9 14.25a8 8 0 0 0-9.15-9.15",
			key: "15ghsc"
		}],
		["path", {
			d: "m22 6-3-3",
			key: "1opdir"
		}],
		["path", {
			d: "M6.26 18.67 4 21",
			key: "yzmioq"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M4 4 2 6",
			key: "1ycko6"
		}]
	]);
	const AlarmClockPlus = createLucideIcon("AlarmClockPlus", [
		["circle", {
			cx: "12",
			cy: "13",
			r: "8",
			key: "3y4lt7"
		}],
		["path", {
			d: "M5 3 2 6",
			key: "18tl5t"
		}],
		["path", {
			d: "m22 6-3-3",
			key: "1opdir"
		}],
		["path", {
			d: "M6.38 18.7 4 21",
			key: "17xu3x"
		}],
		["path", {
			d: "M17.64 18.67 20 21",
			key: "kv2oe2"
		}],
		["path", {
			d: "M12 10v6",
			key: "1bos4e"
		}],
		["path", {
			d: "M9 13h6",
			key: "1uhe8q"
		}]
	]);
	const AlarmClock = createLucideIcon("AlarmClock", [
		["circle", {
			cx: "12",
			cy: "13",
			r: "8",
			key: "3y4lt7"
		}],
		["path", {
			d: "M12 9v4l2 2",
			key: "1c63tq"
		}],
		["path", {
			d: "M5 3 2 6",
			key: "18tl5t"
		}],
		["path", {
			d: "m22 6-3-3",
			key: "1opdir"
		}],
		["path", {
			d: "M6.38 18.7 4 21",
			key: "17xu3x"
		}],
		["path", {
			d: "M17.64 18.67 20 21",
			key: "kv2oe2"
		}]
	]);
	const AlarmSmoke = createLucideIcon("AlarmSmoke", [
		["path", {
			d: "M11 21c0-2.5 2-2.5 2-5",
			key: "1sicvv"
		}],
		["path", {
			d: "M16 21c0-2.5 2-2.5 2-5",
			key: "1o3eny"
		}],
		["path", {
			d: "m19 8-.8 3a1.25 1.25 0 0 1-1.2 1H7a1.25 1.25 0 0 1-1.2-1L5 8",
			key: "1bvca4"
		}],
		["path", {
			d: "M21 3a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a1 1 0 0 1 1-1z",
			key: "x3qr1j"
		}],
		["path", {
			d: "M6 21c0-2.5 2-2.5 2-5",
			key: "i3w1gp"
		}]
	]);
	const Album = createLucideIcon("Album", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		ry: "2",
		key: "1m3agn"
	}], ["polyline", {
		points: "11 3 11 11 14 8 17 11 17 3",
		key: "1wcwz3"
	}]]);
	const AlignCenterHorizontal = createLucideIcon("AlignCenterHorizontal", [
		["path", {
			d: "M2 12h20",
			key: "9i4pu4"
		}],
		["path", {
			d: "M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4",
			key: "11f1s0"
		}],
		["path", {
			d: "M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4",
			key: "t14dx9"
		}],
		["path", {
			d: "M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1",
			key: "1w07xs"
		}],
		["path", {
			d: "M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1",
			key: "1apec2"
		}]
	]);
	const AlignCenterVertical = createLucideIcon("AlignCenterVertical", [
		["path", {
			d: "M12 2v20",
			key: "t6zp3m"
		}],
		["path", {
			d: "M8 10H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h4",
			key: "14d6g8"
		}],
		["path", {
			d: "M16 10h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4",
			key: "1e2lrw"
		}],
		["path", {
			d: "M8 20H7a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1",
			key: "1fkdwx"
		}],
		["path", {
			d: "M16 14h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1",
			key: "1euafb"
		}]
	]);
	const AlignCenter = createLucideIcon("AlignCenter", [
		["path", {
			d: "M17 12H7",
			key: "16if0g"
		}],
		["path", {
			d: "M19 18H5",
			key: "18s9l3"
		}],
		["path", {
			d: "M21 6H3",
			key: "1jwq7v"
		}]
	]);
	const AlignEndHorizontal = createLucideIcon("AlignEndHorizontal", [
		["rect", {
			width: "6",
			height: "16",
			x: "4",
			y: "2",
			rx: "2",
			key: "z5wdxg"
		}],
		["rect", {
			width: "6",
			height: "9",
			x: "14",
			y: "9",
			rx: "2",
			key: "um7a8w"
		}],
		["path", {
			d: "M22 22H2",
			key: "19qnx5"
		}]
	]);
	const AlignEndVertical = createLucideIcon("AlignEndVertical", [
		["rect", {
			width: "16",
			height: "6",
			x: "2",
			y: "4",
			rx: "2",
			key: "10wcwx"
		}],
		["rect", {
			width: "9",
			height: "6",
			x: "9",
			y: "14",
			rx: "2",
			key: "4p5bwg"
		}],
		["path", {
			d: "M22 22V2",
			key: "12ipfv"
		}]
	]);
	const AlignHorizontalDistributeCenter = createLucideIcon("AlignHorizontalDistributeCenter", [
		["rect", {
			width: "6",
			height: "14",
			x: "4",
			y: "5",
			rx: "2",
			key: "1wwnby"
		}],
		["rect", {
			width: "6",
			height: "10",
			x: "14",
			y: "7",
			rx: "2",
			key: "1fe6j6"
		}],
		["path", {
			d: "M17 22v-5",
			key: "4b6g73"
		}],
		["path", {
			d: "M17 7V2",
			key: "hnrr36"
		}],
		["path", {
			d: "M7 22v-3",
			key: "1r4jpn"
		}],
		["path", {
			d: "M7 5V2",
			key: "liy1u9"
		}]
	]);
	const AlignHorizontalDistributeEnd = createLucideIcon("AlignHorizontalDistributeEnd", [
		["rect", {
			width: "6",
			height: "14",
			x: "4",
			y: "5",
			rx: "2",
			key: "1wwnby"
		}],
		["rect", {
			width: "6",
			height: "10",
			x: "14",
			y: "7",
			rx: "2",
			key: "1fe6j6"
		}],
		["path", {
			d: "M10 2v20",
			key: "uyc634"
		}],
		["path", {
			d: "M20 2v20",
			key: "1tx262"
		}]
	]);
	const AlignHorizontalDistributeStart = createLucideIcon("AlignHorizontalDistributeStart", [
		["rect", {
			width: "6",
			height: "14",
			x: "4",
			y: "5",
			rx: "2",
			key: "1wwnby"
		}],
		["rect", {
			width: "6",
			height: "10",
			x: "14",
			y: "7",
			rx: "2",
			key: "1fe6j6"
		}],
		["path", {
			d: "M4 2v20",
			key: "gtpd5x"
		}],
		["path", {
			d: "M14 2v20",
			key: "tg6bpw"
		}]
	]);
	const AlignHorizontalJustifyCenter = createLucideIcon("AlignHorizontalJustifyCenter", [
		["rect", {
			width: "6",
			height: "14",
			x: "2",
			y: "5",
			rx: "2",
			key: "dy24zr"
		}],
		["rect", {
			width: "6",
			height: "10",
			x: "16",
			y: "7",
			rx: "2",
			key: "13zkjt"
		}],
		["path", {
			d: "M12 2v20",
			key: "t6zp3m"
		}]
	]);
	const AlignHorizontalJustifyEnd = createLucideIcon("AlignHorizontalJustifyEnd", [
		["rect", {
			width: "6",
			height: "14",
			x: "2",
			y: "5",
			rx: "2",
			key: "dy24zr"
		}],
		["rect", {
			width: "6",
			height: "10",
			x: "12",
			y: "7",
			rx: "2",
			key: "1ht384"
		}],
		["path", {
			d: "M22 2v20",
			key: "40qfg1"
		}]
	]);
	const AlignHorizontalJustifyStart = createLucideIcon("AlignHorizontalJustifyStart", [
		["rect", {
			width: "6",
			height: "14",
			x: "6",
			y: "5",
			rx: "2",
			key: "hsirpf"
		}],
		["rect", {
			width: "6",
			height: "10",
			x: "16",
			y: "7",
			rx: "2",
			key: "13zkjt"
		}],
		["path", {
			d: "M2 2v20",
			key: "1ivd8o"
		}]
	]);
	const AlignHorizontalSpaceAround = createLucideIcon("AlignHorizontalSpaceAround", [
		["rect", {
			width: "6",
			height: "10",
			x: "9",
			y: "7",
			rx: "2",
			key: "yn7j0q"
		}],
		["path", {
			d: "M4 22V2",
			key: "tsjzd3"
		}],
		["path", {
			d: "M20 22V2",
			key: "1bnhr8"
		}]
	]);
	const AlignHorizontalSpaceBetween = createLucideIcon("AlignHorizontalSpaceBetween", [
		["rect", {
			width: "6",
			height: "14",
			x: "3",
			y: "5",
			rx: "2",
			key: "j77dae"
		}],
		["rect", {
			width: "6",
			height: "10",
			x: "15",
			y: "7",
			rx: "2",
			key: "bq30hj"
		}],
		["path", {
			d: "M3 2v20",
			key: "1d2pfg"
		}],
		["path", {
			d: "M21 2v20",
			key: "p059bm"
		}]
	]);
	const AlignJustify = createLucideIcon("AlignJustify", [
		["path", {
			d: "M3 12h18",
			key: "1i2n21"
		}],
		["path", {
			d: "M3 18h18",
			key: "1h113x"
		}],
		["path", {
			d: "M3 6h18",
			key: "d0wm0j"
		}]
	]);
	const AlignLeft = createLucideIcon("AlignLeft", [
		["path", {
			d: "M15 12H3",
			key: "6jk70r"
		}],
		["path", {
			d: "M17 18H3",
			key: "1amg6g"
		}],
		["path", {
			d: "M21 6H3",
			key: "1jwq7v"
		}]
	]);
	const AlignRight = createLucideIcon("AlignRight", [
		["path", {
			d: "M21 12H9",
			key: "dn1m92"
		}],
		["path", {
			d: "M21 18H7",
			key: "1ygte8"
		}],
		["path", {
			d: "M21 6H3",
			key: "1jwq7v"
		}]
	]);
	const AlignStartHorizontal = createLucideIcon("AlignStartHorizontal", [
		["rect", {
			width: "6",
			height: "16",
			x: "4",
			y: "6",
			rx: "2",
			key: "1n4dg1"
		}],
		["rect", {
			width: "6",
			height: "9",
			x: "14",
			y: "6",
			rx: "2",
			key: "17khns"
		}],
		["path", {
			d: "M22 2H2",
			key: "fhrpnj"
		}]
	]);
	const AlignStartVertical = createLucideIcon("AlignStartVertical", [
		["rect", {
			width: "9",
			height: "6",
			x: "6",
			y: "14",
			rx: "2",
			key: "lpm2y7"
		}],
		["rect", {
			width: "16",
			height: "6",
			x: "6",
			y: "4",
			rx: "2",
			key: "rdj6ps"
		}],
		["path", {
			d: "M2 2v20",
			key: "1ivd8o"
		}]
	]);
	const AlignVerticalDistributeCenter = createLucideIcon("AlignVerticalDistributeCenter", [
		["path", {
			d: "M22 17h-3",
			key: "1lwga1"
		}],
		["path", {
			d: "M22 7h-5",
			key: "o2endc"
		}],
		["path", {
			d: "M5 17H2",
			key: "1gx9xc"
		}],
		["path", {
			d: "M7 7H2",
			key: "6bq26l"
		}],
		["rect", {
			x: "5",
			y: "14",
			width: "14",
			height: "6",
			rx: "2",
			key: "1qrzuf"
		}],
		["rect", {
			x: "7",
			y: "4",
			width: "10",
			height: "6",
			rx: "2",
			key: "we8e9z"
		}]
	]);
	const AlignVerticalDistributeEnd = createLucideIcon("AlignVerticalDistributeEnd", [
		["rect", {
			width: "14",
			height: "6",
			x: "5",
			y: "14",
			rx: "2",
			key: "jmoj9s"
		}],
		["rect", {
			width: "10",
			height: "6",
			x: "7",
			y: "4",
			rx: "2",
			key: "aza5on"
		}],
		["path", {
			d: "M2 20h20",
			key: "owomy5"
		}],
		["path", {
			d: "M2 10h20",
			key: "1ir3d8"
		}]
	]);
	const AlignVerticalDistributeStart = createLucideIcon("AlignVerticalDistributeStart", [
		["rect", {
			width: "14",
			height: "6",
			x: "5",
			y: "14",
			rx: "2",
			key: "jmoj9s"
		}],
		["rect", {
			width: "10",
			height: "6",
			x: "7",
			y: "4",
			rx: "2",
			key: "aza5on"
		}],
		["path", {
			d: "M2 14h20",
			key: "myj16y"
		}],
		["path", {
			d: "M2 4h20",
			key: "mda7wb"
		}]
	]);
	const AlignVerticalJustifyCenter = createLucideIcon("AlignVerticalJustifyCenter", [
		["rect", {
			width: "14",
			height: "6",
			x: "5",
			y: "16",
			rx: "2",
			key: "1i8z2d"
		}],
		["rect", {
			width: "10",
			height: "6",
			x: "7",
			y: "2",
			rx: "2",
			key: "ypihtt"
		}],
		["path", {
			d: "M2 12h20",
			key: "9i4pu4"
		}]
	]);
	const AlignVerticalJustifyEnd = createLucideIcon("AlignVerticalJustifyEnd", [
		["rect", {
			width: "14",
			height: "6",
			x: "5",
			y: "12",
			rx: "2",
			key: "4l4tp2"
		}],
		["rect", {
			width: "10",
			height: "6",
			x: "7",
			y: "2",
			rx: "2",
			key: "ypihtt"
		}],
		["path", {
			d: "M2 22h20",
			key: "272qi7"
		}]
	]);
	const AlignVerticalJustifyStart = createLucideIcon("AlignVerticalJustifyStart", [
		["rect", {
			width: "14",
			height: "6",
			x: "5",
			y: "16",
			rx: "2",
			key: "1i8z2d"
		}],
		["rect", {
			width: "10",
			height: "6",
			x: "7",
			y: "6",
			rx: "2",
			key: "13squh"
		}],
		["path", {
			d: "M2 2h20",
			key: "1ennik"
		}]
	]);
	const AlignVerticalSpaceAround = createLucideIcon("AlignVerticalSpaceAround", [
		["rect", {
			width: "10",
			height: "6",
			x: "7",
			y: "9",
			rx: "2",
			key: "b1zbii"
		}],
		["path", {
			d: "M22 20H2",
			key: "1p1f7z"
		}],
		["path", {
			d: "M22 4H2",
			key: "1b7qnq"
		}]
	]);
	const AlignVerticalSpaceBetween = createLucideIcon("AlignVerticalSpaceBetween", [
		["rect", {
			width: "14",
			height: "6",
			x: "5",
			y: "15",
			rx: "2",
			key: "1w91an"
		}],
		["rect", {
			width: "10",
			height: "6",
			x: "7",
			y: "3",
			rx: "2",
			key: "17wqzy"
		}],
		["path", {
			d: "M2 21h20",
			key: "1nyx9w"
		}],
		["path", {
			d: "M2 3h20",
			key: "91anmk"
		}]
	]);
	const Ambulance = createLucideIcon("Ambulance", [
		["path", {
			d: "M10 10H6",
			key: "1bsnug"
		}],
		["path", {
			d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",
			key: "wrbu53"
		}],
		["path", {
			d: "M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14",
			key: "lrkjwd"
		}],
		["path", {
			d: "M8 8v4",
			key: "1fwk8c"
		}],
		["path", {
			d: "M9 18h6",
			key: "x1upvd"
		}],
		["circle", {
			cx: "17",
			cy: "18",
			r: "2",
			key: "332jqn"
		}],
		["circle", {
			cx: "7",
			cy: "18",
			r: "2",
			key: "19iecd"
		}]
	]);
	const Ampersand = createLucideIcon("Ampersand", [["path", {
		d: "M17.5 12c0 4.4-3.6 8-8 8A4.5 4.5 0 0 1 5 15.5c0-6 8-4 8-8.5a3 3 0 1 0-6 0c0 3 2.5 8.5 12 13",
		key: "1o9ehi"
	}], ["path", {
		d: "M16 12h3",
		key: "4uvgyw"
	}]]);
	const Ampersands = createLucideIcon("Ampersands", [["path", {
		d: "M10 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5",
		key: "12lh1k"
	}], ["path", {
		d: "M22 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5",
		key: "173c68"
	}]]);
	const Amphora = createLucideIcon("Amphora", [
		["path", {
			d: "M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8",
			key: "1h8rid"
		}],
		["path", {
			d: "M10 5H8a2 2 0 0 0 0 4h.68",
			key: "3ezsi6"
		}],
		["path", {
			d: "M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8",
			key: "yt6q09"
		}],
		["path", {
			d: "M14 5h2a2 2 0 0 1 0 4h-.68",
			key: "8f95yk"
		}],
		["path", {
			d: "M18 22H6",
			key: "mg6kv4"
		}],
		["path", {
			d: "M9 2h6",
			key: "1jrp98"
		}]
	]);
	const Anchor = createLucideIcon("Anchor", [
		["path", {
			d: "M12 22V8",
			key: "qkxhtm"
		}],
		["path", {
			d: "M5 12H2a10 10 0 0 0 20 0h-3",
			key: "1hv3nh"
		}],
		["circle", {
			cx: "12",
			cy: "5",
			r: "3",
			key: "rqqgnr"
		}]
	]);
	const Angry = createLucideIcon("Angry", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M16 16s-1.5-2-4-2-4 2-4 2",
			key: "epbg0q"
		}],
		["path", {
			d: "M7.5 8 10 9",
			key: "olxxln"
		}],
		["path", {
			d: "m14 9 2.5-1",
			key: "1j6cij"
		}],
		["path", {
			d: "M9 10h.01",
			key: "qbtxuw"
		}],
		["path", {
			d: "M15 10h.01",
			key: "1qmjsl"
		}]
	]);
	const Annoyed = createLucideIcon("Annoyed", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M8 15h8",
			key: "45n4r"
		}],
		["path", {
			d: "M8 9h2",
			key: "1g203m"
		}],
		["path", {
			d: "M14 9h2",
			key: "116p9w"
		}]
	]);
	const Antenna = createLucideIcon("Antenna", [
		["path", {
			d: "M2 12 7 2",
			key: "117k30"
		}],
		["path", {
			d: "m7 12 5-10",
			key: "1tvx22"
		}],
		["path", {
			d: "m12 12 5-10",
			key: "ev1o1a"
		}],
		["path", {
			d: "m17 12 5-10",
			key: "1e4ti3"
		}],
		["path", {
			d: "M4.5 7h15",
			key: "vlsxkz"
		}],
		["path", {
			d: "M12 16v6",
			key: "c8a4gj"
		}]
	]);
	const Anvil = createLucideIcon("Anvil", [
		["path", {
			d: "M7 10H6a4 4 0 0 1-4-4 1 1 0 0 1 1-1h4",
			key: "1hjpb6"
		}],
		["path", {
			d: "M7 5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1 7 7 0 0 1-7 7H8a1 1 0 0 1-1-1z",
			key: "1qn45f"
		}],
		["path", {
			d: "M9 12v5",
			key: "3anwtq"
		}],
		["path", {
			d: "M15 12v5",
			key: "5xh3zn"
		}],
		["path", {
			d: "M5 20a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3 1 1 0 0 1-1 1H6a1 1 0 0 1-1-1",
			key: "1fi4x8"
		}]
	]);
	const Aperture = createLucideIcon("Aperture", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "m14.31 8 5.74 9.94",
			key: "1y6ab4"
		}],
		["path", {
			d: "M9.69 8h11.48",
			key: "1wxppr"
		}],
		["path", {
			d: "m7.38 12 5.74-9.94",
			key: "1grp0k"
		}],
		["path", {
			d: "M9.69 16 3.95 6.06",
			key: "libnyf"
		}],
		["path", {
			d: "M14.31 16H2.83",
			key: "x5fava"
		}],
		["path", {
			d: "m16.62 12-5.74 9.94",
			key: "1vwawt"
		}]
	]);
	const AppWindowMac = createLucideIcon("AppWindowMac", [
		["rect", {
			width: "20",
			height: "16",
			x: "2",
			y: "4",
			rx: "2",
			key: "18n3k1"
		}],
		["path", {
			d: "M6 8h.01",
			key: "x9i8wu"
		}],
		["path", {
			d: "M10 8h.01",
			key: "1r9ogq"
		}],
		["path", {
			d: "M14 8h.01",
			key: "1primd"
		}]
	]);
	const AppWindow = createLucideIcon("AppWindow", [
		["rect", {
			x: "2",
			y: "4",
			width: "20",
			height: "16",
			rx: "2",
			key: "izxlao"
		}],
		["path", {
			d: "M10 4v4",
			key: "pp8u80"
		}],
		["path", {
			d: "M2 8h20",
			key: "d11cs7"
		}],
		["path", {
			d: "M6 4v4",
			key: "1svtjw"
		}]
	]);
	const Apple = createLucideIcon("Apple", [["path", {
		d: "M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z",
		key: "3s7exb"
	}], ["path", {
		d: "M10 2c1 .5 2 2 2 5",
		key: "fcco2y"
	}]]);
	const ArchiveRestore = createLucideIcon("ArchiveRestore", [
		["rect", {
			width: "20",
			height: "5",
			x: "2",
			y: "3",
			rx: "1",
			key: "1wp1u1"
		}],
		["path", {
			d: "M4 8v11a2 2 0 0 0 2 2h2",
			key: "tvwodi"
		}],
		["path", {
			d: "M20 8v11a2 2 0 0 1-2 2h-2",
			key: "1gkqxj"
		}],
		["path", {
			d: "m9 15 3-3 3 3",
			key: "1pd0qc"
		}],
		["path", {
			d: "M12 12v9",
			key: "192myk"
		}]
	]);
	const ArchiveX = createLucideIcon("ArchiveX", [
		["rect", {
			width: "20",
			height: "5",
			x: "2",
			y: "3",
			rx: "1",
			key: "1wp1u1"
		}],
		["path", {
			d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",
			key: "1s80jp"
		}],
		["path", {
			d: "m9.5 17 5-5",
			key: "nakeu6"
		}],
		["path", {
			d: "m9.5 12 5 5",
			key: "1hccrj"
		}]
	]);
	const Archive = createLucideIcon("Archive", [
		["rect", {
			width: "20",
			height: "5",
			x: "2",
			y: "3",
			rx: "1",
			key: "1wp1u1"
		}],
		["path", {
			d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",
			key: "1s80jp"
		}],
		["path", {
			d: "M10 12h4",
			key: "a56b0p"
		}]
	]);
	const Armchair = createLucideIcon("Armchair", [
		["path", {
			d: "M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3",
			key: "irtipd"
		}],
		["path", {
			d: "M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z",
			key: "1qyhux"
		}],
		["path", {
			d: "M5 18v2",
			key: "ppbyun"
		}],
		["path", {
			d: "M19 18v2",
			key: "gy7782"
		}]
	]);
	const ArrowBigDownDash = createLucideIcon("ArrowBigDownDash", [["path", {
		d: "M15 5H9",
		key: "1tp3ed"
	}], ["path", {
		d: "M15 9v3h4l-7 7-7-7h4V9z",
		key: "ncdc4b"
	}]]);
	const ArrowBigDown = createLucideIcon("ArrowBigDown", [["path", {
		d: "M15 6v6h4l-7 7-7-7h4V6h6z",
		key: "1thax2"
	}]]);
	const ArrowBigLeftDash = createLucideIcon("ArrowBigLeftDash", [["path", {
		d: "M19 15V9",
		key: "1hci5f"
	}], ["path", {
		d: "M15 15h-3v4l-7-7 7-7v4h3v6z",
		key: "16tjna"
	}]]);
	const ArrowBigLeft = createLucideIcon("ArrowBigLeft", [["path", {
		d: "M18 15h-6v4l-7-7 7-7v4h6v6z",
		key: "lbrdak"
	}]]);
	const ArrowBigRightDash = createLucideIcon("ArrowBigRightDash", [["path", {
		d: "M5 9v6",
		key: "158jrl"
	}], ["path", {
		d: "M9 9h3V5l7 7-7 7v-4H9V9z",
		key: "1sg2xn"
	}]]);
	const ArrowBigRight = createLucideIcon("ArrowBigRight", [["path", {
		d: "M6 9h6V5l7 7-7 7v-4H6V9z",
		key: "7fvt9c"
	}]]);
	const ArrowBigUpDash = createLucideIcon("ArrowBigUpDash", [["path", {
		d: "M9 19h6",
		key: "456am0"
	}], ["path", {
		d: "M9 15v-3H5l7-7 7 7h-4v3H9z",
		key: "1r2uve"
	}]]);
	const ArrowBigUp = createLucideIcon("ArrowBigUp", [["path", {
		d: "M9 18v-6H5l7-7 7 7h-4v6H9z",
		key: "1x06kx"
	}]]);
	const ArrowDown01 = createLucideIcon("ArrowDown01", [
		["path", {
			d: "m3 16 4 4 4-4",
			key: "1co6wj"
		}],
		["path", {
			d: "M7 20V4",
			key: "1yoxec"
		}],
		["rect", {
			x: "15",
			y: "4",
			width: "4",
			height: "6",
			ry: "2",
			key: "1bwicg"
		}],
		["path", {
			d: "M17 20v-6h-2",
			key: "1qp1so"
		}],
		["path", {
			d: "M15 20h4",
			key: "1j968p"
		}]
	]);
	const ArrowDown10 = createLucideIcon("ArrowDown10", [
		["path", {
			d: "m3 16 4 4 4-4",
			key: "1co6wj"
		}],
		["path", {
			d: "M7 20V4",
			key: "1yoxec"
		}],
		["path", {
			d: "M17 10V4h-2",
			key: "zcsr5x"
		}],
		["path", {
			d: "M15 10h4",
			key: "id2lce"
		}],
		["rect", {
			x: "15",
			y: "14",
			width: "4",
			height: "6",
			ry: "2",
			key: "33xykx"
		}]
	]);
	const ArrowDownAZ = createLucideIcon("ArrowDownAZ", [
		["path", {
			d: "m3 16 4 4 4-4",
			key: "1co6wj"
		}],
		["path", {
			d: "M7 20V4",
			key: "1yoxec"
		}],
		["path", {
			d: "M20 8h-5",
			key: "1vsyxs"
		}],
		["path", {
			d: "M15 10V6.5a2.5 2.5 0 0 1 5 0V10",
			key: "ag13bf"
		}],
		["path", {
			d: "M15 14h5l-5 6h5",
			key: "ur5jdg"
		}]
	]);
	const ArrowDownFromLine = createLucideIcon("ArrowDownFromLine", [
		["path", {
			d: "M19 3H5",
			key: "1236rx"
		}],
		["path", {
			d: "M12 21V7",
			key: "gj6g52"
		}],
		["path", {
			d: "m6 15 6 6 6-6",
			key: "h15q88"
		}]
	]);
	const ArrowDownLeft = createLucideIcon("ArrowDownLeft", [["path", {
		d: "M17 7 7 17",
		key: "15tmo1"
	}], ["path", {
		d: "M17 17H7V7",
		key: "1org7z"
	}]]);
	const ArrowDownNarrowWide = createLucideIcon("ArrowDownNarrowWide", [
		["path", {
			d: "m3 16 4 4 4-4",
			key: "1co6wj"
		}],
		["path", {
			d: "M7 20V4",
			key: "1yoxec"
		}],
		["path", {
			d: "M11 4h4",
			key: "6d7r33"
		}],
		["path", {
			d: "M11 8h7",
			key: "djye34"
		}],
		["path", {
			d: "M11 12h10",
			key: "1438ji"
		}]
	]);
	const ArrowDownRight = createLucideIcon("ArrowDownRight", [["path", {
		d: "m7 7 10 10",
		key: "1fmybs"
	}], ["path", {
		d: "M17 7v10H7",
		key: "6fjiku"
	}]]);
	const ArrowDownToDot = createLucideIcon("ArrowDownToDot", [
		["path", {
			d: "M12 2v14",
			key: "jyx4ut"
		}],
		["path", {
			d: "m19 9-7 7-7-7",
			key: "1oe3oy"
		}],
		["circle", {
			cx: "12",
			cy: "21",
			r: "1",
			key: "o0uj5v"
		}]
	]);
	const ArrowDownToLine = createLucideIcon("ArrowDownToLine", [
		["path", {
			d: "M12 17V3",
			key: "1cwfxf"
		}],
		["path", {
			d: "m6 11 6 6 6-6",
			key: "12ii2o"
		}],
		["path", {
			d: "M19 21H5",
			key: "150jfl"
		}]
	]);
	const ArrowDownUp = createLucideIcon("ArrowDownUp", [
		["path", {
			d: "m3 16 4 4 4-4",
			key: "1co6wj"
		}],
		["path", {
			d: "M7 20V4",
			key: "1yoxec"
		}],
		["path", {
			d: "m21 8-4-4-4 4",
			key: "1c9v7m"
		}],
		["path", {
			d: "M17 4v16",
			key: "7dpous"
		}]
	]);
	const ArrowDownWideNarrow = createLucideIcon("ArrowDownWideNarrow", [
		["path", {
			d: "m3 16 4 4 4-4",
			key: "1co6wj"
		}],
		["path", {
			d: "M7 20V4",
			key: "1yoxec"
		}],
		["path", {
			d: "M11 4h10",
			key: "1w87gc"
		}],
		["path", {
			d: "M11 8h7",
			key: "djye34"
		}],
		["path", {
			d: "M11 12h4",
			key: "q8tih4"
		}]
	]);
	const ArrowDownZA = createLucideIcon("ArrowDownZA", [
		["path", {
			d: "m3 16 4 4 4-4",
			key: "1co6wj"
		}],
		["path", {
			d: "M7 4v16",
			key: "1glfcx"
		}],
		["path", {
			d: "M15 4h5l-5 6h5",
			key: "8asdl1"
		}],
		["path", {
			d: "M15 20v-3.5a2.5 2.5 0 0 1 5 0V20",
			key: "r6l5cz"
		}],
		["path", {
			d: "M20 18h-5",
			key: "18j1r2"
		}]
	]);
	const ArrowDown = createLucideIcon("ArrowDown", [["path", {
		d: "M12 5v14",
		key: "s699le"
	}], ["path", {
		d: "m19 12-7 7-7-7",
		key: "1idqje"
	}]]);
	const ArrowLeftFromLine = createLucideIcon("ArrowLeftFromLine", [
		["path", {
			d: "m9 6-6 6 6 6",
			key: "7v63n9"
		}],
		["path", {
			d: "M3 12h14",
			key: "13k4hi"
		}],
		["path", {
			d: "M21 19V5",
			key: "b4bplr"
		}]
	]);
	const ArrowLeftRight = createLucideIcon("ArrowLeftRight", [
		["path", {
			d: "M8 3 4 7l4 4",
			key: "9rb6wj"
		}],
		["path", {
			d: "M4 7h16",
			key: "6tx8e3"
		}],
		["path", {
			d: "m16 21 4-4-4-4",
			key: "siv7j2"
		}],
		["path", {
			d: "M20 17H4",
			key: "h6l3hr"
		}]
	]);
	const ArrowLeftToLine = createLucideIcon("ArrowLeftToLine", [
		["path", {
			d: "M3 19V5",
			key: "rwsyhb"
		}],
		["path", {
			d: "m13 6-6 6 6 6",
			key: "1yhaz7"
		}],
		["path", {
			d: "M7 12h14",
			key: "uoisry"
		}]
	]);
	const ArrowLeft = createLucideIcon("ArrowLeft", [["path", {
		d: "m12 19-7-7 7-7",
		key: "1l729n"
	}], ["path", {
		d: "M19 12H5",
		key: "x3x0zl"
	}]]);
	const ArrowRightFromLine = createLucideIcon("ArrowRightFromLine", [
		["path", {
			d: "M3 5v14",
			key: "1nt18q"
		}],
		["path", {
			d: "M21 12H7",
			key: "13ipq5"
		}],
		["path", {
			d: "m15 18 6-6-6-6",
			key: "6tx3qv"
		}]
	]);
	const ArrowRightLeft = createLucideIcon("ArrowRightLeft", [
		["path", {
			d: "m16 3 4 4-4 4",
			key: "1x1c3m"
		}],
		["path", {
			d: "M20 7H4",
			key: "zbl0bi"
		}],
		["path", {
			d: "m8 21-4-4 4-4",
			key: "h9nckh"
		}],
		["path", {
			d: "M4 17h16",
			key: "g4d7ey"
		}]
	]);
	const ArrowRightToLine = createLucideIcon("ArrowRightToLine", [
		["path", {
			d: "M17 12H3",
			key: "8awo09"
		}],
		["path", {
			d: "m11 18 6-6-6-6",
			key: "8c2y43"
		}],
		["path", {
			d: "M21 5v14",
			key: "nzette"
		}]
	]);
	const ArrowRight = createLucideIcon("ArrowRight", [["path", {
		d: "M5 12h14",
		key: "1ays0h"
	}], ["path", {
		d: "m12 5 7 7-7 7",
		key: "xquz4c"
	}]]);
	const ArrowUp01 = createLucideIcon("ArrowUp01", [
		["path", {
			d: "m3 8 4-4 4 4",
			key: "11wl7u"
		}],
		["path", {
			d: "M7 4v16",
			key: "1glfcx"
		}],
		["rect", {
			x: "15",
			y: "4",
			width: "4",
			height: "6",
			ry: "2",
			key: "1bwicg"
		}],
		["path", {
			d: "M17 20v-6h-2",
			key: "1qp1so"
		}],
		["path", {
			d: "M15 20h4",
			key: "1j968p"
		}]
	]);
	const ArrowUp10 = createLucideIcon("ArrowUp10", [
		["path", {
			d: "m3 8 4-4 4 4",
			key: "11wl7u"
		}],
		["path", {
			d: "M7 4v16",
			key: "1glfcx"
		}],
		["path", {
			d: "M17 10V4h-2",
			key: "zcsr5x"
		}],
		["path", {
			d: "M15 10h4",
			key: "id2lce"
		}],
		["rect", {
			x: "15",
			y: "14",
			width: "4",
			height: "6",
			ry: "2",
			key: "33xykx"
		}]
	]);
	const ArrowUpAZ = createLucideIcon("ArrowUpAZ", [
		["path", {
			d: "m3 8 4-4 4 4",
			key: "11wl7u"
		}],
		["path", {
			d: "M7 4v16",
			key: "1glfcx"
		}],
		["path", {
			d: "M20 8h-5",
			key: "1vsyxs"
		}],
		["path", {
			d: "M15 10V6.5a2.5 2.5 0 0 1 5 0V10",
			key: "ag13bf"
		}],
		["path", {
			d: "M15 14h5l-5 6h5",
			key: "ur5jdg"
		}]
	]);
	const ArrowUpDown = createLucideIcon("ArrowUpDown", [
		["path", {
			d: "m21 16-4 4-4-4",
			key: "f6ql7i"
		}],
		["path", {
			d: "M17 20V4",
			key: "1ejh1v"
		}],
		["path", {
			d: "m3 8 4-4 4 4",
			key: "11wl7u"
		}],
		["path", {
			d: "M7 4v16",
			key: "1glfcx"
		}]
	]);
	const ArrowUpFromDot = createLucideIcon("ArrowUpFromDot", [
		["path", {
			d: "m5 9 7-7 7 7",
			key: "1hw5ic"
		}],
		["path", {
			d: "M12 16V2",
			key: "ywoabb"
		}],
		["circle", {
			cx: "12",
			cy: "21",
			r: "1",
			key: "o0uj5v"
		}]
	]);
	const ArrowUpFromLine = createLucideIcon("ArrowUpFromLine", [
		["path", {
			d: "m18 9-6-6-6 6",
			key: "kcunyi"
		}],
		["path", {
			d: "M12 3v14",
			key: "7cf3v8"
		}],
		["path", {
			d: "M5 21h14",
			key: "11awu3"
		}]
	]);
	const ArrowUpLeft = createLucideIcon("ArrowUpLeft", [["path", {
		d: "M7 17V7h10",
		key: "11bw93"
	}], ["path", {
		d: "M17 17 7 7",
		key: "2786uv"
	}]]);
	const ArrowUpNarrowWide = createLucideIcon("ArrowUpNarrowWide", [
		["path", {
			d: "m3 8 4-4 4 4",
			key: "11wl7u"
		}],
		["path", {
			d: "M7 4v16",
			key: "1glfcx"
		}],
		["path", {
			d: "M11 12h4",
			key: "q8tih4"
		}],
		["path", {
			d: "M11 16h7",
			key: "uosisv"
		}],
		["path", {
			d: "M11 20h10",
			key: "jvxblo"
		}]
	]);
	const ArrowUpRight = createLucideIcon("ArrowUpRight", [["path", {
		d: "M7 7h10v10",
		key: "1tivn9"
	}], ["path", {
		d: "M7 17 17 7",
		key: "1vkiza"
	}]]);
	const ArrowUpToLine = createLucideIcon("ArrowUpToLine", [
		["path", {
			d: "M5 3h14",
			key: "7usisc"
		}],
		["path", {
			d: "m18 13-6-6-6 6",
			key: "1kf1n9"
		}],
		["path", {
			d: "M12 7v14",
			key: "1akyts"
		}]
	]);
	const ArrowUpWideNarrow = createLucideIcon("ArrowUpWideNarrow", [
		["path", {
			d: "m3 8 4-4 4 4",
			key: "11wl7u"
		}],
		["path", {
			d: "M7 4v16",
			key: "1glfcx"
		}],
		["path", {
			d: "M11 12h10",
			key: "1438ji"
		}],
		["path", {
			d: "M11 16h7",
			key: "uosisv"
		}],
		["path", {
			d: "M11 20h4",
			key: "1krc32"
		}]
	]);
	const ArrowUpZA = createLucideIcon("ArrowUpZA", [
		["path", {
			d: "m3 8 4-4 4 4",
			key: "11wl7u"
		}],
		["path", {
			d: "M7 4v16",
			key: "1glfcx"
		}],
		["path", {
			d: "M15 4h5l-5 6h5",
			key: "8asdl1"
		}],
		["path", {
			d: "M15 20v-3.5a2.5 2.5 0 0 1 5 0V20",
			key: "r6l5cz"
		}],
		["path", {
			d: "M20 18h-5",
			key: "18j1r2"
		}]
	]);
	const ArrowUp = createLucideIcon("ArrowUp", [["path", {
		d: "m5 12 7-7 7 7",
		key: "hav0vg"
	}], ["path", {
		d: "M12 19V5",
		key: "x0mq9r"
	}]]);
	const ArrowsUpFromLine = createLucideIcon("ArrowsUpFromLine", [
		["path", {
			d: "m4 6 3-3 3 3",
			key: "9aidw8"
		}],
		["path", {
			d: "M7 17V3",
			key: "19qxw1"
		}],
		["path", {
			d: "m14 6 3-3 3 3",
			key: "6iy689"
		}],
		["path", {
			d: "M17 17V3",
			key: "o0fmgi"
		}],
		["path", {
			d: "M4 21h16",
			key: "1h09gz"
		}]
	]);
	const Asterisk = createLucideIcon("Asterisk", [
		["path", {
			d: "M12 6v12",
			key: "1vza4d"
		}],
		["path", {
			d: "M17.196 9 6.804 15",
			key: "1ah31z"
		}],
		["path", {
			d: "m6.804 9 10.392 6",
			key: "1b6pxd"
		}]
	]);
	const AtSign = createLucideIcon("AtSign", [["circle", {
		cx: "12",
		cy: "12",
		r: "4",
		key: "4exip2"
	}], ["path", {
		d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8",
		key: "7n84p3"
	}]]);
	const Atom = createLucideIcon("Atom", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "1",
			key: "41hilf"
		}],
		["path", {
			d: "M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z",
			key: "1l2ple"
		}],
		["path", {
			d: "M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z",
			key: "1wam0m"
		}]
	]);
	const AudioLines = createLucideIcon("AudioLines", [
		["path", {
			d: "M2 10v3",
			key: "1fnikh"
		}],
		["path", {
			d: "M6 6v11",
			key: "11sgs0"
		}],
		["path", {
			d: "M10 3v18",
			key: "yhl04a"
		}],
		["path", {
			d: "M14 8v7",
			key: "3a1oy3"
		}],
		["path", {
			d: "M18 5v13",
			key: "123xd1"
		}],
		["path", {
			d: "M22 10v3",
			key: "154ddg"
		}]
	]);
	const AudioWaveform = createLucideIcon("AudioWaveform", [["path", {
		d: "M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2",
		key: "57tc96"
	}]]);
	const Award = createLucideIcon("Award", [["path", {
		d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
		key: "1yiouv"
	}], ["circle", {
		cx: "12",
		cy: "8",
		r: "6",
		key: "1vp47v"
	}]]);
	const Axe = createLucideIcon("Axe", [["path", {
		d: "m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9",
		key: "csbz4o"
	}], ["path", {
		d: "M15 13 9 7l4-4 6 6h3a8 8 0 0 1-7 7z",
		key: "113wfo"
	}]]);
	const Axis3d = createLucideIcon("Axis3d", [["path", {
		d: "M4 4v16h16",
		key: "1s015l"
	}], ["path", {
		d: "m4 20 7-7",
		key: "17qe9y"
	}]]);
	const Baby = createLucideIcon("Baby", [
		["path", {
			d: "M9 12h.01",
			key: "157uk2"
		}],
		["path", {
			d: "M15 12h.01",
			key: "1k8ypt"
		}],
		["path", {
			d: "M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5",
			key: "1u7htd"
		}],
		["path", {
			d: "M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1",
			key: "5yv0yz"
		}]
	]);
	const Backpack = createLucideIcon("Backpack", [
		["path", {
			d: "M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z",
			key: "1ol0lm"
		}],
		["path", {
			d: "M8 10h8",
			key: "c7uz4u"
		}],
		["path", {
			d: "M8 18h8",
			key: "1no2b1"
		}],
		["path", {
			d: "M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6",
			key: "1fr6do"
		}],
		["path", {
			d: "M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2",
			key: "donm21"
		}]
	]);
	const BadgeAlert = createLucideIcon("BadgeAlert", [
		["path", {
			d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
			key: "3c2336"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "8",
			y2: "12",
			key: "1pkeuh"
		}],
		["line", {
			x1: "12",
			x2: "12.01",
			y1: "16",
			y2: "16",
			key: "4dfq90"
		}]
	]);
	const BadgeCent = createLucideIcon("BadgeCent", [
		["path", {
			d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
			key: "3c2336"
		}],
		["path", {
			d: "M12 7v10",
			key: "jspqdw"
		}],
		["path", {
			d: "M15.4 10a4 4 0 1 0 0 4",
			key: "2eqtx8"
		}]
	]);
	const BadgeCheck = createLucideIcon("BadgeCheck", [["path", {
		d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
		key: "3c2336"
	}], ["path", {
		d: "m9 12 2 2 4-4",
		key: "dzmm74"
	}]]);
	const BadgeDollarSign = createLucideIcon("BadgeDollarSign", [
		["path", {
			d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
			key: "3c2336"
		}],
		["path", {
			d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",
			key: "1h4pet"
		}],
		["path", {
			d: "M12 18V6",
			key: "zqpxq5"
		}]
	]);
	const BadgeEuro = createLucideIcon("BadgeEuro", [
		["path", {
			d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
			key: "3c2336"
		}],
		["path", {
			d: "M7 12h5",
			key: "gblrwe"
		}],
		["path", {
			d: "M15 9.4a4 4 0 1 0 0 5.2",
			key: "1makmb"
		}]
	]);
	const BadgeHelp = createLucideIcon("BadgeHelp", [
		["path", {
			d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
			key: "3c2336"
		}],
		["path", {
			d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
			key: "1u773s"
		}],
		["line", {
			x1: "12",
			x2: "12.01",
			y1: "17",
			y2: "17",
			key: "io3f8k"
		}]
	]);
	const BadgeIndianRupee = createLucideIcon("BadgeIndianRupee", [
		["path", {
			d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
			key: "3c2336"
		}],
		["path", {
			d: "M8 8h8",
			key: "1bis0t"
		}],
		["path", {
			d: "M8 12h8",
			key: "1wcyev"
		}],
		["path", {
			d: "m13 17-5-1h1a4 4 0 0 0 0-8",
			key: "nu2bwa"
		}]
	]);
	const BadgeInfo = createLucideIcon("BadgeInfo", [
		["path", {
			d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
			key: "3c2336"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "16",
			y2: "12",
			key: "1y1yb1"
		}],
		["line", {
			x1: "12",
			x2: "12.01",
			y1: "8",
			y2: "8",
			key: "110wyk"
		}]
	]);
	const BadgeJapaneseYen = createLucideIcon("BadgeJapaneseYen", [
		["path", {
			d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
			key: "3c2336"
		}],
		["path", {
			d: "m9 8 3 3v7",
			key: "17yadx"
		}],
		["path", {
			d: "m12 11 3-3",
			key: "p4cfq1"
		}],
		["path", {
			d: "M9 12h6",
			key: "1c52cq"
		}],
		["path", {
			d: "M9 16h6",
			key: "8wimt3"
		}]
	]);
	const BadgeMinus = createLucideIcon("BadgeMinus", [["path", {
		d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
		key: "3c2336"
	}], ["line", {
		x1: "8",
		x2: "16",
		y1: "12",
		y2: "12",
		key: "1jonct"
	}]]);
	const BadgePercent = createLucideIcon("BadgePercent", [
		["path", {
			d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
			key: "3c2336"
		}],
		["path", {
			d: "m15 9-6 6",
			key: "1uzhvr"
		}],
		["path", {
			d: "M9 9h.01",
			key: "1q5me6"
		}],
		["path", {
			d: "M15 15h.01",
			key: "lqbp3k"
		}]
	]);
	const BadgePlus = createLucideIcon("BadgePlus", [
		["path", {
			d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
			key: "3c2336"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "8",
			y2: "16",
			key: "10p56q"
		}],
		["line", {
			x1: "8",
			x2: "16",
			y1: "12",
			y2: "12",
			key: "1jonct"
		}]
	]);
	const BadgePoundSterling = createLucideIcon("BadgePoundSterling", [
		["path", {
			d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
			key: "3c2336"
		}],
		["path", {
			d: "M8 12h4",
			key: "qz6y1c"
		}],
		["path", {
			d: "M10 16V9.5a2.5 2.5 0 0 1 5 0",
			key: "3mlbjk"
		}],
		["path", {
			d: "M8 16h7",
			key: "sbedsn"
		}]
	]);
	const BadgeRussianRuble = createLucideIcon("BadgeRussianRuble", [
		["path", {
			d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
			key: "3c2336"
		}],
		["path", {
			d: "M9 16h5",
			key: "1syiyw"
		}],
		["path", {
			d: "M9 12h5a2 2 0 1 0 0-4h-3v9",
			key: "1ge9c1"
		}]
	]);
	const BadgeSwissFranc = createLucideIcon("BadgeSwissFranc", [
		["path", {
			d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
			key: "3c2336"
		}],
		["path", {
			d: "M11 17V8h4",
			key: "1bfq6y"
		}],
		["path", {
			d: "M11 12h3",
			key: "2eqnfz"
		}],
		["path", {
			d: "M9 16h4",
			key: "1skf3a"
		}]
	]);
	const BadgeX = createLucideIcon("BadgeX", [
		["path", {
			d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
			key: "3c2336"
		}],
		["line", {
			x1: "15",
			x2: "9",
			y1: "9",
			y2: "15",
			key: "f7djnv"
		}],
		["line", {
			x1: "9",
			x2: "15",
			y1: "9",
			y2: "15",
			key: "1shsy8"
		}]
	]);
	const Badge = createLucideIcon("Badge", [["path", {
		d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
		key: "3c2336"
	}]]);
	const BaggageClaim = createLucideIcon("BaggageClaim", [
		["path", {
			d: "M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2",
			key: "4irg2o"
		}],
		["path", {
			d: "M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10",
			key: "14fcyx"
		}],
		["rect", {
			width: "13",
			height: "8",
			x: "8",
			y: "6",
			rx: "1",
			key: "o6oiis"
		}],
		["circle", {
			cx: "18",
			cy: "20",
			r: "2",
			key: "t9985n"
		}],
		["circle", {
			cx: "9",
			cy: "20",
			r: "2",
			key: "e5v82j"
		}]
	]);
	const Ban = createLucideIcon("Ban", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "m4.9 4.9 14.2 14.2",
		key: "1m5liu"
	}]]);
	const Banana = createLucideIcon("Banana", [["path", {
		d: "M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5",
		key: "1cscit"
	}], ["path", {
		d: "M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 6.5-4.2 12-10.49 12C5.11 22 2 22 2 20c0-1.5 1.14-1.55 3.15-2.11Z",
		key: "1y1nbv"
	}]]);
	const Bandage = createLucideIcon("Bandage", [
		["path", {
			d: "M10 10.01h.01",
			key: "1e9xi7"
		}],
		["path", {
			d: "M10 14.01h.01",
			key: "ac23bv"
		}],
		["path", {
			d: "M14 10.01h.01",
			key: "2wfrvf"
		}],
		["path", {
			d: "M14 14.01h.01",
			key: "8tw8yn"
		}],
		["path", {
			d: "M18 6v11.5",
			key: "dkbidh"
		}],
		["path", {
			d: "M6 6v12",
			key: "vkc79e"
		}],
		["rect", {
			x: "2",
			y: "6",
			width: "20",
			height: "12",
			rx: "2",
			key: "1wpnh2"
		}]
	]);
	const Banknote = createLucideIcon("Banknote", [
		["rect", {
			width: "20",
			height: "12",
			x: "2",
			y: "6",
			rx: "2",
			key: "9lu3g6"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "2",
			key: "1c9p78"
		}],
		["path", {
			d: "M6 12h.01M18 12h.01",
			key: "113zkx"
		}]
	]);
	const Barcode = createLucideIcon("Barcode", [
		["path", {
			d: "M3 5v14",
			key: "1nt18q"
		}],
		["path", {
			d: "M8 5v14",
			key: "1ybrkv"
		}],
		["path", {
			d: "M12 5v14",
			key: "s699le"
		}],
		["path", {
			d: "M17 5v14",
			key: "ycjyhj"
		}],
		["path", {
			d: "M21 5v14",
			key: "nzette"
		}]
	]);
	const Baseline = createLucideIcon("Baseline", [
		["path", {
			d: "M4 20h16",
			key: "14thso"
		}],
		["path", {
			d: "m6 16 6-12 6 12",
			key: "1b4byz"
		}],
		["path", {
			d: "M8 12h8",
			key: "1wcyev"
		}]
	]);
	const Bath = createLucideIcon("Bath", [
		["path", {
			d: "M10 4 8 6",
			key: "1rru8s"
		}],
		["path", {
			d: "M17 19v2",
			key: "ts1sot"
		}],
		["path", {
			d: "M2 12h20",
			key: "9i4pu4"
		}],
		["path", {
			d: "M7 19v2",
			key: "12npes"
		}],
		["path", {
			d: "M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5",
			key: "14ym8i"
		}]
	]);
	const BatteryCharging = createLucideIcon("BatteryCharging", [
		["path", {
			d: "M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2",
			key: "1sdynx"
		}],
		["path", {
			d: "M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1",
			key: "1gkd3k"
		}],
		["path", {
			d: "m11 7-3 5h4l-3 5",
			key: "b4a64w"
		}],
		["line", {
			x1: "22",
			x2: "22",
			y1: "11",
			y2: "13",
			key: "4dh1rd"
		}]
	]);
	const BatteryFull = createLucideIcon("BatteryFull", [
		["rect", {
			width: "16",
			height: "10",
			x: "2",
			y: "7",
			rx: "2",
			ry: "2",
			key: "1w10f2"
		}],
		["line", {
			x1: "22",
			x2: "22",
			y1: "11",
			y2: "13",
			key: "4dh1rd"
		}],
		["line", {
			x1: "6",
			x2: "6",
			y1: "11",
			y2: "13",
			key: "1wd6dw"
		}],
		["line", {
			x1: "10",
			x2: "10",
			y1: "11",
			y2: "13",
			key: "haxvl5"
		}],
		["line", {
			x1: "14",
			x2: "14",
			y1: "11",
			y2: "13",
			key: "c6fn6x"
		}]
	]);
	const BatteryLow = createLucideIcon("BatteryLow", [
		["rect", {
			width: "16",
			height: "10",
			x: "2",
			y: "7",
			rx: "2",
			ry: "2",
			key: "1w10f2"
		}],
		["line", {
			x1: "22",
			x2: "22",
			y1: "11",
			y2: "13",
			key: "4dh1rd"
		}],
		["line", {
			x1: "6",
			x2: "6",
			y1: "11",
			y2: "13",
			key: "1wd6dw"
		}]
	]);
	const BatteryMedium = createLucideIcon("BatteryMedium", [
		["rect", {
			width: "16",
			height: "10",
			x: "2",
			y: "7",
			rx: "2",
			ry: "2",
			key: "1w10f2"
		}],
		["line", {
			x1: "22",
			x2: "22",
			y1: "11",
			y2: "13",
			key: "4dh1rd"
		}],
		["line", {
			x1: "6",
			x2: "6",
			y1: "11",
			y2: "13",
			key: "1wd6dw"
		}],
		["line", {
			x1: "10",
			x2: "10",
			y1: "11",
			y2: "13",
			key: "haxvl5"
		}]
	]);
	const BatteryWarning = createLucideIcon("BatteryWarning", [
		["path", {
			d: "M10 17h.01",
			key: "nbq80n"
		}],
		["path", {
			d: "M10 7v6",
			key: "nne03l"
		}],
		["path", {
			d: "M14 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2",
			key: "1x5o8m"
		}],
		["path", {
			d: "M22 11v2",
			key: "1wo06k"
		}],
		["path", {
			d: "M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",
			key: "1mdjgh"
		}]
	]);
	const Battery = createLucideIcon("Battery", [["rect", {
		width: "16",
		height: "10",
		x: "2",
		y: "7",
		rx: "2",
		ry: "2",
		key: "1w10f2"
	}], ["line", {
		x1: "22",
		x2: "22",
		y1: "11",
		y2: "13",
		key: "4dh1rd"
	}]]);
	const Beaker = createLucideIcon("Beaker", [
		["path", {
			d: "M4.5 3h15",
			key: "c7n0jr"
		}],
		["path", {
			d: "M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3",
			key: "m1uhx7"
		}],
		["path", {
			d: "M6 14h12",
			key: "4cwo0f"
		}]
	]);
	const BeanOff = createLucideIcon("BeanOff", [
		["path", {
			d: "M9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22a13.96 13.96 0 0 0 9.9-4.1",
			key: "bq3udt"
		}],
		["path", {
			d: "M10.75 5.093A6 6 0 0 1 22 8c0 2.411-.61 4.68-1.683 6.66",
			key: "17ccse"
		}],
		["path", {
			d: "M5.341 10.62a4 4 0 0 0 6.487 1.208M10.62 5.341a4.015 4.015 0 0 1 2.039 2.04",
			key: "18zqgq"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Bean = createLucideIcon("Bean", [["path", {
		d: "M10.165 6.598C9.954 7.478 9.64 8.36 9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22c7.732 0 14-6.268 14-14a6 6 0 0 0-11.835-1.402Z",
		key: "1tvzk7"
	}], ["path", {
		d: "M5.341 10.62a4 4 0 1 0 5.279-5.28",
		key: "2cyri2"
	}]]);
	const BedDouble = createLucideIcon("BedDouble", [
		["path", {
			d: "M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8",
			key: "1k78r4"
		}],
		["path", {
			d: "M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4",
			key: "fb3tl2"
		}],
		["path", {
			d: "M12 4v6",
			key: "1dcgq2"
		}],
		["path", {
			d: "M2 18h20",
			key: "ajqnye"
		}]
	]);
	const BedSingle = createLucideIcon("BedSingle", [
		["path", {
			d: "M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8",
			key: "1wm6mi"
		}],
		["path", {
			d: "M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4",
			key: "4k93s5"
		}],
		["path", {
			d: "M3 18h18",
			key: "1h113x"
		}]
	]);
	const Bed = createLucideIcon("Bed", [
		["path", {
			d: "M2 4v16",
			key: "vw9hq8"
		}],
		["path", {
			d: "M2 8h18a2 2 0 0 1 2 2v10",
			key: "1dgv2r"
		}],
		["path", {
			d: "M2 17h20",
			key: "18nfp3"
		}],
		["path", {
			d: "M6 8v9",
			key: "1yriud"
		}]
	]);
	const Beef = createLucideIcon("Beef", [
		["circle", {
			cx: "12.5",
			cy: "8.5",
			r: "2.5",
			key: "9738u8"
		}],
		["path", {
			d: "M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z",
			key: "o0f6za"
		}],
		["path", {
			d: "m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5",
			key: "k7p6i0"
		}]
	]);
	const BeerOff = createLucideIcon("BeerOff", [
		["path", {
			d: "M13 13v5",
			key: "igwfh0"
		}],
		["path", {
			d: "M17 11.47V8",
			key: "16yw0g"
		}],
		["path", {
			d: "M17 11h1a3 3 0 0 1 2.745 4.211",
			key: "1xbt65"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3",
			key: "c55o3e"
		}],
		["path", {
			d: "M7.536 7.535C6.766 7.649 6.154 8 5.5 8a2.5 2.5 0 0 1-1.768-4.268",
			key: "1ydug7"
		}],
		["path", {
			d: "M8.727 3.204C9.306 2.767 9.885 2 11 2c1.56 0 2 1.5 3 1.5s1.72-.5 2.5-.5a1 1 0 1 1 0 5c-.78 0-1.5-.5-2.5-.5a3.149 3.149 0 0 0-.842.12",
			key: "q81o7q"
		}],
		["path", {
			d: "M9 14.6V18",
			key: "20ek98"
		}]
	]);
	const Beer = createLucideIcon("Beer", [
		["path", {
			d: "M17 11h1a3 3 0 0 1 0 6h-1",
			key: "1yp76v"
		}],
		["path", {
			d: "M9 12v6",
			key: "1u1cab"
		}],
		["path", {
			d: "M13 12v6",
			key: "1sugkk"
		}],
		["path", {
			d: "M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z",
			key: "1510fo"
		}],
		["path", {
			d: "M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8",
			key: "19jb7n"
		}]
	]);
	const BellDot = createLucideIcon("BellDot", [
		["path", {
			d: "M10.268 21a2 2 0 0 0 3.464 0",
			key: "vwvbt9"
		}],
		["path", {
			d: "M13.916 2.314A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673 9 9 0 0 1-.585-.665",
			key: "1tip0g"
		}],
		["circle", {
			cx: "18",
			cy: "8",
			r: "3",
			key: "1g0gzu"
		}]
	]);
	const BellElectric = createLucideIcon("BellElectric", [
		["path", {
			d: "M18.8 4A6.3 8.7 0 0 1 20 9",
			key: "xve1fh"
		}],
		["path", {
			d: "M9 9h.01",
			key: "1q5me6"
		}],
		["circle", {
			cx: "9",
			cy: "9",
			r: "7",
			key: "p2h5vp"
		}],
		["rect", {
			width: "10",
			height: "6",
			x: "4",
			y: "16",
			rx: "2",
			key: "17f3te"
		}],
		["path", {
			d: "M14 19c3 0 4.6-1.6 4.6-1.6",
			key: "n7odp6"
		}],
		["circle", {
			cx: "20",
			cy: "16",
			r: "2",
			key: "1v9bxh"
		}]
	]);
	const BellMinus = createLucideIcon("BellMinus", [
		["path", {
			d: "M10.268 21a2 2 0 0 0 3.464 0",
			key: "vwvbt9"
		}],
		["path", {
			d: "M15 8h6",
			key: "8ybuxh"
		}],
		["path", {
			d: "M16.243 3.757A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673A9.4 9.4 0 0 1 18.667 12",
			key: "bdwj86"
		}]
	]);
	const BellOff = createLucideIcon("BellOff", [
		["path", {
			d: "M10.268 21a2 2 0 0 0 3.464 0",
			key: "vwvbt9"
		}],
		["path", {
			d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
			key: "178tsu"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05",
			key: "1hqiys"
		}]
	]);
	const BellPlus = createLucideIcon("BellPlus", [
		["path", {
			d: "M10.268 21a2 2 0 0 0 3.464 0",
			key: "vwvbt9"
		}],
		["path", {
			d: "M15 8h6",
			key: "8ybuxh"
		}],
		["path", {
			d: "M18 5v6",
			key: "g5ayrv"
		}],
		["path", {
			d: "M20.002 14.464a9 9 0 0 0 .738.863A1 1 0 0 1 20 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 8.75-5.332",
			key: "1abcvy"
		}]
	]);
	const BellRing = createLucideIcon("BellRing", [
		["path", {
			d: "M10.268 21a2 2 0 0 0 3.464 0",
			key: "vwvbt9"
		}],
		["path", {
			d: "M22 8c0-2.3-.8-4.3-2-6",
			key: "5bb3ad"
		}],
		["path", {
			d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
			key: "11g9vi"
		}],
		["path", {
			d: "M4 2C2.8 3.7 2 5.7 2 8",
			key: "tap9e0"
		}]
	]);
	const Bell = createLucideIcon("Bell", [["path", {
		d: "M10.268 21a2 2 0 0 0 3.464 0",
		key: "vwvbt9"
	}], ["path", {
		d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
		key: "11g9vi"
	}]]);
	const BetweenHorizontalEnd = createLucideIcon("BetweenHorizontalEnd", [
		["rect", {
			width: "13",
			height: "7",
			x: "3",
			y: "3",
			rx: "1",
			key: "11xb64"
		}],
		["path", {
			d: "m22 15-3-3 3-3",
			key: "26chmm"
		}],
		["rect", {
			width: "13",
			height: "7",
			x: "3",
			y: "14",
			rx: "1",
			key: "k6ky7n"
		}]
	]);
	const BetweenHorizontalStart = createLucideIcon("BetweenHorizontalStart", [
		["rect", {
			width: "13",
			height: "7",
			x: "8",
			y: "3",
			rx: "1",
			key: "pkso9a"
		}],
		["path", {
			d: "m2 9 3 3-3 3",
			key: "1agib5"
		}],
		["rect", {
			width: "13",
			height: "7",
			x: "8",
			y: "14",
			rx: "1",
			key: "1q5fc1"
		}]
	]);
	const BetweenVerticalEnd = createLucideIcon("BetweenVerticalEnd", [
		["rect", {
			width: "7",
			height: "13",
			x: "3",
			y: "3",
			rx: "1",
			key: "1fdu0f"
		}],
		["path", {
			d: "m9 22 3-3 3 3",
			key: "17z65a"
		}],
		["rect", {
			width: "7",
			height: "13",
			x: "14",
			y: "3",
			rx: "1",
			key: "1squn4"
		}]
	]);
	const BetweenVerticalStart = createLucideIcon("BetweenVerticalStart", [
		["rect", {
			width: "7",
			height: "13",
			x: "3",
			y: "8",
			rx: "1",
			key: "1fjrkv"
		}],
		["path", {
			d: "m15 2-3 3-3-3",
			key: "1uh6eb"
		}],
		["rect", {
			width: "7",
			height: "13",
			x: "14",
			y: "8",
			rx: "1",
			key: "w3fjg8"
		}]
	]);
	const BicepsFlexed = createLucideIcon("BicepsFlexed", [
		["path", {
			d: "M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1",
			key: "1pmlyh"
		}],
		["path", {
			d: "M15 14a5 5 0 0 0-7.584 2",
			key: "5rb254"
		}],
		["path", {
			d: "M9.964 6.825C8.019 7.977 9.5 13 8 15",
			key: "kbvsx9"
		}]
	]);
	const Bike = createLucideIcon("Bike", [
		["circle", {
			cx: "18.5",
			cy: "17.5",
			r: "3.5",
			key: "15x4ox"
		}],
		["circle", {
			cx: "5.5",
			cy: "17.5",
			r: "3.5",
			key: "1noe27"
		}],
		["circle", {
			cx: "15",
			cy: "5",
			r: "1",
			key: "19l28e"
		}],
		["path", {
			d: "M12 17.5V14l-3-3 4-3 2 3h2",
			key: "1npguv"
		}]
	]);
	const Binary = createLucideIcon("Binary", [
		["rect", {
			x: "14",
			y: "14",
			width: "4",
			height: "6",
			rx: "2",
			key: "p02svl"
		}],
		["rect", {
			x: "6",
			y: "4",
			width: "4",
			height: "6",
			rx: "2",
			key: "xm4xkj"
		}],
		["path", {
			d: "M6 20h4",
			key: "1i6q5t"
		}],
		["path", {
			d: "M14 10h4",
			key: "ru81e7"
		}],
		["path", {
			d: "M6 14h2v6",
			key: "16z9wg"
		}],
		["path", {
			d: "M14 4h2v6",
			key: "1idq9u"
		}]
	]);
	const Binoculars = createLucideIcon("Binoculars", [
		["path", {
			d: "M10 10h4",
			key: "tcdvrf"
		}],
		["path", {
			d: "M19 7V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3",
			key: "3apit1"
		}],
		["path", {
			d: "M20 21a2 2 0 0 0 2-2v-3.851c0-1.39-2-2.962-2-4.829V8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2z",
			key: "rhpgnw"
		}],
		["path", {
			d: "M 22 16 L 2 16",
			key: "14lkq7"
		}],
		["path", {
			d: "M4 21a2 2 0 0 1-2-2v-3.851c0-1.39 2-2.962 2-4.829V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2z",
			key: "104b3k"
		}],
		["path", {
			d: "M9 7V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3",
			key: "14fczp"
		}]
	]);
	const Biohazard = createLucideIcon("Biohazard", [
		["circle", {
			cx: "12",
			cy: "11.9",
			r: "2",
			key: "e8h31w"
		}],
		["path", {
			d: "M6.7 3.4c-.9 2.5 0 5.2 2.2 6.7C6.5 9 3.7 9.6 2 11.6",
			key: "17bolr"
		}],
		["path", {
			d: "m8.9 10.1 1.4.8",
			key: "15ezny"
		}],
		["path", {
			d: "M17.3 3.4c.9 2.5 0 5.2-2.2 6.7 2.4-1.2 5.2-.6 6.9 1.5",
			key: "wtwa5u"
		}],
		["path", {
			d: "m15.1 10.1-1.4.8",
			key: "1r0b28"
		}],
		["path", {
			d: "M16.7 20.8c-2.6-.4-4.6-2.6-4.7-5.3-.2 2.6-2.1 4.8-4.7 5.2",
			key: "m7qszh"
		}],
		["path", {
			d: "M12 13.9v1.6",
			key: "zfyyim"
		}],
		["path", {
			d: "M13.5 5.4c-1-.2-2-.2-3 0",
			key: "1bi9q0"
		}],
		["path", {
			d: "M17 16.4c.7-.7 1.2-1.6 1.5-2.5",
			key: "1rhjqw"
		}],
		["path", {
			d: "M5.5 13.9c.3.9.8 1.8 1.5 2.5",
			key: "8gsud3"
		}]
	]);
	const Bird = createLucideIcon("Bird", [
		["path", {
			d: "M16 7h.01",
			key: "1kdx03"
		}],
		["path", {
			d: "M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20",
			key: "oj1oa8"
		}],
		["path", {
			d: "m20 7 2 .5-2 .5",
			key: "12nv4d"
		}],
		["path", {
			d: "M10 18v3",
			key: "1yea0a"
		}],
		["path", {
			d: "M14 17.75V21",
			key: "1pymcb"
		}],
		["path", {
			d: "M7 18a6 6 0 0 0 3.84-10.61",
			key: "1npnn0"
		}]
	]);
	const Bitcoin = createLucideIcon("Bitcoin", [["path", {
		d: "M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727",
		key: "yr8idg"
	}]]);
	const Blend = createLucideIcon("Blend", [["circle", {
		cx: "9",
		cy: "9",
		r: "7",
		key: "p2h5vp"
	}], ["circle", {
		cx: "15",
		cy: "15",
		r: "7",
		key: "19ennj"
	}]]);
	const Blinds = createLucideIcon("Blinds", [
		["path", {
			d: "M3 3h18",
			key: "o7r712"
		}],
		["path", {
			d: "M20 7H8",
			key: "gd2fo2"
		}],
		["path", {
			d: "M20 11H8",
			key: "1ynp89"
		}],
		["path", {
			d: "M10 19h10",
			key: "19hjk5"
		}],
		["path", {
			d: "M8 15h12",
			key: "1yqzne"
		}],
		["path", {
			d: "M4 3v14",
			key: "fggqzn"
		}],
		["circle", {
			cx: "4",
			cy: "19",
			r: "2",
			key: "p3m9r0"
		}]
	]);
	const Blocks = createLucideIcon("Blocks", [["rect", {
		width: "7",
		height: "7",
		x: "14",
		y: "3",
		rx: "1",
		key: "6d4xhi"
	}], ["path", {
		d: "M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3",
		key: "1fpvtg"
	}]]);
	const BluetoothConnected = createLucideIcon("BluetoothConnected", [
		["path", {
			d: "m7 7 10 10-5 5V2l5 5L7 17",
			key: "1q5490"
		}],
		["line", {
			x1: "18",
			x2: "21",
			y1: "12",
			y2: "12",
			key: "1rsjjs"
		}],
		["line", {
			x1: "3",
			x2: "6",
			y1: "12",
			y2: "12",
			key: "11yl8c"
		}]
	]);
	const BluetoothOff = createLucideIcon("BluetoothOff", [
		["path", {
			d: "m17 17-5 5V12l-5 5",
			key: "v5aci6"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M14.5 9.5 17 7l-5-5v4.5",
			key: "1kddfz"
		}]
	]);
	const BluetoothSearching = createLucideIcon("BluetoothSearching", [
		["path", {
			d: "m7 7 10 10-5 5V2l5 5L7 17",
			key: "1q5490"
		}],
		["path", {
			d: "M20.83 14.83a4 4 0 0 0 0-5.66",
			key: "k8tn1j"
		}],
		["path", {
			d: "M18 12h.01",
			key: "yjnet6"
		}]
	]);
	const Bluetooth = createLucideIcon("Bluetooth", [["path", {
		d: "m7 7 10 10-5 5V2l5 5L7 17",
		key: "1q5490"
	}]]);
	const Bold = createLucideIcon("Bold", [["path", {
		d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8",
		key: "mg9rjx"
	}]]);
	const Bolt = createLucideIcon("Bolt", [["path", {
		d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
		key: "yt0hxn"
	}], ["circle", {
		cx: "12",
		cy: "12",
		r: "4",
		key: "4exip2"
	}]]);
	const Bomb = createLucideIcon("Bomb", [
		["circle", {
			cx: "11",
			cy: "13",
			r: "9",
			key: "hd149"
		}],
		["path", {
			d: "M14.35 4.65 16.3 2.7a2.41 2.41 0 0 1 3.4 0l1.6 1.6a2.4 2.4 0 0 1 0 3.4l-1.95 1.95",
			key: "jp4j1b"
		}],
		["path", {
			d: "m22 2-1.5 1.5",
			key: "ay92ug"
		}]
	]);
	const Bone = createLucideIcon("Bone", [["path", {
		d: "M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z",
		key: "w610uw"
	}]]);
	const BookA = createLucideIcon("BookA", [
		["path", {
			d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
			key: "k3hazp"
		}],
		["path", {
			d: "m8 13 4-7 4 7",
			key: "4rari8"
		}],
		["path", {
			d: "M9.1 11h5.7",
			key: "1gkovt"
		}]
	]);
	const BookAudio = createLucideIcon("BookAudio", [
		["path", {
			d: "M12 6v7",
			key: "1f6ttz"
		}],
		["path", {
			d: "M16 8v3",
			key: "gejaml"
		}],
		["path", {
			d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
			key: "k3hazp"
		}],
		["path", {
			d: "M8 8v3",
			key: "1qzp49"
		}]
	]);
	const BookCheck = createLucideIcon("BookCheck", [["path", {
		d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
		key: "k3hazp"
	}], ["path", {
		d: "m9 9.5 2 2 4-4",
		key: "1dth82"
	}]]);
	const BookCopy = createLucideIcon("BookCopy", [
		["path", {
			d: "M2 16V4a2 2 0 0 1 2-2h11",
			key: "spzkk5"
		}],
		["path", {
			d: "M22 18H11a2 2 0 1 0 0 4h10.5a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5H11a2 2 0 0 0-2 2v12",
			key: "1wz07i"
		}],
		["path", {
			d: "M5 14H4a2 2 0 1 0 0 4h1",
			key: "16gqf9"
		}]
	]);
	const BookDashed = createLucideIcon("BookDashed", [
		["path", {
			d: "M12 17h1.5",
			key: "1gkc67"
		}],
		["path", {
			d: "M12 22h1.5",
			key: "1my7sn"
		}],
		["path", {
			d: "M12 2h1.5",
			key: "19tvb7"
		}],
		["path", {
			d: "M17.5 22H19a1 1 0 0 0 1-1",
			key: "10akbh"
		}],
		["path", {
			d: "M17.5 2H19a1 1 0 0 1 1 1v1.5",
			key: "1vrfjs"
		}],
		["path", {
			d: "M20 14v3h-2.5",
			key: "1naeju"
		}],
		["path", {
			d: "M20 8.5V10",
			key: "1ctpfu"
		}],
		["path", {
			d: "M4 10V8.5",
			key: "1o3zg5"
		}],
		["path", {
			d: "M4 19.5V14",
			key: "ob81pf"
		}],
		["path", {
			d: "M4 4.5A2.5 2.5 0 0 1 6.5 2H8",
			key: "s8vcyb"
		}],
		["path", {
			d: "M8 22H6.5a1 1 0 0 1 0-5H8",
			key: "1cu73q"
		}]
	]);
	const BookDown = createLucideIcon("BookDown", [
		["path", {
			d: "M12 13V7",
			key: "h0r20n"
		}],
		["path", {
			d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
			key: "k3hazp"
		}],
		["path", {
			d: "m9 10 3 3 3-3",
			key: "zt5b4y"
		}]
	]);
	const BookHeadphones = createLucideIcon("BookHeadphones", [
		["path", {
			d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
			key: "k3hazp"
		}],
		["path", {
			d: "M8 12v-2a4 4 0 0 1 8 0v2",
			key: "1vsqkj"
		}],
		["circle", {
			cx: "15",
			cy: "12",
			r: "1",
			key: "1tmaij"
		}],
		["circle", {
			cx: "9",
			cy: "12",
			r: "1",
			key: "1vctgf"
		}]
	]);
	const BookHeart = createLucideIcon("BookHeart", [["path", {
		d: "M16 8.2A2.22 2.22 0 0 0 13.8 6c-.8 0-1.4.3-1.8.9-.4-.6-1-.9-1.8-.9A2.22 2.22 0 0 0 8 8.2c0 .6.3 1.2.7 1.6A226.652 226.652 0 0 0 12 13a404 404 0 0 0 3.3-3.1 2.413 2.413 0 0 0 .7-1.7",
		key: "1t75a8"
	}], ["path", {
		d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
		key: "k3hazp"
	}]]);
	const BookImage = createLucideIcon("BookImage", [
		["path", {
			d: "m20 13.7-2.1-2.1a2 2 0 0 0-2.8 0L9.7 17",
			key: "q6ojf0"
		}],
		["path", {
			d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
			key: "k3hazp"
		}],
		["circle", {
			cx: "10",
			cy: "8",
			r: "2",
			key: "2qkj4p"
		}]
	]);
	const BookKey = createLucideIcon("BookKey", [
		["path", {
			d: "m19 3 1 1",
			key: "ze14oc"
		}],
		["path", {
			d: "m20 2-4.5 4.5",
			key: "1sppr8"
		}],
		["path", {
			d: "M20 8v13a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
			key: "1ocbpn"
		}],
		["path", {
			d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H14",
			key: "1gfsgw"
		}],
		["circle", {
			cx: "14",
			cy: "8",
			r: "2",
			key: "u49eql"
		}]
	]);
	const BookLock = createLucideIcon("BookLock", [
		["path", {
			d: "M18 6V4a2 2 0 1 0-4 0v2",
			key: "1aquzs"
		}],
		["path", {
			d: "M20 15v6a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
			key: "1rkj32"
		}],
		["path", {
			d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10",
			key: "18wgow"
		}],
		["rect", {
			x: "12",
			y: "6",
			width: "8",
			height: "5",
			rx: "1",
			key: "73l30o"
		}]
	]);
	const BookMarked = createLucideIcon("BookMarked", [["path", {
		d: "M10 2v8l3-3 3 3V2",
		key: "sqw3rj"
	}], ["path", {
		d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
		key: "k3hazp"
	}]]);
	const BookMinus = createLucideIcon("BookMinus", [["path", {
		d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
		key: "k3hazp"
	}], ["path", {
		d: "M9 10h6",
		key: "9gxzsh"
	}]]);
	const BookOpenCheck = createLucideIcon("BookOpenCheck", [
		["path", {
			d: "M12 21V7",
			key: "gj6g52"
		}],
		["path", {
			d: "m16 12 2 2 4-4",
			key: "mdajum"
		}],
		["path", {
			d: "M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3",
			key: "8arnkb"
		}]
	]);
	const BookOpenText = createLucideIcon("BookOpenText", [
		["path", {
			d: "M12 7v14",
			key: "1akyts"
		}],
		["path", {
			d: "M16 12h2",
			key: "7q9ll5"
		}],
		["path", {
			d: "M16 8h2",
			key: "msurwy"
		}],
		["path", {
			d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
			key: "ruj8y"
		}],
		["path", {
			d: "M6 12h2",
			key: "32wvfc"
		}],
		["path", {
			d: "M6 8h2",
			key: "30oboj"
		}]
	]);
	const BookOpen = createLucideIcon("BookOpen", [["path", {
		d: "M12 7v14",
		key: "1akyts"
	}], ["path", {
		d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
		key: "ruj8y"
	}]]);
	const BookPlus = createLucideIcon("BookPlus", [
		["path", {
			d: "M12 7v6",
			key: "lw1j43"
		}],
		["path", {
			d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
			key: "k3hazp"
		}],
		["path", {
			d: "M9 10h6",
			key: "9gxzsh"
		}]
	]);
	const BookText = createLucideIcon("BookText", [
		["path", {
			d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
			key: "k3hazp"
		}],
		["path", {
			d: "M8 11h8",
			key: "vwpz6n"
		}],
		["path", {
			d: "M8 7h6",
			key: "1f0q6e"
		}]
	]);
	const BookType = createLucideIcon("BookType", [
		["path", {
			d: "M10 13h4",
			key: "ytezjc"
		}],
		["path", {
			d: "M12 6v7",
			key: "1f6ttz"
		}],
		["path", {
			d: "M16 8V6H8v2",
			key: "x8j6u4"
		}],
		["path", {
			d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
			key: "k3hazp"
		}]
	]);
	const BookUp2 = createLucideIcon("BookUp2", [
		["path", {
			d: "M12 13V7",
			key: "h0r20n"
		}],
		["path", {
			d: "M18 2h1a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
			key: "161d7n"
		}],
		["path", {
			d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2",
			key: "1lorq7"
		}],
		["path", {
			d: "m9 10 3-3 3 3",
			key: "11gsxs"
		}],
		["path", {
			d: "m9 5 3-3 3 3",
			key: "l8vdw6"
		}]
	]);
	const BookUp = createLucideIcon("BookUp", [
		["path", {
			d: "M12 13V7",
			key: "h0r20n"
		}],
		["path", {
			d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
			key: "k3hazp"
		}],
		["path", {
			d: "m9 10 3-3 3 3",
			key: "11gsxs"
		}]
	]);
	const BookUser = createLucideIcon("BookUser", [
		["path", {
			d: "M15 13a3 3 0 1 0-6 0",
			key: "10j68g"
		}],
		["path", {
			d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
			key: "k3hazp"
		}],
		["circle", {
			cx: "12",
			cy: "8",
			r: "2",
			key: "1822b1"
		}]
	]);
	const BookX = createLucideIcon("BookX", [
		["path", {
			d: "m14.5 7-5 5",
			key: "dy991v"
		}],
		["path", {
			d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
			key: "k3hazp"
		}],
		["path", {
			d: "m9.5 7 5 5",
			key: "s45iea"
		}]
	]);
	const Book = createLucideIcon("Book", [["path", {
		d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
		key: "k3hazp"
	}]]);
	const BookmarkCheck = createLucideIcon("BookmarkCheck", [["path", {
		d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z",
		key: "169p4p"
	}], ["path", {
		d: "m9 10 2 2 4-4",
		key: "1gnqz4"
	}]]);
	const BookmarkMinus = createLucideIcon("BookmarkMinus", [["path", {
		d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",
		key: "1fy3hk"
	}], ["line", {
		x1: "15",
		x2: "9",
		y1: "10",
		y2: "10",
		key: "1gty7f"
	}]]);
	const BookmarkPlus = createLucideIcon("BookmarkPlus", [
		["path", {
			d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",
			key: "1fy3hk"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "7",
			y2: "13",
			key: "1cppfj"
		}],
		["line", {
			x1: "15",
			x2: "9",
			y1: "10",
			y2: "10",
			key: "1gty7f"
		}]
	]);
	const BookmarkX = createLucideIcon("BookmarkX", [
		["path", {
			d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z",
			key: "169p4p"
		}],
		["path", {
			d: "m14.5 7.5-5 5",
			key: "3lb6iw"
		}],
		["path", {
			d: "m9.5 7.5 5 5",
			key: "ko136h"
		}]
	]);
	const Bookmark = createLucideIcon("Bookmark", [["path", {
		d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",
		key: "1fy3hk"
	}]]);
	const BoomBox = createLucideIcon("BoomBox", [
		["path", {
			d: "M4 9V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4",
			key: "vvzvr1"
		}],
		["path", {
			d: "M8 8v1",
			key: "xcqmfk"
		}],
		["path", {
			d: "M12 8v1",
			key: "1rj8u4"
		}],
		["path", {
			d: "M16 8v1",
			key: "1q12zr"
		}],
		["rect", {
			width: "20",
			height: "12",
			x: "2",
			y: "9",
			rx: "2",
			key: "igpb89"
		}],
		["circle", {
			cx: "8",
			cy: "15",
			r: "2",
			key: "fa4a8s"
		}],
		["circle", {
			cx: "16",
			cy: "15",
			r: "2",
			key: "14c3ya"
		}]
	]);
	const BotMessageSquare = createLucideIcon("BotMessageSquare", [
		["path", {
			d: "M12 6V2H8",
			key: "1155em"
		}],
		["path", {
			d: "m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z",
			key: "w2lp3e"
		}],
		["path", {
			d: "M2 12h2",
			key: "1t8f8n"
		}],
		["path", {
			d: "M9 11v2",
			key: "1ueba0"
		}],
		["path", {
			d: "M15 11v2",
			key: "i11awn"
		}],
		["path", {
			d: "M20 12h2",
			key: "1q8mjw"
		}]
	]);
	const BotOff = createLucideIcon("BotOff", [
		["path", {
			d: "M13.67 8H18a2 2 0 0 1 2 2v4.33",
			key: "7az073"
		}],
		["path", {
			d: "M2 14h2",
			key: "vft8re"
		}],
		["path", {
			d: "M20 14h2",
			key: "4cs60a"
		}],
		["path", {
			d: "M22 22 2 2",
			key: "1r8tn9"
		}],
		["path", {
			d: "M8 8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 1.414-.586",
			key: "s09a7a"
		}],
		["path", {
			d: "M9 13v2",
			key: "rq6x2g"
		}],
		["path", {
			d: "M9.67 4H12v2.33",
			key: "110xot"
		}]
	]);
	const Bot = createLucideIcon("Bot", [
		["path", {
			d: "M12 8V4H8",
			key: "hb8ula"
		}],
		["rect", {
			width: "16",
			height: "12",
			x: "4",
			y: "8",
			rx: "2",
			key: "enze0r"
		}],
		["path", {
			d: "M2 14h2",
			key: "vft8re"
		}],
		["path", {
			d: "M20 14h2",
			key: "4cs60a"
		}],
		["path", {
			d: "M15 13v2",
			key: "1xurst"
		}],
		["path", {
			d: "M9 13v2",
			key: "rq6x2g"
		}]
	]);
	const Box = createLucideIcon("Box", [
		["path", {
			d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
			key: "hh9hay"
		}],
		["path", {
			d: "m3.3 7 8.7 5 8.7-5",
			key: "g66t2b"
		}],
		["path", {
			d: "M12 22V12",
			key: "d0xqtd"
		}]
	]);
	const Boxes = createLucideIcon("Boxes", [
		["path", {
			d: "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",
			key: "lc1i9w"
		}],
		["path", {
			d: "m7 16.5-4.74-2.85",
			key: "1o9zyk"
		}],
		["path", {
			d: "m7 16.5 5-3",
			key: "va8pkn"
		}],
		["path", {
			d: "M7 16.5v5.17",
			key: "jnp8gn"
		}],
		["path", {
			d: "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",
			key: "8zsnat"
		}],
		["path", {
			d: "m17 16.5-5-3",
			key: "8arw3v"
		}],
		["path", {
			d: "m17 16.5 4.74-2.85",
			key: "8rfmw"
		}],
		["path", {
			d: "M17 16.5v5.17",
			key: "k6z78m"
		}],
		["path", {
			d: "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",
			key: "1xygjf"
		}],
		["path", {
			d: "M12 8 7.26 5.15",
			key: "1vbdud"
		}],
		["path", {
			d: "m12 8 4.74-2.85",
			key: "3rx089"
		}],
		["path", {
			d: "M12 13.5V8",
			key: "1io7kd"
		}]
	]);
	const Braces = createLucideIcon("Braces", [["path", {
		d: "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1",
		key: "ezmyqa"
	}], ["path", {
		d: "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",
		key: "e1hn23"
	}]]);
	const Brackets = createLucideIcon("Brackets", [["path", {
		d: "M16 3h3v18h-3",
		key: "1yor1f"
	}], ["path", {
		d: "M8 21H5V3h3",
		key: "1qrfwo"
	}]]);
	const BrainCircuit = createLucideIcon("BrainCircuit", [
		["path", {
			d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
			key: "l5xja"
		}],
		["path", {
			d: "M9 13a4.5 4.5 0 0 0 3-4",
			key: "10igwf"
		}],
		["path", {
			d: "M6.003 5.125A3 3 0 0 0 6.401 6.5",
			key: "105sqy"
		}],
		["path", {
			d: "M3.477 10.896a4 4 0 0 1 .585-.396",
			key: "ql3yin"
		}],
		["path", {
			d: "M6 18a4 4 0 0 1-1.967-.516",
			key: "2e4loj"
		}],
		["path", {
			d: "M12 13h4",
			key: "1ku699"
		}],
		["path", {
			d: "M12 18h6a2 2 0 0 1 2 2v1",
			key: "105ag5"
		}],
		["path", {
			d: "M12 8h8",
			key: "1lhi5i"
		}],
		["path", {
			d: "M16 8V5a2 2 0 0 1 2-2",
			key: "u6izg6"
		}],
		["circle", {
			cx: "16",
			cy: "13",
			r: ".5",
			key: "ry7gng"
		}],
		["circle", {
			cx: "18",
			cy: "3",
			r: ".5",
			key: "1aiba7"
		}],
		["circle", {
			cx: "20",
			cy: "21",
			r: ".5",
			key: "yhc1fs"
		}],
		["circle", {
			cx: "20",
			cy: "8",
			r: ".5",
			key: "1e43v0"
		}]
	]);
	const BrainCog = createLucideIcon("BrainCog", [
		["path", {
			d: "M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588 4 4 0 0 0 7.636 2.106 3.2 3.2 0 0 0 .164-.546c.028-.13.306-.13.335 0a3.2 3.2 0 0 0 .163.546 4 4 0 0 0 7.636-2.106 4 4 0 0 0 .556-6.588 4 4 0 0 0-2.526-5.77A3 3 0 1 0 12 5",
			key: "1kgmhc"
		}],
		["path", {
			d: "M17.599 6.5a3 3 0 0 0 .399-1.375",
			key: "tmeiqw"
		}],
		["path", {
			d: "M6.003 5.125A3 3 0 0 0 6.401 6.5",
			key: "105sqy"
		}],
		["path", {
			d: "M3.477 10.896a4 4 0 0 1 .585-.396",
			key: "ql3yin"
		}],
		["path", {
			d: "M19.938 10.5a4 4 0 0 1 .585.396",
			key: "1qfode"
		}],
		["path", {
			d: "M6 18a4 4 0 0 1-1.967-.516",
			key: "2e4loj"
		}],
		["path", {
			d: "M19.967 17.484A4 4 0 0 1 18 18",
			key: "159ez6"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "3",
			key: "1v7zrd"
		}],
		["path", {
			d: "m15.7 10.4-.9.4",
			key: "ayzo6p"
		}],
		["path", {
			d: "m9.2 13.2-.9.4",
			key: "1uzb3g"
		}],
		["path", {
			d: "m13.6 15.7-.4-.9",
			key: "11ifqf"
		}],
		["path", {
			d: "m10.8 9.2-.4-.9",
			key: "1pmk2v"
		}],
		["path", {
			d: "m15.7 13.5-.9-.4",
			key: "7ng02m"
		}],
		["path", {
			d: "m9.2 10.9-.9-.4",
			key: "1x66zd"
		}],
		["path", {
			d: "m10.5 15.7.4-.9",
			key: "3js94g"
		}],
		["path", {
			d: "m13.1 9.2.4-.9",
			key: "18n7mc"
		}]
	]);
	const Brain = createLucideIcon("Brain", [
		["path", {
			d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
			key: "l5xja"
		}],
		["path", {
			d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",
			key: "ep3f8r"
		}],
		["path", {
			d: "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4",
			key: "1p4c4q"
		}],
		["path", {
			d: "M17.599 6.5a3 3 0 0 0 .399-1.375",
			key: "tmeiqw"
		}],
		["path", {
			d: "M6.003 5.125A3 3 0 0 0 6.401 6.5",
			key: "105sqy"
		}],
		["path", {
			d: "M3.477 10.896a4 4 0 0 1 .585-.396",
			key: "ql3yin"
		}],
		["path", {
			d: "M19.938 10.5a4 4 0 0 1 .585.396",
			key: "1qfode"
		}],
		["path", {
			d: "M6 18a4 4 0 0 1-1.967-.516",
			key: "2e4loj"
		}],
		["path", {
			d: "M19.967 17.484A4 4 0 0 1 18 18",
			key: "159ez6"
		}]
	]);
	const BrickWall = createLucideIcon("BrickWall", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M12 9v6",
			key: "199k2o"
		}],
		["path", {
			d: "M16 15v6",
			key: "8rj2es"
		}],
		["path", {
			d: "M16 3v6",
			key: "1j6rpj"
		}],
		["path", {
			d: "M3 15h18",
			key: "5xshup"
		}],
		["path", {
			d: "M3 9h18",
			key: "1pudct"
		}],
		["path", {
			d: "M8 15v6",
			key: "1stoo3"
		}],
		["path", {
			d: "M8 3v6",
			key: "vlvjmk"
		}]
	]);
	const BriefcaseBusiness = createLucideIcon("BriefcaseBusiness", [
		["path", {
			d: "M12 12h.01",
			key: "1mp3jc"
		}],
		["path", {
			d: "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
			key: "1ksdt3"
		}],
		["path", {
			d: "M22 13a18.15 18.15 0 0 1-20 0",
			key: "12hx5q"
		}],
		["rect", {
			width: "20",
			height: "14",
			x: "2",
			y: "6",
			rx: "2",
			key: "i6l2r4"
		}]
	]);
	const BriefcaseConveyorBelt = createLucideIcon("BriefcaseConveyorBelt", [
		["path", {
			d: "M10 20v2",
			key: "1n8e1g"
		}],
		["path", {
			d: "M14 20v2",
			key: "1lq872"
		}],
		["path", {
			d: "M18 20v2",
			key: "10uadw"
		}],
		["path", {
			d: "M21 20H3",
			key: "kdqkdp"
		}],
		["path", {
			d: "M6 20v2",
			key: "a9bc87"
		}],
		["path", {
			d: "M8 16V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12",
			key: "17n9tx"
		}],
		["rect", {
			x: "4",
			y: "6",
			width: "16",
			height: "10",
			rx: "2",
			key: "1097i5"
		}]
	]);
	const BriefcaseMedical = createLucideIcon("BriefcaseMedical", [
		["path", {
			d: "M12 11v4",
			key: "a6ujw6"
		}],
		["path", {
			d: "M14 13h-4",
			key: "1pl8zg"
		}],
		["path", {
			d: "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
			key: "1ksdt3"
		}],
		["path", {
			d: "M18 6v14",
			key: "1mu4gy"
		}],
		["path", {
			d: "M6 6v14",
			key: "1s15cj"
		}],
		["rect", {
			width: "20",
			height: "14",
			x: "2",
			y: "6",
			rx: "2",
			key: "i6l2r4"
		}]
	]);
	const Briefcase = createLucideIcon("Briefcase", [["path", {
		d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
		key: "jecpp"
	}], ["rect", {
		width: "20",
		height: "14",
		x: "2",
		y: "6",
		rx: "2",
		key: "i6l2r4"
	}]]);
	const BringToFront = createLucideIcon("BringToFront", [
		["rect", {
			x: "8",
			y: "8",
			width: "8",
			height: "8",
			rx: "2",
			key: "yj20xf"
		}],
		["path", {
			d: "M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2",
			key: "1ltk23"
		}],
		["path", {
			d: "M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2",
			key: "1q24h9"
		}]
	]);
	const Brush = createLucideIcon("Brush", [["path", {
		d: "m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08",
		key: "1styjt"
	}], ["path", {
		d: "M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z",
		key: "z0l1mu"
	}]]);
	const BugOff = createLucideIcon("BugOff", [
		["path", {
			d: "M15 7.13V6a3 3 0 0 0-5.14-2.1L8 2",
			key: "vl8zik"
		}],
		["path", {
			d: "M14.12 3.88 16 2",
			key: "qol33r"
		}],
		["path", {
			d: "M22 13h-4v-2a4 4 0 0 0-4-4h-1.3",
			key: "1ou0bd"
		}],
		["path", {
			d: "M20.97 5c0 2.1-1.6 3.8-3.5 4",
			key: "18gb23"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M7.7 7.7A4 4 0 0 0 6 11v3a6 6 0 0 0 11.13 3.13",
			key: "1njkjs"
		}],
		["path", {
			d: "M12 20v-8",
			key: "i3yub9"
		}],
		["path", {
			d: "M6 13H2",
			key: "82j7cp"
		}],
		["path", {
			d: "M3 21c0-2.1 1.7-3.9 3.8-4",
			key: "4p0ekp"
		}]
	]);
	const BugPlay = createLucideIcon("BugPlay", [
		["path", {
			d: "M12.765 21.522a.5.5 0 0 1-.765-.424v-8.196a.5.5 0 0 1 .765-.424l5.878 3.674a1 1 0 0 1 0 1.696z",
			key: "17shqo"
		}],
		["path", {
			d: "M14.12 3.88 16 2",
			key: "qol33r"
		}],
		["path", {
			d: "M18 11a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v3a6.1 6.1 0 0 0 2 4.5",
			key: "1tjixy"
		}],
		["path", {
			d: "M20.97 5c0 2.1-1.6 3.8-3.5 4",
			key: "18gb23"
		}],
		["path", {
			d: "M3 21c0-2.1 1.7-3.9 3.8-4",
			key: "4p0ekp"
		}],
		["path", {
			d: "M6 13H2",
			key: "82j7cp"
		}],
		["path", {
			d: "M6.53 9C4.6 8.8 3 7.1 3 5",
			key: "32zzws"
		}],
		["path", {
			d: "m8 2 1.88 1.88",
			key: "fmnt4t"
		}],
		["path", {
			d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",
			key: "d7y7pr"
		}]
	]);
	const Bug = createLucideIcon("Bug", [
		["path", {
			d: "m8 2 1.88 1.88",
			key: "fmnt4t"
		}],
		["path", {
			d: "M14.12 3.88 16 2",
			key: "qol33r"
		}],
		["path", {
			d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",
			key: "d7y7pr"
		}],
		["path", {
			d: "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",
			key: "xs1cw7"
		}],
		["path", {
			d: "M12 20v-9",
			key: "1qisl0"
		}],
		["path", {
			d: "M6.53 9C4.6 8.8 3 7.1 3 5",
			key: "32zzws"
		}],
		["path", {
			d: "M6 13H2",
			key: "82j7cp"
		}],
		["path", {
			d: "M3 21c0-2.1 1.7-3.9 3.8-4",
			key: "4p0ekp"
		}],
		["path", {
			d: "M20.97 5c0 2.1-1.6 3.8-3.5 4",
			key: "18gb23"
		}],
		["path", {
			d: "M22 13h-4",
			key: "1jl80f"
		}],
		["path", {
			d: "M17.2 17c2.1.1 3.8 1.9 3.8 4",
			key: "k3fwyw"
		}]
	]);
	const Building2 = createLucideIcon("Building2", [
		["path", {
			d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",
			key: "1b4qmf"
		}],
		["path", {
			d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",
			key: "i71pzd"
		}],
		["path", {
			d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",
			key: "10jefs"
		}],
		["path", {
			d: "M10 6h4",
			key: "1itunk"
		}],
		["path", {
			d: "M10 10h4",
			key: "tcdvrf"
		}],
		["path", {
			d: "M10 14h4",
			key: "kelpxr"
		}],
		["path", {
			d: "M10 18h4",
			key: "1ulq68"
		}]
	]);
	const Building = createLucideIcon("Building", [
		["rect", {
			width: "16",
			height: "20",
			x: "4",
			y: "2",
			rx: "2",
			ry: "2",
			key: "76otgf"
		}],
		["path", {
			d: "M9 22v-4h6v4",
			key: "r93iot"
		}],
		["path", {
			d: "M8 6h.01",
			key: "1dz90k"
		}],
		["path", {
			d: "M16 6h.01",
			key: "1x0f13"
		}],
		["path", {
			d: "M12 6h.01",
			key: "1vi96p"
		}],
		["path", {
			d: "M12 10h.01",
			key: "1nrarc"
		}],
		["path", {
			d: "M12 14h.01",
			key: "1etili"
		}],
		["path", {
			d: "M16 10h.01",
			key: "1m94wz"
		}],
		["path", {
			d: "M16 14h.01",
			key: "1gbofw"
		}],
		["path", {
			d: "M8 10h.01",
			key: "19clt8"
		}],
		["path", {
			d: "M8 14h.01",
			key: "6423bh"
		}]
	]);
	const BusFront = createLucideIcon("BusFront", [
		["path", {
			d: "M4 6 2 7",
			key: "1mqr15"
		}],
		["path", {
			d: "M10 6h4",
			key: "1itunk"
		}],
		["path", {
			d: "m22 7-2-1",
			key: "1umjhc"
		}],
		["rect", {
			width: "16",
			height: "16",
			x: "4",
			y: "3",
			rx: "2",
			key: "1wxw4b"
		}],
		["path", {
			d: "M4 11h16",
			key: "mpoxn0"
		}],
		["path", {
			d: "M8 15h.01",
			key: "a7atzg"
		}],
		["path", {
			d: "M16 15h.01",
			key: "rnfrdf"
		}],
		["path", {
			d: "M6 19v2",
			key: "1loha6"
		}],
		["path", {
			d: "M18 21v-2",
			key: "sqyl04"
		}]
	]);
	const Bus = createLucideIcon("Bus", [
		["path", {
			d: "M8 6v6",
			key: "18i7km"
		}],
		["path", {
			d: "M15 6v6",
			key: "1sg6z9"
		}],
		["path", {
			d: "M2 12h19.6",
			key: "de5uta"
		}],
		["path", {
			d: "M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3",
			key: "1wwztk"
		}],
		["circle", {
			cx: "7",
			cy: "18",
			r: "2",
			key: "19iecd"
		}],
		["path", {
			d: "M9 18h5",
			key: "lrx6i"
		}],
		["circle", {
			cx: "16",
			cy: "18",
			r: "2",
			key: "1v4tcr"
		}]
	]);
	const CableCar = createLucideIcon("CableCar", [
		["path", {
			d: "M10 3h.01",
			key: "lbucoy"
		}],
		["path", {
			d: "M14 2h.01",
			key: "1k8aa1"
		}],
		["path", {
			d: "m2 9 20-5",
			key: "1kz0j5"
		}],
		["path", {
			d: "M12 12V6.5",
			key: "1vbrij"
		}],
		["rect", {
			width: "16",
			height: "10",
			x: "4",
			y: "12",
			rx: "3",
			key: "if91er"
		}],
		["path", {
			d: "M9 12v5",
			key: "3anwtq"
		}],
		["path", {
			d: "M15 12v5",
			key: "5xh3zn"
		}],
		["path", {
			d: "M4 17h16",
			key: "g4d7ey"
		}]
	]);
	const Cable = createLucideIcon("Cable", [
		["path", {
			d: "M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1",
			key: "10bnsj"
		}],
		["path", {
			d: "M19 15V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V9",
			key: "1eqmu1"
		}],
		["path", {
			d: "M21 21v-2h-4",
			key: "14zm7j"
		}],
		["path", {
			d: "M3 5h4V3",
			key: "z442eg"
		}],
		["path", {
			d: "M7 5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1V3",
			key: "ebdjd7"
		}]
	]);
	const CakeSlice = createLucideIcon("CakeSlice", [
		["circle", {
			cx: "9",
			cy: "7",
			r: "2",
			key: "1305pl"
		}],
		["path", {
			d: "M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6",
			key: "xle13f"
		}],
		["path", {
			d: "M16 13H3",
			key: "1wpj08"
		}],
		["path", {
			d: "M16 17H3",
			key: "3lvfcd"
		}]
	]);
	const Cake = createLucideIcon("Cake", [
		["path", {
			d: "M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8",
			key: "1w3rig"
		}],
		["path", {
			d: "M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1",
			key: "n2jgmb"
		}],
		["path", {
			d: "M2 21h20",
			key: "1nyx9w"
		}],
		["path", {
			d: "M7 8v3",
			key: "1qtyvj"
		}],
		["path", {
			d: "M12 8v3",
			key: "hwp4zt"
		}],
		["path", {
			d: "M17 8v3",
			key: "1i6e5u"
		}],
		["path", {
			d: "M7 4h.01",
			key: "1bh4kh"
		}],
		["path", {
			d: "M12 4h.01",
			key: "1ujb9j"
		}],
		["path", {
			d: "M17 4h.01",
			key: "1upcoc"
		}]
	]);
	const Calculator = createLucideIcon("Calculator", [
		["rect", {
			width: "16",
			height: "20",
			x: "4",
			y: "2",
			rx: "2",
			key: "1nb95v"
		}],
		["line", {
			x1: "8",
			x2: "16",
			y1: "6",
			y2: "6",
			key: "x4nwl0"
		}],
		["line", {
			x1: "16",
			x2: "16",
			y1: "14",
			y2: "18",
			key: "wjye3r"
		}],
		["path", {
			d: "M16 10h.01",
			key: "1m94wz"
		}],
		["path", {
			d: "M12 10h.01",
			key: "1nrarc"
		}],
		["path", {
			d: "M8 10h.01",
			key: "19clt8"
		}],
		["path", {
			d: "M12 14h.01",
			key: "1etili"
		}],
		["path", {
			d: "M8 14h.01",
			key: "6423bh"
		}],
		["path", {
			d: "M12 18h.01",
			key: "mhygvu"
		}],
		["path", {
			d: "M8 18h.01",
			key: "lrp35t"
		}]
	]);
	const Calendar1 = createLucideIcon("Calendar1", [
		["path", {
			d: "M11 14h1v4",
			key: "fy54vd"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["rect", {
			x: "3",
			y: "4",
			width: "18",
			height: "18",
			rx: "2",
			key: "12vinp"
		}]
	]);
	const CalendarArrowDown = createLucideIcon("CalendarArrowDown", [
		["path", {
			d: "m14 18 4 4 4-4",
			key: "1waygx"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "M18 14v8",
			key: "irew45"
		}],
		["path", {
			d: "M21 11.354V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.343",
			key: "bse4f3"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}]
	]);
	const CalendarArrowUp = createLucideIcon("CalendarArrowUp", [
		["path", {
			d: "m14 18 4-4 4 4",
			key: "ftkppy"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "M18 22v-8",
			key: "su0gjh"
		}],
		["path", {
			d: "M21 11.343V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9",
			key: "1exg90"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}]
	]);
	const CalendarCheck2 = createLucideIcon("CalendarCheck2", [
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8",
			key: "bce9hv"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "m16 20 2 2 4-4",
			key: "13tcca"
		}]
	]);
	const CalendarCheck = createLucideIcon("CalendarCheck", [
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "4",
			rx: "2",
			key: "1hopcy"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "m9 16 2 2 4-4",
			key: "19s6y9"
		}]
	]);
	const CalendarClock = createLucideIcon("CalendarClock", [
		["path", {
			d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5",
			key: "1osxxc"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M3 10h5",
			key: "r794hk"
		}],
		["path", {
			d: "M17.5 17.5 16 16.3V14",
			key: "akvzfd"
		}],
		["circle", {
			cx: "16",
			cy: "16",
			r: "6",
			key: "qoo3c4"
		}]
	]);
	const CalendarCog = createLucideIcon("CalendarCog", [
		["path", {
			d: "m15.2 16.9-.9-.4",
			key: "1r0w5f"
		}],
		["path", {
			d: "m15.2 19.1-.9.4",
			key: "j188fs"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "m16.9 15.2-.4-.9",
			key: "699xu"
		}],
		["path", {
			d: "m16.9 20.8-.4.9",
			key: "dfjc4z"
		}],
		["path", {
			d: "m19.5 14.3-.4.9",
			key: "1eb35c"
		}],
		["path", {
			d: "m19.5 21.7-.4-.9",
			key: "1tonu5"
		}],
		["path", {
			d: "M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6",
			key: "11kmuh"
		}],
		["path", {
			d: "m21.7 16.5-.9.4",
			key: "1knoei"
		}],
		["path", {
			d: "m21.7 19.5-.9-.4",
			key: "q4dx6b"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["circle", {
			cx: "18",
			cy: "18",
			r: "3",
			key: "1xkwt0"
		}]
	]);
	const CalendarDays = createLucideIcon("CalendarDays", [
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "4",
			rx: "2",
			key: "1hopcy"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "M8 14h.01",
			key: "6423bh"
		}],
		["path", {
			d: "M12 14h.01",
			key: "1etili"
		}],
		["path", {
			d: "M16 14h.01",
			key: "1gbofw"
		}],
		["path", {
			d: "M8 18h.01",
			key: "lrp35t"
		}],
		["path", {
			d: "M12 18h.01",
			key: "mhygvu"
		}],
		["path", {
			d: "M16 18h.01",
			key: "kzsmim"
		}]
	]);
	const CalendarFold = createLucideIcon("CalendarFold", [
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "M21 17V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11Z",
			key: "kg77oy"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "M15 22v-4a2 2 0 0 1 2-2h4",
			key: "1gnbqr"
		}]
	]);
	const CalendarHeart = createLucideIcon("CalendarHeart", [
		["path", {
			d: "M3 10h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7",
			key: "136lmk"
		}],
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z",
			key: "1t7hil"
		}]
	]);
	const CalendarMinus2 = createLucideIcon("CalendarMinus2", [
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "4",
			rx: "2",
			key: "1hopcy"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "M10 16h4",
			key: "17e571"
		}]
	]);
	const CalendarMinus = createLucideIcon("CalendarMinus", [
		["path", {
			d: "M16 19h6",
			key: "xwg31i"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5",
			key: "1scpom"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}]
	]);
	const CalendarOff = createLucideIcon("CalendarOff", [
		["path", {
			d: "M4.2 4.2A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18",
			key: "16swn3"
		}],
		["path", {
			d: "M21 15.5V6a2 2 0 0 0-2-2H9.5",
			key: "yhw86o"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "M3 10h7",
			key: "1wap6i"
		}],
		["path", {
			d: "M21 10h-5.5",
			key: "quycpq"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]);
	const CalendarPlus2 = createLucideIcon("CalendarPlus2", [
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "4",
			rx: "2",
			key: "1hopcy"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "M10 16h4",
			key: "17e571"
		}],
		["path", {
			d: "M12 14v4",
			key: "1thi36"
		}]
	]);
	const CalendarPlus = createLucideIcon("CalendarPlus", [
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8",
			key: "3spt84"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "M16 19h6",
			key: "xwg31i"
		}],
		["path", {
			d: "M19 16v6",
			key: "tddt3s"
		}]
	]);
	const CalendarRange = createLucideIcon("CalendarRange", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "4",
			rx: "2",
			key: "1hopcy"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M17 14h-6",
			key: "bkmgh3"
		}],
		["path", {
			d: "M13 18H7",
			key: "bb0bb7"
		}],
		["path", {
			d: "M7 14h.01",
			key: "1qa3f1"
		}],
		["path", {
			d: "M17 18h.01",
			key: "1bdyru"
		}]
	]);
	const CalendarSearch = createLucideIcon("CalendarSearch", [
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "M21 11.75V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.25",
			key: "1jrsq6"
		}],
		["path", {
			d: "m22 22-1.875-1.875",
			key: "13zax7"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["circle", {
			cx: "18",
			cy: "18",
			r: "3",
			key: "1xkwt0"
		}]
	]);
	const CalendarSync = createLucideIcon("CalendarSync", [
		["path", {
			d: "M11 10v4h4",
			key: "172dkj"
		}],
		["path", {
			d: "m11 14 1.535-1.605a5 5 0 0 1 8 1.5",
			key: "vu0qm5"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "m21 18-1.535 1.605a5 5 0 0 1-8-1.5",
			key: "1qgeyt"
		}],
		["path", {
			d: "M21 22v-4h-4",
			key: "hrummi"
		}],
		["path", {
			d: "M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3",
			key: "mctw84"
		}],
		["path", {
			d: "M3 10h4",
			key: "1el30a"
		}],
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}]
	]);
	const CalendarX2 = createLucideIcon("CalendarX2", [
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8",
			key: "3spt84"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "m17 22 5-5",
			key: "1k6ppv"
		}],
		["path", {
			d: "m17 17 5 5",
			key: "p7ous7"
		}]
	]);
	const CalendarX = createLucideIcon("CalendarX", [
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "4",
			rx: "2",
			key: "1hopcy"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}],
		["path", {
			d: "m14 14-4 4",
			key: "rymu2i"
		}],
		["path", {
			d: "m10 14 4 4",
			key: "3sz06r"
		}]
	]);
	const Calendar = createLucideIcon("Calendar", [
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "4",
			rx: "2",
			key: "1hopcy"
		}],
		["path", {
			d: "M3 10h18",
			key: "8toen8"
		}]
	]);
	const CameraOff = createLucideIcon("CameraOff", [
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}],
		["path", {
			d: "M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16",
			key: "qmtpty"
		}],
		["path", {
			d: "M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5",
			key: "1ufyfc"
		}],
		["path", {
			d: "M14.121 15.121A3 3 0 1 1 9.88 10.88",
			key: "11zox6"
		}]
	]);
	const Camera = createLucideIcon("Camera", [["path", {
		d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
		key: "1tc9qg"
	}], ["circle", {
		cx: "12",
		cy: "13",
		r: "3",
		key: "1vg3eu"
	}]]);
	const CandyCane = createLucideIcon("CandyCane", [
		["path", {
			d: "M5.7 21a2 2 0 0 1-3.5-2l8.6-14a6 6 0 0 1 10.4 6 2 2 0 1 1-3.464-2 2 2 0 1 0-3.464-2Z",
			key: "isaq8g"
		}],
		["path", {
			d: "M17.75 7 15 2.1",
			key: "12x7e8"
		}],
		["path", {
			d: "M10.9 4.8 13 9",
			key: "100a87"
		}],
		["path", {
			d: "m7.9 9.7 2 4.4",
			key: "ntfhaj"
		}],
		["path", {
			d: "M4.9 14.7 7 18.9",
			key: "1x43jy"
		}]
	]);
	const CandyOff = createLucideIcon("CandyOff", [
		["path", {
			d: "m8.5 8.5-1 1a4.95 4.95 0 0 0 7 7l1-1",
			key: "1ff4ui"
		}],
		["path", {
			d: "M11.843 6.187A4.947 4.947 0 0 1 16.5 7.5a4.947 4.947 0 0 1 1.313 4.657",
			key: "1sbrv4"
		}],
		["path", {
			d: "M14 16.5V14",
			key: "1maf8j"
		}],
		["path", {
			d: "M14 6.5v1.843",
			key: "1a6u6t"
		}],
		["path", {
			d: "M10 10v7.5",
			key: "80pj65"
		}],
		["path", {
			d: "m16 7 1-5 1.367.683A3 3 0 0 0 19.708 3H21v1.292a3 3 0 0 0 .317 1.341L22 7l-5 1",
			key: "11a9mt"
		}],
		["path", {
			d: "m8 17-1 5-1.367-.683A3 3 0 0 0 4.292 21H3v-1.292a3 3 0 0 0-.317-1.341L2 17l5-1",
			key: "3mjmon"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Candy = createLucideIcon("Candy", [
		["path", {
			d: "m9.5 7.5-2 2a4.95 4.95 0 1 0 7 7l2-2a4.95 4.95 0 1 0-7-7Z",
			key: "ue6khb"
		}],
		["path", {
			d: "M14 6.5v10",
			key: "5xnk7c"
		}],
		["path", {
			d: "M10 7.5v10",
			key: "1uew51"
		}],
		["path", {
			d: "m16 7 1-5 1.37.68A3 3 0 0 0 19.7 3H21v1.3c0 .46.1.92.32 1.33L22 7l-5 1",
			key: "b9cp6k"
		}],
		["path", {
			d: "m8 17-1 5-1.37-.68A3 3 0 0 0 4.3 21H3v-1.3a3 3 0 0 0-.32-1.33L2 17l5-1",
			key: "5lney8"
		}]
	]);
	const Cannabis = createLucideIcon("Cannabis", [["path", {
		d: "M12 22v-4",
		key: "1utk9m"
	}], ["path", {
		d: "M7 12c-1.5 0-4.5 1.5-5 3 3.5 1.5 6 1 6 1-1.5 1.5-2 3.5-2 5 2.5 0 4.5-1.5 6-3 1.5 1.5 3.5 3 6 3 0-1.5-.5-3.5-2-5 0 0 2.5.5 6-1-.5-1.5-3.5-3-5-3 1.5-1 4-4 4-6-2.5 0-5.5 1.5-7 3 0-2.5-.5-5-2-7-1.5 2-2 4.5-2 7-1.5-1.5-4.5-3-7-3 0 2 2.5 5 4 6",
		key: "1mezod"
	}]]);
	const CaptionsOff = createLucideIcon("CaptionsOff", [
		["path", {
			d: "M10.5 5H19a2 2 0 0 1 2 2v8.5",
			key: "jqtk4d"
		}],
		["path", {
			d: "M17 11h-.5",
			key: "1961ue"
		}],
		["path", {
			d: "M19 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2",
			key: "1keqsi"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M7 11h4",
			key: "1o1z6v"
		}],
		["path", {
			d: "M7 15h2.5",
			key: "1ina1g"
		}]
	]);
	const Captions = createLucideIcon("Captions", [["rect", {
		width: "18",
		height: "14",
		x: "3",
		y: "5",
		rx: "2",
		ry: "2",
		key: "12ruh7"
	}], ["path", {
		d: "M7 15h4M15 15h2M7 11h2M13 11h4",
		key: "1ueiar"
	}]]);
	const CarFront = createLucideIcon("CarFront", [
		["path", {
			d: "m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8",
			key: "1imjwt"
		}],
		["path", {
			d: "M7 14h.01",
			key: "1qa3f1"
		}],
		["path", {
			d: "M17 14h.01",
			key: "7oqj8z"
		}],
		["rect", {
			width: "18",
			height: "8",
			x: "3",
			y: "10",
			rx: "2",
			key: "a7itu8"
		}],
		["path", {
			d: "M5 18v2",
			key: "ppbyun"
		}],
		["path", {
			d: "M19 18v2",
			key: "gy7782"
		}]
	]);
	const CarTaxiFront = createLucideIcon("CarTaxiFront", [
		["path", {
			d: "M10 2h4",
			key: "n1abiw"
		}],
		["path", {
			d: "m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8",
			key: "1imjwt"
		}],
		["path", {
			d: "M7 14h.01",
			key: "1qa3f1"
		}],
		["path", {
			d: "M17 14h.01",
			key: "7oqj8z"
		}],
		["rect", {
			width: "18",
			height: "8",
			x: "3",
			y: "10",
			rx: "2",
			key: "a7itu8"
		}],
		["path", {
			d: "M5 18v2",
			key: "ppbyun"
		}],
		["path", {
			d: "M19 18v2",
			key: "gy7782"
		}]
	]);
	const Car = createLucideIcon("Car", [
		["path", {
			d: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",
			key: "5owen"
		}],
		["circle", {
			cx: "7",
			cy: "17",
			r: "2",
			key: "u2ysq9"
		}],
		["path", {
			d: "M9 17h6",
			key: "r8uit2"
		}],
		["circle", {
			cx: "17",
			cy: "17",
			r: "2",
			key: "axvx0g"
		}]
	]);
	const Caravan = createLucideIcon("Caravan", [
		["path", {
			d: "M18 19V9a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v8a2 2 0 0 0 2 2h2",
			key: "19jm3t"
		}],
		["path", {
			d: "M2 9h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2",
			key: "13hakp"
		}],
		["path", {
			d: "M22 17v1a1 1 0 0 1-1 1H10v-9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9",
			key: "1crci8"
		}],
		["circle", {
			cx: "8",
			cy: "19",
			r: "2",
			key: "t8fc5s"
		}]
	]);
	const Carrot = createLucideIcon("Carrot", [
		["path", {
			d: "M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46",
			key: "rfqxbe"
		}],
		["path", {
			d: "M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z",
			key: "6b25w4"
		}],
		["path", {
			d: "M15 2s-2 1.33-2 3.5S15 9 15 9s2-1.84 2-3.5C17 3.33 15 2 15 2z",
			key: "fn65lo"
		}]
	]);
	const CaseLower = createLucideIcon("CaseLower", [
		["circle", {
			cx: "7",
			cy: "12",
			r: "3",
			key: "12clwm"
		}],
		["path", {
			d: "M10 9v6",
			key: "17i7lo"
		}],
		["circle", {
			cx: "17",
			cy: "12",
			r: "3",
			key: "gl7c2s"
		}],
		["path", {
			d: "M14 7v8",
			key: "dl84cr"
		}]
	]);
	const CaseSensitive = createLucideIcon("CaseSensitive", [
		["path", {
			d: "m3 15 4-8 4 8",
			key: "1vwr6u"
		}],
		["path", {
			d: "M4 13h6",
			key: "1r9ots"
		}],
		["circle", {
			cx: "18",
			cy: "12",
			r: "3",
			key: "1kchzo"
		}],
		["path", {
			d: "M21 9v6",
			key: "anns31"
		}]
	]);
	const CaseUpper = createLucideIcon("CaseUpper", [
		["path", {
			d: "m3 15 4-8 4 8",
			key: "1vwr6u"
		}],
		["path", {
			d: "M4 13h6",
			key: "1r9ots"
		}],
		["path", {
			d: "M15 11h4.5a2 2 0 0 1 0 4H15V7h4a2 2 0 0 1 0 4",
			key: "1sqfas"
		}]
	]);
	const CassetteTape = createLucideIcon("CassetteTape", [
		["rect", {
			width: "20",
			height: "16",
			x: "2",
			y: "4",
			rx: "2",
			key: "18n3k1"
		}],
		["circle", {
			cx: "8",
			cy: "10",
			r: "2",
			key: "1xl4ub"
		}],
		["path", {
			d: "M8 12h8",
			key: "1wcyev"
		}],
		["circle", {
			cx: "16",
			cy: "10",
			r: "2",
			key: "r14t7q"
		}],
		["path", {
			d: "m6 20 .7-2.9A1.4 1.4 0 0 1 8.1 16h7.8a1.4 1.4 0 0 1 1.4 1l.7 3",
			key: "l01ucn"
		}]
	]);
	const Cast = createLucideIcon("Cast", [
		["path", {
			d: "M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6",
			key: "3zrzxg"
		}],
		["path", {
			d: "M2 12a9 9 0 0 1 8 8",
			key: "g6cvee"
		}],
		["path", {
			d: "M2 16a5 5 0 0 1 4 4",
			key: "1y1dii"
		}],
		["line", {
			x1: "2",
			x2: "2.01",
			y1: "20",
			y2: "20",
			key: "xu2jvo"
		}]
	]);
	const Castle = createLucideIcon("Castle", [
		["path", {
			d: "M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z",
			key: "109fe4"
		}],
		["path", {
			d: "M18 11V4H6v7",
			key: "mon5oj"
		}],
		["path", {
			d: "M15 22v-4a3 3 0 0 0-3-3a3 3 0 0 0-3 3v4",
			key: "1k4jtn"
		}],
		["path", {
			d: "M22 11V9",
			key: "3zbp94"
		}],
		["path", {
			d: "M2 11V9",
			key: "1x5rnq"
		}],
		["path", {
			d: "M6 4V2",
			key: "1rsq15"
		}],
		["path", {
			d: "M18 4V2",
			key: "1jsdo1"
		}],
		["path", {
			d: "M10 4V2",
			key: "75d9ly"
		}],
		["path", {
			d: "M14 4V2",
			key: "8nj3z6"
		}]
	]);
	const Cat = createLucideIcon("Cat", [
		["path", {
			d: "M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z",
			key: "x6xyqk"
		}],
		["path", {
			d: "M8 14v.5",
			key: "1nzgdb"
		}],
		["path", {
			d: "M16 14v.5",
			key: "1lajdz"
		}],
		["path", {
			d: "M11.25 16.25h1.5L12 17l-.75-.75Z",
			key: "12kq1m"
		}]
	]);
	const Cctv = createLucideIcon("Cctv", [
		["path", {
			d: "M16.75 12h3.632a1 1 0 0 1 .894 1.447l-2.034 4.069a1 1 0 0 1-1.708.134l-2.124-2.97",
			key: "ir91b5"
		}],
		["path", {
			d: "M17.106 9.053a1 1 0 0 1 .447 1.341l-3.106 6.211a1 1 0 0 1-1.342.447L3.61 12.3a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3z",
			key: "jlp8i1"
		}],
		["path", {
			d: "M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15",
			key: "19bib8"
		}],
		["path", {
			d: "M2 21v-4",
			key: "l40lih"
		}],
		["path", {
			d: "M7 9h.01",
			key: "19b3jx"
		}]
	]);
	const ChartArea = createLucideIcon("ChartArea", [["path", {
		d: "M3 3v16a2 2 0 0 0 2 2h16",
		key: "c24i48"
	}], ["path", {
		d: "M7 11.207a.5.5 0 0 1 .146-.353l2-2a.5.5 0 0 1 .708 0l3.292 3.292a.5.5 0 0 0 .708 0l4.292-4.292a.5.5 0 0 1 .854.353V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z",
		key: "q0gr47"
	}]]);
	const ChartBarBig = createLucideIcon("ChartBarBig", [
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}],
		["rect", {
			x: "7",
			y: "13",
			width: "9",
			height: "4",
			rx: "1",
			key: "1iip1u"
		}],
		["rect", {
			x: "7",
			y: "5",
			width: "12",
			height: "4",
			rx: "1",
			key: "1anskk"
		}]
	]);
	const ChartBarDecreasing = createLucideIcon("ChartBarDecreasing", [
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}],
		["path", {
			d: "M7 11h8",
			key: "1feolt"
		}],
		["path", {
			d: "M7 16h3",
			key: "ur6vzw"
		}],
		["path", {
			d: "M7 6h12",
			key: "sz5b0d"
		}]
	]);
	const ChartBarIncreasing = createLucideIcon("ChartBarIncreasing", [
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}],
		["path", {
			d: "M7 11h8",
			key: "1feolt"
		}],
		["path", {
			d: "M7 16h12",
			key: "wsnu98"
		}],
		["path", {
			d: "M7 6h3",
			key: "w9rmul"
		}]
	]);
	const ChartBarStacked = createLucideIcon("ChartBarStacked", [
		["path", {
			d: "M11 13v4",
			key: "vyy2rb"
		}],
		["path", {
			d: "M15 5v4",
			key: "1gx88a"
		}],
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}],
		["rect", {
			x: "7",
			y: "13",
			width: "9",
			height: "4",
			rx: "1",
			key: "1iip1u"
		}],
		["rect", {
			x: "7",
			y: "5",
			width: "12",
			height: "4",
			rx: "1",
			key: "1anskk"
		}]
	]);
	const ChartBar = createLucideIcon("ChartBar", [
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}],
		["path", {
			d: "M7 16h8",
			key: "srdodz"
		}],
		["path", {
			d: "M7 11h12",
			key: "127s9w"
		}],
		["path", {
			d: "M7 6h3",
			key: "w9rmul"
		}]
	]);
	const ChartCandlestick = createLucideIcon("ChartCandlestick", [
		["path", {
			d: "M9 5v4",
			key: "14uxtq"
		}],
		["rect", {
			width: "4",
			height: "6",
			x: "7",
			y: "9",
			rx: "1",
			key: "f4fvz0"
		}],
		["path", {
			d: "M9 15v2",
			key: "r5rk32"
		}],
		["path", {
			d: "M17 3v2",
			key: "1l2re6"
		}],
		["rect", {
			width: "4",
			height: "8",
			x: "15",
			y: "5",
			rx: "1",
			key: "z38je5"
		}],
		["path", {
			d: "M17 13v3",
			key: "5l0wba"
		}],
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}]
	]);
	const ChartColumnBig = createLucideIcon("ChartColumnBig", [
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}],
		["rect", {
			x: "15",
			y: "5",
			width: "4",
			height: "12",
			rx: "1",
			key: "q8uenq"
		}],
		["rect", {
			x: "7",
			y: "8",
			width: "4",
			height: "9",
			rx: "1",
			key: "sr5ea"
		}]
	]);
	const ChartColumnDecreasing = createLucideIcon("ChartColumnDecreasing", [
		["path", {
			d: "M13 17V9",
			key: "1fwyjl"
		}],
		["path", {
			d: "M18 17v-3",
			key: "1sqioe"
		}],
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}],
		["path", {
			d: "M8 17V5",
			key: "1wzmnc"
		}]
	]);
	const ChartColumnIncreasing = createLucideIcon("ChartColumnIncreasing", [
		["path", {
			d: "M13 17V9",
			key: "1fwyjl"
		}],
		["path", {
			d: "M18 17V5",
			key: "sfb6ij"
		}],
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}],
		["path", {
			d: "M8 17v-3",
			key: "17ska0"
		}]
	]);
	const ChartColumnStacked = createLucideIcon("ChartColumnStacked", [
		["path", {
			d: "M11 13H7",
			key: "t0o9gq"
		}],
		["path", {
			d: "M19 9h-4",
			key: "rera1j"
		}],
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}],
		["rect", {
			x: "15",
			y: "5",
			width: "4",
			height: "12",
			rx: "1",
			key: "q8uenq"
		}],
		["rect", {
			x: "7",
			y: "8",
			width: "4",
			height: "9",
			rx: "1",
			key: "sr5ea"
		}]
	]);
	const ChartColumn = createLucideIcon("ChartColumn", [
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}],
		["path", {
			d: "M18 17V9",
			key: "2bz60n"
		}],
		["path", {
			d: "M13 17V5",
			key: "1frdt8"
		}],
		["path", {
			d: "M8 17v-3",
			key: "17ska0"
		}]
	]);
	const ChartGantt = createLucideIcon("ChartGantt", [
		["path", {
			d: "M10 6h8",
			key: "zvc2xc"
		}],
		["path", {
			d: "M12 16h6",
			key: "yi5mkt"
		}],
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}],
		["path", {
			d: "M8 11h7",
			key: "wz2hg0"
		}]
	]);
	const ChartLine = createLucideIcon("ChartLine", [["path", {
		d: "M3 3v16a2 2 0 0 0 2 2h16",
		key: "c24i48"
	}], ["path", {
		d: "m19 9-5 5-4-4-3 3",
		key: "2osh9i"
	}]]);
	const ChartNetwork = createLucideIcon("ChartNetwork", [
		["path", {
			d: "m13.11 7.664 1.78 2.672",
			key: "go2gg9"
		}],
		["path", {
			d: "m14.162 12.788-3.324 1.424",
			key: "11x848"
		}],
		["path", {
			d: "m20 4-6.06 1.515",
			key: "1wxxh7"
		}],
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}],
		["circle", {
			cx: "12",
			cy: "6",
			r: "2",
			key: "1jj5th"
		}],
		["circle", {
			cx: "16",
			cy: "12",
			r: "2",
			key: "4ma0v8"
		}],
		["circle", {
			cx: "9",
			cy: "15",
			r: "2",
			key: "lf2ghp"
		}]
	]);
	const ChartNoAxesColumnDecreasing = createLucideIcon("ChartNoAxesColumnDecreasing", [
		["path", {
			d: "M12 20V10",
			key: "g8npz5"
		}],
		["path", {
			d: "M18 20v-4",
			key: "8uic4z"
		}],
		["path", {
			d: "M6 20V4",
			key: "1w1bmo"
		}]
	]);
	const ChartNoAxesColumnIncreasing = createLucideIcon("ChartNoAxesColumnIncreasing", [
		["line", {
			x1: "12",
			x2: "12",
			y1: "20",
			y2: "10",
			key: "1vz5eb"
		}],
		["line", {
			x1: "18",
			x2: "18",
			y1: "20",
			y2: "4",
			key: "cun8e5"
		}],
		["line", {
			x1: "6",
			x2: "6",
			y1: "20",
			y2: "16",
			key: "hq0ia6"
		}]
	]);
	const ChartNoAxesColumn = createLucideIcon("ChartNoAxesColumn", [
		["line", {
			x1: "18",
			x2: "18",
			y1: "20",
			y2: "10",
			key: "1xfpm4"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "20",
			y2: "4",
			key: "be30l9"
		}],
		["line", {
			x1: "6",
			x2: "6",
			y1: "20",
			y2: "14",
			key: "1r4le6"
		}]
	]);
	const ChartNoAxesCombined = createLucideIcon("ChartNoAxesCombined", [
		["path", {
			d: "M12 16v5",
			key: "zza2cw"
		}],
		["path", {
			d: "M16 14v7",
			key: "1g90b9"
		}],
		["path", {
			d: "M20 10v11",
			key: "1iqoj0"
		}],
		["path", {
			d: "m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15",
			key: "1fw8x9"
		}],
		["path", {
			d: "M4 18v3",
			key: "1yp0dc"
		}],
		["path", {
			d: "M8 14v7",
			key: "n3cwzv"
		}]
	]);
	const ChartNoAxesGantt = createLucideIcon("ChartNoAxesGantt", [
		["path", {
			d: "M8 6h10",
			key: "9lnwnk"
		}],
		["path", {
			d: "M6 12h9",
			key: "1g9pqf"
		}],
		["path", {
			d: "M11 18h7",
			key: "c8dzvl"
		}]
	]);
	const ChartPie = createLucideIcon("ChartPie", [["path", {
		d: "M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",
		key: "pzmjnu"
	}], ["path", {
		d: "M21.21 15.89A10 10 0 1 1 8 2.83",
		key: "k2fpak"
	}]]);
	const ChartScatter = createLucideIcon("ChartScatter", [
		["circle", {
			cx: "7.5",
			cy: "7.5",
			r: ".5",
			fill: "currentColor",
			key: "kqv944"
		}],
		["circle", {
			cx: "18.5",
			cy: "5.5",
			r: ".5",
			fill: "currentColor",
			key: "lysivs"
		}],
		["circle", {
			cx: "11.5",
			cy: "11.5",
			r: ".5",
			fill: "currentColor",
			key: "byv1b8"
		}],
		["circle", {
			cx: "7.5",
			cy: "16.5",
			r: ".5",
			fill: "currentColor",
			key: "nkw3mc"
		}],
		["circle", {
			cx: "17.5",
			cy: "14.5",
			r: ".5",
			fill: "currentColor",
			key: "1gjh6j"
		}],
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}]
	]);
	const ChartSpline = createLucideIcon("ChartSpline", [["path", {
		d: "M3 3v16a2 2 0 0 0 2 2h16",
		key: "c24i48"
	}], ["path", {
		d: "M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7",
		key: "lw07rv"
	}]]);
	const CheckCheck = createLucideIcon("CheckCheck", [["path", {
		d: "M18 6 7 17l-5-5",
		key: "116fxf"
	}], ["path", {
		d: "m22 10-7.5 7.5L13 16",
		key: "ke71qq"
	}]]);
	const Check$1 = createLucideIcon("Check", [["path", {
		d: "M20 6 9 17l-5-5",
		key: "1gmf2c"
	}]]);
	const ChefHat = createLucideIcon("ChefHat", [["path", {
		d: "M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z",
		key: "1qvrer"
	}], ["path", {
		d: "M6 17h12",
		key: "1jwigz"
	}]]);
	const Cherry = createLucideIcon("Cherry", [
		["path", {
			d: "M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z",
			key: "cvxqlc"
		}],
		["path", {
			d: "M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z",
			key: "1ostrc"
		}],
		["path", {
			d: "M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12",
			key: "hqx58h"
		}],
		["path", {
			d: "M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z",
			key: "eykp1o"
		}]
	]);
	const ChevronDown = createLucideIcon("ChevronDown", [["path", {
		d: "m6 9 6 6 6-6",
		key: "qrunsl"
	}]]);
	const ChevronFirst = createLucideIcon("ChevronFirst", [["path", {
		d: "m17 18-6-6 6-6",
		key: "1yerx2"
	}], ["path", {
		d: "M7 6v12",
		key: "1p53r6"
	}]]);
	const ChevronLast = createLucideIcon("ChevronLast", [["path", {
		d: "m7 18 6-6-6-6",
		key: "lwmzdw"
	}], ["path", {
		d: "M17 6v12",
		key: "1o0aio"
	}]]);
	const ChevronLeft = createLucideIcon("ChevronLeft", [["path", {
		d: "m15 18-6-6 6-6",
		key: "1wnfg3"
	}]]);
	const ChevronRight = createLucideIcon("ChevronRight", [["path", {
		d: "m9 18 6-6-6-6",
		key: "mthhwq"
	}]]);
	const ChevronUp = createLucideIcon("ChevronUp", [["path", {
		d: "m18 15-6-6-6 6",
		key: "153udz"
	}]]);
	const ChevronsDownUp = createLucideIcon("ChevronsDownUp", [["path", {
		d: "m7 20 5-5 5 5",
		key: "13a0gw"
	}], ["path", {
		d: "m7 4 5 5 5-5",
		key: "1kwcof"
	}]]);
	const ChevronsDown = createLucideIcon("ChevronsDown", [["path", {
		d: "m7 6 5 5 5-5",
		key: "1lc07p"
	}], ["path", {
		d: "m7 13 5 5 5-5",
		key: "1d48rs"
	}]]);
	const ChevronsLeftRightEllipsis = createLucideIcon("ChevronsLeftRightEllipsis", [
		["path", {
			d: "m18 8 4 4-4 4",
			key: "1ak13k"
		}],
		["path", {
			d: "m6 8-4 4 4 4",
			key: "15zrgr"
		}],
		["path", {
			d: "M8 12h.01",
			key: "czm47f"
		}],
		["path", {
			d: "M12 12h.01",
			key: "1mp3jc"
		}],
		["path", {
			d: "M16 12h.01",
			key: "1l6xoz"
		}]
	]);
	const ChevronsLeftRight = createLucideIcon("ChevronsLeftRight", [["path", {
		d: "m9 7-5 5 5 5",
		key: "j5w590"
	}], ["path", {
		d: "m15 7 5 5-5 5",
		key: "1bl6da"
	}]]);
	const ChevronsLeft = createLucideIcon("ChevronsLeft", [["path", {
		d: "m11 17-5-5 5-5",
		key: "13zhaf"
	}], ["path", {
		d: "m18 17-5-5 5-5",
		key: "h8a8et"
	}]]);
	const ChevronsRightLeft = createLucideIcon("ChevronsRightLeft", [["path", {
		d: "m20 17-5-5 5-5",
		key: "30x0n2"
	}], ["path", {
		d: "m4 17 5-5-5-5",
		key: "16spf4"
	}]]);
	const ChevronsRight = createLucideIcon("ChevronsRight", [["path", {
		d: "m6 17 5-5-5-5",
		key: "xnjwq"
	}], ["path", {
		d: "m13 17 5-5-5-5",
		key: "17xmmf"
	}]]);
	const ChevronsUpDown = createLucideIcon("ChevronsUpDown", [["path", {
		d: "m7 15 5 5 5-5",
		key: "1hf1tw"
	}], ["path", {
		d: "m7 9 5-5 5 5",
		key: "sgt6xg"
	}]]);
	const ChevronsUp = createLucideIcon("ChevronsUp", [["path", {
		d: "m17 11-5-5-5 5",
		key: "e8nh98"
	}], ["path", {
		d: "m17 18-5-5-5 5",
		key: "2avn1x"
	}]]);
	const Chrome = createLucideIcon("Chrome", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "4",
			key: "4exip2"
		}],
		["line", {
			x1: "21.17",
			x2: "12",
			y1: "8",
			y2: "8",
			key: "a0cw5f"
		}],
		["line", {
			x1: "3.95",
			x2: "8.54",
			y1: "6.06",
			y2: "14",
			key: "1kftof"
		}],
		["line", {
			x1: "10.88",
			x2: "15.46",
			y1: "21.94",
			y2: "14",
			key: "1ymyh8"
		}]
	]);
	const Church = createLucideIcon("Church", [
		["path", {
			d: "M10 9h4",
			key: "u4k05v"
		}],
		["path", {
			d: "M12 7v5",
			key: "ma6bk"
		}],
		["path", {
			d: "M14 22v-4a2 2 0 0 0-4 0v4",
			key: "1pdhuj"
		}],
		["path", {
			d: "M18 22V5.618a1 1 0 0 0-.553-.894l-4.553-2.277a2 2 0 0 0-1.788 0L6.553 4.724A1 1 0 0 0 6 5.618V22",
			key: "1rkokr"
		}],
		["path", {
			d: "m18 7 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.618a1 1 0 0 1 .553-.894L6 7",
			key: "1w6esw"
		}]
	]);
	const CigaretteOff = createLucideIcon("CigaretteOff", [
		["path", {
			d: "M12 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h13",
			key: "1gdiyg"
		}],
		["path", {
			d: "M18 8c0-2.5-2-2.5-2-5",
			key: "1il607"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M21 12a1 1 0 0 1 1 1v2a1 1 0 0 1-.5.866",
			key: "166zjj"
		}],
		["path", {
			d: "M22 8c0-2.5-2-2.5-2-5",
			key: "1gah44"
		}],
		["path", {
			d: "M7 12v4",
			key: "jqww69"
		}]
	]);
	const Cigarette = createLucideIcon("Cigarette", [
		["path", {
			d: "M17 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14",
			key: "1mb5g1"
		}],
		["path", {
			d: "M18 8c0-2.5-2-2.5-2-5",
			key: "1il607"
		}],
		["path", {
			d: "M21 16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
			key: "1yl5r7"
		}],
		["path", {
			d: "M22 8c0-2.5-2-2.5-2-5",
			key: "1gah44"
		}],
		["path", {
			d: "M7 12v4",
			key: "jqww69"
		}]
	]);
	const CircleAlert = createLucideIcon("CircleAlert", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "8",
			y2: "12",
			key: "1pkeuh"
		}],
		["line", {
			x1: "12",
			x2: "12.01",
			y1: "16",
			y2: "16",
			key: "4dfq90"
		}]
	]);
	const CircleArrowDown = createLucideIcon("CircleArrowDown", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M12 8v8",
			key: "napkw2"
		}],
		["path", {
			d: "m8 12 4 4 4-4",
			key: "k98ssh"
		}]
	]);
	const CircleArrowLeft = createLucideIcon("CircleArrowLeft", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M16 12H8",
			key: "1fr5h0"
		}],
		["path", {
			d: "m12 8-4 4 4 4",
			key: "15vm53"
		}]
	]);
	const CircleArrowOutDownLeft = createLucideIcon("CircleArrowOutDownLeft", [
		["path", {
			d: "M2 12a10 10 0 1 1 10 10",
			key: "1yn6ov"
		}],
		["path", {
			d: "m2 22 10-10",
			key: "28ilpk"
		}],
		["path", {
			d: "M8 22H2v-6",
			key: "sulq54"
		}]
	]);
	const CircleArrowOutDownRight = createLucideIcon("CircleArrowOutDownRight", [
		["path", {
			d: "M12 22a10 10 0 1 1 10-10",
			key: "130bv5"
		}],
		["path", {
			d: "M22 22 12 12",
			key: "131aw7"
		}],
		["path", {
			d: "M22 16v6h-6",
			key: "1gvm70"
		}]
	]);
	const CircleArrowOutUpLeft = createLucideIcon("CircleArrowOutUpLeft", [
		["path", {
			d: "M2 8V2h6",
			key: "hiwtdz"
		}],
		["path", {
			d: "m2 2 10 10",
			key: "1oh8rs"
		}],
		["path", {
			d: "M12 2A10 10 0 1 1 2 12",
			key: "rrk4fa"
		}]
	]);
	const CircleArrowOutUpRight = createLucideIcon("CircleArrowOutUpRight", [
		["path", {
			d: "M22 12A10 10 0 1 1 12 2",
			key: "1fm58d"
		}],
		["path", {
			d: "M22 2 12 12",
			key: "yg2myt"
		}],
		["path", {
			d: "M16 2h6v6",
			key: "zan5cs"
		}]
	]);
	const CircleArrowRight = createLucideIcon("CircleArrowRight", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M8 12h8",
			key: "1wcyev"
		}],
		["path", {
			d: "m12 16 4-4-4-4",
			key: "1i9zcv"
		}]
	]);
	const CircleArrowUp = createLucideIcon("CircleArrowUp", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "m16 12-4-4-4 4",
			key: "177agl"
		}],
		["path", {
			d: "M12 16V8",
			key: "1sbj14"
		}]
	]);
	const CircleCheckBig = createLucideIcon("CircleCheckBig", [["path", {
		d: "M21.801 10A10 10 0 1 1 17 3.335",
		key: "yps3ct"
	}], ["path", {
		d: "m9 11 3 3L22 4",
		key: "1pflzl"
	}]]);
	const CircleCheck = createLucideIcon("CircleCheck", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "m9 12 2 2 4-4",
		key: "dzmm74"
	}]]);
	const CircleChevronDown = createLucideIcon("CircleChevronDown", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "m16 10-4 4-4-4",
		key: "894hmk"
	}]]);
	const CircleChevronLeft = createLucideIcon("CircleChevronLeft", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "m14 16-4-4 4-4",
		key: "ojs7w8"
	}]]);
	const CircleChevronRight = createLucideIcon("CircleChevronRight", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "m10 8 4 4-4 4",
		key: "1wy4r4"
	}]]);
	const CircleChevronUp = createLucideIcon("CircleChevronUp", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "m8 14 4-4 4 4",
		key: "fy2ptz"
	}]]);
	const CircleDashed = createLucideIcon("CircleDashed", [
		["path", {
			d: "M10.1 2.182a10 10 0 0 1 3.8 0",
			key: "5ilxe3"
		}],
		["path", {
			d: "M13.9 21.818a10 10 0 0 1-3.8 0",
			key: "11zvb9"
		}],
		["path", {
			d: "M17.609 3.721a10 10 0 0 1 2.69 2.7",
			key: "1iw5b2"
		}],
		["path", {
			d: "M2.182 13.9a10 10 0 0 1 0-3.8",
			key: "c0bmvh"
		}],
		["path", {
			d: "M20.279 17.609a10 10 0 0 1-2.7 2.69",
			key: "1ruxm7"
		}],
		["path", {
			d: "M21.818 10.1a10 10 0 0 1 0 3.8",
			key: "qkgqxc"
		}],
		["path", {
			d: "M3.721 6.391a10 10 0 0 1 2.7-2.69",
			key: "1mcia2"
		}],
		["path", {
			d: "M6.391 20.279a10 10 0 0 1-2.69-2.7",
			key: "1fvljs"
		}]
	]);
	const CircleDivide = createLucideIcon("CircleDivide", [
		["line", {
			x1: "8",
			x2: "16",
			y1: "12",
			y2: "12",
			key: "1jonct"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "16",
			y2: "16",
			key: "aqc6ln"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "8",
			y2: "8",
			key: "1mkcni"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}]
	]);
	const CircleDollarSign = createLucideIcon("CircleDollarSign", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",
			key: "1h4pet"
		}],
		["path", {
			d: "M12 18V6",
			key: "zqpxq5"
		}]
	]);
	const CircleDotDashed = createLucideIcon("CircleDotDashed", [
		["path", {
			d: "M10.1 2.18a9.93 9.93 0 0 1 3.8 0",
			key: "1qdqn0"
		}],
		["path", {
			d: "M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7",
			key: "1bq7p6"
		}],
		["path", {
			d: "M21.82 10.1a9.93 9.93 0 0 1 0 3.8",
			key: "1rlaqf"
		}],
		["path", {
			d: "M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69",
			key: "1xk03u"
		}],
		["path", {
			d: "M13.9 21.82a9.94 9.94 0 0 1-3.8 0",
			key: "l7re25"
		}],
		["path", {
			d: "M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7",
			key: "1v18p6"
		}],
		["path", {
			d: "M2.18 13.9a9.93 9.93 0 0 1 0-3.8",
			key: "xdo6bj"
		}],
		["path", {
			d: "M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69",
			key: "1jjmaz"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "1",
			key: "41hilf"
		}]
	]);
	const CircleDot = createLucideIcon("CircleDot", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["circle", {
		cx: "12",
		cy: "12",
		r: "1",
		key: "41hilf"
	}]]);
	const CircleEllipsis = createLucideIcon("CircleEllipsis", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M17 12h.01",
			key: "1m0b6t"
		}],
		["path", {
			d: "M12 12h.01",
			key: "1mp3jc"
		}],
		["path", {
			d: "M7 12h.01",
			key: "eqddd0"
		}]
	]);
	const CircleEqual = createLucideIcon("CircleEqual", [
		["path", {
			d: "M7 10h10",
			key: "1101jm"
		}],
		["path", {
			d: "M7 14h10",
			key: "1mhdw3"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}]
	]);
	const CircleFadingArrowUp = createLucideIcon("CircleFadingArrowUp", [
		["path", {
			d: "M12 2a10 10 0 0 1 7.38 16.75",
			key: "175t95"
		}],
		["path", {
			d: "m16 12-4-4-4 4",
			key: "177agl"
		}],
		["path", {
			d: "M12 16V8",
			key: "1sbj14"
		}],
		["path", {
			d: "M2.5 8.875a10 10 0 0 0-.5 3",
			key: "1vce0s"
		}],
		["path", {
			d: "M2.83 16a10 10 0 0 0 2.43 3.4",
			key: "o3fkw4"
		}],
		["path", {
			d: "M4.636 5.235a10 10 0 0 1 .891-.857",
			key: "1szpfk"
		}],
		["path", {
			d: "M8.644 21.42a10 10 0 0 0 7.631-.38",
			key: "9yhvd4"
		}]
	]);
	const CircleFadingPlus = createLucideIcon("CircleFadingPlus", [
		["path", {
			d: "M12 2a10 10 0 0 1 7.38 16.75",
			key: "175t95"
		}],
		["path", {
			d: "M12 8v8",
			key: "napkw2"
		}],
		["path", {
			d: "M16 12H8",
			key: "1fr5h0"
		}],
		["path", {
			d: "M2.5 8.875a10 10 0 0 0-.5 3",
			key: "1vce0s"
		}],
		["path", {
			d: "M2.83 16a10 10 0 0 0 2.43 3.4",
			key: "o3fkw4"
		}],
		["path", {
			d: "M4.636 5.235a10 10 0 0 1 .891-.857",
			key: "1szpfk"
		}],
		["path", {
			d: "M8.644 21.42a10 10 0 0 0 7.631-.38",
			key: "9yhvd4"
		}]
	]);
	const CircleGauge = createLucideIcon("CircleGauge", [
		["path", {
			d: "M15.6 2.7a10 10 0 1 0 5.7 5.7",
			key: "1e0p6d"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "2",
			key: "1c9p78"
		}],
		["path", {
			d: "M13.4 10.6 19 5",
			key: "1kr7tw"
		}]
	]);
	const CircleHelp = createLucideIcon("CircleHelp", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
			key: "1u773s"
		}],
		["path", {
			d: "M12 17h.01",
			key: "p32p05"
		}]
	]);
	const CircleMinus = createLucideIcon("CircleMinus", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "M8 12h8",
		key: "1wcyev"
	}]]);
	const CircleOff = createLucideIcon("CircleOff", [
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M8.35 2.69A10 10 0 0 1 21.3 15.65",
			key: "1pfsoa"
		}],
		["path", {
			d: "M19.08 19.08A10 10 0 1 1 4.92 4.92",
			key: "1ablyi"
		}]
	]);
	const CircleParkingOff = createLucideIcon("CircleParkingOff", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "m5 5 14 14",
			key: "11anup"
		}],
		["path", {
			d: "M13 13a3 3 0 1 0 0-6H9v2",
			key: "uoagbd"
		}],
		["path", {
			d: "M9 17v-2.34",
			key: "a9qo08"
		}]
	]);
	const CircleParking = createLucideIcon("CircleParking", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "M9 17V7h4a3 3 0 0 1 0 6H9",
		key: "1dfk2c"
	}]]);
	const CirclePause = createLucideIcon("CirclePause", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["line", {
			x1: "10",
			x2: "10",
			y1: "15",
			y2: "9",
			key: "c1nkhi"
		}],
		["line", {
			x1: "14",
			x2: "14",
			y1: "15",
			y2: "9",
			key: "h65svq"
		}]
	]);
	const CirclePercent = createLucideIcon("CirclePercent", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "m15 9-6 6",
			key: "1uzhvr"
		}],
		["path", {
			d: "M9 9h.01",
			key: "1q5me6"
		}],
		["path", {
			d: "M15 15h.01",
			key: "lqbp3k"
		}]
	]);
	const CirclePlay = createLucideIcon("CirclePlay", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["polygon", {
		points: "10 8 16 12 10 16 10 8",
		key: "1cimsy"
	}]]);
	const CirclePlus = createLucideIcon("CirclePlus", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M8 12h8",
			key: "1wcyev"
		}],
		["path", {
			d: "M12 8v8",
			key: "napkw2"
		}]
	]);
	const CirclePower = createLucideIcon("CirclePower", [
		["path", {
			d: "M12 7v4",
			key: "xawao1"
		}],
		["path", {
			d: "M7.998 9.003a5 5 0 1 0 8-.005",
			key: "1pek45"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}]
	]);
	const CircleSlash2 = createLucideIcon("CircleSlash2", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "M22 2 2 22",
		key: "y4kqgn"
	}]]);
	const CircleSlash = createLucideIcon("CircleSlash", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["line", {
		x1: "9",
		x2: "15",
		y1: "15",
		y2: "9",
		key: "1dfufj"
	}]]);
	const CircleStop = createLucideIcon("CircleStop", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["rect", {
		x: "9",
		y: "9",
		width: "6",
		height: "6",
		rx: "1",
		key: "1ssd4o"
	}]]);
	const CircleUserRound = createLucideIcon("CircleUserRound", [
		["path", {
			d: "M18 20a6 6 0 0 0-12 0",
			key: "1qehca"
		}],
		["circle", {
			cx: "12",
			cy: "10",
			r: "4",
			key: "1h16sb"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}]
	]);
	const CircleUser = createLucideIcon("CircleUser", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["circle", {
			cx: "12",
			cy: "10",
			r: "3",
			key: "ilqhr7"
		}],
		["path", {
			d: "M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662",
			key: "154egf"
		}]
	]);
	const CircleX = createLucideIcon("CircleX", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "m15 9-6 6",
			key: "1uzhvr"
		}],
		["path", {
			d: "m9 9 6 6",
			key: "z0biqf"
		}]
	]);
	const Circle = createLucideIcon("Circle", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}]]);
	const CircuitBoard = createLucideIcon("CircuitBoard", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M11 9h4a2 2 0 0 0 2-2V3",
			key: "1ve2rv"
		}],
		["circle", {
			cx: "9",
			cy: "9",
			r: "2",
			key: "af1f0g"
		}],
		["path", {
			d: "M7 21v-4a2 2 0 0 1 2-2h4",
			key: "1fwkro"
		}],
		["circle", {
			cx: "15",
			cy: "15",
			r: "2",
			key: "3i40o0"
		}]
	]);
	const Citrus = createLucideIcon("Citrus", [
		["path", {
			d: "M21.66 17.67a1.08 1.08 0 0 1-.04 1.6A12 12 0 0 1 4.73 2.38a1.1 1.1 0 0 1 1.61-.04z",
			key: "4ite01"
		}],
		["path", {
			d: "M19.65 15.66A8 8 0 0 1 8.35 4.34",
			key: "1gxipu"
		}],
		["path", {
			d: "m14 10-5.5 5.5",
			key: "92pfem"
		}],
		["path", {
			d: "M14 17.85V10H6.15",
			key: "xqmtsk"
		}]
	]);
	const Clapperboard = createLucideIcon("Clapperboard", [
		["path", {
			d: "M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z",
			key: "1tn4o7"
		}],
		["path", {
			d: "m6.2 5.3 3.1 3.9",
			key: "iuk76l"
		}],
		["path", {
			d: "m12.4 3.4 3.1 4",
			key: "6hsd6n"
		}],
		["path", {
			d: "M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z",
			key: "ltgou9"
		}]
	]);
	const ClipboardCheck = createLucideIcon("ClipboardCheck", [
		["rect", {
			width: "8",
			height: "4",
			x: "8",
			y: "2",
			rx: "1",
			ry: "1",
			key: "tgr4d6"
		}],
		["path", {
			d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
			key: "116196"
		}],
		["path", {
			d: "m9 14 2 2 4-4",
			key: "df797q"
		}]
	]);
	const ClipboardCopy = createLucideIcon("ClipboardCopy", [
		["rect", {
			width: "8",
			height: "4",
			x: "8",
			y: "2",
			rx: "1",
			ry: "1",
			key: "tgr4d6"
		}],
		["path", {
			d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
			key: "4jdomd"
		}],
		["path", {
			d: "M16 4h2a2 2 0 0 1 2 2v4",
			key: "3hqy98"
		}],
		["path", {
			d: "M21 14H11",
			key: "1bme5i"
		}],
		["path", {
			d: "m15 10-4 4 4 4",
			key: "5dvupr"
		}]
	]);
	const ClipboardList = createLucideIcon("ClipboardList", [
		["rect", {
			width: "8",
			height: "4",
			x: "8",
			y: "2",
			rx: "1",
			ry: "1",
			key: "tgr4d6"
		}],
		["path", {
			d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
			key: "116196"
		}],
		["path", {
			d: "M12 11h4",
			key: "1jrz19"
		}],
		["path", {
			d: "M12 16h4",
			key: "n85exb"
		}],
		["path", {
			d: "M8 11h.01",
			key: "1dfujw"
		}],
		["path", {
			d: "M8 16h.01",
			key: "18s6g9"
		}]
	]);
	const ClipboardMinus = createLucideIcon("ClipboardMinus", [
		["rect", {
			width: "8",
			height: "4",
			x: "8",
			y: "2",
			rx: "1",
			ry: "1",
			key: "tgr4d6"
		}],
		["path", {
			d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
			key: "116196"
		}],
		["path", {
			d: "M9 14h6",
			key: "159ibu"
		}]
	]);
	const ClipboardPaste = createLucideIcon("ClipboardPaste", [
		["path", {
			d: "M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z",
			key: "1pp7kr"
		}],
		["path", {
			d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2M11 14h10",
			key: "2ik1ml"
		}],
		["path", {
			d: "m17 10 4 4-4 4",
			key: "vp2hj1"
		}]
	]);
	const ClipboardPenLine = createLucideIcon("ClipboardPenLine", [
		["rect", {
			width: "8",
			height: "4",
			x: "8",
			y: "2",
			rx: "1",
			key: "1oijnt"
		}],
		["path", {
			d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5",
			key: "1but9f"
		}],
		["path", {
			d: "M16 4h2a2 2 0 0 1 1.73 1",
			key: "1p8n7l"
		}],
		["path", {
			d: "M8 18h1",
			key: "13wk12"
		}],
		["path", {
			d: "M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
			key: "2t3380"
		}]
	]);
	const ClipboardPen = createLucideIcon("ClipboardPen", [
		["rect", {
			width: "8",
			height: "4",
			x: "8",
			y: "2",
			rx: "1",
			key: "1oijnt"
		}],
		["path", {
			d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5.5",
			key: "cereej"
		}],
		["path", {
			d: "M4 13.5V6a2 2 0 0 1 2-2h2",
			key: "5ua5vh"
		}],
		["path", {
			d: "M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
			key: "1y4qbx"
		}]
	]);
	const ClipboardPlus = createLucideIcon("ClipboardPlus", [
		["rect", {
			width: "8",
			height: "4",
			x: "8",
			y: "2",
			rx: "1",
			ry: "1",
			key: "tgr4d6"
		}],
		["path", {
			d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
			key: "116196"
		}],
		["path", {
			d: "M9 14h6",
			key: "159ibu"
		}],
		["path", {
			d: "M12 17v-6",
			key: "1y8rbf"
		}]
	]);
	const ClipboardType = createLucideIcon("ClipboardType", [
		["rect", {
			width: "8",
			height: "4",
			x: "8",
			y: "2",
			rx: "1",
			ry: "1",
			key: "tgr4d6"
		}],
		["path", {
			d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
			key: "116196"
		}],
		["path", {
			d: "M9 12v-1h6v1",
			key: "iehl6m"
		}],
		["path", {
			d: "M11 17h2",
			key: "12w5me"
		}],
		["path", {
			d: "M12 11v6",
			key: "1bwqyc"
		}]
	]);
	const ClipboardX = createLucideIcon("ClipboardX", [
		["rect", {
			width: "8",
			height: "4",
			x: "8",
			y: "2",
			rx: "1",
			ry: "1",
			key: "tgr4d6"
		}],
		["path", {
			d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
			key: "116196"
		}],
		["path", {
			d: "m15 11-6 6",
			key: "1toa9n"
		}],
		["path", {
			d: "m9 11 6 6",
			key: "wlibny"
		}]
	]);
	const Clipboard$1 = createLucideIcon("Clipboard", [["rect", {
		width: "8",
		height: "4",
		x: "8",
		y: "2",
		rx: "1",
		ry: "1",
		key: "tgr4d6"
	}], ["path", {
		d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
		key: "116196"
	}]]);
	const Clock1 = createLucideIcon("Clock1", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["polyline", {
		points: "12 6 12 12 14.5 8",
		key: "12zbmj"
	}]]);
	const Clock10 = createLucideIcon("Clock10", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["polyline", {
		points: "12 6 12 12 8 10",
		key: "atfzqc"
	}]]);
	const Clock11 = createLucideIcon("Clock11", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["polyline", {
		points: "12 6 12 12 9.5 8",
		key: "l5bg6f"
	}]]);
	const Clock12 = createLucideIcon("Clock12", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["polyline", {
		points: "12 6 12 12",
		key: "1fub01"
	}]]);
	const Clock2 = createLucideIcon("Clock2", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["polyline", {
		points: "12 6 12 12 16 10",
		key: "1g230d"
	}]]);
	const Clock3 = createLucideIcon("Clock3", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["polyline", {
		points: "12 6 12 12 16.5 12",
		key: "1aq6pp"
	}]]);
	const Clock4 = createLucideIcon("Clock4", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["polyline", {
		points: "12 6 12 12 16 14",
		key: "68esgv"
	}]]);
	const Clock5 = createLucideIcon("Clock5", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["polyline", {
		points: "12 6 12 12 14.5 16",
		key: "1pcbox"
	}]]);
	const Clock6 = createLucideIcon("Clock6", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["polyline", {
		points: "12 6 12 12 12 16.5",
		key: "hb2qv6"
	}]]);
	const Clock7 = createLucideIcon("Clock7", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["polyline", {
		points: "12 6 12 12 9.5 16",
		key: "ka3394"
	}]]);
	const Clock8 = createLucideIcon("Clock8", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["polyline", {
		points: "12 6 12 12 8 14",
		key: "tmc9b4"
	}]]);
	const Clock9 = createLucideIcon("Clock9", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["polyline", {
		points: "12 6 12 12 7.5 12",
		key: "1k60p0"
	}]]);
	const ClockAlert = createLucideIcon("ClockAlert", [
		["path", {
			d: "M12 6v6l4 2",
			key: "mmk7yg"
		}],
		["path", {
			d: "M16 21.16a10 10 0 1 1 5-13.516",
			key: "cxo92l"
		}],
		["path", {
			d: "M20 11.5v6",
			key: "2ei3xq"
		}],
		["path", {
			d: "M20 21.5h.01",
			key: "1r2dzp"
		}]
	]);
	const ClockArrowDown = createLucideIcon("ClockArrowDown", [
		["path", {
			d: "M12.338 21.994A10 10 0 1 1 21.925 13.227",
			key: "1i7shu"
		}],
		["path", {
			d: "M12 6v6l2 1",
			key: "19cm8n"
		}],
		["path", {
			d: "m14 18 4 4 4-4",
			key: "1waygx"
		}],
		["path", {
			d: "M18 14v8",
			key: "irew45"
		}]
	]);
	const ClockArrowUp = createLucideIcon("ClockArrowUp", [
		["path", {
			d: "M13.228 21.925A10 10 0 1 1 21.994 12.338",
			key: "1fzlyi"
		}],
		["path", {
			d: "M12 6v6l1.562.781",
			key: "1ujuk9"
		}],
		["path", {
			d: "m14 18 4-4 4 4",
			key: "ftkppy"
		}],
		["path", {
			d: "M18 22v-8",
			key: "su0gjh"
		}]
	]);
	const Clock = createLucideIcon("Clock", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["polyline", {
		points: "12 6 12 12 16 14",
		key: "68esgv"
	}]]);
	const CloudAlert = createLucideIcon("CloudAlert", [
		["path", {
			d: "M12 12v4",
			key: "tww15h"
		}],
		["path", {
			d: "M12 20h.01",
			key: "zekei9"
		}],
		["path", {
			d: "M17 18h.5a1 1 0 0 0 0-9h-1.79A7 7 0 1 0 7 17.708",
			key: "xsb5ju"
		}]
	]);
	const CloudCog = createLucideIcon("CloudCog", [
		["circle", {
			cx: "12",
			cy: "17",
			r: "3",
			key: "1spfwm"
		}],
		["path", {
			d: "M4.2 15.1A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2",
			key: "zaobp"
		}],
		["path", {
			d: "m15.7 18.4-.9-.3",
			key: "4qxpbn"
		}],
		["path", {
			d: "m9.2 15.9-.9-.3",
			key: "17q7o2"
		}],
		["path", {
			d: "m10.6 20.7.3-.9",
			key: "1pf4s2"
		}],
		["path", {
			d: "m13.1 14.2.3-.9",
			key: "1mnuqm"
		}],
		["path", {
			d: "m13.6 20.7-.4-1",
			key: "1jpd1m"
		}],
		["path", {
			d: "m10.8 14.3-.4-1",
			key: "17ugyy"
		}],
		["path", {
			d: "m8.3 18.6 1-.4",
			key: "s42vdx"
		}],
		["path", {
			d: "m14.7 15.8 1-.4",
			key: "2wizun"
		}]
	]);
	const CloudDownload = createLucideIcon("CloudDownload", [
		["path", {
			d: "M12 13v8l-4-4",
			key: "1f5nwf"
		}],
		["path", {
			d: "m12 21 4-4",
			key: "1lfcce"
		}],
		["path", {
			d: "M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284",
			key: "ui1hmy"
		}]
	]);
	const CloudDrizzle = createLucideIcon("CloudDrizzle", [
		["path", {
			d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
			key: "1pljnt"
		}],
		["path", {
			d: "M8 19v1",
			key: "1dk2by"
		}],
		["path", {
			d: "M8 14v1",
			key: "84yxot"
		}],
		["path", {
			d: "M16 19v1",
			key: "v220m7"
		}],
		["path", {
			d: "M16 14v1",
			key: "g12gj6"
		}],
		["path", {
			d: "M12 21v1",
			key: "q8vafk"
		}],
		["path", {
			d: "M12 16v1",
			key: "1mx6rx"
		}]
	]);
	const CloudFog = createLucideIcon("CloudFog", [
		["path", {
			d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
			key: "1pljnt"
		}],
		["path", {
			d: "M16 17H7",
			key: "pygtm1"
		}],
		["path", {
			d: "M17 21H9",
			key: "1u2q02"
		}]
	]);
	const CloudHail = createLucideIcon("CloudHail", [
		["path", {
			d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
			key: "1pljnt"
		}],
		["path", {
			d: "M16 14v2",
			key: "a1is7l"
		}],
		["path", {
			d: "M8 14v2",
			key: "1e9m6t"
		}],
		["path", {
			d: "M16 20h.01",
			key: "xwek51"
		}],
		["path", {
			d: "M8 20h.01",
			key: "1vjney"
		}],
		["path", {
			d: "M12 16v2",
			key: "z66u1j"
		}],
		["path", {
			d: "M12 22h.01",
			key: "1urd7a"
		}]
	]);
	const CloudLightning = createLucideIcon("CloudLightning", [["path", {
		d: "M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973",
		key: "1cez44"
	}], ["path", {
		d: "m13 12-3 5h4l-3 5",
		key: "1t22er"
	}]]);
	const CloudMoonRain = createLucideIcon("CloudMoonRain", [
		["path", {
			d: "M10.188 8.5A6 6 0 0 1 16 4a1 1 0 0 0 6 6 6 6 0 0 1-3 5.197",
			key: "erj67n"
		}],
		["path", {
			d: "M11 20v2",
			key: "174qtz"
		}],
		["path", {
			d: "M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24",
			key: "1qmrp3"
		}],
		["path", {
			d: "M7 19v2",
			key: "12npes"
		}]
	]);
	const CloudMoon = createLucideIcon("CloudMoon", [["path", {
		d: "M10.188 8.5A6 6 0 0 1 16 4a1 1 0 0 0 6 6 6 6 0 0 1-3 5.197",
		key: "erj67n"
	}], ["path", {
		d: "M13 16a3 3 0 1 1 0 6H7a5 5 0 1 1 4.9-6Z",
		key: "p44pc9"
	}]]);
	const CloudOff = createLucideIcon("CloudOff", [
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193",
			key: "yfwify"
		}],
		["path", {
			d: "M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07",
			key: "jlfiyv"
		}]
	]);
	const CloudRainWind = createLucideIcon("CloudRainWind", [
		["path", {
			d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
			key: "1pljnt"
		}],
		["path", {
			d: "m9.2 22 3-7",
			key: "sb5f6j"
		}],
		["path", {
			d: "m9 13-3 7",
			key: "500co5"
		}],
		["path", {
			d: "m17 13-3 7",
			key: "8t2fiy"
		}]
	]);
	const CloudRain = createLucideIcon("CloudRain", [
		["path", {
			d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
			key: "1pljnt"
		}],
		["path", {
			d: "M16 14v6",
			key: "1j4efv"
		}],
		["path", {
			d: "M8 14v6",
			key: "17c4r9"
		}],
		["path", {
			d: "M12 16v6",
			key: "c8a4gj"
		}]
	]);
	const CloudSnow = createLucideIcon("CloudSnow", [
		["path", {
			d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
			key: "1pljnt"
		}],
		["path", {
			d: "M8 15h.01",
			key: "a7atzg"
		}],
		["path", {
			d: "M8 19h.01",
			key: "puxtts"
		}],
		["path", {
			d: "M12 17h.01",
			key: "p32p05"
		}],
		["path", {
			d: "M12 21h.01",
			key: "h35vbk"
		}],
		["path", {
			d: "M16 15h.01",
			key: "rnfrdf"
		}],
		["path", {
			d: "M16 19h.01",
			key: "1vcnzz"
		}]
	]);
	const CloudSunRain = createLucideIcon("CloudSunRain", [
		["path", {
			d: "M12 2v2",
			key: "tus03m"
		}],
		["path", {
			d: "m4.93 4.93 1.41 1.41",
			key: "149t6j"
		}],
		["path", {
			d: "M20 12h2",
			key: "1q8mjw"
		}],
		["path", {
			d: "m19.07 4.93-1.41 1.41",
			key: "1shlcs"
		}],
		["path", {
			d: "M15.947 12.65a4 4 0 0 0-5.925-4.128",
			key: "dpwdj0"
		}],
		["path", {
			d: "M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24",
			key: "1qmrp3"
		}],
		["path", {
			d: "M11 20v2",
			key: "174qtz"
		}],
		["path", {
			d: "M7 19v2",
			key: "12npes"
		}]
	]);
	const CloudSun = createLucideIcon("CloudSun", [
		["path", {
			d: "M12 2v2",
			key: "tus03m"
		}],
		["path", {
			d: "m4.93 4.93 1.41 1.41",
			key: "149t6j"
		}],
		["path", {
			d: "M20 12h2",
			key: "1q8mjw"
		}],
		["path", {
			d: "m19.07 4.93-1.41 1.41",
			key: "1shlcs"
		}],
		["path", {
			d: "M15.947 12.65a4 4 0 0 0-5.925-4.128",
			key: "dpwdj0"
		}],
		["path", {
			d: "M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z",
			key: "s09mg5"
		}]
	]);
	const CloudUpload = createLucideIcon("CloudUpload", [
		["path", {
			d: "M12 13v8",
			key: "1l5pq0"
		}],
		["path", {
			d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
			key: "1pljnt"
		}],
		["path", {
			d: "m8 17 4-4 4 4",
			key: "1quai1"
		}]
	]);
	const Cloud = createLucideIcon("Cloud", [["path", {
		d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",
		key: "p7xjir"
	}]]);
	const Cloudy = createLucideIcon("Cloudy", [["path", {
		d: "M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",
		key: "gqqjvc"
	}], ["path", {
		d: "M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5",
		key: "1p2s76"
	}]]);
	const Clover = createLucideIcon("Clover", [
		["path", {
			d: "M16.17 7.83 2 22",
			key: "t58vo8"
		}],
		["path", {
			d: "M4.02 12a2.827 2.827 0 1 1 3.81-4.17A2.827 2.827 0 1 1 12 4.02a2.827 2.827 0 1 1 4.17 3.81A2.827 2.827 0 1 1 19.98 12a2.827 2.827 0 1 1-3.81 4.17A2.827 2.827 0 1 1 12 19.98a2.827 2.827 0 1 1-4.17-3.81A1 1 0 1 1 4 12",
			key: "17k36q"
		}],
		["path", {
			d: "m7.83 7.83 8.34 8.34",
			key: "1d7sxk"
		}]
	]);
	const Club = createLucideIcon("Club", [["path", {
		d: "M17.28 9.05a5.5 5.5 0 1 0-10.56 0A5.5 5.5 0 1 0 12 17.66a5.5 5.5 0 1 0 5.28-8.6Z",
		key: "27yuqz"
	}], ["path", {
		d: "M12 17.66L12 22",
		key: "ogfahf"
	}]]);
	const CodeXml = createLucideIcon("CodeXml", [
		["path", {
			d: "m18 16 4-4-4-4",
			key: "1inbqp"
		}],
		["path", {
			d: "m6 8-4 4 4 4",
			key: "15zrgr"
		}],
		["path", {
			d: "m14.5 4-5 16",
			key: "e7oirm"
		}]
	]);
	const Code = createLucideIcon("Code", [["polyline", {
		points: "16 18 22 12 16 6",
		key: "z7tu5w"
	}], ["polyline", {
		points: "8 6 2 12 8 18",
		key: "1eg1df"
	}]]);
	const Codepen = createLucideIcon("Codepen", [
		["polygon", {
			points: "12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2",
			key: "srzb37"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "22",
			y2: "15.5",
			key: "1t73f2"
		}],
		["polyline", {
			points: "22 8.5 12 15.5 2 8.5",
			key: "ajlxae"
		}],
		["polyline", {
			points: "2 15.5 12 8.5 22 15.5",
			key: "susrui"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "2",
			y2: "8.5",
			key: "2cldga"
		}]
	]);
	const Codesandbox = createLucideIcon("Codesandbox", [
		["path", {
			d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
			key: "yt0hxn"
		}],
		["polyline", {
			points: "7.5 4.21 12 6.81 16.5 4.21",
			key: "fabo96"
		}],
		["polyline", {
			points: "7.5 19.79 7.5 14.6 3 12",
			key: "z377f1"
		}],
		["polyline", {
			points: "21 12 16.5 14.6 16.5 19.79",
			key: "9nrev1"
		}],
		["polyline", {
			points: "3.27 6.96 12 12.01 20.73 6.96",
			key: "1180pa"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "22.08",
			y2: "12",
			key: "3z3uq6"
		}]
	]);
	const Coffee = createLucideIcon("Coffee", [
		["path", {
			d: "M10 2v2",
			key: "7u0qdc"
		}],
		["path", {
			d: "M14 2v2",
			key: "6buw04"
		}],
		["path", {
			d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
			key: "pwadti"
		}],
		["path", {
			d: "M6 2v2",
			key: "colzsn"
		}]
	]);
	const Cog = createLucideIcon("Cog", [
		["path", {
			d: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",
			key: "sobvz5"
		}],
		["path", {
			d: "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
			key: "11i496"
		}],
		["path", {
			d: "M12 2v2",
			key: "tus03m"
		}],
		["path", {
			d: "M12 22v-2",
			key: "1osdcq"
		}],
		["path", {
			d: "m17 20.66-1-1.73",
			key: "eq3orb"
		}],
		["path", {
			d: "M11 10.27 7 3.34",
			key: "16pf9h"
		}],
		["path", {
			d: "m20.66 17-1.73-1",
			key: "sg0v6f"
		}],
		["path", {
			d: "m3.34 7 1.73 1",
			key: "1ulond"
		}],
		["path", {
			d: "M14 12h8",
			key: "4f43i9"
		}],
		["path", {
			d: "M2 12h2",
			key: "1t8f8n"
		}],
		["path", {
			d: "m20.66 7-1.73 1",
			key: "1ow05n"
		}],
		["path", {
			d: "m3.34 17 1.73-1",
			key: "nuk764"
		}],
		["path", {
			d: "m17 3.34-1 1.73",
			key: "2wel8s"
		}],
		["path", {
			d: "m11 13.73-4 6.93",
			key: "794ttg"
		}]
	]);
	const Coins = createLucideIcon("Coins", [
		["circle", {
			cx: "8",
			cy: "8",
			r: "6",
			key: "3yglwk"
		}],
		["path", {
			d: "M18.09 10.37A6 6 0 1 1 10.34 18",
			key: "t5s6rm"
		}],
		["path", {
			d: "M7 6h1v4",
			key: "1obek4"
		}],
		["path", {
			d: "m16.71 13.88.7.71-2.82 2.82",
			key: "1rbuyh"
		}]
	]);
	const Columns2 = createLucideIcon("Columns2", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "M12 3v18",
		key: "108xh3"
	}]]);
	const Columns3 = createLucideIcon("Columns3", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M9 3v18",
			key: "fh3hqa"
		}],
		["path", {
			d: "M15 3v18",
			key: "14nvp0"
		}]
	]);
	const Columns4 = createLucideIcon("Columns4", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M7.5 3v18",
			key: "w0wo6v"
		}],
		["path", {
			d: "M12 3v18",
			key: "108xh3"
		}],
		["path", {
			d: "M16.5 3v18",
			key: "10tjh1"
		}]
	]);
	const Combine = createLucideIcon("Combine", [
		["path", {
			d: "M10 18H5a3 3 0 0 1-3-3v-1",
			key: "ru65g8"
		}],
		["path", {
			d: "M14 2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2",
			key: "e30een"
		}],
		["path", {
			d: "M20 2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2",
			key: "2ahx8o"
		}],
		["path", {
			d: "m7 21 3-3-3-3",
			key: "127cv2"
		}],
		["rect", {
			x: "14",
			y: "14",
			width: "8",
			height: "8",
			rx: "2",
			key: "1b0bso"
		}],
		["rect", {
			x: "2",
			y: "2",
			width: "8",
			height: "8",
			rx: "2",
			key: "1x09vl"
		}]
	]);
	const Command = createLucideIcon("Command", [["path", {
		d: "M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3",
		key: "11bfej"
	}]]);
	const Compass = createLucideIcon("Compass", [["path", {
		d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",
		key: "9ktpf1"
	}], ["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}]]);
	const Component = createLucideIcon("Component", [
		["path", {
			d: "M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z",
			key: "1uwlt4"
		}],
		["path", {
			d: "M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z",
			key: "10291m"
		}],
		["path", {
			d: "M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z",
			key: "1tqoq1"
		}],
		["path", {
			d: "M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z",
			key: "1x6lto"
		}]
	]);
	const Computer = createLucideIcon("Computer", [
		["rect", {
			width: "14",
			height: "8",
			x: "5",
			y: "2",
			rx: "2",
			key: "wc9tft"
		}],
		["rect", {
			width: "20",
			height: "8",
			x: "2",
			y: "14",
			rx: "2",
			key: "w68u3i"
		}],
		["path", {
			d: "M6 18h2",
			key: "rwmk9e"
		}],
		["path", {
			d: "M12 18h6",
			key: "aqd8w3"
		}]
	]);
	const ConciergeBell = createLucideIcon("ConciergeBell", [
		["path", {
			d: "M3 20a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1Z",
			key: "1pvr1r"
		}],
		["path", {
			d: "M20 16a8 8 0 1 0-16 0",
			key: "1pa543"
		}],
		["path", {
			d: "M12 4v4",
			key: "1bq03y"
		}],
		["path", {
			d: "M10 4h4",
			key: "1xpv9s"
		}]
	]);
	const Cone = createLucideIcon("Cone", [["path", {
		d: "m20.9 18.55-8-15.98a1 1 0 0 0-1.8 0l-8 15.98",
		key: "53pte7"
	}], ["ellipse", {
		cx: "12",
		cy: "19",
		rx: "9",
		ry: "3",
		key: "1ji25f"
	}]]);
	const Construction = createLucideIcon("Construction", [
		["rect", {
			x: "2",
			y: "6",
			width: "20",
			height: "8",
			rx: "1",
			key: "1estib"
		}],
		["path", {
			d: "M17 14v7",
			key: "7m2elx"
		}],
		["path", {
			d: "M7 14v7",
			key: "1cm7wv"
		}],
		["path", {
			d: "M17 3v3",
			key: "1v4jwn"
		}],
		["path", {
			d: "M7 3v3",
			key: "7o6guu"
		}],
		["path", {
			d: "M10 14 2.3 6.3",
			key: "1023jk"
		}],
		["path", {
			d: "m14 6 7.7 7.7",
			key: "1s8pl2"
		}],
		["path", {
			d: "m8 6 8 8",
			key: "hl96qh"
		}]
	]);
	const ContactRound = createLucideIcon("ContactRound", [
		["path", {
			d: "M16 2v2",
			key: "scm5qe"
		}],
		["path", {
			d: "M17.915 22a6 6 0 0 0-12 0",
			key: "suqz9p"
		}],
		["path", {
			d: "M8 2v2",
			key: "pbkmx"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "4",
			key: "4exip2"
		}],
		["rect", {
			x: "3",
			y: "4",
			width: "18",
			height: "18",
			rx: "2",
			key: "12vinp"
		}]
	]);
	const Contact = createLucideIcon("Contact", [
		["path", {
			d: "M16 2v2",
			key: "scm5qe"
		}],
		["path", {
			d: "M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2",
			key: "1waht3"
		}],
		["path", {
			d: "M8 2v2",
			key: "pbkmx"
		}],
		["circle", {
			cx: "12",
			cy: "11",
			r: "3",
			key: "itu57m"
		}],
		["rect", {
			x: "3",
			y: "4",
			width: "18",
			height: "18",
			rx: "2",
			key: "12vinp"
		}]
	]);
	const Container = createLucideIcon("Container", [
		["path", {
			d: "M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z",
			key: "1t2lqe"
		}],
		["path", {
			d: "M10 21.9V14L2.1 9.1",
			key: "o7czzq"
		}],
		["path", {
			d: "m10 14 11.9-6.9",
			key: "zm5e20"
		}],
		["path", {
			d: "M14 19.8v-8.1",
			key: "159ecu"
		}],
		["path", {
			d: "M18 17.5V9.4",
			key: "11uown"
		}]
	]);
	const Contrast = createLucideIcon("Contrast", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "M12 18a6 6 0 0 0 0-12v12z",
		key: "j4l70d"
	}]]);
	const Cookie = createLucideIcon("Cookie", [
		["path", {
			d: "M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5",
			key: "laymnq"
		}],
		["path", {
			d: "M8.5 8.5v.01",
			key: "ue8clq"
		}],
		["path", {
			d: "M16 15.5v.01",
			key: "14dtrp"
		}],
		["path", {
			d: "M12 12v.01",
			key: "u5ubse"
		}],
		["path", {
			d: "M11 17v.01",
			key: "1hyl5a"
		}],
		["path", {
			d: "M7 14v.01",
			key: "uct60s"
		}]
	]);
	const CookingPot = createLucideIcon("CookingPot", [
		["path", {
			d: "M2 12h20",
			key: "9i4pu4"
		}],
		["path", {
			d: "M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8",
			key: "u0tga0"
		}],
		["path", {
			d: "m4 8 16-4",
			key: "16g0ng"
		}],
		["path", {
			d: "m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8",
			key: "12cejc"
		}]
	]);
	const CopyCheck = createLucideIcon("CopyCheck", [
		["path", {
			d: "m12 15 2 2 4-4",
			key: "2c609p"
		}],
		["rect", {
			width: "14",
			height: "14",
			x: "8",
			y: "8",
			rx: "2",
			ry: "2",
			key: "17jyea"
		}],
		["path", {
			d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
			key: "zix9uf"
		}]
	]);
	const CopyMinus = createLucideIcon("CopyMinus", [
		["line", {
			x1: "12",
			x2: "18",
			y1: "15",
			y2: "15",
			key: "1nscbv"
		}],
		["rect", {
			width: "14",
			height: "14",
			x: "8",
			y: "8",
			rx: "2",
			ry: "2",
			key: "17jyea"
		}],
		["path", {
			d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
			key: "zix9uf"
		}]
	]);
	const CopyPlus = createLucideIcon("CopyPlus", [
		["line", {
			x1: "15",
			x2: "15",
			y1: "12",
			y2: "18",
			key: "1p7wdc"
		}],
		["line", {
			x1: "12",
			x2: "18",
			y1: "15",
			y2: "15",
			key: "1nscbv"
		}],
		["rect", {
			width: "14",
			height: "14",
			x: "8",
			y: "8",
			rx: "2",
			ry: "2",
			key: "17jyea"
		}],
		["path", {
			d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
			key: "zix9uf"
		}]
	]);
	const CopySlash = createLucideIcon("CopySlash", [
		["line", {
			x1: "12",
			x2: "18",
			y1: "18",
			y2: "12",
			key: "ebkxgr"
		}],
		["rect", {
			width: "14",
			height: "14",
			x: "8",
			y: "8",
			rx: "2",
			ry: "2",
			key: "17jyea"
		}],
		["path", {
			d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
			key: "zix9uf"
		}]
	]);
	const CopyX = createLucideIcon("CopyX", [
		["line", {
			x1: "12",
			x2: "18",
			y1: "12",
			y2: "18",
			key: "1rg63v"
		}],
		["line", {
			x1: "12",
			x2: "18",
			y1: "18",
			y2: "12",
			key: "ebkxgr"
		}],
		["rect", {
			width: "14",
			height: "14",
			x: "8",
			y: "8",
			rx: "2",
			ry: "2",
			key: "17jyea"
		}],
		["path", {
			d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
			key: "zix9uf"
		}]
	]);
	const Copy = createLucideIcon("Copy", [["rect", {
		width: "14",
		height: "14",
		x: "8",
		y: "8",
		rx: "2",
		ry: "2",
		key: "17jyea"
	}], ["path", {
		d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
		key: "zix9uf"
	}]]);
	const Copyleft = createLucideIcon("Copyleft", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "M9.17 14.83a4 4 0 1 0 0-5.66",
		key: "1sveal"
	}]]);
	const Copyright = createLucideIcon("Copyright", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "M14.83 14.83a4 4 0 1 1 0-5.66",
		key: "1i56pz"
	}]]);
	const CornerDownLeft = createLucideIcon("CornerDownLeft", [["polyline", {
		points: "9 10 4 15 9 20",
		key: "r3jprv"
	}], ["path", {
		d: "M20 4v7a4 4 0 0 1-4 4H4",
		key: "6o5b7l"
	}]]);
	const CornerDownRight = createLucideIcon("CornerDownRight", [["polyline", {
		points: "15 10 20 15 15 20",
		key: "1q7qjw"
	}], ["path", {
		d: "M4 4v7a4 4 0 0 0 4 4h12",
		key: "z08zvw"
	}]]);
	const CornerLeftDown = createLucideIcon("CornerLeftDown", [["polyline", {
		points: "14 15 9 20 4 15",
		key: "nkc4i"
	}], ["path", {
		d: "M20 4h-7a4 4 0 0 0-4 4v12",
		key: "nbpdq2"
	}]]);
	const CornerLeftUp = createLucideIcon("CornerLeftUp", [["polyline", {
		points: "14 9 9 4 4 9",
		key: "m9oyvo"
	}], ["path", {
		d: "M20 20h-7a4 4 0 0 1-4-4V4",
		key: "1blwi3"
	}]]);
	const CornerRightDown = createLucideIcon("CornerRightDown", [["polyline", {
		points: "10 15 15 20 20 15",
		key: "axus6l"
	}], ["path", {
		d: "M4 4h7a4 4 0 0 1 4 4v12",
		key: "wcbgct"
	}]]);
	const CornerRightUp = createLucideIcon("CornerRightUp", [["polyline", {
		points: "10 9 15 4 20 9",
		key: "1lr6px"
	}], ["path", {
		d: "M4 20h7a4 4 0 0 0 4-4V4",
		key: "1plgdj"
	}]]);
	const CornerUpLeft = createLucideIcon("CornerUpLeft", [["polyline", {
		points: "9 14 4 9 9 4",
		key: "881910"
	}], ["path", {
		d: "M20 20v-7a4 4 0 0 0-4-4H4",
		key: "1nkjon"
	}]]);
	const CornerUpRight = createLucideIcon("CornerUpRight", [["polyline", {
		points: "15 14 20 9 15 4",
		key: "1tbx3s"
	}], ["path", {
		d: "M4 20v-7a4 4 0 0 1 4-4h12",
		key: "1lu4f8"
	}]]);
	const Cpu = createLucideIcon("Cpu", [
		["rect", {
			width: "16",
			height: "16",
			x: "4",
			y: "4",
			rx: "2",
			key: "14l7u7"
		}],
		["rect", {
			width: "6",
			height: "6",
			x: "9",
			y: "9",
			rx: "1",
			key: "5aljv4"
		}],
		["path", {
			d: "M15 2v2",
			key: "13l42r"
		}],
		["path", {
			d: "M15 20v2",
			key: "15mkzm"
		}],
		["path", {
			d: "M2 15h2",
			key: "1gxd5l"
		}],
		["path", {
			d: "M2 9h2",
			key: "1bbxkp"
		}],
		["path", {
			d: "M20 15h2",
			key: "19e6y8"
		}],
		["path", {
			d: "M20 9h2",
			key: "19tzq7"
		}],
		["path", {
			d: "M9 2v2",
			key: "165o2o"
		}],
		["path", {
			d: "M9 20v2",
			key: "i2bqo8"
		}]
	]);
	const CreativeCommons = createLucideIcon("CreativeCommons", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M10 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1",
			key: "1ss3eq"
		}],
		["path", {
			d: "M17 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1",
			key: "1od56t"
		}]
	]);
	const CreditCard = createLucideIcon("CreditCard", [["rect", {
		width: "20",
		height: "14",
		x: "2",
		y: "5",
		rx: "2",
		key: "ynyp8z"
	}], ["line", {
		x1: "2",
		x2: "22",
		y1: "10",
		y2: "10",
		key: "1b3vmo"
	}]]);
	const Croissant = createLucideIcon("Croissant", [
		["path", {
			d: "m4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z",
			key: "1ozxlb"
		}],
		["path", {
			d: "m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83",
			key: "ffuyb5"
		}],
		["path", {
			d: "M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4",
			key: "osnpzi"
		}],
		["path", {
			d: "m14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2",
			key: "1vubaw"
		}],
		["path", {
			d: "M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5",
			key: "wxr772"
		}]
	]);
	const Crop = createLucideIcon("Crop", [["path", {
		d: "M6 2v14a2 2 0 0 0 2 2h14",
		key: "ron5a4"
	}], ["path", {
		d: "M18 22V8a2 2 0 0 0-2-2H2",
		key: "7s9ehn"
	}]]);
	const Cross = createLucideIcon("Cross", [["path", {
		d: "M4 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a1 1 0 0 1 1 1v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a1 1 0 0 1 1-1h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a1 1 0 0 1-1-1V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a1 1 0 0 1-1 1z",
		key: "1xbrqy"
	}]]);
	const Crosshair = createLucideIcon("Crosshair", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["line", {
			x1: "22",
			x2: "18",
			y1: "12",
			y2: "12",
			key: "l9bcsi"
		}],
		["line", {
			x1: "6",
			x2: "2",
			y1: "12",
			y2: "12",
			key: "13hhkx"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "6",
			y2: "2",
			key: "10w3f3"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "22",
			y2: "18",
			key: "15g9kq"
		}]
	]);
	const Crown = createLucideIcon("Crown", [["path", {
		d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
		key: "1vdc57"
	}], ["path", {
		d: "M5 21h14",
		key: "11awu3"
	}]]);
	const Cuboid = createLucideIcon("Cuboid", [
		["path", {
			d: "m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.17.05l9.95-6.12a2 2 0 0 0 .95-1.7V8.06a2 2 0 0 0-.88-1.66Z",
			key: "1u2ovd"
		}],
		["path", {
			d: "M10 22v-8L2.25 9.15",
			key: "11pn4q"
		}],
		["path", {
			d: "m10 14 11.77-6.87",
			key: "1kt1wh"
		}]
	]);
	const CupSoda = createLucideIcon("CupSoda", [
		["path", {
			d: "m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8",
			key: "8166m8"
		}],
		["path", {
			d: "M5 8h14",
			key: "pcz4l3"
		}],
		["path", {
			d: "M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0",
			key: "yjz344"
		}],
		["path", {
			d: "m12 8 1-6h2",
			key: "3ybfa4"
		}]
	]);
	const Currency = createLucideIcon("Currency", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "8",
			key: "46899m"
		}],
		["line", {
			x1: "3",
			x2: "6",
			y1: "3",
			y2: "6",
			key: "1jkytn"
		}],
		["line", {
			x1: "21",
			x2: "18",
			y1: "3",
			y2: "6",
			key: "14zfjt"
		}],
		["line", {
			x1: "3",
			x2: "6",
			y1: "21",
			y2: "18",
			key: "iusuec"
		}],
		["line", {
			x1: "21",
			x2: "18",
			y1: "21",
			y2: "18",
			key: "yj2dd7"
		}]
	]);
	const Cylinder = createLucideIcon("Cylinder", [["ellipse", {
		cx: "12",
		cy: "5",
		rx: "9",
		ry: "3",
		key: "msslwz"
	}], ["path", {
		d: "M3 5v14a9 3 0 0 0 18 0V5",
		key: "aqi0yr"
	}]]);
	const Dam = createLucideIcon("Dam", [
		["path", {
			d: "M11 11.31c1.17.56 1.54 1.69 3.5 1.69 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
			key: "157kva"
		}],
		["path", {
			d: "M11.75 18c.35.5 1.45 1 2.75 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
			key: "d7q6m6"
		}],
		["path", {
			d: "M2 10h4",
			key: "l0bgd4"
		}],
		["path", {
			d: "M2 14h4",
			key: "1gsvsf"
		}],
		["path", {
			d: "M2 18h4",
			key: "1bu2t1"
		}],
		["path", {
			d: "M2 6h4",
			key: "aawbzj"
		}],
		["path", {
			d: "M7 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1L10 4a1 1 0 0 0-1-1z",
			key: "pr6s65"
		}]
	]);
	const DatabaseBackup = createLucideIcon("DatabaseBackup", [
		["ellipse", {
			cx: "12",
			cy: "5",
			rx: "9",
			ry: "3",
			key: "msslwz"
		}],
		["path", {
			d: "M3 12a9 3 0 0 0 5 2.69",
			key: "1ui2ym"
		}],
		["path", {
			d: "M21 9.3V5",
			key: "6k6cib"
		}],
		["path", {
			d: "M3 5v14a9 3 0 0 0 6.47 2.88",
			key: "i62tjy"
		}],
		["path", {
			d: "M12 12v4h4",
			key: "1bxaet"
		}],
		["path", {
			d: "M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16",
			key: "1f4ei9"
		}]
	]);
	const DatabaseZap = createLucideIcon("DatabaseZap", [
		["ellipse", {
			cx: "12",
			cy: "5",
			rx: "9",
			ry: "3",
			key: "msslwz"
		}],
		["path", {
			d: "M3 5V19A9 3 0 0 0 15 21.84",
			key: "14ibmq"
		}],
		["path", {
			d: "M21 5V8",
			key: "1marbg"
		}],
		["path", {
			d: "M21 12L18 17H22L19 22",
			key: "zafso"
		}],
		["path", {
			d: "M3 12A9 3 0 0 0 14.59 14.87",
			key: "1y4wr8"
		}]
	]);
	const Database = createLucideIcon("Database", [
		["ellipse", {
			cx: "12",
			cy: "5",
			rx: "9",
			ry: "3",
			key: "msslwz"
		}],
		["path", {
			d: "M3 5V19A9 3 0 0 0 21 19V5",
			key: "1wlel7"
		}],
		["path", {
			d: "M3 12A9 3 0 0 0 21 12",
			key: "mv7ke4"
		}]
	]);
	const Delete = createLucideIcon("Delete", [
		["path", {
			d: "M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z",
			key: "1yo7s0"
		}],
		["path", {
			d: "m12 9 6 6",
			key: "anjzzh"
		}],
		["path", {
			d: "m18 9-6 6",
			key: "1fp51s"
		}]
	]);
	const Dessert = createLucideIcon("Dessert", [
		["circle", {
			cx: "12",
			cy: "4",
			r: "2",
			key: "muu5ef"
		}],
		["path", {
			d: "M10.2 3.2C5.5 4 2 8.1 2 13a2 2 0 0 0 4 0v-1a2 2 0 0 1 4 0v4a2 2 0 0 0 4 0v-4a2 2 0 0 1 4 0v1a2 2 0 0 0 4 0c0-4.9-3.5-9-8.2-9.8",
			key: "lfo06j"
		}],
		["path", {
			d: "M3.2 14.8a9 9 0 0 0 17.6 0",
			key: "12xarc"
		}]
	]);
	const Diameter = createLucideIcon("Diameter", [
		["circle", {
			cx: "19",
			cy: "19",
			r: "2",
			key: "17f5cg"
		}],
		["circle", {
			cx: "5",
			cy: "5",
			r: "2",
			key: "1gwv83"
		}],
		["path", {
			d: "M6.48 3.66a10 10 0 0 1 13.86 13.86",
			key: "xr8kdq"
		}],
		["path", {
			d: "m6.41 6.41 11.18 11.18",
			key: "uhpjw7"
		}],
		["path", {
			d: "M3.66 6.48a10 10 0 0 0 13.86 13.86",
			key: "cldpwv"
		}]
	]);
	const DiamondMinus = createLucideIcon("DiamondMinus", [["path", {
		d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z",
		key: "1ey20j"
	}], ["path", {
		d: "M8 12h8",
		key: "1wcyev"
	}]]);
	const DiamondPercent = createLucideIcon("DiamondPercent", [
		["path", {
			d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z",
			key: "1tpxz2"
		}],
		["path", {
			d: "M9.2 9.2h.01",
			key: "1b7bvt"
		}],
		["path", {
			d: "m14.5 9.5-5 5",
			key: "17q4r4"
		}],
		["path", {
			d: "M14.7 14.8h.01",
			key: "17nsh4"
		}]
	]);
	const DiamondPlus = createLucideIcon("DiamondPlus", [
		["path", {
			d: "M12 8v8",
			key: "napkw2"
		}],
		["path", {
			d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z",
			key: "1ey20j"
		}],
		["path", {
			d: "M8 12h8",
			key: "1wcyev"
		}]
	]);
	const Diamond = createLucideIcon("Diamond", [["path", {
		d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z",
		key: "1f1r0c"
	}]]);
	const Dice1 = createLucideIcon("Dice1", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		ry: "2",
		key: "1m3agn"
	}], ["path", {
		d: "M12 12h.01",
		key: "1mp3jc"
	}]]);
	const Dice2 = createLucideIcon("Dice2", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			ry: "2",
			key: "1m3agn"
		}],
		["path", {
			d: "M15 9h.01",
			key: "x1ddxp"
		}],
		["path", {
			d: "M9 15h.01",
			key: "fzyn71"
		}]
	]);
	const Dice3 = createLucideIcon("Dice3", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			ry: "2",
			key: "1m3agn"
		}],
		["path", {
			d: "M16 8h.01",
			key: "cr5u4v"
		}],
		["path", {
			d: "M12 12h.01",
			key: "1mp3jc"
		}],
		["path", {
			d: "M8 16h.01",
			key: "18s6g9"
		}]
	]);
	const Dice4 = createLucideIcon("Dice4", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			ry: "2",
			key: "1m3agn"
		}],
		["path", {
			d: "M16 8h.01",
			key: "cr5u4v"
		}],
		["path", {
			d: "M8 8h.01",
			key: "1e4136"
		}],
		["path", {
			d: "M8 16h.01",
			key: "18s6g9"
		}],
		["path", {
			d: "M16 16h.01",
			key: "1f9h7w"
		}]
	]);
	const Dice5 = createLucideIcon("Dice5", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			ry: "2",
			key: "1m3agn"
		}],
		["path", {
			d: "M16 8h.01",
			key: "cr5u4v"
		}],
		["path", {
			d: "M8 8h.01",
			key: "1e4136"
		}],
		["path", {
			d: "M8 16h.01",
			key: "18s6g9"
		}],
		["path", {
			d: "M16 16h.01",
			key: "1f9h7w"
		}],
		["path", {
			d: "M12 12h.01",
			key: "1mp3jc"
		}]
	]);
	const Dice6 = createLucideIcon("Dice6", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			ry: "2",
			key: "1m3agn"
		}],
		["path", {
			d: "M16 8h.01",
			key: "cr5u4v"
		}],
		["path", {
			d: "M16 12h.01",
			key: "1l6xoz"
		}],
		["path", {
			d: "M16 16h.01",
			key: "1f9h7w"
		}],
		["path", {
			d: "M8 8h.01",
			key: "1e4136"
		}],
		["path", {
			d: "M8 12h.01",
			key: "czm47f"
		}],
		["path", {
			d: "M8 16h.01",
			key: "18s6g9"
		}]
	]);
	const Dices = createLucideIcon("Dices", [
		["rect", {
			width: "12",
			height: "12",
			x: "2",
			y: "10",
			rx: "2",
			ry: "2",
			key: "6agr2n"
		}],
		["path", {
			d: "m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6",
			key: "1o487t"
		}],
		["path", {
			d: "M6 18h.01",
			key: "uhywen"
		}],
		["path", {
			d: "M10 14h.01",
			key: "ssrbsk"
		}],
		["path", {
			d: "M15 6h.01",
			key: "cblpky"
		}],
		["path", {
			d: "M18 9h.01",
			key: "2061c0"
		}]
	]);
	const Diff = createLucideIcon("Diff", [
		["path", {
			d: "M12 3v14",
			key: "7cf3v8"
		}],
		["path", {
			d: "M5 10h14",
			key: "elsbfy"
		}],
		["path", {
			d: "M5 21h14",
			key: "11awu3"
		}]
	]);
	const Disc2 = createLucideIcon("Disc2", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "4",
			key: "4exip2"
		}],
		["path", {
			d: "M12 12h.01",
			key: "1mp3jc"
		}]
	]);
	const Disc3 = createLucideIcon("Disc3", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M6 12c0-1.7.7-3.2 1.8-4.2",
			key: "oqkarx"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "2",
			key: "1c9p78"
		}],
		["path", {
			d: "M18 12c0 1.7-.7 3.2-1.8 4.2",
			key: "1eah9h"
		}]
	]);
	const DiscAlbum = createLucideIcon("DiscAlbum", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "5",
			key: "nd82uf"
		}],
		["path", {
			d: "M12 12h.01",
			key: "1mp3jc"
		}]
	]);
	const Disc = createLucideIcon("Disc", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["circle", {
		cx: "12",
		cy: "12",
		r: "2",
		key: "1c9p78"
	}]]);
	const Divide = createLucideIcon("Divide", [
		["circle", {
			cx: "12",
			cy: "6",
			r: "1",
			key: "1bh7o1"
		}],
		["line", {
			x1: "5",
			x2: "19",
			y1: "12",
			y2: "12",
			key: "13b5wn"
		}],
		["circle", {
			cx: "12",
			cy: "18",
			r: "1",
			key: "lqb9t5"
		}]
	]);
	const DnaOff = createLucideIcon("DnaOff", [
		["path", {
			d: "M15 2c-1.35 1.5-2.092 3-2.5 4.5L14 8",
			key: "1bivrr"
		}],
		["path", {
			d: "m17 6-2.891-2.891",
			key: "xu6p2f"
		}],
		["path", {
			d: "M2 15c3.333-3 6.667-3 10-3",
			key: "nxix30"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "m20 9 .891.891",
			key: "3xwk7g"
		}],
		["path", {
			d: "M22 9c-1.5 1.35-3 2.092-4.5 2.5l-1-1",
			key: "18cutr"
		}],
		["path", {
			d: "M3.109 14.109 4 15",
			key: "q76aoh"
		}],
		["path", {
			d: "m6.5 12.5 1 1",
			key: "cs35ky"
		}],
		["path", {
			d: "m7 18 2.891 2.891",
			key: "1sisit"
		}],
		["path", {
			d: "M9 22c1.35-1.5 2.092-3 2.5-4.5L10 16",
			key: "rlvei3"
		}]
	]);
	const Dna = createLucideIcon("Dna", [
		["path", {
			d: "m10 16 1.5 1.5",
			key: "11lckj"
		}],
		["path", {
			d: "m14 8-1.5-1.5",
			key: "1ohn8i"
		}],
		["path", {
			d: "M15 2c-1.798 1.998-2.518 3.995-2.807 5.993",
			key: "80uv8i"
		}],
		["path", {
			d: "m16.5 10.5 1 1",
			key: "696xn5"
		}],
		["path", {
			d: "m17 6-2.891-2.891",
			key: "xu6p2f"
		}],
		["path", {
			d: "M2 15c6.667-6 13.333 0 20-6",
			key: "1pyr53"
		}],
		["path", {
			d: "m20 9 .891.891",
			key: "3xwk7g"
		}],
		["path", {
			d: "M3.109 14.109 4 15",
			key: "q76aoh"
		}],
		["path", {
			d: "m6.5 12.5 1 1",
			key: "cs35ky"
		}],
		["path", {
			d: "m7 18 2.891 2.891",
			key: "1sisit"
		}],
		["path", {
			d: "M9 22c1.798-1.998 2.518-3.995 2.807-5.993",
			key: "q3hbxp"
		}]
	]);
	const Dock = createLucideIcon("Dock", [
		["path", {
			d: "M2 8h20",
			key: "d11cs7"
		}],
		["rect", {
			width: "20",
			height: "16",
			x: "2",
			y: "4",
			rx: "2",
			key: "18n3k1"
		}],
		["path", {
			d: "M6 16h12",
			key: "u522kt"
		}]
	]);
	const Dog = createLucideIcon("Dog", [
		["path", {
			d: "M11.25 16.25h1.5L12 17z",
			key: "w7jh35"
		}],
		["path", {
			d: "M16 14v.5",
			key: "1lajdz"
		}],
		["path", {
			d: "M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309",
			key: "u7s9ue"
		}],
		["path", {
			d: "M8 14v.5",
			key: "1nzgdb"
		}],
		["path", {
			d: "M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5",
			key: "v8hric"
		}]
	]);
	const DollarSign = createLucideIcon("DollarSign", [["line", {
		x1: "12",
		x2: "12",
		y1: "2",
		y2: "22",
		key: "7eqyqh"
	}], ["path", {
		d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
		key: "1b0p4s"
	}]]);
	const Donut = createLucideIcon("Donut", [["path", {
		d: "M20.5 10a2.5 2.5 0 0 1-2.4-3H18a2.95 2.95 0 0 1-2.6-4.4 10 10 0 1 0 6.3 7.1c-.3.2-.8.3-1.2.3",
		key: "19sr3x"
	}], ["circle", {
		cx: "12",
		cy: "12",
		r: "3",
		key: "1v7zrd"
	}]]);
	const DoorClosed = createLucideIcon("DoorClosed", [
		["path", {
			d: "M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14",
			key: "36qu9e"
		}],
		["path", {
			d: "M2 20h20",
			key: "owomy5"
		}],
		["path", {
			d: "M14 12v.01",
			key: "xfcn54"
		}]
	]);
	const DoorOpen = createLucideIcon("DoorOpen", [
		["path", {
			d: "M13 4h3a2 2 0 0 1 2 2v14",
			key: "hrm0s9"
		}],
		["path", {
			d: "M2 20h3",
			key: "1gaodv"
		}],
		["path", {
			d: "M13 20h9",
			key: "s90cdi"
		}],
		["path", {
			d: "M10 12v.01",
			key: "vx6srw"
		}],
		["path", {
			d: "M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z",
			key: "199qr4"
		}]
	]);
	const Dot = createLucideIcon("Dot", [["circle", {
		cx: "12.1",
		cy: "12.1",
		r: "1",
		key: "18d7e5"
	}]]);
	const Download$1 = createLucideIcon("Download", [
		["path", {
			d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
			key: "ih7n3h"
		}],
		["polyline", {
			points: "7 10 12 15 17 10",
			key: "2ggqvy"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "15",
			y2: "3",
			key: "1vk2je"
		}]
	]);
	const DraftingCompass = createLucideIcon("DraftingCompass", [
		["path", {
			d: "m12.99 6.74 1.93 3.44",
			key: "iwagvd"
		}],
		["path", {
			d: "M19.136 12a10 10 0 0 1-14.271 0",
			key: "ppmlo4"
		}],
		["path", {
			d: "m21 21-2.16-3.84",
			key: "vylbct"
		}],
		["path", {
			d: "m3 21 8.02-14.26",
			key: "1ssaw4"
		}],
		["circle", {
			cx: "12",
			cy: "5",
			r: "2",
			key: "f1ur92"
		}]
	]);
	const Drama = createLucideIcon("Drama", [
		["path", {
			d: "M10 11h.01",
			key: "d2at3l"
		}],
		["path", {
			d: "M14 6h.01",
			key: "k028ub"
		}],
		["path", {
			d: "M18 6h.01",
			key: "1v4wsw"
		}],
		["path", {
			d: "M6.5 13.1h.01",
			key: "1748ia"
		}],
		["path", {
			d: "M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3",
			key: "172yzv"
		}],
		["path", {
			d: "M17.4 9.9c-.8.8-2 .8-2.8 0",
			key: "1obv0w"
		}],
		["path", {
			d: "M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7",
			key: "rqjl8i"
		}],
		["path", {
			d: "M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4",
			key: "1mr6wy"
		}]
	]);
	const Dribbble = createLucideIcon("Dribbble", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94",
			key: "hpej1"
		}],
		["path", {
			d: "M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32",
			key: "1tr44o"
		}],
		["path", {
			d: "M8.56 2.75c4.37 6 6 9.42 8 17.72",
			key: "kbh691"
		}]
	]);
	const Drill = createLucideIcon("Drill", [
		["path", {
			d: "M10 18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a3 3 0 0 1-3-3 1 1 0 0 1 1-1z",
			key: "ioqxb1"
		}],
		["path", {
			d: "M13 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1l-.81 3.242a1 1 0 0 1-.97.758H8",
			key: "1rs59n"
		}],
		["path", {
			d: "M14 4h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3",
			key: "105ega"
		}],
		["path", {
			d: "M18 6h4",
			key: "66u95g"
		}],
		["path", {
			d: "m5 10-2 8",
			key: "xt2lic"
		}],
		["path", {
			d: "m7 18 2-8",
			key: "1bzku2"
		}]
	]);
	const DropletOff = createLucideIcon("DropletOff", [
		["path", {
			d: "M18.715 13.186C18.29 11.858 17.384 10.607 16 9.5c-2-1.6-3.5-4-4-6.5a10.7 10.7 0 0 1-.884 2.586",
			key: "8suz2t"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M8.795 8.797A11 11 0 0 1 8 9.5C6 11.1 5 13 5 15a7 7 0 0 0 13.222 3.208",
			key: "19dw9m"
		}]
	]);
	const Droplet = createLucideIcon("Droplet", [["path", {
		d: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",
		key: "c7niix"
	}]]);
	const Droplets = createLucideIcon("Droplets", [["path", {
		d: "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",
		key: "1ptgy4"
	}], ["path", {
		d: "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",
		key: "1sl1rz"
	}]]);
	const Drum = createLucideIcon("Drum", [
		["path", {
			d: "m2 2 8 8",
			key: "1v6059"
		}],
		["path", {
			d: "m22 2-8 8",
			key: "173r8a"
		}],
		["ellipse", {
			cx: "12",
			cy: "9",
			rx: "10",
			ry: "5",
			key: "liohsx"
		}],
		["path", {
			d: "M7 13.4v7.9",
			key: "1yi6u9"
		}],
		["path", {
			d: "M12 14v8",
			key: "1tn2tj"
		}],
		["path", {
			d: "M17 13.4v7.9",
			key: "eqz2v3"
		}],
		["path", {
			d: "M2 9v8a10 5 0 0 0 20 0V9",
			key: "1750ul"
		}]
	]);
	const Drumstick = createLucideIcon("Drumstick", [["path", {
		d: "M15.4 15.63a7.875 6 135 1 1 6.23-6.23 4.5 3.43 135 0 0-6.23 6.23",
		key: "1dtqwm"
	}], ["path", {
		d: "m8.29 12.71-2.6 2.6a2.5 2.5 0 1 0-1.65 4.65A2.5 2.5 0 1 0 8.7 18.3l2.59-2.59",
		key: "1oq1fw"
	}]]);
	const Dumbbell = createLucideIcon("Dumbbell", [
		["path", {
			d: "M14.4 14.4 9.6 9.6",
			key: "ic80wn"
		}],
		["path", {
			d: "M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z",
			key: "nnl7wr"
		}],
		["path", {
			d: "m21.5 21.5-1.4-1.4",
			key: "1f1ice"
		}],
		["path", {
			d: "M3.9 3.9 2.5 2.5",
			key: "1evmna"
		}],
		["path", {
			d: "M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z",
			key: "yhosts"
		}]
	]);
	const EarOff = createLucideIcon("EarOff", [
		["path", {
			d: "M6 18.5a3.5 3.5 0 1 0 7 0c0-1.57.92-2.52 2.04-3.46",
			key: "1qngmn"
		}],
		["path", {
			d: "M6 8.5c0-.75.13-1.47.36-2.14",
			key: "b06bma"
		}],
		["path", {
			d: "M8.8 3.15A6.5 6.5 0 0 1 19 8.5c0 1.63-.44 2.81-1.09 3.76",
			key: "g10hsz"
		}],
		["path", {
			d: "M12.5 6A2.5 2.5 0 0 1 15 8.5M10 13a2 2 0 0 0 1.82-1.18",
			key: "ygzou7"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Ear = createLucideIcon("Ear", [["path", {
		d: "M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0",
		key: "1dfaln"
	}], ["path", {
		d: "M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4",
		key: "1qnva7"
	}]]);
	const EarthLock = createLucideIcon("EarthLock", [
		["path", {
			d: "M7 3.34V5a3 3 0 0 0 3 3",
			key: "w732o8"
		}],
		["path", {
			d: "M11 21.95V18a2 2 0 0 0-2-2 2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",
			key: "f02343"
		}],
		["path", {
			d: "M21.54 15H17a2 2 0 0 0-2 2v4.54",
			key: "1djwo0"
		}],
		["path", {
			d: "M12 2a10 10 0 1 0 9.54 13",
			key: "zjsr6q"
		}],
		["path", {
			d: "M20 6V4a2 2 0 1 0-4 0v2",
			key: "1of5e8"
		}],
		["rect", {
			width: "8",
			height: "5",
			x: "14",
			y: "6",
			rx: "1",
			key: "1fmf51"
		}]
	]);
	const Earth = createLucideIcon("Earth", [
		["path", {
			d: "M21.54 15H17a2 2 0 0 0-2 2v4.54",
			key: "1djwo0"
		}],
		["path", {
			d: "M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",
			key: "1tzkfa"
		}],
		["path", {
			d: "M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",
			key: "14pb5j"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}]
	]);
	const Eclipse = createLucideIcon("Eclipse", [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "M12 2a7 7 0 1 0 10 10",
		key: "1yuj32"
	}]]);
	const EggFried = createLucideIcon("EggFried", [["circle", {
		cx: "11.5",
		cy: "12.5",
		r: "3.5",
		key: "1cl1mi"
	}], ["path", {
		d: "M3 8c0-3.5 2.5-6 6.5-6 5 0 4.83 3 7.5 5s5 2 5 6c0 4.5-2.5 6.5-7 6.5-2.5 0-2.5 2.5-6 2.5s-7-2-7-5.5c0-3 1.5-3 1.5-5C3.5 10 3 9 3 8Z",
		key: "165ef9"
	}]]);
	const EggOff = createLucideIcon("EggOff", [
		["path", {
			d: "M6.399 6.399C5.362 8.157 4.65 10.189 4.5 12c-.37 4.43 1.27 9.95 7.5 10 3.256-.026 5.259-1.547 6.375-3.625",
			key: "6et380"
		}],
		["path", {
			d: "M19.532 13.875A14.07 14.07 0 0 0 19.5 12c-.36-4.34-3.95-9.96-7.5-10-1.04.012-2.082.502-3.046 1.297",
			key: "gcdc3f"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Egg = createLucideIcon("Egg", [["path", {
		d: "M12 22c6.23-.05 7.87-5.57 7.5-10-.36-4.34-3.95-9.96-7.5-10-3.55.04-7.14 5.66-7.5 10-.37 4.43 1.27 9.95 7.5 10z",
		key: "1c39pg"
	}]]);
	const EllipsisVertical = createLucideIcon("EllipsisVertical", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "1",
			key: "41hilf"
		}],
		["circle", {
			cx: "12",
			cy: "5",
			r: "1",
			key: "gxeob9"
		}],
		["circle", {
			cx: "12",
			cy: "19",
			r: "1",
			key: "lyex9k"
		}]
	]);
	const Ellipsis = createLucideIcon("Ellipsis", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "1",
			key: "41hilf"
		}],
		["circle", {
			cx: "19",
			cy: "12",
			r: "1",
			key: "1wjl8i"
		}],
		["circle", {
			cx: "5",
			cy: "12",
			r: "1",
			key: "1pcz8c"
		}]
	]);
	const EqualApproximately = createLucideIcon("EqualApproximately", [["path", {
		d: "M5 15a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0",
		key: "yrdkhy"
	}], ["path", {
		d: "M5 9a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0",
		key: "gzkvyz"
	}]]);
	const EqualNot = createLucideIcon("EqualNot", [
		["line", {
			x1: "5",
			x2: "19",
			y1: "9",
			y2: "9",
			key: "1nwqeh"
		}],
		["line", {
			x1: "5",
			x2: "19",
			y1: "15",
			y2: "15",
			key: "g8yjpy"
		}],
		["line", {
			x1: "19",
			x2: "5",
			y1: "5",
			y2: "19",
			key: "1x9vlm"
		}]
	]);
	const Equal = createLucideIcon("Equal", [["line", {
		x1: "5",
		x2: "19",
		y1: "9",
		y2: "9",
		key: "1nwqeh"
	}], ["line", {
		x1: "5",
		x2: "19",
		y1: "15",
		y2: "15",
		key: "g8yjpy"
	}]]);
	const Eraser = createLucideIcon("Eraser", [
		["path", {
			d: "m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21",
			key: "182aya"
		}],
		["path", {
			d: "M22 21H7",
			key: "t4ddhn"
		}],
		["path", {
			d: "m5 11 9 9",
			key: "1mo9qw"
		}]
	]);
	const EthernetPort = createLucideIcon("EthernetPort", [
		["path", {
			d: "m15 20 3-3h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2l3 3z",
			key: "rbahqx"
		}],
		["path", {
			d: "M6 8v1",
			key: "1636ez"
		}],
		["path", {
			d: "M10 8v1",
			key: "1talb4"
		}],
		["path", {
			d: "M14 8v1",
			key: "1rsfgr"
		}],
		["path", {
			d: "M18 8v1",
			key: "gnkwox"
		}]
	]);
	const Euro = createLucideIcon("Euro", [
		["path", {
			d: "M4 10h12",
			key: "1y6xl8"
		}],
		["path", {
			d: "M4 14h9",
			key: "1loblj"
		}],
		["path", {
			d: "M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2",
			key: "1j6lzo"
		}]
	]);
	const Expand = createLucideIcon("Expand", [
		["path", {
			d: "m21 21-6-6m6 6v-4.8m0 4.8h-4.8",
			key: "1c15vz"
		}],
		["path", {
			d: "M3 16.2V21m0 0h4.8M3 21l6-6",
			key: "1fsnz2"
		}],
		["path", {
			d: "M21 7.8V3m0 0h-4.8M21 3l-6 6",
			key: "hawz9i"
		}],
		["path", {
			d: "M3 7.8V3m0 0h4.8M3 3l6 6",
			key: "u9ee12"
		}]
	]);
	const ExternalLink = createLucideIcon("ExternalLink", [
		["path", {
			d: "M15 3h6v6",
			key: "1q9fwt"
		}],
		["path", {
			d: "M10 14 21 3",
			key: "gplh6r"
		}],
		["path", {
			d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
			key: "a6xqqp"
		}]
	]);
	const EyeClosed = createLucideIcon("EyeClosed", [
		["path", {
			d: "m15 18-.722-3.25",
			key: "1j64jw"
		}],
		["path", {
			d: "M2 8a10.645 10.645 0 0 0 20 0",
			key: "1e7gxb"
		}],
		["path", {
			d: "m20 15-1.726-2.05",
			key: "1cnuld"
		}],
		["path", {
			d: "m4 15 1.726-2.05",
			key: "1dsqqd"
		}],
		["path", {
			d: "m9 18 .722-3.25",
			key: "ypw2yx"
		}]
	]);
	const EyeOff$1 = createLucideIcon("EyeOff", [
		["path", {
			d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
			key: "ct8e1f"
		}],
		["path", {
			d: "M14.084 14.158a3 3 0 0 1-4.242-4.242",
			key: "151rxh"
		}],
		["path", {
			d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
			key: "13bj9a"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]);
	const Eye = createLucideIcon("Eye", [["path", {
		d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
		key: "1nclc0"
	}], ["circle", {
		cx: "12",
		cy: "12",
		r: "3",
		key: "1v7zrd"
	}]]);
	const Facebook = createLucideIcon("Facebook", [["path", {
		d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
		key: "1jg4f8"
	}]]);
	const Factory = createLucideIcon("Factory", [
		["path", {
			d: "M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
			key: "159hny"
		}],
		["path", {
			d: "M17 18h1",
			key: "uldtlt"
		}],
		["path", {
			d: "M12 18h1",
			key: "s9uhes"
		}],
		["path", {
			d: "M7 18h1",
			key: "1neino"
		}]
	]);
	const Fan = createLucideIcon("Fan", [["path", {
		d: "M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z",
		key: "484a7f"
	}], ["path", {
		d: "M12 12v.01",
		key: "u5ubse"
	}]]);
	const FastForward = createLucideIcon("FastForward", [["polygon", {
		points: "13 19 22 12 13 5 13 19",
		key: "587y9g"
	}], ["polygon", {
		points: "2 19 11 12 2 5 2 19",
		key: "3pweh0"
	}]]);
	const Feather = createLucideIcon("Feather", [
		["path", {
			d: "M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z",
			key: "18jl4k"
		}],
		["path", {
			d: "M16 8 2 22",
			key: "vp34q"
		}],
		["path", {
			d: "M17.5 15H9",
			key: "1oz8nu"
		}]
	]);
	const Fence = createLucideIcon("Fence", [
		["path", {
			d: "M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z",
			key: "1n2rgs"
		}],
		["path", {
			d: "M6 8h4",
			key: "utf9t1"
		}],
		["path", {
			d: "M6 18h4",
			key: "12yh4b"
		}],
		["path", {
			d: "m12 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z",
			key: "3ha7mj"
		}],
		["path", {
			d: "M14 8h4",
			key: "1r8wg2"
		}],
		["path", {
			d: "M14 18h4",
			key: "1t3kbu"
		}],
		["path", {
			d: "m20 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z",
			key: "dfd4e2"
		}]
	]);
	const FerrisWheel = createLucideIcon("FerrisWheel", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "2",
			key: "1c9p78"
		}],
		["path", {
			d: "M12 2v4",
			key: "3427ic"
		}],
		["path", {
			d: "m6.8 15-3.5 2",
			key: "hjy98k"
		}],
		["path", {
			d: "m20.7 7-3.5 2",
			key: "f08gto"
		}],
		["path", {
			d: "M6.8 9 3.3 7",
			key: "1aevh4"
		}],
		["path", {
			d: "m20.7 17-3.5-2",
			key: "1liqo3"
		}],
		["path", {
			d: "m9 22 3-8 3 8",
			key: "wees03"
		}],
		["path", {
			d: "M8 22h8",
			key: "rmew8v"
		}],
		["path", {
			d: "M18 18.7a9 9 0 1 0-12 0",
			key: "dhzg4g"
		}]
	]);
	const Figma = createLucideIcon("Figma", [
		["path", {
			d: "M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z",
			key: "1340ok"
		}],
		["path", {
			d: "M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z",
			key: "1hz3m3"
		}],
		["path", {
			d: "M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z",
			key: "1oz8n2"
		}],
		["path", {
			d: "M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z",
			key: "1ff65i"
		}],
		["path", {
			d: "M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z",
			key: "pdip6e"
		}]
	]);
	const FileArchive = createLucideIcon("FileArchive", [
		["path", {
			d: "M10 12v-1",
			key: "v7bkov"
		}],
		["path", {
			d: "M10 18v-2",
			key: "1cjy8d"
		}],
		["path", {
			d: "M10 7V6",
			key: "dljcrl"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M15.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 .274 1.01",
			key: "gkbcor"
		}],
		["circle", {
			cx: "10",
			cy: "20",
			r: "2",
			key: "1xzdoj"
		}]
	]);
	const FileAudio2 = createLucideIcon("FileAudio2", [
		["path", {
			d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2",
			key: "17k7jt"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["circle", {
			cx: "3",
			cy: "17",
			r: "1",
			key: "vo6nti"
		}],
		["path", {
			d: "M2 17v-3a4 4 0 0 1 8 0v3",
			key: "1ggdre"
		}],
		["circle", {
			cx: "9",
			cy: "17",
			r: "1",
			key: "bc1fq4"
		}]
	]);
	const FileAudio = createLucideIcon("FileAudio", [
		["path", {
			d: "M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3",
			key: "rslqgf"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0",
			key: "9f7x3i"
		}]
	]);
	const FileAxis3d = createLucideIcon("FileAxis3d", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "m8 18 4-4",
			key: "12zab0"
		}],
		["path", {
			d: "M8 10v8h8",
			key: "tlaukw"
		}]
	]);
	const FileBadge2 = createLucideIcon("FileBadge2", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["circle", {
			cx: "12",
			cy: "10",
			r: "3",
			key: "ilqhr7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "m14 12.5 1 5.5-3-1-3 1 1-5.5",
			key: "14xlky"
		}]
	]);
	const FileBadge = createLucideIcon("FileBadge", [
		["path", {
			d: "M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3",
			key: "12ixgl"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
			key: "u0c8gj"
		}],
		["path", {
			d: "M7 16.5 8 22l-3-1-3 1 1-5.5",
			key: "5gm2nr"
		}]
	]);
	const FileBox = createLucideIcon("FileBox", [
		["path", {
			d: "M14.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",
			key: "16lz6z"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M3 13.1a2 2 0 0 0-1 1.76v3.24a2 2 0 0 0 .97 1.78L6 21.7a2 2 0 0 0 2.03.01L11 19.9a2 2 0 0 0 1-1.76V14.9a2 2 0 0 0-.97-1.78L8 11.3a2 2 0 0 0-2.03-.01Z",
			key: "99pj1s"
		}],
		["path", {
			d: "M7 17v5",
			key: "1yj1jh"
		}],
		["path", {
			d: "M11.7 14.2 7 17l-4.7-2.8",
			key: "1yk8tc"
		}]
	]);
	const FileChartColumnIncreasing = createLucideIcon("FileChartColumnIncreasing", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M8 18v-2",
			key: "qcmpov"
		}],
		["path", {
			d: "M12 18v-4",
			key: "q1q25u"
		}],
		["path", {
			d: "M16 18v-6",
			key: "15y0np"
		}]
	]);
	const FileChartColumn = createLucideIcon("FileChartColumn", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M8 18v-1",
			key: "zg0ygc"
		}],
		["path", {
			d: "M12 18v-6",
			key: "17g6i2"
		}],
		["path", {
			d: "M16 18v-3",
			key: "j5jt4h"
		}]
	]);
	const FileChartLine = createLucideIcon("FileChartLine", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "m16 13-3.5 3.5-2-2L8 17",
			key: "zz7yod"
		}]
	]);
	const FileChartPie = createLucideIcon("FileChartPie", [
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3.5",
			key: "13ddob"
		}],
		["path", {
			d: "M4.017 11.512a6 6 0 1 0 8.466 8.475",
			key: "s6vs5t"
		}],
		["path", {
			d: "M9 16a1 1 0 0 1-1-1v-4c0-.552.45-1.008.995-.917a6 6 0 0 1 4.922 4.922c.091.544-.365.995-.917.995z",
			key: "1dl6s6"
		}]
	]);
	const FileCheck2 = createLucideIcon("FileCheck2", [
		["path", {
			d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",
			key: "1pf5j1"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "m3 15 2 2 4-4",
			key: "1lhrkk"
		}]
	]);
	const FileCheck = createLucideIcon("FileCheck", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "m9 15 2 2 4-4",
			key: "1grp1n"
		}]
	]);
	const FileClock = createLucideIcon("FileClock", [
		["path", {
			d: "M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3",
			key: "37hlfg"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["circle", {
			cx: "8",
			cy: "16",
			r: "6",
			key: "10v15b"
		}],
		["path", {
			d: "M9.5 17.5 8 16.25V14",
			key: "1o80t2"
		}]
	]);
	const FileCode2 = createLucideIcon("FileCode2", [
		["path", {
			d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",
			key: "1pf5j1"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "m5 12-3 3 3 3",
			key: "oke12k"
		}],
		["path", {
			d: "m9 18 3-3-3-3",
			key: "112psh"
		}]
	]);
	const FileCode = createLucideIcon("FileCode", [
		["path", {
			d: "M10 12.5 8 15l2 2.5",
			key: "1tg20x"
		}],
		["path", {
			d: "m14 12.5 2 2.5-2 2.5",
			key: "yinavb"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z",
			key: "1mlx9k"
		}]
	]);
	const FileCog = createLucideIcon("FileCog", [
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "m3.2 12.9-.9-.4",
			key: "1i3dj5"
		}],
		["path", {
			d: "m3.2 15.1-.9.4",
			key: "1fvgj0"
		}],
		["path", {
			d: "M4.677 21.5a2 2 0 0 0 1.313.5H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2.5",
			key: "1yo3oz"
		}],
		["path", {
			d: "m4.9 11.2-.4-.9",
			key: "otmhb9"
		}],
		["path", {
			d: "m4.9 16.8-.4.9",
			key: "1b8z07"
		}],
		["path", {
			d: "m7.5 10.3-.4.9",
			key: "11k65u"
		}],
		["path", {
			d: "m7.5 17.7-.4-.9",
			key: "431x55"
		}],
		["path", {
			d: "m9.7 12.5-.9.4",
			key: "87sjan"
		}],
		["path", {
			d: "m9.7 15.5-.9-.4",
			key: "khqm91"
		}],
		["circle", {
			cx: "6",
			cy: "14",
			r: "3",
			key: "a1xfv6"
		}]
	]);
	const FileDiff = createLucideIcon("FileDiff", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M9 10h6",
			key: "9gxzsh"
		}],
		["path", {
			d: "M12 13V7",
			key: "h0r20n"
		}],
		["path", {
			d: "M9 17h6",
			key: "r8uit2"
		}]
	]);
	const FileDigit = createLucideIcon("FileDigit", [
		["path", {
			d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",
			key: "1pf5j1"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["rect", {
			width: "4",
			height: "6",
			x: "2",
			y: "12",
			rx: "2",
			key: "jm304g"
		}],
		["path", {
			d: "M10 12h2v6",
			key: "12zw74"
		}],
		["path", {
			d: "M10 18h4",
			key: "1ulq68"
		}]
	]);
	const FileDown = createLucideIcon("FileDown", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M12 18v-6",
			key: "17g6i2"
		}],
		["path", {
			d: "m9 15 3 3 3-3",
			key: "1npd3o"
		}]
	]);
	const FileHeart = createLucideIcon("FileHeart", [
		["path", {
			d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2",
			key: "17k7jt"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M10.29 10.7a2.43 2.43 0 0 0-2.66-.52c-.29.12-.56.3-.78.53l-.35.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L6.5 18l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z",
			key: "1c1fso"
		}]
	]);
	const FileImage = createLucideIcon("FileImage", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["circle", {
			cx: "10",
			cy: "12",
			r: "2",
			key: "737tya"
		}],
		["path", {
			d: "m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22",
			key: "wt3hpn"
		}]
	]);
	const FileInput = createLucideIcon("FileInput", [
		["path", {
			d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",
			key: "1pf5j1"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M2 15h10",
			key: "jfw4w8"
		}],
		["path", {
			d: "m9 18 3-3-3-3",
			key: "112psh"
		}]
	]);
	const FileJson2 = createLucideIcon("FileJson2", [
		["path", {
			d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",
			key: "1pf5j1"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M4 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",
			key: "fq0c9t"
		}],
		["path", {
			d: "M8 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",
			key: "4gibmv"
		}]
	]);
	const FileJson = createLucideIcon("FileJson", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",
			key: "1oajmo"
		}],
		["path", {
			d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",
			key: "mpwhp6"
		}]
	]);
	const FileKey2 = createLucideIcon("FileKey2", [
		["path", {
			d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v6",
			key: "rc0qvx"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["circle", {
			cx: "4",
			cy: "16",
			r: "2",
			key: "1ehqvc"
		}],
		["path", {
			d: "m10 10-4.5 4.5",
			key: "7fwrp6"
		}],
		["path", {
			d: "m9 11 1 1",
			key: "wa6s5q"
		}]
	]);
	const FileKey = createLucideIcon("FileKey", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["circle", {
			cx: "10",
			cy: "16",
			r: "2",
			key: "4ckbqe"
		}],
		["path", {
			d: "m16 10-4.5 4.5",
			key: "7p3ebg"
		}],
		["path", {
			d: "m15 11 1 1",
			key: "1bsyx3"
		}]
	]);
	const FileLock2 = createLucideIcon("FileLock2", [
		["path", {
			d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v1",
			key: "jmtmu2"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["rect", {
			width: "8",
			height: "5",
			x: "2",
			y: "13",
			rx: "1",
			key: "10y5wo"
		}],
		["path", {
			d: "M8 13v-2a2 2 0 1 0-4 0v2",
			key: "1pdxzg"
		}]
	]);
	const FileLock = createLucideIcon("FileLock", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["rect", {
			width: "8",
			height: "6",
			x: "8",
			y: "12",
			rx: "1",
			key: "3yr8at"
		}],
		["path", {
			d: "M10 12v-2a2 2 0 1 1 4 0v2",
			key: "j4i8d"
		}]
	]);
	const FileMinus2 = createLucideIcon("FileMinus2", [
		["path", {
			d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",
			key: "1pf5j1"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M3 15h6",
			key: "4e2qda"
		}]
	]);
	const FileMinus = createLucideIcon("FileMinus", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M9 15h6",
			key: "cctwl0"
		}]
	]);
	const FileMusic = createLucideIcon("FileMusic", [
		["path", {
			d: "M10.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v8.4",
			key: "1d3kfm"
		}],
		["path", {
			d: "M8 18v-7.7L16 9v7",
			key: "1oie6o"
		}],
		["circle", {
			cx: "14",
			cy: "16",
			r: "2",
			key: "1bzzi3"
		}],
		["circle", {
			cx: "6",
			cy: "18",
			r: "2",
			key: "1fncim"
		}]
	]);
	const FileOutput = createLucideIcon("FileOutput", [
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M4 7V4a2 2 0 0 1 2-2 2 2 0 0 0-2 2",
			key: "1vk7w2"
		}],
		["path", {
			d: "M4.063 20.999a2 2 0 0 0 2 1L18 22a2 2 0 0 0 2-2V7l-5-5H6",
			key: "1jink5"
		}],
		["path", {
			d: "m5 11-3 3",
			key: "1dgrs4"
		}],
		["path", {
			d: "m5 17-3-3h10",
			key: "1mvvaf"
		}]
	]);
	const FilePenLine = createLucideIcon("FilePenLine", [
		["path", {
			d: "m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2",
			key: "142zxg"
		}],
		["path", {
			d: "M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
			key: "2t3380"
		}],
		["path", {
			d: "M8 18h1",
			key: "13wk12"
		}]
	]);
	const FilePen = createLucideIcon("FilePen", [
		["path", {
			d: "M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5",
			key: "1couwa"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
			key: "1y4qbx"
		}]
	]);
	const FilePlus2 = createLucideIcon("FilePlus2", [
		["path", {
			d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",
			key: "1pf5j1"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M3 15h6",
			key: "4e2qda"
		}],
		["path", {
			d: "M6 12v6",
			key: "1u72j0"
		}]
	]);
	const FilePlus = createLucideIcon("FilePlus", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M9 15h6",
			key: "cctwl0"
		}],
		["path", {
			d: "M12 18v-6",
			key: "17g6i2"
		}]
	]);
	const FileQuestion = createLucideIcon("FileQuestion", [
		["path", {
			d: "M12 17h.01",
			key: "p32p05"
		}],
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z",
			key: "1mlx9k"
		}],
		["path", {
			d: "M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3",
			key: "mhlwft"
		}]
	]);
	const FileScan = createLucideIcon("FileScan", [
		["path", {
			d: "M20 10V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4",
			key: "1rdf37"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M16 14a2 2 0 0 0-2 2",
			key: "ceaadl"
		}],
		["path", {
			d: "M20 14a2 2 0 0 1 2 2",
			key: "1ny6zw"
		}],
		["path", {
			d: "M20 22a2 2 0 0 0 2-2",
			key: "1l9q4k"
		}],
		["path", {
			d: "M16 22a2 2 0 0 1-2-2",
			key: "1wqh5n"
		}]
	]);
	const FileSearch2 = createLucideIcon("FileSearch2", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["circle", {
			cx: "11.5",
			cy: "14.5",
			r: "2.5",
			key: "1bq0ko"
		}],
		["path", {
			d: "M13.3 16.3 15 18",
			key: "2quom7"
		}]
	]);
	const FileSearch = createLucideIcon("FileSearch", [
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3",
			key: "ms7g94"
		}],
		["path", {
			d: "m9 18-1.5-1.5",
			key: "1j6qii"
		}],
		["circle", {
			cx: "5",
			cy: "14",
			r: "3",
			key: "ufru5t"
		}]
	]);
	const FileSliders = createLucideIcon("FileSliders", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M8 12h8",
			key: "1wcyev"
		}],
		["path", {
			d: "M10 11v2",
			key: "1s651w"
		}],
		["path", {
			d: "M8 17h8",
			key: "wh5c61"
		}],
		["path", {
			d: "M14 16v2",
			key: "12fp5e"
		}]
	]);
	const FileSpreadsheet = createLucideIcon("FileSpreadsheet", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M8 13h2",
			key: "yr2amv"
		}],
		["path", {
			d: "M14 13h2",
			key: "un5t4a"
		}],
		["path", {
			d: "M8 17h2",
			key: "2yhykz"
		}],
		["path", {
			d: "M14 17h2",
			key: "10kma7"
		}]
	]);
	const FileStack = createLucideIcon("FileStack", [
		["path", {
			d: "M21 7h-3a2 2 0 0 1-2-2V2",
			key: "9rb54x"
		}],
		["path", {
			d: "M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17Z",
			key: "1059l0"
		}],
		["path", {
			d: "M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15",
			key: "16874u"
		}],
		["path", {
			d: "M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11",
			key: "k2ox98"
		}]
	]);
	const FileSymlink = createLucideIcon("FileSymlink", [
		["path", {
			d: "m10 18 3-3-3-3",
			key: "18f6ys"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M4 11V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7",
			key: "50q2rw"
		}]
	]);
	const FileTerminal = createLucideIcon("FileTerminal", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "m8 16 2-2-2-2",
			key: "10vzyd"
		}],
		["path", {
			d: "M12 18h4",
			key: "1wd2n7"
		}]
	]);
	const FileText = createLucideIcon("FileText", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M10 9H8",
			key: "b1mrlr"
		}],
		["path", {
			d: "M16 13H8",
			key: "t4e002"
		}],
		["path", {
			d: "M16 17H8",
			key: "z1uh3a"
		}]
	]);
	const FileType2 = createLucideIcon("FileType2", [
		["path", {
			d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",
			key: "1pf5j1"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M2 13v-1h6v1",
			key: "1dh9dg"
		}],
		["path", {
			d: "M5 12v6",
			key: "150t9c"
		}],
		["path", {
			d: "M4 18h2",
			key: "1xrofg"
		}]
	]);
	const FileType = createLucideIcon("FileType", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M9 13v-1h6v1",
			key: "1bb014"
		}],
		["path", {
			d: "M12 12v6",
			key: "3ahymv"
		}],
		["path", {
			d: "M11 18h2",
			key: "12mj7e"
		}]
	]);
	const FileUp = createLucideIcon("FileUp", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M12 12v6",
			key: "3ahymv"
		}],
		["path", {
			d: "m15 15-3-3-3 3",
			key: "15xj92"
		}]
	]);
	const FileUser = createLucideIcon("FileUser", [
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M15 18a3 3 0 1 0-6 0",
			key: "16awa0"
		}],
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z",
			key: "1mlx9k"
		}],
		["circle", {
			cx: "12",
			cy: "13",
			r: "2",
			key: "1c1ljs"
		}]
	]);
	const FileVideo2 = createLucideIcon("FileVideo2", [
		["path", {
			d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",
			key: "1pf5j1"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["rect", {
			width: "8",
			height: "6",
			x: "2",
			y: "12",
			rx: "1",
			key: "1a6c1e"
		}],
		["path", {
			d: "m10 15.5 4 2.5v-6l-4 2.5",
			key: "t7cp39"
		}]
	]);
	const FileVideo = createLucideIcon("FileVideo", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "m10 11 5 3-5 3v-6Z",
			key: "7ntvm4"
		}]
	]);
	const FileVolume2 = createLucideIcon("FileVolume2", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M8 15h.01",
			key: "a7atzg"
		}],
		["path", {
			d: "M11.5 13.5a2.5 2.5 0 0 1 0 3",
			key: "1fccat"
		}],
		["path", {
			d: "M15 12a5 5 0 0 1 0 6",
			key: "ps46cm"
		}]
	]);
	const FileVolume = createLucideIcon("FileVolume", [
		["path", {
			d: "M11 11a5 5 0 0 1 0 6",
			key: "193qb2"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "M4 6.765V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-.93-.23",
			key: "ifyjnl"
		}],
		["path", {
			d: "M7 10.51a.5.5 0 0 0-.826-.38l-1.893 1.628A1 1 0 0 1 3.63 12H2.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1.129a1 1 0 0 1 .652.242l1.893 1.63a.5.5 0 0 0 .826-.38z",
			key: "mk8rxu"
		}]
	]);
	const FileWarning = createLucideIcon("FileWarning", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M12 9v4",
			key: "juzpu7"
		}],
		["path", {
			d: "M12 17h.01",
			key: "p32p05"
		}]
	]);
	const FileX2 = createLucideIcon("FileX2", [
		["path", {
			d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",
			key: "1pf5j1"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "m8 12.5-5 5",
			key: "b853mi"
		}],
		["path", {
			d: "m3 12.5 5 5",
			key: "1qls4r"
		}]
	]);
	const FileX = createLucideIcon("FileX", [
		["path", {
			d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
			key: "1rqfz7"
		}],
		["path", {
			d: "M14 2v4a2 2 0 0 0 2 2h4",
			key: "tnqrlb"
		}],
		["path", {
			d: "m14.5 12.5-5 5",
			key: "b62r18"
		}],
		["path", {
			d: "m9.5 12.5 5 5",
			key: "1rk7el"
		}]
	]);
	const File = createLucideIcon("File", [["path", {
		d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
		key: "1rqfz7"
	}], ["path", {
		d: "M14 2v4a2 2 0 0 0 2 2h4",
		key: "tnqrlb"
	}]]);
	const Files$1 = createLucideIcon("Files", [
		["path", {
			d: "M20 7h-3a2 2 0 0 1-2-2V2",
			key: "x099mo"
		}],
		["path", {
			d: "M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z",
			key: "18t6ie"
		}],
		["path", {
			d: "M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8",
			key: "1nja0z"
		}]
	]);
	const Film = createLucideIcon("Film", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M7 3v18",
			key: "bbkbws"
		}],
		["path", {
			d: "M3 7.5h4",
			key: "zfgn84"
		}],
		["path", {
			d: "M3 12h18",
			key: "1i2n21"
		}],
		["path", {
			d: "M3 16.5h4",
			key: "1230mu"
		}],
		["path", {
			d: "M17 3v18",
			key: "in4fa5"
		}],
		["path", {
			d: "M17 7.5h4",
			key: "myr1c1"
		}],
		["path", {
			d: "M17 16.5h4",
			key: "go4c1d"
		}]
	]);
	const FilterX = createLucideIcon("FilterX", [
		["path", {
			d: "M13.013 3H2l8 9.46V19l4 2v-8.54l.9-1.055",
			key: "1fi1da"
		}],
		["path", {
			d: "m22 3-5 5",
			key: "12jva0"
		}],
		["path", {
			d: "m17 3 5 5",
			key: "k36vhe"
		}]
	]);
	const Filter = createLucideIcon("Filter", [["polygon", {
		points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",
		key: "1yg77f"
	}]]);
	const Fingerprint = createLucideIcon("Fingerprint", [
		["path", {
			d: "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",
			key: "1nerag"
		}],
		["path", {
			d: "M14 13.12c0 2.38 0 6.38-1 8.88",
			key: "o46ks0"
		}],
		["path", {
			d: "M17.29 21.02c.12-.6.43-2.3.5-3.02",
			key: "ptglia"
		}],
		["path", {
			d: "M2 12a10 10 0 0 1 18-6",
			key: "ydlgp0"
		}],
		["path", {
			d: "M2 16h.01",
			key: "1gqxmh"
		}],
		["path", {
			d: "M21.8 16c.2-2 .131-5.354 0-6",
			key: "drycrb"
		}],
		["path", {
			d: "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",
			key: "1tidbn"
		}],
		["path", {
			d: "M8.65 22c.21-.66.45-1.32.57-2",
			key: "13wd9y"
		}],
		["path", {
			d: "M9 6.8a6 6 0 0 1 9 5.2v2",
			key: "1fr1j5"
		}]
	]);
	const FireExtinguisher = createLucideIcon("FireExtinguisher", [
		["path", {
			d: "M15 6.5V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3.5",
			key: "sqyvz"
		}],
		["path", {
			d: "M9 18h8",
			key: "i7pszb"
		}],
		["path", {
			d: "M18 3h-3",
			key: "7idoqj"
		}],
		["path", {
			d: "M11 3a6 6 0 0 0-6 6v11",
			key: "1v5je3"
		}],
		["path", {
			d: "M5 13h4",
			key: "svpcxo"
		}],
		["path", {
			d: "M17 10a4 4 0 0 0-8 0v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z",
			key: "vsjego"
		}]
	]);
	const FishOff = createLucideIcon("FishOff", [
		["path", {
			d: "M18 12.47v.03m0-.5v.47m-.475 5.056A6.744 6.744 0 0 1 15 18c-3.56 0-7.56-2.53-8.5-6 .348-1.28 1.114-2.433 2.121-3.38m3.444-2.088A8.802 8.802 0 0 1 15 6c3.56 0 6.06 2.54 7 6-.309 1.14-.786 2.177-1.413 3.058",
			key: "1j1hse"
		}],
		["path", {
			d: "M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33m7.48-4.372A9.77 9.77 0 0 1 16 6.07m0 11.86a9.77 9.77 0 0 1-1.728-3.618",
			key: "1q46z8"
		}],
		["path", {
			d: "m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98M8.53 3h5.27a2 2 0 0 1 1.98 1.67l.23 1.4M2 2l20 20",
			key: "1407gh"
		}]
	]);
	const FishSymbol = createLucideIcon("FishSymbol", [["path", {
		d: "M2 16s9-15 20-4C11 23 2 8 2 8",
		key: "h4oh4o"
	}]]);
	const Fish = createLucideIcon("Fish", [
		["path", {
			d: "M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z",
			key: "15baut"
		}],
		["path", {
			d: "M18 12v.5",
			key: "18hhni"
		}],
		["path", {
			d: "M16 17.93a9.77 9.77 0 0 1 0-11.86",
			key: "16dt7o"
		}],
		["path", {
			d: "M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33",
			key: "l9di03"
		}],
		["path", {
			d: "M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4",
			key: "1kjonw"
		}],
		["path", {
			d: "m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98",
			key: "1zlm23"
		}]
	]);
	const FlagOff = createLucideIcon("FlagOff", [
		["path", {
			d: "M8 2c3 0 5 2 8 2s4-1 4-1v11",
			key: "9rwyz9"
		}],
		["path", {
			d: "M4 22V4",
			key: "1plyxx"
		}],
		["path", {
			d: "M4 15s1-1 4-1 5 2 8 2",
			key: "1myooe"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const FlagTriangleLeft = createLucideIcon("FlagTriangleLeft", [["path", {
		d: "M17 22V2L7 7l10 5",
		key: "1rmf0r"
	}]]);
	const FlagTriangleRight = createLucideIcon("FlagTriangleRight", [["path", {
		d: "M7 22V2l10 5-10 5",
		key: "17n18y"
	}]]);
	const Flag = createLucideIcon("Flag", [["path", {
		d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z",
		key: "i9b6wo"
	}], ["line", {
		x1: "4",
		x2: "4",
		y1: "22",
		y2: "15",
		key: "1cm3nv"
	}]]);
	const FlameKindling = createLucideIcon("FlameKindling", [
		["path", {
			d: "M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z",
			key: "1ir223"
		}],
		["path", {
			d: "m5 22 14-4",
			key: "1brv4h"
		}],
		["path", {
			d: "m5 18 14 4",
			key: "lgyyje"
		}]
	]);
	const Flame = createLucideIcon("Flame", [["path", {
		d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
		key: "96xj49"
	}]]);
	const FlashlightOff = createLucideIcon("FlashlightOff", [
		["path", {
			d: "M16 16v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4",
			key: "1r120k"
		}],
		["path", {
			d: "M7 2h11v4c0 2-2 2-2 4v1",
			key: "dz1920"
		}],
		["line", {
			x1: "11",
			x2: "18",
			y1: "6",
			y2: "6",
			key: "bi1vpe"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Flashlight = createLucideIcon("Flashlight", [
		["path", {
			d: "M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z",
			key: "1orkel"
		}],
		["line", {
			x1: "6",
			x2: "18",
			y1: "6",
			y2: "6",
			key: "1z11jq"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "12",
			y2: "12",
			key: "1f4yc1"
		}]
	]);
	const FlaskConicalOff = createLucideIcon("FlaskConicalOff", [
		["path", {
			d: "M10 2v2.343",
			key: "15t272"
		}],
		["path", {
			d: "M14 2v6.343",
			key: "sxr80q"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M20 20a2 2 0 0 1-2 2H6a2 2 0 0 1-1.755-2.96l5.227-9.563",
			key: "k0duyd"
		}],
		["path", {
			d: "M6.453 15H15",
			key: "1f0z33"
		}],
		["path", {
			d: "M8.5 2h7",
			key: "csnxdl"
		}]
	]);
	const FlaskConical = createLucideIcon("FlaskConical", [
		["path", {
			d: "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
			key: "18mbvz"
		}],
		["path", {
			d: "M6.453 15h11.094",
			key: "3shlmq"
		}],
		["path", {
			d: "M8.5 2h7",
			key: "csnxdl"
		}]
	]);
	const FlaskRound = createLucideIcon("FlaskRound", [
		["path", {
			d: "M10 2v6.292a7 7 0 1 0 4 0V2",
			key: "1s42pc"
		}],
		["path", {
			d: "M5 15h14",
			key: "m0yey3"
		}],
		["path", {
			d: "M8.5 2h7",
			key: "csnxdl"
		}]
	]);
	const FlipHorizontal2 = createLucideIcon("FlipHorizontal2", [
		["path", {
			d: "m3 7 5 5-5 5V7",
			key: "couhi7"
		}],
		["path", {
			d: "m21 7-5 5 5 5V7",
			key: "6ouia7"
		}],
		["path", {
			d: "M12 20v2",
			key: "1lh1kg"
		}],
		["path", {
			d: "M12 14v2",
			key: "8jcxud"
		}],
		["path", {
			d: "M12 8v2",
			key: "1woqiv"
		}],
		["path", {
			d: "M12 2v2",
			key: "tus03m"
		}]
	]);
	const FlipHorizontal = createLucideIcon("FlipHorizontal", [
		["path", {
			d: "M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3",
			key: "1i73f7"
		}],
		["path", {
			d: "M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3",
			key: "saxlbk"
		}],
		["path", {
			d: "M12 20v2",
			key: "1lh1kg"
		}],
		["path", {
			d: "M12 14v2",
			key: "8jcxud"
		}],
		["path", {
			d: "M12 8v2",
			key: "1woqiv"
		}],
		["path", {
			d: "M12 2v2",
			key: "tus03m"
		}]
	]);
	const FlipVertical2 = createLucideIcon("FlipVertical2", [
		["path", {
			d: "m17 3-5 5-5-5h10",
			key: "1ftt6x"
		}],
		["path", {
			d: "m17 21-5-5-5 5h10",
			key: "1m0wmu"
		}],
		["path", {
			d: "M4 12H2",
			key: "rhcxmi"
		}],
		["path", {
			d: "M10 12H8",
			key: "s88cx1"
		}],
		["path", {
			d: "M16 12h-2",
			key: "10asgb"
		}],
		["path", {
			d: "M22 12h-2",
			key: "14jgyd"
		}]
	]);
	const FlipVertical = createLucideIcon("FlipVertical", [
		["path", {
			d: "M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3",
			key: "14bfxa"
		}],
		["path", {
			d: "M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3",
			key: "14rx03"
		}],
		["path", {
			d: "M4 12H2",
			key: "rhcxmi"
		}],
		["path", {
			d: "M10 12H8",
			key: "s88cx1"
		}],
		["path", {
			d: "M16 12h-2",
			key: "10asgb"
		}],
		["path", {
			d: "M22 12h-2",
			key: "14jgyd"
		}]
	]);
	const Flower2 = createLucideIcon("Flower2", [
		["path", {
			d: "M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1",
			key: "3pnvol"
		}],
		["circle", {
			cx: "12",
			cy: "8",
			r: "2",
			key: "1822b1"
		}],
		["path", {
			d: "M12 10v12",
			key: "6ubwww"
		}],
		["path", {
			d: "M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z",
			key: "9hd38g"
		}],
		["path", {
			d: "M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z",
			key: "ufn41s"
		}]
	]);
	const Flower = createLucideIcon("Flower", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "3",
			key: "1v7zrd"
		}],
		["path", {
			d: "M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5",
			key: "14wa3c"
		}],
		["path", {
			d: "M12 7.5V9",
			key: "1oy5b0"
		}],
		["path", {
			d: "M7.5 12H9",
			key: "eltsq1"
		}],
		["path", {
			d: "M16.5 12H15",
			key: "vk5kw4"
		}],
		["path", {
			d: "M12 16.5V15",
			key: "k7eayi"
		}],
		["path", {
			d: "m8 8 1.88 1.88",
			key: "nxy4qf"
		}],
		["path", {
			d: "M14.12 9.88 16 8",
			key: "1lst6k"
		}],
		["path", {
			d: "m8 16 1.88-1.88",
			key: "h2eex1"
		}],
		["path", {
			d: "M14.12 14.12 16 16",
			key: "uqkrx3"
		}]
	]);
	const Focus = createLucideIcon("Focus", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "3",
			key: "1v7zrd"
		}],
		["path", {
			d: "M3 7V5a2 2 0 0 1 2-2h2",
			key: "aa7l1z"
		}],
		["path", {
			d: "M17 3h2a2 2 0 0 1 2 2v2",
			key: "4qcy5o"
		}],
		["path", {
			d: "M21 17v2a2 2 0 0 1-2 2h-2",
			key: "6vwrx8"
		}],
		["path", {
			d: "M7 21H5a2 2 0 0 1-2-2v-2",
			key: "ioqczr"
		}]
	]);
	const FoldHorizontal = createLucideIcon("FoldHorizontal", [
		["path", {
			d: "M2 12h6",
			key: "1wqiqv"
		}],
		["path", {
			d: "M22 12h-6",
			key: "1eg9hc"
		}],
		["path", {
			d: "M12 2v2",
			key: "tus03m"
		}],
		["path", {
			d: "M12 8v2",
			key: "1woqiv"
		}],
		["path", {
			d: "M12 14v2",
			key: "8jcxud"
		}],
		["path", {
			d: "M12 20v2",
			key: "1lh1kg"
		}],
		["path", {
			d: "m19 9-3 3 3 3",
			key: "12ol22"
		}],
		["path", {
			d: "m5 15 3-3-3-3",
			key: "1kdhjc"
		}]
	]);
	const FoldVertical = createLucideIcon("FoldVertical", [
		["path", {
			d: "M12 22v-6",
			key: "6o8u61"
		}],
		["path", {
			d: "M12 8V2",
			key: "1wkif3"
		}],
		["path", {
			d: "M4 12H2",
			key: "rhcxmi"
		}],
		["path", {
			d: "M10 12H8",
			key: "s88cx1"
		}],
		["path", {
			d: "M16 12h-2",
			key: "10asgb"
		}],
		["path", {
			d: "M22 12h-2",
			key: "14jgyd"
		}],
		["path", {
			d: "m15 19-3-3-3 3",
			key: "e37ymu"
		}],
		["path", {
			d: "m15 5-3 3-3-3",
			key: "19d6lf"
		}]
	]);
	const FolderArchive = createLucideIcon("FolderArchive", [
		["circle", {
			cx: "15",
			cy: "19",
			r: "2",
			key: "u2pros"
		}],
		["path", {
			d: "M20.9 19.8A2 2 0 0 0 22 18V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5.1",
			key: "1jj40k"
		}],
		["path", {
			d: "M15 11v-1",
			key: "cntcp"
		}],
		["path", {
			d: "M15 17v-2",
			key: "1279jj"
		}]
	]);
	const FolderCheck = createLucideIcon("FolderCheck", [["path", {
		d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
		key: "1kt360"
	}], ["path", {
		d: "m9 13 2 2 4-4",
		key: "6343dt"
	}]]);
	const FolderClock = createLucideIcon("FolderClock", [
		["circle", {
			cx: "16",
			cy: "16",
			r: "6",
			key: "qoo3c4"
		}],
		["path", {
			d: "M7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2",
			key: "1urifu"
		}],
		["path", {
			d: "M16 14v2l1 1",
			key: "xth2jh"
		}]
	]);
	const FolderClosed = createLucideIcon("FolderClosed", [["path", {
		d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
		key: "1kt360"
	}], ["path", {
		d: "M2 10h20",
		key: "1ir3d8"
	}]]);
	const FolderCode = createLucideIcon("FolderCode", [
		["path", {
			d: "M10 10.5 8 13l2 2.5",
			key: "m4t9c1"
		}],
		["path", {
			d: "m14 10.5 2 2.5-2 2.5",
			key: "14w2eb"
		}],
		["path", {
			d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z",
			key: "1u1bxd"
		}]
	]);
	const FolderCog = createLucideIcon("FolderCog", [
		["circle", {
			cx: "18",
			cy: "18",
			r: "3",
			key: "1xkwt0"
		}],
		["path", {
			d: "M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v3.3",
			key: "1k8050"
		}],
		["path", {
			d: "m21.7 19.4-.9-.3",
			key: "1qgwi9"
		}],
		["path", {
			d: "m15.2 16.9-.9-.3",
			key: "1t7mvx"
		}],
		["path", {
			d: "m16.6 21.7.3-.9",
			key: "1j67ps"
		}],
		["path", {
			d: "m19.1 15.2.3-.9",
			key: "18r7jp"
		}],
		["path", {
			d: "m19.6 21.7-.4-1",
			key: "z2vh2"
		}],
		["path", {
			d: "m16.8 15.3-.4-1",
			key: "1ei7r6"
		}],
		["path", {
			d: "m14.3 19.6 1-.4",
			key: "11sv9r"
		}],
		["path", {
			d: "m20.7 16.8 1-.4",
			key: "19m87a"
		}]
	]);
	const FolderDot = createLucideIcon("FolderDot", [["path", {
		d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",
		key: "1fr9dc"
	}], ["circle", {
		cx: "12",
		cy: "13",
		r: "1",
		key: "49l61u"
	}]]);
	const FolderDown = createLucideIcon("FolderDown", [
		["path", {
			d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
			key: "1kt360"
		}],
		["path", {
			d: "M12 10v6",
			key: "1bos4e"
		}],
		["path", {
			d: "m15 13-3 3-3-3",
			key: "6j2sf0"
		}]
	]);
	const FolderGit2 = createLucideIcon("FolderGit2", [
		["path", {
			d: "M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5",
			key: "1w6njk"
		}],
		["circle", {
			cx: "13",
			cy: "12",
			r: "2",
			key: "1j92g6"
		}],
		["path", {
			d: "M18 19c-2.8 0-5-2.2-5-5v8",
			key: "pkpw2h"
		}],
		["circle", {
			cx: "20",
			cy: "19",
			r: "2",
			key: "1obnsp"
		}]
	]);
	const FolderGit = createLucideIcon("FolderGit", [
		["circle", {
			cx: "12",
			cy: "13",
			r: "2",
			key: "1c1ljs"
		}],
		["path", {
			d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
			key: "1kt360"
		}],
		["path", {
			d: "M14 13h3",
			key: "1dgedf"
		}],
		["path", {
			d: "M7 13h3",
			key: "1pygq7"
		}]
	]);
	const FolderHeart = createLucideIcon("FolderHeart", [["path", {
		d: "M11 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1.5",
		key: "6hud8k"
	}], ["path", {
		d: "M13.9 17.45c-1.2-1.2-1.14-2.8-.2-3.73a2.43 2.43 0 0 1 3.44 0l.36.34.34-.34a2.43 2.43 0 0 1 3.45-.01c.95.95 1 2.53-.2 3.74L17.5 21Z",
		key: "wpff58"
	}]]);
	const FolderInput = createLucideIcon("FolderInput", [
		["path", {
			d: "M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1",
			key: "fm4g5t"
		}],
		["path", {
			d: "M2 13h10",
			key: "pgb2dq"
		}],
		["path", {
			d: "m9 16 3-3-3-3",
			key: "6m91ic"
		}]
	]);
	const FolderKanban = createLucideIcon("FolderKanban", [
		["path", {
			d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",
			key: "1fr9dc"
		}],
		["path", {
			d: "M8 10v4",
			key: "tgpxqk"
		}],
		["path", {
			d: "M12 10v2",
			key: "hh53o1"
		}],
		["path", {
			d: "M16 10v6",
			key: "1d6xys"
		}]
	]);
	const FolderKey = createLucideIcon("FolderKey", [
		["circle", {
			cx: "16",
			cy: "20",
			r: "2",
			key: "1vifvg"
		}],
		["path", {
			d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2",
			key: "3hgo9p"
		}],
		["path", {
			d: "m22 14-4.5 4.5",
			key: "1ef6z8"
		}],
		["path", {
			d: "m21 15 1 1",
			key: "1ejcpy"
		}]
	]);
	const FolderLock = createLucideIcon("FolderLock", [
		["rect", {
			width: "8",
			height: "5",
			x: "14",
			y: "17",
			rx: "1",
			key: "19aais"
		}],
		["path", {
			d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5",
			key: "1w6v7t"
		}],
		["path", {
			d: "M20 17v-2a2 2 0 1 0-4 0v2",
			key: "pwaxnr"
		}]
	]);
	const FolderMinus = createLucideIcon("FolderMinus", [["path", {
		d: "M9 13h6",
		key: "1uhe8q"
	}], ["path", {
		d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
		key: "1kt360"
	}]]);
	const FolderOpenDot = createLucideIcon("FolderOpenDot", [["path", {
		d: "m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2",
		key: "1nmvlm"
	}], ["circle", {
		cx: "14",
		cy: "15",
		r: "1",
		key: "1gm4qj"
	}]]);
	const FolderOpen$1 = createLucideIcon("FolderOpen", [["path", {
		d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
		key: "usdka0"
	}]]);
	const FolderOutput = createLucideIcon("FolderOutput", [
		["path", {
			d: "M2 7.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-1.5",
			key: "1yk7aj"
		}],
		["path", {
			d: "M2 13h10",
			key: "pgb2dq"
		}],
		["path", {
			d: "m5 10-3 3 3 3",
			key: "1r8ie0"
		}]
	]);
	const FolderPen = createLucideIcon("FolderPen", [["path", {
		d: "M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5",
		key: "a8xqs0"
	}], ["path", {
		d: "M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
		key: "1saktj"
	}]]);
	const FolderPlus = createLucideIcon("FolderPlus", [
		["path", {
			d: "M12 10v6",
			key: "1bos4e"
		}],
		["path", {
			d: "M9 13h6",
			key: "1uhe8q"
		}],
		["path", {
			d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
			key: "1kt360"
		}]
	]);
	const FolderRoot = createLucideIcon("FolderRoot", [
		["path", {
			d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",
			key: "1fr9dc"
		}],
		["circle", {
			cx: "12",
			cy: "13",
			r: "2",
			key: "1c1ljs"
		}],
		["path", {
			d: "M12 15v5",
			key: "11xva1"
		}]
	]);
	const FolderSearch2 = createLucideIcon("FolderSearch2", [
		["circle", {
			cx: "11.5",
			cy: "12.5",
			r: "2.5",
			key: "1ea5ju"
		}],
		["path", {
			d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
			key: "1kt360"
		}],
		["path", {
			d: "M13.3 14.3 15 16",
			key: "1y4v1n"
		}]
	]);
	const FolderSearch = createLucideIcon("FolderSearch", [
		["path", {
			d: "M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1",
			key: "1bw5m7"
		}],
		["path", {
			d: "m21 21-1.9-1.9",
			key: "1g2n9r"
		}],
		["circle", {
			cx: "17",
			cy: "17",
			r: "3",
			key: "18b49y"
		}]
	]);
	const FolderSymlink = createLucideIcon("FolderSymlink", [["path", {
		d: "M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7",
		key: "x1c07l"
	}], ["path", {
		d: "m8 16 3-3-3-3",
		key: "rlqrt1"
	}]]);
	const FolderSync = createLucideIcon("FolderSync", [
		["path", {
			d: "M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v.5",
			key: "1dkoa9"
		}],
		["path", {
			d: "M12 10v4h4",
			key: "1czhmt"
		}],
		["path", {
			d: "m12 14 1.535-1.605a5 5 0 0 1 8 1.5",
			key: "lvuxfi"
		}],
		["path", {
			d: "M22 22v-4h-4",
			key: "1ewp4q"
		}],
		["path", {
			d: "m22 18-1.535 1.605a5 5 0 0 1-8-1.5",
			key: "14ync0"
		}]
	]);
	const FolderTree = createLucideIcon("FolderTree", [
		["path", {
			d: "M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",
			key: "hod4my"
		}],
		["path", {
			d: "M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",
			key: "w4yl2u"
		}],
		["path", {
			d: "M3 5a2 2 0 0 0 2 2h3",
			key: "f2jnh7"
		}],
		["path", {
			d: "M3 3v13a2 2 0 0 0 2 2h3",
			key: "k8epm1"
		}]
	]);
	const FolderUp = createLucideIcon("FolderUp", [
		["path", {
			d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
			key: "1kt360"
		}],
		["path", {
			d: "M12 10v6",
			key: "1bos4e"
		}],
		["path", {
			d: "m9 13 3-3 3 3",
			key: "1pxg3c"
		}]
	]);
	const FolderX = createLucideIcon("FolderX", [
		["path", {
			d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
			key: "1kt360"
		}],
		["path", {
			d: "m9.5 10.5 5 5",
			key: "ra9qjz"
		}],
		["path", {
			d: "m14.5 10.5-5 5",
			key: "l2rkpq"
		}]
	]);
	const Folder = createLucideIcon("Folder", [["path", {
		d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
		key: "1kt360"
	}]]);
	const Folders = createLucideIcon("Folders", [["path", {
		d: "M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z",
		key: "4u7rpt"
	}], ["path", {
		d: "M2 8v11a2 2 0 0 0 2 2h14",
		key: "1eicx1"
	}]]);
	const Footprints = createLucideIcon("Footprints", [
		["path", {
			d: "M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z",
			key: "1dudjm"
		}],
		["path", {
			d: "M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z",
			key: "l2t8xc"
		}],
		["path", {
			d: "M16 17h4",
			key: "1dejxt"
		}],
		["path", {
			d: "M4 13h4",
			key: "1bwh8b"
		}]
	]);
	const Forklift = createLucideIcon("Forklift", [
		["path", {
			d: "M12 12H5a2 2 0 0 0-2 2v5",
			key: "7zsz91"
		}],
		["circle", {
			cx: "13",
			cy: "19",
			r: "2",
			key: "wjnkru"
		}],
		["circle", {
			cx: "5",
			cy: "19",
			r: "2",
			key: "v8kfzx"
		}],
		["path", {
			d: "M8 19h3m5-17v17h6M6 12V7c0-1.1.9-2 2-2h3l5 5",
			key: "13bk1p"
		}]
	]);
	const Forward = createLucideIcon("Forward", [["polyline", {
		points: "15 17 20 12 15 7",
		key: "1w3sku"
	}], ["path", {
		d: "M4 18v-2a4 4 0 0 1 4-4h12",
		key: "jmiej9"
	}]]);
	const Frame = createLucideIcon("Frame", [
		["line", {
			x1: "22",
			x2: "2",
			y1: "6",
			y2: "6",
			key: "15w7dq"
		}],
		["line", {
			x1: "22",
			x2: "2",
			y1: "18",
			y2: "18",
			key: "1ip48p"
		}],
		["line", {
			x1: "6",
			x2: "6",
			y1: "2",
			y2: "22",
			key: "a2lnyx"
		}],
		["line", {
			x1: "18",
			x2: "18",
			y1: "2",
			y2: "22",
			key: "8vb6jd"
		}]
	]);
	const Framer = createLucideIcon("Framer", [["path", {
		d: "M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7",
		key: "1a2nng"
	}]]);
	const Frown = createLucideIcon("Frown", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M16 16s-1.5-2-4-2-4 2-4 2",
			key: "epbg0q"
		}],
		["line", {
			x1: "9",
			x2: "9.01",
			y1: "9",
			y2: "9",
			key: "yxxnd0"
		}],
		["line", {
			x1: "15",
			x2: "15.01",
			y1: "9",
			y2: "9",
			key: "1p4y9e"
		}]
	]);
	const Fuel = createLucideIcon("Fuel", [
		["line", {
			x1: "3",
			x2: "15",
			y1: "22",
			y2: "22",
			key: "xegly4"
		}],
		["line", {
			x1: "4",
			x2: "14",
			y1: "9",
			y2: "9",
			key: "xcnuvu"
		}],
		["path", {
			d: "M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18",
			key: "16j0yd"
		}],
		["path", {
			d: "M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5",
			key: "7cu91f"
		}]
	]);
	const Fullscreen = createLucideIcon("Fullscreen", [
		["path", {
			d: "M3 7V5a2 2 0 0 1 2-2h2",
			key: "aa7l1z"
		}],
		["path", {
			d: "M17 3h2a2 2 0 0 1 2 2v2",
			key: "4qcy5o"
		}],
		["path", {
			d: "M21 17v2a2 2 0 0 1-2 2h-2",
			key: "6vwrx8"
		}],
		["path", {
			d: "M7 21H5a2 2 0 0 1-2-2v-2",
			key: "ioqczr"
		}],
		["rect", {
			width: "10",
			height: "8",
			x: "7",
			y: "8",
			rx: "1",
			key: "vys8me"
		}]
	]);
	const GalleryHorizontalEnd = createLucideIcon("GalleryHorizontalEnd", [
		["path", {
			d: "M2 7v10",
			key: "a2pl2d"
		}],
		["path", {
			d: "M6 5v14",
			key: "1kq3d7"
		}],
		["rect", {
			width: "12",
			height: "18",
			x: "10",
			y: "3",
			rx: "2",
			key: "13i7bc"
		}]
	]);
	const GalleryHorizontal = createLucideIcon("GalleryHorizontal", [
		["path", {
			d: "M2 3v18",
			key: "pzttux"
		}],
		["rect", {
			width: "12",
			height: "18",
			x: "6",
			y: "3",
			rx: "2",
			key: "btr8bg"
		}],
		["path", {
			d: "M22 3v18",
			key: "6jf3v"
		}]
	]);
	const GalleryThumbnails = createLucideIcon("GalleryThumbnails", [
		["rect", {
			width: "18",
			height: "14",
			x: "3",
			y: "3",
			rx: "2",
			key: "74y24f"
		}],
		["path", {
			d: "M4 21h1",
			key: "16zlid"
		}],
		["path", {
			d: "M9 21h1",
			key: "15o7lz"
		}],
		["path", {
			d: "M14 21h1",
			key: "v9vybs"
		}],
		["path", {
			d: "M19 21h1",
			key: "edywat"
		}]
	]);
	const GalleryVerticalEnd = createLucideIcon("GalleryVerticalEnd", [
		["path", {
			d: "M7 2h10",
			key: "nczekb"
		}],
		["path", {
			d: "M5 6h14",
			key: "u2x4p"
		}],
		["rect", {
			width: "18",
			height: "12",
			x: "3",
			y: "10",
			rx: "2",
			key: "l0tzu3"
		}]
	]);
	const GalleryVertical = createLucideIcon("GalleryVertical", [
		["path", {
			d: "M3 2h18",
			key: "15qxfx"
		}],
		["rect", {
			width: "18",
			height: "12",
			x: "3",
			y: "6",
			rx: "2",
			key: "1439r6"
		}],
		["path", {
			d: "M3 22h18",
			key: "8prr45"
		}]
	]);
	const Gamepad2 = createLucideIcon("Gamepad2", [
		["line", {
			x1: "6",
			x2: "10",
			y1: "11",
			y2: "11",
			key: "1gktln"
		}],
		["line", {
			x1: "8",
			x2: "8",
			y1: "9",
			y2: "13",
			key: "qnk9ow"
		}],
		["line", {
			x1: "15",
			x2: "15.01",
			y1: "12",
			y2: "12",
			key: "krot7o"
		}],
		["line", {
			x1: "18",
			x2: "18.01",
			y1: "10",
			y2: "10",
			key: "1lcuu1"
		}],
		["path", {
			d: "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",
			key: "mfqc10"
		}]
	]);
	const Gamepad = createLucideIcon("Gamepad", [
		["line", {
			x1: "6",
			x2: "10",
			y1: "12",
			y2: "12",
			key: "161bw2"
		}],
		["line", {
			x1: "8",
			x2: "8",
			y1: "10",
			y2: "14",
			key: "1i6ji0"
		}],
		["line", {
			x1: "15",
			x2: "15.01",
			y1: "13",
			y2: "13",
			key: "dqpgro"
		}],
		["line", {
			x1: "18",
			x2: "18.01",
			y1: "11",
			y2: "11",
			key: "meh2c"
		}],
		["rect", {
			width: "20",
			height: "12",
			x: "2",
			y: "6",
			rx: "2",
			key: "9lu3g6"
		}]
	]);
	const Gauge = createLucideIcon("Gauge", [["path", {
		d: "m12 14 4-4",
		key: "9kzdfg"
	}], ["path", {
		d: "M3.34 19a10 10 0 1 1 17.32 0",
		key: "19p75a"
	}]]);
	const Gavel = createLucideIcon("Gavel", [
		["path", {
			d: "m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8",
			key: "15492f"
		}],
		["path", {
			d: "m16 16 6-6",
			key: "vzrcl6"
		}],
		["path", {
			d: "m8 8 6-6",
			key: "18bi4p"
		}],
		["path", {
			d: "m9 7 8 8",
			key: "5jnvq1"
		}],
		["path", {
			d: "m21 11-8-8",
			key: "z4y7zo"
		}]
	]);
	const Gem = createLucideIcon("Gem", [
		["path", {
			d: "M6 3h12l4 6-10 13L2 9Z",
			key: "1pcd5k"
		}],
		["path", {
			d: "M11 3 8 9l4 13 4-13-3-6",
			key: "1fcu3u"
		}],
		["path", {
			d: "M2 9h20",
			key: "16fsjt"
		}]
	]);
	const Ghost = createLucideIcon("Ghost", [
		["path", {
			d: "M9 10h.01",
			key: "qbtxuw"
		}],
		["path", {
			d: "M15 10h.01",
			key: "1qmjsl"
		}],
		["path", {
			d: "M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z",
			key: "uwwb07"
		}]
	]);
	const Gift = createLucideIcon("Gift", [
		["rect", {
			x: "3",
			y: "8",
			width: "18",
			height: "4",
			rx: "1",
			key: "bkv52"
		}],
		["path", {
			d: "M12 8v13",
			key: "1c76mn"
		}],
		["path", {
			d: "M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",
			key: "6wjy6b"
		}],
		["path", {
			d: "M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",
			key: "1ihvrl"
		}]
	]);
	const GitBranchPlus = createLucideIcon("GitBranchPlus", [
		["path", {
			d: "M6 3v12",
			key: "qpgusn"
		}],
		["path", {
			d: "M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
			key: "1d02ji"
		}],
		["path", {
			d: "M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
			key: "chk6ph"
		}],
		["path", {
			d: "M15 6a9 9 0 0 0-9 9",
			key: "or332x"
		}],
		["path", {
			d: "M18 15v6",
			key: "9wciyi"
		}],
		["path", {
			d: "M21 18h-6",
			key: "139f0c"
		}]
	]);
	const GitBranch = createLucideIcon("GitBranch", [
		["line", {
			x1: "6",
			x2: "6",
			y1: "3",
			y2: "15",
			key: "17qcm7"
		}],
		["circle", {
			cx: "18",
			cy: "6",
			r: "3",
			key: "1h7g24"
		}],
		["circle", {
			cx: "6",
			cy: "18",
			r: "3",
			key: "fqmcym"
		}],
		["path", {
			d: "M18 9a9 9 0 0 1-9 9",
			key: "n2h4wq"
		}]
	]);
	const GitCommitHorizontal = createLucideIcon("GitCommitHorizontal", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "3",
			key: "1v7zrd"
		}],
		["line", {
			x1: "3",
			x2: "9",
			y1: "12",
			y2: "12",
			key: "1dyftd"
		}],
		["line", {
			x1: "15",
			x2: "21",
			y1: "12",
			y2: "12",
			key: "oup4p8"
		}]
	]);
	const GitCommitVertical = createLucideIcon("GitCommitVertical", [
		["path", {
			d: "M12 3v6",
			key: "1holv5"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "3",
			key: "1v7zrd"
		}],
		["path", {
			d: "M12 15v6",
			key: "a9ows0"
		}]
	]);
	const GitCompareArrows = createLucideIcon("GitCompareArrows", [
		["circle", {
			cx: "5",
			cy: "6",
			r: "3",
			key: "1qnov2"
		}],
		["path", {
			d: "M12 6h5a2 2 0 0 1 2 2v7",
			key: "1yj91y"
		}],
		["path", {
			d: "m15 9-3-3 3-3",
			key: "1lwv8l"
		}],
		["circle", {
			cx: "19",
			cy: "18",
			r: "3",
			key: "1qljk2"
		}],
		["path", {
			d: "M12 18H7a2 2 0 0 1-2-2V9",
			key: "16sdep"
		}],
		["path", {
			d: "m9 15 3 3-3 3",
			key: "1m3kbl"
		}]
	]);
	const GitCompare = createLucideIcon("GitCompare", [
		["circle", {
			cx: "18",
			cy: "18",
			r: "3",
			key: "1xkwt0"
		}],
		["circle", {
			cx: "6",
			cy: "6",
			r: "3",
			key: "1lh9wr"
		}],
		["path", {
			d: "M13 6h3a2 2 0 0 1 2 2v7",
			key: "1yeb86"
		}],
		["path", {
			d: "M11 18H8a2 2 0 0 1-2-2V9",
			key: "19pyzm"
		}]
	]);
	const GitFork = createLucideIcon("GitFork", [
		["circle", {
			cx: "12",
			cy: "18",
			r: "3",
			key: "1mpf1b"
		}],
		["circle", {
			cx: "6",
			cy: "6",
			r: "3",
			key: "1lh9wr"
		}],
		["circle", {
			cx: "18",
			cy: "6",
			r: "3",
			key: "1h7g24"
		}],
		["path", {
			d: "M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9",
			key: "1uq4wg"
		}],
		["path", {
			d: "M12 12v3",
			key: "158kv8"
		}]
	]);
	const GitGraph = createLucideIcon("GitGraph", [
		["circle", {
			cx: "5",
			cy: "6",
			r: "3",
			key: "1qnov2"
		}],
		["path", {
			d: "M5 9v6",
			key: "158jrl"
		}],
		["circle", {
			cx: "5",
			cy: "18",
			r: "3",
			key: "104gr9"
		}],
		["path", {
			d: "M12 3v18",
			key: "108xh3"
		}],
		["circle", {
			cx: "19",
			cy: "6",
			r: "3",
			key: "108a5v"
		}],
		["path", {
			d: "M16 15.7A9 9 0 0 0 19 9",
			key: "1e3vqb"
		}]
	]);
	const GitMerge = createLucideIcon("GitMerge", [
		["circle", {
			cx: "18",
			cy: "18",
			r: "3",
			key: "1xkwt0"
		}],
		["circle", {
			cx: "6",
			cy: "6",
			r: "3",
			key: "1lh9wr"
		}],
		["path", {
			d: "M6 21V9a9 9 0 0 0 9 9",
			key: "7kw0sc"
		}]
	]);
	const GitPullRequestArrow = createLucideIcon("GitPullRequestArrow", [
		["circle", {
			cx: "5",
			cy: "6",
			r: "3",
			key: "1qnov2"
		}],
		["path", {
			d: "M5 9v12",
			key: "ih889a"
		}],
		["circle", {
			cx: "19",
			cy: "18",
			r: "3",
			key: "1qljk2"
		}],
		["path", {
			d: "m15 9-3-3 3-3",
			key: "1lwv8l"
		}],
		["path", {
			d: "M12 6h5a2 2 0 0 1 2 2v7",
			key: "1yj91y"
		}]
	]);
	const GitPullRequestClosed = createLucideIcon("GitPullRequestClosed", [
		["circle", {
			cx: "6",
			cy: "6",
			r: "3",
			key: "1lh9wr"
		}],
		["path", {
			d: "M6 9v12",
			key: "1sc30k"
		}],
		["path", {
			d: "m21 3-6 6",
			key: "16nqsk"
		}],
		["path", {
			d: "m21 9-6-6",
			key: "9j17rh"
		}],
		["path", {
			d: "M18 11.5V15",
			key: "65xf6f"
		}],
		["circle", {
			cx: "18",
			cy: "18",
			r: "3",
			key: "1xkwt0"
		}]
	]);
	const GitPullRequestCreateArrow = createLucideIcon("GitPullRequestCreateArrow", [
		["circle", {
			cx: "5",
			cy: "6",
			r: "3",
			key: "1qnov2"
		}],
		["path", {
			d: "M5 9v12",
			key: "ih889a"
		}],
		["path", {
			d: "m15 9-3-3 3-3",
			key: "1lwv8l"
		}],
		["path", {
			d: "M12 6h5a2 2 0 0 1 2 2v3",
			key: "1rbwk6"
		}],
		["path", {
			d: "M19 15v6",
			key: "10aioa"
		}],
		["path", {
			d: "M22 18h-6",
			key: "1d5gi5"
		}]
	]);
	const GitPullRequestCreate = createLucideIcon("GitPullRequestCreate", [
		["circle", {
			cx: "6",
			cy: "6",
			r: "3",
			key: "1lh9wr"
		}],
		["path", {
			d: "M6 9v12",
			key: "1sc30k"
		}],
		["path", {
			d: "M13 6h3a2 2 0 0 1 2 2v3",
			key: "1jb6z3"
		}],
		["path", {
			d: "M18 15v6",
			key: "9wciyi"
		}],
		["path", {
			d: "M21 18h-6",
			key: "139f0c"
		}]
	]);
	const GitPullRequestDraft = createLucideIcon("GitPullRequestDraft", [
		["circle", {
			cx: "18",
			cy: "18",
			r: "3",
			key: "1xkwt0"
		}],
		["circle", {
			cx: "6",
			cy: "6",
			r: "3",
			key: "1lh9wr"
		}],
		["path", {
			d: "M18 6V5",
			key: "1oao2s"
		}],
		["path", {
			d: "M18 11v-1",
			key: "11c8tz"
		}],
		["line", {
			x1: "6",
			x2: "6",
			y1: "9",
			y2: "21",
			key: "rroup"
		}]
	]);
	const GitPullRequest = createLucideIcon("GitPullRequest", [
		["circle", {
			cx: "18",
			cy: "18",
			r: "3",
			key: "1xkwt0"
		}],
		["circle", {
			cx: "6",
			cy: "6",
			r: "3",
			key: "1lh9wr"
		}],
		["path", {
			d: "M13 6h3a2 2 0 0 1 2 2v7",
			key: "1yeb86"
		}],
		["line", {
			x1: "6",
			x2: "6",
			y1: "9",
			y2: "21",
			key: "rroup"
		}]
	]);
	const Github = createLucideIcon("Github", [["path", {
		d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
		key: "tonef"
	}], ["path", {
		d: "M9 18c-4.51 2-5-2-7-2",
		key: "9comsn"
	}]]);
	const Gitlab = createLucideIcon("Gitlab", [["path", {
		d: "m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z",
		key: "148pdi"
	}]]);
	const GlassWater = createLucideIcon("GlassWater", [["path", {
		d: "M5.116 4.104A1 1 0 0 1 6.11 3h11.78a1 1 0 0 1 .994 1.105L17.19 20.21A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z",
		key: "p55z4y"
	}], ["path", {
		d: "M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0",
		key: "mjntcy"
	}]]);
	const Glasses = createLucideIcon("Glasses", [
		["circle", {
			cx: "6",
			cy: "15",
			r: "4",
			key: "vux9w4"
		}],
		["circle", {
			cx: "18",
			cy: "15",
			r: "4",
			key: "18o8ve"
		}],
		["path", {
			d: "M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2",
			key: "1ag4bs"
		}],
		["path", {
			d: "M2.5 13 5 7c.7-1.3 1.4-2 3-2",
			key: "1hm1gs"
		}],
		["path", {
			d: "M21.5 13 19 7c-.7-1.3-1.5-2-3-2",
			key: "1r31ai"
		}]
	]);
	const GlobeLock = createLucideIcon("GlobeLock", [
		["path", {
			d: "M15.686 15A14.5 14.5 0 0 1 12 22a14.5 14.5 0 0 1 0-20 10 10 0 1 0 9.542 13",
			key: "qkt0x6"
		}],
		["path", {
			d: "M2 12h8.5",
			key: "ovaggd"
		}],
		["path", {
			d: "M20 6V4a2 2 0 1 0-4 0v2",
			key: "1of5e8"
		}],
		["rect", {
			width: "8",
			height: "5",
			x: "14",
			y: "6",
			rx: "1",
			key: "1fmf51"
		}]
	]);
	const Globe = createLucideIcon("Globe", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
			key: "13o1zl"
		}],
		["path", {
			d: "M2 12h20",
			key: "9i4pu4"
		}]
	]);
	const Goal = createLucideIcon("Goal", [
		["path", {
			d: "M12 13V2l8 4-8 4",
			key: "5wlwwj"
		}],
		["path", {
			d: "M20.561 10.222a9 9 0 1 1-12.55-5.29",
			key: "1c0wjv"
		}],
		["path", {
			d: "M8.002 9.997a5 5 0 1 0 8.9 2.02",
			key: "gb1g7m"
		}]
	]);
	const Grab = createLucideIcon("Grab", [
		["path", {
			d: "M18 11.5V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4",
			key: "edstyy"
		}],
		["path", {
			d: "M14 10V8a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2",
			key: "19wdwo"
		}],
		["path", {
			d: "M10 9.9V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5",
			key: "1lugqo"
		}],
		["path", {
			d: "M6 14a2 2 0 0 0-2-2a2 2 0 0 0-2 2",
			key: "1hbeus"
		}],
		["path", {
			d: "M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0",
			key: "1etffm"
		}]
	]);
	const GraduationCap = createLucideIcon("GraduationCap", [
		["path", {
			d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
			key: "j76jl0"
		}],
		["path", {
			d: "M22 10v6",
			key: "1lu8f3"
		}],
		["path", {
			d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5",
			key: "1r8lef"
		}]
	]);
	const Grape = createLucideIcon("Grape", [
		["path", {
			d: "M22 5V2l-5.89 5.89",
			key: "1eenpo"
		}],
		["circle", {
			cx: "16.6",
			cy: "15.89",
			r: "3",
			key: "xjtalx"
		}],
		["circle", {
			cx: "8.11",
			cy: "7.4",
			r: "3",
			key: "u2fv6i"
		}],
		["circle", {
			cx: "12.35",
			cy: "11.65",
			r: "3",
			key: "i6i8g7"
		}],
		["circle", {
			cx: "13.91",
			cy: "5.85",
			r: "3",
			key: "6ye0dv"
		}],
		["circle", {
			cx: "18.15",
			cy: "10.09",
			r: "3",
			key: "snx9no"
		}],
		["circle", {
			cx: "6.56",
			cy: "13.2",
			r: "3",
			key: "17x4xg"
		}],
		["circle", {
			cx: "10.8",
			cy: "17.44",
			r: "3",
			key: "1hogw9"
		}],
		["circle", {
			cx: "5",
			cy: "19",
			r: "3",
			key: "1sn6vo"
		}]
	]);
	const Grid2x2Check = createLucideIcon("Grid2x2Check", [["path", {
		d: "M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3",
		key: "11za1p"
	}], ["path", {
		d: "m16 19 2 2 4-4",
		key: "1b14m6"
	}]]);
	const Grid2x2Plus = createLucideIcon("Grid2x2Plus", [
		["path", {
			d: "M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3",
			key: "11za1p"
		}],
		["path", {
			d: "M16 19h6",
			key: "xwg31i"
		}],
		["path", {
			d: "M19 22v-6",
			key: "qhmiwi"
		}]
	]);
	const Grid2x2X = createLucideIcon("Grid2x2X", [
		["path", {
			d: "M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3",
			key: "11za1p"
		}],
		["path", {
			d: "m16 16 5 5",
			key: "8tpb07"
		}],
		["path", {
			d: "m16 21 5-5",
			key: "193jll"
		}]
	]);
	const Grid2x2 = createLucideIcon("Grid2x2", [
		["path", {
			d: "M12 3v18",
			key: "108xh3"
		}],
		["path", {
			d: "M3 12h18",
			key: "1i2n21"
		}],
		["rect", {
			x: "3",
			y: "3",
			width: "18",
			height: "18",
			rx: "2",
			key: "h1oib"
		}]
	]);
	const Grid3x3 = createLucideIcon("Grid3x3", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M3 9h18",
			key: "1pudct"
		}],
		["path", {
			d: "M3 15h18",
			key: "5xshup"
		}],
		["path", {
			d: "M9 3v18",
			key: "fh3hqa"
		}],
		["path", {
			d: "M15 3v18",
			key: "14nvp0"
		}]
	]);
	const GripHorizontal = createLucideIcon("GripHorizontal", [
		["circle", {
			cx: "12",
			cy: "9",
			r: "1",
			key: "124mty"
		}],
		["circle", {
			cx: "19",
			cy: "9",
			r: "1",
			key: "1ruzo2"
		}],
		["circle", {
			cx: "5",
			cy: "9",
			r: "1",
			key: "1a8b28"
		}],
		["circle", {
			cx: "12",
			cy: "15",
			r: "1",
			key: "1e56xg"
		}],
		["circle", {
			cx: "19",
			cy: "15",
			r: "1",
			key: "1a92ep"
		}],
		["circle", {
			cx: "5",
			cy: "15",
			r: "1",
			key: "5r1jwy"
		}]
	]);
	const GripVertical = createLucideIcon("GripVertical", [
		["circle", {
			cx: "9",
			cy: "12",
			r: "1",
			key: "1vctgf"
		}],
		["circle", {
			cx: "9",
			cy: "5",
			r: "1",
			key: "hp0tcf"
		}],
		["circle", {
			cx: "9",
			cy: "19",
			r: "1",
			key: "fkjjf6"
		}],
		["circle", {
			cx: "15",
			cy: "12",
			r: "1",
			key: "1tmaij"
		}],
		["circle", {
			cx: "15",
			cy: "5",
			r: "1",
			key: "19l28e"
		}],
		["circle", {
			cx: "15",
			cy: "19",
			r: "1",
			key: "f4zoj3"
		}]
	]);
	const Grip = createLucideIcon("Grip", [
		["circle", {
			cx: "12",
			cy: "5",
			r: "1",
			key: "gxeob9"
		}],
		["circle", {
			cx: "19",
			cy: "5",
			r: "1",
			key: "w8mnmm"
		}],
		["circle", {
			cx: "5",
			cy: "5",
			r: "1",
			key: "lttvr7"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "1",
			key: "41hilf"
		}],
		["circle", {
			cx: "19",
			cy: "12",
			r: "1",
			key: "1wjl8i"
		}],
		["circle", {
			cx: "5",
			cy: "12",
			r: "1",
			key: "1pcz8c"
		}],
		["circle", {
			cx: "12",
			cy: "19",
			r: "1",
			key: "lyex9k"
		}],
		["circle", {
			cx: "19",
			cy: "19",
			r: "1",
			key: "shf9b7"
		}],
		["circle", {
			cx: "5",
			cy: "19",
			r: "1",
			key: "bfqh0e"
		}]
	]);
	const Group = createLucideIcon("Group", [
		["path", {
			d: "M3 7V5c0-1.1.9-2 2-2h2",
			key: "adw53z"
		}],
		["path", {
			d: "M17 3h2c1.1 0 2 .9 2 2v2",
			key: "an4l38"
		}],
		["path", {
			d: "M21 17v2c0 1.1-.9 2-2 2h-2",
			key: "144t0e"
		}],
		["path", {
			d: "M7 21H5c-1.1 0-2-.9-2-2v-2",
			key: "rtnfgi"
		}],
		["rect", {
			width: "7",
			height: "5",
			x: "7",
			y: "7",
			rx: "1",
			key: "1eyiv7"
		}],
		["rect", {
			width: "7",
			height: "5",
			x: "10",
			y: "12",
			rx: "1",
			key: "1qlmkx"
		}]
	]);
	const Guitar = createLucideIcon("Guitar", [
		["path", {
			d: "m11.9 12.1 4.514-4.514",
			key: "109xqo"
		}],
		["path", {
			d: "M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z",
			key: "txyc8t"
		}],
		["path", {
			d: "m6 16 2 2",
			key: "16qmzd"
		}],
		["path", {
			d: "M8.2 9.9C8.7 8.8 9.8 8 11 8c2.8 0 5 2.2 5 5 0 1.2-.8 2.3-1.9 2.8l-.9.4A2 2 0 0 0 12 18a4 4 0 0 1-4 4c-3.3 0-6-2.7-6-6a4 4 0 0 1 4-4 2 2 0 0 0 1.8-1.2z",
			key: "1u8q3z"
		}],
		["circle", {
			cx: "11.5",
			cy: "12.5",
			r: ".5",
			fill: "currentColor",
			key: "16onso"
		}]
	]);
	const Ham = createLucideIcon("Ham", [
		["path", {
			d: "M13.144 21.144A7.274 10.445 45 1 0 2.856 10.856",
			key: "1k1t7q"
		}],
		["path", {
			d: "M13.144 21.144A7.274 4.365 45 0 0 2.856 10.856a7.274 4.365 45 0 0 10.288 10.288",
			key: "153t1g"
		}],
		["path", {
			d: "M16.565 10.435 18.6 8.4a2.501 2.501 0 1 0 1.65-4.65 2.5 2.5 0 1 0-4.66 1.66l-2.024 2.025",
			key: "gzrt0n"
		}],
		["path", {
			d: "m8.5 16.5-1-1",
			key: "otr954"
		}]
	]);
	const Hammer = createLucideIcon("Hammer", [
		["path", {
			d: "m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9",
			key: "eefl8a"
		}],
		["path", {
			d: "m18 15 4-4",
			key: "16gjal"
		}],
		["path", {
			d: "m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5",
			key: "b7pghm"
		}]
	]);
	const HandCoins = createLucideIcon("HandCoins", [
		["path", {
			d: "M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17",
			key: "geh8rc"
		}],
		["path", {
			d: "m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9",
			key: "1fto5m"
		}],
		["path", {
			d: "m2 16 6 6",
			key: "1pfhp9"
		}],
		["circle", {
			cx: "16",
			cy: "9",
			r: "2.9",
			key: "1n0dlu"
		}],
		["circle", {
			cx: "6",
			cy: "5",
			r: "3",
			key: "151irh"
		}]
	]);
	const HandHeart = createLucideIcon("HandHeart", [
		["path", {
			d: "M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16",
			key: "1ifwr1"
		}],
		["path", {
			d: "m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9",
			key: "17abbs"
		}],
		["path", {
			d: "m2 15 6 6",
			key: "10dquu"
		}],
		["path", {
			d: "M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z",
			key: "1h3036"
		}]
	]);
	const HandHelping = createLucideIcon("HandHelping", [
		["path", {
			d: "M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14",
			key: "1j4xps"
		}],
		["path", {
			d: "m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9",
			key: "uospg8"
		}],
		["path", {
			d: "m2 13 6 6",
			key: "16e5sb"
		}]
	]);
	const HandMetal = createLucideIcon("HandMetal", [
		["path", {
			d: "M18 12.5V10a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4",
			key: "wc6myp"
		}],
		["path", {
			d: "M14 11V9a2 2 0 1 0-4 0v2",
			key: "94qvcw"
		}],
		["path", {
			d: "M10 10.5V5a2 2 0 1 0-4 0v9",
			key: "m1ah89"
		}],
		["path", {
			d: "m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v5",
			key: "t1skq1"
		}]
	]);
	const HandPlatter = createLucideIcon("HandPlatter", [
		["path", {
			d: "M12 3V2",
			key: "ar7q03"
		}],
		["path", {
			d: "m15.4 17.4 3.2-2.8a2 2 0 1 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2l-1.302-1.464A1 1 0 0 0 6.151 19H5",
			key: "n2g93r"
		}],
		["path", {
			d: "M2 14h12a2 2 0 0 1 0 4h-2",
			key: "1o2jem"
		}],
		["path", {
			d: "M4 10h16",
			key: "img6z1"
		}],
		["path", {
			d: "M5 10a7 7 0 0 1 14 0",
			key: "1ega1o"
		}],
		["path", {
			d: "M5 14v6a1 1 0 0 1-1 1H2",
			key: "1hescx"
		}]
	]);
	const Hand = createLucideIcon("Hand", [
		["path", {
			d: "M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2",
			key: "1fvzgz"
		}],
		["path", {
			d: "M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2",
			key: "1kc0my"
		}],
		["path", {
			d: "M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8",
			key: "10h0bg"
		}],
		["path", {
			d: "M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",
			key: "1s1gnw"
		}]
	]);
	const Handshake = createLucideIcon("Handshake", [
		["path", {
			d: "m11 17 2 2a1 1 0 1 0 3-3",
			key: "efffak"
		}],
		["path", {
			d: "m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4",
			key: "9pr0kb"
		}],
		["path", {
			d: "m21 3 1 11h-2",
			key: "1tisrp"
		}],
		["path", {
			d: "M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3",
			key: "1uvwmv"
		}],
		["path", {
			d: "M3 4h8",
			key: "1ep09j"
		}]
	]);
	const HardDriveDownload = createLucideIcon("HardDriveDownload", [
		["path", {
			d: "M12 2v8",
			key: "1q4o3n"
		}],
		["path", {
			d: "m16 6-4 4-4-4",
			key: "6wukr"
		}],
		["rect", {
			width: "20",
			height: "8",
			x: "2",
			y: "14",
			rx: "2",
			key: "w68u3i"
		}],
		["path", {
			d: "M6 18h.01",
			key: "uhywen"
		}],
		["path", {
			d: "M10 18h.01",
			key: "h775k"
		}]
	]);
	const HardDriveUpload = createLucideIcon("HardDriveUpload", [
		["path", {
			d: "m16 6-4-4-4 4",
			key: "13yo43"
		}],
		["path", {
			d: "M12 2v8",
			key: "1q4o3n"
		}],
		["rect", {
			width: "20",
			height: "8",
			x: "2",
			y: "14",
			rx: "2",
			key: "w68u3i"
		}],
		["path", {
			d: "M6 18h.01",
			key: "uhywen"
		}],
		["path", {
			d: "M10 18h.01",
			key: "h775k"
		}]
	]);
	const HardDrive = createLucideIcon("HardDrive", [
		["line", {
			x1: "22",
			x2: "2",
			y1: "12",
			y2: "12",
			key: "1y58io"
		}],
		["path", {
			d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
			key: "oot6mr"
		}],
		["line", {
			x1: "6",
			x2: "6.01",
			y1: "16",
			y2: "16",
			key: "sgf278"
		}],
		["line", {
			x1: "10",
			x2: "10.01",
			y1: "16",
			y2: "16",
			key: "1l4acy"
		}]
	]);
	const HardHat = createLucideIcon("HardHat", [
		["path", {
			d: "M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5",
			key: "1p9q5i"
		}],
		["path", {
			d: "M14 6a6 6 0 0 1 6 6v3",
			key: "1hnv84"
		}],
		["path", {
			d: "M4 15v-3a6 6 0 0 1 6-6",
			key: "9ciidu"
		}],
		["rect", {
			x: "2",
			y: "15",
			width: "20",
			height: "4",
			rx: "1",
			key: "g3x8cw"
		}]
	]);
	const Hash = createLucideIcon("Hash", [
		["line", {
			x1: "4",
			x2: "20",
			y1: "9",
			y2: "9",
			key: "4lhtct"
		}],
		["line", {
			x1: "4",
			x2: "20",
			y1: "15",
			y2: "15",
			key: "vyu0kd"
		}],
		["line", {
			x1: "10",
			x2: "8",
			y1: "3",
			y2: "21",
			key: "1ggp8o"
		}],
		["line", {
			x1: "16",
			x2: "14",
			y1: "3",
			y2: "21",
			key: "weycgp"
		}]
	]);
	const Haze = createLucideIcon("Haze", [
		["path", {
			d: "m5.2 6.2 1.4 1.4",
			key: "17imol"
		}],
		["path", {
			d: "M2 13h2",
			key: "13gyu8"
		}],
		["path", {
			d: "M20 13h2",
			key: "16rner"
		}],
		["path", {
			d: "m17.4 7.6 1.4-1.4",
			key: "t4xlah"
		}],
		["path", {
			d: "M22 17H2",
			key: "1gtaj3"
		}],
		["path", {
			d: "M22 21H2",
			key: "1gy6en"
		}],
		["path", {
			d: "M16 13a4 4 0 0 0-8 0",
			key: "1dyczq"
		}],
		["path", {
			d: "M12 5V2.5",
			key: "1vytko"
		}]
	]);
	const HdmiPort = createLucideIcon("HdmiPort", [["path", {
		d: "M22 9a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1l2 2h12l2-2h1a1 1 0 0 0 1-1Z",
		key: "2128wb"
	}], ["path", {
		d: "M7.5 12h9",
		key: "1t0ckc"
	}]]);
	const Heading1 = createLucideIcon("Heading1", [
		["path", {
			d: "M4 12h8",
			key: "17cfdx"
		}],
		["path", {
			d: "M4 18V6",
			key: "1rz3zl"
		}],
		["path", {
			d: "M12 18V6",
			key: "zqpxq5"
		}],
		["path", {
			d: "m17 12 3-2v8",
			key: "1hhhft"
		}]
	]);
	const Heading2 = createLucideIcon("Heading2", [
		["path", {
			d: "M4 12h8",
			key: "17cfdx"
		}],
		["path", {
			d: "M4 18V6",
			key: "1rz3zl"
		}],
		["path", {
			d: "M12 18V6",
			key: "zqpxq5"
		}],
		["path", {
			d: "M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1",
			key: "9jr5yi"
		}]
	]);
	const Heading3 = createLucideIcon("Heading3", [
		["path", {
			d: "M4 12h8",
			key: "17cfdx"
		}],
		["path", {
			d: "M4 18V6",
			key: "1rz3zl"
		}],
		["path", {
			d: "M12 18V6",
			key: "zqpxq5"
		}],
		["path", {
			d: "M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2",
			key: "68ncm8"
		}],
		["path", {
			d: "M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2",
			key: "1ejuhz"
		}]
	]);
	const Heading4 = createLucideIcon("Heading4", [
		["path", {
			d: "M12 18V6",
			key: "zqpxq5"
		}],
		["path", {
			d: "M17 10v3a1 1 0 0 0 1 1h3",
			key: "tj5zdr"
		}],
		["path", {
			d: "M21 10v8",
			key: "1kdml4"
		}],
		["path", {
			d: "M4 12h8",
			key: "17cfdx"
		}],
		["path", {
			d: "M4 18V6",
			key: "1rz3zl"
		}]
	]);
	const Heading5 = createLucideIcon("Heading5", [
		["path", {
			d: "M4 12h8",
			key: "17cfdx"
		}],
		["path", {
			d: "M4 18V6",
			key: "1rz3zl"
		}],
		["path", {
			d: "M12 18V6",
			key: "zqpxq5"
		}],
		["path", {
			d: "M17 13v-3h4",
			key: "1nvgqp"
		}],
		["path", {
			d: "M17 17.7c.4.2.8.3 1.3.3 1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17",
			key: "2nebdn"
		}]
	]);
	const Heading6 = createLucideIcon("Heading6", [
		["path", {
			d: "M4 12h8",
			key: "17cfdx"
		}],
		["path", {
			d: "M4 18V6",
			key: "1rz3zl"
		}],
		["path", {
			d: "M12 18V6",
			key: "zqpxq5"
		}],
		["circle", {
			cx: "19",
			cy: "16",
			r: "2",
			key: "15mx69"
		}],
		["path", {
			d: "M20 10c-2 2-3 3.5-3 6",
			key: "f35dl0"
		}]
	]);
	const Heading = createLucideIcon("Heading", [
		["path", {
			d: "M6 12h12",
			key: "8npq4p"
		}],
		["path", {
			d: "M6 20V4",
			key: "1w1bmo"
		}],
		["path", {
			d: "M18 20V4",
			key: "o2hl4u"
		}]
	]);
	const HeadphoneOff = createLucideIcon("HeadphoneOff", [
		["path", {
			d: "M21 14h-1.343",
			key: "1jdnxi"
		}],
		["path", {
			d: "M9.128 3.47A9 9 0 0 1 21 12v3.343",
			key: "6kipu2"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M20.414 20.414A2 2 0 0 1 19 21h-1a2 2 0 0 1-2-2v-3",
			key: "9x50f4"
		}],
		["path", {
			d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 2.636-6.364",
			key: "1bkxnm"
		}]
	]);
	const Headphones = createLucideIcon("Headphones", [["path", {
		d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",
		key: "1xhozi"
	}]]);
	const Headset = createLucideIcon("Headset", [["path", {
		d: "M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z",
		key: "12oyoe"
	}], ["path", {
		d: "M21 16v2a4 4 0 0 1-4 4h-5",
		key: "1x7m43"
	}]]);
	const HeartCrack = createLucideIcon("HeartCrack", [["path", {
		d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
		key: "c3ymky"
	}], ["path", {
		d: "m12 13-1-1 2-2-3-3 2-2",
		key: "xjdxli"
	}]]);
	const HeartHandshake = createLucideIcon("HeartHandshake", [
		["path", {
			d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
			key: "c3ymky"
		}],
		["path", {
			d: "M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66",
			key: "4oyue0"
		}],
		["path", {
			d: "m18 15-2-2",
			key: "60u0ii"
		}],
		["path", {
			d: "m15 18-2-2",
			key: "6p76be"
		}]
	]);
	const HeartOff = createLucideIcon("HeartOff", [
		["line", {
			x1: "2",
			y1: "2",
			x2: "22",
			y2: "22",
			key: "1w4vcy"
		}],
		["path", {
			d: "M16.5 16.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5a5.5 5.5 0 0 1 2.14-4.35",
			key: "3mpagl"
		}],
		["path", {
			d: "M8.76 3.1c1.15.22 2.13.78 3.24 1.9 1.5-1.5 2.74-2 4.5-2A5.5 5.5 0 0 1 22 8.5c0 2.12-1.3 3.78-2.67 5.17",
			key: "1gh3v3"
		}]
	]);
	const HeartPulse = createLucideIcon("HeartPulse", [["path", {
		d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
		key: "c3ymky"
	}], ["path", {
		d: "M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27",
		key: "1uw2ng"
	}]]);
	const Heart = createLucideIcon("Heart", [["path", {
		d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
		key: "c3ymky"
	}]]);
	const Heater = createLucideIcon("Heater", [
		["path", {
			d: "M11 8c2-3-2-3 0-6",
			key: "1ldv5m"
		}],
		["path", {
			d: "M15.5 8c2-3-2-3 0-6",
			key: "1otqoz"
		}],
		["path", {
			d: "M6 10h.01",
			key: "1lbq93"
		}],
		["path", {
			d: "M6 14h.01",
			key: "zudwn7"
		}],
		["path", {
			d: "M10 16v-4",
			key: "1c25yv"
		}],
		["path", {
			d: "M14 16v-4",
			key: "1dkbt8"
		}],
		["path", {
			d: "M18 16v-4",
			key: "1yg9me"
		}],
		["path", {
			d: "M20 6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3",
			key: "1ubg90"
		}],
		["path", {
			d: "M5 20v2",
			key: "1abpe8"
		}],
		["path", {
			d: "M19 20v2",
			key: "kqn6ft"
		}]
	]);
	const Hexagon = createLucideIcon("Hexagon", [["path", {
		d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
		key: "yt0hxn"
	}]]);
	const Highlighter = createLucideIcon("Highlighter", [["path", {
		d: "m9 11-6 6v3h9l3-3",
		key: "1a3l36"
	}], ["path", {
		d: "m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4",
		key: "14a9rk"
	}]]);
	const History = createLucideIcon("History", [
		["path", {
			d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
			key: "1357e3"
		}],
		["path", {
			d: "M3 3v5h5",
			key: "1xhq8a"
		}],
		["path", {
			d: "M12 7v5l4 2",
			key: "1fdv2h"
		}]
	]);
	const HopOff = createLucideIcon("HopOff", [
		["path", {
			d: "M10.82 16.12c1.69.6 3.91.79 5.18.85.28.01.53-.09.7-.27",
			key: "qyzcap"
		}],
		["path", {
			d: "M11.14 20.57c.52.24 2.44 1.12 4.08 1.37.46.06.86-.25.9-.71.12-1.52-.3-3.43-.5-4.28",
			key: "y078lb"
		}],
		["path", {
			d: "M16.13 21.05c1.65.63 3.68.84 4.87.91a.9.9 0 0 0 .7-.26",
			key: "1utre3"
		}],
		["path", {
			d: "M17.99 5.52a20.83 20.83 0 0 1 3.15 4.5.8.8 0 0 1-.68 1.13c-1.17.1-2.5.02-3.9-.25",
			key: "17o9hm"
		}],
		["path", {
			d: "M20.57 11.14c.24.52 1.12 2.44 1.37 4.08.04.3-.08.59-.31.75",
			key: "1d1n4p"
		}],
		["path", {
			d: "M4.93 4.93a10 10 0 0 0-.67 13.4c.35.43.96.4 1.17-.12.69-1.71 1.07-5.07 1.07-6.71 1.34.45 3.1.9 4.88.62a.85.85 0 0 0 .48-.24",
			key: "9uv3tt"
		}],
		["path", {
			d: "M5.52 17.99c1.05.95 2.91 2.42 4.5 3.15a.8.8 0 0 0 1.13-.68c.2-2.34-.33-5.3-1.57-8.28",
			key: "1292wz"
		}],
		["path", {
			d: "M8.35 2.68a10 10 0 0 1 9.98 1.58c.43.35.4.96-.12 1.17-1.5.6-4.3.98-6.07 1.05",
			key: "7ozu9p"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]);
	const Hop = createLucideIcon("Hop", [
		["path", {
			d: "M10.82 16.12c1.69.6 3.91.79 5.18.85.55.03 1-.42.97-.97-.06-1.27-.26-3.5-.85-5.18",
			key: "18lxf1"
		}],
		["path", {
			d: "M11.5 6.5c1.64 0 5-.38 6.71-1.07.52-.2.55-.82.12-1.17A10 10 0 0 0 4.26 18.33c.35.43.96.4 1.17-.12.69-1.71 1.07-5.07 1.07-6.71 1.34.45 3.1.9 4.88.62a.88.88 0 0 0 .73-.74c.3-2.14-.15-3.5-.61-4.88",
			key: "vtfxrw"
		}],
		["path", {
			d: "M15.62 16.95c.2.85.62 2.76.5 4.28a.77.77 0 0 1-.9.7 16.64 16.64 0 0 1-4.08-1.36",
			key: "13hl71"
		}],
		["path", {
			d: "M16.13 21.05c1.65.63 3.68.84 4.87.91a.9.9 0 0 0 .96-.96 17.68 17.68 0 0 0-.9-4.87",
			key: "1sl8oj"
		}],
		["path", {
			d: "M16.94 15.62c.86.2 2.77.62 4.29.5a.77.77 0 0 0 .7-.9 16.64 16.64 0 0 0-1.36-4.08",
			key: "19c6kt"
		}],
		["path", {
			d: "M17.99 5.52a20.82 20.82 0 0 1 3.15 4.5.8.8 0 0 1-.68 1.13c-2.33.2-5.3-.32-8.27-1.57",
			key: "85ghs3"
		}],
		["path", {
			d: "M4.93 4.93 3 3a.7.7 0 0 1 0-1",
			key: "x087yj"
		}],
		["path", {
			d: "M9.58 12.18c1.24 2.98 1.77 5.95 1.57 8.28a.8.8 0 0 1-1.13.68 20.82 20.82 0 0 1-4.5-3.15",
			key: "11xdqo"
		}]
	]);
	const Hospital = createLucideIcon("Hospital", [
		["path", {
			d: "M12 6v4",
			key: "16clxf"
		}],
		["path", {
			d: "M14 14h-4",
			key: "esezmu"
		}],
		["path", {
			d: "M14 18h-4",
			key: "16mqa2"
		}],
		["path", {
			d: "M14 8h-4",
			key: "z8ypaz"
		}],
		["path", {
			d: "M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2",
			key: "b1k337"
		}],
		["path", {
			d: "M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18",
			key: "16g51d"
		}]
	]);
	const Hotel = createLucideIcon("Hotel", [
		["path", {
			d: "M10 22v-6.57",
			key: "1wmca3"
		}],
		["path", {
			d: "M12 11h.01",
			key: "z322tv"
		}],
		["path", {
			d: "M12 7h.01",
			key: "1ivr5q"
		}],
		["path", {
			d: "M14 15.43V22",
			key: "1q2vjd"
		}],
		["path", {
			d: "M15 16a5 5 0 0 0-6 0",
			key: "o9wqvi"
		}],
		["path", {
			d: "M16 11h.01",
			key: "xkw8gn"
		}],
		["path", {
			d: "M16 7h.01",
			key: "1kdx03"
		}],
		["path", {
			d: "M8 11h.01",
			key: "1dfujw"
		}],
		["path", {
			d: "M8 7h.01",
			key: "1vti4s"
		}],
		["rect", {
			x: "4",
			y: "2",
			width: "16",
			height: "20",
			rx: "2",
			key: "1uxh74"
		}]
	]);
	const Hourglass = createLucideIcon("Hourglass", [
		["path", {
			d: "M5 22h14",
			key: "ehvnwv"
		}],
		["path", {
			d: "M5 2h14",
			key: "pdyrp9"
		}],
		["path", {
			d: "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",
			key: "1d314k"
		}],
		["path", {
			d: "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",
			key: "1vvvr6"
		}]
	]);
	const HousePlug = createLucideIcon("HousePlug", [
		["path", {
			d: "M10 12V8.964",
			key: "1vll13"
		}],
		["path", {
			d: "M14 12V8.964",
			key: "1x3qvg"
		}],
		["path", {
			d: "M15 12a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1z",
			key: "ppykja"
		}],
		["path", {
			d: "M8.5 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-2",
			key: "1gvg2z"
		}]
	]);
	const HousePlus = createLucideIcon("HousePlus", [
		["path", {
			d: "M13.22 2.416a2 2 0 0 0-2.511.057l-7 5.999A2 2 0 0 0 3 10v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7.354",
			key: "5phn05"
		}],
		["path", {
			d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
			key: "5wwlr5"
		}],
		["path", {
			d: "M15 6h6",
			key: "1jlkvy"
		}],
		["path", {
			d: "M18 3v6",
			key: "x1uolp"
		}]
	]);
	const House = createLucideIcon("House", [["path", {
		d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
		key: "5wwlr5"
	}], ["path", {
		d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
		key: "1d0kgt"
	}]]);
	const IceCreamBowl = createLucideIcon("IceCreamBowl", [
		["path", {
			d: "M12 17c5 0 8-2.69 8-6H4c0 3.31 3 6 8 6m-4 4h8m-4-3v3M5.14 11a3.5 3.5 0 1 1 6.71 0",
			key: "1uxfcu"
		}],
		["path", {
			d: "M12.14 11a3.5 3.5 0 1 1 6.71 0",
			key: "4k3m1s"
		}],
		["path", {
			d: "M15.5 6.5a3.5 3.5 0 1 0-7 0",
			key: "zmuahr"
		}]
	]);
	const IceCreamCone = createLucideIcon("IceCreamCone", [
		["path", {
			d: "m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11",
			key: "1v6356"
		}],
		["path", {
			d: "M17 7A5 5 0 0 0 7 7",
			key: "151p3v"
		}],
		["path", {
			d: "M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4",
			key: "1sdaij"
		}]
	]);
	const IdCard = createLucideIcon("IdCard", [
		["path", {
			d: "M16 10h2",
			key: "8sgtl7"
		}],
		["path", {
			d: "M16 14h2",
			key: "epxaof"
		}],
		["path", {
			d: "M6.17 15a3 3 0 0 1 5.66 0",
			key: "n6f512"
		}],
		["circle", {
			cx: "9",
			cy: "11",
			r: "2",
			key: "yxgjnd"
		}],
		["rect", {
			x: "2",
			y: "5",
			width: "20",
			height: "14",
			rx: "2",
			key: "qneu4z"
		}]
	]);
	const ImageDown = createLucideIcon("ImageDown", [
		["path", {
			d: "M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21",
			key: "9csbqa"
		}],
		["path", {
			d: "m14 19 3 3v-5.5",
			key: "9ldu5r"
		}],
		["path", {
			d: "m17 22 3-3",
			key: "1nkfve"
		}],
		["circle", {
			cx: "9",
			cy: "9",
			r: "2",
			key: "af1f0g"
		}]
	]);
	const ImageMinus = createLucideIcon("ImageMinus", [
		["path", {
			d: "M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7",
			key: "m87ecr"
		}],
		["line", {
			x1: "16",
			x2: "22",
			y1: "5",
			y2: "5",
			key: "ez7e4s"
		}],
		["circle", {
			cx: "9",
			cy: "9",
			r: "2",
			key: "af1f0g"
		}],
		["path", {
			d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
			key: "1xmnt7"
		}]
	]);
	const ImageOff = createLucideIcon("ImageOff", [
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}],
		["path", {
			d: "M10.41 10.41a2 2 0 1 1-2.83-2.83",
			key: "1bzlo9"
		}],
		["line", {
			x1: "13.5",
			x2: "6",
			y1: "13.5",
			y2: "21",
			key: "1q0aeu"
		}],
		["line", {
			x1: "18",
			x2: "21",
			y1: "12",
			y2: "15",
			key: "5mozeu"
		}],
		["path", {
			d: "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",
			key: "mmje98"
		}],
		["path", {
			d: "M21 15V5a2 2 0 0 0-2-2H9",
			key: "43el77"
		}]
	]);
	const ImagePlay = createLucideIcon("ImagePlay", [
		["path", {
			d: "m11 16-5 5",
			key: "j5f7ct"
		}],
		["path", {
			d: "M11 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6.5",
			key: "7s81lt"
		}],
		["path", {
			d: "M15.765 22a.5.5 0 0 1-.765-.424V13.38a.5.5 0 0 1 .765-.424l5.878 3.674a1 1 0 0 1 0 1.696z",
			key: "1omb6s"
		}],
		["circle", {
			cx: "9",
			cy: "9",
			r: "2",
			key: "af1f0g"
		}]
	]);
	const ImagePlus = createLucideIcon("ImagePlus", [
		["path", {
			d: "M16 5h6",
			key: "1vod17"
		}],
		["path", {
			d: "M19 2v6",
			key: "4bpg5p"
		}],
		["path", {
			d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",
			key: "1ue2ih"
		}],
		["path", {
			d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
			key: "1xmnt7"
		}],
		["circle", {
			cx: "9",
			cy: "9",
			r: "2",
			key: "af1f0g"
		}]
	]);
	const ImageUp = createLucideIcon("ImageUp", [
		["path", {
			d: "M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21",
			key: "9csbqa"
		}],
		["path", {
			d: "m14 19.5 3-3 3 3",
			key: "9vmjn0"
		}],
		["path", {
			d: "M17 22v-5.5",
			key: "1aa6fl"
		}],
		["circle", {
			cx: "9",
			cy: "9",
			r: "2",
			key: "af1f0g"
		}]
	]);
	const ImageUpscale = createLucideIcon("ImageUpscale", [
		["path", {
			d: "M16 3h5v5",
			key: "1806ms"
		}],
		["path", {
			d: "M17 21h2a2 2 0 0 0 2-2",
			key: "130fy9"
		}],
		["path", {
			d: "M21 12v3",
			key: "1wzk3p"
		}],
		["path", {
			d: "m21 3-5 5",
			key: "1g5oa7"
		}],
		["path", {
			d: "M3 7V5a2 2 0 0 1 2-2",
			key: "kk3yz1"
		}],
		["path", {
			d: "m5 21 4.144-4.144a1.21 1.21 0 0 1 1.712 0L13 19",
			key: "fyekpt"
		}],
		["path", {
			d: "M9 3h3",
			key: "d52fa"
		}],
		["rect", {
			x: "3",
			y: "11",
			width: "10",
			height: "10",
			rx: "1",
			key: "1wpmix"
		}]
	]);
	const Image = createLucideIcon("Image", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			ry: "2",
			key: "1m3agn"
		}],
		["circle", {
			cx: "9",
			cy: "9",
			r: "2",
			key: "af1f0g"
		}],
		["path", {
			d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
			key: "1xmnt7"
		}]
	]);
	const Images = createLucideIcon("Images", [
		["path", {
			d: "M18 22H4a2 2 0 0 1-2-2V6",
			key: "pblm9e"
		}],
		["path", {
			d: "m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18",
			key: "nf6bnh"
		}],
		["circle", {
			cx: "12",
			cy: "8",
			r: "2",
			key: "1822b1"
		}],
		["rect", {
			width: "16",
			height: "16",
			x: "6",
			y: "2",
			rx: "2",
			key: "12espp"
		}]
	]);
	const Import = createLucideIcon("Import", [
		["path", {
			d: "M12 3v12",
			key: "1x0j5s"
		}],
		["path", {
			d: "m8 11 4 4 4-4",
			key: "1dohi6"
		}],
		["path", {
			d: "M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4",
			key: "1ywtjm"
		}]
	]);
	const Inbox = createLucideIcon("Inbox", [["polyline", {
		points: "22 12 16 12 14 15 10 15 8 12 2 12",
		key: "o97t9d"
	}], ["path", {
		d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
		key: "oot6mr"
	}]]);
	const IndentDecrease = createLucideIcon("IndentDecrease", [
		["path", {
			d: "M21 12H11",
			key: "wd7e0v"
		}],
		["path", {
			d: "M21 18H11",
			key: "4wu86t"
		}],
		["path", {
			d: "M21 6H11",
			key: "6dy1d6"
		}],
		["path", {
			d: "m7 8-4 4 4 4",
			key: "o5hrat"
		}]
	]);
	const IndentIncrease = createLucideIcon("IndentIncrease", [
		["path", {
			d: "M21 12H11",
			key: "wd7e0v"
		}],
		["path", {
			d: "M21 18H11",
			key: "4wu86t"
		}],
		["path", {
			d: "M21 6H11",
			key: "6dy1d6"
		}],
		["path", {
			d: "m3 8 4 4-4 4",
			key: "1a3j6y"
		}]
	]);
	const IndianRupee = createLucideIcon("IndianRupee", [
		["path", {
			d: "M6 3h12",
			key: "ggurg9"
		}],
		["path", {
			d: "M6 8h12",
			key: "6g4wlu"
		}],
		["path", {
			d: "m6 13 8.5 8",
			key: "u1kupk"
		}],
		["path", {
			d: "M6 13h3",
			key: "wdp6ag"
		}],
		["path", {
			d: "M9 13c6.667 0 6.667-10 0-10",
			key: "1nkvk2"
		}]
	]);
	const Infinity$1 = createLucideIcon("Infinity", [["path", {
		d: "M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z",
		key: "1z0uae"
	}]]);
	const Info = createLucideIcon("Info", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M12 16v-4",
			key: "1dtifu"
		}],
		["path", {
			d: "M12 8h.01",
			key: "e9boi3"
		}]
	]);
	const InspectionPanel = createLucideIcon("InspectionPanel", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M7 7h.01",
			key: "7u93v4"
		}],
		["path", {
			d: "M17 7h.01",
			key: "14a9sn"
		}],
		["path", {
			d: "M7 17h.01",
			key: "19xn7k"
		}],
		["path", {
			d: "M17 17h.01",
			key: "1sd3ek"
		}]
	]);
	const Instagram = createLucideIcon("Instagram", [
		["rect", {
			width: "20",
			height: "20",
			x: "2",
			y: "2",
			rx: "5",
			ry: "5",
			key: "2e1cvw"
		}],
		["path", {
			d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",
			key: "9exkf1"
		}],
		["line", {
			x1: "17.5",
			x2: "17.51",
			y1: "6.5",
			y2: "6.5",
			key: "r4j83e"
		}]
	]);
	const Italic = createLucideIcon("Italic", [
		["line", {
			x1: "19",
			x2: "10",
			y1: "4",
			y2: "4",
			key: "15jd3p"
		}],
		["line", {
			x1: "14",
			x2: "5",
			y1: "20",
			y2: "20",
			key: "bu0au3"
		}],
		["line", {
			x1: "15",
			x2: "9",
			y1: "4",
			y2: "20",
			key: "uljnxc"
		}]
	]);
	const IterationCcw = createLucideIcon("IterationCcw", [["path", {
		d: "M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8h8",
		key: "4znkd0"
	}], ["polyline", {
		points: "16 14 20 18 16 22",
		key: "11njsm"
	}]]);
	const IterationCw = createLucideIcon("IterationCw", [["path", {
		d: "M4 10c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8H4",
		key: "tuf4su"
	}], ["polyline", {
		points: "8 22 4 18 8 14",
		key: "evkj9s"
	}]]);
	const JapaneseYen = createLucideIcon("JapaneseYen", [
		["path", {
			d: "M12 9.5V21m0-11.5L6 3m6 6.5L18 3",
			key: "2ej80x"
		}],
		["path", {
			d: "M6 15h12",
			key: "1hwgt5"
		}],
		["path", {
			d: "M6 11h12",
			key: "wf4gp6"
		}]
	]);
	const Joystick = createLucideIcon("Joystick", [
		["path", {
			d: "M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z",
			key: "jg2n2t"
		}],
		["path", {
			d: "M6 15v-2",
			key: "gd6mvg"
		}],
		["path", {
			d: "M12 15V9",
			key: "8c7uyn"
		}],
		["circle", {
			cx: "12",
			cy: "6",
			r: "3",
			key: "1gm2ql"
		}]
	]);
	const Kanban = createLucideIcon("Kanban", [
		["path", {
			d: "M6 5v11",
			key: "mdvv1e"
		}],
		["path", {
			d: "M12 5v6",
			key: "14ar3b"
		}],
		["path", {
			d: "M18 5v14",
			key: "7ji314"
		}]
	]);
	const KeyRound = createLucideIcon("KeyRound", [["path", {
		d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
		key: "1s6t7t"
	}], ["circle", {
		cx: "16.5",
		cy: "7.5",
		r: ".5",
		fill: "currentColor",
		key: "w0ekpg"
	}]]);
	const KeySquare = createLucideIcon("KeySquare", [
		["path", {
			d: "M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z",
			key: "165ttr"
		}],
		["path", {
			d: "m14 7 3 3",
			key: "1r5n42"
		}],
		["path", {
			d: "m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814",
			key: "1ubxi2"
		}]
	]);
	const Key = createLucideIcon("Key", [
		["path", {
			d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",
			key: "g0fldk"
		}],
		["path", {
			d: "m21 2-9.6 9.6",
			key: "1j0ho8"
		}],
		["circle", {
			cx: "7.5",
			cy: "15.5",
			r: "5.5",
			key: "yqb3hr"
		}]
	]);
	const KeyboardMusic = createLucideIcon("KeyboardMusic", [
		["rect", {
			width: "20",
			height: "16",
			x: "2",
			y: "4",
			rx: "2",
			key: "18n3k1"
		}],
		["path", {
			d: "M6 8h4",
			key: "utf9t1"
		}],
		["path", {
			d: "M14 8h.01",
			key: "1primd"
		}],
		["path", {
			d: "M18 8h.01",
			key: "emo2bl"
		}],
		["path", {
			d: "M2 12h20",
			key: "9i4pu4"
		}],
		["path", {
			d: "M6 12v4",
			key: "dy92yo"
		}],
		["path", {
			d: "M10 12v4",
			key: "1fxnav"
		}],
		["path", {
			d: "M14 12v4",
			key: "1hft58"
		}],
		["path", {
			d: "M18 12v4",
			key: "tjjnbz"
		}]
	]);
	const KeyboardOff = createLucideIcon("KeyboardOff", [
		["path", {
			d: "M 20 4 A2 2 0 0 1 22 6",
			key: "1g1fkt"
		}],
		["path", {
			d: "M 22 6 L 22 16.41",
			key: "1qjg3w"
		}],
		["path", {
			d: "M 7 16 L 16 16",
			key: "n0yqwb"
		}],
		["path", {
			d: "M 9.69 4 L 20 4",
			key: "kbpcgx"
		}],
		["path", {
			d: "M14 8h.01",
			key: "1primd"
		}],
		["path", {
			d: "M18 8h.01",
			key: "emo2bl"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2",
			key: "s23sx2"
		}],
		["path", {
			d: "M6 8h.01",
			key: "x9i8wu"
		}],
		["path", {
			d: "M8 12h.01",
			key: "czm47f"
		}]
	]);
	const Keyboard = createLucideIcon("Keyboard", [
		["path", {
			d: "M10 8h.01",
			key: "1r9ogq"
		}],
		["path", {
			d: "M12 12h.01",
			key: "1mp3jc"
		}],
		["path", {
			d: "M14 8h.01",
			key: "1primd"
		}],
		["path", {
			d: "M16 12h.01",
			key: "1l6xoz"
		}],
		["path", {
			d: "M18 8h.01",
			key: "emo2bl"
		}],
		["path", {
			d: "M6 8h.01",
			key: "x9i8wu"
		}],
		["path", {
			d: "M7 16h10",
			key: "wp8him"
		}],
		["path", {
			d: "M8 12h.01",
			key: "czm47f"
		}],
		["rect", {
			width: "20",
			height: "16",
			x: "2",
			y: "4",
			rx: "2",
			key: "18n3k1"
		}]
	]);
	const LampCeiling = createLucideIcon("LampCeiling", [
		["path", {
			d: "M12 2v5",
			key: "nd4vlx"
		}],
		["path", {
			d: "M6 7h12l4 9H2l4-9Z",
			key: "123d64"
		}],
		["path", {
			d: "M9.17 16a3 3 0 1 0 5.66 0",
			key: "1061mw"
		}]
	]);
	const LampDesk = createLucideIcon("LampDesk", [
		["path", {
			d: "m14 5-3 3 2 7 8-8-7-2Z",
			key: "1b0msb"
		}],
		["path", {
			d: "m14 5-3 3-3-3 3-3 3 3Z",
			key: "1uemms"
		}],
		["path", {
			d: "M9.5 6.5 4 12l3 6",
			key: "1bx08v"
		}],
		["path", {
			d: "M3 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H3Z",
			key: "wap775"
		}]
	]);
	const LampFloor = createLucideIcon("LampFloor", [
		["path", {
			d: "M9 2h6l3 7H6l3-7Z",
			key: "wcx6mj"
		}],
		["path", {
			d: "M12 9v13",
			key: "3n1su1"
		}],
		["path", {
			d: "M9 22h6",
			key: "1rlq3v"
		}]
	]);
	const LampWallDown = createLucideIcon("LampWallDown", [
		["path", {
			d: "M11 13h6l3 7H8l3-7Z",
			key: "9n3qlo"
		}],
		["path", {
			d: "M14 13V8a2 2 0 0 0-2-2H8",
			key: "1hu4hb"
		}],
		["path", {
			d: "M4 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4v6Z",
			key: "s053bc"
		}]
	]);
	const LampWallUp = createLucideIcon("LampWallUp", [
		["path", {
			d: "M11 4h6l3 7H8l3-7Z",
			key: "11x1ee"
		}],
		["path", {
			d: "M14 11v5a2 2 0 0 1-2 2H8",
			key: "eutp5o"
		}],
		["path", {
			d: "M4 15h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4v-6Z",
			key: "1iuthr"
		}]
	]);
	const Lamp = createLucideIcon("Lamp", [
		["path", {
			d: "M8 2h8l4 10H4L8 2Z",
			key: "9dma5w"
		}],
		["path", {
			d: "M12 12v6",
			key: "3ahymv"
		}],
		["path", {
			d: "M8 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H8Z",
			key: "mwf4oh"
		}]
	]);
	const LandPlot = createLucideIcon("LandPlot", [
		["path", {
			d: "m12 8 6-3-6-3v10",
			key: "mvpnpy"
		}],
		["path", {
			d: "m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12",
			key: "ek95tt"
		}],
		["path", {
			d: "m6.49 12.85 11.02 6.3",
			key: "1kt42w"
		}],
		["path", {
			d: "M17.51 12.85 6.5 19.15",
			key: "v55bdg"
		}]
	]);
	const Landmark = createLucideIcon("Landmark", [
		["line", {
			x1: "3",
			x2: "21",
			y1: "22",
			y2: "22",
			key: "j8o0r"
		}],
		["line", {
			x1: "6",
			x2: "6",
			y1: "18",
			y2: "11",
			key: "10tf0k"
		}],
		["line", {
			x1: "10",
			x2: "10",
			y1: "18",
			y2: "11",
			key: "54lgf6"
		}],
		["line", {
			x1: "14",
			x2: "14",
			y1: "18",
			y2: "11",
			key: "380y"
		}],
		["line", {
			x1: "18",
			x2: "18",
			y1: "18",
			y2: "11",
			key: "1kevvc"
		}],
		["polygon", {
			points: "12 2 20 7 4 7",
			key: "jkujk7"
		}]
	]);
	const Languages = createLucideIcon("Languages", [
		["path", {
			d: "m5 8 6 6",
			key: "1wu5hv"
		}],
		["path", {
			d: "m4 14 6-6 2-3",
			key: "1k1g8d"
		}],
		["path", {
			d: "M2 5h12",
			key: "or177f"
		}],
		["path", {
			d: "M7 2h1",
			key: "1t2jsx"
		}],
		["path", {
			d: "m22 22-5-10-5 10",
			key: "don7ne"
		}],
		["path", {
			d: "M14 18h6",
			key: "1m8k6r"
		}]
	]);
	const LaptopMinimalCheck = createLucideIcon("LaptopMinimalCheck", [
		["path", {
			d: "M2 20h20",
			key: "owomy5"
		}],
		["path", {
			d: "m9 10 2 2 4-4",
			key: "1gnqz4"
		}],
		["rect", {
			x: "3",
			y: "4",
			width: "18",
			height: "12",
			rx: "2",
			key: "8ur36m"
		}]
	]);
	const LaptopMinimal = createLucideIcon("LaptopMinimal", [["rect", {
		width: "18",
		height: "12",
		x: "3",
		y: "4",
		rx: "2",
		ry: "2",
		key: "1qhy41"
	}], ["line", {
		x1: "2",
		x2: "22",
		y1: "20",
		y2: "20",
		key: "ni3hll"
	}]]);
	const Laptop = createLucideIcon("Laptop", [["path", {
		d: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16",
		key: "tarvll"
	}]]);
	const LassoSelect = createLucideIcon("LassoSelect", [
		["path", {
			d: "M7 22a5 5 0 0 1-2-4",
			key: "umushi"
		}],
		["path", {
			d: "M7 16.93c.96.43 1.96.74 2.99.91",
			key: "ybbtv3"
		}],
		["path", {
			d: "M3.34 14A6.8 6.8 0 0 1 2 10c0-4.42 4.48-8 10-8s10 3.58 10 8a7.19 7.19 0 0 1-.33 2",
			key: "gt5e1w"
		}],
		["path", {
			d: "M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
			key: "bq3ynw"
		}],
		["path", {
			d: "M14.33 22h-.09a.35.35 0 0 1-.24-.32v-10a.34.34 0 0 1 .33-.34c.08 0 .15.03.21.08l7.34 6a.33.33 0 0 1-.21.59h-4.49l-2.57 3.85a.35.35 0 0 1-.28.14z",
			key: "72q637"
		}]
	]);
	const Lasso = createLucideIcon("Lasso", [
		["path", {
			d: "M7 22a5 5 0 0 1-2-4",
			key: "umushi"
		}],
		["path", {
			d: "M3.3 14A6.8 6.8 0 0 1 2 10c0-4.4 4.5-8 10-8s10 3.6 10 8-4.5 8-10 8a12 12 0 0 1-5-1",
			key: "146dds"
		}],
		["path", {
			d: "M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
			key: "bq3ynw"
		}]
	]);
	const Laugh = createLucideIcon("Laugh", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z",
			key: "b2q4dd"
		}],
		["line", {
			x1: "9",
			x2: "9.01",
			y1: "9",
			y2: "9",
			key: "yxxnd0"
		}],
		["line", {
			x1: "15",
			x2: "15.01",
			y1: "9",
			y2: "9",
			key: "1p4y9e"
		}]
	]);
	const Layers2 = createLucideIcon("Layers2", [["path", {
		d: "m16.02 12 5.48 3.13a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74L7.98 12",
		key: "1cuww1"
	}], ["path", {
		d: "M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74Z",
		key: "pdlvxu"
	}]]);
	const Layers = createLucideIcon("Layers", [
		["path", {
			d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
			key: "zw3jo"
		}],
		["path", {
			d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
			key: "1wduqc"
		}],
		["path", {
			d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
			key: "kqbvx6"
		}]
	]);
	const LayoutDashboard = createLucideIcon("LayoutDashboard", [
		["rect", {
			width: "7",
			height: "9",
			x: "3",
			y: "3",
			rx: "1",
			key: "10lvy0"
		}],
		["rect", {
			width: "7",
			height: "5",
			x: "14",
			y: "3",
			rx: "1",
			key: "16une8"
		}],
		["rect", {
			width: "7",
			height: "9",
			x: "14",
			y: "12",
			rx: "1",
			key: "1hutg5"
		}],
		["rect", {
			width: "7",
			height: "5",
			x: "3",
			y: "16",
			rx: "1",
			key: "ldoo1y"
		}]
	]);
	const LayoutGrid = createLucideIcon("LayoutGrid", [
		["rect", {
			width: "7",
			height: "7",
			x: "3",
			y: "3",
			rx: "1",
			key: "1g98yp"
		}],
		["rect", {
			width: "7",
			height: "7",
			x: "14",
			y: "3",
			rx: "1",
			key: "6d4xhi"
		}],
		["rect", {
			width: "7",
			height: "7",
			x: "14",
			y: "14",
			rx: "1",
			key: "nxv5o0"
		}],
		["rect", {
			width: "7",
			height: "7",
			x: "3",
			y: "14",
			rx: "1",
			key: "1bb6yr"
		}]
	]);
	const LayoutList = createLucideIcon("LayoutList", [
		["rect", {
			width: "7",
			height: "7",
			x: "3",
			y: "3",
			rx: "1",
			key: "1g98yp"
		}],
		["rect", {
			width: "7",
			height: "7",
			x: "3",
			y: "14",
			rx: "1",
			key: "1bb6yr"
		}],
		["path", {
			d: "M14 4h7",
			key: "3xa0d5"
		}],
		["path", {
			d: "M14 9h7",
			key: "1icrd9"
		}],
		["path", {
			d: "M14 15h7",
			key: "1mj8o2"
		}],
		["path", {
			d: "M14 20h7",
			key: "11slyb"
		}]
	]);
	const LayoutPanelLeft = createLucideIcon("LayoutPanelLeft", [
		["rect", {
			width: "7",
			height: "18",
			x: "3",
			y: "3",
			rx: "1",
			key: "2obqm"
		}],
		["rect", {
			width: "7",
			height: "7",
			x: "14",
			y: "3",
			rx: "1",
			key: "6d4xhi"
		}],
		["rect", {
			width: "7",
			height: "7",
			x: "14",
			y: "14",
			rx: "1",
			key: "nxv5o0"
		}]
	]);
	const LayoutPanelTop = createLucideIcon("LayoutPanelTop", [
		["rect", {
			width: "18",
			height: "7",
			x: "3",
			y: "3",
			rx: "1",
			key: "f1a2em"
		}],
		["rect", {
			width: "7",
			height: "7",
			x: "3",
			y: "14",
			rx: "1",
			key: "1bb6yr"
		}],
		["rect", {
			width: "7",
			height: "7",
			x: "14",
			y: "14",
			rx: "1",
			key: "nxv5o0"
		}]
	]);
	const LayoutTemplate = createLucideIcon("LayoutTemplate", [
		["rect", {
			width: "18",
			height: "7",
			x: "3",
			y: "3",
			rx: "1",
			key: "f1a2em"
		}],
		["rect", {
			width: "9",
			height: "7",
			x: "3",
			y: "14",
			rx: "1",
			key: "jqznyg"
		}],
		["rect", {
			width: "5",
			height: "7",
			x: "16",
			y: "14",
			rx: "1",
			key: "q5h2i8"
		}]
	]);
	const Leaf = createLucideIcon("Leaf", [["path", {
		d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
		key: "nnexq3"
	}], ["path", {
		d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
		key: "mt58a7"
	}]]);
	const LeafyGreen = createLucideIcon("LeafyGreen", [["path", {
		d: "M2 22c1.25-.987 2.27-1.975 3.9-2.2a5.56 5.56 0 0 1 3.8 1.5 4 4 0 0 0 6.187-2.353 3.5 3.5 0 0 0 3.69-5.116A3.5 3.5 0 0 0 20.95 8 3.5 3.5 0 1 0 16 3.05a3.5 3.5 0 0 0-5.831 1.373 3.5 3.5 0 0 0-5.116 3.69 4 4 0 0 0-2.348 6.155C3.499 15.42 4.409 16.712 4.2 18.1 3.926 19.743 3.014 20.732 2 22",
		key: "1134nt"
	}], ["path", {
		d: "M2 22 17 7",
		key: "1q7jp2"
	}]]);
	const Lectern = createLucideIcon("Lectern", [
		["path", {
			d: "M16 12h3a2 2 0 0 0 1.902-1.38l1.056-3.333A1 1 0 0 0 21 6H3a1 1 0 0 0-.958 1.287l1.056 3.334A2 2 0 0 0 5 12h3",
			key: "13jjxg"
		}],
		["path", {
			d: "M18 6V3a1 1 0 0 0-1-1h-3",
			key: "1550fe"
		}],
		["rect", {
			width: "8",
			height: "12",
			x: "8",
			y: "10",
			rx: "1",
			key: "qmu8b6"
		}]
	]);
	const LetterText = createLucideIcon("LetterText", [
		["path", {
			d: "M15 12h6",
			key: "upa0zy"
		}],
		["path", {
			d: "M15 6h6",
			key: "1jlkvy"
		}],
		["path", {
			d: "m3 13 3.553-7.724a.5.5 0 0 1 .894 0L11 13",
			key: "blevx4"
		}],
		["path", {
			d: "M3 18h18",
			key: "1h113x"
		}],
		["path", {
			d: "M4 11h6",
			key: "olkgv1"
		}]
	]);
	const LibraryBig = createLucideIcon("LibraryBig", [
		["rect", {
			width: "8",
			height: "18",
			x: "3",
			y: "3",
			rx: "1",
			key: "oynpb5"
		}],
		["path", {
			d: "M7 3v18",
			key: "bbkbws"
		}],
		["path", {
			d: "M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z",
			key: "1qboyk"
		}]
	]);
	const Library = createLucideIcon("Library", [
		["path", {
			d: "m16 6 4 14",
			key: "ji33uf"
		}],
		["path", {
			d: "M12 6v14",
			key: "1n7gus"
		}],
		["path", {
			d: "M8 8v12",
			key: "1gg7y9"
		}],
		["path", {
			d: "M4 4v16",
			key: "6qkkli"
		}]
	]);
	const LifeBuoy = createLucideIcon("LifeBuoy", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "m4.93 4.93 4.24 4.24",
			key: "1ymg45"
		}],
		["path", {
			d: "m14.83 9.17 4.24-4.24",
			key: "1cb5xl"
		}],
		["path", {
			d: "m14.83 14.83 4.24 4.24",
			key: "q42g0n"
		}],
		["path", {
			d: "m9.17 14.83-4.24 4.24",
			key: "bqpfvv"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "4",
			key: "4exip2"
		}]
	]);
	const Ligature = createLucideIcon("Ligature", [
		["path", {
			d: "M8 20V8c0-2.2 1.8-4 4-4 1.5 0 2.8.8 3.5 2",
			key: "1rtphz"
		}],
		["path", {
			d: "M6 12h4",
			key: "a4o3ry"
		}],
		["path", {
			d: "M14 12h2v8",
			key: "c1fccl"
		}],
		["path", {
			d: "M6 20h4",
			key: "1i6q5t"
		}],
		["path", {
			d: "M14 20h4",
			key: "lzx1xo"
		}]
	]);
	const LightbulbOff = createLucideIcon("LightbulbOff", [
		["path", {
			d: "M16.8 11.2c.8-.9 1.2-2 1.2-3.2a6 6 0 0 0-9.3-5",
			key: "1fkcox"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M6.3 6.3a4.67 4.67 0 0 0 1.2 5.2c.7.7 1.3 1.5 1.5 2.5",
			key: "10m8kw"
		}],
		["path", {
			d: "M9 18h6",
			key: "x1upvd"
		}],
		["path", {
			d: "M10 22h4",
			key: "ceow96"
		}]
	]);
	const Lightbulb = createLucideIcon("Lightbulb", [
		["path", {
			d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
			key: "1gvzjb"
		}],
		["path", {
			d: "M9 18h6",
			key: "x1upvd"
		}],
		["path", {
			d: "M10 22h4",
			key: "ceow96"
		}]
	]);
	const Link2Off = createLucideIcon("Link2Off", [
		["path", {
			d: "M9 17H7A5 5 0 0 1 7 7",
			key: "10o201"
		}],
		["path", {
			d: "M15 7h2a5 5 0 0 1 4 8",
			key: "1d3206"
		}],
		["line", {
			x1: "8",
			x2: "12",
			y1: "12",
			y2: "12",
			key: "rvw6j4"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Link2 = createLucideIcon("Link2", [
		["path", {
			d: "M9 17H7A5 5 0 0 1 7 7h2",
			key: "8i5ue5"
		}],
		["path", {
			d: "M15 7h2a5 5 0 1 1 0 10h-2",
			key: "1b9ql8"
		}],
		["line", {
			x1: "8",
			x2: "16",
			y1: "12",
			y2: "12",
			key: "1jonct"
		}]
	]);
	const Link$1 = createLucideIcon("Link", [["path", {
		d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
		key: "1cjeqo"
	}], ["path", {
		d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
		key: "19qd67"
	}]]);
	const Linkedin = createLucideIcon("Linkedin", [
		["path", {
			d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
			key: "c2jq9f"
		}],
		["rect", {
			width: "4",
			height: "12",
			x: "2",
			y: "9",
			key: "mk3on5"
		}],
		["circle", {
			cx: "4",
			cy: "4",
			r: "2",
			key: "bt5ra8"
		}]
	]);
	const ListCheck = createLucideIcon("ListCheck", [
		["path", {
			d: "M11 18H3",
			key: "n3j2dh"
		}],
		["path", {
			d: "m15 18 2 2 4-4",
			key: "1szwhi"
		}],
		["path", {
			d: "M16 12H3",
			key: "1a2rj7"
		}],
		["path", {
			d: "M16 6H3",
			key: "1wxfjs"
		}]
	]);
	const ListChecks = createLucideIcon("ListChecks", [
		["path", {
			d: "m3 17 2 2 4-4",
			key: "1jhpwq"
		}],
		["path", {
			d: "m3 7 2 2 4-4",
			key: "1obspn"
		}],
		["path", {
			d: "M13 6h8",
			key: "15sg57"
		}],
		["path", {
			d: "M13 12h8",
			key: "h98zly"
		}],
		["path", {
			d: "M13 18h8",
			key: "oe0vm4"
		}]
	]);
	const ListCollapse = createLucideIcon("ListCollapse", [
		["path", {
			d: "m3 10 2.5-2.5L3 5",
			key: "i6eama"
		}],
		["path", {
			d: "m3 19 2.5-2.5L3 14",
			key: "w2gmor"
		}],
		["path", {
			d: "M10 6h11",
			key: "c7qv1k"
		}],
		["path", {
			d: "M10 12h11",
			key: "6m4ad9"
		}],
		["path", {
			d: "M10 18h11",
			key: "11hvi2"
		}]
	]);
	const ListEnd = createLucideIcon("ListEnd", [
		["path", {
			d: "M16 12H3",
			key: "1a2rj7"
		}],
		["path", {
			d: "M16 6H3",
			key: "1wxfjs"
		}],
		["path", {
			d: "M10 18H3",
			key: "13769t"
		}],
		["path", {
			d: "M21 6v10a2 2 0 0 1-2 2h-5",
			key: "ilrcs8"
		}],
		["path", {
			d: "m16 16-2 2 2 2",
			key: "kkc6pm"
		}]
	]);
	const ListFilterPlus = createLucideIcon("ListFilterPlus", [
		["path", {
			d: "M10 18h4",
			key: "1ulq68"
		}],
		["path", {
			d: "M11 6H3",
			key: "1u26ik"
		}],
		["path", {
			d: "M15 6h6",
			key: "1jlkvy"
		}],
		["path", {
			d: "M18 9V3",
			key: "xwwp7m"
		}],
		["path", {
			d: "M7 12h8",
			key: "7a1bxv"
		}]
	]);
	const ListFilter = createLucideIcon("ListFilter", [
		["path", {
			d: "M3 6h18",
			key: "d0wm0j"
		}],
		["path", {
			d: "M7 12h10",
			key: "b7w52i"
		}],
		["path", {
			d: "M10 18h4",
			key: "1ulq68"
		}]
	]);
	const ListMinus = createLucideIcon("ListMinus", [
		["path", {
			d: "M11 12H3",
			key: "51ecnj"
		}],
		["path", {
			d: "M16 6H3",
			key: "1wxfjs"
		}],
		["path", {
			d: "M16 18H3",
			key: "12xzn7"
		}],
		["path", {
			d: "M21 12h-6",
			key: "bt1uis"
		}]
	]);
	const ListMusic = createLucideIcon("ListMusic", [
		["path", {
			d: "M21 15V6",
			key: "h1cx4g"
		}],
		["path", {
			d: "M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
			key: "8saifv"
		}],
		["path", {
			d: "M12 12H3",
			key: "18klou"
		}],
		["path", {
			d: "M16 6H3",
			key: "1wxfjs"
		}],
		["path", {
			d: "M12 18H3",
			key: "11ftsu"
		}]
	]);
	const ListOrdered = createLucideIcon("ListOrdered", [
		["path", {
			d: "M10 12h11",
			key: "6m4ad9"
		}],
		["path", {
			d: "M10 18h11",
			key: "11hvi2"
		}],
		["path", {
			d: "M10 6h11",
			key: "c7qv1k"
		}],
		["path", {
			d: "M4 10h2",
			key: "16xx2s"
		}],
		["path", {
			d: "M4 6h1v4",
			key: "cnovpq"
		}],
		["path", {
			d: "M6 18H4c0-1 2-2 2-3s-1-1.5-2-1",
			key: "m9a95d"
		}]
	]);
	const ListPlus = createLucideIcon("ListPlus", [
		["path", {
			d: "M11 12H3",
			key: "51ecnj"
		}],
		["path", {
			d: "M16 6H3",
			key: "1wxfjs"
		}],
		["path", {
			d: "M16 18H3",
			key: "12xzn7"
		}],
		["path", {
			d: "M18 9v6",
			key: "1twb98"
		}],
		["path", {
			d: "M21 12h-6",
			key: "bt1uis"
		}]
	]);
	const ListRestart = createLucideIcon("ListRestart", [
		["path", {
			d: "M21 6H3",
			key: "1jwq7v"
		}],
		["path", {
			d: "M7 12H3",
			key: "13ou7f"
		}],
		["path", {
			d: "M7 18H3",
			key: "1sijw9"
		}],
		["path", {
			d: "M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14",
			key: "qth677"
		}],
		["path", {
			d: "M11 10v4h4",
			key: "172dkj"
		}]
	]);
	const ListStart = createLucideIcon("ListStart", [
		["path", {
			d: "M16 12H3",
			key: "1a2rj7"
		}],
		["path", {
			d: "M16 18H3",
			key: "12xzn7"
		}],
		["path", {
			d: "M10 6H3",
			key: "lf8lx7"
		}],
		["path", {
			d: "M21 18V8a2 2 0 0 0-2-2h-5",
			key: "1hghli"
		}],
		["path", {
			d: "m16 8-2-2 2-2",
			key: "160uvd"
		}]
	]);
	const ListTodo = createLucideIcon("ListTodo", [
		["rect", {
			x: "3",
			y: "5",
			width: "6",
			height: "6",
			rx: "1",
			key: "1defrl"
		}],
		["path", {
			d: "m3 17 2 2 4-4",
			key: "1jhpwq"
		}],
		["path", {
			d: "M13 6h8",
			key: "15sg57"
		}],
		["path", {
			d: "M13 12h8",
			key: "h98zly"
		}],
		["path", {
			d: "M13 18h8",
			key: "oe0vm4"
		}]
	]);
	const ListTree = createLucideIcon("ListTree", [
		["path", {
			d: "M21 12h-8",
			key: "1bmf0i"
		}],
		["path", {
			d: "M21 6H8",
			key: "1pqkrb"
		}],
		["path", {
			d: "M21 18h-8",
			key: "1tm79t"
		}],
		["path", {
			d: "M3 6v4c0 1.1.9 2 2 2h3",
			key: "1ywdgy"
		}],
		["path", {
			d: "M3 10v6c0 1.1.9 2 2 2h3",
			key: "2wc746"
		}]
	]);
	const ListVideo = createLucideIcon("ListVideo", [
		["path", {
			d: "M12 12H3",
			key: "18klou"
		}],
		["path", {
			d: "M16 6H3",
			key: "1wxfjs"
		}],
		["path", {
			d: "M12 18H3",
			key: "11ftsu"
		}],
		["path", {
			d: "m16 12 5 3-5 3v-6Z",
			key: "zpskkp"
		}]
	]);
	const ListX = createLucideIcon("ListX", [
		["path", {
			d: "M11 12H3",
			key: "51ecnj"
		}],
		["path", {
			d: "M16 6H3",
			key: "1wxfjs"
		}],
		["path", {
			d: "M16 18H3",
			key: "12xzn7"
		}],
		["path", {
			d: "m19 10-4 4",
			key: "1tz659"
		}],
		["path", {
			d: "m15 10 4 4",
			key: "1n7nei"
		}]
	]);
	const List = createLucideIcon("List", [
		["path", {
			d: "M3 12h.01",
			key: "nlz23k"
		}],
		["path", {
			d: "M3 18h.01",
			key: "1tta3j"
		}],
		["path", {
			d: "M3 6h.01",
			key: "1rqtza"
		}],
		["path", {
			d: "M8 12h13",
			key: "1za7za"
		}],
		["path", {
			d: "M8 18h13",
			key: "1lx6n3"
		}],
		["path", {
			d: "M8 6h13",
			key: "ik3vkj"
		}]
	]);
	const LoaderCircle = createLucideIcon("LoaderCircle", [["path", {
		d: "M21 12a9 9 0 1 1-6.219-8.56",
		key: "13zald"
	}]]);
	const LoaderPinwheel = createLucideIcon("LoaderPinwheel", [
		["path", {
			d: "M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0",
			key: "1lzz15"
		}],
		["path", {
			d: "M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6",
			key: "1gnrpi"
		}],
		["path", {
			d: "M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6",
			key: "u9yy5q"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}]
	]);
	const Loader = createLucideIcon("Loader", [
		["path", {
			d: "M12 2v4",
			key: "3427ic"
		}],
		["path", {
			d: "m16.2 7.8 2.9-2.9",
			key: "r700ao"
		}],
		["path", {
			d: "M18 12h4",
			key: "wj9ykh"
		}],
		["path", {
			d: "m16.2 16.2 2.9 2.9",
			key: "1bxg5t"
		}],
		["path", {
			d: "M12 18v4",
			key: "jadmvz"
		}],
		["path", {
			d: "m4.9 19.1 2.9-2.9",
			key: "bwix9q"
		}],
		["path", {
			d: "M2 12h4",
			key: "j09sii"
		}],
		["path", {
			d: "m4.9 4.9 2.9 2.9",
			key: "giyufr"
		}]
	]);
	const LocateFixed = createLucideIcon("LocateFixed", [
		["line", {
			x1: "2",
			x2: "5",
			y1: "12",
			y2: "12",
			key: "bvdh0s"
		}],
		["line", {
			x1: "19",
			x2: "22",
			y1: "12",
			y2: "12",
			key: "1tbv5k"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "2",
			y2: "5",
			key: "11lu5j"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "19",
			y2: "22",
			key: "x3vr5v"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "7",
			key: "fim9np"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "3",
			key: "1v7zrd"
		}]
	]);
	const LocateOff = createLucideIcon("LocateOff", [
		["line", {
			x1: "2",
			x2: "5",
			y1: "12",
			y2: "12",
			key: "bvdh0s"
		}],
		["line", {
			x1: "19",
			x2: "22",
			y1: "12",
			y2: "12",
			key: "1tbv5k"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "2",
			y2: "5",
			key: "11lu5j"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "19",
			y2: "22",
			key: "x3vr5v"
		}],
		["path", {
			d: "M7.11 7.11C5.83 8.39 5 10.1 5 12c0 3.87 3.13 7 7 7 1.9 0 3.61-.83 4.89-2.11",
			key: "1oh7ia"
		}],
		["path", {
			d: "M18.71 13.96c.19-.63.29-1.29.29-1.96 0-3.87-3.13-7-7-7-.67 0-1.33.1-1.96.29",
			key: "3qdecy"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Locate = createLucideIcon("Locate", [
		["line", {
			x1: "2",
			x2: "5",
			y1: "12",
			y2: "12",
			key: "bvdh0s"
		}],
		["line", {
			x1: "19",
			x2: "22",
			y1: "12",
			y2: "12",
			key: "1tbv5k"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "2",
			y2: "5",
			key: "11lu5j"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "19",
			y2: "22",
			key: "x3vr5v"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "7",
			key: "fim9np"
		}]
	]);
	const LockKeyholeOpen = createLucideIcon("LockKeyholeOpen", [
		["circle", {
			cx: "12",
			cy: "16",
			r: "1",
			key: "1au0dj"
		}],
		["rect", {
			width: "18",
			height: "12",
			x: "3",
			y: "10",
			rx: "2",
			key: "l0tzu3"
		}],
		["path", {
			d: "M7 10V7a5 5 0 0 1 9.33-2.5",
			key: "car5b7"
		}]
	]);
	const LockKeyhole = createLucideIcon("LockKeyhole", [
		["circle", {
			cx: "12",
			cy: "16",
			r: "1",
			key: "1au0dj"
		}],
		["rect", {
			x: "3",
			y: "10",
			width: "18",
			height: "12",
			rx: "2",
			key: "6s8ecr"
		}],
		["path", {
			d: "M7 10V7a5 5 0 0 1 10 0v3",
			key: "1pqi11"
		}]
	]);
	const LockOpen = createLucideIcon("LockOpen", [["rect", {
		width: "18",
		height: "11",
		x: "3",
		y: "11",
		rx: "2",
		ry: "2",
		key: "1w4ew1"
	}], ["path", {
		d: "M7 11V7a5 5 0 0 1 9.9-1",
		key: "1mm8w8"
	}]]);
	const Lock = createLucideIcon("Lock", [["rect", {
		width: "18",
		height: "11",
		x: "3",
		y: "11",
		rx: "2",
		ry: "2",
		key: "1w4ew1"
	}], ["path", {
		d: "M7 11V7a5 5 0 0 1 10 0v4",
		key: "fwvmzm"
	}]]);
	const LogIn = createLucideIcon("LogIn", [
		["path", {
			d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",
			key: "u53s6r"
		}],
		["polyline", {
			points: "10 17 15 12 10 7",
			key: "1ail0h"
		}],
		["line", {
			x1: "15",
			x2: "3",
			y1: "12",
			y2: "12",
			key: "v6grx8"
		}]
	]);
	const LogOut = createLucideIcon("LogOut", [
		["path", {
			d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
			key: "1uf3rs"
		}],
		["polyline", {
			points: "16 17 21 12 16 7",
			key: "1gabdz"
		}],
		["line", {
			x1: "21",
			x2: "9",
			y1: "12",
			y2: "12",
			key: "1uyos4"
		}]
	]);
	const Logs = createLucideIcon("Logs", [
		["path", {
			d: "M13 12h8",
			key: "h98zly"
		}],
		["path", {
			d: "M13 18h8",
			key: "oe0vm4"
		}],
		["path", {
			d: "M13 6h8",
			key: "15sg57"
		}],
		["path", {
			d: "M3 12h1",
			key: "lp3yf2"
		}],
		["path", {
			d: "M3 18h1",
			key: "1eiwyy"
		}],
		["path", {
			d: "M3 6h1",
			key: "rgxa97"
		}],
		["path", {
			d: "M8 12h1",
			key: "1con00"
		}],
		["path", {
			d: "M8 18h1",
			key: "13wk12"
		}],
		["path", {
			d: "M8 6h1",
			key: "tn6mkg"
		}]
	]);
	const Lollipop = createLucideIcon("Lollipop", [
		["circle", {
			cx: "11",
			cy: "11",
			r: "8",
			key: "4ej97u"
		}],
		["path", {
			d: "m21 21-4.3-4.3",
			key: "1qie3q"
		}],
		["path", {
			d: "M11 11a2 2 0 0 0 4 0 4 4 0 0 0-8 0 6 6 0 0 0 12 0",
			key: "107gwy"
		}]
	]);
	const Luggage = createLucideIcon("Luggage", [
		["path", {
			d: "M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2",
			key: "1m57jg"
		}],
		["path", {
			d: "M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14",
			key: "1l99gc"
		}],
		["path", {
			d: "M10 20h4",
			key: "ni2waw"
		}],
		["circle", {
			cx: "16",
			cy: "20",
			r: "2",
			key: "1vifvg"
		}],
		["circle", {
			cx: "8",
			cy: "20",
			r: "2",
			key: "ckkr5m"
		}]
	]);
	const Magnet = createLucideIcon("Magnet", [
		["path", {
			d: "m6 15-4-4 6.75-6.77a7.79 7.79 0 0 1 11 11L13 22l-4-4 6.39-6.36a2.14 2.14 0 0 0-3-3L6 15",
			key: "1i3lhw"
		}],
		["path", {
			d: "m5 8 4 4",
			key: "j6kj7e"
		}],
		["path", {
			d: "m12 15 4 4",
			key: "lnac28"
		}]
	]);
	const MailCheck = createLucideIcon("MailCheck", [
		["path", {
			d: "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",
			key: "12jkf8"
		}],
		["path", {
			d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
			key: "1ocrg3"
		}],
		["path", {
			d: "m16 19 2 2 4-4",
			key: "1b14m6"
		}]
	]);
	const MailMinus = createLucideIcon("MailMinus", [
		["path", {
			d: "M22 15V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",
			key: "fuxbkv"
		}],
		["path", {
			d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
			key: "1ocrg3"
		}],
		["path", {
			d: "M16 19h6",
			key: "xwg31i"
		}]
	]);
	const MailOpen = createLucideIcon("MailOpen", [["path", {
		d: "M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z",
		key: "1jhwl8"
	}], ["path", {
		d: "m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10",
		key: "1qfld7"
	}]]);
	const MailPlus = createLucideIcon("MailPlus", [
		["path", {
			d: "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",
			key: "12jkf8"
		}],
		["path", {
			d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
			key: "1ocrg3"
		}],
		["path", {
			d: "M19 16v6",
			key: "tddt3s"
		}],
		["path", {
			d: "M16 19h6",
			key: "xwg31i"
		}]
	]);
	const MailQuestion = createLucideIcon("MailQuestion", [
		["path", {
			d: "M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5",
			key: "e61zoh"
		}],
		["path", {
			d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
			key: "1ocrg3"
		}],
		["path", {
			d: "M18 15.28c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2",
			key: "7z9rxb"
		}],
		["path", {
			d: "M20 22v.01",
			key: "12bgn6"
		}]
	]);
	const MailSearch = createLucideIcon("MailSearch", [
		["path", {
			d: "M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5",
			key: "w80f2v"
		}],
		["path", {
			d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
			key: "1ocrg3"
		}],
		["path", {
			d: "M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
			key: "8lzu5m"
		}],
		["circle", {
			cx: "18",
			cy: "18",
			r: "3",
			key: "1xkwt0"
		}],
		["path", {
			d: "m22 22-1.5-1.5",
			key: "1x83k4"
		}]
	]);
	const MailWarning = createLucideIcon("MailWarning", [
		["path", {
			d: "M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5",
			key: "e61zoh"
		}],
		["path", {
			d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
			key: "1ocrg3"
		}],
		["path", {
			d: "M20 14v4",
			key: "1hm744"
		}],
		["path", {
			d: "M20 22v.01",
			key: "12bgn6"
		}]
	]);
	const MailX = createLucideIcon("MailX", [
		["path", {
			d: "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9",
			key: "1j9vog"
		}],
		["path", {
			d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
			key: "1ocrg3"
		}],
		["path", {
			d: "m17 17 4 4",
			key: "1b3523"
		}],
		["path", {
			d: "m21 17-4 4",
			key: "uinynz"
		}]
	]);
	const Mail = createLucideIcon("Mail", [["rect", {
		width: "20",
		height: "16",
		x: "2",
		y: "4",
		rx: "2",
		key: "18n3k1"
	}], ["path", {
		d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
		key: "1ocrg3"
	}]]);
	const Mailbox = createLucideIcon("Mailbox", [
		["path", {
			d: "M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z",
			key: "1lbycx"
		}],
		["polyline", {
			points: "15,9 18,9 18,11",
			key: "1pm9c0"
		}],
		["path", {
			d: "M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2",
			key: "15i455"
		}],
		["line", {
			x1: "6",
			x2: "7",
			y1: "10",
			y2: "10",
			key: "1e2scm"
		}]
	]);
	const Mails = createLucideIcon("Mails", [
		["rect", {
			width: "16",
			height: "13",
			x: "6",
			y: "4",
			rx: "2",
			key: "1drq3f"
		}],
		["path", {
			d: "m22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7",
			key: "xn252p"
		}],
		["path", {
			d: "M2 8v11c0 1.1.9 2 2 2h14",
			key: "n13cji"
		}]
	]);
	const MapPinCheckInside = createLucideIcon("MapPinCheckInside", [["path", {
		d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
		key: "1r0f0z"
	}], ["path", {
		d: "m9 10 2 2 4-4",
		key: "1gnqz4"
	}]]);
	const MapPinCheck = createLucideIcon("MapPinCheck", [
		["path", {
			d: "M19.43 12.935c.357-.967.57-1.955.57-2.935a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32.197 32.197 0 0 0 .813-.728",
			key: "1dq61d"
		}],
		["circle", {
			cx: "12",
			cy: "10",
			r: "3",
			key: "ilqhr7"
		}],
		["path", {
			d: "m16 18 2 2 4-4",
			key: "1mkfmb"
		}]
	]);
	const MapPinHouse = createLucideIcon("MapPinHouse", [
		["path", {
			d: "M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z",
			key: "1p1rcz"
		}],
		["path", {
			d: "M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2",
			key: "mcbcs9"
		}],
		["path", {
			d: "M18 22v-3",
			key: "1t1ugv"
		}],
		["circle", {
			cx: "10",
			cy: "10",
			r: "3",
			key: "1ns7v1"
		}]
	]);
	const MapPinMinusInside = createLucideIcon("MapPinMinusInside", [["path", {
		d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
		key: "1r0f0z"
	}], ["path", {
		d: "M9 10h6",
		key: "9gxzsh"
	}]]);
	const MapPinMinus = createLucideIcon("MapPinMinus", [
		["path", {
			d: "M18.977 14C19.6 12.701 20 11.343 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738",
			key: "11uxia"
		}],
		["circle", {
			cx: "12",
			cy: "10",
			r: "3",
			key: "ilqhr7"
		}],
		["path", {
			d: "M16 18h6",
			key: "987eiv"
		}]
	]);
	const MapPinOff = createLucideIcon("MapPinOff", [
		["path", {
			d: "M12.75 7.09a3 3 0 0 1 2.16 2.16",
			key: "1d4wjd"
		}],
		["path", {
			d: "M17.072 17.072c-1.634 2.17-3.527 3.912-4.471 4.727a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 1.432-4.568",
			key: "12yil7"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M8.475 2.818A8 8 0 0 1 20 10c0 1.183-.31 2.377-.81 3.533",
			key: "lhrkcz"
		}],
		["path", {
			d: "M9.13 9.13a3 3 0 0 0 3.74 3.74",
			key: "13wojd"
		}]
	]);
	const MapPinPlusInside = createLucideIcon("MapPinPlusInside", [
		["path", {
			d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
			key: "1r0f0z"
		}],
		["path", {
			d: "M12 7v6",
			key: "lw1j43"
		}],
		["path", {
			d: "M9 10h6",
			key: "9gxzsh"
		}]
	]);
	const MapPinPlus = createLucideIcon("MapPinPlus", [
		["path", {
			d: "M19.914 11.105A7.298 7.298 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738",
			key: "fcdtly"
		}],
		["circle", {
			cx: "12",
			cy: "10",
			r: "3",
			key: "ilqhr7"
		}],
		["path", {
			d: "M16 18h6",
			key: "987eiv"
		}],
		["path", {
			d: "M19 15v6",
			key: "10aioa"
		}]
	]);
	const MapPinXInside = createLucideIcon("MapPinXInside", [
		["path", {
			d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
			key: "1r0f0z"
		}],
		["path", {
			d: "m14.5 7.5-5 5",
			key: "3lb6iw"
		}],
		["path", {
			d: "m9.5 7.5 5 5",
			key: "ko136h"
		}]
	]);
	const MapPinX = createLucideIcon("MapPinX", [
		["path", {
			d: "M19.752 11.901A7.78 7.78 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 19 19 0 0 0 .09-.077",
			key: "y0ewhp"
		}],
		["circle", {
			cx: "12",
			cy: "10",
			r: "3",
			key: "ilqhr7"
		}],
		["path", {
			d: "m21.5 15.5-5 5",
			key: "11iqnx"
		}],
		["path", {
			d: "m21.5 20.5-5-5",
			key: "1bylgx"
		}]
	]);
	const MapPin = createLucideIcon("MapPin", [["path", {
		d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
		key: "1r0f0z"
	}], ["circle", {
		cx: "12",
		cy: "10",
		r: "3",
		key: "ilqhr7"
	}]]);
	const MapPinned = createLucideIcon("MapPinned", [
		["path", {
			d: "M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0",
			key: "11u0oz"
		}],
		["circle", {
			cx: "12",
			cy: "8",
			r: "2",
			key: "1822b1"
		}],
		["path", {
			d: "M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712",
			key: "q8zwxj"
		}]
	]);
	const Map$1 = createLucideIcon("Map", [
		["path", {
			d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
			key: "169xi5"
		}],
		["path", {
			d: "M15 5.764v15",
			key: "1pn4in"
		}],
		["path", {
			d: "M9 3.236v15",
			key: "1uimfh"
		}]
	]);
	const Martini = createLucideIcon("Martini", [
		["path", {
			d: "M8 22h8",
			key: "rmew8v"
		}],
		["path", {
			d: "M12 11v11",
			key: "ur9y6a"
		}],
		["path", {
			d: "m19 3-7 8-7-8Z",
			key: "1sgpiw"
		}]
	]);
	const Maximize2 = createLucideIcon("Maximize2", [
		["polyline", {
			points: "15 3 21 3 21 9",
			key: "mznyad"
		}],
		["polyline", {
			points: "9 21 3 21 3 15",
			key: "1avn1i"
		}],
		["line", {
			x1: "21",
			x2: "14",
			y1: "3",
			y2: "10",
			key: "ota7mn"
		}],
		["line", {
			x1: "3",
			x2: "10",
			y1: "21",
			y2: "14",
			key: "1atl0r"
		}]
	]);
	const Maximize = createLucideIcon("Maximize", [
		["path", {
			d: "M8 3H5a2 2 0 0 0-2 2v3",
			key: "1dcmit"
		}],
		["path", {
			d: "M21 8V5a2 2 0 0 0-2-2h-3",
			key: "1e4gt3"
		}],
		["path", {
			d: "M3 16v3a2 2 0 0 0 2 2h3",
			key: "wsl5sc"
		}],
		["path", {
			d: "M16 21h3a2 2 0 0 0 2-2v-3",
			key: "18trek"
		}]
	]);
	const Medal = createLucideIcon("Medal", [
		["path", {
			d: "M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15",
			key: "143lza"
		}],
		["path", {
			d: "M11 12 5.12 2.2",
			key: "qhuxz6"
		}],
		["path", {
			d: "m13 12 5.88-9.8",
			key: "hbye0f"
		}],
		["path", {
			d: "M8 7h8",
			key: "i86dvs"
		}],
		["circle", {
			cx: "12",
			cy: "17",
			r: "5",
			key: "qbz8iq"
		}],
		["path", {
			d: "M12 18v-2h-.5",
			key: "fawc4q"
		}]
	]);
	const MegaphoneOff = createLucideIcon("MegaphoneOff", [
		["path", {
			d: "M9.26 9.26 3 11v3l14.14 3.14",
			key: "3429n"
		}],
		["path", {
			d: "M21 15.34V6l-7.31 2.03",
			key: "4o1dh8"
		}],
		["path", {
			d: "M11.6 16.8a3 3 0 1 1-5.8-1.6",
			key: "1yl0tm"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Megaphone = createLucideIcon("Megaphone", [["path", {
		d: "m3 11 18-5v12L3 14v-3z",
		key: "n962bs"
	}], ["path", {
		d: "M11.6 16.8a3 3 0 1 1-5.8-1.6",
		key: "1yl0tm"
	}]]);
	const Meh = createLucideIcon("Meh", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["line", {
			x1: "8",
			x2: "16",
			y1: "15",
			y2: "15",
			key: "1xb1d9"
		}],
		["line", {
			x1: "9",
			x2: "9.01",
			y1: "9",
			y2: "9",
			key: "yxxnd0"
		}],
		["line", {
			x1: "15",
			x2: "15.01",
			y1: "9",
			y2: "9",
			key: "1p4y9e"
		}]
	]);
	const MemoryStick = createLucideIcon("MemoryStick", [
		["path", {
			d: "M6 19v-3",
			key: "1nvgqn"
		}],
		["path", {
			d: "M10 19v-3",
			key: "iu8nkm"
		}],
		["path", {
			d: "M14 19v-3",
			key: "kcehxu"
		}],
		["path", {
			d: "M18 19v-3",
			key: "1vh91z"
		}],
		["path", {
			d: "M8 11V9",
			key: "63erz4"
		}],
		["path", {
			d: "M16 11V9",
			key: "fru6f3"
		}],
		["path", {
			d: "M12 11V9",
			key: "ha00sb"
		}],
		["path", {
			d: "M2 15h20",
			key: "16ne18"
		}],
		["path", {
			d: "M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z",
			key: "lhddv3"
		}]
	]);
	const Menu = createLucideIcon("Menu", [
		["line", {
			x1: "4",
			x2: "20",
			y1: "12",
			y2: "12",
			key: "1e0a9i"
		}],
		["line", {
			x1: "4",
			x2: "20",
			y1: "6",
			y2: "6",
			key: "1owob3"
		}],
		["line", {
			x1: "4",
			x2: "20",
			y1: "18",
			y2: "18",
			key: "yk5zj1"
		}]
	]);
	const Merge = createLucideIcon("Merge", [
		["path", {
			d: "m8 6 4-4 4 4",
			key: "ybng9g"
		}],
		["path", {
			d: "M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22",
			key: "1hyw0i"
		}],
		["path", {
			d: "m20 22-5-5",
			key: "1m27yz"
		}]
	]);
	const MessageCircleCode = createLucideIcon("MessageCircleCode", [
		["path", {
			d: "M10 9.5 8 12l2 2.5",
			key: "3mjy60"
		}],
		["path", {
			d: "m14 9.5 2 2.5-2 2.5",
			key: "1bir2l"
		}],
		["path", {
			d: "M7.9 20A9 9 0 1 0 4 16.1L2 22z",
			key: "k85zhp"
		}]
	]);
	const MessageCircleDashed = createLucideIcon("MessageCircleDashed", [
		["path", {
			d: "M13.5 3.1c-.5 0-1-.1-1.5-.1s-1 .1-1.5.1",
			key: "16ll65"
		}],
		["path", {
			d: "M19.3 6.8a10.45 10.45 0 0 0-2.1-2.1",
			key: "1nq77a"
		}],
		["path", {
			d: "M20.9 13.5c.1-.5.1-1 .1-1.5s-.1-1-.1-1.5",
			key: "1sf7wn"
		}],
		["path", {
			d: "M17.2 19.3a10.45 10.45 0 0 0 2.1-2.1",
			key: "x1hs5g"
		}],
		["path", {
			d: "M10.5 20.9c.5.1 1 .1 1.5.1s1-.1 1.5-.1",
			key: "19m18z"
		}],
		["path", {
			d: "M3.5 17.5 2 22l4.5-1.5",
			key: "1f36qi"
		}],
		["path", {
			d: "M3.1 10.5c0 .5-.1 1-.1 1.5s.1 1 .1 1.5",
			key: "1vz3ju"
		}],
		["path", {
			d: "M6.8 4.7a10.45 10.45 0 0 0-2.1 2.1",
			key: "19f9do"
		}]
	]);
	const MessageCircleHeart = createLucideIcon("MessageCircleHeart", [["path", {
		d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
		key: "vv11sd"
	}], ["path", {
		d: "M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7",
		key: "43lnbm"
	}]]);
	const MessageCircleMore = createLucideIcon("MessageCircleMore", [
		["path", {
			d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
			key: "vv11sd"
		}],
		["path", {
			d: "M8 12h.01",
			key: "czm47f"
		}],
		["path", {
			d: "M12 12h.01",
			key: "1mp3jc"
		}],
		["path", {
			d: "M16 12h.01",
			key: "1l6xoz"
		}]
	]);
	const MessageCircleOff = createLucideIcon("MessageCircleOff", [
		["path", {
			d: "M20.5 14.9A9 9 0 0 0 9.1 3.5",
			key: "1iebmn"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M5.6 5.6C3 8.3 2.2 12.5 4 16l-2 6 6-2c3.4 1.8 7.6 1.1 10.3-1.7",
			key: "1ov8ce"
		}]
	]);
	const MessageCirclePlus = createLucideIcon("MessageCirclePlus", [
		["path", {
			d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
			key: "vv11sd"
		}],
		["path", {
			d: "M8 12h8",
			key: "1wcyev"
		}],
		["path", {
			d: "M12 8v8",
			key: "napkw2"
		}]
	]);
	const MessageCircleQuestion = createLucideIcon("MessageCircleQuestion", [
		["path", {
			d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
			key: "vv11sd"
		}],
		["path", {
			d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
			key: "1u773s"
		}],
		["path", {
			d: "M12 17h.01",
			key: "p32p05"
		}]
	]);
	const MessageCircleReply = createLucideIcon("MessageCircleReply", [
		["path", {
			d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
			key: "vv11sd"
		}],
		["path", {
			d: "m10 15-3-3 3-3",
			key: "1pgupc"
		}],
		["path", {
			d: "M7 12h7a2 2 0 0 1 2 2v1",
			key: "1gheu4"
		}]
	]);
	const MessageCircleWarning = createLucideIcon("MessageCircleWarning", [
		["path", {
			d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
			key: "vv11sd"
		}],
		["path", {
			d: "M12 8v4",
			key: "1got3b"
		}],
		["path", {
			d: "M12 16h.01",
			key: "1drbdi"
		}]
	]);
	const MessageCircleX = createLucideIcon("MessageCircleX", [
		["path", {
			d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
			key: "vv11sd"
		}],
		["path", {
			d: "m15 9-6 6",
			key: "1uzhvr"
		}],
		["path", {
			d: "m9 9 6 6",
			key: "z0biqf"
		}]
	]);
	const MessageCircle = createLucideIcon("MessageCircle", [["path", {
		d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
		key: "vv11sd"
	}]]);
	const MessageSquareCode = createLucideIcon("MessageSquareCode", [
		["path", {
			d: "M10 7.5 8 10l2 2.5",
			key: "xb17xw"
		}],
		["path", {
			d: "m14 7.5 2 2.5-2 2.5",
			key: "5rap1v"
		}],
		["path", {
			d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
			key: "1lielz"
		}]
	]);
	const MessageSquareDashed = createLucideIcon("MessageSquareDashed", [
		["path", {
			d: "M10 17H7l-4 4v-7",
			key: "1r71xu"
		}],
		["path", {
			d: "M14 17h1",
			key: "nufu4t"
		}],
		["path", {
			d: "M14 3h1",
			key: "1ec4yj"
		}],
		["path", {
			d: "M19 3a2 2 0 0 1 2 2",
			key: "18rm91"
		}],
		["path", {
			d: "M21 14v1a2 2 0 0 1-2 2",
			key: "29akq3"
		}],
		["path", {
			d: "M21 9v1",
			key: "mxsmne"
		}],
		["path", {
			d: "M3 9v1",
			key: "1r0deq"
		}],
		["path", {
			d: "M5 3a2 2 0 0 0-2 2",
			key: "y57alp"
		}],
		["path", {
			d: "M9 3h1",
			key: "1yesri"
		}]
	]);
	const MessageSquareDiff = createLucideIcon("MessageSquareDiff", [
		["path", {
			d: "m5 19-2 2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2",
			key: "1xuzuj"
		}],
		["path", {
			d: "M9 10h6",
			key: "9gxzsh"
		}],
		["path", {
			d: "M12 7v6",
			key: "lw1j43"
		}],
		["path", {
			d: "M9 17h6",
			key: "r8uit2"
		}]
	]);
	const MessageSquareDot = createLucideIcon("MessageSquareDot", [["path", {
		d: "M11.7 3H5a2 2 0 0 0-2 2v16l4-4h12a2 2 0 0 0 2-2v-2.7",
		key: "uodpkb"
	}], ["circle", {
		cx: "18",
		cy: "6",
		r: "3",
		key: "1h7g24"
	}]]);
	const MessageSquareHeart = createLucideIcon("MessageSquareHeart", [["path", {
		d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
		key: "1lielz"
	}], ["path", {
		d: "M14.8 7.5a1.84 1.84 0 0 0-2.6 0l-.2.3-.3-.3a1.84 1.84 0 1 0-2.4 2.8L12 13l2.7-2.7c.9-.9.8-2.1.1-2.8",
		key: "1blaws"
	}]]);
	const MessageSquareLock = createLucideIcon("MessageSquareLock", [
		["path", {
			d: "M19 15v-2a2 2 0 1 0-4 0v2",
			key: "h3d1vz"
		}],
		["path", {
			d: "M9 17H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3.5",
			key: "xsnnhn"
		}],
		["rect", {
			x: "13",
			y: "15",
			width: "8",
			height: "5",
			rx: "1",
			key: "1ccwuk"
		}]
	]);
	const MessageSquareMore = createLucideIcon("MessageSquareMore", [
		["path", {
			d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
			key: "1lielz"
		}],
		["path", {
			d: "M8 10h.01",
			key: "19clt8"
		}],
		["path", {
			d: "M12 10h.01",
			key: "1nrarc"
		}],
		["path", {
			d: "M16 10h.01",
			key: "1m94wz"
		}]
	]);
	const MessageSquareOff = createLucideIcon("MessageSquareOff", [
		["path", {
			d: "M21 15V5a2 2 0 0 0-2-2H9",
			key: "43el77"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M3.6 3.6c-.4.3-.6.8-.6 1.4v16l4-4h10",
			key: "pwpm4a"
		}]
	]);
	const MessageSquarePlus = createLucideIcon("MessageSquarePlus", [
		["path", {
			d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
			key: "1lielz"
		}],
		["path", {
			d: "M12 7v6",
			key: "lw1j43"
		}],
		["path", {
			d: "M9 10h6",
			key: "9gxzsh"
		}]
	]);
	const MessageSquareQuote = createLucideIcon("MessageSquareQuote", [
		["path", {
			d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
			key: "1lielz"
		}],
		["path", {
			d: "M8 12a2 2 0 0 0 2-2V8H8",
			key: "1jfesj"
		}],
		["path", {
			d: "M14 12a2 2 0 0 0 2-2V8h-2",
			key: "1dq9mh"
		}]
	]);
	const MessageSquareReply = createLucideIcon("MessageSquareReply", [
		["path", {
			d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
			key: "1lielz"
		}],
		["path", {
			d: "m10 7-3 3 3 3",
			key: "1eugdv"
		}],
		["path", {
			d: "M17 13v-1a2 2 0 0 0-2-2H7",
			key: "ernfh3"
		}]
	]);
	const MessageSquareShare = createLucideIcon("MessageSquareShare", [
		["path", {
			d: "M21 12v3a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h7",
			key: "tqtdkg"
		}],
		["path", {
			d: "M16 3h5v5",
			key: "1806ms"
		}],
		["path", {
			d: "m16 8 5-5",
			key: "15mbrl"
		}]
	]);
	const MessageSquareText = createLucideIcon("MessageSquareText", [
		["path", {
			d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
			key: "1lielz"
		}],
		["path", {
			d: "M13 8H7",
			key: "14i4kc"
		}],
		["path", {
			d: "M17 12H7",
			key: "16if0g"
		}]
	]);
	const MessageSquareWarning = createLucideIcon("MessageSquareWarning", [
		["path", {
			d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
			key: "1lielz"
		}],
		["path", {
			d: "M12 7v2",
			key: "stiyo7"
		}],
		["path", {
			d: "M12 13h.01",
			key: "y0uutt"
		}]
	]);
	const MessageSquareX = createLucideIcon("MessageSquareX", [
		["path", {
			d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
			key: "1lielz"
		}],
		["path", {
			d: "m14.5 7.5-5 5",
			key: "3lb6iw"
		}],
		["path", {
			d: "m9.5 7.5 5 5",
			key: "ko136h"
		}]
	]);
	const MessageSquare = createLucideIcon("MessageSquare", [["path", {
		d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
		key: "1lielz"
	}]]);
	const MessagesSquare = createLucideIcon("MessagesSquare", [["path", {
		d: "M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z",
		key: "p1xzt8"
	}], ["path", {
		d: "M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1",
		key: "1cx29u"
	}]]);
	const MicOff = createLucideIcon("MicOff", [
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}],
		["path", {
			d: "M18.89 13.23A7.12 7.12 0 0 0 19 12v-2",
			key: "80xlxr"
		}],
		["path", {
			d: "M5 10v2a7 7 0 0 0 12 5",
			key: "p2k8kg"
		}],
		["path", {
			d: "M15 9.34V5a3 3 0 0 0-5.68-1.33",
			key: "1gzdoj"
		}],
		["path", {
			d: "M9 9v3a3 3 0 0 0 5.12 2.12",
			key: "r2i35w"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "19",
			y2: "22",
			key: "x3vr5v"
		}]
	]);
	const MicVocal = createLucideIcon("MicVocal", [
		["path", {
			d: "m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12",
			key: "80a601"
		}],
		["path", {
			d: "M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5",
			key: "j0ngtp"
		}],
		["circle", {
			cx: "16",
			cy: "7",
			r: "5",
			key: "d08jfb"
		}]
	]);
	const Mic = createLucideIcon("Mic", [
		["path", {
			d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",
			key: "131961"
		}],
		["path", {
			d: "M19 10v2a7 7 0 0 1-14 0v-2",
			key: "1vc78b"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "19",
			y2: "22",
			key: "x3vr5v"
		}]
	]);
	const Microchip = createLucideIcon("Microchip", [
		["path", {
			d: "M18 12h2",
			key: "quuxs7"
		}],
		["path", {
			d: "M18 16h2",
			key: "zsn3lv"
		}],
		["path", {
			d: "M18 20h2",
			key: "9x5y9y"
		}],
		["path", {
			d: "M18 4h2",
			key: "1luxfb"
		}],
		["path", {
			d: "M18 8h2",
			key: "nxqzg"
		}],
		["path", {
			d: "M4 12h2",
			key: "1ltxp0"
		}],
		["path", {
			d: "M4 16h2",
			key: "8a5zha"
		}],
		["path", {
			d: "M4 20h2",
			key: "27dk57"
		}],
		["path", {
			d: "M4 4h2",
			key: "10groj"
		}],
		["path", {
			d: "M4 8h2",
			key: "18vq6w"
		}],
		["path", {
			d: "M8 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1.5c-.276 0-.494.227-.562.495a2 2 0 0 1-3.876 0C9.994 2.227 9.776 2 9.5 2z",
			key: "1681fp"
		}]
	]);
	const Microscope = createLucideIcon("Microscope", [
		["path", {
			d: "M6 18h8",
			key: "1borvv"
		}],
		["path", {
			d: "M3 22h18",
			key: "8prr45"
		}],
		["path", {
			d: "M14 22a7 7 0 1 0 0-14h-1",
			key: "1jwaiy"
		}],
		["path", {
			d: "M9 14h2",
			key: "197e7h"
		}],
		["path", {
			d: "M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z",
			key: "1bmzmy"
		}],
		["path", {
			d: "M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3",
			key: "1drr47"
		}]
	]);
	const Microwave = createLucideIcon("Microwave", [
		["rect", {
			width: "20",
			height: "15",
			x: "2",
			y: "4",
			rx: "2",
			key: "2no95f"
		}],
		["rect", {
			width: "8",
			height: "7",
			x: "6",
			y: "8",
			rx: "1",
			key: "zh9wx"
		}],
		["path", {
			d: "M18 8v7",
			key: "o5zi4n"
		}],
		["path", {
			d: "M6 19v2",
			key: "1loha6"
		}],
		["path", {
			d: "M18 19v2",
			key: "1dawf0"
		}]
	]);
	const Milestone = createLucideIcon("Milestone", [
		["path", {
			d: "M12 13v8",
			key: "1l5pq0"
		}],
		["path", {
			d: "M12 3v3",
			key: "1n5kay"
		}],
		["path", {
			d: "M4 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h13a2 2 0 0 0 1.152-.365l3.424-2.317a1 1 0 0 0 0-1.635l-3.424-2.318A2 2 0 0 0 17 6z",
			key: "1btarq"
		}]
	]);
	const MilkOff = createLucideIcon("MilkOff", [
		["path", {
			d: "M8 2h8",
			key: "1ssgc1"
		}],
		["path", {
			d: "M9 2v1.343M15 2v2.789a4 4 0 0 0 .672 2.219l.656.984a4 4 0 0 1 .672 2.22v1.131M7.8 7.8l-.128.192A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3",
			key: "y0ejgx"
		}],
		["path", {
			d: "M7 15a6.47 6.47 0 0 1 5 0 6.472 6.472 0 0 0 3.435.435",
			key: "iaxqsy"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Milk = createLucideIcon("Milk", [
		["path", {
			d: "M8 2h8",
			key: "1ssgc1"
		}],
		["path", {
			d: "M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2",
			key: "qtp12x"
		}],
		["path", {
			d: "M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0",
			key: "ygeh44"
		}]
	]);
	const Minimize2 = createLucideIcon("Minimize2", [
		["polyline", {
			points: "4 14 10 14 10 20",
			key: "11kfnr"
		}],
		["polyline", {
			points: "20 10 14 10 14 4",
			key: "rlmsce"
		}],
		["line", {
			x1: "14",
			x2: "21",
			y1: "10",
			y2: "3",
			key: "o5lafz"
		}],
		["line", {
			x1: "3",
			x2: "10",
			y1: "21",
			y2: "14",
			key: "1atl0r"
		}]
	]);
	const Minimize = createLucideIcon("Minimize", [
		["path", {
			d: "M8 3v3a2 2 0 0 1-2 2H3",
			key: "hohbtr"
		}],
		["path", {
			d: "M21 8h-3a2 2 0 0 1-2-2V3",
			key: "5jw1f3"
		}],
		["path", {
			d: "M3 16h3a2 2 0 0 1 2 2v3",
			key: "198tvr"
		}],
		["path", {
			d: "M16 21v-3a2 2 0 0 1 2-2h3",
			key: "ph8mxp"
		}]
	]);
	const Minus = createLucideIcon("Minus", [["path", {
		d: "M5 12h14",
		key: "1ays0h"
	}]]);
	const MonitorCheck = createLucideIcon("MonitorCheck", [
		["path", {
			d: "m9 10 2 2 4-4",
			key: "1gnqz4"
		}],
		["rect", {
			width: "20",
			height: "14",
			x: "2",
			y: "3",
			rx: "2",
			key: "48i651"
		}],
		["path", {
			d: "M12 17v4",
			key: "1riwvh"
		}],
		["path", {
			d: "M8 21h8",
			key: "1ev6f3"
		}]
	]);
	const MonitorCog = createLucideIcon("MonitorCog", [
		["path", {
			d: "M12 17v4",
			key: "1riwvh"
		}],
		["path", {
			d: "m15.2 4.9-.9-.4",
			key: "12wd2u"
		}],
		["path", {
			d: "m15.2 7.1-.9.4",
			key: "1r2vl7"
		}],
		["path", {
			d: "m16.9 3.2-.4-.9",
			key: "3zbo91"
		}],
		["path", {
			d: "m16.9 8.8-.4.9",
			key: "1qr2dn"
		}],
		["path", {
			d: "m19.5 2.3-.4.9",
			key: "1rjrkq"
		}],
		["path", {
			d: "m19.5 9.7-.4-.9",
			key: "heryx5"
		}],
		["path", {
			d: "m21.7 4.5-.9.4",
			key: "17fqt1"
		}],
		["path", {
			d: "m21.7 7.5-.9-.4",
			key: "14zyni"
		}],
		["path", {
			d: "M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7",
			key: "1tnzv8"
		}],
		["path", {
			d: "M8 21h8",
			key: "1ev6f3"
		}],
		["circle", {
			cx: "18",
			cy: "6",
			r: "3",
			key: "1h7g24"
		}]
	]);
	const MonitorDot = createLucideIcon("MonitorDot", [
		["circle", {
			cx: "19",
			cy: "6",
			r: "3",
			key: "108a5v"
		}],
		["path", {
			d: "M22 12v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9",
			key: "1fet9y"
		}],
		["path", {
			d: "M12 17v4",
			key: "1riwvh"
		}],
		["path", {
			d: "M8 21h8",
			key: "1ev6f3"
		}]
	]);
	const MonitorDown = createLucideIcon("MonitorDown", [
		["path", {
			d: "M12 13V7",
			key: "h0r20n"
		}],
		["path", {
			d: "m15 10-3 3-3-3",
			key: "lzhmyn"
		}],
		["rect", {
			width: "20",
			height: "14",
			x: "2",
			y: "3",
			rx: "2",
			key: "48i651"
		}],
		["path", {
			d: "M12 17v4",
			key: "1riwvh"
		}],
		["path", {
			d: "M8 21h8",
			key: "1ev6f3"
		}]
	]);
	const MonitorOff = createLucideIcon("MonitorOff", [
		["path", {
			d: "M17 17H4a2 2 0 0 1-2-2V5c0-1.5 1-2 1-2",
			key: "k0q8oc"
		}],
		["path", {
			d: "M22 15V5a2 2 0 0 0-2-2H9",
			key: "cp1ac0"
		}],
		["path", {
			d: "M8 21h8",
			key: "1ev6f3"
		}],
		["path", {
			d: "M12 17v4",
			key: "1riwvh"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]);
	const MonitorPause = createLucideIcon("MonitorPause", [
		["path", {
			d: "M10 13V7",
			key: "1u13u9"
		}],
		["path", {
			d: "M14 13V7",
			key: "1vj9om"
		}],
		["rect", {
			width: "20",
			height: "14",
			x: "2",
			y: "3",
			rx: "2",
			key: "48i651"
		}],
		["path", {
			d: "M12 17v4",
			key: "1riwvh"
		}],
		["path", {
			d: "M8 21h8",
			key: "1ev6f3"
		}]
	]);
	const MonitorPlay = createLucideIcon("MonitorPlay", [
		["path", {
			d: "M10 7.75a.75.75 0 0 1 1.142-.638l3.664 2.249a.75.75 0 0 1 0 1.278l-3.664 2.25a.75.75 0 0 1-1.142-.64z",
			key: "1pctta"
		}],
		["path", {
			d: "M12 17v4",
			key: "1riwvh"
		}],
		["path", {
			d: "M8 21h8",
			key: "1ev6f3"
		}],
		["rect", {
			x: "2",
			y: "3",
			width: "20",
			height: "14",
			rx: "2",
			key: "x3v2xh"
		}]
	]);
	const MonitorSmartphone = createLucideIcon("MonitorSmartphone", [
		["path", {
			d: "M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8",
			key: "10dyio"
		}],
		["path", {
			d: "M10 19v-3.96 3.15",
			key: "1irgej"
		}],
		["path", {
			d: "M7 19h5",
			key: "qswx4l"
		}],
		["rect", {
			width: "6",
			height: "10",
			x: "16",
			y: "12",
			rx: "2",
			key: "1egngj"
		}]
	]);
	const MonitorSpeaker = createLucideIcon("MonitorSpeaker", [
		["path", {
			d: "M5.5 20H8",
			key: "1k40s5"
		}],
		["path", {
			d: "M17 9h.01",
			key: "1j24nn"
		}],
		["rect", {
			width: "10",
			height: "16",
			x: "12",
			y: "4",
			rx: "2",
			key: "ixliua"
		}],
		["path", {
			d: "M8 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4",
			key: "1mp6e1"
		}],
		["circle", {
			cx: "17",
			cy: "15",
			r: "1",
			key: "tqvash"
		}]
	]);
	const MonitorStop = createLucideIcon("MonitorStop", [
		["path", {
			d: "M12 17v4",
			key: "1riwvh"
		}],
		["path", {
			d: "M8 21h8",
			key: "1ev6f3"
		}],
		["rect", {
			x: "2",
			y: "3",
			width: "20",
			height: "14",
			rx: "2",
			key: "x3v2xh"
		}],
		["rect", {
			x: "9",
			y: "7",
			width: "6",
			height: "6",
			rx: "1",
			key: "5m2oou"
		}]
	]);
	const MonitorUp = createLucideIcon("MonitorUp", [
		["path", {
			d: "m9 10 3-3 3 3",
			key: "11gsxs"
		}],
		["path", {
			d: "M12 13V7",
			key: "h0r20n"
		}],
		["rect", {
			width: "20",
			height: "14",
			x: "2",
			y: "3",
			rx: "2",
			key: "48i651"
		}],
		["path", {
			d: "M12 17v4",
			key: "1riwvh"
		}],
		["path", {
			d: "M8 21h8",
			key: "1ev6f3"
		}]
	]);
	const MonitorX = createLucideIcon("MonitorX", [
		["path", {
			d: "m14.5 12.5-5-5",
			key: "1jahn5"
		}],
		["path", {
			d: "m9.5 12.5 5-5",
			key: "1k2t7b"
		}],
		["rect", {
			width: "20",
			height: "14",
			x: "2",
			y: "3",
			rx: "2",
			key: "48i651"
		}],
		["path", {
			d: "M12 17v4",
			key: "1riwvh"
		}],
		["path", {
			d: "M8 21h8",
			key: "1ev6f3"
		}]
	]);
	const Monitor = createLucideIcon("Monitor", [
		["rect", {
			width: "20",
			height: "14",
			x: "2",
			y: "3",
			rx: "2",
			key: "48i651"
		}],
		["line", {
			x1: "8",
			x2: "16",
			y1: "21",
			y2: "21",
			key: "1svkeh"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "17",
			y2: "21",
			key: "vw1qmm"
		}]
	]);
	const MoonStar = createLucideIcon("MoonStar", [
		["path", {
			d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9",
			key: "4ay0iu"
		}],
		["path", {
			d: "M20 3v4",
			key: "1olli1"
		}],
		["path", {
			d: "M22 5h-4",
			key: "1gvqau"
		}]
	]);
	const Moon = createLucideIcon("Moon", [["path", {
		d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",
		key: "a7tn18"
	}]]);
	const MountainSnow = createLucideIcon("MountainSnow", [["path", {
		d: "m8 3 4 8 5-5 5 15H2L8 3z",
		key: "otkl63"
	}], ["path", {
		d: "M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19",
		key: "1pvmmp"
	}]]);
	const Mountain = createLucideIcon("Mountain", [["path", {
		d: "m8 3 4 8 5-5 5 15H2L8 3z",
		key: "otkl63"
	}]]);
	const MouseOff = createLucideIcon("MouseOff", [
		["path", {
			d: "M12 6v.343",
			key: "1gyhex"
		}],
		["path", {
			d: "M18.218 18.218A7 7 0 0 1 5 15V9a7 7 0 0 1 .782-3.218",
			key: "ukzz01"
		}],
		["path", {
			d: "M19 13.343V9A7 7 0 0 0 8.56 2.902",
			key: "104jy9"
		}],
		["path", {
			d: "M22 22 2 2",
			key: "1r8tn9"
		}]
	]);
	const MousePointer2 = createLucideIcon("MousePointer2", [["path", {
		d: "M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z",
		key: "edeuup"
	}]]);
	const MousePointerBan = createLucideIcon("MousePointerBan", [
		["path", {
			d: "M2.034 2.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.944L8.204 7.545a1 1 0 0 0-.66.66l-1.066 3.443a.5.5 0 0 1-.944.033z",
			key: "11pp1i"
		}],
		["circle", {
			cx: "16",
			cy: "16",
			r: "6",
			key: "qoo3c4"
		}],
		["path", {
			d: "m11.8 11.8 8.4 8.4",
			key: "oogvdj"
		}]
	]);
	const MousePointerClick = createLucideIcon("MousePointerClick", [
		["path", {
			d: "M14 4.1 12 6",
			key: "ita8i4"
		}],
		["path", {
			d: "m5.1 8-2.9-.8",
			key: "1go3kf"
		}],
		["path", {
			d: "m6 12-1.9 2",
			key: "mnht97"
		}],
		["path", {
			d: "M7.2 2.2 8 5.1",
			key: "1cfko1"
		}],
		["path", {
			d: "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z",
			key: "s0h3yz"
		}]
	]);
	const MousePointer = createLucideIcon("MousePointer", [["path", {
		d: "M12.586 12.586 19 19",
		key: "ea5xo7"
	}], ["path", {
		d: "M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",
		key: "277e5u"
	}]]);
	const Mouse = createLucideIcon("Mouse", [["rect", {
		x: "5",
		y: "2",
		width: "14",
		height: "20",
		rx: "7",
		key: "11ol66"
	}], ["path", {
		d: "M12 6v4",
		key: "16clxf"
	}]]);
	const Move3d = createLucideIcon("Move3d", [
		["path", {
			d: "M5 3v16h16",
			key: "1mqmf9"
		}],
		["path", {
			d: "m5 19 6-6",
			key: "jh6hbb"
		}],
		["path", {
			d: "m2 6 3-3 3 3",
			key: "tkyvxa"
		}],
		["path", {
			d: "m18 16 3 3-3 3",
			key: "1d4glt"
		}]
	]);
	const MoveDiagonal2 = createLucideIcon("MoveDiagonal2", [
		["path", {
			d: "M19 13v6h-6",
			key: "1hxl6d"
		}],
		["path", {
			d: "M5 11V5h6",
			key: "12e2xe"
		}],
		["path", {
			d: "m5 5 14 14",
			key: "11anup"
		}]
	]);
	const MoveDiagonal = createLucideIcon("MoveDiagonal", [
		["path", {
			d: "M11 19H5v-6",
			key: "8awifj"
		}],
		["path", {
			d: "M13 5h6v6",
			key: "7voy1q"
		}],
		["path", {
			d: "M19 5 5 19",
			key: "wwaj1z"
		}]
	]);
	const MoveDownLeft = createLucideIcon("MoveDownLeft", [["path", {
		d: "M11 19H5V13",
		key: "1akmht"
	}], ["path", {
		d: "M19 5L5 19",
		key: "72u4yj"
	}]]);
	const MoveDownRight = createLucideIcon("MoveDownRight", [["path", {
		d: "M19 13V19H13",
		key: "10vkzq"
	}], ["path", {
		d: "M5 5L19 19",
		key: "5zm2fv"
	}]]);
	const MoveDown = createLucideIcon("MoveDown", [["path", {
		d: "M8 18L12 22L16 18",
		key: "cskvfv"
	}], ["path", {
		d: "M12 2V22",
		key: "r89rzk"
	}]]);
	const MoveHorizontal = createLucideIcon("MoveHorizontal", [
		["path", {
			d: "m18 8 4 4-4 4",
			key: "1ak13k"
		}],
		["path", {
			d: "M2 12h20",
			key: "9i4pu4"
		}],
		["path", {
			d: "m6 8-4 4 4 4",
			key: "15zrgr"
		}]
	]);
	const MoveLeft = createLucideIcon("MoveLeft", [["path", {
		d: "M6 8L2 12L6 16",
		key: "kyvwex"
	}], ["path", {
		d: "M2 12H22",
		key: "1m8cig"
	}]]);
	const MoveRight = createLucideIcon("MoveRight", [["path", {
		d: "M18 8L22 12L18 16",
		key: "1r0oui"
	}], ["path", {
		d: "M2 12H22",
		key: "1m8cig"
	}]]);
	const MoveUpLeft = createLucideIcon("MoveUpLeft", [["path", {
		d: "M5 11V5H11",
		key: "3q78g9"
	}], ["path", {
		d: "M5 5L19 19",
		key: "5zm2fv"
	}]]);
	const MoveUpRight = createLucideIcon("MoveUpRight", [["path", {
		d: "M13 5H19V11",
		key: "1n1gyv"
	}], ["path", {
		d: "M19 5L5 19",
		key: "72u4yj"
	}]]);
	const MoveUp = createLucideIcon("MoveUp", [["path", {
		d: "M8 6L12 2L16 6",
		key: "1yvkyx"
	}], ["path", {
		d: "M12 2V22",
		key: "r89rzk"
	}]]);
	const MoveVertical = createLucideIcon("MoveVertical", [
		["path", {
			d: "M12 2v20",
			key: "t6zp3m"
		}],
		["path", {
			d: "m8 18 4 4 4-4",
			key: "bh5tu3"
		}],
		["path", {
			d: "m8 6 4-4 4 4",
			key: "ybng9g"
		}]
	]);
	const Move = createLucideIcon("Move", [
		["path", {
			d: "M12 2v20",
			key: "t6zp3m"
		}],
		["path", {
			d: "m15 19-3 3-3-3",
			key: "11eu04"
		}],
		["path", {
			d: "m19 9 3 3-3 3",
			key: "1mg7y2"
		}],
		["path", {
			d: "M2 12h20",
			key: "9i4pu4"
		}],
		["path", {
			d: "m5 9-3 3 3 3",
			key: "j64kie"
		}],
		["path", {
			d: "m9 5 3-3 3 3",
			key: "l8vdw6"
		}]
	]);
	const Music2 = createLucideIcon("Music2", [["circle", {
		cx: "8",
		cy: "18",
		r: "4",
		key: "1fc0mg"
	}], ["path", {
		d: "M12 18V2l7 4",
		key: "g04rme"
	}]]);
	const Music3 = createLucideIcon("Music3", [["circle", {
		cx: "12",
		cy: "18",
		r: "4",
		key: "m3r9ws"
	}], ["path", {
		d: "M16 18V2",
		key: "40x2m5"
	}]]);
	const Music4 = createLucideIcon("Music4", [
		["path", {
			d: "M9 18V5l12-2v13",
			key: "1jmyc2"
		}],
		["path", {
			d: "m9 9 12-2",
			key: "1e64n2"
		}],
		["circle", {
			cx: "6",
			cy: "18",
			r: "3",
			key: "fqmcym"
		}],
		["circle", {
			cx: "18",
			cy: "16",
			r: "3",
			key: "1hluhg"
		}]
	]);
	const Music = createLucideIcon("Music", [
		["path", {
			d: "M9 18V5l12-2v13",
			key: "1jmyc2"
		}],
		["circle", {
			cx: "6",
			cy: "18",
			r: "3",
			key: "fqmcym"
		}],
		["circle", {
			cx: "18",
			cy: "16",
			r: "3",
			key: "1hluhg"
		}]
	]);
	const Navigation2Off = createLucideIcon("Navigation2Off", [
		["path", {
			d: "M9.31 9.31 5 21l7-4 7 4-1.17-3.17",
			key: "qoq2o2"
		}],
		["path", {
			d: "M14.53 8.88 12 2l-1.17 3.17",
			key: "k3sjzy"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Navigation2 = createLucideIcon("Navigation2", [["polygon", {
		points: "12 2 19 21 12 17 5 21 12 2",
		key: "x8c0qg"
	}]]);
	const NavigationOff = createLucideIcon("NavigationOff", [
		["path", {
			d: "M8.43 8.43 3 11l8 2 2 8 2.57-5.43",
			key: "1vdtb7"
		}],
		["path", {
			d: "M17.39 11.73 22 2l-9.73 4.61",
			key: "tya3r6"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Navigation = createLucideIcon("Navigation", [["polygon", {
		points: "3 11 22 2 13 21 11 13 3 11",
		key: "1ltx0t"
	}]]);
	const Network = createLucideIcon("Network", [
		["rect", {
			x: "16",
			y: "16",
			width: "6",
			height: "6",
			rx: "1",
			key: "4q2zg0"
		}],
		["rect", {
			x: "2",
			y: "16",
			width: "6",
			height: "6",
			rx: "1",
			key: "8cvhb9"
		}],
		["rect", {
			x: "9",
			y: "2",
			width: "6",
			height: "6",
			rx: "1",
			key: "1egb70"
		}],
		["path", {
			d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3",
			key: "1jsf9p"
		}],
		["path", {
			d: "M12 12V8",
			key: "2874zd"
		}]
	]);
	const Newspaper = createLucideIcon("Newspaper", [
		["path", {
			d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2",
			key: "7pis2x"
		}],
		["path", {
			d: "M18 14h-8",
			key: "sponae"
		}],
		["path", {
			d: "M15 18h-5",
			key: "95g1m2"
		}],
		["path", {
			d: "M10 6h8v4h-8V6Z",
			key: "smlsk5"
		}]
	]);
	const Nfc = createLucideIcon("Nfc", [
		["path", {
			d: "M6 8.32a7.43 7.43 0 0 1 0 7.36",
			key: "9iaqei"
		}],
		["path", {
			d: "M9.46 6.21a11.76 11.76 0 0 1 0 11.58",
			key: "1yha7l"
		}],
		["path", {
			d: "M12.91 4.1a15.91 15.91 0 0 1 .01 15.8",
			key: "4iu2gk"
		}],
		["path", {
			d: "M16.37 2a20.16 20.16 0 0 1 0 20",
			key: "sap9u2"
		}]
	]);
	const NotebookPen = createLucideIcon("NotebookPen", [
		["path", {
			d: "M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4",
			key: "re6nr2"
		}],
		["path", {
			d: "M2 6h4",
			key: "aawbzj"
		}],
		["path", {
			d: "M2 10h4",
			key: "l0bgd4"
		}],
		["path", {
			d: "M2 14h4",
			key: "1gsvsf"
		}],
		["path", {
			d: "M2 18h4",
			key: "1bu2t1"
		}],
		["path", {
			d: "M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
			key: "pqwjuv"
		}]
	]);
	const NotebookTabs = createLucideIcon("NotebookTabs", [
		["path", {
			d: "M2 6h4",
			key: "aawbzj"
		}],
		["path", {
			d: "M2 10h4",
			key: "l0bgd4"
		}],
		["path", {
			d: "M2 14h4",
			key: "1gsvsf"
		}],
		["path", {
			d: "M2 18h4",
			key: "1bu2t1"
		}],
		["rect", {
			width: "16",
			height: "20",
			x: "4",
			y: "2",
			rx: "2",
			key: "1nb95v"
		}],
		["path", {
			d: "M15 2v20",
			key: "dcj49h"
		}],
		["path", {
			d: "M15 7h5",
			key: "1xj5lc"
		}],
		["path", {
			d: "M15 12h5",
			key: "w5shd9"
		}],
		["path", {
			d: "M15 17h5",
			key: "1qaofu"
		}]
	]);
	const NotebookText = createLucideIcon("NotebookText", [
		["path", {
			d: "M2 6h4",
			key: "aawbzj"
		}],
		["path", {
			d: "M2 10h4",
			key: "l0bgd4"
		}],
		["path", {
			d: "M2 14h4",
			key: "1gsvsf"
		}],
		["path", {
			d: "M2 18h4",
			key: "1bu2t1"
		}],
		["rect", {
			width: "16",
			height: "20",
			x: "4",
			y: "2",
			rx: "2",
			key: "1nb95v"
		}],
		["path", {
			d: "M9.5 8h5",
			key: "11mslq"
		}],
		["path", {
			d: "M9.5 12H16",
			key: "ktog6x"
		}],
		["path", {
			d: "M9.5 16H14",
			key: "p1seyn"
		}]
	]);
	const Notebook = createLucideIcon("Notebook", [
		["path", {
			d: "M2 6h4",
			key: "aawbzj"
		}],
		["path", {
			d: "M2 10h4",
			key: "l0bgd4"
		}],
		["path", {
			d: "M2 14h4",
			key: "1gsvsf"
		}],
		["path", {
			d: "M2 18h4",
			key: "1bu2t1"
		}],
		["rect", {
			width: "16",
			height: "20",
			x: "4",
			y: "2",
			rx: "2",
			key: "1nb95v"
		}],
		["path", {
			d: "M16 2v20",
			key: "rotuqe"
		}]
	]);
	const NotepadTextDashed = createLucideIcon("NotepadTextDashed", [
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M12 2v4",
			key: "3427ic"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["path", {
			d: "M16 4h2a2 2 0 0 1 2 2v2",
			key: "j91f56"
		}],
		["path", {
			d: "M20 12v2",
			key: "w8o0tu"
		}],
		["path", {
			d: "M20 18v2a2 2 0 0 1-2 2h-1",
			key: "1c9ggx"
		}],
		["path", {
			d: "M13 22h-2",
			key: "191ugt"
		}],
		["path", {
			d: "M7 22H6a2 2 0 0 1-2-2v-2",
			key: "1rt9px"
		}],
		["path", {
			d: "M4 14v-2",
			key: "1v0sqh"
		}],
		["path", {
			d: "M4 8V6a2 2 0 0 1 2-2h2",
			key: "1mwabg"
		}],
		["path", {
			d: "M8 10h6",
			key: "3oa6kw"
		}],
		["path", {
			d: "M8 14h8",
			key: "1fgep2"
		}],
		["path", {
			d: "M8 18h5",
			key: "17enja"
		}]
	]);
	const NotepadText = createLucideIcon("NotepadText", [
		["path", {
			d: "M8 2v4",
			key: "1cmpym"
		}],
		["path", {
			d: "M12 2v4",
			key: "3427ic"
		}],
		["path", {
			d: "M16 2v4",
			key: "4m81vk"
		}],
		["rect", {
			width: "16",
			height: "18",
			x: "4",
			y: "4",
			rx: "2",
			key: "1u9h20"
		}],
		["path", {
			d: "M8 10h6",
			key: "3oa6kw"
		}],
		["path", {
			d: "M8 14h8",
			key: "1fgep2"
		}],
		["path", {
			d: "M8 18h5",
			key: "17enja"
		}]
	]);
	const NutOff = createLucideIcon("NutOff", [
		["path", {
			d: "M12 4V2",
			key: "1k5q1u"
		}],
		["path", {
			d: "M5 10v4a7.004 7.004 0 0 0 5.277 6.787c.412.104.802.292 1.102.592L12 22l.621-.621c.3-.3.69-.488 1.102-.592a7.01 7.01 0 0 0 4.125-2.939",
			key: "1xcvy9"
		}],
		["path", {
			d: "M19 10v3.343",
			key: "163tfc"
		}],
		["path", {
			d: "M12 12c-1.349-.573-1.905-1.005-2.5-2-.546.902-1.048 1.353-2.5 2-1.018-.644-1.46-1.08-2-2-1.028.71-1.69.918-3 1 1.081-1.048 1.757-2.03 2-3 .194-.776.84-1.551 1.79-2.21m11.654 5.997c.887-.457 1.28-.891 1.556-1.787 1.032.916 1.683 1.157 3 1-1.297-1.036-1.758-2.03-2-3-.5-2-4-4-8-4-.74 0-1.461.068-2.15.192",
			key: "17914v"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Nut = createLucideIcon("Nut", [
		["path", {
			d: "M12 4V2",
			key: "1k5q1u"
		}],
		["path", {
			d: "M5 10v4a7.004 7.004 0 0 0 5.277 6.787c.412.104.802.292 1.102.592L12 22l.621-.621c.3-.3.69-.488 1.102-.592A7.003 7.003 0 0 0 19 14v-4",
			key: "1tgyif"
		}],
		["path", {
			d: "M12 4C8 4 4.5 6 4 8c-.243.97-.919 1.952-2 3 1.31-.082 1.972-.29 3-1 .54.92.982 1.356 2 2 1.452-.647 1.954-1.098 2.5-2 .595.995 1.151 1.427 2.5 2 1.31-.621 1.862-1.058 2.5-2 .629.977 1.162 1.423 2.5 2 1.209-.548 1.68-.967 2-2 1.032.916 1.683 1.157 3 1-1.297-1.036-1.758-2.03-2-3-.5-2-4-4-8-4Z",
			key: "tnsqj"
		}]
	]);
	const OctagonAlert = createLucideIcon("OctagonAlert", [
		["path", {
			d: "M12 16h.01",
			key: "1drbdi"
		}],
		["path", {
			d: "M12 8v4",
			key: "1got3b"
		}],
		["path", {
			d: "M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z",
			key: "1fd625"
		}]
	]);
	const OctagonMinus = createLucideIcon("OctagonMinus", [["path", {
		d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
		key: "2d38gg"
	}], ["path", {
		d: "M8 12h8",
		key: "1wcyev"
	}]]);
	const OctagonPause = createLucideIcon("OctagonPause", [
		["path", {
			d: "M10 15V9",
			key: "1lckn7"
		}],
		["path", {
			d: "M14 15V9",
			key: "1muqhk"
		}],
		["path", {
			d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
			key: "2d38gg"
		}]
	]);
	const OctagonX = createLucideIcon("OctagonX", [
		["path", {
			d: "m15 9-6 6",
			key: "1uzhvr"
		}],
		["path", {
			d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
			key: "2d38gg"
		}],
		["path", {
			d: "m9 9 6 6",
			key: "z0biqf"
		}]
	]);
	const Octagon = createLucideIcon("Octagon", [["path", {
		d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
		key: "2d38gg"
	}]]);
	const Omega = createLucideIcon("Omega", [["path", {
		d: "M3 20h4.5a.5.5 0 0 0 .5-.5v-.282a.52.52 0 0 0-.247-.437 8 8 0 1 1 8.494-.001.52.52 0 0 0-.247.438v.282a.5.5 0 0 0 .5.5H21",
		key: "1x94xo"
	}]]);
	const Option = createLucideIcon("Option", [["path", {
		d: "M3 3h6l6 18h6",
		key: "ph9rgk"
	}], ["path", {
		d: "M14 3h7",
		key: "16f0ms"
	}]]);
	const Orbit = createLucideIcon("Orbit", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "3",
			key: "1v7zrd"
		}],
		["circle", {
			cx: "19",
			cy: "5",
			r: "2",
			key: "mhkx31"
		}],
		["circle", {
			cx: "5",
			cy: "19",
			r: "2",
			key: "v8kfzx"
		}],
		["path", {
			d: "M10.4 21.9a10 10 0 0 0 9.941-15.416",
			key: "eohfx2"
		}],
		["path", {
			d: "M13.5 2.1a10 10 0 0 0-9.841 15.416",
			key: "19pvbm"
		}]
	]);
	const Origami = createLucideIcon("Origami", [
		["path", {
			d: "M12 12V4a1 1 0 0 1 1-1h6.297a1 1 0 0 1 .651 1.759l-4.696 4.025",
			key: "1bx4vc"
		}],
		["path", {
			d: "m12 21-7.414-7.414A2 2 0 0 1 4 12.172V6.415a1.002 1.002 0 0 1 1.707-.707L20 20.009",
			key: "1h3km6"
		}],
		["path", {
			d: "m12.214 3.381 8.414 14.966a1 1 0 0 1-.167 1.199l-1.168 1.163a1 1 0 0 1-.706.291H6.351a1 1 0 0 1-.625-.219L3.25 18.8a1 1 0 0 1 .631-1.781l4.165.027",
			key: "1hj4wg"
		}]
	]);
	const Package2 = createLucideIcon("Package2", [
		["path", {
			d: "M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z",
			key: "1ront0"
		}],
		["path", {
			d: "m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9",
			key: "19h2x1"
		}],
		["path", {
			d: "M12 3v6",
			key: "1holv5"
		}]
	]);
	const PackageCheck = createLucideIcon("PackageCheck", [
		["path", {
			d: "m16 16 2 2 4-4",
			key: "gfu2re"
		}],
		["path", {
			d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
			key: "e7tb2h"
		}],
		["path", {
			d: "m7.5 4.27 9 5.15",
			key: "1c824w"
		}],
		["polyline", {
			points: "3.29 7 12 12 20.71 7",
			key: "ousv84"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "22",
			y2: "12",
			key: "a4e8g8"
		}]
	]);
	const PackageMinus = createLucideIcon("PackageMinus", [
		["path", {
			d: "M16 16h6",
			key: "100bgy"
		}],
		["path", {
			d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
			key: "e7tb2h"
		}],
		["path", {
			d: "m7.5 4.27 9 5.15",
			key: "1c824w"
		}],
		["polyline", {
			points: "3.29 7 12 12 20.71 7",
			key: "ousv84"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "22",
			y2: "12",
			key: "a4e8g8"
		}]
	]);
	const PackageOpen = createLucideIcon("PackageOpen", [
		["path", {
			d: "M12 22v-9",
			key: "x3hkom"
		}],
		["path", {
			d: "M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z",
			key: "2ntwy6"
		}],
		["path", {
			d: "M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13",
			key: "1pmm1c"
		}],
		["path", {
			d: "M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z",
			key: "12ttoo"
		}]
	]);
	const PackagePlus = createLucideIcon("PackagePlus", [
		["path", {
			d: "M16 16h6",
			key: "100bgy"
		}],
		["path", {
			d: "M19 13v6",
			key: "85cyf1"
		}],
		["path", {
			d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
			key: "e7tb2h"
		}],
		["path", {
			d: "m7.5 4.27 9 5.15",
			key: "1c824w"
		}],
		["polyline", {
			points: "3.29 7 12 12 20.71 7",
			key: "ousv84"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "22",
			y2: "12",
			key: "a4e8g8"
		}]
	]);
	const PackageSearch = createLucideIcon("PackageSearch", [
		["path", {
			d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
			key: "e7tb2h"
		}],
		["path", {
			d: "m7.5 4.27 9 5.15",
			key: "1c824w"
		}],
		["polyline", {
			points: "3.29 7 12 12 20.71 7",
			key: "ousv84"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "22",
			y2: "12",
			key: "a4e8g8"
		}],
		["circle", {
			cx: "18.5",
			cy: "15.5",
			r: "2.5",
			key: "b5zd12"
		}],
		["path", {
			d: "M20.27 17.27 22 19",
			key: "1l4muz"
		}]
	]);
	const PackageX = createLucideIcon("PackageX", [
		["path", {
			d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
			key: "e7tb2h"
		}],
		["path", {
			d: "m7.5 4.27 9 5.15",
			key: "1c824w"
		}],
		["polyline", {
			points: "3.29 7 12 12 20.71 7",
			key: "ousv84"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "22",
			y2: "12",
			key: "a4e8g8"
		}],
		["path", {
			d: "m17 13 5 5m-5 0 5-5",
			key: "im3w4b"
		}]
	]);
	const Package = createLucideIcon("Package", [
		["path", {
			d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
			key: "1a0edw"
		}],
		["path", {
			d: "M12 22V12",
			key: "d0xqtd"
		}],
		["path", {
			d: "m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7",
			key: "yx3hmr"
		}],
		["path", {
			d: "m7.5 4.27 9 5.15",
			key: "1c824w"
		}]
	]);
	const PaintBucket = createLucideIcon("PaintBucket", [
		["path", {
			d: "m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z",
			key: "irua1i"
		}],
		["path", {
			d: "m5 2 5 5",
			key: "1lls2c"
		}],
		["path", {
			d: "M2 13h15",
			key: "1hkzvu"
		}],
		["path", {
			d: "M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z",
			key: "xk76lq"
		}]
	]);
	const PaintRoller = createLucideIcon("PaintRoller", [
		["rect", {
			width: "16",
			height: "6",
			x: "2",
			y: "2",
			rx: "2",
			key: "jcyz7m"
		}],
		["path", {
			d: "M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2",
			key: "1b9h7c"
		}],
		["rect", {
			width: "4",
			height: "6",
			x: "8",
			y: "16",
			rx: "1",
			key: "d6e7yl"
		}]
	]);
	const PaintbrushVertical = createLucideIcon("PaintbrushVertical", [
		["path", {
			d: "M10 2v2",
			key: "7u0qdc"
		}],
		["path", {
			d: "M14 2v4",
			key: "qmzblu"
		}],
		["path", {
			d: "M17 2a1 1 0 0 1 1 1v9H6V3a1 1 0 0 1 1-1z",
			key: "ycvu00"
		}],
		["path", {
			d: "M6 12a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v2.9a2 2 0 1 0 4 0V17a1 1 0 0 1 1-1h2a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1",
			key: "iw4wnp"
		}]
	]);
	const Paintbrush = createLucideIcon("Paintbrush", [
		["path", {
			d: "m14.622 17.897-10.68-2.913",
			key: "vj2p1u"
		}],
		["path", {
			d: "M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z",
			key: "18tc5c"
		}],
		["path", {
			d: "M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15",
			key: "ytzfxy"
		}]
	]);
	const Palette = createLucideIcon("Palette", [
		["circle", {
			cx: "13.5",
			cy: "6.5",
			r: ".5",
			fill: "currentColor",
			key: "1okk4w"
		}],
		["circle", {
			cx: "17.5",
			cy: "10.5",
			r: ".5",
			fill: "currentColor",
			key: "f64h9f"
		}],
		["circle", {
			cx: "8.5",
			cy: "7.5",
			r: ".5",
			fill: "currentColor",
			key: "fotxhn"
		}],
		["circle", {
			cx: "6.5",
			cy: "12.5",
			r: ".5",
			fill: "currentColor",
			key: "qy21gx"
		}],
		["path", {
			d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",
			key: "12rzf8"
		}]
	]);
	const PanelBottomClose = createLucideIcon("PanelBottomClose", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M3 15h18",
			key: "5xshup"
		}],
		["path", {
			d: "m15 8-3 3-3-3",
			key: "1oxy1z"
		}]
	]);
	const PanelBottomDashed = createLucideIcon("PanelBottomDashed", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M14 15h1",
			key: "171nev"
		}],
		["path", {
			d: "M19 15h2",
			key: "1vnucp"
		}],
		["path", {
			d: "M3 15h2",
			key: "8bym0q"
		}],
		["path", {
			d: "M9 15h1",
			key: "1tg3ks"
		}]
	]);
	const PanelBottomOpen = createLucideIcon("PanelBottomOpen", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M3 15h18",
			key: "5xshup"
		}],
		["path", {
			d: "m9 10 3-3 3 3",
			key: "11gsxs"
		}]
	]);
	const PanelBottom = createLucideIcon("PanelBottom", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "M3 15h18",
		key: "5xshup"
	}]]);
	const PanelLeftClose = createLucideIcon("PanelLeftClose", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M9 3v18",
			key: "fh3hqa"
		}],
		["path", {
			d: "m16 15-3-3 3-3",
			key: "14y99z"
		}]
	]);
	const PanelLeftDashed = createLucideIcon("PanelLeftDashed", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M9 14v1",
			key: "askpd8"
		}],
		["path", {
			d: "M9 19v2",
			key: "16tejx"
		}],
		["path", {
			d: "M9 3v2",
			key: "1noubl"
		}],
		["path", {
			d: "M9 9v1",
			key: "19ebxg"
		}]
	]);
	const PanelLeftOpen = createLucideIcon("PanelLeftOpen", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M9 3v18",
			key: "fh3hqa"
		}],
		["path", {
			d: "m14 9 3 3-3 3",
			key: "8010ee"
		}]
	]);
	const PanelLeft = createLucideIcon("PanelLeft", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "M9 3v18",
		key: "fh3hqa"
	}]]);
	const PanelRightClose$1 = createLucideIcon("PanelRightClose", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M15 3v18",
			key: "14nvp0"
		}],
		["path", {
			d: "m8 9 3 3-3 3",
			key: "12hl5m"
		}]
	]);
	const PanelRightDashed = createLucideIcon("PanelRightDashed", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M15 14v1",
			key: "ilsfch"
		}],
		["path", {
			d: "M15 19v2",
			key: "1fst2f"
		}],
		["path", {
			d: "M15 3v2",
			key: "z204g4"
		}],
		["path", {
			d: "M15 9v1",
			key: "z2a8b1"
		}]
	]);
	const PanelRightOpen = createLucideIcon("PanelRightOpen", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M15 3v18",
			key: "14nvp0"
		}],
		["path", {
			d: "m10 15-3-3 3-3",
			key: "1pgupc"
		}]
	]);
	const PanelRight = createLucideIcon("PanelRight", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "M15 3v18",
		key: "14nvp0"
	}]]);
	const PanelTopClose = createLucideIcon("PanelTopClose", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M3 9h18",
			key: "1pudct"
		}],
		["path", {
			d: "m9 16 3-3 3 3",
			key: "1idcnm"
		}]
	]);
	const PanelTopDashed = createLucideIcon("PanelTopDashed", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M14 9h1",
			key: "l0svgy"
		}],
		["path", {
			d: "M19 9h2",
			key: "te2zfg"
		}],
		["path", {
			d: "M3 9h2",
			key: "1h4ldw"
		}],
		["path", {
			d: "M9 9h1",
			key: "15jzuz"
		}]
	]);
	const PanelTopOpen = createLucideIcon("PanelTopOpen", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M3 9h18",
			key: "1pudct"
		}],
		["path", {
			d: "m15 14-3 3-3-3",
			key: "g215vf"
		}]
	]);
	const PanelTop = createLucideIcon("PanelTop", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "M3 9h18",
		key: "1pudct"
	}]]);
	const PanelsLeftBottom = createLucideIcon("PanelsLeftBottom", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M9 3v18",
			key: "fh3hqa"
		}],
		["path", {
			d: "M9 15h12",
			key: "5ijen5"
		}]
	]);
	const PanelsRightBottom = createLucideIcon("PanelsRightBottom", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M3 15h12",
			key: "1wkqb3"
		}],
		["path", {
			d: "M15 3v18",
			key: "14nvp0"
		}]
	]);
	const PanelsTopLeft = createLucideIcon("PanelsTopLeft", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M3 9h18",
			key: "1pudct"
		}],
		["path", {
			d: "M9 21V9",
			key: "1oto5p"
		}]
	]);
	const Paperclip = createLucideIcon("Paperclip", [["path", {
		d: "M13.234 20.252 21 12.3",
		key: "1cbrk9"
	}], ["path", {
		d: "m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486",
		key: "1pkts6"
	}]]);
	const Parentheses = createLucideIcon("Parentheses", [["path", {
		d: "M8 21s-4-3-4-9 4-9 4-9",
		key: "uto9ud"
	}], ["path", {
		d: "M16 3s4 3 4 9-4 9-4 9",
		key: "4w2vsq"
	}]]);
	const ParkingMeter = createLucideIcon("ParkingMeter", [
		["path", {
			d: "M11 15h2",
			key: "199qp6"
		}],
		["path", {
			d: "M12 12v3",
			key: "158kv8"
		}],
		["path", {
			d: "M12 19v3",
			key: "npa21l"
		}],
		["path", {
			d: "M15.282 19a1 1 0 0 0 .948-.68l2.37-6.988a7 7 0 1 0-13.2 0l2.37 6.988a1 1 0 0 0 .948.68z",
			key: "1jofit"
		}],
		["path", {
			d: "M9 9a3 3 0 1 1 6 0",
			key: "jdoeu8"
		}]
	]);
	const PartyPopper = createLucideIcon("PartyPopper", [
		["path", {
			d: "M5.8 11.3 2 22l10.7-3.79",
			key: "gwxi1d"
		}],
		["path", {
			d: "M4 3h.01",
			key: "1vcuye"
		}],
		["path", {
			d: "M22 8h.01",
			key: "1mrtc2"
		}],
		["path", {
			d: "M15 2h.01",
			key: "1cjtqr"
		}],
		["path", {
			d: "M22 20h.01",
			key: "1mrys2"
		}],
		["path", {
			d: "m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",
			key: "hbicv8"
		}],
		["path", {
			d: "m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17",
			key: "1i94pl"
		}],
		["path", {
			d: "m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7",
			key: "1cofks"
		}],
		["path", {
			d: "M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",
			key: "4kbmks"
		}]
	]);
	const Pause = createLucideIcon("Pause", [["rect", {
		x: "14",
		y: "4",
		width: "4",
		height: "16",
		rx: "1",
		key: "zuxfzm"
	}], ["rect", {
		x: "6",
		y: "4",
		width: "4",
		height: "16",
		rx: "1",
		key: "1okwgv"
	}]]);
	const PawPrint = createLucideIcon("PawPrint", [
		["circle", {
			cx: "11",
			cy: "4",
			r: "2",
			key: "vol9p0"
		}],
		["circle", {
			cx: "18",
			cy: "8",
			r: "2",
			key: "17gozi"
		}],
		["circle", {
			cx: "20",
			cy: "16",
			r: "2",
			key: "1v9bxh"
		}],
		["path", {
			d: "M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z",
			key: "1ydw1z"
		}]
	]);
	const PcCase = createLucideIcon("PcCase", [
		["rect", {
			width: "14",
			height: "20",
			x: "5",
			y: "2",
			rx: "2",
			key: "1uq1d7"
		}],
		["path", {
			d: "M15 14h.01",
			key: "1kp3bh"
		}],
		["path", {
			d: "M9 6h6",
			key: "dgm16u"
		}],
		["path", {
			d: "M9 10h6",
			key: "9gxzsh"
		}]
	]);
	const PenLine = createLucideIcon("PenLine", [["path", {
		d: "M12 20h9",
		key: "t2du7b"
	}], ["path", {
		d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
		key: "1ykcvy"
	}]]);
	const PenOff = createLucideIcon("PenOff", [
		["path", {
			d: "m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982",
			key: "bjo8r8"
		}],
		["path", {
			d: "m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353",
			key: "16h5ne"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]);
	const PenTool = createLucideIcon("PenTool", [
		["path", {
			d: "M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z",
			key: "nt11vn"
		}],
		["path", {
			d: "m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18",
			key: "15qc1e"
		}],
		["path", {
			d: "m2.3 2.3 7.286 7.286",
			key: "1wuzzi"
		}],
		["circle", {
			cx: "11",
			cy: "11",
			r: "2",
			key: "xmgehs"
		}]
	]);
	const Pen = createLucideIcon("Pen", [["path", {
		d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
		key: "1a8usu"
	}]]);
	const PencilLine = createLucideIcon("PencilLine", [
		["path", {
			d: "M12 20h9",
			key: "t2du7b"
		}],
		["path", {
			d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
			key: "1ykcvy"
		}],
		["path", {
			d: "m15 5 3 3",
			key: "1w25hb"
		}]
	]);
	const PencilOff = createLucideIcon("PencilOff", [
		["path", {
			d: "m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982",
			key: "bjo8r8"
		}],
		["path", {
			d: "m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353",
			key: "16h5ne"
		}],
		["path", {
			d: "m15 5 4 4",
			key: "1mk7zo"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]);
	const PencilRuler = createLucideIcon("PencilRuler", [
		["path", {
			d: "M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13",
			key: "orapub"
		}],
		["path", {
			d: "m8 6 2-2",
			key: "115y1s"
		}],
		["path", {
			d: "m18 16 2-2",
			key: "ee94s4"
		}],
		["path", {
			d: "m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17",
			key: "cfq27r"
		}],
		["path", {
			d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
			key: "1a8usu"
		}],
		["path", {
			d: "m15 5 4 4",
			key: "1mk7zo"
		}]
	]);
	const Pencil = createLucideIcon("Pencil", [["path", {
		d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
		key: "1a8usu"
	}], ["path", {
		d: "m15 5 4 4",
		key: "1mk7zo"
	}]]);
	const Pentagon = createLucideIcon("Pentagon", [["path", {
		d: "M10.83 2.38a2 2 0 0 1 2.34 0l8 5.74a2 2 0 0 1 .73 2.25l-3.04 9.26a2 2 0 0 1-1.9 1.37H7.04a2 2 0 0 1-1.9-1.37L2.1 10.37a2 2 0 0 1 .73-2.25z",
		key: "2hea0t"
	}]]);
	const Percent = createLucideIcon("Percent", [
		["line", {
			x1: "19",
			x2: "5",
			y1: "5",
			y2: "19",
			key: "1x9vlm"
		}],
		["circle", {
			cx: "6.5",
			cy: "6.5",
			r: "2.5",
			key: "4mh3h7"
		}],
		["circle", {
			cx: "17.5",
			cy: "17.5",
			r: "2.5",
			key: "1mdrzq"
		}]
	]);
	const PersonStanding = createLucideIcon("PersonStanding", [
		["circle", {
			cx: "12",
			cy: "5",
			r: "1",
			key: "gxeob9"
		}],
		["path", {
			d: "m9 20 3-6 3 6",
			key: "se2kox"
		}],
		["path", {
			d: "m6 8 6 2 6-2",
			key: "4o3us4"
		}],
		["path", {
			d: "M12 10v4",
			key: "1kjpxc"
		}]
	]);
	const PhilippinePeso = createLucideIcon("PhilippinePeso", [
		["path", {
			d: "M20 11H4",
			key: "6ut86h"
		}],
		["path", {
			d: "M20 7H4",
			key: "zbl0bi"
		}],
		["path", {
			d: "M7 21V4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 12H7",
			key: "1ana5r"
		}]
	]);
	const PhoneCall = createLucideIcon("PhoneCall", [
		["path", {
			d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
			key: "foiqr5"
		}],
		["path", {
			d: "M14.05 2a9 9 0 0 1 8 7.94",
			key: "vmijpz"
		}],
		["path", {
			d: "M14.05 6A5 5 0 0 1 18 10",
			key: "13nbpp"
		}]
	]);
	const PhoneForwarded = createLucideIcon("PhoneForwarded", [
		["polyline", {
			points: "18 2 22 6 18 10",
			key: "6vjanh"
		}],
		["line", {
			x1: "14",
			x2: "22",
			y1: "6",
			y2: "6",
			key: "1jsywh"
		}],
		["path", {
			d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
			key: "foiqr5"
		}]
	]);
	const PhoneIncoming = createLucideIcon("PhoneIncoming", [
		["polyline", {
			points: "16 2 16 8 22 8",
			key: "1ygljm"
		}],
		["line", {
			x1: "22",
			x2: "16",
			y1: "2",
			y2: "8",
			key: "1xzwqn"
		}],
		["path", {
			d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
			key: "foiqr5"
		}]
	]);
	const PhoneMissed = createLucideIcon("PhoneMissed", [
		["line", {
			x1: "22",
			x2: "16",
			y1: "2",
			y2: "8",
			key: "1xzwqn"
		}],
		["line", {
			x1: "16",
			x2: "22",
			y1: "2",
			y2: "8",
			key: "13zxdn"
		}],
		["path", {
			d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
			key: "foiqr5"
		}]
	]);
	const PhoneOff = createLucideIcon("PhoneOff", [["path", {
		d: "M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91",
		key: "z86iuo"
	}], ["line", {
		x1: "22",
		x2: "2",
		y1: "2",
		y2: "22",
		key: "11kh81"
	}]]);
	const PhoneOutgoing = createLucideIcon("PhoneOutgoing", [
		["polyline", {
			points: "22 8 22 2 16 2",
			key: "1g204g"
		}],
		["line", {
			x1: "16",
			x2: "22",
			y1: "8",
			y2: "2",
			key: "1ggias"
		}],
		["path", {
			d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
			key: "foiqr5"
		}]
	]);
	const Phone = createLucideIcon("Phone", [["path", {
		d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
		key: "foiqr5"
	}]]);
	const Pi = createLucideIcon("Pi", [
		["line", {
			x1: "9",
			x2: "9",
			y1: "4",
			y2: "20",
			key: "ovs5a5"
		}],
		["path", {
			d: "M4 7c0-1.7 1.3-3 3-3h13",
			key: "10pag4"
		}],
		["path", {
			d: "M18 20c-1.7 0-3-1.3-3-3V4",
			key: "1gaosr"
		}]
	]);
	const Piano = createLucideIcon("Piano", [
		["path", {
			d: "M18.5 8c-1.4 0-2.6-.8-3.2-2A6.87 6.87 0 0 0 2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5C22 9.6 20.4 8 18.5 8",
			key: "lag0yf"
		}],
		["path", {
			d: "M2 14h20",
			key: "myj16y"
		}],
		["path", {
			d: "M6 14v4",
			key: "9ng0ue"
		}],
		["path", {
			d: "M10 14v4",
			key: "1v8uk5"
		}],
		["path", {
			d: "M14 14v4",
			key: "1tqops"
		}],
		["path", {
			d: "M18 14v4",
			key: "18uqwm"
		}]
	]);
	const Pickaxe = createLucideIcon("Pickaxe", [
		["path", {
			d: "M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912",
			key: "we99rg"
		}],
		["path", {
			d: "M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393",
			key: "1w6hck"
		}],
		["path", {
			d: "M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z",
			key: "15hgfx"
		}],
		["path", {
			d: "M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319",
			key: "452b4h"
		}]
	]);
	const PictureInPicture2 = createLucideIcon("PictureInPicture2", [["path", {
		d: "M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4",
		key: "daa4of"
	}], ["rect", {
		width: "10",
		height: "7",
		x: "12",
		y: "13",
		rx: "2",
		key: "1nb8gs"
	}]]);
	const PictureInPicture = createLucideIcon("PictureInPicture", [
		["path", {
			d: "M2 10h6V4",
			key: "zwrco"
		}],
		["path", {
			d: "m2 4 6 6",
			key: "ug085t"
		}],
		["path", {
			d: "M21 10V7a2 2 0 0 0-2-2h-7",
			key: "git5jr"
		}],
		["path", {
			d: "M3 14v2a2 2 0 0 0 2 2h3",
			key: "1f7fh3"
		}],
		["rect", {
			x: "12",
			y: "14",
			width: "10",
			height: "7",
			rx: "1",
			key: "1wjs3o"
		}]
	]);
	const PiggyBank = createLucideIcon("PiggyBank", [
		["path", {
			d: "M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z",
			key: "1ivx2i"
		}],
		["path", {
			d: "M2 9v1c0 1.1.9 2 2 2h1",
			key: "nm575m"
		}],
		["path", {
			d: "M16 11h.01",
			key: "xkw8gn"
		}]
	]);
	const PilcrowLeft = createLucideIcon("PilcrowLeft", [
		["path", {
			d: "M14 3v11",
			key: "mlfb7b"
		}],
		["path", {
			d: "M14 9h-3a3 3 0 0 1 0-6h9",
			key: "1ulc19"
		}],
		["path", {
			d: "M18 3v11",
			key: "1phi0r"
		}],
		["path", {
			d: "M22 18H2l4-4",
			key: "yt65j9"
		}],
		["path", {
			d: "m6 22-4-4",
			key: "6jgyf5"
		}]
	]);
	const PilcrowRight = createLucideIcon("PilcrowRight", [
		["path", {
			d: "M10 3v11",
			key: "o3l5kj"
		}],
		["path", {
			d: "M10 9H7a1 1 0 0 1 0-6h8",
			key: "1wb1nc"
		}],
		["path", {
			d: "M14 3v11",
			key: "mlfb7b"
		}],
		["path", {
			d: "m18 14 4 4H2",
			key: "4r8io1"
		}],
		["path", {
			d: "m22 18-4 4",
			key: "1hjjrd"
		}]
	]);
	const Pilcrow = createLucideIcon("Pilcrow", [
		["path", {
			d: "M13 4v16",
			key: "8vvj80"
		}],
		["path", {
			d: "M17 4v16",
			key: "7dpous"
		}],
		["path", {
			d: "M19 4H9.5a4.5 4.5 0 0 0 0 9H13",
			key: "sh4n9v"
		}]
	]);
	const PillBottle = createLucideIcon("PillBottle", [
		["path", {
			d: "M18 11h-4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4",
			key: "17ldeb"
		}],
		["path", {
			d: "M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7",
			key: "nc37y6"
		}],
		["rect", {
			width: "16",
			height: "5",
			x: "4",
			y: "2",
			rx: "1",
			key: "3jeezo"
		}]
	]);
	const Pill = createLucideIcon("Pill", [["path", {
		d: "m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z",
		key: "wa1lgi"
	}], ["path", {
		d: "m8.5 8.5 7 7",
		key: "rvfmvr"
	}]]);
	const PinOff$1 = createLucideIcon("PinOff", [
		["path", {
			d: "M12 17v5",
			key: "bb1du9"
		}],
		["path", {
			d: "M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89",
			key: "znwnzq"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11",
			key: "c9qhm2"
		}]
	]);
	const Pin$1 = createLucideIcon("Pin", [["path", {
		d: "M12 17v5",
		key: "bb1du9"
	}], ["path", {
		d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",
		key: "1nkz8b"
	}]]);
	const Pipette = createLucideIcon("Pipette", [
		["path", {
			d: "m2 22 1-1h3l9-9",
			key: "1sre89"
		}],
		["path", {
			d: "M3 21v-3l9-9",
			key: "hpe2y6"
		}],
		["path", {
			d: "m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z",
			key: "196du1"
		}]
	]);
	const Pizza = createLucideIcon("Pizza", [
		["path", {
			d: "m12 14-1 1",
			key: "11onhr"
		}],
		["path", {
			d: "m13.75 18.25-1.25 1.42",
			key: "1yisr3"
		}],
		["path", {
			d: "M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12",
			key: "1qtqk6"
		}],
		["path", {
			d: "M18.8 9.3a1 1 0 0 0 2.1 7.7",
			key: "fbbbr2"
		}],
		["path", {
			d: "M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z",
			key: "1hyfdd"
		}]
	]);
	const PlaneLanding = createLucideIcon("PlaneLanding", [["path", {
		d: "M2 22h20",
		key: "272qi7"
	}], ["path", {
		d: "M3.77 10.77 2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s.35 1.17.9 1.45L8 8.5l3-6 1.05.53a2 2 0 0 1 1.09 1.52l.72 5.4a2 2 0 0 0 1.09 1.52l4.4 2.2c.42.22.78.55 1.01.96l.6 1.03c.49.88-.06 1.98-1.06 2.1l-1.18.15c-.47.06-.95-.02-1.37-.24L4.29 11.15a2 2 0 0 1-.52-.38Z",
		key: "1ma21e"
	}]]);
	const PlaneTakeoff = createLucideIcon("PlaneTakeoff", [["path", {
		d: "M2 22h20",
		key: "272qi7"
	}], ["path", {
		d: "M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z",
		key: "fkigj9"
	}]]);
	const Plane = createLucideIcon("Plane", [["path", {
		d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
		key: "1v9wt8"
	}]]);
	const Play = createLucideIcon("Play", [["polygon", {
		points: "6 3 20 12 6 21 6 3",
		key: "1oa8hb"
	}]]);
	const Plug2 = createLucideIcon("Plug2", [
		["path", {
			d: "M9 2v6",
			key: "17ngun"
		}],
		["path", {
			d: "M15 2v6",
			key: "s7yy2p"
		}],
		["path", {
			d: "M12 17v5",
			key: "bb1du9"
		}],
		["path", {
			d: "M5 8h14",
			key: "pcz4l3"
		}],
		["path", {
			d: "M6 11V8h12v3a6 6 0 1 1-12 0Z",
			key: "wtfw2c"
		}]
	]);
	const PlugZap = createLucideIcon("PlugZap", [
		["path", {
			d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z",
			key: "goz73y"
		}],
		["path", {
			d: "m2 22 3-3",
			key: "19mgm9"
		}],
		["path", {
			d: "M7.5 13.5 10 11",
			key: "7xgeeb"
		}],
		["path", {
			d: "M10.5 16.5 13 14",
			key: "10btkg"
		}],
		["path", {
			d: "m18 3-4 4h6l-4 4",
			key: "16psg9"
		}]
	]);
	const Plug = createLucideIcon("Plug", [
		["path", {
			d: "M12 22v-5",
			key: "1ega77"
		}],
		["path", {
			d: "M9 8V2",
			key: "14iosj"
		}],
		["path", {
			d: "M15 8V2",
			key: "18g5xt"
		}],
		["path", {
			d: "M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z",
			key: "osxo6l"
		}]
	]);
	const Plus = createLucideIcon("Plus", [["path", {
		d: "M5 12h14",
		key: "1ays0h"
	}], ["path", {
		d: "M12 5v14",
		key: "s699le"
	}]]);
	const PocketKnife = createLucideIcon("PocketKnife", [
		["path", {
			d: "M3 2v1c0 1 2 1 2 2S3 6 3 7s2 1 2 2-2 1-2 2 2 1 2 2",
			key: "19w3oe"
		}],
		["path", {
			d: "M18 6h.01",
			key: "1v4wsw"
		}],
		["path", {
			d: "M6 18h.01",
			key: "uhywen"
		}],
		["path", {
			d: "M20.83 8.83a4 4 0 0 0-5.66-5.66l-12 12a4 4 0 1 0 5.66 5.66Z",
			key: "6fykxj"
		}],
		["path", {
			d: "M18 11.66V22a4 4 0 0 0 4-4V6",
			key: "1utzek"
		}]
	]);
	const Pocket = createLucideIcon("Pocket", [["path", {
		d: "M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z",
		key: "1mz881"
	}], ["polyline", {
		points: "8 10 12 14 16 10",
		key: "w4mbv5"
	}]]);
	const Podcast = createLucideIcon("Podcast", [
		["path", {
			d: "M16.85 18.58a9 9 0 1 0-9.7 0",
			key: "d71mpg"
		}],
		["path", {
			d: "M8 14a5 5 0 1 1 8 0",
			key: "fc81rn"
		}],
		["circle", {
			cx: "12",
			cy: "11",
			r: "1",
			key: "1gvufo"
		}],
		["path", {
			d: "M13 17a1 1 0 1 0-2 0l.5 4.5a.5.5 0 1 0 1 0Z",
			key: "za5kbj"
		}]
	]);
	const PointerOff = createLucideIcon("PointerOff", [
		["path", {
			d: "M10 4.5V4a2 2 0 0 0-2.41-1.957",
			key: "jsi14n"
		}],
		["path", {
			d: "M13.9 8.4a2 2 0 0 0-1.26-1.295",
			key: "hirc7f"
		}],
		["path", {
			d: "M21.7 16.2A8 8 0 0 0 22 14v-3a2 2 0 1 0-4 0v-1a2 2 0 0 0-3.63-1.158",
			key: "1jxb2e"
		}],
		["path", {
			d: "m7 15-1.8-1.8a2 2 0 0 0-2.79 2.86L6 19.7a7.74 7.74 0 0 0 6 2.3h2a8 8 0 0 0 5.657-2.343",
			key: "10r7hm"
		}],
		["path", {
			d: "M6 6v8",
			key: "tv5xkp"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]);
	const Pointer = createLucideIcon("Pointer", [
		["path", {
			d: "M22 14a8 8 0 0 1-8 8",
			key: "56vcr3"
		}],
		["path", {
			d: "M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2",
			key: "1agjmk"
		}],
		["path", {
			d: "M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1",
			key: "wdbh2u"
		}],
		["path", {
			d: "M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10",
			key: "1ibuk9"
		}],
		["path", {
			d: "M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",
			key: "g6ys72"
		}]
	]);
	const Popcorn = createLucideIcon("Popcorn", [
		["path", {
			d: "M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4",
			key: "10td1f"
		}],
		["path", {
			d: "M10 22 9 8",
			key: "yjptiv"
		}],
		["path", {
			d: "m14 22 1-14",
			key: "8jwc8b"
		}],
		["path", {
			d: "M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z",
			key: "1qo33t"
		}]
	]);
	const Popsicle = createLucideIcon("Popsicle", [["path", {
		d: "M18.6 14.4c.8-.8.8-2 0-2.8l-8.1-8.1a4.95 4.95 0 1 0-7.1 7.1l8.1 8.1c.9.7 2.1.7 2.9-.1Z",
		key: "1o68ps"
	}], ["path", {
		d: "m22 22-5.5-5.5",
		key: "17o70y"
	}]]);
	const PoundSterling = createLucideIcon("PoundSterling", [
		["path", {
			d: "M18 7c0-5.333-8-5.333-8 0",
			key: "1prm2n"
		}],
		["path", {
			d: "M10 7v14",
			key: "18tmcs"
		}],
		["path", {
			d: "M6 21h12",
			key: "4dkmi1"
		}],
		["path", {
			d: "M6 13h10",
			key: "ybwr4a"
		}]
	]);
	const PowerOff = createLucideIcon("PowerOff", [
		["path", {
			d: "M18.36 6.64A9 9 0 0 1 20.77 15",
			key: "dxknvb"
		}],
		["path", {
			d: "M6.16 6.16a9 9 0 1 0 12.68 12.68",
			key: "1x7qb5"
		}],
		["path", {
			d: "M12 2v4",
			key: "3427ic"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]);
	const Power = createLucideIcon("Power", [["path", {
		d: "M12 2v10",
		key: "mnfbl"
	}], ["path", {
		d: "M18.4 6.6a9 9 0 1 1-12.77.04",
		key: "obofu9"
	}]]);
	const Presentation = createLucideIcon("Presentation", [
		["path", {
			d: "M2 3h20",
			key: "91anmk"
		}],
		["path", {
			d: "M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3",
			key: "2k9sn8"
		}],
		["path", {
			d: "m7 21 5-5 5 5",
			key: "bip4we"
		}]
	]);
	const PrinterCheck = createLucideIcon("PrinterCheck", [
		["path", {
			d: "M13.5 22H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v.5",
			key: "qeb09x"
		}],
		["path", {
			d: "m16 19 2 2 4-4",
			key: "1b14m6"
		}],
		["path", {
			d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2",
			key: "1md90i"
		}],
		["path", {
			d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",
			key: "1itne7"
		}]
	]);
	const Printer = createLucideIcon("Printer", [
		["path", {
			d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
			key: "143wyd"
		}],
		["path", {
			d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",
			key: "1itne7"
		}],
		["rect", {
			x: "6",
			y: "14",
			width: "12",
			height: "8",
			rx: "1",
			key: "1ue0tg"
		}]
	]);
	const Projector = createLucideIcon("Projector", [
		["path", {
			d: "M5 7 3 5",
			key: "1yys58"
		}],
		["path", {
			d: "M9 6V3",
			key: "1ptz9u"
		}],
		["path", {
			d: "m13 7 2-2",
			key: "1w3vmq"
		}],
		["circle", {
			cx: "9",
			cy: "13",
			r: "3",
			key: "1mma13"
		}],
		["path", {
			d: "M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17",
			key: "2frwzc"
		}],
		["path", {
			d: "M16 16h2",
			key: "dnq2od"
		}]
	]);
	const Proportions = createLucideIcon("Proportions", [
		["rect", {
			width: "20",
			height: "16",
			x: "2",
			y: "4",
			rx: "2",
			key: "18n3k1"
		}],
		["path", {
			d: "M12 9v11",
			key: "1fnkrn"
		}],
		["path", {
			d: "M2 9h13a2 2 0 0 1 2 2v9",
			key: "11z3ex"
		}]
	]);
	const Puzzle = createLucideIcon("Puzzle", [["path", {
		d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",
		key: "w46dr5"
	}]]);
	const Pyramid = createLucideIcon("Pyramid", [["path", {
		d: "M2.5 16.88a1 1 0 0 1-.32-1.43l9-13.02a1 1 0 0 1 1.64 0l9 13.01a1 1 0 0 1-.32 1.44l-8.51 4.86a2 2 0 0 1-1.98 0Z",
		key: "aenxs0"
	}], ["path", {
		d: "M12 2v20",
		key: "t6zp3m"
	}]]);
	const QrCode = createLucideIcon("QrCode", [
		["rect", {
			width: "5",
			height: "5",
			x: "3",
			y: "3",
			rx: "1",
			key: "1tu5fj"
		}],
		["rect", {
			width: "5",
			height: "5",
			x: "16",
			y: "3",
			rx: "1",
			key: "1v8r4q"
		}],
		["rect", {
			width: "5",
			height: "5",
			x: "3",
			y: "16",
			rx: "1",
			key: "1x03jg"
		}],
		["path", {
			d: "M21 16h-3a2 2 0 0 0-2 2v3",
			key: "177gqh"
		}],
		["path", {
			d: "M21 21v.01",
			key: "ents32"
		}],
		["path", {
			d: "M12 7v3a2 2 0 0 1-2 2H7",
			key: "8crl2c"
		}],
		["path", {
			d: "M3 12h.01",
			key: "nlz23k"
		}],
		["path", {
			d: "M12 3h.01",
			key: "n36tog"
		}],
		["path", {
			d: "M12 16v.01",
			key: "133mhm"
		}],
		["path", {
			d: "M16 12h1",
			key: "1slzba"
		}],
		["path", {
			d: "M21 12v.01",
			key: "1lwtk9"
		}],
		["path", {
			d: "M12 21v-1",
			key: "1880an"
		}]
	]);
	const Quote = createLucideIcon("Quote", [["path", {
		d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
		key: "rib7q0"
	}], ["path", {
		d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
		key: "1ymkrd"
	}]]);
	const Rabbit = createLucideIcon("Rabbit", [
		["path", {
			d: "M13 16a3 3 0 0 1 2.24 5",
			key: "1epib5"
		}],
		["path", {
			d: "M18 12h.01",
			key: "yjnet6"
		}],
		["path", {
			d: "M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3",
			key: "ue9ozu"
		}],
		["path", {
			d: "M20 8.54V4a2 2 0 1 0-4 0v3",
			key: "49iql8"
		}],
		["path", {
			d: "M7.612 12.524a3 3 0 1 0-1.6 4.3",
			key: "1e33i0"
		}]
	]);
	const Radar = createLucideIcon("Radar", [
		["path", {
			d: "M19.07 4.93A10 10 0 0 0 6.99 3.34",
			key: "z3du51"
		}],
		["path", {
			d: "M4 6h.01",
			key: "oypzma"
		}],
		["path", {
			d: "M2.29 9.62A10 10 0 1 0 21.31 8.35",
			key: "qzzz0"
		}],
		["path", {
			d: "M16.24 7.76A6 6 0 1 0 8.23 16.67",
			key: "1yjesh"
		}],
		["path", {
			d: "M12 18h.01",
			key: "mhygvu"
		}],
		["path", {
			d: "M17.99 11.66A6 6 0 0 1 15.77 16.67",
			key: "1u2y91"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "2",
			key: "1c9p78"
		}],
		["path", {
			d: "m13.41 10.59 5.66-5.66",
			key: "mhq4k0"
		}]
	]);
	const Radiation = createLucideIcon("Radiation", [
		["path", {
			d: "M12 12h.01",
			key: "1mp3jc"
		}],
		["path", {
			d: "M7.5 4.2c-.3-.5-.9-.7-1.3-.4C3.9 5.5 2.3 8.1 2 11c-.1.5.4 1 1 1h5c0-1.5.8-2.8 2-3.4-1.1-1.9-2-3.5-2.5-4.4z",
			key: "wy49g3"
		}],
		["path", {
			d: "M21 12c.6 0 1-.4 1-1-.3-2.9-1.8-5.5-4.1-7.1-.4-.3-1.1-.2-1.3.3-.6.9-1.5 2.5-2.6 4.3 1.2.7 2 2 2 3.5h5z",
			key: "vklnvr"
		}],
		["path", {
			d: "M7.5 19.8c-.3.5-.1 1.1.4 1.3 2.6 1.2 5.6 1.2 8.2 0 .5-.2.7-.8.4-1.3-.5-.9-1.4-2.5-2.5-4.3-1.2.7-2.8.7-4 0-1.1 1.8-2 3.4-2.5 4.3z",
			key: "wkdf1o"
		}]
	]);
	const Radical = createLucideIcon("Radical", [["path", {
		d: "M3 12h3.28a1 1 0 0 1 .948.684l2.298 7.934a.5.5 0 0 0 .96-.044L13.82 4.771A1 1 0 0 1 14.792 4H21",
		key: "1mqj8i"
	}]]);
	const RadioReceiver = createLucideIcon("RadioReceiver", [
		["path", {
			d: "M5 16v2",
			key: "g5qcv5"
		}],
		["path", {
			d: "M19 16v2",
			key: "1gbaio"
		}],
		["rect", {
			width: "20",
			height: "8",
			x: "2",
			y: "8",
			rx: "2",
			key: "vjsjur"
		}],
		["path", {
			d: "M18 12h.01",
			key: "yjnet6"
		}]
	]);
	const RadioTower = createLucideIcon("RadioTower", [
		["path", {
			d: "M4.9 16.1C1 12.2 1 5.8 4.9 1.9",
			key: "s0qx1y"
		}],
		["path", {
			d: "M7.8 4.7a6.14 6.14 0 0 0-.8 7.5",
			key: "1idnkw"
		}],
		["circle", {
			cx: "12",
			cy: "9",
			r: "2",
			key: "1092wv"
		}],
		["path", {
			d: "M16.2 4.8c2 2 2.26 5.11.8 7.47",
			key: "ojru2q"
		}],
		["path", {
			d: "M19.1 1.9a9.96 9.96 0 0 1 0 14.1",
			key: "rhi7fg"
		}],
		["path", {
			d: "M9.5 18h5",
			key: "mfy3pd"
		}],
		["path", {
			d: "m8 22 4-11 4 11",
			key: "25yftu"
		}]
	]);
	const Radio = createLucideIcon("Radio", [
		["path", {
			d: "M4.9 19.1C1 15.2 1 8.8 4.9 4.9",
			key: "1vaf9d"
		}],
		["path", {
			d: "M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5",
			key: "u1ii0m"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "2",
			key: "1c9p78"
		}],
		["path", {
			d: "M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5",
			key: "1j5fej"
		}],
		["path", {
			d: "M19.1 4.9C23 8.8 23 15.1 19.1 19",
			key: "10b0cb"
		}]
	]);
	const Radius = createLucideIcon("Radius", [
		["path", {
			d: "M20.34 17.52a10 10 0 1 0-2.82 2.82",
			key: "fydyku"
		}],
		["circle", {
			cx: "19",
			cy: "19",
			r: "2",
			key: "17f5cg"
		}],
		["path", {
			d: "m13.41 13.41 4.18 4.18",
			key: "1gqbwc"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "2",
			key: "1c9p78"
		}]
	]);
	const RailSymbol = createLucideIcon("RailSymbol", [
		["path", {
			d: "M5 15h14",
			key: "m0yey3"
		}],
		["path", {
			d: "M5 9h14",
			key: "7tsvo6"
		}],
		["path", {
			d: "m14 20-5-5 6-6-5-5",
			key: "1jo42i"
		}]
	]);
	const Rainbow = createLucideIcon("Rainbow", [
		["path", {
			d: "M22 17a10 10 0 0 0-20 0",
			key: "ozegv"
		}],
		["path", {
			d: "M6 17a6 6 0 0 1 12 0",
			key: "5giftw"
		}],
		["path", {
			d: "M10 17a2 2 0 0 1 4 0",
			key: "gnsikk"
		}]
	]);
	const Rat = createLucideIcon("Rat", [
		["path", {
			d: "M17 5c0-1.7-1.3-3-3-3s-3 1.3-3 3c0 .8.3 1.5.8 2H11c-3.9 0-7 3.1-7 7c0 2.2 1.8 4 4 4",
			key: "1wq71c"
		}],
		["path", {
			d: "M16.8 3.9c.3-.3.6-.5 1-.7 1.5-.6 3.3.1 3.9 1.6.6 1.5-.1 3.3-1.6 3.9l1.6 2.8c.2.3.2.7.2 1-.2.8-.9 1.2-1.7 1.1 0 0-1.6-.3-2.7-.6H17c-1.7 0-3 1.3-3 3",
			key: "1crdmb"
		}],
		["path", {
			d: "M13.2 18a3 3 0 0 0-2.2-5",
			key: "1ol3lk"
		}],
		["path", {
			d: "M13 22H4a2 2 0 0 1 0-4h12",
			key: "bt3f23"
		}],
		["path", {
			d: "M16 9h.01",
			key: "1bdo4e"
		}]
	]);
	const Ratio = createLucideIcon("Ratio", [["rect", {
		width: "12",
		height: "20",
		x: "6",
		y: "2",
		rx: "2",
		key: "1oxtiu"
	}], ["rect", {
		width: "20",
		height: "12",
		x: "2",
		y: "6",
		rx: "2",
		key: "9lu3g6"
	}]]);
	const ReceiptCent = createLucideIcon("ReceiptCent", [
		["path", {
			d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
			key: "q3az6g"
		}],
		["path", {
			d: "M12 6.5v11",
			key: "ecfhkf"
		}],
		["path", {
			d: "M15 9.4a4 4 0 1 0 0 5.2",
			key: "1makmb"
		}]
	]);
	const ReceiptEuro = createLucideIcon("ReceiptEuro", [
		["path", {
			d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
			key: "q3az6g"
		}],
		["path", {
			d: "M8 12h5",
			key: "1g6qi8"
		}],
		["path", {
			d: "M16 9.5a4 4 0 1 0 0 5.2",
			key: "b2px4r"
		}]
	]);
	const ReceiptIndianRupee = createLucideIcon("ReceiptIndianRupee", [
		["path", {
			d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
			key: "q3az6g"
		}],
		["path", {
			d: "M8 7h8",
			key: "i86dvs"
		}],
		["path", {
			d: "M12 17.5 8 15h1a4 4 0 0 0 0-8",
			key: "grpkl4"
		}],
		["path", {
			d: "M8 11h8",
			key: "vwpz6n"
		}]
	]);
	const ReceiptJapaneseYen = createLucideIcon("ReceiptJapaneseYen", [
		["path", {
			d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
			key: "q3az6g"
		}],
		["path", {
			d: "m12 10 3-3",
			key: "1mc12w"
		}],
		["path", {
			d: "m9 7 3 3v7.5",
			key: "39i0xv"
		}],
		["path", {
			d: "M9 11h6",
			key: "1fldmi"
		}],
		["path", {
			d: "M9 15h6",
			key: "cctwl0"
		}]
	]);
	const ReceiptPoundSterling = createLucideIcon("ReceiptPoundSterling", [
		["path", {
			d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
			key: "q3az6g"
		}],
		["path", {
			d: "M8 13h5",
			key: "1k9z8w"
		}],
		["path", {
			d: "M10 17V9.5a2.5 2.5 0 0 1 5 0",
			key: "1dzgp0"
		}],
		["path", {
			d: "M8 17h7",
			key: "8mjdqu"
		}]
	]);
	const ReceiptRussianRuble = createLucideIcon("ReceiptRussianRuble", [
		["path", {
			d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
			key: "q3az6g"
		}],
		["path", {
			d: "M8 15h5",
			key: "vxg57a"
		}],
		["path", {
			d: "M8 11h5a2 2 0 1 0 0-4h-3v10",
			key: "1usi5u"
		}]
	]);
	const ReceiptSwissFranc = createLucideIcon("ReceiptSwissFranc", [
		["path", {
			d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
			key: "q3az6g"
		}],
		["path", {
			d: "M10 17V7h5",
			key: "k7jq18"
		}],
		["path", {
			d: "M10 11h4",
			key: "1i0mka"
		}],
		["path", {
			d: "M8 15h5",
			key: "vxg57a"
		}]
	]);
	const ReceiptText = createLucideIcon("ReceiptText", [
		["path", {
			d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
			key: "q3az6g"
		}],
		["path", {
			d: "M14 8H8",
			key: "1l3xfs"
		}],
		["path", {
			d: "M16 12H8",
			key: "1fr5h0"
		}],
		["path", {
			d: "M13 16H8",
			key: "wsln4y"
		}]
	]);
	const Receipt = createLucideIcon("Receipt", [
		["path", {
			d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
			key: "q3az6g"
		}],
		["path", {
			d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",
			key: "1h4pet"
		}],
		["path", {
			d: "M12 17.5v-11",
			key: "1jc1ny"
		}]
	]);
	const RectangleEllipsis = createLucideIcon("RectangleEllipsis", [
		["rect", {
			width: "20",
			height: "12",
			x: "2",
			y: "6",
			rx: "2",
			key: "9lu3g6"
		}],
		["path", {
			d: "M12 12h.01",
			key: "1mp3jc"
		}],
		["path", {
			d: "M17 12h.01",
			key: "1m0b6t"
		}],
		["path", {
			d: "M7 12h.01",
			key: "eqddd0"
		}]
	]);
	const RectangleHorizontal = createLucideIcon("RectangleHorizontal", [["rect", {
		width: "20",
		height: "12",
		x: "2",
		y: "6",
		rx: "2",
		key: "9lu3g6"
	}]]);
	const RectangleVertical = createLucideIcon("RectangleVertical", [["rect", {
		width: "12",
		height: "20",
		x: "6",
		y: "2",
		rx: "2",
		key: "1oxtiu"
	}]]);
	const Recycle = createLucideIcon("Recycle", [
		["path", {
			d: "M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5",
			key: "x6z5xu"
		}],
		["path", {
			d: "M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12",
			key: "1x4zh5"
		}],
		["path", {
			d: "m14 16-3 3 3 3",
			key: "f6jyew"
		}],
		["path", {
			d: "M8.293 13.596 7.196 9.5 3.1 10.598",
			key: "wf1obh"
		}],
		["path", {
			d: "m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843",
			key: "9tzpgr"
		}],
		["path", {
			d: "m13.378 9.633 4.096 1.098 1.097-4.096",
			key: "1oe83g"
		}]
	]);
	const Redo2 = createLucideIcon("Redo2", [["path", {
		d: "m15 14 5-5-5-5",
		key: "12vg1m"
	}], ["path", {
		d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
		key: "6uklza"
	}]]);
	const RedoDot = createLucideIcon("RedoDot", [
		["circle", {
			cx: "12",
			cy: "17",
			r: "1",
			key: "1ixnty"
		}],
		["path", {
			d: "M21 7v6h-6",
			key: "3ptur4"
		}],
		["path", {
			d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7",
			key: "1kgawr"
		}]
	]);
	const Redo = createLucideIcon("Redo", [["path", {
		d: "M21 7v6h-6",
		key: "3ptur4"
	}], ["path", {
		d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7",
		key: "1kgawr"
	}]]);
	const RefreshCcwDot = createLucideIcon("RefreshCcwDot", [
		["path", {
			d: "M3 2v6h6",
			key: "18ldww"
		}],
		["path", {
			d: "M21 12A9 9 0 0 0 6 5.3L3 8",
			key: "1pbrqz"
		}],
		["path", {
			d: "M21 22v-6h-6",
			key: "usdfbe"
		}],
		["path", {
			d: "M3 12a9 9 0 0 0 15 6.7l3-2.7",
			key: "1hosoe"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "1",
			key: "41hilf"
		}]
	]);
	const RefreshCcw = createLucideIcon("RefreshCcw", [
		["path", {
			d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
			key: "14sxne"
		}],
		["path", {
			d: "M3 3v5h5",
			key: "1xhq8a"
		}],
		["path", {
			d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",
			key: "1hlbsb"
		}],
		["path", {
			d: "M16 16h5v5",
			key: "ccwih5"
		}]
	]);
	const RefreshCwOff = createLucideIcon("RefreshCwOff", [
		["path", {
			d: "M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47",
			key: "1krf6h"
		}],
		["path", {
			d: "M8 16H3v5",
			key: "1cv678"
		}],
		["path", {
			d: "M3 12C3 9.51 4 7.26 5.64 5.64",
			key: "ruvoct"
		}],
		["path", {
			d: "m3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64",
			key: "19q130"
		}],
		["path", {
			d: "M21 12c0 1-.16 1.97-.47 2.87",
			key: "4w8emr"
		}],
		["path", {
			d: "M21 3v5h-5",
			key: "1q7to0"
		}],
		["path", {
			d: "M22 22 2 2",
			key: "1r8tn9"
		}]
	]);
	const RefreshCw = createLucideIcon("RefreshCw", [
		["path", {
			d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
			key: "v9h5vc"
		}],
		["path", {
			d: "M21 3v5h-5",
			key: "1q7to0"
		}],
		["path", {
			d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
			key: "3uifl3"
		}],
		["path", {
			d: "M8 16H3v5",
			key: "1cv678"
		}]
	]);
	const Refrigerator = createLucideIcon("Refrigerator", [
		["path", {
			d: "M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z",
			key: "fpq118"
		}],
		["path", {
			d: "M5 10h14",
			key: "elsbfy"
		}],
		["path", {
			d: "M15 7v6",
			key: "1nx30x"
		}]
	]);
	const Regex = createLucideIcon("Regex", [
		["path", {
			d: "M17 3v10",
			key: "15fgeh"
		}],
		["path", {
			d: "m12.67 5.5 8.66 5",
			key: "1gpheq"
		}],
		["path", {
			d: "m12.67 10.5 8.66-5",
			key: "1dkfa6"
		}],
		["path", {
			d: "M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z",
			key: "swwfx4"
		}]
	]);
	const RemoveFormatting = createLucideIcon("RemoveFormatting", [
		["path", {
			d: "M4 7V4h16v3",
			key: "9msm58"
		}],
		["path", {
			d: "M5 20h6",
			key: "1h6pxn"
		}],
		["path", {
			d: "M13 4 8 20",
			key: "kqq6aj"
		}],
		["path", {
			d: "m15 15 5 5",
			key: "me55sn"
		}],
		["path", {
			d: "m20 15-5 5",
			key: "11p7ol"
		}]
	]);
	const Repeat1 = createLucideIcon("Repeat1", [
		["path", {
			d: "m17 2 4 4-4 4",
			key: "nntrym"
		}],
		["path", {
			d: "M3 11v-1a4 4 0 0 1 4-4h14",
			key: "84bu3i"
		}],
		["path", {
			d: "m7 22-4-4 4-4",
			key: "1wqhfi"
		}],
		["path", {
			d: "M21 13v1a4 4 0 0 1-4 4H3",
			key: "1rx37r"
		}],
		["path", {
			d: "M11 10h1v4",
			key: "70cz1p"
		}]
	]);
	const Repeat2 = createLucideIcon("Repeat2", [
		["path", {
			d: "m2 9 3-3 3 3",
			key: "1ltn5i"
		}],
		["path", {
			d: "M13 18H7a2 2 0 0 1-2-2V6",
			key: "1r6tfw"
		}],
		["path", {
			d: "m22 15-3 3-3-3",
			key: "4rnwn2"
		}],
		["path", {
			d: "M11 6h6a2 2 0 0 1 2 2v10",
			key: "2f72bc"
		}]
	]);
	const Repeat = createLucideIcon("Repeat", [
		["path", {
			d: "m17 2 4 4-4 4",
			key: "nntrym"
		}],
		["path", {
			d: "M3 11v-1a4 4 0 0 1 4-4h14",
			key: "84bu3i"
		}],
		["path", {
			d: "m7 22-4-4 4-4",
			key: "1wqhfi"
		}],
		["path", {
			d: "M21 13v1a4 4 0 0 1-4 4H3",
			key: "1rx37r"
		}]
	]);
	const ReplaceAll = createLucideIcon("ReplaceAll", [
		["path", {
			d: "M14 14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2",
			key: "1yyzbs"
		}],
		["path", {
			d: "M14 4a2 2 0 0 1 2-2",
			key: "1w2hp7"
		}],
		["path", {
			d: "M16 10a2 2 0 0 1-2-2",
			key: "shjach"
		}],
		["path", {
			d: "M20 14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2",
			key: "zfj4xr"
		}],
		["path", {
			d: "M20 2a2 2 0 0 1 2 2",
			key: "188mtx"
		}],
		["path", {
			d: "M22 8a2 2 0 0 1-2 2",
			key: "ddf4tu"
		}],
		["path", {
			d: "m3 7 3 3 3-3",
			key: "x25e72"
		}],
		["path", {
			d: "M6 10V5a 3 3 0 0 1 3-3h1",
			key: "1ageje"
		}],
		["rect", {
			x: "2",
			y: "14",
			width: "8",
			height: "8",
			rx: "2",
			key: "4rksxw"
		}]
	]);
	const Replace = createLucideIcon("Replace", [
		["path", {
			d: "M14 4a2 2 0 0 1 2-2",
			key: "1w2hp7"
		}],
		["path", {
			d: "M16 10a2 2 0 0 1-2-2",
			key: "shjach"
		}],
		["path", {
			d: "M20 2a2 2 0 0 1 2 2",
			key: "188mtx"
		}],
		["path", {
			d: "M22 8a2 2 0 0 1-2 2",
			key: "ddf4tu"
		}],
		["path", {
			d: "m3 7 3 3 3-3",
			key: "x25e72"
		}],
		["path", {
			d: "M6 10V5a3 3 0 0 1 3-3h1",
			key: "3y3t5z"
		}],
		["rect", {
			x: "2",
			y: "14",
			width: "8",
			height: "8",
			rx: "2",
			key: "4rksxw"
		}]
	]);
	const ReplyAll = createLucideIcon("ReplyAll", [
		["polyline", {
			points: "7 17 2 12 7 7",
			key: "t83bqg"
		}],
		["polyline", {
			points: "12 17 7 12 12 7",
			key: "1g4ajm"
		}],
		["path", {
			d: "M22 18v-2a4 4 0 0 0-4-4H7",
			key: "1fcyog"
		}]
	]);
	const Reply = createLucideIcon("Reply", [["polyline", {
		points: "9 17 4 12 9 7",
		key: "hvgpf2"
	}], ["path", {
		d: "M20 18v-2a4 4 0 0 0-4-4H4",
		key: "5vmcpk"
	}]]);
	const Rewind = createLucideIcon("Rewind", [["polygon", {
		points: "11 19 2 12 11 5 11 19",
		key: "14yba5"
	}], ["polygon", {
		points: "22 19 13 12 22 5 22 19",
		key: "1pi1cj"
	}]]);
	const Ribbon = createLucideIcon("Ribbon", [
		["path", {
			d: "M12 11.22C11 9.997 10 9 10 8a2 2 0 0 1 4 0c0 1-.998 2.002-2.01 3.22",
			key: "1rnhq3"
		}],
		["path", {
			d: "m12 18 2.57-3.5",
			key: "116vt7"
		}],
		["path", {
			d: "M6.243 9.016a7 7 0 0 1 11.507-.009",
			key: "10dq0b"
		}],
		["path", {
			d: "M9.35 14.53 12 11.22",
			key: "tdsyp2"
		}],
		["path", {
			d: "M9.35 14.53C7.728 12.246 6 10.221 6 7a6 5 0 0 1 12 0c-.005 3.22-1.778 5.235-3.43 7.5l3.557 4.527a1 1 0 0 1-.203 1.43l-1.894 1.36a1 1 0 0 1-1.384-.215L12 18l-2.679 3.593a1 1 0 0 1-1.39.213l-1.865-1.353a1 1 0 0 1-.203-1.422z",
			key: "nmifey"
		}]
	]);
	const Rocket = createLucideIcon("Rocket", [
		["path", {
			d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
			key: "m3kijz"
		}],
		["path", {
			d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
			key: "1fmvmk"
		}],
		["path", {
			d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",
			key: "1f8sc4"
		}],
		["path", {
			d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
			key: "qeys4"
		}]
	]);
	const RockingChair = createLucideIcon("RockingChair", [
		["polyline", {
			points: "3.5 2 6.5 12.5 18 12.5",
			key: "y3iy52"
		}],
		["line", {
			x1: "9.5",
			x2: "5.5",
			y1: "12.5",
			y2: "20",
			key: "19vg5i"
		}],
		["line", {
			x1: "15",
			x2: "18.5",
			y1: "12.5",
			y2: "20",
			key: "1inpmv"
		}],
		["path", {
			d: "M2.75 18a13 13 0 0 0 18.5 0",
			key: "1nquas"
		}]
	]);
	const RollerCoaster = createLucideIcon("RollerCoaster", [
		["path", {
			d: "M6 19V5",
			key: "1r845m"
		}],
		["path", {
			d: "M10 19V6.8",
			key: "9j2tfs"
		}],
		["path", {
			d: "M14 19v-7.8",
			key: "10s8qv"
		}],
		["path", {
			d: "M18 5v4",
			key: "1tajlv"
		}],
		["path", {
			d: "M18 19v-6",
			key: "ielfq3"
		}],
		["path", {
			d: "M22 19V9",
			key: "158nzp"
		}],
		["path", {
			d: "M2 19V9a4 4 0 0 1 4-4c2 0 4 1.33 6 4s4 4 6 4a4 4 0 1 0-3-6.65",
			key: "1930oh"
		}]
	]);
	const Rotate3d = createLucideIcon("Rotate3d", [
		["path", {
			d: "M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2",
			key: "10n0gc"
		}],
		["path", {
			d: "m15.194 13.707 3.814 1.86-1.86 3.814",
			key: "16shm9"
		}],
		["path", {
			d: "M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4",
			key: "1lxi77"
		}]
	]);
	const RotateCcwSquare = createLucideIcon("RotateCcwSquare", [
		["path", {
			d: "M20 9V7a2 2 0 0 0-2-2h-6",
			key: "19z8uc"
		}],
		["path", {
			d: "m15 2-3 3 3 3",
			key: "177bxs"
		}],
		["path", {
			d: "M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2",
			key: "d36hnl"
		}]
	]);
	const RotateCcw$1 = createLucideIcon("RotateCcw", [["path", {
		d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
		key: "1357e3"
	}], ["path", {
		d: "M3 3v5h5",
		key: "1xhq8a"
	}]]);
	const RotateCwSquare = createLucideIcon("RotateCwSquare", [
		["path", {
			d: "M12 5H6a2 2 0 0 0-2 2v3",
			key: "l96uqu"
		}],
		["path", {
			d: "m9 8 3-3-3-3",
			key: "1gzgc3"
		}],
		["path", {
			d: "M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2",
			key: "1w2k5h"
		}]
	]);
	const RotateCw = createLucideIcon("RotateCw", [["path", {
		d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",
		key: "1p45f6"
	}], ["path", {
		d: "M21 3v5h-5",
		key: "1q7to0"
	}]]);
	const RouteOff = createLucideIcon("RouteOff", [
		["circle", {
			cx: "6",
			cy: "19",
			r: "3",
			key: "1kj8tv"
		}],
		["path", {
			d: "M9 19h8.5c.4 0 .9-.1 1.3-.2",
			key: "1effex"
		}],
		["path", {
			d: "M5.2 5.2A3.5 3.53 0 0 0 6.5 12H12",
			key: "k9y2ds"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M21 15.3a3.5 3.5 0 0 0-3.3-3.3",
			key: "11nlu2"
		}],
		["path", {
			d: "M15 5h-4.3",
			key: "6537je"
		}],
		["circle", {
			cx: "18",
			cy: "5",
			r: "3",
			key: "gq8acd"
		}]
	]);
	const Route = createLucideIcon("Route", [
		["circle", {
			cx: "6",
			cy: "19",
			r: "3",
			key: "1kj8tv"
		}],
		["path", {
			d: "M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15",
			key: "1d8sl"
		}],
		["circle", {
			cx: "18",
			cy: "5",
			r: "3",
			key: "gq8acd"
		}]
	]);
	const Router = createLucideIcon("Router", [
		["rect", {
			width: "20",
			height: "8",
			x: "2",
			y: "14",
			rx: "2",
			key: "w68u3i"
		}],
		["path", {
			d: "M6.01 18H6",
			key: "19vcac"
		}],
		["path", {
			d: "M10.01 18H10",
			key: "uamcmx"
		}],
		["path", {
			d: "M15 10v4",
			key: "qjz1xs"
		}],
		["path", {
			d: "M17.84 7.17a4 4 0 0 0-5.66 0",
			key: "1rif40"
		}],
		["path", {
			d: "M20.66 4.34a8 8 0 0 0-11.31 0",
			key: "6a5xfq"
		}]
	]);
	const Rows2 = createLucideIcon("Rows2", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "M3 12h18",
		key: "1i2n21"
	}]]);
	const Rows3 = createLucideIcon("Rows3", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M21 9H3",
			key: "1338ky"
		}],
		["path", {
			d: "M21 15H3",
			key: "9uk58r"
		}]
	]);
	const Rows4 = createLucideIcon("Rows4", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M21 7.5H3",
			key: "1hm9pq"
		}],
		["path", {
			d: "M21 12H3",
			key: "2avoz0"
		}],
		["path", {
			d: "M21 16.5H3",
			key: "n7jzkj"
		}]
	]);
	const Rss = createLucideIcon("Rss", [
		["path", {
			d: "M4 11a9 9 0 0 1 9 9",
			key: "pv89mb"
		}],
		["path", {
			d: "M4 4a16 16 0 0 1 16 16",
			key: "k0647b"
		}],
		["circle", {
			cx: "5",
			cy: "19",
			r: "1",
			key: "bfqh0e"
		}]
	]);
	const Ruler = createLucideIcon("Ruler", [
		["path", {
			d: "M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z",
			key: "icamh8"
		}],
		["path", {
			d: "m14.5 12.5 2-2",
			key: "inckbg"
		}],
		["path", {
			d: "m11.5 9.5 2-2",
			key: "fmmyf7"
		}],
		["path", {
			d: "m8.5 6.5 2-2",
			key: "vc6u1g"
		}],
		["path", {
			d: "m17.5 15.5 2-2",
			key: "wo5hmg"
		}]
	]);
	const RussianRuble = createLucideIcon("RussianRuble", [["path", {
		d: "M6 11h8a4 4 0 0 0 0-8H9v18",
		key: "18ai8t"
	}], ["path", {
		d: "M6 15h8",
		key: "1y8f6l"
	}]]);
	const Sailboat = createLucideIcon("Sailboat", [
		["path", {
			d: "M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z",
			key: "1404fh"
		}],
		["path", {
			d: "M21 14 10 2 3 14h18Z",
			key: "1nzg7v"
		}],
		["path", {
			d: "M10 2v16",
			key: "1labyt"
		}]
	]);
	const Salad = createLucideIcon("Salad", [
		["path", {
			d: "M7 21h10",
			key: "1b0cd5"
		}],
		["path", {
			d: "M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z",
			key: "4rw317"
		}],
		["path", {
			d: "M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1",
			key: "10xrj0"
		}],
		["path", {
			d: "m13 12 4-4",
			key: "1hckqy"
		}],
		["path", {
			d: "M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2",
			key: "1p4srx"
		}]
	]);
	const Sandwich = createLucideIcon("Sandwich", [
		["path", {
			d: "m2.37 11.223 8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777",
			key: "f1wd0e"
		}],
		["path", {
			d: "M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25",
			key: "1pfu07"
		}],
		["path", {
			d: "M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9",
			key: "1oq9qw"
		}],
		["path", {
			d: "m6.67 15 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2",
			key: "1fnwu5"
		}],
		["rect", {
			width: "20",
			height: "4",
			x: "2",
			y: "11",
			rx: "1",
			key: "itshg"
		}]
	]);
	const SatelliteDish = createLucideIcon("SatelliteDish", [
		["path", {
			d: "M4 10a7.31 7.31 0 0 0 10 10Z",
			key: "1fzpp3"
		}],
		["path", {
			d: "m9 15 3-3",
			key: "88sc13"
		}],
		["path", {
			d: "M17 13a6 6 0 0 0-6-6",
			key: "15cc6u"
		}],
		["path", {
			d: "M21 13A10 10 0 0 0 11 3",
			key: "11nf8s"
		}]
	]);
	const Satellite = createLucideIcon("Satellite", [
		["path", {
			d: "M13 7 9 3 5 7l4 4",
			key: "vyckw6"
		}],
		["path", {
			d: "m17 11 4 4-4 4-4-4",
			key: "rchckc"
		}],
		["path", {
			d: "m8 12 4 4 6-6-4-4Z",
			key: "1sshf7"
		}],
		["path", {
			d: "m16 8 3-3",
			key: "x428zp"
		}],
		["path", {
			d: "M9 21a6 6 0 0 0-6-6",
			key: "1iajcf"
		}]
	]);
	const SaveAll = createLucideIcon("SaveAll", [
		["path", {
			d: "M10 2v3a1 1 0 0 0 1 1h5",
			key: "1xspal"
		}],
		["path", {
			d: "M18 18v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6",
			key: "1ra60u"
		}],
		["path", {
			d: "M18 22H4a2 2 0 0 1-2-2V6",
			key: "pblm9e"
		}],
		["path", {
			d: "M8 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 22 6.828V16a2 2 0 0 1-2.01 2z",
			key: "1yve0x"
		}]
	]);
	const SaveOff = createLucideIcon("SaveOff", [
		["path", {
			d: "M13 13H8a1 1 0 0 0-1 1v7",
			key: "h8g396"
		}],
		["path", {
			d: "M14 8h1",
			key: "1lfen6"
		}],
		["path", {
			d: "M17 21v-4",
			key: "1yknxs"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M20.41 20.41A2 2 0 0 1 19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 .59-1.41",
			key: "1t4vdl"
		}],
		["path", {
			d: "M29.5 11.5s5 5 4 5",
			key: "zzn4i6"
		}],
		["path", {
			d: "M9 3h6.2a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V15",
			key: "24cby9"
		}]
	]);
	const Save = createLucideIcon("Save", [
		["path", {
			d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
			key: "1c8476"
		}],
		["path", {
			d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
			key: "1ydtos"
		}],
		["path", {
			d: "M7 3v4a1 1 0 0 0 1 1h7",
			key: "t51u73"
		}]
	]);
	const Scale3d = createLucideIcon("Scale3d", [
		["path", {
			d: "M5 7v11a1 1 0 0 0 1 1h11",
			key: "13dt1j"
		}],
		["path", {
			d: "M5.293 18.707 11 13",
			key: "ezgbsx"
		}],
		["circle", {
			cx: "19",
			cy: "19",
			r: "2",
			key: "17f5cg"
		}],
		["circle", {
			cx: "5",
			cy: "5",
			r: "2",
			key: "1gwv83"
		}]
	]);
	const Scale = createLucideIcon("Scale", [
		["path", {
			d: "m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",
			key: "7g6ntu"
		}],
		["path", {
			d: "m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",
			key: "ijws7r"
		}],
		["path", {
			d: "M7 21h10",
			key: "1b0cd5"
		}],
		["path", {
			d: "M12 3v18",
			key: "108xh3"
		}],
		["path", {
			d: "M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2",
			key: "3gwbw2"
		}]
	]);
	const Scaling = createLucideIcon("Scaling", [
		["path", {
			d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
			key: "1m0v6g"
		}],
		["path", {
			d: "M14 15H9v-5",
			key: "pi4jk9"
		}],
		["path", {
			d: "M16 3h5v5",
			key: "1806ms"
		}],
		["path", {
			d: "M21 3 9 15",
			key: "15kdhq"
		}]
	]);
	const ScanBarcode = createLucideIcon("ScanBarcode", [
		["path", {
			d: "M3 7V5a2 2 0 0 1 2-2h2",
			key: "aa7l1z"
		}],
		["path", {
			d: "M17 3h2a2 2 0 0 1 2 2v2",
			key: "4qcy5o"
		}],
		["path", {
			d: "M21 17v2a2 2 0 0 1-2 2h-2",
			key: "6vwrx8"
		}],
		["path", {
			d: "M7 21H5a2 2 0 0 1-2-2v-2",
			key: "ioqczr"
		}],
		["path", {
			d: "M8 7v10",
			key: "23sfjj"
		}],
		["path", {
			d: "M12 7v10",
			key: "jspqdw"
		}],
		["path", {
			d: "M17 7v10",
			key: "578dap"
		}]
	]);
	const ScanEye = createLucideIcon("ScanEye", [
		["path", {
			d: "M3 7V5a2 2 0 0 1 2-2h2",
			key: "aa7l1z"
		}],
		["path", {
			d: "M17 3h2a2 2 0 0 1 2 2v2",
			key: "4qcy5o"
		}],
		["path", {
			d: "M21 17v2a2 2 0 0 1-2 2h-2",
			key: "6vwrx8"
		}],
		["path", {
			d: "M7 21H5a2 2 0 0 1-2-2v-2",
			key: "ioqczr"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "1",
			key: "41hilf"
		}],
		["path", {
			d: "M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0",
			key: "11ak4c"
		}]
	]);
	const ScanFace = createLucideIcon("ScanFace", [
		["path", {
			d: "M3 7V5a2 2 0 0 1 2-2h2",
			key: "aa7l1z"
		}],
		["path", {
			d: "M17 3h2a2 2 0 0 1 2 2v2",
			key: "4qcy5o"
		}],
		["path", {
			d: "M21 17v2a2 2 0 0 1-2 2h-2",
			key: "6vwrx8"
		}],
		["path", {
			d: "M7 21H5a2 2 0 0 1-2-2v-2",
			key: "ioqczr"
		}],
		["path", {
			d: "M8 14s1.5 2 4 2 4-2 4-2",
			key: "1y1vjs"
		}],
		["path", {
			d: "M9 9h.01",
			key: "1q5me6"
		}],
		["path", {
			d: "M15 9h.01",
			key: "x1ddxp"
		}]
	]);
	const ScanHeart = createLucideIcon("ScanHeart", [
		["path", {
			d: "M11.246 16.657a1 1 0 0 0 1.508 0l3.57-4.101A2.75 2.75 0 1 0 12 9.168a2.75 2.75 0 1 0-4.324 3.388z",
			key: "1algrk"
		}],
		["path", {
			d: "M17 3h2a2 2 0 0 1 2 2v2",
			key: "4qcy5o"
		}],
		["path", {
			d: "M21 17v2a2 2 0 0 1-2 2h-2",
			key: "6vwrx8"
		}],
		["path", {
			d: "M3 7V5a2 2 0 0 1 2-2h2",
			key: "aa7l1z"
		}],
		["path", {
			d: "M7 21H5a2 2 0 0 1-2-2v-2",
			key: "ioqczr"
		}]
	]);
	const ScanLine = createLucideIcon("ScanLine", [
		["path", {
			d: "M3 7V5a2 2 0 0 1 2-2h2",
			key: "aa7l1z"
		}],
		["path", {
			d: "M17 3h2a2 2 0 0 1 2 2v2",
			key: "4qcy5o"
		}],
		["path", {
			d: "M21 17v2a2 2 0 0 1-2 2h-2",
			key: "6vwrx8"
		}],
		["path", {
			d: "M7 21H5a2 2 0 0 1-2-2v-2",
			key: "ioqczr"
		}],
		["path", {
			d: "M7 12h10",
			key: "b7w52i"
		}]
	]);
	const ScanQrCode = createLucideIcon("ScanQrCode", [
		["path", {
			d: "M17 12v4a1 1 0 0 1-1 1h-4",
			key: "uk4fdo"
		}],
		["path", {
			d: "M17 3h2a2 2 0 0 1 2 2v2",
			key: "4qcy5o"
		}],
		["path", {
			d: "M17 8V7",
			key: "q2g9wo"
		}],
		["path", {
			d: "M21 17v2a2 2 0 0 1-2 2h-2",
			key: "6vwrx8"
		}],
		["path", {
			d: "M3 7V5a2 2 0 0 1 2-2h2",
			key: "aa7l1z"
		}],
		["path", {
			d: "M7 17h.01",
			key: "19xn7k"
		}],
		["path", {
			d: "M7 21H5a2 2 0 0 1-2-2v-2",
			key: "ioqczr"
		}],
		["rect", {
			x: "7",
			y: "7",
			width: "5",
			height: "5",
			rx: "1",
			key: "m9kyts"
		}]
	]);
	const ScanSearch = createLucideIcon("ScanSearch", [
		["path", {
			d: "M3 7V5a2 2 0 0 1 2-2h2",
			key: "aa7l1z"
		}],
		["path", {
			d: "M17 3h2a2 2 0 0 1 2 2v2",
			key: "4qcy5o"
		}],
		["path", {
			d: "M21 17v2a2 2 0 0 1-2 2h-2",
			key: "6vwrx8"
		}],
		["path", {
			d: "M7 21H5a2 2 0 0 1-2-2v-2",
			key: "ioqczr"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "3",
			key: "1v7zrd"
		}],
		["path", {
			d: "m16 16-1.9-1.9",
			key: "1dq9hf"
		}]
	]);
	const ScanText = createLucideIcon("ScanText", [
		["path", {
			d: "M3 7V5a2 2 0 0 1 2-2h2",
			key: "aa7l1z"
		}],
		["path", {
			d: "M17 3h2a2 2 0 0 1 2 2v2",
			key: "4qcy5o"
		}],
		["path", {
			d: "M21 17v2a2 2 0 0 1-2 2h-2",
			key: "6vwrx8"
		}],
		["path", {
			d: "M7 21H5a2 2 0 0 1-2-2v-2",
			key: "ioqczr"
		}],
		["path", {
			d: "M7 8h8",
			key: "1jbsf9"
		}],
		["path", {
			d: "M7 12h10",
			key: "b7w52i"
		}],
		["path", {
			d: "M7 16h6",
			key: "1vyc9m"
		}]
	]);
	const Scan = createLucideIcon("Scan", [
		["path", {
			d: "M3 7V5a2 2 0 0 1 2-2h2",
			key: "aa7l1z"
		}],
		["path", {
			d: "M17 3h2a2 2 0 0 1 2 2v2",
			key: "4qcy5o"
		}],
		["path", {
			d: "M21 17v2a2 2 0 0 1-2 2h-2",
			key: "6vwrx8"
		}],
		["path", {
			d: "M7 21H5a2 2 0 0 1-2-2v-2",
			key: "ioqczr"
		}]
	]);
	const School = createLucideIcon("School", [
		["path", {
			d: "M14 22v-4a2 2 0 1 0-4 0v4",
			key: "hhkicm"
		}],
		["path", {
			d: "m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10",
			key: "1xqip1"
		}],
		["path", {
			d: "M18 5v17",
			key: "1sw6gf"
		}],
		["path", {
			d: "m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6",
			key: "9d2mlk"
		}],
		["path", {
			d: "M6 5v17",
			key: "1xfsm0"
		}],
		["circle", {
			cx: "12",
			cy: "9",
			r: "2",
			key: "1092wv"
		}]
	]);
	const ScissorsLineDashed = createLucideIcon("ScissorsLineDashed", [
		["path", {
			d: "M5.42 9.42 8 12",
			key: "12pkuq"
		}],
		["circle", {
			cx: "4",
			cy: "8",
			r: "2",
			key: "107mxr"
		}],
		["path", {
			d: "m14 6-8.58 8.58",
			key: "gvzu5l"
		}],
		["circle", {
			cx: "4",
			cy: "16",
			r: "2",
			key: "1ehqvc"
		}],
		["path", {
			d: "M10.8 14.8 14 18",
			key: "ax7m9r"
		}],
		["path", {
			d: "M16 12h-2",
			key: "10asgb"
		}],
		["path", {
			d: "M22 12h-2",
			key: "14jgyd"
		}]
	]);
	const Scissors = createLucideIcon("Scissors", [
		["circle", {
			cx: "6",
			cy: "6",
			r: "3",
			key: "1lh9wr"
		}],
		["path", {
			d: "M8.12 8.12 12 12",
			key: "1alkpv"
		}],
		["path", {
			d: "M20 4 8.12 15.88",
			key: "xgtan2"
		}],
		["circle", {
			cx: "6",
			cy: "18",
			r: "3",
			key: "fqmcym"
		}],
		["path", {
			d: "M14.8 14.8 20 20",
			key: "ptml3r"
		}]
	]);
	const ScreenShareOff = createLucideIcon("ScreenShareOff", [
		["path", {
			d: "M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3",
			key: "i8wdob"
		}],
		["path", {
			d: "M8 21h8",
			key: "1ev6f3"
		}],
		["path", {
			d: "M12 17v4",
			key: "1riwvh"
		}],
		["path", {
			d: "m22 3-5 5",
			key: "12jva0"
		}],
		["path", {
			d: "m17 3 5 5",
			key: "k36vhe"
		}]
	]);
	const ScreenShare = createLucideIcon("ScreenShare", [
		["path", {
			d: "M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3",
			key: "i8wdob"
		}],
		["path", {
			d: "M8 21h8",
			key: "1ev6f3"
		}],
		["path", {
			d: "M12 17v4",
			key: "1riwvh"
		}],
		["path", {
			d: "m17 8 5-5",
			key: "fqif7o"
		}],
		["path", {
			d: "M17 3h5v5",
			key: "1o3tu8"
		}]
	]);
	const ScrollText = createLucideIcon("ScrollText", [
		["path", {
			d: "M15 12h-5",
			key: "r7krc0"
		}],
		["path", {
			d: "M15 8h-5",
			key: "1khuty"
		}],
		["path", {
			d: "M19 17V5a2 2 0 0 0-2-2H4",
			key: "zz82l3"
		}],
		["path", {
			d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
			key: "1ph1d7"
		}]
	]);
	const Scroll = createLucideIcon("Scroll", [["path", {
		d: "M19 17V5a2 2 0 0 0-2-2H4",
		key: "zz82l3"
	}], ["path", {
		d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
		key: "1ph1d7"
	}]]);
	const SearchCheck = createLucideIcon("SearchCheck", [
		["path", {
			d: "m8 11 2 2 4-4",
			key: "1sed1v"
		}],
		["circle", {
			cx: "11",
			cy: "11",
			r: "8",
			key: "4ej97u"
		}],
		["path", {
			d: "m21 21-4.3-4.3",
			key: "1qie3q"
		}]
	]);
	const SearchCode = createLucideIcon("SearchCode", [
		["path", {
			d: "m13 13.5 2-2.5-2-2.5",
			key: "1rvxrh"
		}],
		["path", {
			d: "m21 21-4.3-4.3",
			key: "1qie3q"
		}],
		["path", {
			d: "M9 8.5 7 11l2 2.5",
			key: "6ffwbx"
		}],
		["circle", {
			cx: "11",
			cy: "11",
			r: "8",
			key: "4ej97u"
		}]
	]);
	const SearchSlash = createLucideIcon("SearchSlash", [
		["path", {
			d: "m13.5 8.5-5 5",
			key: "1cs55j"
		}],
		["circle", {
			cx: "11",
			cy: "11",
			r: "8",
			key: "4ej97u"
		}],
		["path", {
			d: "m21 21-4.3-4.3",
			key: "1qie3q"
		}]
	]);
	const SearchX = createLucideIcon("SearchX", [
		["path", {
			d: "m13.5 8.5-5 5",
			key: "1cs55j"
		}],
		["path", {
			d: "m8.5 8.5 5 5",
			key: "a8mexj"
		}],
		["circle", {
			cx: "11",
			cy: "11",
			r: "8",
			key: "4ej97u"
		}],
		["path", {
			d: "m21 21-4.3-4.3",
			key: "1qie3q"
		}]
	]);
	const Search = createLucideIcon("Search", [["circle", {
		cx: "11",
		cy: "11",
		r: "8",
		key: "4ej97u"
	}], ["path", {
		d: "m21 21-4.3-4.3",
		key: "1qie3q"
	}]]);
	const Section = createLucideIcon("Section", [["path", {
		d: "M16 5a4 3 0 0 0-8 0c0 4 8 3 8 7a4 3 0 0 1-8 0",
		key: "vqan6v"
	}], ["path", {
		d: "M8 19a4 3 0 0 0 8 0c0-4-8-3-8-7a4 3 0 0 1 8 0",
		key: "wdjd8o"
	}]]);
	const SendHorizontal = createLucideIcon("SendHorizontal", [["path", {
		d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z",
		key: "117uat"
	}], ["path", {
		d: "M6 12h16",
		key: "s4cdu5"
	}]]);
	const SendToBack = createLucideIcon("SendToBack", [
		["rect", {
			x: "14",
			y: "14",
			width: "8",
			height: "8",
			rx: "2",
			key: "1b0bso"
		}],
		["rect", {
			x: "2",
			y: "2",
			width: "8",
			height: "8",
			rx: "2",
			key: "1x09vl"
		}],
		["path", {
			d: "M7 14v1a2 2 0 0 0 2 2h1",
			key: "pao6x6"
		}],
		["path", {
			d: "M14 7h1a2 2 0 0 1 2 2v1",
			key: "19tdru"
		}]
	]);
	const Send = createLucideIcon("Send", [["path", {
		d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
		key: "1ffxy3"
	}], ["path", {
		d: "m21.854 2.147-10.94 10.939",
		key: "12cjpa"
	}]]);
	const SeparatorHorizontal = createLucideIcon("SeparatorHorizontal", [
		["line", {
			x1: "3",
			x2: "21",
			y1: "12",
			y2: "12",
			key: "10d38w"
		}],
		["polyline", {
			points: "8 8 12 4 16 8",
			key: "zo8t4w"
		}],
		["polyline", {
			points: "16 16 12 20 8 16",
			key: "1oyrid"
		}]
	]);
	const SeparatorVertical = createLucideIcon("SeparatorVertical", [
		["line", {
			x1: "12",
			x2: "12",
			y1: "3",
			y2: "21",
			key: "1efggb"
		}],
		["polyline", {
			points: "8 8 4 12 8 16",
			key: "bnfmv4"
		}],
		["polyline", {
			points: "16 16 20 12 16 8",
			key: "u90052"
		}]
	]);
	const ServerCog = createLucideIcon("ServerCog", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "3",
			key: "1v7zrd"
		}],
		["path", {
			d: "M4.5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-.5",
			key: "tn8das"
		}],
		["path", {
			d: "M4.5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.5",
			key: "1g2pve"
		}],
		["path", {
			d: "M6 6h.01",
			key: "1utrut"
		}],
		["path", {
			d: "M6 18h.01",
			key: "uhywen"
		}],
		["path", {
			d: "m15.7 13.4-.9-.3",
			key: "1jwmzr"
		}],
		["path", {
			d: "m9.2 10.9-.9-.3",
			key: "qapnim"
		}],
		["path", {
			d: "m10.6 15.7.3-.9",
			key: "quwk0k"
		}],
		["path", {
			d: "m13.6 15.7-.4-1",
			key: "cb9xp7"
		}],
		["path", {
			d: "m10.8 9.3-.4-1",
			key: "1uaiz5"
		}],
		["path", {
			d: "m8.3 13.6 1-.4",
			key: "s6srou"
		}],
		["path", {
			d: "m14.7 10.8 1-.4",
			key: "4d31cq"
		}],
		["path", {
			d: "m13.4 8.3-.3.9",
			key: "1bm987"
		}]
	]);
	const ServerCrash = createLucideIcon("ServerCrash", [
		["path", {
			d: "M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2",
			key: "4b9dqc"
		}],
		["path", {
			d: "M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2",
			key: "22nnkd"
		}],
		["path", {
			d: "M6 6h.01",
			key: "1utrut"
		}],
		["path", {
			d: "M6 18h.01",
			key: "uhywen"
		}],
		["path", {
			d: "m13 6-4 6h6l-4 6",
			key: "14hqih"
		}]
	]);
	const ServerOff = createLucideIcon("ServerOff", [
		["path", {
			d: "M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5",
			key: "bt2siv"
		}],
		["path", {
			d: "M10 10 2.5 2.5C2 2 2 2.5 2 5v3a2 2 0 0 0 2 2h6z",
			key: "1hjrv1"
		}],
		["path", {
			d: "M22 17v-1a2 2 0 0 0-2-2h-1",
			key: "1iynyr"
		}],
		["path", {
			d: "M4 14a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16.5l1-.5.5.5-8-8H4z",
			key: "161ggg"
		}],
		["path", {
			d: "M6 18h.01",
			key: "uhywen"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]);
	const Server = createLucideIcon("Server", [
		["rect", {
			width: "20",
			height: "8",
			x: "2",
			y: "2",
			rx: "2",
			ry: "2",
			key: "ngkwjq"
		}],
		["rect", {
			width: "20",
			height: "8",
			x: "2",
			y: "14",
			rx: "2",
			ry: "2",
			key: "iecqi9"
		}],
		["line", {
			x1: "6",
			x2: "6.01",
			y1: "6",
			y2: "6",
			key: "16zg32"
		}],
		["line", {
			x1: "6",
			x2: "6.01",
			y1: "18",
			y2: "18",
			key: "nzw8ys"
		}]
	]);
	const Settings2 = createLucideIcon("Settings2", [
		["path", {
			d: "M20 7h-9",
			key: "3s1dr2"
		}],
		["path", {
			d: "M14 17H5",
			key: "gfn3mx"
		}],
		["circle", {
			cx: "17",
			cy: "17",
			r: "3",
			key: "18b49y"
		}],
		["circle", {
			cx: "7",
			cy: "7",
			r: "3",
			key: "dfmy0x"
		}]
	]);
	const Settings = createLucideIcon("Settings", [["path", {
		d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
		key: "1qme2f"
	}], ["circle", {
		cx: "12",
		cy: "12",
		r: "3",
		key: "1v7zrd"
	}]]);
	const Shapes = createLucideIcon("Shapes", [
		["path", {
			d: "M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z",
			key: "1bo67w"
		}],
		["rect", {
			x: "3",
			y: "14",
			width: "7",
			height: "7",
			rx: "1",
			key: "1bkyp8"
		}],
		["circle", {
			cx: "17.5",
			cy: "17.5",
			r: "3.5",
			key: "w3z12y"
		}]
	]);
	const Share2 = createLucideIcon("Share2", [
		["circle", {
			cx: "18",
			cy: "5",
			r: "3",
			key: "gq8acd"
		}],
		["circle", {
			cx: "6",
			cy: "12",
			r: "3",
			key: "w7nqdw"
		}],
		["circle", {
			cx: "18",
			cy: "19",
			r: "3",
			key: "1xt0gg"
		}],
		["line", {
			x1: "8.59",
			x2: "15.42",
			y1: "13.51",
			y2: "17.49",
			key: "47mynk"
		}],
		["line", {
			x1: "15.41",
			x2: "8.59",
			y1: "6.51",
			y2: "10.49",
			key: "1n3mei"
		}]
	]);
	const Share = createLucideIcon("Share", [
		["path", {
			d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",
			key: "1b2hhj"
		}],
		["polyline", {
			points: "16 6 12 2 8 6",
			key: "m901s6"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "2",
			y2: "15",
			key: "1p0rca"
		}]
	]);
	const Sheet = createLucideIcon("Sheet", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			ry: "2",
			key: "1m3agn"
		}],
		["line", {
			x1: "3",
			x2: "21",
			y1: "9",
			y2: "9",
			key: "1vqk6q"
		}],
		["line", {
			x1: "3",
			x2: "21",
			y1: "15",
			y2: "15",
			key: "o2sbyz"
		}],
		["line", {
			x1: "9",
			x2: "9",
			y1: "9",
			y2: "21",
			key: "1ib60c"
		}],
		["line", {
			x1: "15",
			x2: "15",
			y1: "9",
			y2: "21",
			key: "1n26ft"
		}]
	]);
	const Shell = createLucideIcon("Shell", [["path", {
		d: "M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44",
		key: "1cn552"
	}]]);
	const ShieldAlert = createLucideIcon("ShieldAlert", [
		["path", {
			d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
			key: "oel41y"
		}],
		["path", {
			d: "M12 8v4",
			key: "1got3b"
		}],
		["path", {
			d: "M12 16h.01",
			key: "1drbdi"
		}]
	]);
	const ShieldBan = createLucideIcon("ShieldBan", [["path", {
		d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
		key: "oel41y"
	}], ["path", {
		d: "m4.243 5.21 14.39 12.472",
		key: "1c9a7c"
	}]]);
	const ShieldCheck = createLucideIcon("ShieldCheck", [["path", {
		d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
		key: "oel41y"
	}], ["path", {
		d: "m9 12 2 2 4-4",
		key: "dzmm74"
	}]]);
	const ShieldEllipsis = createLucideIcon("ShieldEllipsis", [
		["path", {
			d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
			key: "oel41y"
		}],
		["path", {
			d: "M8 12h.01",
			key: "czm47f"
		}],
		["path", {
			d: "M12 12h.01",
			key: "1mp3jc"
		}],
		["path", {
			d: "M16 12h.01",
			key: "1l6xoz"
		}]
	]);
	const ShieldHalf = createLucideIcon("ShieldHalf", [["path", {
		d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
		key: "oel41y"
	}], ["path", {
		d: "M12 22V2",
		key: "zs6s6o"
	}]]);
	const ShieldMinus = createLucideIcon("ShieldMinus", [["path", {
		d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
		key: "oel41y"
	}], ["path", {
		d: "M9 12h6",
		key: "1c52cq"
	}]]);
	const ShieldOff = createLucideIcon("ShieldOff", [
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",
			key: "1jlk70"
		}],
		["path", {
			d: "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",
			key: "18rp1v"
		}]
	]);
	const ShieldPlus = createLucideIcon("ShieldPlus", [
		["path", {
			d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
			key: "oel41y"
		}],
		["path", {
			d: "M9 12h6",
			key: "1c52cq"
		}],
		["path", {
			d: "M12 9v6",
			key: "199k2o"
		}]
	]);
	const ShieldQuestion = createLucideIcon("ShieldQuestion", [
		["path", {
			d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
			key: "oel41y"
		}],
		["path", {
			d: "M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3",
			key: "mhlwft"
		}],
		["path", {
			d: "M12 17h.01",
			key: "p32p05"
		}]
	]);
	const ShieldX = createLucideIcon("ShieldX", [
		["path", {
			d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
			key: "oel41y"
		}],
		["path", {
			d: "m14.5 9.5-5 5",
			key: "17q4r4"
		}],
		["path", {
			d: "m9.5 9.5 5 5",
			key: "18nt4w"
		}]
	]);
	const Shield = createLucideIcon("Shield", [["path", {
		d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
		key: "oel41y"
	}]]);
	const ShipWheel = createLucideIcon("ShipWheel", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "8",
			key: "46899m"
		}],
		["path", {
			d: "M12 2v7.5",
			key: "1e5rl5"
		}],
		["path", {
			d: "m19 5-5.23 5.23",
			key: "1ezxxf"
		}],
		["path", {
			d: "M22 12h-7.5",
			key: "le1719"
		}],
		["path", {
			d: "m19 19-5.23-5.23",
			key: "p3fmgn"
		}],
		["path", {
			d: "M12 14.5V22",
			key: "dgcmos"
		}],
		["path", {
			d: "M10.23 13.77 5 19",
			key: "qwopd4"
		}],
		["path", {
			d: "M9.5 12H2",
			key: "r7bup8"
		}],
		["path", {
			d: "M10.23 10.23 5 5",
			key: "k2y7lj"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "2.5",
			key: "ix0uyj"
		}]
	]);
	const Ship = createLucideIcon("Ship", [
		["path", {
			d: "M12 10.189V14",
			key: "1p8cqu"
		}],
		["path", {
			d: "M12 2v3",
			key: "qbqxhf"
		}],
		["path", {
			d: "M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6",
			key: "qpkstq"
		}],
		["path", {
			d: "M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76",
			key: "7tigtc"
		}],
		["path", {
			d: "M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
			key: "1924j5"
		}]
	]);
	const Shirt = createLucideIcon("Shirt", [["path", {
		d: "M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z",
		key: "1wgbhj"
	}]]);
	const ShoppingBag = createLucideIcon("ShoppingBag", [
		["path", {
			d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",
			key: "hou9p0"
		}],
		["path", {
			d: "M3 6h18",
			key: "d0wm0j"
		}],
		["path", {
			d: "M16 10a4 4 0 0 1-8 0",
			key: "1ltviw"
		}]
	]);
	const ShoppingBasket = createLucideIcon("ShoppingBasket", [
		["path", {
			d: "m15 11-1 9",
			key: "5wnq3a"
		}],
		["path", {
			d: "m19 11-4-7",
			key: "cnml18"
		}],
		["path", {
			d: "M2 11h20",
			key: "3eubbj"
		}],
		["path", {
			d: "m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4",
			key: "yiazzp"
		}],
		["path", {
			d: "M4.5 15.5h15",
			key: "13mye1"
		}],
		["path", {
			d: "m5 11 4-7",
			key: "116ra9"
		}],
		["path", {
			d: "m9 11 1 9",
			key: "1ojof7"
		}]
	]);
	const ShoppingCart = createLucideIcon("ShoppingCart", [
		["circle", {
			cx: "8",
			cy: "21",
			r: "1",
			key: "jimo8o"
		}],
		["circle", {
			cx: "19",
			cy: "21",
			r: "1",
			key: "13723u"
		}],
		["path", {
			d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
			key: "9zh506"
		}]
	]);
	const Shovel = createLucideIcon("Shovel", [
		["path", {
			d: "M2 22v-5l5-5 5 5-5 5z",
			key: "1fh25c"
		}],
		["path", {
			d: "M9.5 14.5 16 8",
			key: "1smz5x"
		}],
		["path", {
			d: "m17 2 5 5-.5.5a3.53 3.53 0 0 1-5 0s0 0 0 0a3.53 3.53 0 0 1 0-5L17 2",
			key: "1q8uv5"
		}]
	]);
	const ShowerHead = createLucideIcon("ShowerHead", [
		["path", {
			d: "m4 4 2.5 2.5",
			key: "uv2vmf"
		}],
		["path", {
			d: "M13.5 6.5a4.95 4.95 0 0 0-7 7",
			key: "frdkwv"
		}],
		["path", {
			d: "M15 5 5 15",
			key: "1ag8rq"
		}],
		["path", {
			d: "M14 17v.01",
			key: "eokfpp"
		}],
		["path", {
			d: "M10 16v.01",
			key: "14uyyl"
		}],
		["path", {
			d: "M13 13v.01",
			key: "1v1k97"
		}],
		["path", {
			d: "M16 10v.01",
			key: "5169yg"
		}],
		["path", {
			d: "M11 20v.01",
			key: "cj92p8"
		}],
		["path", {
			d: "M17 14v.01",
			key: "11cswd"
		}],
		["path", {
			d: "M20 11v.01",
			key: "19e0od"
		}]
	]);
	const Shrink = createLucideIcon("Shrink", [
		["path", {
			d: "m15 15 6 6m-6-6v4.8m0-4.8h4.8",
			key: "17vawe"
		}],
		["path", {
			d: "M9 19.8V15m0 0H4.2M9 15l-6 6",
			key: "chjx8e"
		}],
		["path", {
			d: "M15 4.2V9m0 0h4.8M15 9l6-6",
			key: "lav6yq"
		}],
		["path", {
			d: "M9 4.2V9m0 0H4.2M9 9 3 3",
			key: "1pxi2q"
		}]
	]);
	const Shrub = createLucideIcon("Shrub", [
		["path", {
			d: "M12 22v-7l-2-2",
			key: "eqv9mc"
		}],
		["path", {
			d: "M17 8v.8A6 6 0 0 1 13.8 20H10A6.5 6.5 0 0 1 7 8a5 5 0 0 1 10 0Z",
			key: "ubcgy"
		}],
		["path", {
			d: "m14 14-2 2",
			key: "847xa2"
		}]
	]);
	const Shuffle = createLucideIcon("Shuffle", [
		["path", {
			d: "m18 14 4 4-4 4",
			key: "10pe0f"
		}],
		["path", {
			d: "m18 2 4 4-4 4",
			key: "pucp1d"
		}],
		["path", {
			d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22",
			key: "1ailkh"
		}],
		["path", {
			d: "M2 6h1.972a4 4 0 0 1 3.6 2.2",
			key: "km57vx"
		}],
		["path", {
			d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45",
			key: "os18l9"
		}]
	]);
	const Sigma = createLucideIcon("Sigma", [["path", {
		d: "M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2",
		key: "wuwx1p"
	}]]);
	const SignalHigh = createLucideIcon("SignalHigh", [
		["path", {
			d: "M2 20h.01",
			key: "4haj6o"
		}],
		["path", {
			d: "M7 20v-4",
			key: "j294jx"
		}],
		["path", {
			d: "M12 20v-8",
			key: "i3yub9"
		}],
		["path", {
			d: "M17 20V8",
			key: "1tkaf5"
		}]
	]);
	const SignalLow = createLucideIcon("SignalLow", [["path", {
		d: "M2 20h.01",
		key: "4haj6o"
	}], ["path", {
		d: "M7 20v-4",
		key: "j294jx"
	}]]);
	const SignalMedium = createLucideIcon("SignalMedium", [
		["path", {
			d: "M2 20h.01",
			key: "4haj6o"
		}],
		["path", {
			d: "M7 20v-4",
			key: "j294jx"
		}],
		["path", {
			d: "M12 20v-8",
			key: "i3yub9"
		}]
	]);
	const SignalZero = createLucideIcon("SignalZero", [["path", {
		d: "M2 20h.01",
		key: "4haj6o"
	}]]);
	const Signal = createLucideIcon("Signal", [
		["path", {
			d: "M2 20h.01",
			key: "4haj6o"
		}],
		["path", {
			d: "M7 20v-4",
			key: "j294jx"
		}],
		["path", {
			d: "M12 20v-8",
			key: "i3yub9"
		}],
		["path", {
			d: "M17 20V8",
			key: "1tkaf5"
		}],
		["path", {
			d: "M22 4v16",
			key: "sih9yq"
		}]
	]);
	const Signature = createLucideIcon("Signature", [["path", {
		d: "m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284",
		key: "y32ogt"
	}], ["path", {
		d: "M3 21h18",
		key: "itz85i"
	}]]);
	const SignpostBig = createLucideIcon("SignpostBig", [
		["path", {
			d: "M10 9H4L2 7l2-2h6",
			key: "1hq7x2"
		}],
		["path", {
			d: "M14 5h6l2 2-2 2h-6",
			key: "bv62ej"
		}],
		["path", {
			d: "M10 22V4a2 2 0 1 1 4 0v18",
			key: "eqpcf2"
		}],
		["path", {
			d: "M8 22h8",
			key: "rmew8v"
		}]
	]);
	const Signpost = createLucideIcon("Signpost", [
		["path", {
			d: "M12 13v8",
			key: "1l5pq0"
		}],
		["path", {
			d: "M12 3v3",
			key: "1n5kay"
		}],
		["path", {
			d: "M18 6a2 2 0 0 1 1.387.56l2.307 2.22a1 1 0 0 1 0 1.44l-2.307 2.22A2 2 0 0 1 18 13H6a2 2 0 0 1-1.387-.56l-2.306-2.22a1 1 0 0 1 0-1.44l2.306-2.22A2 2 0 0 1 6 6z",
			key: "gqqp9m"
		}]
	]);
	const Siren = createLucideIcon("Siren", [
		["path", {
			d: "M7 18v-6a5 5 0 1 1 10 0v6",
			key: "pcx96s"
		}],
		["path", {
			d: "M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z",
			key: "1b4s83"
		}],
		["path", {
			d: "M21 12h1",
			key: "jtio3y"
		}],
		["path", {
			d: "M18.5 4.5 18 5",
			key: "g5sp9y"
		}],
		["path", {
			d: "M2 12h1",
			key: "1uaihz"
		}],
		["path", {
			d: "M12 2v1",
			key: "11qlp1"
		}],
		["path", {
			d: "m4.929 4.929.707.707",
			key: "1i51kw"
		}],
		["path", {
			d: "M12 12v6",
			key: "3ahymv"
		}]
	]);
	const SkipBack = createLucideIcon("SkipBack", [["polygon", {
		points: "19 20 9 12 19 4 19 20",
		key: "o2sva"
	}], ["line", {
		x1: "5",
		x2: "5",
		y1: "19",
		y2: "5",
		key: "1ocqjk"
	}]]);
	const SkipForward = createLucideIcon("SkipForward", [["polygon", {
		points: "5 4 15 12 5 20 5 4",
		key: "16p6eg"
	}], ["line", {
		x1: "19",
		x2: "19",
		y1: "5",
		y2: "19",
		key: "futhcm"
	}]]);
	const Skull = createLucideIcon("Skull", [
		["path", {
			d: "m12.5 17-.5-1-.5 1h1z",
			key: "3me087"
		}],
		["path", {
			d: "M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z",
			key: "1o5pge"
		}],
		["circle", {
			cx: "15",
			cy: "12",
			r: "1",
			key: "1tmaij"
		}],
		["circle", {
			cx: "9",
			cy: "12",
			r: "1",
			key: "1vctgf"
		}]
	]);
	const Slack = createLucideIcon("Slack", [
		["rect", {
			width: "3",
			height: "8",
			x: "13",
			y: "2",
			rx: "1.5",
			key: "diqz80"
		}],
		["path", {
			d: "M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5",
			key: "183iwg"
		}],
		["rect", {
			width: "3",
			height: "8",
			x: "8",
			y: "14",
			rx: "1.5",
			key: "hqg7r1"
		}],
		["path", {
			d: "M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5",
			key: "76g71w"
		}],
		["rect", {
			width: "8",
			height: "3",
			x: "14",
			y: "13",
			rx: "1.5",
			key: "1kmz0a"
		}],
		["path", {
			d: "M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5",
			key: "jc4sz0"
		}],
		["rect", {
			width: "8",
			height: "3",
			x: "2",
			y: "8",
			rx: "1.5",
			key: "1omvl4"
		}],
		["path", {
			d: "M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5",
			key: "16f3cl"
		}]
	]);
	const Slash = createLucideIcon("Slash", [["path", {
		d: "M22 2 2 22",
		key: "y4kqgn"
	}]]);
	const Slice = createLucideIcon("Slice", [["path", {
		d: "M11 16.586V19a1 1 0 0 1-1 1H2L18.37 3.63a1 1 0 1 1 3 3l-9.663 9.663a1 1 0 0 1-1.414 0L8 14",
		key: "1sllp5"
	}]]);
	const SlidersHorizontal = createLucideIcon("SlidersHorizontal", [
		["line", {
			x1: "21",
			x2: "14",
			y1: "4",
			y2: "4",
			key: "obuewd"
		}],
		["line", {
			x1: "10",
			x2: "3",
			y1: "4",
			y2: "4",
			key: "1q6298"
		}],
		["line", {
			x1: "21",
			x2: "12",
			y1: "12",
			y2: "12",
			key: "1iu8h1"
		}],
		["line", {
			x1: "8",
			x2: "3",
			y1: "12",
			y2: "12",
			key: "ntss68"
		}],
		["line", {
			x1: "21",
			x2: "16",
			y1: "20",
			y2: "20",
			key: "14d8ph"
		}],
		["line", {
			x1: "12",
			x2: "3",
			y1: "20",
			y2: "20",
			key: "m0wm8r"
		}],
		["line", {
			x1: "14",
			x2: "14",
			y1: "2",
			y2: "6",
			key: "14e1ph"
		}],
		["line", {
			x1: "8",
			x2: "8",
			y1: "10",
			y2: "14",
			key: "1i6ji0"
		}],
		["line", {
			x1: "16",
			x2: "16",
			y1: "18",
			y2: "22",
			key: "1lctlv"
		}]
	]);
	const SlidersVertical = createLucideIcon("SlidersVertical", [
		["line", {
			x1: "4",
			x2: "4",
			y1: "21",
			y2: "14",
			key: "1p332r"
		}],
		["line", {
			x1: "4",
			x2: "4",
			y1: "10",
			y2: "3",
			key: "gb41h5"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "21",
			y2: "12",
			key: "hf2csr"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "8",
			y2: "3",
			key: "1kfi7u"
		}],
		["line", {
			x1: "20",
			x2: "20",
			y1: "21",
			y2: "16",
			key: "1lhrwl"
		}],
		["line", {
			x1: "20",
			x2: "20",
			y1: "12",
			y2: "3",
			key: "16vvfq"
		}],
		["line", {
			x1: "2",
			x2: "6",
			y1: "14",
			y2: "14",
			key: "1uebub"
		}],
		["line", {
			x1: "10",
			x2: "14",
			y1: "8",
			y2: "8",
			key: "1yglbp"
		}],
		["line", {
			x1: "18",
			x2: "22",
			y1: "16",
			y2: "16",
			key: "1jxqpz"
		}]
	]);
	const SmartphoneCharging = createLucideIcon("SmartphoneCharging", [["rect", {
		width: "14",
		height: "20",
		x: "5",
		y: "2",
		rx: "2",
		ry: "2",
		key: "1yt0o3"
	}], ["path", {
		d: "M12.667 8 10 12h4l-2.667 4",
		key: "h9lk2d"
	}]]);
	const SmartphoneNfc = createLucideIcon("SmartphoneNfc", [
		["rect", {
			width: "7",
			height: "12",
			x: "2",
			y: "6",
			rx: "1",
			key: "5nje8w"
		}],
		["path", {
			d: "M13 8.32a7.43 7.43 0 0 1 0 7.36",
			key: "1g306n"
		}],
		["path", {
			d: "M16.46 6.21a11.76 11.76 0 0 1 0 11.58",
			key: "uqvjvo"
		}],
		["path", {
			d: "M19.91 4.1a15.91 15.91 0 0 1 .01 15.8",
			key: "ujntz3"
		}]
	]);
	const Smartphone = createLucideIcon("Smartphone", [["rect", {
		width: "14",
		height: "20",
		x: "5",
		y: "2",
		rx: "2",
		ry: "2",
		key: "1yt0o3"
	}], ["path", {
		d: "M12 18h.01",
		key: "mhygvu"
	}]]);
	const SmilePlus = createLucideIcon("SmilePlus", [
		["path", {
			d: "M22 11v1a10 10 0 1 1-9-10",
			key: "ew0xw9"
		}],
		["path", {
			d: "M8 14s1.5 2 4 2 4-2 4-2",
			key: "1y1vjs"
		}],
		["line", {
			x1: "9",
			x2: "9.01",
			y1: "9",
			y2: "9",
			key: "yxxnd0"
		}],
		["line", {
			x1: "15",
			x2: "15.01",
			y1: "9",
			y2: "9",
			key: "1p4y9e"
		}],
		["path", {
			d: "M16 5h6",
			key: "1vod17"
		}],
		["path", {
			d: "M19 2v6",
			key: "4bpg5p"
		}]
	]);
	const Smile = createLucideIcon("Smile", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M8 14s1.5 2 4 2 4-2 4-2",
			key: "1y1vjs"
		}],
		["line", {
			x1: "9",
			x2: "9.01",
			y1: "9",
			y2: "9",
			key: "yxxnd0"
		}],
		["line", {
			x1: "15",
			x2: "15.01",
			y1: "9",
			y2: "9",
			key: "1p4y9e"
		}]
	]);
	const Snail = createLucideIcon("Snail", [
		["path", {
			d: "M2 13a6 6 0 1 0 12 0 4 4 0 1 0-8 0 2 2 0 0 0 4 0",
			key: "hneq2s"
		}],
		["circle", {
			cx: "10",
			cy: "13",
			r: "8",
			key: "194lz3"
		}],
		["path", {
			d: "M2 21h12c4.4 0 8-3.6 8-8V7a2 2 0 1 0-4 0v6",
			key: "ixqyt7"
		}],
		["path", {
			d: "M18 3 19.1 5.2",
			key: "9tjm43"
		}],
		["path", {
			d: "M22 3 20.9 5.2",
			key: "j3odrs"
		}]
	]);
	const Snowflake = createLucideIcon("Snowflake", [
		["line", {
			x1: "2",
			x2: "22",
			y1: "12",
			y2: "12",
			key: "1dnqot"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "2",
			y2: "22",
			key: "7eqyqh"
		}],
		["path", {
			d: "m20 16-4-4 4-4",
			key: "rquw4f"
		}],
		["path", {
			d: "m4 8 4 4-4 4",
			key: "12s3z9"
		}],
		["path", {
			d: "m16 4-4 4-4-4",
			key: "1tumq1"
		}],
		["path", {
			d: "m8 20 4-4 4 4",
			key: "9p200w"
		}]
	]);
	const Sofa = createLucideIcon("Sofa", [
		["path", {
			d: "M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3",
			key: "1dgpiv"
		}],
		["path", {
			d: "M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z",
			key: "xacw8m"
		}],
		["path", {
			d: "M4 18v2",
			key: "jwo5n2"
		}],
		["path", {
			d: "M20 18v2",
			key: "1ar1qi"
		}],
		["path", {
			d: "M12 4v9",
			key: "oqhhn3"
		}]
	]);
	const Soup = createLucideIcon("Soup", [
		["path", {
			d: "M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z",
			key: "4rw317"
		}],
		["path", {
			d: "M7 21h10",
			key: "1b0cd5"
		}],
		["path", {
			d: "M19.5 12 22 6",
			key: "shfsr5"
		}],
		["path", {
			d: "M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62",
			key: "rpc6vp"
		}],
		["path", {
			d: "M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62",
			key: "1lf63m"
		}],
		["path", {
			d: "M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62",
			key: "97tijn"
		}]
	]);
	const Space = createLucideIcon("Space", [["path", {
		d: "M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1",
		key: "lt2kga"
	}]]);
	const Spade = createLucideIcon("Spade", [["path", {
		d: "M5 9c-1.5 1.5-3 3.2-3 5.5A5.5 5.5 0 0 0 7.5 20c1.8 0 3-.5 4.5-2 1.5 1.5 2.7 2 4.5 2a5.5 5.5 0 0 0 5.5-5.5c0-2.3-1.5-4-3-5.5l-7-7-7 7Z",
		key: "40bo9n"
	}], ["path", {
		d: "M12 18v4",
		key: "jadmvz"
	}]]);
	const Sparkle = createLucideIcon("Sparkle", [["path", {
		d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
		key: "4pj2yx"
	}]]);
	const Sparkles = createLucideIcon("Sparkles", [
		["path", {
			d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
			key: "4pj2yx"
		}],
		["path", {
			d: "M20 3v4",
			key: "1olli1"
		}],
		["path", {
			d: "M22 5h-4",
			key: "1gvqau"
		}],
		["path", {
			d: "M4 17v2",
			key: "vumght"
		}],
		["path", {
			d: "M5 18H3",
			key: "zchphs"
		}]
	]);
	const Speaker = createLucideIcon("Speaker", [
		["rect", {
			width: "16",
			height: "20",
			x: "4",
			y: "2",
			rx: "2",
			key: "1nb95v"
		}],
		["path", {
			d: "M12 6h.01",
			key: "1vi96p"
		}],
		["circle", {
			cx: "12",
			cy: "14",
			r: "4",
			key: "1jruaj"
		}],
		["path", {
			d: "M12 14h.01",
			key: "1etili"
		}]
	]);
	const Speech = createLucideIcon("Speech", [
		["path", {
			d: "M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.054 1 4.55a5.77 5.77 0 0 1 .029 2.758L2 20",
			key: "11atix"
		}],
		["path", {
			d: "M19.8 17.8a7.5 7.5 0 0 0 .003-10.603",
			key: "yol142"
		}],
		["path", {
			d: "M17 15a3.5 3.5 0 0 0-.025-4.975",
			key: "ssbmkc"
		}]
	]);
	const SpellCheck2 = createLucideIcon("SpellCheck2", [
		["path", {
			d: "m6 16 6-12 6 12",
			key: "1b4byz"
		}],
		["path", {
			d: "M8 12h8",
			key: "1wcyev"
		}],
		["path", {
			d: "M4 21c1.1 0 1.1-1 2.3-1s1.1 1 2.3 1c1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1",
			key: "8mdmtu"
		}]
	]);
	const SpellCheck = createLucideIcon("SpellCheck", [
		["path", {
			d: "m6 16 6-12 6 12",
			key: "1b4byz"
		}],
		["path", {
			d: "M8 12h8",
			key: "1wcyev"
		}],
		["path", {
			d: "m16 20 2 2 4-4",
			key: "13tcca"
		}]
	]);
	const Spline = createLucideIcon("Spline", [
		["circle", {
			cx: "19",
			cy: "5",
			r: "2",
			key: "mhkx31"
		}],
		["circle", {
			cx: "5",
			cy: "19",
			r: "2",
			key: "v8kfzx"
		}],
		["path", {
			d: "M5 17A12 12 0 0 1 17 5",
			key: "1okkup"
		}]
	]);
	const Split = createLucideIcon("Split", [
		["path", {
			d: "M16 3h5v5",
			key: "1806ms"
		}],
		["path", {
			d: "M8 3H3v5",
			key: "15dfkv"
		}],
		["path", {
			d: "M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3",
			key: "1qrqzj"
		}],
		["path", {
			d: "m15 9 6-6",
			key: "ko1vev"
		}]
	]);
	const SprayCan = createLucideIcon("SprayCan", [
		["path", {
			d: "M3 3h.01",
			key: "159qn6"
		}],
		["path", {
			d: "M7 5h.01",
			key: "1hq22a"
		}],
		["path", {
			d: "M11 7h.01",
			key: "1osv80"
		}],
		["path", {
			d: "M3 7h.01",
			key: "1xzrh3"
		}],
		["path", {
			d: "M7 9h.01",
			key: "19b3jx"
		}],
		["path", {
			d: "M3 11h.01",
			key: "1eifu7"
		}],
		["rect", {
			width: "4",
			height: "4",
			x: "15",
			y: "5",
			key: "mri9e4"
		}],
		["path", {
			d: "m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2",
			key: "aib6hk"
		}],
		["path", {
			d: "m13 14 8-2",
			key: "1d7bmk"
		}],
		["path", {
			d: "m13 19 8-2",
			key: "1y2vml"
		}]
	]);
	const Sprout = createLucideIcon("Sprout", [
		["path", {
			d: "M7 20h10",
			key: "e6iznv"
		}],
		["path", {
			d: "M10 20c5.5-2.5.8-6.4 3-10",
			key: "161w41"
		}],
		["path", {
			d: "M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z",
			key: "9gtqwd"
		}],
		["path", {
			d: "M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z",
			key: "bkxnd2"
		}]
	]);
	const SquareActivity = createLucideIcon("SquareActivity", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "M17 12h-2l-2 5-2-10-2 5H7",
		key: "15hlnc"
	}]]);
	const SquareArrowDownLeft = createLucideIcon("SquareArrowDownLeft", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "m16 8-8 8",
			key: "166keh"
		}],
		["path", {
			d: "M16 16H8V8",
			key: "1w2ppm"
		}]
	]);
	const SquareArrowDownRight = createLucideIcon("SquareArrowDownRight", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "m8 8 8 8",
			key: "1imecy"
		}],
		["path", {
			d: "M16 8v8H8",
			key: "1lbpgo"
		}]
	]);
	const SquareArrowDown = createLucideIcon("SquareArrowDown", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M12 8v8",
			key: "napkw2"
		}],
		["path", {
			d: "m8 12 4 4 4-4",
			key: "k98ssh"
		}]
	]);
	const SquareArrowLeft = createLucideIcon("SquareArrowLeft", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "m12 8-4 4 4 4",
			key: "15vm53"
		}],
		["path", {
			d: "M16 12H8",
			key: "1fr5h0"
		}]
	]);
	const SquareArrowOutDownLeft = createLucideIcon("SquareArrowOutDownLeft", [
		["path", {
			d: "M13 21h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6",
			key: "14qz4y"
		}],
		["path", {
			d: "m3 21 9-9",
			key: "1jfql5"
		}],
		["path", {
			d: "M9 21H3v-6",
			key: "wtvkvv"
		}]
	]);
	const SquareArrowOutDownRight = createLucideIcon("SquareArrowOutDownRight", [
		["path", {
			d: "M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6",
			key: "14rsvq"
		}],
		["path", {
			d: "m21 21-9-9",
			key: "1et2py"
		}],
		["path", {
			d: "M21 15v6h-6",
			key: "1jko0i"
		}]
	]);
	const SquareArrowOutUpLeft = createLucideIcon("SquareArrowOutUpLeft", [
		["path", {
			d: "M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6",
			key: "14mv1t"
		}],
		["path", {
			d: "m3 3 9 9",
			key: "rks13r"
		}],
		["path", {
			d: "M3 9V3h6",
			key: "ira0h2"
		}]
	]);
	const SquareArrowOutUpRight = createLucideIcon("SquareArrowOutUpRight", [
		["path", {
			d: "M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6",
			key: "y09zxi"
		}],
		["path", {
			d: "m21 3-9 9",
			key: "mpx6sq"
		}],
		["path", {
			d: "M15 3h6v6",
			key: "1q9fwt"
		}]
	]);
	const SquareArrowRight = createLucideIcon("SquareArrowRight", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M8 12h8",
			key: "1wcyev"
		}],
		["path", {
			d: "m12 16 4-4-4-4",
			key: "1i9zcv"
		}]
	]);
	const SquareArrowUpLeft = createLucideIcon("SquareArrowUpLeft", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M8 16V8h8",
			key: "19xb1h"
		}],
		["path", {
			d: "M16 16 8 8",
			key: "1qdy8n"
		}]
	]);
	const SquareArrowUpRight = createLucideIcon("SquareArrowUpRight", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M8 8h8v8",
			key: "b65dnt"
		}],
		["path", {
			d: "m8 16 8-8",
			key: "13b9ih"
		}]
	]);
	const SquareArrowUp = createLucideIcon("SquareArrowUp", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "m16 12-4-4-4 4",
			key: "177agl"
		}],
		["path", {
			d: "M12 16V8",
			key: "1sbj14"
		}]
	]);
	const SquareAsterisk = createLucideIcon("SquareAsterisk", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M12 8v8",
			key: "napkw2"
		}],
		["path", {
			d: "m8.5 14 7-4",
			key: "12hpby"
		}],
		["path", {
			d: "m8.5 10 7 4",
			key: "wwy2dy"
		}]
	]);
	const SquareBottomDashedScissors = createLucideIcon("SquareBottomDashedScissors", [
		["path", {
			d: "M4 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2",
			key: "1vzg26"
		}],
		["path", {
			d: "M10 22H8",
			key: "euku7a"
		}],
		["path", {
			d: "M16 22h-2",
			key: "18d249"
		}],
		["circle", {
			cx: "8",
			cy: "8",
			r: "2",
			key: "14cg06"
		}],
		["path", {
			d: "M9.414 9.414 12 12",
			key: "qz4lzr"
		}],
		["path", {
			d: "M14.8 14.8 18 18",
			key: "11flf1"
		}],
		["circle", {
			cx: "8",
			cy: "16",
			r: "2",
			key: "1acxsx"
		}],
		["path", {
			d: "m18 6-8.586 8.586",
			key: "11kzk1"
		}]
	]);
	const SquareChartGantt = createLucideIcon("SquareChartGantt", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M9 8h7",
			key: "kbo1nt"
		}],
		["path", {
			d: "M8 12h6",
			key: "ikassy"
		}],
		["path", {
			d: "M11 16h5",
			key: "oq65wt"
		}]
	]);
	const SquareCheckBig = createLucideIcon("SquareCheckBig", [["path", {
		d: "M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5",
		key: "1uzm8b"
	}], ["path", {
		d: "m9 11 3 3L22 4",
		key: "1pflzl"
	}]]);
	const SquareCheck = createLucideIcon("SquareCheck", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "m9 12 2 2 4-4",
		key: "dzmm74"
	}]]);
	const SquareChevronDown = createLucideIcon("SquareChevronDown", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "m16 10-4 4-4-4",
		key: "894hmk"
	}]]);
	const SquareChevronLeft = createLucideIcon("SquareChevronLeft", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "m14 16-4-4 4-4",
		key: "ojs7w8"
	}]]);
	const SquareChevronRight = createLucideIcon("SquareChevronRight", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "m10 8 4 4-4 4",
		key: "1wy4r4"
	}]]);
	const SquareChevronUp = createLucideIcon("SquareChevronUp", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "m8 14 4-4 4 4",
		key: "fy2ptz"
	}]]);
	const SquareCode = createLucideIcon("SquareCode", [
		["path", {
			d: "M10 9.5 8 12l2 2.5",
			key: "3mjy60"
		}],
		["path", {
			d: "m14 9.5 2 2.5-2 2.5",
			key: "1bir2l"
		}],
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}]
	]);
	const SquareDashedBottomCode = createLucideIcon("SquareDashedBottomCode", [
		["path", {
			d: "M10 9.5 8 12l2 2.5",
			key: "3mjy60"
		}],
		["path", {
			d: "M14 21h1",
			key: "v9vybs"
		}],
		["path", {
			d: "m14 9.5 2 2.5-2 2.5",
			key: "1bir2l"
		}],
		["path", {
			d: "M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2",
			key: "as5y1o"
		}],
		["path", {
			d: "M9 21h1",
			key: "15o7lz"
		}]
	]);
	const SquareDashedBottom = createLucideIcon("SquareDashedBottom", [
		["path", {
			d: "M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2",
			key: "as5y1o"
		}],
		["path", {
			d: "M9 21h1",
			key: "15o7lz"
		}],
		["path", {
			d: "M14 21h1",
			key: "v9vybs"
		}]
	]);
	const SquareDashedKanban = createLucideIcon("SquareDashedKanban", [
		["path", {
			d: "M8 7v7",
			key: "1x2jlm"
		}],
		["path", {
			d: "M12 7v4",
			key: "xawao1"
		}],
		["path", {
			d: "M16 7v9",
			key: "1hp2iy"
		}],
		["path", {
			d: "M5 3a2 2 0 0 0-2 2",
			key: "y57alp"
		}],
		["path", {
			d: "M9 3h1",
			key: "1yesri"
		}],
		["path", {
			d: "M14 3h1",
			key: "1ec4yj"
		}],
		["path", {
			d: "M19 3a2 2 0 0 1 2 2",
			key: "18rm91"
		}],
		["path", {
			d: "M21 9v1",
			key: "mxsmne"
		}],
		["path", {
			d: "M21 14v1",
			key: "169vum"
		}],
		["path", {
			d: "M21 19a2 2 0 0 1-2 2",
			key: "1j7049"
		}],
		["path", {
			d: "M14 21h1",
			key: "v9vybs"
		}],
		["path", {
			d: "M9 21h1",
			key: "15o7lz"
		}],
		["path", {
			d: "M5 21a2 2 0 0 1-2-2",
			key: "sbafld"
		}],
		["path", {
			d: "M3 14v1",
			key: "vnatye"
		}],
		["path", {
			d: "M3 9v1",
			key: "1r0deq"
		}]
	]);
	const SquareDashedMousePointer = createLucideIcon("SquareDashedMousePointer", [
		["path", {
			d: "M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z",
			key: "xwnzip"
		}],
		["path", {
			d: "M5 3a2 2 0 0 0-2 2",
			key: "y57alp"
		}],
		["path", {
			d: "M19 3a2 2 0 0 1 2 2",
			key: "18rm91"
		}],
		["path", {
			d: "M5 21a2 2 0 0 1-2-2",
			key: "sbafld"
		}],
		["path", {
			d: "M9 3h1",
			key: "1yesri"
		}],
		["path", {
			d: "M9 21h2",
			key: "1qve2z"
		}],
		["path", {
			d: "M14 3h1",
			key: "1ec4yj"
		}],
		["path", {
			d: "M3 9v1",
			key: "1r0deq"
		}],
		["path", {
			d: "M21 9v2",
			key: "p14lih"
		}],
		["path", {
			d: "M3 14v1",
			key: "vnatye"
		}]
	]);
	const SquareDashed = createLucideIcon("SquareDashed", [
		["path", {
			d: "M5 3a2 2 0 0 0-2 2",
			key: "y57alp"
		}],
		["path", {
			d: "M19 3a2 2 0 0 1 2 2",
			key: "18rm91"
		}],
		["path", {
			d: "M21 19a2 2 0 0 1-2 2",
			key: "1j7049"
		}],
		["path", {
			d: "M5 21a2 2 0 0 1-2-2",
			key: "sbafld"
		}],
		["path", {
			d: "M9 3h1",
			key: "1yesri"
		}],
		["path", {
			d: "M9 21h1",
			key: "15o7lz"
		}],
		["path", {
			d: "M14 3h1",
			key: "1ec4yj"
		}],
		["path", {
			d: "M14 21h1",
			key: "v9vybs"
		}],
		["path", {
			d: "M3 9v1",
			key: "1r0deq"
		}],
		["path", {
			d: "M21 9v1",
			key: "mxsmne"
		}],
		["path", {
			d: "M3 14v1",
			key: "vnatye"
		}],
		["path", {
			d: "M21 14v1",
			key: "169vum"
		}]
	]);
	const SquareDivide = createLucideIcon("SquareDivide", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			ry: "2",
			key: "1m3agn"
		}],
		["line", {
			x1: "8",
			x2: "16",
			y1: "12",
			y2: "12",
			key: "1jonct"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "16",
			y2: "16",
			key: "aqc6ln"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "8",
			y2: "8",
			key: "1mkcni"
		}]
	]);
	const SquareDot = createLucideIcon("SquareDot", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["circle", {
		cx: "12",
		cy: "12",
		r: "1",
		key: "41hilf"
	}]]);
	const SquareEqual = createLucideIcon("SquareEqual", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M7 10h10",
			key: "1101jm"
		}],
		["path", {
			d: "M7 14h10",
			key: "1mhdw3"
		}]
	]);
	const SquareFunction = createLucideIcon("SquareFunction", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			ry: "2",
			key: "1m3agn"
		}],
		["path", {
			d: "M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3",
			key: "m1af9g"
		}],
		["path", {
			d: "M9 11.2h5.7",
			key: "3zgcl2"
		}]
	]);
	const SquareKanban = createLucideIcon("SquareKanban", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M8 7v7",
			key: "1x2jlm"
		}],
		["path", {
			d: "M12 7v4",
			key: "xawao1"
		}],
		["path", {
			d: "M16 7v9",
			key: "1hp2iy"
		}]
	]);
	const SquareLibrary = createLucideIcon("SquareLibrary", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M7 7v10",
			key: "d5nglc"
		}],
		["path", {
			d: "M11 7v10",
			key: "pptsnr"
		}],
		["path", {
			d: "m15 7 2 10",
			key: "1m7qm5"
		}]
	]);
	const SquareM = createLucideIcon("SquareM", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "M8 16V8l4 4 4-4v8",
		key: "141u4e"
	}]]);
	const SquareMenu = createLucideIcon("SquareMenu", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M7 8h10",
			key: "1jw688"
		}],
		["path", {
			d: "M7 12h10",
			key: "b7w52i"
		}],
		["path", {
			d: "M7 16h10",
			key: "wp8him"
		}]
	]);
	const SquareMinus = createLucideIcon("SquareMinus", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "M8 12h8",
		key: "1wcyev"
	}]]);
	const SquareMousePointer = createLucideIcon("SquareMousePointer", [["path", {
		d: "M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z",
		key: "xwnzip"
	}], ["path", {
		d: "M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6",
		key: "14rsvq"
	}]]);
	const SquareParkingOff = createLucideIcon("SquareParkingOff", [
		["path", {
			d: "M3.6 3.6A2 2 0 0 1 5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-.59 1.41",
			key: "9l1ft6"
		}],
		["path", {
			d: "M3 8.7V19a2 2 0 0 0 2 2h10.3",
			key: "17knke"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M13 13a3 3 0 1 0 0-6H9v2",
			key: "uoagbd"
		}],
		["path", {
			d: "M9 17v-2.3",
			key: "1jxgo2"
		}]
	]);
	const SquareParking = createLucideIcon("SquareParking", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "M9 17V7h4a3 3 0 0 1 0 6H9",
		key: "1dfk2c"
	}]]);
	const SquarePen = createLucideIcon("SquarePen", [["path", {
		d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
		key: "1m0v6g"
	}], ["path", {
		d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
		key: "ohrbg2"
	}]]);
	const SquarePercent = createLucideIcon("SquarePercent", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "m15 9-6 6",
			key: "1uzhvr"
		}],
		["path", {
			d: "M9 9h.01",
			key: "1q5me6"
		}],
		["path", {
			d: "M15 15h.01",
			key: "lqbp3k"
		}]
	]);
	const SquarePi = createLucideIcon("SquarePi", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M7 7h10",
			key: "udp07y"
		}],
		["path", {
			d: "M10 7v10",
			key: "i1d9ee"
		}],
		["path", {
			d: "M16 17a2 2 0 0 1-2-2V7",
			key: "ftwdc7"
		}]
	]);
	const SquarePilcrow = createLucideIcon("SquarePilcrow", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M12 12H9.5a2.5 2.5 0 0 1 0-5H17",
			key: "1l9586"
		}],
		["path", {
			d: "M12 7v10",
			key: "jspqdw"
		}],
		["path", {
			d: "M16 7v10",
			key: "lavkr4"
		}]
	]);
	const SquarePlay = createLucideIcon("SquarePlay", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "m9 8 6 4-6 4Z",
		key: "f1r3lt"
	}]]);
	const SquarePlus = createLucideIcon("SquarePlus", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M8 12h8",
			key: "1wcyev"
		}],
		["path", {
			d: "M12 8v8",
			key: "napkw2"
		}]
	]);
	const SquarePower = createLucideIcon("SquarePower", [
		["path", {
			d: "M12 7v4",
			key: "xawao1"
		}],
		["path", {
			d: "M7.998 9.003a5 5 0 1 0 8-.005",
			key: "1pek45"
		}],
		["rect", {
			x: "3",
			y: "3",
			width: "18",
			height: "18",
			rx: "2",
			key: "h1oib"
		}]
	]);
	const SquareRadical = createLucideIcon("SquareRadical", [["path", {
		d: "M7 12h2l2 5 2-10h4",
		key: "1fxv6h"
	}], ["rect", {
		x: "3",
		y: "3",
		width: "18",
		height: "18",
		rx: "2",
		key: "h1oib"
	}]]);
	const SquareScissors = createLucideIcon("SquareScissors", [
		["rect", {
			width: "20",
			height: "20",
			x: "2",
			y: "2",
			rx: "2",
			key: "1btzen"
		}],
		["circle", {
			cx: "8",
			cy: "8",
			r: "2",
			key: "14cg06"
		}],
		["path", {
			d: "M9.414 9.414 12 12",
			key: "qz4lzr"
		}],
		["path", {
			d: "M14.8 14.8 18 18",
			key: "11flf1"
		}],
		["circle", {
			cx: "8",
			cy: "16",
			r: "2",
			key: "1acxsx"
		}],
		["path", {
			d: "m18 6-8.586 8.586",
			key: "11kzk1"
		}]
	]);
	const SquareSigma = createLucideIcon("SquareSigma", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["path", {
		d: "M16 8.9V7H8l4 5-4 5h8v-1.9",
		key: "9nih0i"
	}]]);
	const SquareSlash = createLucideIcon("SquareSlash", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}], ["line", {
		x1: "9",
		x2: "15",
		y1: "15",
		y2: "9",
		key: "1dfufj"
	}]]);
	const SquareSplitHorizontal = createLucideIcon("SquareSplitHorizontal", [
		["path", {
			d: "M8 19H5c-1 0-2-1-2-2V7c0-1 1-2 2-2h3",
			key: "lubmu8"
		}],
		["path", {
			d: "M16 5h3c1 0 2 1 2 2v10c0 1-1 2-2 2h-3",
			key: "1ag34g"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "4",
			y2: "20",
			key: "1tx1rr"
		}]
	]);
	const SquareSplitVertical = createLucideIcon("SquareSplitVertical", [
		["path", {
			d: "M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3",
			key: "1pi83i"
		}],
		["path", {
			d: "M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3",
			key: "ido5k7"
		}],
		["line", {
			x1: "4",
			x2: "20",
			y1: "12",
			y2: "12",
			key: "1e0a9i"
		}]
	]);
	const SquareSquare = createLucideIcon("SquareSquare", [["rect", {
		x: "3",
		y: "3",
		width: "18",
		height: "18",
		rx: "2",
		key: "h1oib"
	}], ["rect", {
		x: "8",
		y: "8",
		width: "8",
		height: "8",
		rx: "1",
		key: "z9xiuo"
	}]]);
	const SquareStack = createLucideIcon("SquareStack", [
		["path", {
			d: "M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2",
			key: "4i38lg"
		}],
		["path", {
			d: "M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2",
			key: "mlte4a"
		}],
		["rect", {
			width: "8",
			height: "8",
			x: "14",
			y: "14",
			rx: "2",
			key: "1fa9i4"
		}]
	]);
	const SquareTerminal = createLucideIcon("SquareTerminal", [
		["path", {
			d: "m7 11 2-2-2-2",
			key: "1lz0vl"
		}],
		["path", {
			d: "M11 13h4",
			key: "1p7l4v"
		}],
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			ry: "2",
			key: "1m3agn"
		}]
	]);
	const SquareUserRound = createLucideIcon("SquareUserRound", [
		["path", {
			d: "M18 21a6 6 0 0 0-12 0",
			key: "kaz2du"
		}],
		["circle", {
			cx: "12",
			cy: "11",
			r: "4",
			key: "1gt34v"
		}],
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}]
	]);
	const SquareUser = createLucideIcon("SquareUser", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["circle", {
			cx: "12",
			cy: "10",
			r: "3",
			key: "ilqhr7"
		}],
		["path", {
			d: "M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2",
			key: "1m6ac2"
		}]
	]);
	const SquareX = createLucideIcon("SquareX", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			ry: "2",
			key: "1m3agn"
		}],
		["path", {
			d: "m15 9-6 6",
			key: "1uzhvr"
		}],
		["path", {
			d: "m9 9 6 6",
			key: "z0biqf"
		}]
	]);
	const Square = createLucideIcon("Square", [["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}]]);
	const Squircle = createLucideIcon("Squircle", [["path", {
		d: "M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9",
		key: "garfkc"
	}]]);
	const Squirrel = createLucideIcon("Squirrel", [
		["path", {
			d: "M15.236 22a3 3 0 0 0-2.2-5",
			key: "21bitc"
		}],
		["path", {
			d: "M16 20a3 3 0 0 1 3-3h1a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4V4",
			key: "oh0fg0"
		}],
		["path", {
			d: "M18 13h.01",
			key: "9veqaj"
		}],
		["path", {
			d: "M18 6a4 4 0 0 0-4 4 7 7 0 0 0-7 7c0-5 4-5 4-10.5a4.5 4.5 0 1 0-9 0 2.5 2.5 0 0 0 5 0C7 10 3 11 3 17c0 2.8 2.2 5 5 5h10",
			key: "980v8a"
		}]
	]);
	const Stamp = createLucideIcon("Stamp", [
		["path", {
			d: "M5 22h14",
			key: "ehvnwv"
		}],
		["path", {
			d: "M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z",
			key: "1sy9ra"
		}],
		["path", {
			d: "M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-3-3c-1.66 0-3 1-3 3s1 2 1 3.5V13",
			key: "cnxgux"
		}]
	]);
	const StarHalf = createLucideIcon("StarHalf", [["path", {
		d: "M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2",
		key: "2ksp49"
	}]]);
	const StarOff = createLucideIcon("StarOff", [
		["path", {
			d: "M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43",
			key: "16m0ql"
		}],
		["path", {
			d: "M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91",
			key: "1vt8nq"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Star = createLucideIcon("Star", [["path", {
		d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
		key: "r04s7s"
	}]]);
	const StepBack = createLucideIcon("StepBack", [["line", {
		x1: "18",
		x2: "18",
		y1: "20",
		y2: "4",
		key: "cun8e5"
	}], ["polygon", {
		points: "14,20 4,12 14,4",
		key: "ypakod"
	}]]);
	const StepForward = createLucideIcon("StepForward", [["line", {
		x1: "6",
		x2: "6",
		y1: "4",
		y2: "20",
		key: "fy8qot"
	}], ["polygon", {
		points: "10,4 20,12 10,20",
		key: "1mc1pf"
	}]]);
	const Stethoscope = createLucideIcon("Stethoscope", [
		["path", {
			d: "M11 2v2",
			key: "1539x4"
		}],
		["path", {
			d: "M5 2v2",
			key: "1yf1q8"
		}],
		["path", {
			d: "M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1",
			key: "rb5t3r"
		}],
		["path", {
			d: "M8 15a6 6 0 0 0 12 0v-3",
			key: "x18d4x"
		}],
		["circle", {
			cx: "20",
			cy: "10",
			r: "2",
			key: "ts1r5v"
		}]
	]);
	const Sticker = createLucideIcon("Sticker", [
		["path", {
			d: "M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z",
			key: "1wis1t"
		}],
		["path", {
			d: "M14 3v4a2 2 0 0 0 2 2h4",
			key: "36rjfy"
		}],
		["path", {
			d: "M8 13h.01",
			key: "1sbv64"
		}],
		["path", {
			d: "M16 13h.01",
			key: "wip0gl"
		}],
		["path", {
			d: "M10 16s.8 1 2 1c1.3 0 2-1 2-1",
			key: "1vvgv3"
		}]
	]);
	const StickyNote = createLucideIcon("StickyNote", [["path", {
		d: "M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z",
		key: "qazsjp"
	}], ["path", {
		d: "M15 3v4a2 2 0 0 0 2 2h4",
		key: "40519r"
	}]]);
	const Store = createLucideIcon("Store", [
		["path", {
			d: "m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7",
			key: "ztvudi"
		}],
		["path", {
			d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",
			key: "1b2hhj"
		}],
		["path", {
			d: "M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4",
			key: "2ebpfo"
		}],
		["path", {
			d: "M2 7h20",
			key: "1fcdvo"
		}],
		["path", {
			d: "M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7",
			key: "6c3vgh"
		}]
	]);
	const StretchHorizontal = createLucideIcon("StretchHorizontal", [["rect", {
		width: "20",
		height: "6",
		x: "2",
		y: "4",
		rx: "2",
		key: "qdearl"
	}], ["rect", {
		width: "20",
		height: "6",
		x: "2",
		y: "14",
		rx: "2",
		key: "1xrn6j"
	}]]);
	const StretchVertical = createLucideIcon("StretchVertical", [["rect", {
		width: "6",
		height: "20",
		x: "4",
		y: "2",
		rx: "2",
		key: "19qu7m"
	}], ["rect", {
		width: "6",
		height: "20",
		x: "14",
		y: "2",
		rx: "2",
		key: "24v0nk"
	}]]);
	const Strikethrough = createLucideIcon("Strikethrough", [
		["path", {
			d: "M16 4H9a3 3 0 0 0-2.83 4",
			key: "43sutm"
		}],
		["path", {
			d: "M14 12a4 4 0 0 1 0 8H6",
			key: "nlfj13"
		}],
		["line", {
			x1: "4",
			x2: "20",
			y1: "12",
			y2: "12",
			key: "1e0a9i"
		}]
	]);
	const Subscript = createLucideIcon("Subscript", [
		["path", {
			d: "m4 5 8 8",
			key: "1eunvl"
		}],
		["path", {
			d: "m12 5-8 8",
			key: "1ah0jp"
		}],
		["path", {
			d: "M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07",
			key: "e8ta8j"
		}]
	]);
	const SunDim = createLucideIcon("SunDim", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "4",
			key: "4exip2"
		}],
		["path", {
			d: "M12 4h.01",
			key: "1ujb9j"
		}],
		["path", {
			d: "M20 12h.01",
			key: "1ykeid"
		}],
		["path", {
			d: "M12 20h.01",
			key: "zekei9"
		}],
		["path", {
			d: "M4 12h.01",
			key: "158zrr"
		}],
		["path", {
			d: "M17.657 6.343h.01",
			key: "31pqzk"
		}],
		["path", {
			d: "M17.657 17.657h.01",
			key: "jehnf4"
		}],
		["path", {
			d: "M6.343 17.657h.01",
			key: "gdk6ow"
		}],
		["path", {
			d: "M6.343 6.343h.01",
			key: "1uurf0"
		}]
	]);
	const SunMedium = createLucideIcon("SunMedium", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "4",
			key: "4exip2"
		}],
		["path", {
			d: "M12 3v1",
			key: "1asbbs"
		}],
		["path", {
			d: "M12 20v1",
			key: "1wcdkc"
		}],
		["path", {
			d: "M3 12h1",
			key: "lp3yf2"
		}],
		["path", {
			d: "M20 12h1",
			key: "1vloll"
		}],
		["path", {
			d: "m18.364 5.636-.707.707",
			key: "1hakh0"
		}],
		["path", {
			d: "m6.343 17.657-.707.707",
			key: "18m9nf"
		}],
		["path", {
			d: "m5.636 5.636.707.707",
			key: "1xv1c5"
		}],
		["path", {
			d: "m17.657 17.657.707.707",
			key: "vl76zb"
		}]
	]);
	const SunMoon = createLucideIcon("SunMoon", [
		["path", {
			d: "M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4",
			key: "1fu5g2"
		}],
		["path", {
			d: "M12 2v2",
			key: "tus03m"
		}],
		["path", {
			d: "M12 20v2",
			key: "1lh1kg"
		}],
		["path", {
			d: "m4.9 4.9 1.4 1.4",
			key: "b9915j"
		}],
		["path", {
			d: "m17.7 17.7 1.4 1.4",
			key: "qc3ed3"
		}],
		["path", {
			d: "M2 12h2",
			key: "1t8f8n"
		}],
		["path", {
			d: "M20 12h2",
			key: "1q8mjw"
		}],
		["path", {
			d: "m6.3 17.7-1.4 1.4",
			key: "5gca6"
		}],
		["path", {
			d: "m19.1 4.9-1.4 1.4",
			key: "wpu9u6"
		}]
	]);
	const SunSnow = createLucideIcon("SunSnow", [
		["path", {
			d: "M10 9a3 3 0 1 0 0 6",
			key: "6zmtdl"
		}],
		["path", {
			d: "M2 12h1",
			key: "1uaihz"
		}],
		["path", {
			d: "M14 21V3",
			key: "1llu3z"
		}],
		["path", {
			d: "M10 4V3",
			key: "pkzwkn"
		}],
		["path", {
			d: "M10 21v-1",
			key: "1u8rkd"
		}],
		["path", {
			d: "m3.64 18.36.7-.7",
			key: "105rm9"
		}],
		["path", {
			d: "m4.34 6.34-.7-.7",
			key: "d3unjp"
		}],
		["path", {
			d: "M14 12h8",
			key: "4f43i9"
		}],
		["path", {
			d: "m17 4-3 3",
			key: "15jcng"
		}],
		["path", {
			d: "m14 17 3 3",
			key: "6tlq38"
		}],
		["path", {
			d: "m21 15-3-3 3-3",
			key: "1nlnje"
		}]
	]);
	const Sun = createLucideIcon("Sun", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "4",
			key: "4exip2"
		}],
		["path", {
			d: "M12 2v2",
			key: "tus03m"
		}],
		["path", {
			d: "M12 20v2",
			key: "1lh1kg"
		}],
		["path", {
			d: "m4.93 4.93 1.41 1.41",
			key: "149t6j"
		}],
		["path", {
			d: "m17.66 17.66 1.41 1.41",
			key: "ptbguv"
		}],
		["path", {
			d: "M2 12h2",
			key: "1t8f8n"
		}],
		["path", {
			d: "M20 12h2",
			key: "1q8mjw"
		}],
		["path", {
			d: "m6.34 17.66-1.41 1.41",
			key: "1m8zz5"
		}],
		["path", {
			d: "m19.07 4.93-1.41 1.41",
			key: "1shlcs"
		}]
	]);
	const Sunrise = createLucideIcon("Sunrise", [
		["path", {
			d: "M12 2v8",
			key: "1q4o3n"
		}],
		["path", {
			d: "m4.93 10.93 1.41 1.41",
			key: "2a7f42"
		}],
		["path", {
			d: "M2 18h2",
			key: "j10viu"
		}],
		["path", {
			d: "M20 18h2",
			key: "wocana"
		}],
		["path", {
			d: "m19.07 10.93-1.41 1.41",
			key: "15zs5n"
		}],
		["path", {
			d: "M22 22H2",
			key: "19qnx5"
		}],
		["path", {
			d: "m8 6 4-4 4 4",
			key: "ybng9g"
		}],
		["path", {
			d: "M16 18a4 4 0 0 0-8 0",
			key: "1lzouq"
		}]
	]);
	const Sunset = createLucideIcon("Sunset", [
		["path", {
			d: "M12 10V2",
			key: "16sf7g"
		}],
		["path", {
			d: "m4.93 10.93 1.41 1.41",
			key: "2a7f42"
		}],
		["path", {
			d: "M2 18h2",
			key: "j10viu"
		}],
		["path", {
			d: "M20 18h2",
			key: "wocana"
		}],
		["path", {
			d: "m19.07 10.93-1.41 1.41",
			key: "15zs5n"
		}],
		["path", {
			d: "M22 22H2",
			key: "19qnx5"
		}],
		["path", {
			d: "m16 6-4 4-4-4",
			key: "6wukr"
		}],
		["path", {
			d: "M16 18a4 4 0 0 0-8 0",
			key: "1lzouq"
		}]
	]);
	const Superscript = createLucideIcon("Superscript", [
		["path", {
			d: "m4 19 8-8",
			key: "hr47gm"
		}],
		["path", {
			d: "m12 19-8-8",
			key: "1dhhmo"
		}],
		["path", {
			d: "M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06",
			key: "1dfcux"
		}]
	]);
	const SwatchBook = createLucideIcon("SwatchBook", [
		["path", {
			d: "M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z",
			key: "1ldrpk"
		}],
		["path", {
			d: "M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7",
			key: "11i5po"
		}],
		["path", {
			d: "M 7 17h.01",
			key: "1euzgo"
		}],
		["path", {
			d: "m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8",
			key: "o2gii7"
		}]
	]);
	const SwissFranc = createLucideIcon("SwissFranc", [
		["path", {
			d: "M10 21V3h8",
			key: "br2l0g"
		}],
		["path", {
			d: "M6 16h9",
			key: "2py0wn"
		}],
		["path", {
			d: "M10 9.5h7",
			key: "13dmhz"
		}]
	]);
	const SwitchCamera = createLucideIcon("SwitchCamera", [
		["path", {
			d: "M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5",
			key: "mtk2lu"
		}],
		["path", {
			d: "M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5",
			key: "120jsl"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "3",
			key: "1v7zrd"
		}],
		["path", {
			d: "m18 22-3-3 3-3",
			key: "kgdoj7"
		}],
		["path", {
			d: "m6 2 3 3-3 3",
			key: "1fnbkv"
		}]
	]);
	const Sword = createLucideIcon("Sword", [
		["polyline", {
			points: "14.5 17.5 3 6 3 3 6 3 17.5 14.5",
			key: "1hfsw2"
		}],
		["line", {
			x1: "13",
			x2: "19",
			y1: "19",
			y2: "13",
			key: "1vrmhu"
		}],
		["line", {
			x1: "16",
			x2: "20",
			y1: "16",
			y2: "20",
			key: "1bron3"
		}],
		["line", {
			x1: "19",
			x2: "21",
			y1: "21",
			y2: "19",
			key: "13pww6"
		}]
	]);
	const Swords = createLucideIcon("Swords", [
		["polyline", {
			points: "14.5 17.5 3 6 3 3 6 3 17.5 14.5",
			key: "1hfsw2"
		}],
		["line", {
			x1: "13",
			x2: "19",
			y1: "19",
			y2: "13",
			key: "1vrmhu"
		}],
		["line", {
			x1: "16",
			x2: "20",
			y1: "16",
			y2: "20",
			key: "1bron3"
		}],
		["line", {
			x1: "19",
			x2: "21",
			y1: "21",
			y2: "19",
			key: "13pww6"
		}],
		["polyline", {
			points: "14.5 6.5 18 3 21 3 21 6 17.5 9.5",
			key: "hbey2j"
		}],
		["line", {
			x1: "5",
			x2: "9",
			y1: "14",
			y2: "18",
			key: "1hf58s"
		}],
		["line", {
			x1: "7",
			x2: "4",
			y1: "17",
			y2: "20",
			key: "pidxm4"
		}],
		["line", {
			x1: "3",
			x2: "5",
			y1: "19",
			y2: "21",
			key: "1pehsh"
		}]
	]);
	const Syringe = createLucideIcon("Syringe", [
		["path", {
			d: "m18 2 4 4",
			key: "22kx64"
		}],
		["path", {
			d: "m17 7 3-3",
			key: "1w1zoj"
		}],
		["path", {
			d: "M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5",
			key: "1exhtz"
		}],
		["path", {
			d: "m9 11 4 4",
			key: "rovt3i"
		}],
		["path", {
			d: "m5 19-3 3",
			key: "59f2uf"
		}],
		["path", {
			d: "m14 4 6 6",
			key: "yqp9t2"
		}]
	]);
	const Table2 = createLucideIcon("Table2", [["path", {
		d: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
		key: "gugj83"
	}]]);
	const TableCellsMerge = createLucideIcon("TableCellsMerge", [
		["path", {
			d: "M12 21v-6",
			key: "lihzve"
		}],
		["path", {
			d: "M12 9V3",
			key: "da5inc"
		}],
		["path", {
			d: "M3 15h18",
			key: "5xshup"
		}],
		["path", {
			d: "M3 9h18",
			key: "1pudct"
		}],
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}]
	]);
	const TableCellsSplit = createLucideIcon("TableCellsSplit", [
		["path", {
			d: "M12 15V9",
			key: "8c7uyn"
		}],
		["path", {
			d: "M3 15h18",
			key: "5xshup"
		}],
		["path", {
			d: "M3 9h18",
			key: "1pudct"
		}],
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}]
	]);
	const TableColumnsSplit = createLucideIcon("TableColumnsSplit", [
		["path", {
			d: "M14 14v2",
			key: "w2a1xv"
		}],
		["path", {
			d: "M14 20v2",
			key: "1lq872"
		}],
		["path", {
			d: "M14 2v2",
			key: "6buw04"
		}],
		["path", {
			d: "M14 8v2",
			key: "i67w9a"
		}],
		["path", {
			d: "M2 15h8",
			key: "82wtch"
		}],
		["path", {
			d: "M2 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2",
			key: "up0l64"
		}],
		["path", {
			d: "M2 9h8",
			key: "yelfik"
		}],
		["path", {
			d: "M22 15h-4",
			key: "1es58f"
		}],
		["path", {
			d: "M22 3h-2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2",
			key: "pdjoqf"
		}],
		["path", {
			d: "M22 9h-4",
			key: "1luja7"
		}],
		["path", {
			d: "M5 3v18",
			key: "14hmio"
		}]
	]);
	const TableOfContents = createLucideIcon("TableOfContents", [
		["path", {
			d: "M16 12H3",
			key: "1a2rj7"
		}],
		["path", {
			d: "M16 18H3",
			key: "12xzn7"
		}],
		["path", {
			d: "M16 6H3",
			key: "1wxfjs"
		}],
		["path", {
			d: "M21 12h.01",
			key: "msek7k"
		}],
		["path", {
			d: "M21 18h.01",
			key: "1e8rq1"
		}],
		["path", {
			d: "M21 6h.01",
			key: "1koanj"
		}]
	]);
	const TableProperties = createLucideIcon("TableProperties", [
		["path", {
			d: "M15 3v18",
			key: "14nvp0"
		}],
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M21 9H3",
			key: "1338ky"
		}],
		["path", {
			d: "M21 15H3",
			key: "9uk58r"
		}]
	]);
	const TableRowsSplit = createLucideIcon("TableRowsSplit", [
		["path", {
			d: "M14 10h2",
			key: "1lstlu"
		}],
		["path", {
			d: "M15 22v-8",
			key: "1fwwgm"
		}],
		["path", {
			d: "M15 2v4",
			key: "1044rn"
		}],
		["path", {
			d: "M2 10h2",
			key: "1r8dkt"
		}],
		["path", {
			d: "M20 10h2",
			key: "1ug425"
		}],
		["path", {
			d: "M3 19h18",
			key: "awlh7x"
		}],
		["path", {
			d: "M3 22v-6a2 2 135 0 1 2-2h14a2 2 45 0 1 2 2v6",
			key: "ibqhof"
		}],
		["path", {
			d: "M3 2v2a2 2 45 0 0 2 2h14a2 2 135 0 0 2-2V2",
			key: "1uenja"
		}],
		["path", {
			d: "M8 10h2",
			key: "66od0"
		}],
		["path", {
			d: "M9 22v-8",
			key: "fmnu31"
		}],
		["path", {
			d: "M9 2v4",
			key: "j1yeou"
		}]
	]);
	const Table = createLucideIcon("Table", [
		["path", {
			d: "M12 3v18",
			key: "108xh3"
		}],
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M3 9h18",
			key: "1pudct"
		}],
		["path", {
			d: "M3 15h18",
			key: "5xshup"
		}]
	]);
	const TabletSmartphone = createLucideIcon("TabletSmartphone", [
		["rect", {
			width: "10",
			height: "14",
			x: "3",
			y: "8",
			rx: "2",
			key: "1vrsiq"
		}],
		["path", {
			d: "M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4",
			key: "1j4zmg"
		}],
		["path", {
			d: "M8 18h.01",
			key: "lrp35t"
		}]
	]);
	const Tablet = createLucideIcon("Tablet", [["rect", {
		width: "16",
		height: "20",
		x: "4",
		y: "2",
		rx: "2",
		ry: "2",
		key: "76otgf"
	}], ["line", {
		x1: "12",
		x2: "12.01",
		y1: "18",
		y2: "18",
		key: "1dp563"
	}]]);
	const Tablets = createLucideIcon("Tablets", [
		["circle", {
			cx: "7",
			cy: "7",
			r: "5",
			key: "x29byf"
		}],
		["circle", {
			cx: "17",
			cy: "17",
			r: "5",
			key: "1op1d2"
		}],
		["path", {
			d: "M12 17h10",
			key: "ls21zv"
		}],
		["path", {
			d: "m3.46 10.54 7.08-7.08",
			key: "1rehiu"
		}]
	]);
	const Tag = createLucideIcon("Tag", [["path", {
		d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
		key: "vktsd0"
	}], ["circle", {
		cx: "7.5",
		cy: "7.5",
		r: ".5",
		fill: "currentColor",
		key: "kqv944"
	}]]);
	const Tags = createLucideIcon("Tags", [
		["path", {
			d: "m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19",
			key: "1cbfv1"
		}],
		["path", {
			d: "M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z",
			key: "135mg7"
		}],
		["circle", {
			cx: "6.5",
			cy: "9.5",
			r: ".5",
			fill: "currentColor",
			key: "5pm5xn"
		}]
	]);
	const Tally1 = createLucideIcon("Tally1", [["path", {
		d: "M4 4v16",
		key: "6qkkli"
	}]]);
	const Tally2 = createLucideIcon("Tally2", [["path", {
		d: "M4 4v16",
		key: "6qkkli"
	}], ["path", {
		d: "M9 4v16",
		key: "81ygyz"
	}]]);
	const Tally3 = createLucideIcon("Tally3", [
		["path", {
			d: "M4 4v16",
			key: "6qkkli"
		}],
		["path", {
			d: "M9 4v16",
			key: "81ygyz"
		}],
		["path", {
			d: "M14 4v16",
			key: "12vmem"
		}]
	]);
	const Tally4 = createLucideIcon("Tally4", [
		["path", {
			d: "M4 4v16",
			key: "6qkkli"
		}],
		["path", {
			d: "M9 4v16",
			key: "81ygyz"
		}],
		["path", {
			d: "M14 4v16",
			key: "12vmem"
		}],
		["path", {
			d: "M19 4v16",
			key: "8ij5ei"
		}]
	]);
	const Tally5 = createLucideIcon("Tally5", [
		["path", {
			d: "M4 4v16",
			key: "6qkkli"
		}],
		["path", {
			d: "M9 4v16",
			key: "81ygyz"
		}],
		["path", {
			d: "M14 4v16",
			key: "12vmem"
		}],
		["path", {
			d: "M19 4v16",
			key: "8ij5ei"
		}],
		["path", {
			d: "M22 6 2 18",
			key: "h9moai"
		}]
	]);
	const Tangent = createLucideIcon("Tangent", [
		["circle", {
			cx: "17",
			cy: "4",
			r: "2",
			key: "y5j2s2"
		}],
		["path", {
			d: "M15.59 5.41 5.41 15.59",
			key: "l0vprr"
		}],
		["circle", {
			cx: "4",
			cy: "17",
			r: "2",
			key: "9p4efm"
		}],
		["path", {
			d: "M12 22s-4-9-1.5-11.5S22 12 22 12",
			key: "1twk4o"
		}]
	]);
	const Target = createLucideIcon("Target", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "6",
			key: "1vlfrh"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "2",
			key: "1c9p78"
		}]
	]);
	const Telescope = createLucideIcon("Telescope", [
		["path", {
			d: "m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44",
			key: "k4qptu"
		}],
		["path", {
			d: "m13.56 11.747 4.332-.924",
			key: "19l80z"
		}],
		["path", {
			d: "m16 21-3.105-6.21",
			key: "7oh9d"
		}],
		["path", {
			d: "M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z",
			key: "m7xp4m"
		}],
		["path", {
			d: "m6.158 8.633 1.114 4.456",
			key: "74o979"
		}],
		["path", {
			d: "m8 21 3.105-6.21",
			key: "1fvxut"
		}],
		["circle", {
			cx: "12",
			cy: "13",
			r: "2",
			key: "1c1ljs"
		}]
	]);
	const TentTree = createLucideIcon("TentTree", [
		["circle", {
			cx: "4",
			cy: "4",
			r: "2",
			key: "bt5ra8"
		}],
		["path", {
			d: "m14 5 3-3 3 3",
			key: "1sorif"
		}],
		["path", {
			d: "m14 10 3-3 3 3",
			key: "1jyi9h"
		}],
		["path", {
			d: "M17 14V2",
			key: "8ymqnk"
		}],
		["path", {
			d: "M17 14H7l-5 8h20Z",
			key: "13ar7p"
		}],
		["path", {
			d: "M8 14v8",
			key: "1ghmqk"
		}],
		["path", {
			d: "m9 14 5 8",
			key: "13pgi6"
		}]
	]);
	const Tent = createLucideIcon("Tent", [
		["path", {
			d: "M3.5 21 14 3",
			key: "1szst5"
		}],
		["path", {
			d: "M20.5 21 10 3",
			key: "1310c3"
		}],
		["path", {
			d: "M15.5 21 12 15l-3.5 6",
			key: "1ddtfw"
		}],
		["path", {
			d: "M2 21h20",
			key: "1nyx9w"
		}]
	]);
	const Terminal = createLucideIcon("Terminal", [["polyline", {
		points: "4 17 10 11 4 5",
		key: "akl6gq"
	}], ["line", {
		x1: "12",
		x2: "20",
		y1: "19",
		y2: "19",
		key: "q2wloq"
	}]]);
	const TestTubeDiagonal = createLucideIcon("TestTubeDiagonal", [
		["path", {
			d: "M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3",
			key: "1ub6xw"
		}],
		["path", {
			d: "m16 2 6 6",
			key: "1gw87d"
		}],
		["path", {
			d: "M12 16H4",
			key: "1cjfip"
		}]
	]);
	const TestTube = createLucideIcon("TestTube", [
		["path", {
			d: "M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2",
			key: "125lnx"
		}],
		["path", {
			d: "M8.5 2h7",
			key: "csnxdl"
		}],
		["path", {
			d: "M14.5 16h-5",
			key: "1ox875"
		}]
	]);
	const TestTubes = createLucideIcon("TestTubes", [
		["path", {
			d: "M9 2v17.5A2.5 2.5 0 0 1 6.5 22A2.5 2.5 0 0 1 4 19.5V2",
			key: "1hjrqt"
		}],
		["path", {
			d: "M20 2v17.5a2.5 2.5 0 0 1-2.5 2.5a2.5 2.5 0 0 1-2.5-2.5V2",
			key: "16lc8n"
		}],
		["path", {
			d: "M3 2h7",
			key: "7s29d5"
		}],
		["path", {
			d: "M14 2h7",
			key: "7sicin"
		}],
		["path", {
			d: "M9 16H4",
			key: "1bfye3"
		}],
		["path", {
			d: "M20 16h-5",
			key: "ddnjpe"
		}]
	]);
	const TextCursorInput = createLucideIcon("TextCursorInput", [
		["path", {
			d: "M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1",
			key: "18xjzo"
		}],
		["path", {
			d: "M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5",
			key: "fj48gi"
		}],
		["path", {
			d: "M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1",
			key: "1n9rhb"
		}],
		["path", {
			d: "M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7",
			key: "13ksps"
		}],
		["path", {
			d: "M9 7v10",
			key: "1vc8ob"
		}]
	]);
	const TextCursor = createLucideIcon("TextCursor", [
		["path", {
			d: "M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1",
			key: "uvaxm9"
		}],
		["path", {
			d: "M7 22h1a4 4 0 0 0 4-4v-1",
			key: "11xy8d"
		}],
		["path", {
			d: "M7 2h1a4 4 0 0 1 4 4v1",
			key: "1uw06m"
		}]
	]);
	const TextQuote = createLucideIcon("TextQuote", [
		["path", {
			d: "M17 6H3",
			key: "16j9eg"
		}],
		["path", {
			d: "M21 12H8",
			key: "scolzb"
		}],
		["path", {
			d: "M21 18H8",
			key: "1wfozv"
		}],
		["path", {
			d: "M3 12v6",
			key: "fv4c87"
		}]
	]);
	const TextSearch = createLucideIcon("TextSearch", [
		["path", {
			d: "M21 6H3",
			key: "1jwq7v"
		}],
		["path", {
			d: "M10 12H3",
			key: "1ulcyk"
		}],
		["path", {
			d: "M10 18H3",
			key: "13769t"
		}],
		["circle", {
			cx: "17",
			cy: "15",
			r: "3",
			key: "1upz2a"
		}],
		["path", {
			d: "m21 19-1.9-1.9",
			key: "dwi7p8"
		}]
	]);
	const TextSelect = createLucideIcon("TextSelect", [
		["path", {
			d: "M5 3a2 2 0 0 0-2 2",
			key: "y57alp"
		}],
		["path", {
			d: "M19 3a2 2 0 0 1 2 2",
			key: "18rm91"
		}],
		["path", {
			d: "M21 19a2 2 0 0 1-2 2",
			key: "1j7049"
		}],
		["path", {
			d: "M5 21a2 2 0 0 1-2-2",
			key: "sbafld"
		}],
		["path", {
			d: "M9 3h1",
			key: "1yesri"
		}],
		["path", {
			d: "M9 21h1",
			key: "15o7lz"
		}],
		["path", {
			d: "M14 3h1",
			key: "1ec4yj"
		}],
		["path", {
			d: "M14 21h1",
			key: "v9vybs"
		}],
		["path", {
			d: "M3 9v1",
			key: "1r0deq"
		}],
		["path", {
			d: "M21 9v1",
			key: "mxsmne"
		}],
		["path", {
			d: "M3 14v1",
			key: "vnatye"
		}],
		["path", {
			d: "M21 14v1",
			key: "169vum"
		}],
		["line", {
			x1: "7",
			x2: "15",
			y1: "8",
			y2: "8",
			key: "1758g8"
		}],
		["line", {
			x1: "7",
			x2: "17",
			y1: "12",
			y2: "12",
			key: "197423"
		}],
		["line", {
			x1: "7",
			x2: "13",
			y1: "16",
			y2: "16",
			key: "37cgm6"
		}]
	]);
	const Text = createLucideIcon("Text", [
		["path", {
			d: "M17 6.1H3",
			key: "wptmhv"
		}],
		["path", {
			d: "M21 12.1H3",
			key: "1j38uz"
		}],
		["path", {
			d: "M15.1 18H3",
			key: "1nb16a"
		}]
	]);
	const Theater = createLucideIcon("Theater", [
		["path", {
			d: "M2 10s3-3 3-8",
			key: "3xiif0"
		}],
		["path", {
			d: "M22 10s-3-3-3-8",
			key: "ioaa5q"
		}],
		["path", {
			d: "M10 2c0 4.4-3.6 8-8 8",
			key: "16fkpi"
		}],
		["path", {
			d: "M14 2c0 4.4 3.6 8 8 8",
			key: "b9eulq"
		}],
		["path", {
			d: "M2 10s2 2 2 5",
			key: "1au1lb"
		}],
		["path", {
			d: "M22 10s-2 2-2 5",
			key: "qi2y5e"
		}],
		["path", {
			d: "M8 15h8",
			key: "45n4r"
		}],
		["path", {
			d: "M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1",
			key: "1vsc2m"
		}],
		["path", {
			d: "M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1",
			key: "hrha4u"
		}]
	]);
	const ThermometerSnowflake = createLucideIcon("ThermometerSnowflake", [
		["path", {
			d: "M2 12h10",
			key: "19562f"
		}],
		["path", {
			d: "M9 4v16",
			key: "81ygyz"
		}],
		["path", {
			d: "m3 9 3 3-3 3",
			key: "1sas0l"
		}],
		["path", {
			d: "M12 6 9 9 6 6",
			key: "pfrgxu"
		}],
		["path", {
			d: "m6 18 3-3 1.5 1.5",
			key: "1e277p"
		}],
		["path", {
			d: "M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z",
			key: "iof6y5"
		}]
	]);
	const ThermometerSun = createLucideIcon("ThermometerSun", [
		["path", {
			d: "M12 9a4 4 0 0 0-2 7.5",
			key: "1jvsq6"
		}],
		["path", {
			d: "M12 3v2",
			key: "1w22ol"
		}],
		["path", {
			d: "m6.6 18.4-1.4 1.4",
			key: "w2yidj"
		}],
		["path", {
			d: "M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z",
			key: "iof6y5"
		}],
		["path", {
			d: "M4 13H2",
			key: "118le4"
		}],
		["path", {
			d: "M6.34 7.34 4.93 5.93",
			key: "1brd51"
		}]
	]);
	const Thermometer = createLucideIcon("Thermometer", [["path", {
		d: "M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z",
		key: "17jzev"
	}]]);
	const ThumbsDown = createLucideIcon("ThumbsDown", [["path", {
		d: "M17 14V2",
		key: "8ymqnk"
	}], ["path", {
		d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z",
		key: "m61m77"
	}]]);
	const ThumbsUp = createLucideIcon("ThumbsUp", [["path", {
		d: "M7 10v12",
		key: "1qc93n"
	}], ["path", {
		d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",
		key: "emmmcr"
	}]]);
	const TicketCheck = createLucideIcon("TicketCheck", [["path", {
		d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
		key: "qn84l0"
	}], ["path", {
		d: "m9 12 2 2 4-4",
		key: "dzmm74"
	}]]);
	const TicketMinus = createLucideIcon("TicketMinus", [["path", {
		d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
		key: "qn84l0"
	}], ["path", {
		d: "M9 12h6",
		key: "1c52cq"
	}]]);
	const TicketPercent = createLucideIcon("TicketPercent", [
		["path", {
			d: "M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
			key: "1l48ns"
		}],
		["path", {
			d: "M9 9h.01",
			key: "1q5me6"
		}],
		["path", {
			d: "m15 9-6 6",
			key: "1uzhvr"
		}],
		["path", {
			d: "M15 15h.01",
			key: "lqbp3k"
		}]
	]);
	const TicketPlus = createLucideIcon("TicketPlus", [
		["path", {
			d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
			key: "qn84l0"
		}],
		["path", {
			d: "M9 12h6",
			key: "1c52cq"
		}],
		["path", {
			d: "M12 9v6",
			key: "199k2o"
		}]
	]);
	const TicketSlash = createLucideIcon("TicketSlash", [["path", {
		d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
		key: "qn84l0"
	}], ["path", {
		d: "m9.5 14.5 5-5",
		key: "qviqfa"
	}]]);
	const TicketX = createLucideIcon("TicketX", [
		["path", {
			d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
			key: "qn84l0"
		}],
		["path", {
			d: "m9.5 14.5 5-5",
			key: "qviqfa"
		}],
		["path", {
			d: "m9.5 9.5 5 5",
			key: "18nt4w"
		}]
	]);
	const Ticket = createLucideIcon("Ticket", [
		["path", {
			d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
			key: "qn84l0"
		}],
		["path", {
			d: "M13 5v2",
			key: "dyzc3o"
		}],
		["path", {
			d: "M13 17v2",
			key: "1ont0d"
		}],
		["path", {
			d: "M13 11v2",
			key: "1wjjxi"
		}]
	]);
	const TicketsPlane = createLucideIcon("TicketsPlane", [
		["path", {
			d: "M10.5 17h1.227a2 2 0 0 0 1.345-.52L18 12",
			key: "16muxl"
		}],
		["path", {
			d: "m12 13.5 3.75.5",
			key: "1i9qhk"
		}],
		["path", {
			d: "m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8",
			key: "12lg5p"
		}],
		["path", {
			d: "M6 10V8",
			key: "1y41hn"
		}],
		["path", {
			d: "M6 14v1",
			key: "cao2tf"
		}],
		["path", {
			d: "M6 19v2",
			key: "1loha6"
		}],
		["rect", {
			x: "2",
			y: "8",
			width: "20",
			height: "13",
			rx: "2",
			key: "p3bz5l"
		}]
	]);
	const Tickets = createLucideIcon("Tickets", [
		["path", {
			d: "m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8",
			key: "12lg5p"
		}],
		["path", {
			d: "M6 10V8",
			key: "1y41hn"
		}],
		["path", {
			d: "M6 14v1",
			key: "cao2tf"
		}],
		["path", {
			d: "M6 19v2",
			key: "1loha6"
		}],
		["rect", {
			x: "2",
			y: "8",
			width: "20",
			height: "13",
			rx: "2",
			key: "p3bz5l"
		}]
	]);
	const TimerOff = createLucideIcon("TimerOff", [
		["path", {
			d: "M10 2h4",
			key: "n1abiw"
		}],
		["path", {
			d: "M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7",
			key: "10he05"
		}],
		["path", {
			d: "M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2",
			key: "15f7sh"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M12 12v-2",
			key: "fwoke6"
		}]
	]);
	const TimerReset = createLucideIcon("TimerReset", [
		["path", {
			d: "M10 2h4",
			key: "n1abiw"
		}],
		["path", {
			d: "M12 14v-4",
			key: "1evpnu"
		}],
		["path", {
			d: "M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6",
			key: "1ts96g"
		}],
		["path", {
			d: "M9 17H4v5",
			key: "8t5av"
		}]
	]);
	const Timer = createLucideIcon("Timer", [
		["line", {
			x1: "10",
			x2: "14",
			y1: "2",
			y2: "2",
			key: "14vaq8"
		}],
		["line", {
			x1: "12",
			x2: "15",
			y1: "14",
			y2: "11",
			key: "17fdiu"
		}],
		["circle", {
			cx: "12",
			cy: "14",
			r: "8",
			key: "1e1u0o"
		}]
	]);
	const ToggleLeft = createLucideIcon("ToggleLeft", [["rect", {
		width: "20",
		height: "12",
		x: "2",
		y: "6",
		rx: "6",
		ry: "6",
		key: "f2vt7d"
	}], ["circle", {
		cx: "8",
		cy: "12",
		r: "2",
		key: "1nvbw3"
	}]]);
	const ToggleRight = createLucideIcon("ToggleRight", [["rect", {
		width: "20",
		height: "12",
		x: "2",
		y: "6",
		rx: "6",
		ry: "6",
		key: "f2vt7d"
	}], ["circle", {
		cx: "16",
		cy: "12",
		r: "2",
		key: "4ma0v8"
	}]]);
	const Toilet = createLucideIcon("Toilet", [["path", {
		d: "M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18",
		key: "kc4kqr"
	}], ["path", {
		d: "M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8",
		key: "1tqs57"
	}]]);
	const Tornado = createLucideIcon("Tornado", [
		["path", {
			d: "M21 4H3",
			key: "1hwok0"
		}],
		["path", {
			d: "M18 8H6",
			key: "41n648"
		}],
		["path", {
			d: "M19 12H9",
			key: "1g4lpz"
		}],
		["path", {
			d: "M16 16h-6",
			key: "1j5d54"
		}],
		["path", {
			d: "M11 20H9",
			key: "39obr8"
		}]
	]);
	const Torus = createLucideIcon("Torus", [["ellipse", {
		cx: "12",
		cy: "11",
		rx: "3",
		ry: "2",
		key: "1b2qxu"
	}], ["ellipse", {
		cx: "12",
		cy: "12.5",
		rx: "10",
		ry: "8.5",
		key: "h8emeu"
	}]]);
	const TouchpadOff = createLucideIcon("TouchpadOff", [
		["path", {
			d: "M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16",
			key: "lnt0bk"
		}],
		["path", {
			d: "M2 14h12",
			key: "d8icqz"
		}],
		["path", {
			d: "M22 14h-2",
			key: "jrx26d"
		}],
		["path", {
			d: "M12 20v-6",
			key: "1rm09r"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "M22 16V6a2 2 0 0 0-2-2H10",
			key: "11y8e4"
		}]
	]);
	const Touchpad = createLucideIcon("Touchpad", [
		["rect", {
			width: "20",
			height: "16",
			x: "2",
			y: "4",
			rx: "2",
			key: "18n3k1"
		}],
		["path", {
			d: "M2 14h20",
			key: "myj16y"
		}],
		["path", {
			d: "M12 20v-6",
			key: "1rm09r"
		}]
	]);
	const TowerControl = createLucideIcon("TowerControl", [
		["path", {
			d: "M18.2 12.27 20 6H4l1.8 6.27a1 1 0 0 0 .95.73h10.5a1 1 0 0 0 .96-.73Z",
			key: "1pledb"
		}],
		["path", {
			d: "M8 13v9",
			key: "hmv0ci"
		}],
		["path", {
			d: "M16 22v-9",
			key: "ylnf1u"
		}],
		["path", {
			d: "m9 6 1 7",
			key: "dpdgam"
		}],
		["path", {
			d: "m15 6-1 7",
			key: "ls7zgu"
		}],
		["path", {
			d: "M12 6V2",
			key: "1pj48d"
		}],
		["path", {
			d: "M13 2h-2",
			key: "mj6ths"
		}]
	]);
	const ToyBrick = createLucideIcon("ToyBrick", [
		["rect", {
			width: "18",
			height: "12",
			x: "3",
			y: "8",
			rx: "1",
			key: "158fvp"
		}],
		["path", {
			d: "M10 8V5c0-.6-.4-1-1-1H6a1 1 0 0 0-1 1v3",
			key: "s0042v"
		}],
		["path", {
			d: "M19 8V5c0-.6-.4-1-1-1h-3a1 1 0 0 0-1 1v3",
			key: "9wmeh2"
		}]
	]);
	const Tractor = createLucideIcon("Tractor", [
		["path", {
			d: "m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20",
			key: "she1j9"
		}],
		["path", {
			d: "M16 18h-5",
			key: "bq60fd"
		}],
		["path", {
			d: "M18 5a1 1 0 0 0-1 1v5.573",
			key: "1kv8ia"
		}],
		["path", {
			d: "M3 4h8.129a1 1 0 0 1 .99.863L13 11.246",
			key: "1q1ert"
		}],
		["path", {
			d: "M4 11V4",
			key: "9ft8pt"
		}],
		["path", {
			d: "M7 15h.01",
			key: "k5ht0j"
		}],
		["path", {
			d: "M8 10.1V4",
			key: "1jgyzo"
		}],
		["circle", {
			cx: "18",
			cy: "18",
			r: "2",
			key: "1emm8v"
		}],
		["circle", {
			cx: "7",
			cy: "15",
			r: "5",
			key: "ddtuc"
		}]
	]);
	const TrafficCone = createLucideIcon("TrafficCone", [
		["path", {
			d: "M9.3 6.2a4.55 4.55 0 0 0 5.4 0",
			key: "flyxqv"
		}],
		["path", {
			d: "M7.9 10.7c.9.8 2.4 1.3 4.1 1.3s3.2-.5 4.1-1.3",
			key: "1nlxxg"
		}],
		["path", {
			d: "M13.9 3.5a1.93 1.93 0 0 0-3.8-.1l-3 10c-.1.2-.1.4-.1.6 0 1.7 2.2 3 5 3s5-1.3 5-3c0-.2 0-.4-.1-.5Z",
			key: "vz7x1l"
		}],
		["path", {
			d: "m7.5 12.2-4.7 2.7c-.5.3-.8.7-.8 1.1s.3.8.8 1.1l7.6 4.5c.9.5 2.1.5 3 0l7.6-4.5c.7-.3 1-.7 1-1.1s-.3-.8-.8-1.1l-4.7-2.8",
			key: "1xfzlw"
		}]
	]);
	const TrainFrontTunnel = createLucideIcon("TrainFrontTunnel", [
		["path", {
			d: "M2 22V12a10 10 0 1 1 20 0v10",
			key: "o0fyp0"
		}],
		["path", {
			d: "M15 6.8v1.4a3 2.8 0 1 1-6 0V6.8",
			key: "m8q3n9"
		}],
		["path", {
			d: "M10 15h.01",
			key: "44in9x"
		}],
		["path", {
			d: "M14 15h.01",
			key: "5mohn5"
		}],
		["path", {
			d: "M10 19a4 4 0 0 1-4-4v-3a6 6 0 1 1 12 0v3a4 4 0 0 1-4 4Z",
			key: "hckbmu"
		}],
		["path", {
			d: "m9 19-2 3",
			key: "iij7hm"
		}],
		["path", {
			d: "m15 19 2 3",
			key: "npx8sa"
		}]
	]);
	const TrainFront = createLucideIcon("TrainFront", [
		["path", {
			d: "M8 3.1V7a4 4 0 0 0 8 0V3.1",
			key: "1v71zp"
		}],
		["path", {
			d: "m9 15-1-1",
			key: "1yrq24"
		}],
		["path", {
			d: "m15 15 1-1",
			key: "1t0d6s"
		}],
		["path", {
			d: "M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z",
			key: "1p0hjs"
		}],
		["path", {
			d: "m8 19-2 3",
			key: "13i0xs"
		}],
		["path", {
			d: "m16 19 2 3",
			key: "xo31yx"
		}]
	]);
	const TrainTrack = createLucideIcon("TrainTrack", [
		["path", {
			d: "M2 17 17 2",
			key: "18b09t"
		}],
		["path", {
			d: "m2 14 8 8",
			key: "1gv9hu"
		}],
		["path", {
			d: "m5 11 8 8",
			key: "189pqp"
		}],
		["path", {
			d: "m8 8 8 8",
			key: "1imecy"
		}],
		["path", {
			d: "m11 5 8 8",
			key: "ummqn6"
		}],
		["path", {
			d: "m14 2 8 8",
			key: "1vk7dn"
		}],
		["path", {
			d: "M7 22 22 7",
			key: "15mb1i"
		}]
	]);
	const TramFront = createLucideIcon("TramFront", [
		["rect", {
			width: "16",
			height: "16",
			x: "4",
			y: "3",
			rx: "2",
			key: "1wxw4b"
		}],
		["path", {
			d: "M4 11h16",
			key: "mpoxn0"
		}],
		["path", {
			d: "M12 3v8",
			key: "1h2ygw"
		}],
		["path", {
			d: "m8 19-2 3",
			key: "13i0xs"
		}],
		["path", {
			d: "m18 22-2-3",
			key: "1p0ohu"
		}],
		["path", {
			d: "M8 15h.01",
			key: "a7atzg"
		}],
		["path", {
			d: "M16 15h.01",
			key: "rnfrdf"
		}]
	]);
	const Trash2 = createLucideIcon("Trash2", [
		["path", {
			d: "M3 6h18",
			key: "d0wm0j"
		}],
		["path", {
			d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",
			key: "4alrt4"
		}],
		["path", {
			d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",
			key: "v07s0e"
		}],
		["line", {
			x1: "10",
			x2: "10",
			y1: "11",
			y2: "17",
			key: "1uufr5"
		}],
		["line", {
			x1: "14",
			x2: "14",
			y1: "11",
			y2: "17",
			key: "xtxkd"
		}]
	]);
	const Trash = createLucideIcon("Trash", [
		["path", {
			d: "M3 6h18",
			key: "d0wm0j"
		}],
		["path", {
			d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",
			key: "4alrt4"
		}],
		["path", {
			d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",
			key: "v07s0e"
		}]
	]);
	const TreeDeciduous = createLucideIcon("TreeDeciduous", [["path", {
		d: "M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z",
		key: "oadzkq"
	}], ["path", {
		d: "M12 19v3",
		key: "npa21l"
	}]]);
	const TreePalm = createLucideIcon("TreePalm", [
		["path", {
			d: "M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4",
			key: "foxbe7"
		}],
		["path", {
			d: "M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3",
			key: "18arnh"
		}],
		["path", {
			d: "M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35",
			key: "ywahnh"
		}],
		["path", {
			d: "M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14",
			key: "ft0feo"
		}]
	]);
	const TreePine = createLucideIcon("TreePine", [["path", {
		d: "m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z",
		key: "cpyugq"
	}], ["path", {
		d: "M12 22v-3",
		key: "kmzjlo"
	}]]);
	const Trees = createLucideIcon("Trees", [
		["path", {
			d: "M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z",
			key: "1l6gj6"
		}],
		["path", {
			d: "M7 16v6",
			key: "1a82de"
		}],
		["path", {
			d: "M13 19v3",
			key: "13sx9i"
		}],
		["path", {
			d: "M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5",
			key: "1sj9kv"
		}]
	]);
	const Trello = createLucideIcon("Trello", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			ry: "2",
			key: "1m3agn"
		}],
		["rect", {
			width: "3",
			height: "9",
			x: "7",
			y: "7",
			key: "14n3xi"
		}],
		["rect", {
			width: "3",
			height: "5",
			x: "14",
			y: "7",
			key: "s4azjd"
		}]
	]);
	const TrendingDown = createLucideIcon("TrendingDown", [["polyline", {
		points: "22 17 13.5 8.5 8.5 13.5 2 7",
		key: "1r2t7k"
	}], ["polyline", {
		points: "16 17 22 17 22 11",
		key: "11uiuu"
	}]]);
	const TrendingUpDown = createLucideIcon("TrendingUpDown", [
		["path", {
			d: "M14.828 14.828 21 21",
			key: "ar5fw7"
		}],
		["path", {
			d: "M21 16v5h-5",
			key: "1ck2sf"
		}],
		["path", {
			d: "m21 3-9 9-4-4-6 6",
			key: "1h02xo"
		}],
		["path", {
			d: "M21 8V3h-5",
			key: "1qoq8a"
		}]
	]);
	const TrendingUp = createLucideIcon("TrendingUp", [["polyline", {
		points: "22 7 13.5 15.5 8.5 10.5 2 17",
		key: "126l90"
	}], ["polyline", {
		points: "16 7 22 7 22 13",
		key: "kwv8wd"
	}]]);
	const TriangleAlert = createLucideIcon("TriangleAlert", [
		["path", {
			d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
			key: "wmoenq"
		}],
		["path", {
			d: "M12 9v4",
			key: "juzpu7"
		}],
		["path", {
			d: "M12 17h.01",
			key: "p32p05"
		}]
	]);
	const TriangleRight = createLucideIcon("TriangleRight", [["path", {
		d: "M22 18a2 2 0 0 1-2 2H3c-1.1 0-1.3-.6-.4-1.3L20.4 4.3c.9-.7 1.6-.4 1.6.7Z",
		key: "183wce"
	}]]);
	const Triangle = createLucideIcon("Triangle", [["path", {
		d: "M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",
		key: "14u9p9"
	}]]);
	const Trophy = createLucideIcon("Trophy", [
		["path", {
			d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6",
			key: "17hqa7"
		}],
		["path", {
			d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18",
			key: "lmptdp"
		}],
		["path", {
			d: "M4 22h16",
			key: "57wxv0"
		}],
		["path", {
			d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22",
			key: "1nw9bq"
		}],
		["path", {
			d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22",
			key: "1np0yb"
		}],
		["path", {
			d: "M18 2H6v7a6 6 0 0 0 12 0V2Z",
			key: "u46fv3"
		}]
	]);
	const Truck = createLucideIcon("Truck", [
		["path", {
			d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",
			key: "wrbu53"
		}],
		["path", {
			d: "M15 18H9",
			key: "1lyqi6"
		}],
		["path", {
			d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
			key: "lysw3i"
		}],
		["circle", {
			cx: "17",
			cy: "18",
			r: "2",
			key: "332jqn"
		}],
		["circle", {
			cx: "7",
			cy: "18",
			r: "2",
			key: "19iecd"
		}]
	]);
	const Turtle = createLucideIcon("Turtle", [
		["path", {
			d: "m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z",
			key: "1lbbv7"
		}],
		["path", {
			d: "M4.82 7.9 8 10",
			key: "m9wose"
		}],
		["path", {
			d: "M15.18 7.9 12 10",
			key: "p8dp2u"
		}],
		["path", {
			d: "M16.93 10H20a2 2 0 0 1 0 4H2",
			key: "12nsm7"
		}]
	]);
	const TvMinimalPlay = createLucideIcon("TvMinimalPlay", [
		["path", {
			d: "M10 7.75a.75.75 0 0 1 1.142-.638l3.664 2.249a.75.75 0 0 1 0 1.278l-3.664 2.25a.75.75 0 0 1-1.142-.64z",
			key: "1pctta"
		}],
		["path", {
			d: "M7 21h10",
			key: "1b0cd5"
		}],
		["rect", {
			width: "20",
			height: "14",
			x: "2",
			y: "3",
			rx: "2",
			key: "48i651"
		}]
	]);
	const TvMinimal = createLucideIcon("TvMinimal", [["path", {
		d: "M7 21h10",
		key: "1b0cd5"
	}], ["rect", {
		width: "20",
		height: "14",
		x: "2",
		y: "3",
		rx: "2",
		key: "48i651"
	}]]);
	const Tv = createLucideIcon("Tv", [["rect", {
		width: "20",
		height: "15",
		x: "2",
		y: "7",
		rx: "2",
		ry: "2",
		key: "10ag99"
	}], ["polyline", {
		points: "17 2 12 7 7 2",
		key: "11pgbg"
	}]]);
	const Twitch = createLucideIcon("Twitch", [["path", {
		d: "M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7",
		key: "c0yzno"
	}]]);
	const Twitter = createLucideIcon("Twitter", [["path", {
		d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
		key: "pff0z6"
	}]]);
	const TypeOutline = createLucideIcon("TypeOutline", [["path", {
		d: "M14 16.5a.5.5 0 0 0 .5.5h.5a2 2 0 0 1 0 4H9a2 2 0 0 1 0-4h.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V8a2 2 0 0 1-4 0V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-4 0v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5Z",
		key: "1reda3"
	}]]);
	const Type = createLucideIcon("Type", [
		["polyline", {
			points: "4 7 4 4 20 4 20 7",
			key: "1nosan"
		}],
		["line", {
			x1: "9",
			x2: "15",
			y1: "20",
			y2: "20",
			key: "swin9y"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "4",
			y2: "20",
			key: "1tx1rr"
		}]
	]);
	const UmbrellaOff = createLucideIcon("UmbrellaOff", [
		["path", {
			d: "M12 2v1",
			key: "11qlp1"
		}],
		["path", {
			d: "M15.5 21a1.85 1.85 0 0 1-3.5-1v-8H2a10 10 0 0 1 3.428-6.575",
			key: "eki10q"
		}],
		["path", {
			d: "M17.5 12H22A10 10 0 0 0 9.004 3.455",
			key: "n2ayka"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]);
	const Umbrella = createLucideIcon("Umbrella", [
		["path", {
			d: "M22 12a10.06 10.06 1 0 0-20 0Z",
			key: "1teyop"
		}],
		["path", {
			d: "M12 12v8a2 2 0 0 0 4 0",
			key: "ulpmoc"
		}],
		["path", {
			d: "M12 2v1",
			key: "11qlp1"
		}]
	]);
	const Underline = createLucideIcon("Underline", [["path", {
		d: "M6 4v6a6 6 0 0 0 12 0V4",
		key: "9kb039"
	}], ["line", {
		x1: "4",
		x2: "20",
		y1: "20",
		y2: "20",
		key: "nun2al"
	}]]);
	const Undo2 = createLucideIcon("Undo2", [["path", {
		d: "M9 14 4 9l5-5",
		key: "102s5s"
	}], ["path", {
		d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
		key: "f3b9sd"
	}]]);
	const UndoDot = createLucideIcon("UndoDot", [
		["path", {
			d: "M21 17a9 9 0 0 0-15-6.7L3 13",
			key: "8mp6z9"
		}],
		["path", {
			d: "M3 7v6h6",
			key: "1v2h90"
		}],
		["circle", {
			cx: "12",
			cy: "17",
			r: "1",
			key: "1ixnty"
		}]
	]);
	const Undo = createLucideIcon("Undo", [["path", {
		d: "M3 7v6h6",
		key: "1v2h90"
	}], ["path", {
		d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",
		key: "1r6uu6"
	}]]);
	const UnfoldHorizontal = createLucideIcon("UnfoldHorizontal", [
		["path", {
			d: "M16 12h6",
			key: "15xry1"
		}],
		["path", {
			d: "M8 12H2",
			key: "1jqql6"
		}],
		["path", {
			d: "M12 2v2",
			key: "tus03m"
		}],
		["path", {
			d: "M12 8v2",
			key: "1woqiv"
		}],
		["path", {
			d: "M12 14v2",
			key: "8jcxud"
		}],
		["path", {
			d: "M12 20v2",
			key: "1lh1kg"
		}],
		["path", {
			d: "m19 15 3-3-3-3",
			key: "wjy7rq"
		}],
		["path", {
			d: "m5 9-3 3 3 3",
			key: "j64kie"
		}]
	]);
	const UnfoldVertical = createLucideIcon("UnfoldVertical", [
		["path", {
			d: "M12 22v-6",
			key: "6o8u61"
		}],
		["path", {
			d: "M12 8V2",
			key: "1wkif3"
		}],
		["path", {
			d: "M4 12H2",
			key: "rhcxmi"
		}],
		["path", {
			d: "M10 12H8",
			key: "s88cx1"
		}],
		["path", {
			d: "M16 12h-2",
			key: "10asgb"
		}],
		["path", {
			d: "M22 12h-2",
			key: "14jgyd"
		}],
		["path", {
			d: "m15 19-3 3-3-3",
			key: "11eu04"
		}],
		["path", {
			d: "m15 5-3-3-3 3",
			key: "itvq4r"
		}]
	]);
	const Ungroup = createLucideIcon("Ungroup", [["rect", {
		width: "8",
		height: "6",
		x: "5",
		y: "4",
		rx: "1",
		key: "nzclkv"
	}], ["rect", {
		width: "8",
		height: "6",
		x: "11",
		y: "14",
		rx: "1",
		key: "4tytwb"
	}]]);
	const University = createLucideIcon("University", [
		["circle", {
			cx: "12",
			cy: "10",
			r: "1",
			key: "1gnqs8"
		}],
		["path", {
			d: "M22 20V8h-4l-6-4-6 4H2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2",
			key: "1qj5sn"
		}],
		["path", {
			d: "M6 17v.01",
			key: "roodi6"
		}],
		["path", {
			d: "M6 13v.01",
			key: "67c122"
		}],
		["path", {
			d: "M18 17v.01",
			key: "12ktxm"
		}],
		["path", {
			d: "M18 13v.01",
			key: "tn1rt1"
		}],
		["path", {
			d: "M14 22v-5a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5",
			key: "11g7fi"
		}]
	]);
	const Unlink2 = createLucideIcon("Unlink2", [["path", {
		d: "M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2",
		key: "1re2ne"
	}]]);
	const Unlink = createLucideIcon("Unlink", [
		["path", {
			d: "m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71",
			key: "yqzxt4"
		}],
		["path", {
			d: "m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71",
			key: "4qinb0"
		}],
		["line", {
			x1: "8",
			x2: "8",
			y1: "2",
			y2: "5",
			key: "1041cp"
		}],
		["line", {
			x1: "2",
			x2: "5",
			y1: "8",
			y2: "8",
			key: "14m1p5"
		}],
		["line", {
			x1: "16",
			x2: "16",
			y1: "19",
			y2: "22",
			key: "rzdirn"
		}],
		["line", {
			x1: "19",
			x2: "22",
			y1: "16",
			y2: "16",
			key: "ox905f"
		}]
	]);
	const Unplug = createLucideIcon("Unplug", [
		["path", {
			d: "m19 5 3-3",
			key: "yk6iyv"
		}],
		["path", {
			d: "m2 22 3-3",
			key: "19mgm9"
		}],
		["path", {
			d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z",
			key: "goz73y"
		}],
		["path", {
			d: "M7.5 13.5 10 11",
			key: "7xgeeb"
		}],
		["path", {
			d: "M10.5 16.5 13 14",
			key: "10btkg"
		}],
		["path", {
			d: "m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z",
			key: "1snsnr"
		}]
	]);
	const Upload = createLucideIcon("Upload", [
		["path", {
			d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
			key: "ih7n3h"
		}],
		["polyline", {
			points: "17 8 12 3 7 8",
			key: "t8dd8p"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "3",
			y2: "15",
			key: "widbto"
		}]
	]);
	const Usb = createLucideIcon("Usb", [
		["circle", {
			cx: "10",
			cy: "7",
			r: "1",
			key: "dypaad"
		}],
		["circle", {
			cx: "4",
			cy: "20",
			r: "1",
			key: "22iqad"
		}],
		["path", {
			d: "M4.7 19.3 19 5",
			key: "1enqfc"
		}],
		["path", {
			d: "m21 3-3 1 2 2Z",
			key: "d3ov82"
		}],
		["path", {
			d: "M9.26 7.68 5 12l2 5",
			key: "1esawj"
		}],
		["path", {
			d: "m10 14 5 2 3.5-3.5",
			key: "v8oal5"
		}],
		["path", {
			d: "m18 12 1-1 1 1-1 1Z",
			key: "1bh22v"
		}]
	]);
	const UserCheck = createLucideIcon("UserCheck", [
		["path", {
			d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
			key: "1yyitq"
		}],
		["circle", {
			cx: "9",
			cy: "7",
			r: "4",
			key: "nufk8"
		}],
		["polyline", {
			points: "16 11 18 13 22 9",
			key: "1pwet4"
		}]
	]);
	const UserCog = createLucideIcon("UserCog", [
		["circle", {
			cx: "18",
			cy: "15",
			r: "3",
			key: "gjjjvw"
		}],
		["circle", {
			cx: "9",
			cy: "7",
			r: "4",
			key: "nufk8"
		}],
		["path", {
			d: "M10 15H6a4 4 0 0 0-4 4v2",
			key: "1nfge6"
		}],
		["path", {
			d: "m21.7 16.4-.9-.3",
			key: "12j9ji"
		}],
		["path", {
			d: "m15.2 13.9-.9-.3",
			key: "1fdjdi"
		}],
		["path", {
			d: "m16.6 18.7.3-.9",
			key: "heedtr"
		}],
		["path", {
			d: "m19.1 12.2.3-.9",
			key: "1af3ki"
		}],
		["path", {
			d: "m19.6 18.7-.4-1",
			key: "1x9vze"
		}],
		["path", {
			d: "m16.8 12.3-.4-1",
			key: "vqeiwj"
		}],
		["path", {
			d: "m14.3 16.6 1-.4",
			key: "1qlj63"
		}],
		["path", {
			d: "m20.7 13.8 1-.4",
			key: "1v5t8k"
		}]
	]);
	const UserMinus = createLucideIcon("UserMinus", [
		["path", {
			d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
			key: "1yyitq"
		}],
		["circle", {
			cx: "9",
			cy: "7",
			r: "4",
			key: "nufk8"
		}],
		["line", {
			x1: "22",
			x2: "16",
			y1: "11",
			y2: "11",
			key: "1shjgl"
		}]
	]);
	const UserPen = createLucideIcon("UserPen", [
		["path", {
			d: "M11.5 15H7a4 4 0 0 0-4 4v2",
			key: "15lzij"
		}],
		["path", {
			d: "M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
			key: "1817ys"
		}],
		["circle", {
			cx: "10",
			cy: "7",
			r: "4",
			key: "e45bow"
		}]
	]);
	const UserPlus = createLucideIcon("UserPlus", [
		["path", {
			d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
			key: "1yyitq"
		}],
		["circle", {
			cx: "9",
			cy: "7",
			r: "4",
			key: "nufk8"
		}],
		["line", {
			x1: "19",
			x2: "19",
			y1: "8",
			y2: "14",
			key: "1bvyxn"
		}],
		["line", {
			x1: "22",
			x2: "16",
			y1: "11",
			y2: "11",
			key: "1shjgl"
		}]
	]);
	const UserRoundCheck = createLucideIcon("UserRoundCheck", [
		["path", {
			d: "M2 21a8 8 0 0 1 13.292-6",
			key: "bjp14o"
		}],
		["circle", {
			cx: "10",
			cy: "8",
			r: "5",
			key: "o932ke"
		}],
		["path", {
			d: "m16 19 2 2 4-4",
			key: "1b14m6"
		}]
	]);
	const UserRoundCog = createLucideIcon("UserRoundCog", [
		["path", {
			d: "M2 21a8 8 0 0 1 10.434-7.62",
			key: "1yezr2"
		}],
		["circle", {
			cx: "10",
			cy: "8",
			r: "5",
			key: "o932ke"
		}],
		["circle", {
			cx: "18",
			cy: "18",
			r: "3",
			key: "1xkwt0"
		}],
		["path", {
			d: "m19.5 14.3-.4.9",
			key: "1eb35c"
		}],
		["path", {
			d: "m16.9 20.8-.4.9",
			key: "dfjc4z"
		}],
		["path", {
			d: "m21.7 19.5-.9-.4",
			key: "q4dx6b"
		}],
		["path", {
			d: "m15.2 16.9-.9-.4",
			key: "1r0w5f"
		}],
		["path", {
			d: "m21.7 16.5-.9.4",
			key: "1knoei"
		}],
		["path", {
			d: "m15.2 19.1-.9.4",
			key: "j188fs"
		}],
		["path", {
			d: "m19.5 21.7-.4-.9",
			key: "1tonu5"
		}],
		["path", {
			d: "m16.9 15.2-.4-.9",
			key: "699xu"
		}]
	]);
	const UserRoundMinus = createLucideIcon("UserRoundMinus", [
		["path", {
			d: "M2 21a8 8 0 0 1 13.292-6",
			key: "bjp14o"
		}],
		["circle", {
			cx: "10",
			cy: "8",
			r: "5",
			key: "o932ke"
		}],
		["path", {
			d: "M22 19h-6",
			key: "vcuq98"
		}]
	]);
	const UserRoundPen = createLucideIcon("UserRoundPen", [
		["path", {
			d: "M2 21a8 8 0 0 1 10.821-7.487",
			key: "1c8h7z"
		}],
		["path", {
			d: "M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
			key: "1817ys"
		}],
		["circle", {
			cx: "10",
			cy: "8",
			r: "5",
			key: "o932ke"
		}]
	]);
	const UserRoundPlus = createLucideIcon("UserRoundPlus", [
		["path", {
			d: "M2 21a8 8 0 0 1 13.292-6",
			key: "bjp14o"
		}],
		["circle", {
			cx: "10",
			cy: "8",
			r: "5",
			key: "o932ke"
		}],
		["path", {
			d: "M19 16v6",
			key: "tddt3s"
		}],
		["path", {
			d: "M22 19h-6",
			key: "vcuq98"
		}]
	]);
	const UserRoundSearch = createLucideIcon("UserRoundSearch", [
		["circle", {
			cx: "10",
			cy: "8",
			r: "5",
			key: "o932ke"
		}],
		["path", {
			d: "M2 21a8 8 0 0 1 10.434-7.62",
			key: "1yezr2"
		}],
		["circle", {
			cx: "18",
			cy: "18",
			r: "3",
			key: "1xkwt0"
		}],
		["path", {
			d: "m22 22-1.9-1.9",
			key: "1e5ubv"
		}]
	]);
	const UserRoundX = createLucideIcon("UserRoundX", [
		["path", {
			d: "M2 21a8 8 0 0 1 11.873-7",
			key: "74fkxq"
		}],
		["circle", {
			cx: "10",
			cy: "8",
			r: "5",
			key: "o932ke"
		}],
		["path", {
			d: "m17 17 5 5",
			key: "p7ous7"
		}],
		["path", {
			d: "m22 17-5 5",
			key: "gqnmv0"
		}]
	]);
	const UserRound = createLucideIcon("UserRound", [["circle", {
		cx: "12",
		cy: "8",
		r: "5",
		key: "1hypcn"
	}], ["path", {
		d: "M20 21a8 8 0 0 0-16 0",
		key: "rfgkzh"
	}]]);
	const UserSearch = createLucideIcon("UserSearch", [
		["circle", {
			cx: "10",
			cy: "7",
			r: "4",
			key: "e45bow"
		}],
		["path", {
			d: "M10.3 15H7a4 4 0 0 0-4 4v2",
			key: "3bnktk"
		}],
		["circle", {
			cx: "17",
			cy: "17",
			r: "3",
			key: "18b49y"
		}],
		["path", {
			d: "m21 21-1.9-1.9",
			key: "1g2n9r"
		}]
	]);
	const UserX = createLucideIcon("UserX", [
		["path", {
			d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
			key: "1yyitq"
		}],
		["circle", {
			cx: "9",
			cy: "7",
			r: "4",
			key: "nufk8"
		}],
		["line", {
			x1: "17",
			x2: "22",
			y1: "8",
			y2: "13",
			key: "3nzzx3"
		}],
		["line", {
			x1: "22",
			x2: "17",
			y1: "8",
			y2: "13",
			key: "1swrse"
		}]
	]);
	const User = createLucideIcon("User", [["path", {
		d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
		key: "975kel"
	}], ["circle", {
		cx: "12",
		cy: "7",
		r: "4",
		key: "17ys0d"
	}]]);
	const UsersRound = createLucideIcon("UsersRound", [
		["path", {
			d: "M18 21a8 8 0 0 0-16 0",
			key: "3ypg7q"
		}],
		["circle", {
			cx: "10",
			cy: "8",
			r: "5",
			key: "o932ke"
		}],
		["path", {
			d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3",
			key: "10s06x"
		}]
	]);
	const Users = createLucideIcon("Users", [
		["path", {
			d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
			key: "1yyitq"
		}],
		["circle", {
			cx: "9",
			cy: "7",
			r: "4",
			key: "nufk8"
		}],
		["path", {
			d: "M22 21v-2a4 4 0 0 0-3-3.87",
			key: "kshegd"
		}],
		["path", {
			d: "M16 3.13a4 4 0 0 1 0 7.75",
			key: "1da9ce"
		}]
	]);
	const UtensilsCrossed = createLucideIcon("UtensilsCrossed", [
		["path", {
			d: "m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8",
			key: "n7qcjb"
		}],
		["path", {
			d: "M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7",
			key: "d0u48b"
		}],
		["path", {
			d: "m2.1 21.8 6.4-6.3",
			key: "yn04lh"
		}],
		["path", {
			d: "m19 5-7 7",
			key: "194lzd"
		}]
	]);
	const Utensils = createLucideIcon("Utensils", [
		["path", {
			d: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",
			key: "cjf0a3"
		}],
		["path", {
			d: "M7 2v20",
			key: "1473qp"
		}],
		["path", {
			d: "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",
			key: "j28e5"
		}]
	]);
	const UtilityPole = createLucideIcon("UtilityPole", [
		["path", {
			d: "M12 2v20",
			key: "t6zp3m"
		}],
		["path", {
			d: "M2 5h20",
			key: "1fs1ex"
		}],
		["path", {
			d: "M3 3v2",
			key: "9imdir"
		}],
		["path", {
			d: "M7 3v2",
			key: "n0os7"
		}],
		["path", {
			d: "M17 3v2",
			key: "1l2re6"
		}],
		["path", {
			d: "M21 3v2",
			key: "1duuac"
		}],
		["path", {
			d: "m19 5-7 7-7-7",
			key: "133zxf"
		}]
	]);
	const Variable = createLucideIcon("Variable", [
		["path", {
			d: "M8 21s-4-3-4-9 4-9 4-9",
			key: "uto9ud"
		}],
		["path", {
			d: "M16 3s4 3 4 9-4 9-4 9",
			key: "4w2vsq"
		}],
		["line", {
			x1: "15",
			x2: "9",
			y1: "9",
			y2: "15",
			key: "f7djnv"
		}],
		["line", {
			x1: "9",
			x2: "15",
			y1: "9",
			y2: "15",
			key: "1shsy8"
		}]
	]);
	const Vault = createLucideIcon("Vault", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["circle", {
			cx: "7.5",
			cy: "7.5",
			r: ".5",
			fill: "currentColor",
			key: "kqv944"
		}],
		["path", {
			d: "m7.9 7.9 2.7 2.7",
			key: "hpeyl3"
		}],
		["circle", {
			cx: "16.5",
			cy: "7.5",
			r: ".5",
			fill: "currentColor",
			key: "w0ekpg"
		}],
		["path", {
			d: "m13.4 10.6 2.7-2.7",
			key: "264c1n"
		}],
		["circle", {
			cx: "7.5",
			cy: "16.5",
			r: ".5",
			fill: "currentColor",
			key: "nkw3mc"
		}],
		["path", {
			d: "m7.9 16.1 2.7-2.7",
			key: "p81g5e"
		}],
		["circle", {
			cx: "16.5",
			cy: "16.5",
			r: ".5",
			fill: "currentColor",
			key: "fubopw"
		}],
		["path", {
			d: "m13.4 13.4 2.7 2.7",
			key: "abhel3"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "2",
			key: "1c9p78"
		}]
	]);
	const Vegan = createLucideIcon("Vegan", [
		["path", {
			d: "M16 8q6 0 6-6-6 0-6 6",
			key: "qsyyc4"
		}],
		["path", {
			d: "M17.41 3.59a10 10 0 1 0 3 3",
			key: "41m9h7"
		}],
		["path", {
			d: "M2 2a26.6 26.6 0 0 1 10 20c.9-6.82 1.5-9.5 4-14",
			key: "qiv7li"
		}]
	]);
	const VenetianMask = createLucideIcon("VenetianMask", [
		["path", {
			d: "M18 11c-1.5 0-2.5.5-3 2",
			key: "1fod00"
		}],
		["path", {
			d: "M4 6a2 2 0 0 0-2 2v4a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3a8 8 0 0 0-5 2 8 8 0 0 0-5-2z",
			key: "d70hit"
		}],
		["path", {
			d: "M6 11c1.5 0 2.5.5 3 2",
			key: "136fht"
		}]
	]);
	const VibrateOff = createLucideIcon("VibrateOff", [
		["path", {
			d: "m2 8 2 2-2 2 2 2-2 2",
			key: "sv1b1"
		}],
		["path", {
			d: "m22 8-2 2 2 2-2 2 2 2",
			key: "101i4y"
		}],
		["path", {
			d: "M8 8v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2",
			key: "1hbad5"
		}],
		["path", {
			d: "M16 10.34V6c0-.55-.45-1-1-1h-4.34",
			key: "1x5tf0"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Vibrate = createLucideIcon("Vibrate", [
		["path", {
			d: "m2 8 2 2-2 2 2 2-2 2",
			key: "sv1b1"
		}],
		["path", {
			d: "m22 8-2 2 2 2-2 2 2 2",
			key: "101i4y"
		}],
		["rect", {
			width: "8",
			height: "14",
			x: "8",
			y: "5",
			rx: "1",
			key: "1oyrl4"
		}]
	]);
	const VideoOff = createLucideIcon("VideoOff", [
		["path", {
			d: "M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196",
			key: "w8jjjt"
		}],
		["path", {
			d: "M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2",
			key: "1xawa7"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]);
	const Video = createLucideIcon("Video", [["path", {
		d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
		key: "ftymec"
	}], ["rect", {
		x: "2",
		y: "6",
		width: "14",
		height: "12",
		rx: "2",
		key: "158x01"
	}]]);
	const Videotape = createLucideIcon("Videotape", [
		["rect", {
			width: "20",
			height: "16",
			x: "2",
			y: "4",
			rx: "2",
			key: "18n3k1"
		}],
		["path", {
			d: "M2 8h20",
			key: "d11cs7"
		}],
		["circle", {
			cx: "8",
			cy: "14",
			r: "2",
			key: "1k2qr5"
		}],
		["path", {
			d: "M8 12h8",
			key: "1wcyev"
		}],
		["circle", {
			cx: "16",
			cy: "14",
			r: "2",
			key: "14k7lr"
		}]
	]);
	const View = createLucideIcon("View", [
		["path", {
			d: "M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2",
			key: "mrq65r"
		}],
		["path", {
			d: "M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2",
			key: "be3xqs"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "1",
			key: "41hilf"
		}],
		["path", {
			d: "M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0",
			key: "11ak4c"
		}]
	]);
	const Voicemail = createLucideIcon("Voicemail", [
		["circle", {
			cx: "6",
			cy: "12",
			r: "4",
			key: "1ehtga"
		}],
		["circle", {
			cx: "18",
			cy: "12",
			r: "4",
			key: "4vafl8"
		}],
		["line", {
			x1: "6",
			x2: "18",
			y1: "16",
			y2: "16",
			key: "pmt8us"
		}]
	]);
	const Volleyball = createLucideIcon("Volleyball", [
		["path", {
			d: "M11.1 7.1a16.55 16.55 0 0 1 10.9 4",
			key: "2880wi"
		}],
		["path", {
			d: "M12 12a12.6 12.6 0 0 1-8.7 5",
			key: "113sja"
		}],
		["path", {
			d: "M16.8 13.6a16.55 16.55 0 0 1-9 7.5",
			key: "1qmsgl"
		}],
		["path", {
			d: "M20.7 17a12.8 12.8 0 0 0-8.7-5 13.3 13.3 0 0 1 0-10",
			key: "1bmeqp"
		}],
		["path", {
			d: "M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5",
			key: "iekzv9"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}]
	]);
	const Volume1 = createLucideIcon("Volume1", [["path", {
		d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
		key: "uqj9uw"
	}], ["path", {
		d: "M16 9a5 5 0 0 1 0 6",
		key: "1q6k2b"
	}]]);
	const Volume2 = createLucideIcon("Volume2", [
		["path", {
			d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
			key: "uqj9uw"
		}],
		["path", {
			d: "M16 9a5 5 0 0 1 0 6",
			key: "1q6k2b"
		}],
		["path", {
			d: "M19.364 18.364a9 9 0 0 0 0-12.728",
			key: "ijwkga"
		}]
	]);
	const VolumeOff = createLucideIcon("VolumeOff", [
		["path", {
			d: "M16 9a5 5 0 0 1 .95 2.293",
			key: "1fgyg8"
		}],
		["path", {
			d: "M19.364 5.636a9 9 0 0 1 1.889 9.96",
			key: "l3zxae"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}],
		["path", {
			d: "m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11",
			key: "1gbwow"
		}],
		["path", {
			d: "M9.828 4.172A.686.686 0 0 1 11 4.657v.686",
			key: "s2je0y"
		}]
	]);
	const VolumeX = createLucideIcon("VolumeX", [
		["path", {
			d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
			key: "uqj9uw"
		}],
		["line", {
			x1: "22",
			x2: "16",
			y1: "9",
			y2: "15",
			key: "1ewh16"
		}],
		["line", {
			x1: "16",
			x2: "22",
			y1: "9",
			y2: "15",
			key: "5ykzw1"
		}]
	]);
	const Volume = createLucideIcon("Volume", [["path", {
		d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
		key: "uqj9uw"
	}]]);
	const Vote = createLucideIcon("Vote", [
		["path", {
			d: "m9 12 2 2 4-4",
			key: "dzmm74"
		}],
		["path", {
			d: "M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z",
			key: "1ezoue"
		}],
		["path", {
			d: "M22 19H2",
			key: "nuriw5"
		}]
	]);
	const WalletCards = createLucideIcon("WalletCards", [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2",
			key: "4125el"
		}],
		["path", {
			d: "M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21",
			key: "1dpki6"
		}]
	]);
	const WalletMinimal = createLucideIcon("WalletMinimal", [["path", {
		d: "M17 14h.01",
		key: "7oqj8z"
	}], ["path", {
		d: "M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14",
		key: "u1rqew"
	}]]);
	const Wallet = createLucideIcon("Wallet", [["path", {
		d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
		key: "18etb6"
	}], ["path", {
		d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
		key: "xoc0q4"
	}]]);
	const Wallpaper = createLucideIcon("Wallpaper", [
		["circle", {
			cx: "8",
			cy: "9",
			r: "2",
			key: "gjzl9d"
		}],
		["path", {
			d: "m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2",
			key: "69xh40"
		}],
		["path", {
			d: "M8 21h8",
			key: "1ev6f3"
		}],
		["path", {
			d: "M12 17v4",
			key: "1riwvh"
		}]
	]);
	const WandSparkles = createLucideIcon("WandSparkles", [
		["path", {
			d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
			key: "ul74o6"
		}],
		["path", {
			d: "m14 7 3 3",
			key: "1r5n42"
		}],
		["path", {
			d: "M5 6v4",
			key: "ilb8ba"
		}],
		["path", {
			d: "M19 14v4",
			key: "blhpug"
		}],
		["path", {
			d: "M10 2v2",
			key: "7u0qdc"
		}],
		["path", {
			d: "M7 8H3",
			key: "zfb6yr"
		}],
		["path", {
			d: "M21 16h-4",
			key: "1cnmox"
		}],
		["path", {
			d: "M11 3H9",
			key: "1obp7u"
		}]
	]);
	const Wand = createLucideIcon("Wand", [
		["path", {
			d: "M15 4V2",
			key: "z1p9b7"
		}],
		["path", {
			d: "M15 16v-2",
			key: "px0unx"
		}],
		["path", {
			d: "M8 9h2",
			key: "1g203m"
		}],
		["path", {
			d: "M20 9h2",
			key: "19tzq7"
		}],
		["path", {
			d: "M17.8 11.8 19 13",
			key: "yihg8r"
		}],
		["path", {
			d: "M15 9h.01",
			key: "x1ddxp"
		}],
		["path", {
			d: "M17.8 6.2 19 5",
			key: "fd4us0"
		}],
		["path", {
			d: "m3 21 9-9",
			key: "1jfql5"
		}],
		["path", {
			d: "M12.2 6.2 11 5",
			key: "i3da3b"
		}]
	]);
	const Warehouse = createLucideIcon("Warehouse", [
		["path", {
			d: "M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z",
			key: "gksnxg"
		}],
		["path", {
			d: "M6 18h12",
			key: "9pbo8z"
		}],
		["path", {
			d: "M6 14h12",
			key: "4cwo0f"
		}],
		["rect", {
			width: "12",
			height: "12",
			x: "6",
			y: "10",
			key: "apd30q"
		}]
	]);
	const WashingMachine = createLucideIcon("WashingMachine", [
		["path", {
			d: "M3 6h3",
			key: "155dbl"
		}],
		["path", {
			d: "M17 6h.01",
			key: "e2y6kg"
		}],
		["rect", {
			width: "18",
			height: "20",
			x: "3",
			y: "2",
			rx: "2",
			key: "od3kk9"
		}],
		["circle", {
			cx: "12",
			cy: "13",
			r: "5",
			key: "nlbqau"
		}],
		["path", {
			d: "M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5",
			key: "17lach"
		}]
	]);
	const Watch = createLucideIcon("Watch", [
		["circle", {
			cx: "12",
			cy: "12",
			r: "6",
			key: "1vlfrh"
		}],
		["polyline", {
			points: "12 10 12 12 13 13",
			key: "19dquz"
		}],
		["path", {
			d: "m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05",
			key: "18k57s"
		}],
		["path", {
			d: "m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05",
			key: "16ny36"
		}]
	]);
	const WavesLadder = createLucideIcon("WavesLadder", [
		["path", {
			d: "M19 5a2 2 0 0 0-2 2v11",
			key: "s41o68"
		}],
		["path", {
			d: "M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
			key: "rd2r6e"
		}],
		["path", {
			d: "M7 13h10",
			key: "1rwob1"
		}],
		["path", {
			d: "M7 9h10",
			key: "12czzb"
		}],
		["path", {
			d: "M9 5a2 2 0 0 0-2 2v11",
			key: "x0q4gh"
		}]
	]);
	const Waves = createLucideIcon("Waves", [
		["path", {
			d: "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
			key: "knzxuh"
		}],
		["path", {
			d: "M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
			key: "2jd2cc"
		}],
		["path", {
			d: "M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
			key: "rd2r6e"
		}]
	]);
	const Waypoints = createLucideIcon("Waypoints", [
		["circle", {
			cx: "12",
			cy: "4.5",
			r: "2.5",
			key: "r5ysbb"
		}],
		["path", {
			d: "m10.2 6.3-3.9 3.9",
			key: "1nzqf6"
		}],
		["circle", {
			cx: "4.5",
			cy: "12",
			r: "2.5",
			key: "jydg6v"
		}],
		["path", {
			d: "M7 12h10",
			key: "b7w52i"
		}],
		["circle", {
			cx: "19.5",
			cy: "12",
			r: "2.5",
			key: "1piiel"
		}],
		["path", {
			d: "m13.8 17.7 3.9-3.9",
			key: "1wyg1y"
		}],
		["circle", {
			cx: "12",
			cy: "19.5",
			r: "2.5",
			key: "13o1pw"
		}]
	]);
	const Webcam = createLucideIcon("Webcam", [
		["circle", {
			cx: "12",
			cy: "10",
			r: "8",
			key: "1gshiw"
		}],
		["circle", {
			cx: "12",
			cy: "10",
			r: "3",
			key: "ilqhr7"
		}],
		["path", {
			d: "M7 22h10",
			key: "10w4w3"
		}],
		["path", {
			d: "M12 22v-4",
			key: "1utk9m"
		}]
	]);
	const WebhookOff = createLucideIcon("WebhookOff", [
		["path", {
			d: "M17 17h-5c-1.09-.02-1.94.92-2.5 1.9A3 3 0 1 1 2.57 15",
			key: "1tvl6x"
		}],
		["path", {
			d: "M9 3.4a4 4 0 0 1 6.52.66",
			key: "q04jfq"
		}],
		["path", {
			d: "m6 17 3.1-5.8a2.5 2.5 0 0 0 .057-2.05",
			key: "azowf0"
		}],
		["path", {
			d: "M20.3 20.3a4 4 0 0 1-2.3.7",
			key: "5joiws"
		}],
		["path", {
			d: "M18.6 13a4 4 0 0 1 3.357 3.414",
			key: "cangb8"
		}],
		["path", {
			d: "m12 6 .6 1",
			key: "tpjl1n"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]);
	const Webhook = createLucideIcon("Webhook", [
		["path", {
			d: "M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2",
			key: "q3hayz"
		}],
		["path", {
			d: "m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06",
			key: "1go1hn"
		}],
		["path", {
			d: "m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8",
			key: "qlwsc0"
		}]
	]);
	const Weight = createLucideIcon("Weight", [["circle", {
		cx: "12",
		cy: "5",
		r: "3",
		key: "rqqgnr"
	}], ["path", {
		d: "M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z",
		key: "56o5sh"
	}]]);
	const WheatOff = createLucideIcon("WheatOff", [
		["path", {
			d: "m2 22 10-10",
			key: "28ilpk"
		}],
		["path", {
			d: "m16 8-1.17 1.17",
			key: "1qqm82"
		}],
		["path", {
			d: "M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
			key: "1rdhi6"
		}],
		["path", {
			d: "m8 8-.53.53a3.5 3.5 0 0 0 0 4.94L9 15l1.53-1.53c.55-.55.88-1.25.98-1.97",
			key: "4wz8re"
		}],
		["path", {
			d: "M10.91 5.26c.15-.26.34-.51.56-.73L13 3l1.53 1.53a3.5 3.5 0 0 1 .28 4.62",
			key: "rves66"
		}],
		["path", {
			d: "M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z",
			key: "19rau1"
		}],
		["path", {
			d: "M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
			key: "tc8ph9"
		}],
		["path", {
			d: "m16 16-.53.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.49 3.49 0 0 1 1.97-.98",
			key: "ak46r"
		}],
		["path", {
			d: "M18.74 13.09c.26-.15.51-.34.73-.56L21 11l-1.53-1.53a3.5 3.5 0 0 0-4.62-.28",
			key: "1tw520"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Wheat = createLucideIcon("Wheat", [
		["path", {
			d: "M2 22 16 8",
			key: "60hf96"
		}],
		["path", {
			d: "M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
			key: "1rdhi6"
		}],
		["path", {
			d: "M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
			key: "1sdzmb"
		}],
		["path", {
			d: "M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
			key: "eoatbi"
		}],
		["path", {
			d: "M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z",
			key: "19rau1"
		}],
		["path", {
			d: "M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
			key: "tc8ph9"
		}],
		["path", {
			d: "M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
			key: "2m8kc5"
		}],
		["path", {
			d: "M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
			key: "vex3ng"
		}]
	]);
	const WholeWord = createLucideIcon("WholeWord", [
		["circle", {
			cx: "7",
			cy: "12",
			r: "3",
			key: "12clwm"
		}],
		["path", {
			d: "M10 9v6",
			key: "17i7lo"
		}],
		["circle", {
			cx: "17",
			cy: "12",
			r: "3",
			key: "gl7c2s"
		}],
		["path", {
			d: "M14 7v8",
			key: "dl84cr"
		}],
		["path", {
			d: "M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1",
			key: "lt2kga"
		}]
	]);
	const WifiHigh = createLucideIcon("WifiHigh", [
		["path", {
			d: "M12 20h.01",
			key: "zekei9"
		}],
		["path", {
			d: "M5 12.859a10 10 0 0 1 14 0",
			key: "1x1e6c"
		}],
		["path", {
			d: "M8.5 16.429a5 5 0 0 1 7 0",
			key: "1bycff"
		}]
	]);
	const WifiLow = createLucideIcon("WifiLow", [["path", {
		d: "M12 20h.01",
		key: "zekei9"
	}], ["path", {
		d: "M8.5 16.429a5 5 0 0 1 7 0",
		key: "1bycff"
	}]]);
	const WifiOff = createLucideIcon("WifiOff", [
		["path", {
			d: "M12 20h.01",
			key: "zekei9"
		}],
		["path", {
			d: "M8.5 16.429a5 5 0 0 1 7 0",
			key: "1bycff"
		}],
		["path", {
			d: "M5 12.859a10 10 0 0 1 5.17-2.69",
			key: "1dl1wf"
		}],
		["path", {
			d: "M19 12.859a10 10 0 0 0-2.007-1.523",
			key: "4k23kn"
		}],
		["path", {
			d: "M2 8.82a15 15 0 0 1 4.177-2.643",
			key: "1grhjp"
		}],
		["path", {
			d: "M22 8.82a15 15 0 0 0-11.288-3.764",
			key: "z3jwby"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]);
	const WifiZero = createLucideIcon("WifiZero", [["path", {
		d: "M12 20h.01",
		key: "zekei9"
	}]]);
	const Wifi = createLucideIcon("Wifi", [
		["path", {
			d: "M12 20h.01",
			key: "zekei9"
		}],
		["path", {
			d: "M2 8.82a15 15 0 0 1 20 0",
			key: "dnpr2z"
		}],
		["path", {
			d: "M5 12.859a10 10 0 0 1 14 0",
			key: "1x1e6c"
		}],
		["path", {
			d: "M8.5 16.429a5 5 0 0 1 7 0",
			key: "1bycff"
		}]
	]);
	const WindArrowDown = createLucideIcon("WindArrowDown", [
		["path", {
			d: "M10 2v8",
			key: "d4bbey"
		}],
		["path", {
			d: "M12.8 21.6A2 2 0 1 0 14 18H2",
			key: "19kp1d"
		}],
		["path", {
			d: "M17.5 10a2.5 2.5 0 1 1 2 4H2",
			key: "19kpjc"
		}],
		["path", {
			d: "m6 6 4 4 4-4",
			key: "k13n16"
		}]
	]);
	const Wind = createLucideIcon("Wind", [
		["path", {
			d: "M12.8 19.6A2 2 0 1 0 14 16H2",
			key: "148xed"
		}],
		["path", {
			d: "M17.5 8a2.5 2.5 0 1 1 2 4H2",
			key: "1u4tom"
		}],
		["path", {
			d: "M9.8 4.4A2 2 0 1 1 11 8H2",
			key: "75valh"
		}]
	]);
	const WineOff = createLucideIcon("WineOff", [
		["path", {
			d: "M8 22h8",
			key: "rmew8v"
		}],
		["path", {
			d: "M7 10h3m7 0h-1.343",
			key: "v48bem"
		}],
		["path", {
			d: "M12 15v7",
			key: "t2xh3l"
		}],
		["path", {
			d: "M7.307 7.307A12.33 12.33 0 0 0 7 10a5 5 0 0 0 7.391 4.391M8.638 2.981C8.75 2.668 8.872 2.34 9 2h6c1.5 4 2 6 2 8 0 .407-.05.809-.145 1.198",
			key: "1ymjlu"
		}],
		["line", {
			x1: "2",
			x2: "22",
			y1: "2",
			y2: "22",
			key: "a6p6uj"
		}]
	]);
	const Wine = createLucideIcon("Wine", [
		["path", {
			d: "M8 22h8",
			key: "rmew8v"
		}],
		["path", {
			d: "M7 10h10",
			key: "1101jm"
		}],
		["path", {
			d: "M12 15v7",
			key: "t2xh3l"
		}],
		["path", {
			d: "M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z",
			key: "10ffi3"
		}]
	]);
	const Workflow = createLucideIcon("Workflow", [
		["rect", {
			width: "8",
			height: "8",
			x: "3",
			y: "3",
			rx: "2",
			key: "by2w9f"
		}],
		["path", {
			d: "M7 11v4a2 2 0 0 0 2 2h4",
			key: "xkn7yn"
		}],
		["rect", {
			width: "8",
			height: "8",
			x: "13",
			y: "13",
			rx: "2",
			key: "1cgmvn"
		}]
	]);
	const Worm = createLucideIcon("Worm", [
		["path", {
			d: "m19 12-1.5 3",
			key: "9bcu4o"
		}],
		["path", {
			d: "M19.63 18.81 22 20",
			key: "121v98"
		}],
		["path", {
			d: "M6.47 8.23a1.68 1.68 0 0 1 2.44 1.93l-.64 2.08a6.76 6.76 0 0 0 10.16 7.67l.42-.27a1 1 0 1 0-2.73-4.21l-.42.27a1.76 1.76 0 0 1-2.63-1.99l.64-2.08A6.66 6.66 0 0 0 3.94 3.9l-.7.4a1 1 0 1 0 2.55 4.34z",
			key: "1tij6q"
		}]
	]);
	const WrapText = createLucideIcon("WrapText", [
		["line", {
			x1: "3",
			x2: "21",
			y1: "6",
			y2: "6",
			key: "4m8b97"
		}],
		["path", {
			d: "M3 12h15a3 3 0 1 1 0 6h-4",
			key: "1cl7v7"
		}],
		["polyline", {
			points: "16 16 14 18 16 20",
			key: "1jznyi"
		}],
		["line", {
			x1: "3",
			x2: "10",
			y1: "18",
			y2: "18",
			key: "1h33wv"
		}]
	]);
	const Wrench = createLucideIcon("Wrench", [["path", {
		d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
		key: "cbrjhi"
	}]]);
	const X$1 = createLucideIcon("X", [["path", {
		d: "M18 6 6 18",
		key: "1bl5f8"
	}], ["path", {
		d: "m6 6 12 12",
		key: "d8bk6v"
	}]]);
	const Youtube = createLucideIcon("Youtube", [["path", {
		d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",
		key: "1q2vi4"
	}], ["path", {
		d: "m10 15 5-3-5-3z",
		key: "1jp15x"
	}]]);
	const ZapOff = createLucideIcon("ZapOff", [
		["path", {
			d: "M10.513 4.856 13.12 2.17a.5.5 0 0 1 .86.46l-1.377 4.317",
			key: "193nxd"
		}],
		["path", {
			d: "M15.656 10H20a1 1 0 0 1 .78 1.63l-1.72 1.773",
			key: "27a7lr"
		}],
		["path", {
			d: "M16.273 16.273 10.88 21.83a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14H4a1 1 0 0 1-.78-1.63l4.507-4.643",
			key: "1e0qe9"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]);
	const Zap = createLucideIcon("Zap", [["path", {
		d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
		key: "1xq2db"
	}]]);
	const ZoomIn = createLucideIcon("ZoomIn", [
		["circle", {
			cx: "11",
			cy: "11",
			r: "8",
			key: "4ej97u"
		}],
		["line", {
			x1: "21",
			x2: "16.65",
			y1: "21",
			y2: "16.65",
			key: "13gj7c"
		}],
		["line", {
			x1: "11",
			x2: "11",
			y1: "8",
			y2: "14",
			key: "1vmskp"
		}],
		["line", {
			x1: "8",
			x2: "14",
			y1: "11",
			y2: "11",
			key: "durymu"
		}]
	]);
	const ZoomOut = createLucideIcon("ZoomOut", [
		["circle", {
			cx: "11",
			cy: "11",
			r: "8",
			key: "4ej97u"
		}],
		["line", {
			x1: "21",
			x2: "16.65",
			y1: "21",
			y2: "16.65",
			key: "13gj7c"
		}],
		["line", {
			x1: "8",
			x2: "14",
			y1: "11",
			y2: "11",
			key: "durymu"
		}]
	]);
	exports.Check = Check$1;
	exports.Clipboard = Clipboard$1;
	exports.Download = Download$1;
	exports.EyeOff = EyeOff$1;
	exports.Files = Files$1;
	exports.FolderOpen = FolderOpen$1;
	exports.Link = Link$1;
	exports.PanelRightClose = PanelRightClose$1;
	exports.Pin = Pin$1;
	exports.PinOff = PinOff$1;
	exports.RotateCcw = RotateCcw$1;
	exports.X = X$1;
}));

//#endregion
//#region src/client/contract.ts
var import_lucide_react = require_lucide_react();
const EMPTY_OUTPUT_DOCK_SNAPSHOT = { entries: [] };

//#endregion
//#region src/client/dock-persistence.ts
const PERSIST_KEY = "dsh-output-dock:v3";
const EMPTY_SESSION_PERSISTED = {
	closedAt: {},
	order: []
};
const EMPTY_PERSISTED = {
	pinned: [],
	hidden: [],
	sessions: {}
};
function loadDockState(storage) {
	try {
		const raw = storage.getItem(PERSIST_KEY);
		if (raw === null) return EMPTY_PERSISTED;
		const parsed = JSON.parse(raw);
		const sessions = {};
		if (parsed.sessions !== null && typeof parsed.sessions === "object") for (const [id, candidate] of Object.entries(parsed.sessions)) {
			if (candidate === null || typeof candidate !== "object") continue;
			const value = candidate;
			const closedAt = {};
			if (value.closedAt !== null && typeof value.closedAt === "object") {
				for (const [path, seq] of Object.entries(value.closedAt)) if (typeof seq === "number" && Number.isFinite(seq)) closedAt[path] = seq;
			}
			sessions[id] = {
				closedAt,
				order: Array.isArray(value.order) ? value.order.filter((x) => typeof x === "string") : []
			};
		}
		return {
			pinned: Array.isArray(parsed.pinned) ? parsed.pinned.filter((x) => typeof x === "string") : [],
			hidden: Array.isArray(parsed.hidden) ? parsed.hidden.filter((x) => typeof x === "string") : [],
			sessions
		};
	} catch {
		return EMPTY_PERSISTED;
	}
}
function saveDockState(storage, state) {
	storage.setItem(PERSIST_KEY, JSON.stringify(state));
}

//#endregion
//#region node_modules/dompurify/dist/purify.es.mjs
/*! @license DOMPurify 3.4.13 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.13/LICENSE */
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = true, o = false;
		try {
			if (i = (t = t.call(r)).next, 0 === l);
			else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r$1) {
			o = true, n = r$1;
		} finally {
			try {
				if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
const entries = Object.entries, setPrototypeOf = Object.setPrototypeOf, isFrozen = Object.isFrozen, getPrototypeOf = Object.getPrototypeOf, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
let freeze = Object.freeze, seal = Object.seal, create = Object.create;
let _ref = typeof Reflect !== "undefined" && Reflect, apply$1 = _ref.apply, construct = _ref.construct;
if (!freeze) freeze = function freeze$1(x) {
	return x;
};
if (!seal) seal = function seal$1(x) {
	return x;
};
if (!apply$1) apply$1 = function apply$2(func, thisArg) {
	for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
	return func.apply(thisArg, args);
};
if (!construct) construct = function construct$1(Func) {
	for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
	return new Func(...args);
};
const arrayForEach = unapply(Array.prototype.forEach);
const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
const arraySplice = unapply(Array.prototype.splice);
const arrayIsArray = Array.isArray;
const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringToString = unapply(String.prototype.toString);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);
const numberToString = unapply(Number.prototype.toString);
const booleanToString = unapply(Boolean.prototype.toString);
const bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
const symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
const objectToString = unapply(Object.prototype.toString);
const regExpTest = unapply(RegExp.prototype.test);
const typeErrorCreate = unconstruct(TypeError);
/**
* Creates a new function that calls the given function with a specified thisArg and arguments.
*
* @param func - The function to be wrapped and called.
* @returns A new function that calls the given function with a specified thisArg and arguments.
*/
function unapply(func) {
	return function(thisArg) {
		if (thisArg instanceof RegExp) thisArg.lastIndex = 0;
		for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
		return apply$1(func, thisArg, args);
	};
}
/**
* Creates a new function that constructs an instance of the given constructor function with the provided arguments.
*
* @param func - The constructor function to be wrapped and called.
* @returns A new function that constructs an instance of the given constructor function with the provided arguments.
*/
function unconstruct(Func) {
	return function() {
		for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
		return construct(Func, args);
	};
}
/**
* Add properties to a lookup table
*
* @param set - The set to which elements will be added.
* @param array - The array containing elements to be added to the set.
* @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
* @returns The modified set with added elements.
*/
function addToSet(set, array) {
	let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
	if (setPrototypeOf) setPrototypeOf(set, null);
	if (!arrayIsArray(array)) return set;
	let l = array.length;
	while (l--) {
		let element = array[l];
		if (typeof element === "string") {
			const lcElement = transformCaseFunc(element);
			if (lcElement !== element) {
				if (!isFrozen(array)) array[l] = lcElement;
				element = lcElement;
			}
		}
		set[element] = true;
	}
	return set;
}
/**
* Clean up an array to harden against CSPP
*
* @param array - The array to be cleaned.
* @returns The cleaned version of the array
*/
function cleanArray(array) {
	for (let index = 0; index < array.length; index++) if (!objectHasOwnProperty(array, index)) array[index] = null;
	return array;
}
/**
* Shallow clone an object
*
* @param object - The object to be cloned.
* @returns A new object that copies the original.
*/
function clone(object) {
	const newObject = create(null);
	for (const _ref2 of entries(object)) {
		var _ref3 = _slicedToArray(_ref2, 2);
		const property = _ref3[0];
		const value = _ref3[1];
		if (objectHasOwnProperty(object, property)) if (arrayIsArray(value)) newObject[property] = cleanArray(value);
		else if (value && typeof value === "object" && value.constructor === Object) newObject[property] = clone(value);
		else newObject[property] = value;
	}
	return newObject;
}
/**
* Convert non-node values into strings without depending on direct property access.
*
* @param value - The value to stringify.
* @returns A string representation of the provided value.
*/
function stringifyValue(value) {
	switch (typeof value) {
		case "string": return value;
		case "number": return numberToString(value);
		case "boolean": return booleanToString(value);
		case "bigint": return bigintToString ? bigintToString(value) : "0";
		case "symbol": return symbolToString ? symbolToString(value) : "Symbol()";
		case "undefined": return objectToString(value);
		case "function":
		case "object": {
			if (value === null) return objectToString(value);
			const valueAsRecord = value;
			const valueToString = lookupGetter(valueAsRecord, "toString");
			if (typeof valueToString === "function") {
				const stringified = valueToString(valueAsRecord);
				return typeof stringified === "string" ? stringified : objectToString(stringified);
			}
			return objectToString(value);
		}
		default: return objectToString(value);
	}
}
/**
* This method automatically checks if the prop is function or getter and behaves accordingly.
*
* @param object - The object to look up the getter function in its prototype chain.
* @param prop - The property name for which to find the getter function.
* @returns The getter function found in the prototype chain or a fallback function.
*/
function lookupGetter(object, prop) {
	while (object !== null) {
		const desc = getOwnPropertyDescriptor(object, prop);
		if (desc) {
			if (desc.get) return unapply(desc.get);
			if (typeof desc.value === "function") return unapply(desc.value);
		}
		object = getPrototypeOf(object);
	}
	function fallbackValue() {
		return null;
	}
	return fallbackValue;
}
function isRegex(value) {
	try {
		regExpTest(value, "");
		return true;
	} catch (_unused) {
		return false;
	}
}
const html$1 = freeze([
	"a",
	"abbr",
	"acronym",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"bdi",
	"bdo",
	"big",
	"blink",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"center",
	"cite",
	"code",
	"col",
	"colgroup",
	"content",
	"data",
	"datalist",
	"dd",
	"decorator",
	"del",
	"details",
	"dfn",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"element",
	"em",
	"fieldset",
	"figcaption",
	"figure",
	"font",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"img",
	"input",
	"ins",
	"kbd",
	"label",
	"legend",
	"li",
	"main",
	"map",
	"mark",
	"marquee",
	"menu",
	"menuitem",
	"meter",
	"nav",
	"nobr",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"picture",
	"pre",
	"progress",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"search",
	"section",
	"select",
	"shadow",
	"slot",
	"small",
	"source",
	"spacer",
	"span",
	"strike",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"table",
	"tbody",
	"td",
	"template",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"tr",
	"track",
	"tt",
	"u",
	"ul",
	"var",
	"video",
	"wbr"
]);
const svg$1 = freeze([
	"svg",
	"a",
	"altglyph",
	"altglyphdef",
	"altglyphitem",
	"animatecolor",
	"animatemotion",
	"animatetransform",
	"circle",
	"clippath",
	"defs",
	"desc",
	"ellipse",
	"enterkeyhint",
	"exportparts",
	"filter",
	"font",
	"g",
	"glyph",
	"glyphref",
	"hkern",
	"image",
	"inputmode",
	"line",
	"lineargradient",
	"marker",
	"mask",
	"metadata",
	"mpath",
	"part",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"radialgradient",
	"rect",
	"stop",
	"style",
	"switch",
	"symbol",
	"text",
	"textpath",
	"title",
	"tref",
	"tspan",
	"view",
	"vkern"
]);
const svgFilters = freeze([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]);
const svgDisallowed = freeze([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]);
const mathMl$1 = freeze([
	"math",
	"menclose",
	"merror",
	"mfenced",
	"mfrac",
	"mglyph",
	"mi",
	"mlabeledtr",
	"mmultiscripts",
	"mn",
	"mo",
	"mover",
	"mpadded",
	"mphantom",
	"mroot",
	"mrow",
	"ms",
	"mspace",
	"msqrt",
	"mstyle",
	"msub",
	"msup",
	"msubsup",
	"mtable",
	"mtd",
	"mtext",
	"mtr",
	"munder",
	"munderover",
	"mprescripts"
]);
const mathMlDisallowed = freeze([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]);
const text = freeze(["#text"]);
const html$2 = freeze([
	"accept",
	"action",
	"align",
	"alt",
	"autocapitalize",
	"autocomplete",
	"autopictureinpicture",
	"autoplay",
	"background",
	"bgcolor",
	"border",
	"capture",
	"cellpadding",
	"cellspacing",
	"checked",
	"cite",
	"class",
	"clear",
	"color",
	"cols",
	"colspan",
	"command",
	"commandfor",
	"controls",
	"controlslist",
	"coords",
	"crossorigin",
	"datetime",
	"decoding",
	"default",
	"dir",
	"disabled",
	"disablepictureinpicture",
	"disableremoteplayback",
	"download",
	"draggable",
	"enctype",
	"enterkeyhint",
	"exportparts",
	"face",
	"for",
	"headers",
	"height",
	"hidden",
	"high",
	"href",
	"hreflang",
	"id",
	"inert",
	"inputmode",
	"integrity",
	"ismap",
	"kind",
	"label",
	"lang",
	"list",
	"loading",
	"loop",
	"low",
	"max",
	"maxlength",
	"media",
	"method",
	"min",
	"minlength",
	"multiple",
	"muted",
	"name",
	"nonce",
	"noshade",
	"novalidate",
	"nowrap",
	"open",
	"optimum",
	"part",
	"pattern",
	"placeholder",
	"playsinline",
	"popover",
	"popovertarget",
	"popovertargetaction",
	"poster",
	"preload",
	"pubdate",
	"radiogroup",
	"readonly",
	"rel",
	"required",
	"rev",
	"reversed",
	"role",
	"rows",
	"rowspan",
	"spellcheck",
	"scope",
	"selected",
	"shape",
	"size",
	"sizes",
	"slot",
	"span",
	"srclang",
	"start",
	"src",
	"srcset",
	"step",
	"style",
	"summary",
	"tabindex",
	"title",
	"translate",
	"type",
	"usemap",
	"valign",
	"value",
	"width",
	"wrap",
	"xmlns"
]);
const svg = freeze([
	"accent-height",
	"accumulate",
	"additive",
	"alignment-baseline",
	"amplitude",
	"ascent",
	"attributename",
	"attributetype",
	"azimuth",
	"basefrequency",
	"baseline-shift",
	"begin",
	"bias",
	"by",
	"class",
	"clip",
	"clippathunits",
	"clip-path",
	"clip-rule",
	"color",
	"color-interpolation",
	"color-interpolation-filters",
	"color-profile",
	"color-rendering",
	"cx",
	"cy",
	"d",
	"dx",
	"dy",
	"diffuseconstant",
	"direction",
	"display",
	"divisor",
	"dominant-baseline",
	"dur",
	"edgemode",
	"elevation",
	"end",
	"exponent",
	"fill",
	"fill-opacity",
	"fill-rule",
	"filter",
	"filterunits",
	"flood-color",
	"flood-opacity",
	"font-family",
	"font-size",
	"font-size-adjust",
	"font-stretch",
	"font-style",
	"font-variant",
	"font-weight",
	"fx",
	"fy",
	"g1",
	"g2",
	"glyph-name",
	"glyphref",
	"gradientunits",
	"gradienttransform",
	"height",
	"href",
	"id",
	"image-rendering",
	"in",
	"in2",
	"intercept",
	"k",
	"k1",
	"k2",
	"k3",
	"k4",
	"kerning",
	"keypoints",
	"keysplines",
	"keytimes",
	"lang",
	"lengthadjust",
	"letter-spacing",
	"kernelmatrix",
	"kernelunitlength",
	"lighting-color",
	"local",
	"marker-end",
	"marker-mid",
	"marker-start",
	"markerheight",
	"markerunits",
	"markerwidth",
	"maskcontentunits",
	"maskunits",
	"max",
	"mask",
	"mask-type",
	"media",
	"method",
	"mode",
	"min",
	"name",
	"numoctaves",
	"offset",
	"operator",
	"opacity",
	"order",
	"orient",
	"orientation",
	"origin",
	"overflow",
	"paint-order",
	"path",
	"pathlength",
	"patterncontentunits",
	"patterntransform",
	"patternunits",
	"points",
	"preservealpha",
	"preserveaspectratio",
	"primitiveunits",
	"r",
	"rx",
	"ry",
	"radius",
	"refx",
	"refy",
	"repeatcount",
	"repeatdur",
	"restart",
	"result",
	"rotate",
	"scale",
	"seed",
	"shape-rendering",
	"slope",
	"specularconstant",
	"specularexponent",
	"spreadmethod",
	"startoffset",
	"stddeviation",
	"stitchtiles",
	"stop-color",
	"stop-opacity",
	"stroke-dasharray",
	"stroke-dashoffset",
	"stroke-linecap",
	"stroke-linejoin",
	"stroke-miterlimit",
	"stroke-opacity",
	"stroke",
	"stroke-width",
	"style",
	"surfacescale",
	"systemlanguage",
	"tabindex",
	"tablevalues",
	"targetx",
	"targety",
	"transform",
	"transform-origin",
	"text-anchor",
	"text-decoration",
	"text-orientation",
	"text-rendering",
	"textlength",
	"type",
	"u1",
	"u2",
	"unicode",
	"values",
	"viewbox",
	"visibility",
	"version",
	"vert-adv-y",
	"vert-origin-x",
	"vert-origin-y",
	"width",
	"word-spacing",
	"wrap",
	"writing-mode",
	"xchannelselector",
	"ychannelselector",
	"x",
	"x1",
	"x2",
	"xmlns",
	"y",
	"y1",
	"y2",
	"z",
	"zoomandpan"
]);
const mathMl = freeze([
	"accent",
	"accentunder",
	"align",
	"bevelled",
	"close",
	"columnalign",
	"columnlines",
	"columnspacing",
	"columnspan",
	"denomalign",
	"depth",
	"dir",
	"display",
	"displaystyle",
	"encoding",
	"fence",
	"frame",
	"height",
	"href",
	"id",
	"largeop",
	"length",
	"linethickness",
	"lquote",
	"lspace",
	"mathbackground",
	"mathcolor",
	"mathsize",
	"mathvariant",
	"maxsize",
	"minsize",
	"movablelimits",
	"notation",
	"numalign",
	"open",
	"rowalign",
	"rowlines",
	"rowspacing",
	"rowspan",
	"rspace",
	"rquote",
	"scriptlevel",
	"scriptminsize",
	"scriptsizemultiplier",
	"selection",
	"separator",
	"separators",
	"stretchy",
	"subscriptshift",
	"supscriptshift",
	"symmetric",
	"voffset",
	"width",
	"xmlns"
]);
const xml = freeze([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]);
const MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
const ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
const TMPLIT_EXPR = seal(/\${[\w\W]*/g);
const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
const ARIA_ATTR = seal(/^aria-[\-\w]+$/);
const IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i);
const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
const ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g);
const DOCTYPE_NAME = seal(/^html$/i);
const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
const ELEMENT_MARKUP_PROBE = seal(/<[/\w!]/g);
const COMMENT_MARKUP_PROBE = seal(/<[/\w]/g);
const FALLBACK_TAG_CLOSE = seal(/<\/no(script|embed|frames)/i);
const SELF_CLOSING_TAG = seal(/\/>/i);
const NODE_TYPE = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	processingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
};
const getGlobal = function getGlobal$1() {
	return typeof window === "undefined" ? null : window;
};
/**
* Creates a no-op policy for internal use only.
* Don't export this function outside this module!
* @param trustedTypes The policy factory.
* @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
* @return The policy created (or null, if Trusted Types
* are not supported or creating the policy failed).
*/
const _createTrustedTypesPolicy = function _createTrustedTypesPolicy$1(trustedTypes, purifyHostElement) {
	if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") return null;
	let suffix = null;
	const ATTR_NAME = "data-tt-policy-suffix";
	if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) suffix = purifyHostElement.getAttribute(ATTR_NAME);
	const policyName = "dompurify" + (suffix ? "#" + suffix : "");
	try {
		return trustedTypes.createPolicy(policyName, {
			createHTML(html$3) {
				return html$3;
			},
			createScriptURL(scriptUrl) {
				return scriptUrl;
			}
		});
	} catch (_) {
		console.warn("TrustedTypes policy " + policyName + " could not be created.");
		return null;
	}
};
const _createHooksMap = function _createHooksMap$1() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
};
/**
* Resolve a set-valued configuration option: a fresh set built from
* cfg[key] when it is an own array property (seeded with a clone of
* options.base when given, case-normalized via options.transform),
* the fallback set otherwise.
*
* @param cfg the cloned, prototype-free configuration object
* @param key the configuration property to read
* @param fallback the set to use when the option is absent or not an array
* @param options transform and optional base set to merge into
* @returns the resolved set
*/
const _resolveSetOption = function _resolveSetOption$1(cfg, key, fallback, options$1) {
	return objectHasOwnProperty(cfg, key) && arrayIsArray(cfg[key]) ? addToSet(options$1.base ? clone(options$1.base) : {}, cfg[key], options$1.transform) : fallback;
};
function createDOMPurify() {
	let window$1 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
	const DOMPurify = (root) => createDOMPurify(root);
	DOMPurify.version = "3.4.13";
	DOMPurify.removed = [];
	if (!window$1 || !window$1.document || window$1.document.nodeType !== NODE_TYPE.document || !window$1.Element) {
		DOMPurify.isSupported = false;
		return DOMPurify;
	}
	let document$1 = window$1.document;
	const originalDocument = document$1;
	const currentScript = originalDocument.currentScript;
	window$1.DocumentFragment;
	const HTMLTemplateElement = window$1.HTMLTemplateElement, Node = window$1.Node, Element = window$1.Element, NodeFilter = window$1.NodeFilter;
	window$1.NamedNodeMap === void 0 && (window$1.NamedNodeMap || window$1.MozNamedAttrMap);
	window$1.HTMLFormElement;
	const DOMParser$1 = window$1.DOMParser, trustedTypes = window$1.trustedTypes;
	const ElementPrototype = Element.prototype;
	const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
	const remove = lookupGetter(ElementPrototype, "remove");
	const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
	const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
	const getParentNode = lookupGetter(ElementPrototype, "parentNode");
	const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
	const getAttributes = lookupGetter(ElementPrototype, "attributes");
	const getNodeType = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeType") : null;
	const getNodeName = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeName") : null;
	const getOwnerDocument = Node && Node.prototype ? lookupGetter(Node.prototype, "ownerDocument") : null;
	if (typeof HTMLTemplateElement === "function") {
		const template = document$1.createElement("template");
		if (template.content && template.content.ownerDocument) document$1 = template.content.ownerDocument;
	}
	let trustedTypesPolicy;
	let emptyHTML = "";
	let defaultTrustedTypesPolicy;
	let defaultTrustedTypesPolicyResolved = false;
	let IN_TRUSTED_TYPES_POLICY = 0;
	const _assertNotInTrustedTypesPolicy = function _assertNotInTrustedTypesPolicy$1() {
		if (IN_TRUSTED_TYPES_POLICY > 0) throw typeErrorCreate("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	};
	const _createTrustedHTML = function _createTrustedHTML$1(html$3) {
		_assertNotInTrustedTypesPolicy();
		IN_TRUSTED_TYPES_POLICY++;
		try {
			return trustedTypesPolicy.createHTML(html$3);
		} finally {
			IN_TRUSTED_TYPES_POLICY--;
		}
	};
	const _createTrustedScriptURL = function _createTrustedScriptURL$1(scriptUrl) {
		_assertNotInTrustedTypesPolicy();
		IN_TRUSTED_TYPES_POLICY++;
		try {
			return trustedTypesPolicy.createScriptURL(scriptUrl);
		} finally {
			IN_TRUSTED_TYPES_POLICY--;
		}
	};
	const _getDefaultTrustedTypesPolicy = function _getDefaultTrustedTypesPolicy$1() {
		if (!defaultTrustedTypesPolicyResolved) {
			defaultTrustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
			defaultTrustedTypesPolicyResolved = true;
		}
		return defaultTrustedTypesPolicy;
	};
	const _document = document$1, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
	const importNode = originalDocument.importNode;
	let hooks = _createHooksMap();
	/**
	* Expose whether this browser supports running the full DOMPurify.
	*/
	DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
	const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
	let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
	/**
	* We consider the elements and attributes below to be safe. Ideally
	* don't add any new ones but feel free to remove unwanted ones.
	*/
	let ALLOWED_TAGS = null;
	const DEFAULT_ALLOWED_TAGS = addToSet({}, [
		...html$1,
		...svg$1,
		...svgFilters,
		...mathMl$1,
		...text
	]);
	let ALLOWED_ATTR = null;
	const DEFAULT_ALLOWED_ATTR = addToSet({}, [
		...html$2,
		...svg,
		...mathMl,
		...xml
	]);
	let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
		tagNameCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		attributeNameCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: false
		}
	}));
	let FORBID_TAGS = null;
	let FORBID_ATTR = null;
	const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
		tagCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		attributeCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		}
	}));
	let ALLOW_ARIA_ATTR = true;
	let ALLOW_DATA_ATTR = true;
	let ALLOW_UNKNOWN_PROTOCOLS = false;
	let ALLOW_SELF_CLOSE_IN_ATTR = true;
	let SAFE_FOR_TEMPLATES = false;
	let SAFE_FOR_XML = true;
	let WHOLE_DOCUMENT = false;
	let SET_CONFIG = false;
	let SET_CONFIG_ALLOWED_TAGS = null;
	let SET_CONFIG_ALLOWED_ATTR = null;
	let FORCE_BODY = false;
	let RETURN_DOM = false;
	let RETURN_DOM_FRAGMENT = false;
	let RETURN_TRUSTED_TYPE = false;
	let SANITIZE_DOM = true;
	let SANITIZE_NAMED_PROPS = false;
	const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
	let KEEP_CONTENT = true;
	let IN_PLACE = false;
	let USE_PROFILES = {};
	let FORBID_CONTENTS = null;
	const DEFAULT_FORBID_CONTENTS = addToSet({}, [
		"annotation-xml",
		"audio",
		"colgroup",
		"desc",
		"foreignobject",
		"head",
		"iframe",
		"math",
		"mi",
		"mn",
		"mo",
		"ms",
		"mtext",
		"noembed",
		"noframes",
		"noscript",
		"plaintext",
		"script",
		"selectedcontent",
		"style",
		"svg",
		"template",
		"thead",
		"title",
		"video",
		"xmp"
	]);
	let DATA_URI_TAGS = null;
	const DEFAULT_DATA_URI_TAGS = addToSet({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]);
	let URI_SAFE_ATTRIBUTES = null;
	const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]);
	const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
	const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
	const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
	let NAMESPACE = HTML_NAMESPACE;
	let IS_EMPTY_INPUT = false;
	let ALLOWED_NAMESPACES = null;
	const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [
		MATHML_NAMESPACE,
		SVG_NAMESPACE,
		HTML_NAMESPACE
	], stringToString);
	const DEFAULT_MATHML_TEXT_INTEGRATION_POINTS = freeze([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]);
	let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
	const DEFAULT_HTML_INTEGRATION_POINTS = freeze(["annotation-xml"]);
	let HTML_INTEGRATION_POINTS = addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
	const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]);
	let PARSER_MEDIA_TYPE = null;
	const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
	const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
	let transformCaseFunc = null;
	let CONFIG = null;
	const formElement = document$1.createElement("form");
	const isRegexOrFunction = function isRegexOrFunction$1(testValue) {
		return testValue instanceof RegExp || testValue instanceof Function;
	};
	/**
	* _parseConfig
	*
	* @param cfg optional config literal
	*/
	const _parseConfig = function _parseConfig$1() {
		let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (CONFIG && CONFIG === cfg) return;
		if (!cfg || typeof cfg !== "object") cfg = {};
		cfg = clone(cfg);
		PARSER_MEDIA_TYPE = SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
		transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
		ALLOWED_TAGS = _resolveSetOption(cfg, "ALLOWED_TAGS", DEFAULT_ALLOWED_TAGS, { transform: transformCaseFunc });
		ALLOWED_ATTR = _resolveSetOption(cfg, "ALLOWED_ATTR", DEFAULT_ALLOWED_ATTR, { transform: transformCaseFunc });
		ALLOWED_NAMESPACES = _resolveSetOption(cfg, "ALLOWED_NAMESPACES", DEFAULT_ALLOWED_NAMESPACES, { transform: stringToString });
		URI_SAFE_ATTRIBUTES = _resolveSetOption(cfg, "ADD_URI_SAFE_ATTR", DEFAULT_URI_SAFE_ATTRIBUTES, {
			transform: transformCaseFunc,
			base: DEFAULT_URI_SAFE_ATTRIBUTES
		});
		DATA_URI_TAGS = _resolveSetOption(cfg, "ADD_DATA_URI_TAGS", DEFAULT_DATA_URI_TAGS, {
			transform: transformCaseFunc,
			base: DEFAULT_DATA_URI_TAGS
		});
		FORBID_CONTENTS = _resolveSetOption(cfg, "FORBID_CONTENTS", DEFAULT_FORBID_CONTENTS, { transform: transformCaseFunc });
		FORBID_TAGS = _resolveSetOption(cfg, "FORBID_TAGS", clone({}), { transform: transformCaseFunc });
		FORBID_ATTR = _resolveSetOption(cfg, "FORBID_ATTR", clone({}), { transform: transformCaseFunc });
		USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
		ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
		ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
		ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
		ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
		SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
		SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
		WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
		RETURN_DOM = cfg.RETURN_DOM || false;
		RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
		RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
		FORCE_BODY = cfg.FORCE_BODY || false;
		SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
		SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
		KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
		IN_PLACE = cfg.IN_PLACE || false;
		IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
		NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
		MATHML_TEXT_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "MATHML_TEXT_INTEGRATION_POINTS") && cfg.MATHML_TEXT_INTEGRATION_POINTS && typeof cfg.MATHML_TEXT_INTEGRATION_POINTS === "object" ? clone(cfg.MATHML_TEXT_INTEGRATION_POINTS) : addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
		HTML_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "HTML_INTEGRATION_POINTS") && cfg.HTML_INTEGRATION_POINTS && typeof cfg.HTML_INTEGRATION_POINTS === "object" ? clone(cfg.HTML_INTEGRATION_POINTS) : addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
		const customElementHandling = objectHasOwnProperty(cfg, "CUSTOM_ELEMENT_HANDLING") && cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING === "object" ? clone(cfg.CUSTOM_ELEMENT_HANDLING) : create(null);
		CUSTOM_ELEMENT_HANDLING = create(null);
		if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
		if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
		if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
		seal(CUSTOM_ELEMENT_HANDLING);
		if (SAFE_FOR_TEMPLATES) ALLOW_DATA_ATTR = false;
		if (RETURN_DOM_FRAGMENT) RETURN_DOM = true;
		if (USE_PROFILES) {
			ALLOWED_TAGS = addToSet({}, text);
			ALLOWED_ATTR = create(null);
			if (USE_PROFILES.html === true) {
				addToSet(ALLOWED_TAGS, html$1);
				addToSet(ALLOWED_ATTR, html$2);
			}
			if (USE_PROFILES.svg === true) {
				addToSet(ALLOWED_TAGS, svg$1);
				addToSet(ALLOWED_ATTR, svg);
				addToSet(ALLOWED_ATTR, xml);
			}
			if (USE_PROFILES.svgFilters === true) {
				addToSet(ALLOWED_TAGS, svgFilters);
				addToSet(ALLOWED_ATTR, svg);
				addToSet(ALLOWED_ATTR, xml);
			}
			if (USE_PROFILES.mathMl === true) {
				addToSet(ALLOWED_TAGS, mathMl$1);
				addToSet(ALLOWED_ATTR, mathMl);
				addToSet(ALLOWED_ATTR, xml);
			}
		}
		EXTRA_ELEMENT_HANDLING.tagCheck = null;
		EXTRA_ELEMENT_HANDLING.attributeCheck = null;
		if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
			if (typeof cfg.ADD_TAGS === "function") EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
			else if (arrayIsArray(cfg.ADD_TAGS)) {
				if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) ALLOWED_TAGS = clone(ALLOWED_TAGS);
				addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
			}
		}
		if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
			if (typeof cfg.ADD_ATTR === "function") EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
			else if (arrayIsArray(cfg.ADD_ATTR)) {
				if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) ALLOWED_ATTR = clone(ALLOWED_ATTR);
				addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
			}
		}
		if (objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") && arrayIsArray(cfg.ADD_URI_SAFE_ATTR)) addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
		if (objectHasOwnProperty(cfg, "FORBID_CONTENTS") && arrayIsArray(cfg.FORBID_CONTENTS)) {
			if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) FORBID_CONTENTS = clone(FORBID_CONTENTS);
			addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
		}
		if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
			if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) FORBID_CONTENTS = clone(FORBID_CONTENTS);
			addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
		}
		if (KEEP_CONTENT) ALLOWED_TAGS["#text"] = true;
		if (WHOLE_DOCUMENT) addToSet(ALLOWED_TAGS, [
			"html",
			"head",
			"body"
		]);
		if (ALLOWED_TAGS.table) {
			addToSet(ALLOWED_TAGS, ["tbody"]);
			delete FORBID_TAGS.tbody;
		}
		if (cfg.TRUSTED_TYPES_POLICY) {
			if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") throw typeErrorCreate("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") throw typeErrorCreate("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			const previousTrustedTypesPolicy = trustedTypesPolicy;
			trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
			try {
				emptyHTML = _createTrustedHTML("");
			} catch (error) {
				trustedTypesPolicy = previousTrustedTypesPolicy;
				throw error;
			}
		} else if (cfg.TRUSTED_TYPES_POLICY === null) {
			trustedTypesPolicy = void 0;
			emptyHTML = "";
		} else {
			if (trustedTypesPolicy === void 0) trustedTypesPolicy = _getDefaultTrustedTypesPolicy();
			if (trustedTypesPolicy && typeof emptyHTML === "string") emptyHTML = _createTrustedHTML("");
		}
		if (freeze) freeze(cfg);
		CONFIG = cfg;
	};
	const ALL_SVG_TAGS = addToSet({}, [
		...svg$1,
		...svgFilters,
		...svgDisallowed
	]);
	const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
	/**
	* Namespace rules for an element in the SVG namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkSvgNamespace = function _checkSvgNamespace$1(tagName, parent, parentTagName) {
		if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "svg";
		if (parent.namespaceURI === MATHML_NAMESPACE) return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
		return Boolean(ALL_SVG_TAGS[tagName]);
	};
	/**
	* Namespace rules for an element in the MathML namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkMathMlNamespace = function _checkMathMlNamespace$1(tagName, parent, parentTagName) {
		if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "math";
		if (parent.namespaceURI === SVG_NAMESPACE) return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
		return Boolean(ALL_MATHML_TAGS[tagName]);
	};
	/**
	* Namespace rules for an element in the HTML namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkHtmlNamespace = function _checkHtmlNamespace$1(tagName, parent, parentTagName) {
		if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) return false;
		if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) return false;
		return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
	};
	/**
	* @param element a DOM element whose namespace is being checked
	* @returns Return false if the element has a
	*  namespace that a spec-compliant parser would never
	*  return. Return true otherwise.
	*/
	const _checkValidNamespace = function _checkValidNamespace$1(element) {
		let parent = getParentNode(element);
		if (!parent || !parent.tagName) parent = {
			namespaceURI: NAMESPACE,
			tagName: "template"
		};
		const tagName = stringToLowerCase(element.tagName);
		const parentTagName = stringToLowerCase(parent.tagName);
		if (!ALLOWED_NAMESPACES[element.namespaceURI]) return false;
		if (element.namespaceURI === SVG_NAMESPACE) return _checkSvgNamespace(tagName, parent, parentTagName);
		if (element.namespaceURI === MATHML_NAMESPACE) return _checkMathMlNamespace(tagName, parent, parentTagName);
		if (element.namespaceURI === HTML_NAMESPACE) return _checkHtmlNamespace(tagName, parent, parentTagName);
		if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) return true;
		return false;
	};
	/**
	* _forceRemove
	*
	* @param node a DOM node
	*/
	const _forceRemove = function _forceRemove$1(node) {
		arrayPush(DOMPurify.removed, { element: node });
		try {
			getParentNode(node).removeChild(node);
		} catch (_) {
			remove(node);
			if (!getParentNode(node)) throw typeErrorCreate("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	};
	/**
	* _neutralizeRoot
	*
	* Fail-closed teardown of an in-place root after the sanitize walk aborts
	* (campaign-3 F2). An internal throw mid-walk — e.g. a page-registered
	* custom element's reaction detaches a node so `_forceRemove`'s deliberate
	* parentless guard throws, or any other re-entrant engine mutation — would
	* otherwise leave the caller's *live* tree half-sanitized, with everything
	* after the abort point still carrying its handlers. There is no safe way
	* to resume the walk (the tree mutated under us), so we strip the root bare:
	* remove every child and every attribute, then let the caller's catch see
	* the original error. Clobber-safe (cached `remove`/`childNodes`/`attributes`
	* getters; the root was already clobber-pre-flighted at the IN_PLACE entry).
	*
	* @param root the in-place root to empty
	*/
	const _neutralizeRoot = function _neutralizeRoot$1(root) {
		_neutralizeSubtree(root);
		const childNodes = getChildNodes(root);
		if (childNodes) {
			const snapshot = [];
			arrayForEach(childNodes, (child) => {
				arrayPush(snapshot, child);
			});
			arrayForEach(snapshot, (child) => {
				try {
					remove(child);
				} catch (_) {}
			});
		}
		const attributes = getAttributes(root);
		if (attributes) for (let i = attributes.length - 1; i >= 0; --i) {
			const attribute = attributes[i];
			const name = attribute && attribute.name;
			if (typeof name === "string") try {
				root.removeAttribute(name);
			} catch (_) {}
		}
	};
	/**
	* _removeAttribute
	*
	* @param name an Attribute name
	* @param element a DOM node
	*/
	const _removeAttribute = function _removeAttribute$1(name, element) {
		try {
			arrayPush(DOMPurify.removed, {
				attribute: element.getAttributeNode(name),
				from: element
			});
		} catch (_) {
			arrayPush(DOMPurify.removed, {
				attribute: null,
				from: element
			});
		}
		element.removeAttribute(name);
		if (name === "is") if (RETURN_DOM || RETURN_DOM_FRAGMENT) try {
			_forceRemove(element);
		} catch (_) {}
		else try {
			element.setAttribute(name, "");
		} catch (_) {}
	};
	/**
	* _stripDisallowedAttributes
	*
	* Removes every attribute the active configuration does not allow from a
	* single element, using the same allowlist as the main attribute pass (so
	* `on*` handlers go, but no `/^on/` blocklist is introduced). Used only to
	* neutralise nodes that are being discarded from an in-place tree.
	*
	* @param element the element to strip
	*/
	const _stripDisallowedAttributes = function _stripDisallowedAttributes$1(element) {
		const attributes = getAttributes(element);
		if (!attributes) return;
		for (let i = attributes.length - 1; i >= 0; --i) {
			const attribute = attributes[i];
			const name = attribute && attribute.name;
			if (typeof name !== "string" || ALLOWED_ATTR[transformCaseFunc(name)]) continue;
			try {
				element.removeAttribute(name);
			} catch (_) {}
		}
	};
	/**
	* _neutralizeSubtree
	*
	* Completes the audit-5 F1 fix across every removal path. The KEEP_CONTENT
	* move-hoist neutralises only disallowed-tag removals; clobber, mXSS-canary,
	* namespace, comment, processing-instruction and KEEP_CONTENT:false removals
	* all drop their subtree wholesale via `_forceRemove`. On the IN_PLACE path
	* those dropped nodes are detached from the caller's LIVE tree but a
	* handler-bearing original among them (an `<img onerror>`/`<video>` that was
	* loading) keeps its queued resource event, which fires in page scope after
	* sanitize returns. This walks a removed subtree and strips every attribute
	* the active configuration does not allow — so `on*` handlers are cancelled
	* through the SAME allowlist that governs kept nodes, not a separate `/^on/`
	* blocklist. Run synchronously before sanitize returns, i.e. before any
	* queued event can fire. Hook-free by design: these nodes leave the output,
	* so firing attribute hooks for them would be surprising. Clobber-safe reads;
	* a doomed clobbered node may shadow `removeAttribute` (its own attributes are
	* irrelevant — it is discarded — while its non-clobbered descendants, e.g.
	* the `<img>`, are reached and scrubbed).
	*
	* @param root the root of a removed subtree to neutralise
	*/
	const _neutralizeSubtree = function _neutralizeSubtree$1(root) {
		const stack = [root];
		while (stack.length > 0) {
			const node = stack.pop();
			if ((getNodeType ? getNodeType(node) : node.nodeType) === NODE_TYPE.element) _stripDisallowedAttributes(node);
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push(childNodes[i]);
		}
	};
	/**
	* _neutralizePatchLinkage
	*
	* IN_PLACE entry pre-pass (declarative-partial-updates / streaming
	* hardening, https://github.com/WICG/declarative-partial-updates).
	*
	* The main walk strips patch linkage (`for`/`patchsrc`) and removes range
	* markers (PIs / markup comments) node-by-node, in document order, AS it
	* reaches each node. On a live in-place root that leaves a window: from the
	* moment the root is connected until the walk arrives at a given node, that
	* node's linkage is live. A patch applied on connection/stream can fire as
	* a microtask during the walk and inject or teleport an unsanitized DOM
	* range into a region the iterator has already passed and will not revisit,
	* so the post-return "tree is sanitized" contract is violated. Sweep the
	* whole tree once up front and sever every linkage before the walk begins,
	* closing that window.
	*
	* This CANNOT undo a patch that already fired before sanitize ran — that is
	* the irreducible "do not IN_PLACE a live-connected attacker tree" caveat —
	* but it closes everything from sanitize-start onward. Gated on SAFE_FOR_XML
	* to group with the rest of the declarative-partial-updates handling and
	* stay overridable, consistent with the codebase.
	*
	* Clobber-safe traversal (cached childNodes getter); per-node try/catch so a
	* clobbered root cannot defeat the sweep of its non-clobbered descendants.
	*
	* NOTE (pending real-Chrome confirmation, see test/declarative-patch-probe
	* .html Q1): this mirrors the existing policy of keeping `for` on
	* <label>/<output>. If the shipping feature can drive a patch through a
	* surviving `for`-on-label/output + `id` pair, this pre-pass and the
	* attribute check at _isBasicCustomElement's caller must additionally drop
	* that pair on the IN_PLACE path. Left as-is until the taxonomy is verified.
	*
	* @param root the in-place root to sweep
	*/
	const _neutralizePatchLinkage = function _neutralizePatchLinkage$1(root) {
		if (!SAFE_FOR_XML) return;
		const stack = [root];
		while (stack.length > 0) {
			const node = stack.pop();
			const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
			if (nodeType === NODE_TYPE.processingInstruction || nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, node.data)) {
				try {
					remove(node);
				} catch (_) {}
				continue;
			}
			if (nodeType === NODE_TYPE.element) {
				const element = node;
				const lcTag = transformCaseFunc(getNodeName ? getNodeName(node) : node.nodeName);
				try {
					if (element.hasAttribute && element.hasAttribute("patchsrc")) element.removeAttribute("patchsrc");
					if (element.hasAttribute && element.hasAttribute("for") && lcTag !== "label" && lcTag !== "output") element.removeAttribute("for");
				} catch (_) {}
			}
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push(childNodes[i]);
		}
	};
	/**
	* _initDocument
	*
	* @param dirty - a string of dirty markup
	* @return a DOM, filled with the dirty markup
	*/
	const _initDocument = function _initDocument$1(dirty) {
		let doc = null;
		let leadingWhitespace = null;
		if (FORCE_BODY) dirty = "<remove></remove>" + dirty;
		else {
			const matches = stringMatch(dirty, /^[\r\n\t ]+/);
			leadingWhitespace = matches && matches[0];
		}
		if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) dirty = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + dirty + "</body></html>";
		const dirtyPayload = trustedTypesPolicy ? _createTrustedHTML(dirty) : dirty;
		if (NAMESPACE === HTML_NAMESPACE) try {
			doc = new DOMParser$1().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
		} catch (_) {}
		if (!doc || !doc.documentElement) {
			doc = implementation.createDocument(NAMESPACE, "template", null);
			try {
				doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
			} catch (_) {}
		}
		const body = doc.body || doc.documentElement;
		if (dirty && leadingWhitespace) body.insertBefore(document$1.createTextNode(leadingWhitespace), body.childNodes[0] || null);
		if (NAMESPACE === HTML_NAMESPACE) return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
		return WHOLE_DOCUMENT ? doc.documentElement : body;
	};
	/**
	* Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
	*
	* @param root The root element or node to start traversing on.
	* @return The created NodeIterator
	*/
	const _createNodeIterator = function _createNodeIterator$1(root) {
		const doc = getOwnerDocument ? getOwnerDocument(root) : root.ownerDocument;
		return createNodeIterator.call(doc || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
	};
	/**
	* Replace template expression syntax (mustache, ERB, template
	* literal) with a space; shared by all SAFE_FOR_TEMPLATES scrub
	* sites. Order matters: mustache, then ERB, then template literal.
	*
	* @param value the string to scrub
	* @returns the scrubbed string
	*/
	const _stripTemplateExpressions = function _stripTemplateExpressions$1(value) {
		value = stringReplace(value, MUSTACHE_EXPR$1, " ");
		value = stringReplace(value, ERB_EXPR$1, " ");
		value = stringReplace(value, TMPLIT_EXPR$1, " ");
		return value;
	};
	/**
	* Strip template-engine expressions ({{...}}, ${...}, <%...%>) from the
	* character data of an element subtree. Used as the final safety net for
	* SAFE_FOR_TEMPLATES on every DOM-returning code path so that expressions
	* which only form after text-node normalization (e.g. fragments split across
	* stripped elements) cannot survive into a template-evaluating framework.
	*
	* Walks text/comment/CDATA/processing-instruction nodes and mutates `.data`
	* in place rather than round-tripping through innerHTML. This preserves
	* descendant node references (important for IN_PLACE callers), avoids a
	* serialize/reparse cycle, and reads literal character data — which means
	* `<%...%>` in text content matches the ERB regex against its real bytes
	* instead of the HTML-entity-escaped form innerHTML would produce.
	*
	* Attribute values are not visited here; SAFE_FOR_TEMPLATES handling for
	* attributes is performed during the per-node `_sanitizeAttributes` pass.
	*
	* @param node The root element whose character data should be scrubbed.
	*/
	const _scrubTemplateExpressions2 = function _scrubTemplateExpressions(node) {
		var _node$querySelectorAl;
		node.normalize();
		const doc = getOwnerDocument ? getOwnerDocument(node) : node.ownerDocument;
		const walker = createNodeIterator.call(doc || node, node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_CDATA_SECTION | NodeFilter.SHOW_PROCESSING_INSTRUCTION, null);
		let currentNode = walker.nextNode();
		while (currentNode) {
			currentNode.data = _stripTemplateExpressions(currentNode.data);
			currentNode = walker.nextNode();
		}
		const templates = (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 ? void 0 : _node$querySelectorAl.call(node, "template");
		if (templates) arrayForEach(templates, (tmpl) => {
			if (_isDocumentFragment(tmpl.content)) _scrubTemplateExpressions2(tmpl.content);
		});
	};
	/**
	* _isClobbered
	*
	* Detect DOM-clobbering on HTMLFormElement nodes. Form is the only HTML
	* interface with [LegacyOverrideBuiltIns]; a descendant element with a
	* `name` attribute matching a prototype property shadows that property
	* on direct reads. We use this check at the IN_PLACE entry-point and
	* during attribute sanitization to refuse clobbered forms.
	*
	* @param element element to check for clobbering attacks
	* @return true if clobbered, false if safe
	*/
	const _isClobbered = function _isClobbered$1(element) {
		const realTagName = getNodeName ? getNodeName(element) : null;
		if (typeof realTagName !== "string") return false;
		if (transformCaseFunc(realTagName) !== "form") return false;
		return typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || element.attributes !== getAttributes(element) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function" || element.nodeType !== getNodeType(element) || element.childNodes !== getChildNodes(element);
	};
	/**
	* Checks whether the given value is a DocumentFragment from any realm.
	*
	* The realm-independent replacement reads `nodeType` through the cached
	* Node.prototype getter and compares to the DOCUMENT_FRAGMENT_NODE
	* constant (11). nodeType is a numeric value resolved from the node's
	* internal slot, identical across realms for the same kind of node.
	*
	* @param value object to check
	* @return true if value is a DocumentFragment-shaped node from any realm
	*/
	const _isDocumentFragment = function _isDocumentFragment$1(value) {
		if (!getNodeType || typeof value !== "object" || value === null) return false;
		try {
			return getNodeType(value) === NODE_TYPE.documentFragment;
		} catch (_) {
			return false;
		}
	};
	/**
	* Checks whether the given object is a DOM node, including nodes that
	* originate from a different window/realm (e.g. an iframe's
	* contentDocument). The previous `value instanceof Node` check was
	* realm-bound: nodes from a different window failed it, causing
	* sanitize() to silently stringify them and reset IN_PLACE to false,
	* returning the original node unsanitized. See GHSA-4w3q-35jp-p934.
	*
	* @param value object to check whether it's a DOM node
	* @return true if value is a DOM node from any realm
	*/
	const _isNode = function _isNode$1(value) {
		if (!getNodeType || typeof value !== "object" || value === null) return false;
		try {
			return typeof getNodeType(value) === "number";
		} catch (_) {
			return false;
		}
	};
	function _executeHooks(hooks$1, currentNode, data) {
		if (hooks$1.length === 0) return;
		arrayForEach(hooks$1, (hook) => {
			hook.call(DOMPurify, currentNode, data, CONFIG);
		});
	}
	/**
	* Structural-threat checks that condemn a node regardless of the
	* allowlists: mXSS via namespace confusion, risky CSS construction,
	* processing instructions, markup-bearing comments. Pure predicate;
	* the caller removes. Check order is load-bearing.
	*
	* @param currentNode the node to inspect
	* @param tagName the node's transformCaseFunc'd tag name
	* @return true if the node must be removed
	*/
	const _isUnsafeNode = function _isUnsafeNode$1(currentNode, tagName) {
		if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.innerHTML)) return true;
		if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && tagName === "style" && _isNode(currentNode.firstElementChild)) return true;
		if (currentNode.nodeType === NODE_TYPE.processingInstruction) return true;
		if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, currentNode.data)) return true;
		return false;
	};
	/**
	* Handle a node whose tag is forbidden or not allowlisted: keep
	* allowed custom elements (false return exits _sanitizeElements
	* early - the namespace and fallback-tag removal checks are
	* intentionally skipped for kept custom elements), else hoist
	* content per KEEP_CONTENT and remove.
	*
	* A kept custom element is the ONLY case in which this function
	* returns false, so the caller uses that return value to run the
	* afterSanitizeElements hook on the kept element and keep the
	* element-hook lifecycle consistent with normal allowlisted
	* elements (GHSA-c2j3-45gr-mqc4).
	*
	* @param currentNode the disallowed node
	* @param tagName the node's transformCaseFunc'd tag name
	* @return true if the node was removed, false if kept
	*/
	const _sanitizeDisallowedNode = function _sanitizeDisallowedNode$1(currentNode, tagName, root) {
		if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
			if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
			if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) return false;
		}
		if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
			const parentNode = getParentNode(currentNode);
			const childNodes = getChildNodes(currentNode);
			if (childNodes && parentNode) {
				const childCount = childNodes.length;
				for (let i = childCount - 1; i >= 0; --i) {
					const hoisted = currentNode === root ? cloneNode(childNodes[i], true) : childNodes[i];
					parentNode.insertBefore(hoisted, getNextSibling(currentNode));
				}
			}
		}
		_forceRemove(currentNode);
		return true;
	};
	/**
	* Fork a hook-mutable allowlist off its shared binding the first time a
	* (possibly lazily-installed) uponSanitize* hook is about to see it, so the
	* hook cannot widen the per-instance default or the setConfig binding by
	* reference and leak past the call. Returns the set unchanged once it is
	* already call-local, so repeated calls across elements are idempotent.
	*
	* @param hookList the uponSanitize* hook array for this event
	* @param set the current ALLOWED_TAGS / ALLOWED_ATTR binding
	* @param defaultSet the per-instance DEFAULT_ALLOWED_* constant
	* @param setConfigSet the captured setConfig() binding, or null
	* @return a call-local clone if a hook is present and set is still shared,
	*   else set unchanged
	*/
	const _forkSharedAllowlist = function _forkSharedAllowlist$1(hookList, set, defaultSet, setConfigSet) {
		if (hookList.length === 0) return set;
		return set === defaultSet || set === setConfigSet ? clone(set) : set;
	};
	/**
	* _sanitizeElements
	*
	* @protect nodeName
	* @protect textContent
	* @protect removeChild
	* @param currentNode to check for permission to exist
	* @return true if node was killed, false if left alive
	*/
	const _sanitizeElements = function _sanitizeElements$1(currentNode, root) {
		_executeHooks(hooks.beforeSanitizeElements, currentNode, null);
		if (currentNode !== root && getParentNode(currentNode) === null) {
			if (IN_PLACE) _neutralizeSubtree(currentNode);
			return true;
		}
		if (_isClobbered(currentNode)) {
			_forceRemove(currentNode);
			return true;
		}
		const tagName = transformCaseFunc(getNodeName ? getNodeName(currentNode) : currentNode.nodeName);
		ALLOWED_TAGS = _forkSharedAllowlist(hooks.uponSanitizeElement, ALLOWED_TAGS, DEFAULT_ALLOWED_TAGS, SET_CONFIG_ALLOWED_TAGS);
		_executeHooks(hooks.uponSanitizeElement, currentNode, {
			tagName,
			allowedTags: ALLOWED_TAGS
		});
		if (currentNode !== root && getParentNode(currentNode) === null) {
			if (IN_PLACE) _neutralizeSubtree(currentNode);
			return true;
		}
		if (_isUnsafeNode(currentNode, tagName)) {
			_forceRemove(currentNode);
			return true;
		}
		if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
			const removed = _sanitizeDisallowedNode(currentNode, tagName, root);
			if (removed === false) _executeHooks(hooks.afterSanitizeElements, currentNode, null);
			return removed;
		}
		if ((getNodeType ? getNodeType(currentNode) : currentNode.nodeType) === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
			_forceRemove(currentNode);
			return true;
		}
		if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(FALLBACK_TAG_CLOSE, currentNode.innerHTML)) {
			_forceRemove(currentNode);
			return true;
		}
		if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
			const content = _stripTemplateExpressions(currentNode.textContent);
			if (currentNode.textContent !== content) {
				arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
				currentNode.textContent = content;
			}
		}
		_executeHooks(hooks.afterSanitizeElements, currentNode, null);
		return false;
	};
	/**
	* _isValidAttribute
	*
	* @param lcTag Lowercase tag name of containing element.
	* @param lcName Lowercase attribute name.
	* @param value Attribute value.
	* @return Returns true if `value` is valid, otherwise false.
	*/
	const _isValidAttribute = function _isValidAttribute$1(lcTag, lcName, value) {
		if (FORBID_ATTR[lcName]) return false;
		if (SAFE_FOR_XML && lcName === "patchsrc") return false;
		if (SAFE_FOR_XML && lcName === "for" && lcTag !== "label" && lcTag !== "output") return false;
		if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document$1 || value in formElement)) return false;
		const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
		if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$1, lcName));
		else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName));
		else if (!nameIsPermitted) if (_isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value)));
		else return false;
		else if (URI_SAFE_ATTRIBUTES[lcName]);
		else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, "")));
		else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]);
		else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, "")));
		else if (value) return false;
		return true;
	};
	const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]);
	/**
	* _isBasicCustomElement
	* checks if at least one dash is included in tagName, and it's not the first char
	* for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
	*
	* @param tagName name of the tag of the node to sanitize
	* @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
	*/
	const _isBasicCustomElement = function _isBasicCustomElement$1(tagName) {
		return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
	};
	/**
	* Wrap an attribute value in the matching Trusted Types object when
	* the active policy requires it. Namespaced attributes pass through
	* unchanged (no TT support yet, see
	* https://bugs.chromium.org/p/chromium/issues/detail?id=1305293).
	*
	* @param lcTag lowercase tag name of the containing element
	* @param lcName lowercase attribute name
	* @param namespaceURI the attribute's namespace, if any
	* @param value the attribute value to wrap
	* @return the value, wrapped when Trusted Types demand it
	*/
	const _applyTrustedTypesToAttribute = function _applyTrustedTypesToAttribute$1(lcTag, lcName, namespaceURI, value) {
		if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function" && !namespaceURI) switch (trustedTypes.getAttributeType(lcTag, lcName)) {
			case "TrustedHTML": return _createTrustedHTML(value);
			case "TrustedScriptURL": return _createTrustedScriptURL(value);
		}
		return value;
	};
	/**
	* Write a modified attribute value back onto the element. On
	* success, re-probe for clobbering introduced by the new value and
	* remove the element when found; otherwise pop the removal entry
	* recorded by the earlier _removeAttribute (long-standing pairing
	* with the SANITIZE_NAMED_PROPS path - do not "fix" casually). On
	* failure, remove the attribute instead.
	*
	* @param currentNode the element carrying the attribute
	* @param name the attribute name as present on the element
	* @param namespaceURI the attribute's namespace, if any
	* @param value the new attribute value
	*/
	const _setAttributeValue = function _setAttributeValue$1(currentNode, name, namespaceURI, value) {
		try {
			if (namespaceURI) currentNode.setAttributeNS(namespaceURI, name, value);
			else currentNode.setAttribute(name, value);
			if (_isClobbered(currentNode)) _forceRemove(currentNode);
			else arrayPop(DOMPurify.removed);
		} catch (_) {
			_removeAttribute(name, currentNode);
		}
	};
	/**
	* _sanitizeAttributes
	*
	* @protect attributes
	* @protect nodeName
	* @protect removeAttribute
	* @protect setAttribute
	*
	* @param currentNode to sanitize
	*/
	const _sanitizeAttributes = function _sanitizeAttributes$1(currentNode) {
		_executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
		const attributes = currentNode.attributes;
		if (!attributes || _isClobbered(currentNode)) return;
		ALLOWED_ATTR = _forkSharedAllowlist(hooks.uponSanitizeAttribute, ALLOWED_ATTR, DEFAULT_ALLOWED_ATTR, SET_CONFIG_ALLOWED_ATTR);
		const hookEvent = {
			attrName: "",
			attrValue: "",
			keepAttr: true,
			allowedAttributes: ALLOWED_ATTR,
			forceKeepAttr: void 0
		};
		let l = attributes.length;
		const lcTag = transformCaseFunc(currentNode.nodeName);
		while (l--) {
			const attr = attributes[l];
			const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
			const lcName = transformCaseFunc(name);
			const initValue = attrValue;
			let value = name === "value" ? initValue : stringTrim(initValue);
			hookEvent.attrName = lcName;
			hookEvent.attrValue = value;
			hookEvent.keepAttr = true;
			hookEvent.forceKeepAttr = void 0;
			_executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
			value = hookEvent.attrValue;
			if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
				_removeAttribute(name, currentNode);
				value = SANITIZE_NAMED_PROPS_PREFIX + value;
			}
			if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
				_removeAttribute(name, currentNode);
				continue;
			}
			if (lcName === "attributename" && stringMatch(value, "href")) {
				_removeAttribute(name, currentNode);
				continue;
			}
			if (hookEvent.forceKeepAttr) continue;
			if (!hookEvent.keepAttr) {
				_removeAttribute(name, currentNode);
				continue;
			}
			if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value)) {
				_removeAttribute(name, currentNode);
				continue;
			}
			if (SAFE_FOR_TEMPLATES) value = _stripTemplateExpressions(value);
			if (!_isValidAttribute(lcTag, lcName, value)) {
				_removeAttribute(name, currentNode);
				continue;
			}
			value = _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value);
			if (value !== initValue) _setAttributeValue(currentNode, name, namespaceURI, value);
		}
		_executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
	};
	/**
	* _sanitizeShadowDOM
	*
	* @param fragment to iterate over recursively
	*/
	const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
		let shadowNode = null;
		const shadowIterator = _createNodeIterator(fragment);
		_executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
		while (shadowNode = shadowIterator.nextNode()) {
			_executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
			_sanitizeElements(shadowNode, fragment);
			_sanitizeAttributes(shadowNode);
			if (_isDocumentFragment(shadowNode.content)) _sanitizeShadowDOM2(shadowNode.content);
			if ((getNodeType ? getNodeType(shadowNode) : shadowNode.nodeType) === NODE_TYPE.element) {
				const innerSr = getShadowRoot(shadowNode);
				if (_isDocumentFragment(innerSr)) {
					_sanitizeAttachedShadowRoots(innerSr);
					_sanitizeShadowDOM2(innerSr);
				}
			}
		}
		_executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
	};
	/**
	* _sanitizeAttachedShadowRoots
	*
	* Walks `root` and feeds every attached shadow root we encounter into
	* the existing _sanitizeShadowDOM pipeline. The default node iterator
	* does not descend into shadow trees, so nodes inside an attached
	* shadow root would otherwise be skipped entirely.
	*
	* Two real input paths put attached shadow roots in front of us:
	*   1. IN_PLACE on a DOM node that already has shadow roots attached.
	*   2. DOM-node input where importNode(dirty, true) deep-clones the
	*      shadow root because it was created with `clonable: true`.
	*
	* This pass runs once, up front, so the main iteration loop (and the
	* existing _sanitizeShadowDOM template-content recursion) stay
	* untouched — string-input paths are not affected.
	*
	* @param root the subtree root to walk for attached shadow roots
	*/
	const _sanitizeAttachedShadowRoots = function _sanitizeAttachedShadowRoots$1(root) {
		const stack = [{
			node: root,
			shadow: null
		}];
		while (stack.length > 0) {
			const item = stack.pop();
			if (item.shadow) {
				_sanitizeShadowDOM2(item.shadow);
				continue;
			}
			const node = item.node;
			const isElement = (getNodeType ? getNodeType(node) : node.nodeType) === NODE_TYPE.element;
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push({
				node: childNodes[i],
				shadow: null
			});
			if (isElement) {
				const rootName = getNodeName ? getNodeName(node) : null;
				if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
					const content = node.content;
					if (_isDocumentFragment(content)) stack.push({
						node: content,
						shadow: null
					});
				}
			}
			if (isElement) {
				const sr = getShadowRoot(node);
				if (_isDocumentFragment(sr)) stack.push({
					node: null,
					shadow: sr
				}, {
					node: sr,
					shadow: null
				});
			}
		}
	};
	DOMPurify.sanitize = function(dirty) {
		let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		let body = null;
		let importedNode = null;
		let currentNode = null;
		let returnNode = null;
		IS_EMPTY_INPUT = !dirty;
		if (IS_EMPTY_INPUT) dirty = "<!-->";
		if (typeof dirty !== "string" && !_isNode(dirty)) {
			dirty = stringifyValue(dirty);
			if (typeof dirty !== "string") throw typeErrorCreate("dirty is not a string, aborting");
		}
		if (!DOMPurify.isSupported) return dirty;
		if (SET_CONFIG) {
			ALLOWED_TAGS = SET_CONFIG_ALLOWED_TAGS;
			ALLOWED_ATTR = SET_CONFIG_ALLOWED_ATTR;
		} else _parseConfig(cfg);
		if (hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) ALLOWED_TAGS = clone(ALLOWED_TAGS);
		if (hooks.uponSanitizeAttribute.length > 0) ALLOWED_ATTR = clone(ALLOWED_ATTR);
		DOMPurify.removed = [];
		const inPlace = IN_PLACE && typeof dirty !== "string" && _isNode(dirty);
		if (inPlace) {
			_neutralizePatchLinkage(dirty);
			const nn = getNodeName ? getNodeName(dirty) : dirty.nodeName;
			if (typeof nn === "string") {
				const tagName = transformCaseFunc(nn);
				if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
					_neutralizeRoot(dirty);
					throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
				}
			}
			if (_isClobbered(dirty)) {
				_neutralizeRoot(dirty);
				throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
			}
			try {
				_sanitizeAttachedShadowRoots(dirty);
			} catch (error) {
				_neutralizeRoot(dirty);
				throw error;
			}
		} else if (_isNode(dirty)) {
			body = _initDocument("<!---->");
			importedNode = body.ownerDocument.importNode(dirty, true);
			if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") body = importedNode;
			else if (importedNode.nodeName === "HTML") body = importedNode;
			else body.appendChild(importedNode);
			_sanitizeAttachedShadowRoots(importedNode);
		} else {
			if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && dirty.indexOf("<") === -1) return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(dirty) : dirty;
			body = _initDocument(dirty);
			if (!body) return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
		}
		if (body && FORCE_BODY) _forceRemove(body.firstChild);
		const walkRoot = inPlace ? dirty : body;
		try {
			const nodeIterator = _createNodeIterator(walkRoot);
			while (currentNode = nodeIterator.nextNode()) {
				_sanitizeElements(currentNode, walkRoot);
				_sanitizeAttributes(currentNode);
				if (_isDocumentFragment(currentNode.content)) _sanitizeShadowDOM2(currentNode.content);
			}
		} catch (error) {
			if (inPlace) {
				_neutralizeRoot(dirty);
				arrayForEach(DOMPurify.removed, (entry) => {
					if (entry.element) _neutralizeSubtree(entry.element);
				});
			}
			throw error;
		}
		if (inPlace) {
			arrayForEach(DOMPurify.removed, (entry) => {
				if (entry.element) _neutralizeSubtree(entry.element);
			});
			if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(dirty);
			return dirty;
		}
		if (RETURN_DOM) {
			if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(body);
			if (RETURN_DOM_FRAGMENT) {
				returnNode = createDocumentFragment.call(body.ownerDocument);
				while (body.firstChild) returnNode.appendChild(body.firstChild);
			} else returnNode = body;
			if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) returnNode = importNode.call(originalDocument, returnNode, true);
			return returnNode;
		}
		let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
		if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
		if (SAFE_FOR_TEMPLATES) serializedHTML = _stripTemplateExpressions(serializedHTML);
		return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(serializedHTML) : serializedHTML;
	};
	DOMPurify.setConfig = function() {
		_parseConfig(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {});
		SET_CONFIG = true;
		SET_CONFIG_ALLOWED_TAGS = ALLOWED_TAGS;
		SET_CONFIG_ALLOWED_ATTR = ALLOWED_ATTR;
	};
	DOMPurify.clearConfig = function() {
		CONFIG = null;
		SET_CONFIG = false;
		SET_CONFIG_ALLOWED_TAGS = null;
		SET_CONFIG_ALLOWED_ATTR = null;
		trustedTypesPolicy = defaultTrustedTypesPolicy;
		emptyHTML = "";
	};
	DOMPurify.isValidAttribute = function(tag$1, attr, value) {
		if (!CONFIG) _parseConfig({});
		return _isValidAttribute(transformCaseFunc(tag$1), transformCaseFunc(attr), value);
	};
	DOMPurify.addHook = function(entryPoint, hookFunction) {
		if (typeof hookFunction !== "function") return;
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		arrayPush(hooks[entryPoint], hookFunction);
	};
	DOMPurify.removeHook = function(entryPoint, hookFunction) {
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		if (hookFunction !== void 0) {
			const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
			return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
		}
		return arrayPop(hooks[entryPoint]);
	};
	DOMPurify.removeHooks = function(entryPoint) {
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		hooks[entryPoint] = [];
	};
	DOMPurify.removeAllHooks = function() {
		hooks = _createHooksMap();
	};
	return DOMPurify;
}
var purify = createDOMPurify();

//#endregion
//#region node_modules/marked/lib/marked.esm.js
/**
* marked v15.0.12 - a markdown parser
* Copyright (c) 2011-2025, Christopher Jeffrey. (MIT Licensed)
* https://github.com/markedjs/marked
*/
/**
* DO NOT EDIT THIS FILE
* The code in this file is generated from files in ./src/
*/
function _getDefaults() {
	return {
		async: false,
		breaks: false,
		extensions: null,
		gfm: true,
		hooks: null,
		pedantic: false,
		renderer: null,
		silent: false,
		tokenizer: null,
		walkTokens: null
	};
}
var _defaults = _getDefaults();
function changeDefaults(newDefaults) {
	_defaults = newDefaults;
}
var noopTest = { exec: () => null };
function edit(regex, opt = "") {
	let source = typeof regex === "string" ? regex : regex.source;
	const obj = {
		replace: (name, val) => {
			let valSource = typeof val === "string" ? val : val.source;
			valSource = valSource.replace(other.caret, "$1");
			source = source.replace(name, valSource);
			return obj;
		},
		getRegex: () => {
			return new RegExp(source, opt);
		}
	};
	return obj;
}
var other = {
	codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
	outputLinkReplace: /\\([\[\]])/g,
	indentCodeCompensation: /^(\s+)(?:```)/,
	beginningSpace: /^\s+/,
	endingHash: /#$/,
	startingSpaceChar: /^ /,
	endingSpaceChar: / $/,
	nonSpaceChar: /[^ ]/,
	newLineCharGlobal: /\n/g,
	tabCharGlobal: /\t/g,
	multipleSpaceGlobal: /\s+/g,
	blankLine: /^[ \t]*$/,
	doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
	blockquoteStart: /^ {0,3}>/,
	blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
	blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
	listReplaceTabs: /^\t+/,
	listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
	listIsTask: /^\[[ xX]\] /,
	listReplaceTask: /^\[[ xX]\] +/,
	anyLine: /\n.*\n/,
	hrefBrackets: /^<(.*)>$/,
	tableDelimiter: /[:|]/,
	tableAlignChars: /^\||\| *$/g,
	tableRowBlankLine: /\n[ \t]*$/,
	tableAlignRight: /^ *-+: *$/,
	tableAlignCenter: /^ *:-+: *$/,
	tableAlignLeft: /^ *:-+ *$/,
	startATag: /^<a /i,
	endATag: /^<\/a>/i,
	startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
	endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
	startAngleBracket: /^</,
	endAngleBracket: />$/,
	pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
	unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
	escapeTest: /[&<>"']/,
	escapeReplace: /[&<>"']/g,
	escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
	escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
	unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi,
	caret: /(^|[^\[])\^/g,
	percentDecode: /%25/g,
	findPipe: /\|/g,
	splitPipe: / \|/,
	slashPipe: /\\\|/g,
	carriageReturn: /\r\n|\r/g,
	spaceLine: /^ +$/gm,
	notSpaceStart: /^\S*/,
	endingNewline: /\n$/,
	listItemRegex: (bull) => /* @__PURE__ */ new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`),
	nextBulletRegex: (indent) => /* @__PURE__ */ new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
	hrRegex: (indent) => /* @__PURE__ */ new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
	fencesBeginRegex: (indent) => /* @__PURE__ */ new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`),
	headingBeginRegex: (indent) => /* @__PURE__ */ new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`),
	htmlBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}<(?:[a-z].*>|!--)`, "i")
};
var newline = /^(?:[ \t]*(?:\n|$))+/;
var blockCode = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var bullet = /(?:[*+-]|\d{1,9}[.)])/;
var lheadingCore = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var lheading = edit(lheadingCore).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var lheadingGfm = edit(lheadingCore).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var blockText = /^[^\n]+/;
var _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
var def = edit(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", _blockLabel).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, bullet).getRegex();
var _tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var _comment = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var html = edit("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", _comment).replace("tag", _tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var paragraph = edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
var blockNormal = {
	blockquote: edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", paragraph).getRegex(),
	code: blockCode,
	def,
	fences,
	heading,
	hr,
	html,
	lheading,
	list,
	newline,
	paragraph,
	table: noopTest,
	text: blockText
};
var gfmTable = edit("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
var blockGfm = {
	...blockNormal,
	lheading: lheadingGfm,
	table: gfmTable,
	paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", gfmTable).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex()
};
var blockPedantic = {
	...blockNormal,
	html: edit(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", _comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: noopTest,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", lheading).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
};
var escape = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var br = /^( {2,}|\\)\n(?!\s*$)/;
var inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var _punctuation = /[\p{P}\p{S}]/u;
var _punctuationOrSpace = /[\s\p{P}\p{S}]/u;
var _notPunctuationOrSpace = /[^\s\p{P}\p{S}]/u;
var punctuation = edit(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, _punctuationOrSpace).getRegex();
var _punctuationGfmStrongEm = /(?!~)[\p{P}\p{S}]/u;
var _punctuationOrSpaceGfmStrongEm = /(?!~)[\s\p{P}\p{S}]/u;
var _notPunctuationOrSpaceGfmStrongEm = /(?:[^\s\p{P}\p{S}]|~)/u;
var blockSkip = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g;
var emStrongLDelimCore = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
var emStrongLDelim = edit(emStrongLDelimCore, "u").replace(/punct/g, _punctuation).getRegex();
var emStrongLDelimGfm = edit(emStrongLDelimCore, "u").replace(/punct/g, _punctuationGfmStrongEm).getRegex();
var emStrongRDelimAstCore = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var emStrongRDelimAst = edit(emStrongRDelimAstCore, "gu").replace(/notPunctSpace/g, _notPunctuationOrSpace).replace(/punctSpace/g, _punctuationOrSpace).replace(/punct/g, _punctuation).getRegex();
var emStrongRDelimAstGfm = edit(emStrongRDelimAstCore, "gu").replace(/notPunctSpace/g, _notPunctuationOrSpaceGfmStrongEm).replace(/punctSpace/g, _punctuationOrSpaceGfmStrongEm).replace(/punct/g, _punctuationGfmStrongEm).getRegex();
var emStrongRDelimUnd = edit("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, _notPunctuationOrSpace).replace(/punctSpace/g, _punctuationOrSpace).replace(/punct/g, _punctuation).getRegex();
var anyPunctuation = edit(/\\(punct)/, "gu").replace(/punct/g, _punctuation).getRegex();
var autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var _inlineComment = edit(_comment).replace("(?:-->|$)", "-->").getRegex();
var tag = edit("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", _inlineComment).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
var link = edit(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", _inlineLabel).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var reflink = edit(/^!?\[(label)\]\[(ref)\]/).replace("label", _inlineLabel).replace("ref", _blockLabel).getRegex();
var nolink = edit(/^!?\[(ref)\](?:\[\])?/).replace("ref", _blockLabel).getRegex();
var inlineNormal = {
	_backpedal: noopTest,
	anyPunctuation,
	autolink,
	blockSkip,
	br,
	code: inlineCode,
	del: noopTest,
	emStrongLDelim,
	emStrongRDelimAst,
	emStrongRDelimUnd,
	escape,
	link,
	nolink,
	punctuation,
	reflink,
	reflinkSearch: edit("reflink|nolink(?!\\()", "g").replace("reflink", reflink).replace("nolink", nolink).getRegex(),
	tag,
	text: inlineText,
	url: noopTest
};
var inlinePedantic = {
	...inlineNormal,
	link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", _inlineLabel).getRegex(),
	reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", _inlineLabel).getRegex()
};
var inlineGfm = {
	...inlineNormal,
	emStrongRDelimAst: emStrongRDelimAstGfm,
	emStrongLDelim: emStrongLDelimGfm,
	url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
	text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
};
var inlineBreaks = {
	...inlineGfm,
	br: edit(br).replace("{2,}", "*").getRegex(),
	text: edit(inlineGfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
};
var block = {
	normal: blockNormal,
	gfm: blockGfm,
	pedantic: blockPedantic
};
var inline = {
	normal: inlineNormal,
	gfm: inlineGfm,
	breaks: inlineBreaks,
	pedantic: inlinePedantic
};
var escapeReplacements = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
};
var getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape2(html2, encode) {
	if (encode) {
		if (other.escapeTest.test(html2)) return html2.replace(other.escapeReplace, getEscapeReplacement);
	} else if (other.escapeTestNoEncode.test(html2)) return html2.replace(other.escapeReplaceNoEncode, getEscapeReplacement);
	return html2;
}
function cleanUrl(href) {
	try {
		href = encodeURI(href).replace(other.percentDecode, "%");
	} catch {
		return null;
	}
	return href;
}
function splitCells(tableRow, count) {
	const cells = tableRow.replace(other.findPipe, (match, offset, str) => {
		let escaped = false;
		let curr = offset;
		while (--curr >= 0 && str[curr] === "\\") escaped = !escaped;
		if (escaped) return "|";
		else return " |";
	}).split(other.splitPipe);
	let i = 0;
	if (!cells[0].trim()) cells.shift();
	if (cells.length > 0 && !cells.at(-1)?.trim()) cells.pop();
	if (count) if (cells.length > count) cells.splice(count);
	else while (cells.length < count) cells.push("");
	for (; i < cells.length; i++) cells[i] = cells[i].trim().replace(other.slashPipe, "|");
	return cells;
}
function rtrim(str, c, invert) {
	const l = str.length;
	if (l === 0) return "";
	let suffLen = 0;
	while (suffLen < l) {
		const currChar = str.charAt(l - suffLen - 1);
		if (currChar === c && !invert) suffLen++;
		else if (currChar !== c && invert) suffLen++;
		else break;
	}
	return str.slice(0, l - suffLen);
}
function findClosingBracket(str, b) {
	if (str.indexOf(b[1]) === -1) return -1;
	let level = 0;
	for (let i = 0; i < str.length; i++) if (str[i] === "\\") i++;
	else if (str[i] === b[0]) level++;
	else if (str[i] === b[1]) {
		level--;
		if (level < 0) return i;
	}
	if (level > 0) return -2;
	return -1;
}
function outputLink(cap, link2, raw, lexer2, rules) {
	const href = link2.href;
	const title = link2.title || null;
	const text$1 = cap[1].replace(rules.other.outputLinkReplace, "$1");
	lexer2.state.inLink = true;
	const token = {
		type: cap[0].charAt(0) === "!" ? "image" : "link",
		raw,
		href,
		title,
		text: text$1,
		tokens: lexer2.inlineTokens(text$1)
	};
	lexer2.state.inLink = false;
	return token;
}
function indentCodeCompensation(raw, text$1, rules) {
	const matchIndentToCode = raw.match(rules.other.indentCodeCompensation);
	if (matchIndentToCode === null) return text$1;
	const indentToCode = matchIndentToCode[1];
	return text$1.split("\n").map((node) => {
		const matchIndentInNode = node.match(rules.other.beginningSpace);
		if (matchIndentInNode === null) return node;
		const [indentInNode] = matchIndentInNode;
		if (indentInNode.length >= indentToCode.length) return node.slice(indentToCode.length);
		return node;
	}).join("\n");
}
var _Tokenizer = class {
	options;
	rules;
	lexer;
	constructor(options2) {
		this.options = options2 || _defaults;
	}
	space(src) {
		const cap = this.rules.block.newline.exec(src);
		if (cap && cap[0].length > 0) return {
			type: "space",
			raw: cap[0]
		};
	}
	code(src) {
		const cap = this.rules.block.code.exec(src);
		if (cap) {
			const text$1 = cap[0].replace(this.rules.other.codeRemoveIndent, "");
			return {
				type: "code",
				raw: cap[0],
				codeBlockStyle: "indented",
				text: !this.options.pedantic ? rtrim(text$1, "\n") : text$1
			};
		}
	}
	fences(src) {
		const cap = this.rules.block.fences.exec(src);
		if (cap) {
			const raw = cap[0];
			const text$1 = indentCodeCompensation(raw, cap[3] || "", this.rules);
			return {
				type: "code",
				raw,
				lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : cap[2],
				text: text$1
			};
		}
	}
	heading(src) {
		const cap = this.rules.block.heading.exec(src);
		if (cap) {
			let text$1 = cap[2].trim();
			if (this.rules.other.endingHash.test(text$1)) {
				const trimmed = rtrim(text$1, "#");
				if (this.options.pedantic) text$1 = trimmed.trim();
				else if (!trimmed || this.rules.other.endingSpaceChar.test(trimmed)) text$1 = trimmed.trim();
			}
			return {
				type: "heading",
				raw: cap[0],
				depth: cap[1].length,
				text: text$1,
				tokens: this.lexer.inline(text$1)
			};
		}
	}
	hr(src) {
		const cap = this.rules.block.hr.exec(src);
		if (cap) return {
			type: "hr",
			raw: rtrim(cap[0], "\n")
		};
	}
	blockquote(src) {
		const cap = this.rules.block.blockquote.exec(src);
		if (cap) {
			let lines = rtrim(cap[0], "\n").split("\n");
			let raw = "";
			let text$1 = "";
			const tokens = [];
			while (lines.length > 0) {
				let inBlockquote = false;
				const currentLines = [];
				let i;
				for (i = 0; i < lines.length; i++) if (this.rules.other.blockquoteStart.test(lines[i])) {
					currentLines.push(lines[i]);
					inBlockquote = true;
				} else if (!inBlockquote) currentLines.push(lines[i]);
				else break;
				lines = lines.slice(i);
				const currentRaw = currentLines.join("\n");
				const currentText = currentRaw.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
				raw = raw ? `${raw}
${currentRaw}` : currentRaw;
				text$1 = text$1 ? `${text$1}
${currentText}` : currentText;
				const top = this.lexer.state.top;
				this.lexer.state.top = true;
				this.lexer.blockTokens(currentText, tokens, true);
				this.lexer.state.top = top;
				if (lines.length === 0) break;
				const lastToken = tokens.at(-1);
				if (lastToken?.type === "code") break;
				else if (lastToken?.type === "blockquote") {
					const oldToken = lastToken;
					const newText = oldToken.raw + "\n" + lines.join("\n");
					const newToken = this.blockquote(newText);
					tokens[tokens.length - 1] = newToken;
					raw = raw.substring(0, raw.length - oldToken.raw.length) + newToken.raw;
					text$1 = text$1.substring(0, text$1.length - oldToken.text.length) + newToken.text;
					break;
				} else if (lastToken?.type === "list") {
					const oldToken = lastToken;
					const newText = oldToken.raw + "\n" + lines.join("\n");
					const newToken = this.list(newText);
					tokens[tokens.length - 1] = newToken;
					raw = raw.substring(0, raw.length - lastToken.raw.length) + newToken.raw;
					text$1 = text$1.substring(0, text$1.length - oldToken.raw.length) + newToken.raw;
					lines = newText.substring(tokens.at(-1).raw.length).split("\n");
					continue;
				}
			}
			return {
				type: "blockquote",
				raw,
				tokens,
				text: text$1
			};
		}
	}
	list(src) {
		let cap = this.rules.block.list.exec(src);
		if (cap) {
			let bull = cap[1].trim();
			const isordered = bull.length > 1;
			const list2 = {
				type: "list",
				raw: "",
				ordered: isordered,
				start: isordered ? +bull.slice(0, -1) : "",
				loose: false,
				items: []
			};
			bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
			if (this.options.pedantic) bull = isordered ? bull : "[*+-]";
			const itemRegex = this.rules.other.listItemRegex(bull);
			let endsWithBlankLine = false;
			while (src) {
				let endEarly = false;
				let raw = "";
				let itemContents = "";
				if (!(cap = itemRegex.exec(src))) break;
				if (this.rules.block.hr.test(src)) break;
				raw = cap[0];
				src = src.substring(raw.length);
				let line = cap[2].split("\n", 1)[0].replace(this.rules.other.listReplaceTabs, (t) => " ".repeat(3 * t.length));
				let nextLine = src.split("\n", 1)[0];
				let blankLine = !line.trim();
				let indent = 0;
				if (this.options.pedantic) {
					indent = 2;
					itemContents = line.trimStart();
				} else if (blankLine) indent = cap[1].length + 1;
				else {
					indent = cap[2].search(this.rules.other.nonSpaceChar);
					indent = indent > 4 ? 1 : indent;
					itemContents = line.slice(indent);
					indent += cap[1].length;
				}
				if (blankLine && this.rules.other.blankLine.test(nextLine)) {
					raw += nextLine + "\n";
					src = src.substring(nextLine.length + 1);
					endEarly = true;
				}
				if (!endEarly) {
					const nextBulletRegex = this.rules.other.nextBulletRegex(indent);
					const hrRegex = this.rules.other.hrRegex(indent);
					const fencesBeginRegex = this.rules.other.fencesBeginRegex(indent);
					const headingBeginRegex = this.rules.other.headingBeginRegex(indent);
					const htmlBeginRegex = this.rules.other.htmlBeginRegex(indent);
					while (src) {
						const rawLine = src.split("\n", 1)[0];
						let nextLineWithoutTabs;
						nextLine = rawLine;
						if (this.options.pedantic) {
							nextLine = nextLine.replace(this.rules.other.listReplaceNesting, "  ");
							nextLineWithoutTabs = nextLine;
						} else nextLineWithoutTabs = nextLine.replace(this.rules.other.tabCharGlobal, "    ");
						if (fencesBeginRegex.test(nextLine)) break;
						if (headingBeginRegex.test(nextLine)) break;
						if (htmlBeginRegex.test(nextLine)) break;
						if (nextBulletRegex.test(nextLine)) break;
						if (hrRegex.test(nextLine)) break;
						if (nextLineWithoutTabs.search(this.rules.other.nonSpaceChar) >= indent || !nextLine.trim()) itemContents += "\n" + nextLineWithoutTabs.slice(indent);
						else {
							if (blankLine) break;
							if (line.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4) break;
							if (fencesBeginRegex.test(line)) break;
							if (headingBeginRegex.test(line)) break;
							if (hrRegex.test(line)) break;
							itemContents += "\n" + nextLine;
						}
						if (!blankLine && !nextLine.trim()) blankLine = true;
						raw += rawLine + "\n";
						src = src.substring(rawLine.length + 1);
						line = nextLineWithoutTabs.slice(indent);
					}
				}
				if (!list2.loose) {
					if (endsWithBlankLine) list2.loose = true;
					else if (this.rules.other.doubleBlankLine.test(raw)) endsWithBlankLine = true;
				}
				let istask = null;
				let ischecked;
				if (this.options.gfm) {
					istask = this.rules.other.listIsTask.exec(itemContents);
					if (istask) {
						ischecked = istask[0] !== "[ ] ";
						itemContents = itemContents.replace(this.rules.other.listReplaceTask, "");
					}
				}
				list2.items.push({
					type: "list_item",
					raw,
					task: !!istask,
					checked: ischecked,
					loose: false,
					text: itemContents,
					tokens: []
				});
				list2.raw += raw;
			}
			const lastItem = list2.items.at(-1);
			if (lastItem) {
				lastItem.raw = lastItem.raw.trimEnd();
				lastItem.text = lastItem.text.trimEnd();
			} else return;
			list2.raw = list2.raw.trimEnd();
			for (let i = 0; i < list2.items.length; i++) {
				this.lexer.state.top = false;
				list2.items[i].tokens = this.lexer.blockTokens(list2.items[i].text, []);
				if (!list2.loose) {
					const spacers = list2.items[i].tokens.filter((t) => t.type === "space");
					list2.loose = spacers.length > 0 && spacers.some((t) => this.rules.other.anyLine.test(t.raw));
				}
			}
			if (list2.loose) for (let i = 0; i < list2.items.length; i++) list2.items[i].loose = true;
			return list2;
		}
	}
	html(src) {
		const cap = this.rules.block.html.exec(src);
		if (cap) return {
			type: "html",
			block: true,
			raw: cap[0],
			pre: cap[1] === "pre" || cap[1] === "script" || cap[1] === "style",
			text: cap[0]
		};
	}
	def(src) {
		const cap = this.rules.block.def.exec(src);
		if (cap) {
			const tag2 = cap[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " ");
			const href = cap[2] ? cap[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "";
			const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : cap[3];
			return {
				type: "def",
				tag: tag2,
				raw: cap[0],
				href,
				title
			};
		}
	}
	table(src) {
		const cap = this.rules.block.table.exec(src);
		if (!cap) return;
		if (!this.rules.other.tableDelimiter.test(cap[2])) return;
		const headers = splitCells(cap[1]);
		const aligns = cap[2].replace(this.rules.other.tableAlignChars, "").split("|");
		const rows = cap[3]?.trim() ? cap[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [];
		const item = {
			type: "table",
			raw: cap[0],
			header: [],
			align: [],
			rows: []
		};
		if (headers.length !== aligns.length) return;
		for (const align of aligns) if (this.rules.other.tableAlignRight.test(align)) item.align.push("right");
		else if (this.rules.other.tableAlignCenter.test(align)) item.align.push("center");
		else if (this.rules.other.tableAlignLeft.test(align)) item.align.push("left");
		else item.align.push(null);
		for (let i = 0; i < headers.length; i++) item.header.push({
			text: headers[i],
			tokens: this.lexer.inline(headers[i]),
			header: true,
			align: item.align[i]
		});
		for (const row of rows) item.rows.push(splitCells(row, item.header.length).map((cell, i) => {
			return {
				text: cell,
				tokens: this.lexer.inline(cell),
				header: false,
				align: item.align[i]
			};
		}));
		return item;
	}
	lheading(src) {
		const cap = this.rules.block.lheading.exec(src);
		if (cap) return {
			type: "heading",
			raw: cap[0],
			depth: cap[2].charAt(0) === "=" ? 1 : 2,
			text: cap[1],
			tokens: this.lexer.inline(cap[1])
		};
	}
	paragraph(src) {
		const cap = this.rules.block.paragraph.exec(src);
		if (cap) {
			const text$1 = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
			return {
				type: "paragraph",
				raw: cap[0],
				text: text$1,
				tokens: this.lexer.inline(text$1)
			};
		}
	}
	text(src) {
		const cap = this.rules.block.text.exec(src);
		if (cap) return {
			type: "text",
			raw: cap[0],
			text: cap[0],
			tokens: this.lexer.inline(cap[0])
		};
	}
	escape(src) {
		const cap = this.rules.inline.escape.exec(src);
		if (cap) return {
			type: "escape",
			raw: cap[0],
			text: cap[1]
		};
	}
	tag(src) {
		const cap = this.rules.inline.tag.exec(src);
		if (cap) {
			if (!this.lexer.state.inLink && this.rules.other.startATag.test(cap[0])) this.lexer.state.inLink = true;
			else if (this.lexer.state.inLink && this.rules.other.endATag.test(cap[0])) this.lexer.state.inLink = false;
			if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(cap[0])) this.lexer.state.inRawBlock = true;
			else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(cap[0])) this.lexer.state.inRawBlock = false;
			return {
				type: "html",
				raw: cap[0],
				inLink: this.lexer.state.inLink,
				inRawBlock: this.lexer.state.inRawBlock,
				block: false,
				text: cap[0]
			};
		}
	}
	link(src) {
		const cap = this.rules.inline.link.exec(src);
		if (cap) {
			const trimmedUrl = cap[2].trim();
			if (!this.options.pedantic && this.rules.other.startAngleBracket.test(trimmedUrl)) {
				if (!this.rules.other.endAngleBracket.test(trimmedUrl)) return;
				const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
				if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) return;
			} else {
				const lastParenIndex = findClosingBracket(cap[2], "()");
				if (lastParenIndex === -2) return;
				if (lastParenIndex > -1) {
					const linkLen = (cap[0].indexOf("!") === 0 ? 5 : 4) + cap[1].length + lastParenIndex;
					cap[2] = cap[2].substring(0, lastParenIndex);
					cap[0] = cap[0].substring(0, linkLen).trim();
					cap[3] = "";
				}
			}
			let href = cap[2];
			let title = "";
			if (this.options.pedantic) {
				const link2 = this.rules.other.pedanticHrefTitle.exec(href);
				if (link2) {
					href = link2[1];
					title = link2[3];
				}
			} else title = cap[3] ? cap[3].slice(1, -1) : "";
			href = href.trim();
			if (this.rules.other.startAngleBracket.test(href)) if (this.options.pedantic && !this.rules.other.endAngleBracket.test(trimmedUrl)) href = href.slice(1);
			else href = href.slice(1, -1);
			return outputLink(cap, {
				href: href ? href.replace(this.rules.inline.anyPunctuation, "$1") : href,
				title: title ? title.replace(this.rules.inline.anyPunctuation, "$1") : title
			}, cap[0], this.lexer, this.rules);
		}
	}
	reflink(src, links) {
		let cap;
		if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
			const link2 = links[(cap[2] || cap[1]).replace(this.rules.other.multipleSpaceGlobal, " ").toLowerCase()];
			if (!link2) {
				const text$1 = cap[0].charAt(0);
				return {
					type: "text",
					raw: text$1,
					text: text$1
				};
			}
			return outputLink(cap, link2, cap[0], this.lexer, this.rules);
		}
	}
	emStrong(src, maskedSrc, prevChar = "") {
		let match = this.rules.inline.emStrongLDelim.exec(src);
		if (!match) return;
		if (match[3] && prevChar.match(this.rules.other.unicodeAlphaNumeric)) return;
		if (!(match[1] || match[2] || "") || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
			const lLength = [...match[0]].length - 1;
			let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
			const endReg = match[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
			endReg.lastIndex = 0;
			maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
			while ((match = endReg.exec(maskedSrc)) != null) {
				rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
				if (!rDelim) continue;
				rLength = [...rDelim].length;
				if (match[3] || match[4]) {
					delimTotal += rLength;
					continue;
				} else if (match[5] || match[6]) {
					if (lLength % 3 && !((lLength + rLength) % 3)) {
						midDelimTotal += rLength;
						continue;
					}
				}
				delimTotal -= rLength;
				if (delimTotal > 0) continue;
				rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
				const lastCharLength = [...match[0]][0].length;
				const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
				if (Math.min(lLength, rLength) % 2) {
					const text2 = raw.slice(1, -1);
					return {
						type: "em",
						raw,
						text: text2,
						tokens: this.lexer.inlineTokens(text2)
					};
				}
				const text$1 = raw.slice(2, -2);
				return {
					type: "strong",
					raw,
					text: text$1,
					tokens: this.lexer.inlineTokens(text$1)
				};
			}
		}
	}
	codespan(src) {
		const cap = this.rules.inline.code.exec(src);
		if (cap) {
			let text$1 = cap[2].replace(this.rules.other.newLineCharGlobal, " ");
			const hasNonSpaceChars = this.rules.other.nonSpaceChar.test(text$1);
			const hasSpaceCharsOnBothEnds = this.rules.other.startingSpaceChar.test(text$1) && this.rules.other.endingSpaceChar.test(text$1);
			if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) text$1 = text$1.substring(1, text$1.length - 1);
			return {
				type: "codespan",
				raw: cap[0],
				text: text$1
			};
		}
	}
	br(src) {
		const cap = this.rules.inline.br.exec(src);
		if (cap) return {
			type: "br",
			raw: cap[0]
		};
	}
	del(src) {
		const cap = this.rules.inline.del.exec(src);
		if (cap) return {
			type: "del",
			raw: cap[0],
			text: cap[2],
			tokens: this.lexer.inlineTokens(cap[2])
		};
	}
	autolink(src) {
		const cap = this.rules.inline.autolink.exec(src);
		if (cap) {
			let text$1, href;
			if (cap[2] === "@") {
				text$1 = cap[1];
				href = "mailto:" + text$1;
			} else {
				text$1 = cap[1];
				href = text$1;
			}
			return {
				type: "link",
				raw: cap[0],
				text: text$1,
				href,
				tokens: [{
					type: "text",
					raw: text$1,
					text: text$1
				}]
			};
		}
	}
	url(src) {
		let cap;
		if (cap = this.rules.inline.url.exec(src)) {
			let text$1, href;
			if (cap[2] === "@") {
				text$1 = cap[0];
				href = "mailto:" + text$1;
			} else {
				let prevCapZero;
				do {
					prevCapZero = cap[0];
					cap[0] = this.rules.inline._backpedal.exec(cap[0])?.[0] ?? "";
				} while (prevCapZero !== cap[0]);
				text$1 = cap[0];
				if (cap[1] === "www.") href = "http://" + cap[0];
				else href = cap[0];
			}
			return {
				type: "link",
				raw: cap[0],
				text: text$1,
				href,
				tokens: [{
					type: "text",
					raw: text$1,
					text: text$1
				}]
			};
		}
	}
	inlineText(src) {
		const cap = this.rules.inline.text.exec(src);
		if (cap) {
			const escaped = this.lexer.state.inRawBlock;
			return {
				type: "text",
				raw: cap[0],
				text: cap[0],
				escaped
			};
		}
	}
};
var _Lexer = class __Lexer {
	tokens;
	options;
	state;
	tokenizer;
	inlineQueue;
	constructor(options2) {
		this.tokens = [];
		this.tokens.links = /* @__PURE__ */ Object.create(null);
		this.options = options2 || _defaults;
		this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
		this.tokenizer = this.options.tokenizer;
		this.tokenizer.options = this.options;
		this.tokenizer.lexer = this;
		this.inlineQueue = [];
		this.state = {
			inLink: false,
			inRawBlock: false,
			top: true
		};
		const rules = {
			other,
			block: block.normal,
			inline: inline.normal
		};
		if (this.options.pedantic) {
			rules.block = block.pedantic;
			rules.inline = inline.pedantic;
		} else if (this.options.gfm) {
			rules.block = block.gfm;
			if (this.options.breaks) rules.inline = inline.breaks;
			else rules.inline = inline.gfm;
		}
		this.tokenizer.rules = rules;
	}
	/**
	* Expose Rules
	*/
	static get rules() {
		return {
			block,
			inline
		};
	}
	/**
	* Static Lex Method
	*/
	static lex(src, options2) {
		return new __Lexer(options2).lex(src);
	}
	/**
	* Static Lex Inline Method
	*/
	static lexInline(src, options2) {
		return new __Lexer(options2).inlineTokens(src);
	}
	/**
	* Preprocessing
	*/
	lex(src) {
		src = src.replace(other.carriageReturn, "\n");
		this.blockTokens(src, this.tokens);
		for (let i = 0; i < this.inlineQueue.length; i++) {
			const next = this.inlineQueue[i];
			this.inlineTokens(next.src, next.tokens);
		}
		this.inlineQueue = [];
		return this.tokens;
	}
	blockTokens(src, tokens = [], lastParagraphClipped = false) {
		if (this.options.pedantic) src = src.replace(other.tabCharGlobal, "    ").replace(other.spaceLine, "");
		while (src) {
			let token;
			if (this.options.extensions?.block?.some((extTokenizer) => {
				if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
					src = src.substring(token.raw.length);
					tokens.push(token);
					return true;
				}
				return false;
			})) continue;
			if (token = this.tokenizer.space(src)) {
				src = src.substring(token.raw.length);
				const lastToken = tokens.at(-1);
				if (token.raw.length === 1 && lastToken !== void 0) lastToken.raw += "\n";
				else tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.code(src)) {
				src = src.substring(token.raw.length);
				const lastToken = tokens.at(-1);
				if (lastToken?.type === "paragraph" || lastToken?.type === "text") {
					lastToken.raw += "\n" + token.raw;
					lastToken.text += "\n" + token.text;
					this.inlineQueue.at(-1).src = lastToken.text;
				} else tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.fences(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.heading(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.hr(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.blockquote(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.list(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.html(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.def(src)) {
				src = src.substring(token.raw.length);
				const lastToken = tokens.at(-1);
				if (lastToken?.type === "paragraph" || lastToken?.type === "text") {
					lastToken.raw += "\n" + token.raw;
					lastToken.text += "\n" + token.raw;
					this.inlineQueue.at(-1).src = lastToken.text;
				} else if (!this.tokens.links[token.tag]) this.tokens.links[token.tag] = {
					href: token.href,
					title: token.title
				};
				continue;
			}
			if (token = this.tokenizer.table(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.lheading(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			let cutSrc = src;
			if (this.options.extensions?.startBlock) {
				let startIndex = Infinity;
				const tempSrc = src.slice(1);
				let tempStart;
				this.options.extensions.startBlock.forEach((getStartIndex) => {
					tempStart = getStartIndex.call({ lexer: this }, tempSrc);
					if (typeof tempStart === "number" && tempStart >= 0) startIndex = Math.min(startIndex, tempStart);
				});
				if (startIndex < Infinity && startIndex >= 0) cutSrc = src.substring(0, startIndex + 1);
			}
			if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
				const lastToken = tokens.at(-1);
				if (lastParagraphClipped && lastToken?.type === "paragraph") {
					lastToken.raw += "\n" + token.raw;
					lastToken.text += "\n" + token.text;
					this.inlineQueue.pop();
					this.inlineQueue.at(-1).src = lastToken.text;
				} else tokens.push(token);
				lastParagraphClipped = cutSrc.length !== src.length;
				src = src.substring(token.raw.length);
				continue;
			}
			if (token = this.tokenizer.text(src)) {
				src = src.substring(token.raw.length);
				const lastToken = tokens.at(-1);
				if (lastToken?.type === "text") {
					lastToken.raw += "\n" + token.raw;
					lastToken.text += "\n" + token.text;
					this.inlineQueue.pop();
					this.inlineQueue.at(-1).src = lastToken.text;
				} else tokens.push(token);
				continue;
			}
			if (src) {
				const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
				if (this.options.silent) {
					console.error(errMsg);
					break;
				} else throw new Error(errMsg);
			}
		}
		this.state.top = true;
		return tokens;
	}
	inline(src, tokens = []) {
		this.inlineQueue.push({
			src,
			tokens
		});
		return tokens;
	}
	/**
	* Lexing/Compiling
	*/
	inlineTokens(src, tokens = []) {
		let maskedSrc = src;
		let match = null;
		if (this.tokens.links) {
			const links = Object.keys(this.tokens.links);
			if (links.length > 0) {
				while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
			}
		}
		while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
		while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
		let keepPrevChar = false;
		let prevChar = "";
		while (src) {
			if (!keepPrevChar) prevChar = "";
			keepPrevChar = false;
			let token;
			if (this.options.extensions?.inline?.some((extTokenizer) => {
				if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
					src = src.substring(token.raw.length);
					tokens.push(token);
					return true;
				}
				return false;
			})) continue;
			if (token = this.tokenizer.escape(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.tag(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.link(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.reflink(src, this.tokens.links)) {
				src = src.substring(token.raw.length);
				const lastToken = tokens.at(-1);
				if (token.type === "text" && lastToken?.type === "text") {
					lastToken.raw += token.raw;
					lastToken.text += token.text;
				} else tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.codespan(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.br(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.del(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.autolink(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (!this.state.inLink && (token = this.tokenizer.url(src))) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			let cutSrc = src;
			if (this.options.extensions?.startInline) {
				let startIndex = Infinity;
				const tempSrc = src.slice(1);
				let tempStart;
				this.options.extensions.startInline.forEach((getStartIndex) => {
					tempStart = getStartIndex.call({ lexer: this }, tempSrc);
					if (typeof tempStart === "number" && tempStart >= 0) startIndex = Math.min(startIndex, tempStart);
				});
				if (startIndex < Infinity && startIndex >= 0) cutSrc = src.substring(0, startIndex + 1);
			}
			if (token = this.tokenizer.inlineText(cutSrc)) {
				src = src.substring(token.raw.length);
				if (token.raw.slice(-1) !== "_") prevChar = token.raw.slice(-1);
				keepPrevChar = true;
				const lastToken = tokens.at(-1);
				if (lastToken?.type === "text") {
					lastToken.raw += token.raw;
					lastToken.text += token.text;
				} else tokens.push(token);
				continue;
			}
			if (src) {
				const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
				if (this.options.silent) {
					console.error(errMsg);
					break;
				} else throw new Error(errMsg);
			}
		}
		return tokens;
	}
};
var _Renderer = class {
	options;
	parser;
	constructor(options2) {
		this.options = options2 || _defaults;
	}
	space(token) {
		return "";
	}
	code({ text: text$1, lang, escaped }) {
		const langString = (lang || "").match(other.notSpaceStart)?.[0];
		const code = text$1.replace(other.endingNewline, "") + "\n";
		if (!langString) return "<pre><code>" + (escaped ? code : escape2(code, true)) + "</code></pre>\n";
		return "<pre><code class=\"language-" + escape2(langString) + "\">" + (escaped ? code : escape2(code, true)) + "</code></pre>\n";
	}
	blockquote({ tokens }) {
		return `<blockquote>
${this.parser.parse(tokens)}</blockquote>
`;
	}
	html({ text: text$1 }) {
		return text$1;
	}
	heading({ tokens, depth }) {
		return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>
`;
	}
	hr(token) {
		return "<hr>\n";
	}
	list(token) {
		const ordered = token.ordered;
		const start = token.start;
		let body = "";
		for (let j = 0; j < token.items.length; j++) {
			const item = token.items[j];
			body += this.listitem(item);
		}
		const type = ordered ? "ol" : "ul";
		const startAttr = ordered && start !== 1 ? " start=\"" + start + "\"" : "";
		return "<" + type + startAttr + ">\n" + body + "</" + type + ">\n";
	}
	listitem(item) {
		let itemBody = "";
		if (item.task) {
			const checkbox = this.checkbox({ checked: !!item.checked });
			if (item.loose) if (item.tokens[0]?.type === "paragraph") {
				item.tokens[0].text = checkbox + " " + item.tokens[0].text;
				if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
					item.tokens[0].tokens[0].text = checkbox + " " + escape2(item.tokens[0].tokens[0].text);
					item.tokens[0].tokens[0].escaped = true;
				}
			} else item.tokens.unshift({
				type: "text",
				raw: checkbox + " ",
				text: checkbox + " ",
				escaped: true
			});
			else itemBody += checkbox + " ";
		}
		itemBody += this.parser.parse(item.tokens, !!item.loose);
		return `<li>${itemBody}</li>
`;
	}
	checkbox({ checked }) {
		return "<input " + (checked ? "checked=\"\" " : "") + "disabled=\"\" type=\"checkbox\">";
	}
	paragraph({ tokens }) {
		return `<p>${this.parser.parseInline(tokens)}</p>
`;
	}
	table(token) {
		let header = "";
		let cell = "";
		for (let j = 0; j < token.header.length; j++) cell += this.tablecell(token.header[j]);
		header += this.tablerow({ text: cell });
		let body = "";
		for (let j = 0; j < token.rows.length; j++) {
			const row = token.rows[j];
			cell = "";
			for (let k = 0; k < row.length; k++) cell += this.tablecell(row[k]);
			body += this.tablerow({ text: cell });
		}
		if (body) body = `<tbody>${body}</tbody>`;
		return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
	}
	tablerow({ text: text$1 }) {
		return `<tr>
${text$1}</tr>
`;
	}
	tablecell(token) {
		const content = this.parser.parseInline(token.tokens);
		const type = token.header ? "th" : "td";
		return (token.align ? `<${type} align="${token.align}">` : `<${type}>`) + content + `</${type}>
`;
	}
	/**
	* span level renderer
	*/
	strong({ tokens }) {
		return `<strong>${this.parser.parseInline(tokens)}</strong>`;
	}
	em({ tokens }) {
		return `<em>${this.parser.parseInline(tokens)}</em>`;
	}
	codespan({ text: text$1 }) {
		return `<code>${escape2(text$1, true)}</code>`;
	}
	br(token) {
		return "<br>";
	}
	del({ tokens }) {
		return `<del>${this.parser.parseInline(tokens)}</del>`;
	}
	link({ href, title, tokens }) {
		const text$1 = this.parser.parseInline(tokens);
		const cleanHref = cleanUrl(href);
		if (cleanHref === null) return text$1;
		href = cleanHref;
		let out = "<a href=\"" + href + "\"";
		if (title) out += " title=\"" + escape2(title) + "\"";
		out += ">" + text$1 + "</a>";
		return out;
	}
	image({ href, title, text: text$1, tokens }) {
		if (tokens) text$1 = this.parser.parseInline(tokens, this.parser.textRenderer);
		const cleanHref = cleanUrl(href);
		if (cleanHref === null) return escape2(text$1);
		href = cleanHref;
		let out = `<img src="${href}" alt="${text$1}"`;
		if (title) out += ` title="${escape2(title)}"`;
		out += ">";
		return out;
	}
	text(token) {
		return "tokens" in token && token.tokens ? this.parser.parseInline(token.tokens) : "escaped" in token && token.escaped ? token.text : escape2(token.text);
	}
};
var _TextRenderer = class {
	strong({ text: text$1 }) {
		return text$1;
	}
	em({ text: text$1 }) {
		return text$1;
	}
	codespan({ text: text$1 }) {
		return text$1;
	}
	del({ text: text$1 }) {
		return text$1;
	}
	html({ text: text$1 }) {
		return text$1;
	}
	text({ text: text$1 }) {
		return text$1;
	}
	link({ text: text$1 }) {
		return "" + text$1;
	}
	image({ text: text$1 }) {
		return "" + text$1;
	}
	br() {
		return "";
	}
};
var _Parser = class __Parser {
	options;
	renderer;
	textRenderer;
	constructor(options2) {
		this.options = options2 || _defaults;
		this.options.renderer = this.options.renderer || new _Renderer();
		this.renderer = this.options.renderer;
		this.renderer.options = this.options;
		this.renderer.parser = this;
		this.textRenderer = new _TextRenderer();
	}
	/**
	* Static Parse Method
	*/
	static parse(tokens, options2) {
		return new __Parser(options2).parse(tokens);
	}
	/**
	* Static Parse Inline Method
	*/
	static parseInline(tokens, options2) {
		return new __Parser(options2).parseInline(tokens);
	}
	/**
	* Parse Loop
	*/
	parse(tokens, top = true) {
		let out = "";
		for (let i = 0; i < tokens.length; i++) {
			const anyToken = tokens[i];
			if (this.options.extensions?.renderers?.[anyToken.type]) {
				const genericToken = anyToken;
				const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
				if (ret !== false || ![
					"space",
					"hr",
					"heading",
					"code",
					"table",
					"blockquote",
					"list",
					"html",
					"paragraph",
					"text"
				].includes(genericToken.type)) {
					out += ret || "";
					continue;
				}
			}
			const token = anyToken;
			switch (token.type) {
				case "space":
					out += this.renderer.space(token);
					continue;
				case "hr":
					out += this.renderer.hr(token);
					continue;
				case "heading":
					out += this.renderer.heading(token);
					continue;
				case "code":
					out += this.renderer.code(token);
					continue;
				case "table":
					out += this.renderer.table(token);
					continue;
				case "blockquote":
					out += this.renderer.blockquote(token);
					continue;
				case "list":
					out += this.renderer.list(token);
					continue;
				case "html":
					out += this.renderer.html(token);
					continue;
				case "paragraph":
					out += this.renderer.paragraph(token);
					continue;
				case "text": {
					let textToken = token;
					let body = this.renderer.text(textToken);
					while (i + 1 < tokens.length && tokens[i + 1].type === "text") {
						textToken = tokens[++i];
						body += "\n" + this.renderer.text(textToken);
					}
					if (top) out += this.renderer.paragraph({
						type: "paragraph",
						raw: body,
						text: body,
						tokens: [{
							type: "text",
							raw: body,
							text: body,
							escaped: true
						}]
					});
					else out += body;
					continue;
				}
				default: {
					const errMsg = "Token with \"" + token.type + "\" type was not found.";
					if (this.options.silent) {
						console.error(errMsg);
						return "";
					} else throw new Error(errMsg);
				}
			}
		}
		return out;
	}
	/**
	* Parse Inline Tokens
	*/
	parseInline(tokens, renderer = this.renderer) {
		let out = "";
		for (let i = 0; i < tokens.length; i++) {
			const anyToken = tokens[i];
			if (this.options.extensions?.renderers?.[anyToken.type]) {
				const ret = this.options.extensions.renderers[anyToken.type].call({ parser: this }, anyToken);
				if (ret !== false || ![
					"escape",
					"html",
					"link",
					"image",
					"strong",
					"em",
					"codespan",
					"br",
					"del",
					"text"
				].includes(anyToken.type)) {
					out += ret || "";
					continue;
				}
			}
			const token = anyToken;
			switch (token.type) {
				case "escape":
					out += renderer.text(token);
					break;
				case "html":
					out += renderer.html(token);
					break;
				case "link":
					out += renderer.link(token);
					break;
				case "image":
					out += renderer.image(token);
					break;
				case "strong":
					out += renderer.strong(token);
					break;
				case "em":
					out += renderer.em(token);
					break;
				case "codespan":
					out += renderer.codespan(token);
					break;
				case "br":
					out += renderer.br(token);
					break;
				case "del":
					out += renderer.del(token);
					break;
				case "text":
					out += renderer.text(token);
					break;
				default: {
					const errMsg = "Token with \"" + token.type + "\" type was not found.";
					if (this.options.silent) {
						console.error(errMsg);
						return "";
					} else throw new Error(errMsg);
				}
			}
		}
		return out;
	}
};
var _Hooks = class {
	options;
	block;
	constructor(options2) {
		this.options = options2 || _defaults;
	}
	static passThroughHooks = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens"
	]);
	/**
	* Process markdown before marked
	*/
	preprocess(markdown) {
		return markdown;
	}
	/**
	* Process HTML after marked is finished
	*/
	postprocess(html2) {
		return html2;
	}
	/**
	* Process all tokens before walk tokens
	*/
	processAllTokens(tokens) {
		return tokens;
	}
	/**
	* Provide function to tokenize markdown
	*/
	provideLexer() {
		return this.block ? _Lexer.lex : _Lexer.lexInline;
	}
	/**
	* Provide function to parse tokens
	*/
	provideParser() {
		return this.block ? _Parser.parse : _Parser.parseInline;
	}
};
var Marked = class {
	defaults = _getDefaults();
	options = this.setOptions;
	parse = this.parseMarkdown(true);
	parseInline = this.parseMarkdown(false);
	Parser = _Parser;
	Renderer = _Renderer;
	TextRenderer = _TextRenderer;
	Lexer = _Lexer;
	Tokenizer = _Tokenizer;
	Hooks = _Hooks;
	constructor(...args) {
		this.use(...args);
	}
	/**
	* Run callback for every token
	*/
	walkTokens(tokens, callback) {
		let values = [];
		for (const token of tokens) {
			values = values.concat(callback.call(this, token));
			switch (token.type) {
				case "table": {
					const tableToken = token;
					for (const cell of tableToken.header) values = values.concat(this.walkTokens(cell.tokens, callback));
					for (const row of tableToken.rows) for (const cell of row) values = values.concat(this.walkTokens(cell.tokens, callback));
					break;
				}
				case "list": {
					const listToken = token;
					values = values.concat(this.walkTokens(listToken.items, callback));
					break;
				}
				default: {
					const genericToken = token;
					if (this.defaults.extensions?.childTokens?.[genericToken.type]) this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
						const tokens2 = genericToken[childTokens].flat(Infinity);
						values = values.concat(this.walkTokens(tokens2, callback));
					});
					else if (genericToken.tokens) values = values.concat(this.walkTokens(genericToken.tokens, callback));
				}
			}
		}
		return values;
	}
	use(...args) {
		const extensions = this.defaults.extensions || {
			renderers: {},
			childTokens: {}
		};
		args.forEach((pack) => {
			const opts = { ...pack };
			opts.async = this.defaults.async || opts.async || false;
			if (pack.extensions) {
				pack.extensions.forEach((ext) => {
					if (!ext.name) throw new Error("extension name required");
					if ("renderer" in ext) {
						const prevRenderer = extensions.renderers[ext.name];
						if (prevRenderer) extensions.renderers[ext.name] = function(...args2) {
							let ret = ext.renderer.apply(this, args2);
							if (ret === false) ret = prevRenderer.apply(this, args2);
							return ret;
						};
						else extensions.renderers[ext.name] = ext.renderer;
					}
					if ("tokenizer" in ext) {
						if (!ext.level || ext.level !== "block" && ext.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
						const extLevel = extensions[ext.level];
						if (extLevel) extLevel.unshift(ext.tokenizer);
						else extensions[ext.level] = [ext.tokenizer];
						if (ext.start) {
							if (ext.level === "block") if (extensions.startBlock) extensions.startBlock.push(ext.start);
							else extensions.startBlock = [ext.start];
							else if (ext.level === "inline") if (extensions.startInline) extensions.startInline.push(ext.start);
							else extensions.startInline = [ext.start];
						}
					}
					if ("childTokens" in ext && ext.childTokens) extensions.childTokens[ext.name] = ext.childTokens;
				});
				opts.extensions = extensions;
			}
			if (pack.renderer) {
				const renderer = this.defaults.renderer || new _Renderer(this.defaults);
				for (const prop in pack.renderer) {
					if (!(prop in renderer)) throw new Error(`renderer '${prop}' does not exist`);
					if (["options", "parser"].includes(prop)) continue;
					const rendererProp = prop;
					const rendererFunc = pack.renderer[rendererProp];
					const prevRenderer = renderer[rendererProp];
					renderer[rendererProp] = (...args2) => {
						let ret = rendererFunc.apply(renderer, args2);
						if (ret === false) ret = prevRenderer.apply(renderer, args2);
						return ret || "";
					};
				}
				opts.renderer = renderer;
			}
			if (pack.tokenizer) {
				const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
				for (const prop in pack.tokenizer) {
					if (!(prop in tokenizer)) throw new Error(`tokenizer '${prop}' does not exist`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(prop)) continue;
					const tokenizerProp = prop;
					const tokenizerFunc = pack.tokenizer[tokenizerProp];
					const prevTokenizer = tokenizer[tokenizerProp];
					tokenizer[tokenizerProp] = (...args2) => {
						let ret = tokenizerFunc.apply(tokenizer, args2);
						if (ret === false) ret = prevTokenizer.apply(tokenizer, args2);
						return ret;
					};
				}
				opts.tokenizer = tokenizer;
			}
			if (pack.hooks) {
				const hooks = this.defaults.hooks || new _Hooks();
				for (const prop in pack.hooks) {
					if (!(prop in hooks)) throw new Error(`hook '${prop}' does not exist`);
					if (["options", "block"].includes(prop)) continue;
					const hooksProp = prop;
					const hooksFunc = pack.hooks[hooksProp];
					const prevHook = hooks[hooksProp];
					if (_Hooks.passThroughHooks.has(prop)) hooks[hooksProp] = (arg) => {
						if (this.defaults.async) return Promise.resolve(hooksFunc.call(hooks, arg)).then((ret2) => {
							return prevHook.call(hooks, ret2);
						});
						const ret = hooksFunc.call(hooks, arg);
						return prevHook.call(hooks, ret);
					};
					else hooks[hooksProp] = (...args2) => {
						let ret = hooksFunc.apply(hooks, args2);
						if (ret === false) ret = prevHook.apply(hooks, args2);
						return ret;
					};
				}
				opts.hooks = hooks;
			}
			if (pack.walkTokens) {
				const walkTokens2 = this.defaults.walkTokens;
				const packWalktokens = pack.walkTokens;
				opts.walkTokens = function(token) {
					let values = [];
					values.push(packWalktokens.call(this, token));
					if (walkTokens2) values = values.concat(walkTokens2.call(this, token));
					return values;
				};
			}
			this.defaults = {
				...this.defaults,
				...opts
			};
		});
		return this;
	}
	setOptions(opt) {
		this.defaults = {
			...this.defaults,
			...opt
		};
		return this;
	}
	lexer(src, options2) {
		return _Lexer.lex(src, options2 ?? this.defaults);
	}
	parser(tokens, options2) {
		return _Parser.parse(tokens, options2 ?? this.defaults);
	}
	parseMarkdown(blockType) {
		const parse2 = (src, options2) => {
			const origOpt = { ...options2 };
			const opt = {
				...this.defaults,
				...origOpt
			};
			const throwError = this.onError(!!opt.silent, !!opt.async);
			if (this.defaults.async === true && origOpt.async === false) return throwError(/* @__PURE__ */ new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
			if (typeof src === "undefined" || src === null) return throwError(/* @__PURE__ */ new Error("marked(): input parameter is undefined or null"));
			if (typeof src !== "string") return throwError(/* @__PURE__ */ new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
			if (opt.hooks) {
				opt.hooks.options = opt;
				opt.hooks.block = blockType;
			}
			const lexer2 = opt.hooks ? opt.hooks.provideLexer() : blockType ? _Lexer.lex : _Lexer.lexInline;
			const parser2 = opt.hooks ? opt.hooks.provideParser() : blockType ? _Parser.parse : _Parser.parseInline;
			if (opt.async) return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer2(src2, opt)).then((tokens) => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens).then((tokens) => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser2(tokens, opt)).then((html2) => opt.hooks ? opt.hooks.postprocess(html2) : html2).catch(throwError);
			try {
				if (opt.hooks) src = opt.hooks.preprocess(src);
				let tokens = lexer2(src, opt);
				if (opt.hooks) tokens = opt.hooks.processAllTokens(tokens);
				if (opt.walkTokens) this.walkTokens(tokens, opt.walkTokens);
				let html2 = parser2(tokens, opt);
				if (opt.hooks) html2 = opt.hooks.postprocess(html2);
				return html2;
			} catch (e) {
				return throwError(e);
			}
		};
		return parse2;
	}
	onError(silent, async) {
		return (e) => {
			e.message += "\nPlease report this to https://github.com/markedjs/marked.";
			if (silent) {
				const msg = "<p>An error occurred:</p><pre>" + escape2(e.message + "", true) + "</pre>";
				if (async) return Promise.resolve(msg);
				return msg;
			}
			if (async) return Promise.reject(e);
			throw e;
		};
	}
};
var markedInstance = new Marked();
function marked(src, opt) {
	return markedInstance.parse(src, opt);
}
marked.options = marked.setOptions = function(options2) {
	markedInstance.setOptions(options2);
	marked.defaults = markedInstance.defaults;
	changeDefaults(marked.defaults);
	return marked;
};
marked.getDefaults = _getDefaults;
marked.defaults = _defaults;
marked.use = function(...args) {
	markedInstance.use(...args);
	marked.defaults = markedInstance.defaults;
	changeDefaults(marked.defaults);
	return marked;
};
marked.walkTokens = function(tokens, callback) {
	return markedInstance.walkTokens(tokens, callback);
};
marked.parseInline = markedInstance.parseInline;
marked.Parser = _Parser;
marked.parser = _Parser.parse;
marked.Renderer = _Renderer;
marked.TextRenderer = _TextRenderer;
marked.Lexer = _Lexer;
marked.lexer = _Lexer.lex;
marked.Tokenizer = _Tokenizer;
marked.Hooks = _Hooks;
marked.parse = marked;
var options = marked.options;
var setOptions = marked.setOptions;
var use = marked.use;
var walkTokens = marked.walkTokens;
var parseInline = marked.parseInline;
var parser = _Parser.parse;
var lexer = _Lexer.lex;

//#endregion
//#region src/route.ts
/** Shared route path for the dock's file-content endpoint. */
const ROUTE_PATH = "/api/output-dock/file";

//#endregion
//#region src/client/resources.ts
/** Browser URL for one workspace-confined output file. */
function fileUrl(path) {
	return `${ROUTE_PATH}?path=${encodeURIComponent(path)}`;
}
function isSiblingReference(href) {
	return href !== "" && !href.startsWith("#") && !href.startsWith("/") && !href.startsWith("//") && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(href);
}
function normalizeSibling(sourcePath, reference) {
	const normalized = sourcePath.replaceAll("\\", "/");
	const base = normalized.slice(0, Math.max(0, normalized.lastIndexOf("/") + 1));
	const parts = (base.endsWith("/") ? base.slice(0, -1) : base).split("/");
	for (const part of reference.replaceAll("\\", "/").split("/")) {
		if (part === "" || part === ".") continue;
		if (part === "..") {
			const floor = parts[0] === "" || /^[A-Za-z]:$/.test(parts[0] ?? "") ? 1 : 0;
			if (parts.length > floor) parts.pop();
			continue;
		}
		parts.push(part);
	}
	return parts.join("/");
}
/** Resolve one resource reference found inside a preview document. */
function resolveResourceUrl(sourcePath, href) {
	if (!isSiblingReference(href)) return href;
	const hashAt = href.indexOf("#");
	const beforeHash = hashAt === -1 ? href : href.slice(0, hashAt);
	const hash = hashAt === -1 ? "" : href.slice(hashAt);
	const queryAt = beforeHash.indexOf("?");
	const reference = queryAt === -1 ? beforeHash : beforeHash.slice(0, queryAt);
	const query = queryAt === -1 ? "" : beforeHash.slice(queryAt + 1);
	return `${fileUrl(normalizeSibling(sourcePath, reference))}${query === "" ? "" : `&${query}`}${hash}`;
}
/** Normalize a sanitized SVG document for a contained sidebar preview. */
function prepareSvg(_sourcePath, source) {
	const doc = new DOMParser().parseFromString(source, "image/svg+xml");
	const svg$2 = doc.documentElement;
	if (svg$2.localName !== "svg" || doc.querySelector("parsererror") !== null) return source;
	const numericDimension = (value) => {
		const match = /^\s*(\d+(?:\.\d+)?)\s*(?:px)?\s*$/i.exec(value ?? "");
		if (match === null) return null;
		const parsed = Number(match[1]);
		return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
	};
	if (!svg$2.hasAttribute("viewBox")) {
		const width = numericDimension(svg$2.getAttribute("width"));
		const height = numericDimension(svg$2.getAttribute("height"));
		if (width !== null && height !== null) svg$2.setAttribute("viewBox", `0 0 ${width} ${height}`);
	}
	if (svg$2.hasAttribute("viewBox")) {
		svg$2.removeAttribute("width");
		svg$2.removeAttribute("height");
	}
	svg$2.setAttribute("preserveAspectRatio", "xMidYMid meet");
	for (const node of svg$2.querySelectorAll("[href]")) {
		const href = node.getAttribute("href");
		if (href !== null) node.setAttribute("href", resolveResourceUrl(_sourcePath, href));
	}
	for (const node of svg$2.querySelectorAll("[*|href]")) {
		const href = node.getAttribute("xlink:href");
		if (href !== null) node.setAttribute("xlink:href", resolveResourceUrl(_sourcePath, href));
	}
	return new XMLSerializer().serializeToString(svg$2);
}
function rewriteHtmlResources(sourcePath, doc) {
	for (const attribute of [
		"src",
		"href",
		"poster"
	]) for (const node of doc.querySelectorAll(`[${attribute}]`)) {
		const value = node.getAttribute(attribute);
		if (value !== null) node.setAttribute(attribute, resolveResourceUrl(sourcePath, value));
	}
}
const HTML_FIT_CSS = `
html { width: 100%; overflow-x: hidden; }
body { width: 100%; min-width: 0; margin: 0; overflow-x: hidden; overflow-wrap: anywhere; }
*, *::before, *::after { box-sizing: border-box; }
img, svg, video, canvas, iframe, table, pre { max-width: 100%; }
img, svg, video, canvas { height: auto; }
main, section, article, header, footer, nav, aside, div, form { min-width: 0; max-width: 100%; }
pre, code { white-space: pre-wrap; overflow-wrap: anywhere; }
table { width: 100%; table-layout: fixed; border-collapse: collapse; }
th, td { overflow-wrap: anywhere; }
`;
function makeHtmlResponsive(doc) {
	let viewport = doc.head.querySelector("meta[name=\"viewport\"]");
	if (viewport === null) {
		viewport = doc.createElement("meta");
		viewport.name = "viewport";
		doc.head.prepend(viewport);
	}
	viewport.content = "width=device-width, initial-scale=1";
	const style = doc.createElement("style");
	style.dataset.outputDockFit = "";
	style.textContent = HTML_FIT_CSS;
	doc.head.append(style);
}
/** Rewrite relative assets in an HTML preview document. */
function prepareHtml(sourcePath, source) {
	const doc = new DOMParser().parseFromString(source, "text/html");
	rewriteHtmlResources(sourcePath, doc);
	makeHtmlResponsive(doc);
	return `<!doctype html>${doc.documentElement.outerHTML}`;
}
/** Rewrite relative assets in sanitized Markdown-rendered HTML. */
function prepareHtmlFragment(sourcePath, source) {
	const doc = new DOMParser().parseFromString(source, "text/html");
	rewriteHtmlResources(sourcePath, doc);
	return doc.body.innerHTML;
}

//#endregion
//#region src/client/qc.ts
/**
* Deterministic, rule-only quality checks per output kind. Everything here
* runs locally: no model, no extra tokens. Markdown checks the fence balance
* and probes relative links against the plugin's file route; SVG/HTML parse
* with the DOM parser and report structure problems; images report load and
* dimension facts.
*/
const QC_LOADING = {
	level: "loading",
	issues: []
};
async function probeExists(url) {
	try {
		return (await fetch(url, { method: "HEAD" })).ok;
	} catch {
		return false;
	}
}
/** Relative link/image targets from Markdown source (deduped, ordered). */
function markdownRelativeTargets(source) {
	const seen = /* @__PURE__ */ new Set();
	const targets = [];
	for (const match of source.matchAll(/!?\[[^\]]*]\(([^()\s]+)\)/g)) {
		const target = match[1] ?? "";
		if (target === "" || target.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
		if (seen.has(target)) continue;
		seen.add(target);
		targets.push(target);
	}
	return targets;
}
function fenceBalance(source) {
	let count = 0;
	for (const line of source.split("\n")) if (/^\s*(```|~~~)/.test(line)) count++;
	return count;
}
async function checkMarkdown(path, source) {
	const issues = [];
	if (fenceBalance(source) % 2 !== 0) issues.push({
		level: "error",
		code: "md-unbalanced-fence"
	});
	const targets = markdownRelativeTargets(source).slice(0, 32);
	let missing = 0;
	for (const target of targets) if (!await probeExists(resolveResourceUrl(path, target))) missing++;
	if (missing > 0) issues.push({
		level: "warn",
		code: "md-broken-link",
		count: missing
	});
	return finish(issues);
}
async function checkSvg(source) {
	const issues = [];
	const doc = new DOMParser().parseFromString(source, "image/svg+xml");
	const root = doc.documentElement;
	if (doc.querySelector("parsererror") !== null || root.localName !== "svg") return {
		level: "error",
		issues: [{
			level: "error",
			code: "svg-parse"
		}]
	};
	if (!root.hasAttribute("viewBox")) issues.push({
		level: "warn",
		code: "svg-no-viewbox"
	});
	if (root.querySelectorAll("script, foreignObject, iframe, [onclick], [onload], [href^=\"javascript:\"]").length > 0) issues.push({
		level: "warn",
		code: "svg-sanitized"
	});
	return finish(issues);
}
async function checkHtml(source) {
	const issues = [];
	const problems = new DOMParser().parseFromString(source, "text/html").querySelectorAll("parsererror").length;
	if (problems > 0) issues.push({
		level: "warn",
		code: "html-parse",
		count: problems
	});
	return finish(issues);
}
function finish(issues) {
	if (issues.length === 0) return {
		level: "ok",
		issues: []
	};
	return {
		level: issues.some((issue) => issue.level === "error") ? "error" : "warn",
		issues
	};
}

//#endregion
//#region src/client/preview.tsx
/**
* Inline preview renderers. Content bytes arrive through the plugin's own
* file route; every HTML-ish surface is sanitized before insertion (svg via
* a DOMPurify svg profile, html inside a sandboxed iframe, markdown through
* DOMPurify on rendered output).
*/
/** Sanitize Markdown-rendered HTML. */
function sanitizeHtml(html$3) {
	return purify.sanitize(html$3, { USE_PROFILES: { html: true } });
}
/** Sanitize an SVG document for inline embedding. */
function sanitizeSvg(source) {
	return purify.sanitize(source, {
		USE_PROFILES: {
			svg: true,
			svgFilters: true
		},
		ADD_TAGS: ["style"],
		ADD_ATTR: [
			"fill",
			"stroke",
			"viewBox"
		]
	});
}
function isTextBacked(entry) {
	return entry.kind === "md" || entry.kind === "svg" || entry.kind === "html" || entry.kind === "text";
}
/** Text-backed previews fetch once per selected path. */
function useTextPreview(entry) {
	const [state, setState] = (0, react.useState)({
		status: "idle",
		content: ""
	});
	(0, react.useEffect)(() => {
		if (!isTextBacked(entry)) {
			setState({
				status: "idle",
				content: ""
			});
			return;
		}
		let stale = false;
		setState({
			status: "loading",
			content: ""
		});
		fetch(fileUrl(entry.path)).then(async (response) => {
			if (!response.ok) throw new Error(String(response.status));
			return response.text();
		}).then((text$1) => {
			if (!stale) setState({
				status: "ready",
				content: text$1
			});
		}).catch(() => {
			if (!stale) setState({
				status: "error",
				content: ""
			});
		});
		return () => {
			stale = true;
		};
	}, [entry.kind, entry.path]);
	return state;
}
function MarkdownPreview({ entry, content }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "dsh-od-preview-md",
		dangerouslySetInnerHTML: { __html: (0, react.useMemo)(() => prepareHtmlFragment(entry.path, sanitizeHtml(marked.parse(content, { async: false }))), [content, entry.path]) }
	});
}
function SvgPreview({ entry, content }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "dsh-od-svg-stage",
		dangerouslySetInnerHTML: { __html: (0, react.useMemo)(() => prepareSvg(entry.path, sanitizeSvg(content)), [content, entry.path]) }
	});
}
function ImagePreview({ entry, onResult }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
		className: "dsh-od-preview-img",
		src: fileUrl(entry.path),
		alt: entry.path,
		onLoad: () => {
			onResult({
				level: "ok",
				issues: []
			});
		},
		onError: () => {
			onResult({
				level: "error",
				issues: [{
					level: "error",
					code: "image-failed"
				}]
			});
		}
	});
}
function HtmlPreview({ entry, content }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("iframe", {
		className: "dsh-od-preview-frame",
		sandbox: "",
		srcDoc: (0, react.useMemo)(() => prepareHtml(entry.path, content), [content, entry.path]),
		title: entry.path
	});
}
function TextPreview({ content }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
		className: "dsh-od-preview-text",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: content })
	});
}
function PdfPreview({ entry, onResult }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("iframe", {
		className: "dsh-od-preview-frame dsh-od-preview-pdf",
		src: fileUrl(entry.path),
		title: entry.path,
		onLoad: () => {
			onResult({
				level: "ok",
				issues: []
			});
		},
		onError: () => {
			onResult({
				level: "error",
				issues: [{
					level: "error",
					code: "file-read"
				}]
			});
		}
	});
}
function Preview({ entry, onResult, labels }) {
	const state = useTextPreview(entry);
	(0, react.useEffect)(() => {
		if (!isTextBacked(entry)) return;
		if (state.status === "error") {
			onResult({
				level: "error",
				issues: [{
					level: "error",
					code: "file-read"
				}]
			});
			return;
		}
		if (state.status !== "ready") {
			onResult(QC_LOADING);
			return;
		}
		let stale = false;
		const run = async () => {
			const result = entry.kind === "md" ? await checkMarkdown(entry.path, state.content) : entry.kind === "svg" ? await checkSvg(state.content) : entry.kind === "html" ? await checkHtml(state.content) : {
				level: "ok",
				issues: []
			};
			if (!stale) onResult(result);
		};
		run();
		return () => {
			stale = true;
		};
	}, [
		entry,
		onResult,
		state
	]);
	if (state.status === "error") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "dsh-od-preview-state",
		"data-state": "error",
		children: labels.error
	});
	if (isTextBacked(entry) && state.status !== "ready") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "dsh-od-preview-state",
		"data-state": "loading",
		children: labels.loading
	});
	if (state.status === "ready" && state.content === "") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "dsh-od-preview-state",
		children: labels.empty
	});
	switch (entry.kind) {
		case "md": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarkdownPreview, {
			entry,
			content: state.status === "ready" ? state.content : ""
		});
		case "svg": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SvgPreview, {
			entry,
			content: state.status === "ready" ? state.content : ""
		});
		case "html": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(HtmlPreview, {
			entry,
			content: state.status === "ready" ? state.content : ""
		});
		case "image": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ImagePreview, {
			entry,
			onResult
		});
		case "pdf": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PdfPreview, {
			entry,
			onResult
		});
		case "text": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TextPreview, { content: state.status === "ready" ? state.content : "" });
	}
}

//#endregion
//#region src/client/qc-state.ts
function sameResult(left, right) {
	return left !== void 0 && left.level === right.level && left.issues.length === right.issues.length && left.issues.every((issue, index) => {
		const other$1 = right.issues[index];
		return other$1 !== void 0 && issue.level === other$1.level && issue.code === other$1.code && issue.count === other$1.count;
	});
}
function mergeQcResult(current, path, result) {
	if (sameResult(current.get(path), result)) return current;
	return new Map(current).set(path, result);
}

//#endregion
//#region src/client/sidebar-state.ts
/** Parent directory spelling for Windows, POSIX, and workspace-relative paths. */
function directoryOfPath(path) {
	const at = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
	if (at < 0) return ".";
	if (at === 0) return path[0] ?? ".";
	return path.slice(0, at);
}
/** Rich, user-facing formats may reveal themselves; source-like text stays quiet. */
function shouldAutoOpen(entry) {
	return entry.kind !== "text";
}
/** Visible tab order: pinned first, then newest activity, without mutating input. */
function visibleTabs(entries$1, hidden, pinned = /* @__PURE__ */ new Set(), closedAt = /* @__PURE__ */ new Map()) {
	return entries$1.filter((entry) => !hidden.has(entry.path) && entry.lastSeq > (closedAt.get(entry.path) ?? -1)).sort((left, right) => Number(pinned.has(right.path)) - Number(pinned.has(left.path)) || right.lastSeq - left.lastSeq);
}
/** Apply manual order to known tabs while leaving newly produced entries in front. */
function orderedTabs(entries$1, order) {
	const byPath = new Map(entries$1.map((entry) => [entry.path, entry]));
	const orderedPaths = new Set(order);
	return [...entries$1.filter((entry) => !orderedPaths.has(entry.path)), ...order.flatMap((path) => {
		const entry = byPath.get(path);
		return entry === void 0 ? [] : [entry];
	})];
}
/** Move the dragged tab immediately before the drop target. */
function reorderTab(paths, draggedPath, targetPath) {
	if (draggedPath === targetPath || !paths.includes(draggedPath) || !paths.includes(targetPath)) return paths;
	const next = paths.filter((path) => path !== draggedPath);
	next.splice(next.indexOf(targetPath), 0, draggedPath);
	return next;
}
/** Reconcile sidebar selection against one visible output snapshot. */
function reconcileSelection(entries$1, currentPath, seenSeq) {
	const newest = entries$1.reduce((current, entry) => current === void 0 || entry.lastSeq > current.lastSeq ? entry : current, void 0);
	if (newest === void 0) return {
		path: null,
		seenSeq,
		hasNewOutput: false
	};
	const hasNewOutput = newest.lastSeq > seenSeq;
	const nextSeenSeq = Math.max(seenSeq, newest.lastSeq);
	const currentVisible = currentPath !== null && entries$1.some((entry) => entry.path === currentPath);
	if (hasNewOutput) return {
		path: entries$1.reduce((current, entry) => {
			if (entry.lastSeq <= seenSeq || !shouldAutoOpen(entry)) return current;
			return current === void 0 || entry.lastSeq > current.lastSeq ? entry : current;
		}, void 0)?.path ?? (currentVisible ? currentPath : newest.path),
		seenSeq: nextSeenSeq,
		hasNewOutput: true
	};
	return {
		path: currentVisible ? currentPath : newest.path,
		seenSeq: nextSeenSeq,
		hasNewOutput: false
	};
}

//#endregion
//#region src/client/viewport.ts
const COMPACT_VIEWPORT_QUERY = "(max-width: 1023px)";
function dockRenderTarget(compact) {
	return compact ? "mobile" : "details";
}
function getCompactViewport() {
	return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(COMPACT_VIEWPORT_QUERY).matches;
}
function subscribeCompactViewport(listener) {
	if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => {};
	const media = window.matchMedia(COMPACT_VIEWPORT_QUERY);
	media.addEventListener("change", listener);
	return () => {
		media.removeEventListener("change", listener);
	};
}

//#endregion
//#region src/client/DockPanel.tsx
/** Native details-column output viewer and its inactive edge launcher. */
const OUTPUT_SURFACE = "output-dock";
/** Subscribe to just the output view snapshot of one session. */
function useDockSnapshot(session) {
	const subscribe = (0, react.useCallback)((onChange) => {
		if (session === void 0) return () => {};
		let last = session.getSnapshot().views.get("outputDock");
		return session.subscribe(() => {
			const next = session.getSnapshot().views.get("outputDock");
			if (next !== last) {
				last = next;
				onChange();
			}
		});
	}, [session]);
	const getSnapshot = (0, react.useCallback)(() => session?.getSnapshot().views.get("outputDock") ?? EMPTY_OUTPUT_DOCK_SNAPSHOT, [session]);
	return (0, react.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
}
function useDetailsSurface(layout) {
	const subscribe = (0, react.useCallback)((onChange) => layout.subscribeDetailsSurface(onChange), [layout]);
	const getSnapshot = (0, react.useCallback)(() => layout.getDetailsSurface(), [layout]);
	return (0, react.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
}
function useCompactViewport() {
	return (0, react.useSyncExternalStore)(subscribeCompactViewport, getCompactViewport, () => false);
}
function currentSession(props) {
	const current = props.useSessions((state) => state.current);
	return current === void 0 ? void 0 : props.sessions.binding(current)?.session;
}
function IconButton(props) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
		type: "button",
		className: "dsh-od-icon-btn",
		"data-active": props.active || void 0,
		onClick: props.onClick,
		disabled: props.disabled,
		"aria-label": props.label,
		title: props.label,
		children: props.children
	});
}
function OutputDockSurface(props) {
	const { layout, sessions, t } = props;
	const sessionId = props.useSessions((state) => state.current);
	const snapshot = useDockSnapshot(sessionId === void 0 ? void 0 : sessions.binding(sessionId)?.session);
	const surface = useDetailsSurface(layout);
	const [persisted, setPersisted] = (0, react.useState)(() => loadDockState(localStorage));
	const [draggedPath, setDraggedPath] = (0, react.useState)(null);
	const [selectedPath, setSelectedPath] = (0, react.useState)(null);
	const [qcByPath, setQcByPath] = (0, react.useState)(/* @__PURE__ */ new Map());
	const [copied, setCopied] = (0, react.useState)(null);
	const selectedRef = (0, react.useRef)(null);
	const seenSeqRef = (0, react.useRef)(0);
	const pinned = (0, react.useMemo)(() => new Set(persisted.pinned), [persisted.pinned]);
	const hidden = (0, react.useMemo)(() => new Set(persisted.hidden), [persisted.hidden]);
	const sessionState = sessionId === void 0 ? EMPTY_SESSION_PERSISTED : persisted.sessions[sessionId] ?? EMPTY_SESSION_PERSISTED;
	const closedAt = (0, react.useMemo)(() => new Map(Object.entries(sessionState.closedAt)), [sessionState.closedAt]);
	const automaticOrder = (0, react.useMemo)(() => visibleTabs(snapshot.entries, hidden, pinned, closedAt), [
		closedAt,
		hidden,
		pinned,
		snapshot.entries
	]);
	const visible = (0, react.useMemo)(() => orderedTabs(automaticOrder, sessionState.order), [automaticOrder, sessionState.order]);
	(0, react.useEffect)(() => {
		saveDockState(localStorage, persisted);
	}, [persisted]);
	const updateSessionState = (update) => {
		if (sessionId === void 0) return;
		setPersisted((previous) => ({
			...previous,
			sessions: {
				...previous.sessions,
				[sessionId]: update(previous.sessions[sessionId] ?? EMPTY_SESSION_PERSISTED)
			}
		}));
	};
	(0, react.useEffect)(() => {
		const next = reconcileSelection(visible, selectedRef.current, seenSeqRef.current);
		selectedRef.current = next.path;
		seenSeqRef.current = next.seenSeq;
		setSelectedPath(next.path);
		const selectedNewOutput = visible.find((entry) => entry.path === next.path);
		if (next.hasNewOutput && selectedNewOutput !== void 0 && shouldAutoOpen(selectedNewOutput)) layout.openDetails(OUTPUT_SURFACE);
	}, [layout, visible]);
	const selected = visible.find((entry) => entry.path === selectedPath) ?? null;
	const hiddenCount = hidden.size;
	const select = (path) => {
		selectedRef.current = path;
		setSelectedPath(path);
	};
	const setQc = (0, react.useCallback)((path, result) => {
		setQcByPath((previous) => mergeQcResult(previous, path, result));
	}, []);
	const onPreviewResult = (0, react.useCallback)((result) => {
		if (selectedPath !== null) setQc(selectedPath, result);
	}, [selectedPath, setQc]);
	const copy = async (text$1, kind) => {
		try {
			await navigator.clipboard.writeText(text$1);
			setCopied(kind);
			window.setTimeout(() => {
				setCopied((current) => current === kind ? null : current);
			}, 1500);
		} catch {}
	};
	const copyContent = async (entry) => {
		try {
			const response = await fetch(fileUrl(entry.path));
			if (!response.ok) return;
			await copy(await response.text(), "content");
		} catch {}
	};
	const download = (entry) => {
		const anchor = document.createElement("a");
		anchor.href = fileUrl(entry.path);
		anchor.download = basename(entry.path);
		anchor.click();
	};
	const togglePin = (path) => {
		setPersisted((previous) => ({
			...previous,
			pinned: previous.pinned.includes(path) ? previous.pinned.filter((item) => item !== path) : [...previous.pinned, path]
		}));
	};
	const hide = (path) => {
		setPersisted((previous) => ({
			...previous,
			hidden: [...new Set([...previous.hidden, path])]
		}));
	};
	const clearHidden = () => {
		setPersisted((previous) => ({
			...previous,
			hidden: []
		}));
	};
	const closeTab = (entry) => {
		updateSessionState((previous) => ({
			...previous,
			closedAt: {
				...previous.closedAt,
				[entry.path]: entry.lastSeq
			}
		}));
	};
	const dropTab = (targetPath, sourcePath) => {
		if (sourcePath === null || sourcePath === "") return;
		const order = reorderTab(visible.map((entry) => entry.path), sourcePath, targetPath);
		updateSessionState((previous) => ({
			...previous,
			order
		}));
		setDraggedPath(null);
	};
	if (surface !== OUTPUT_SURFACE) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
		className: "dsh-od-panel",
		"aria-label": t("dock.title"),
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
			className: "dsh-od-header",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh-od-tabs",
				role: "tablist",
				"aria-label": t("dock.chooseFile"),
				children: visible.map((entry) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-od-tab-wrap",
					"data-active": entry.path === selectedPath || void 0,
					"data-dragging": entry.path === draggedPath || void 0,
					title: entry.path,
					onDragOver: (event) => {
						event.preventDefault();
						event.dataTransfer.dropEffect = "move";
					},
					onDrop: (event) => {
						event.preventDefault();
						dropTab(entry.path, draggedPath ?? event.dataTransfer.getData("text/plain"));
					},
					onDragEnd: () => {
						setDraggedPath(null);
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": entry.path === selectedPath,
						className: "dsh-od-tab",
						draggable: true,
						onClick: () => {
							select(entry.path);
						},
						onDragStart: (event) => {
							event.dataTransfer.effectAllowed = "move";
							event.dataTransfer.setData("text/plain", entry.path);
							setDraggedPath(entry.path);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: basename(entry.path) })
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dsh-od-tab-close",
						"aria-label": t("dock.closeTab", { name: basename(entry.path) }),
						title: t("dock.closeTab", { name: basename(entry.path) }),
						onClick: () => {
							closeTab(entry);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(import_lucide_react.X, {
							size: 13,
							"aria-hidden": true
						})
					})]
				}, entry.path))
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconButton, {
				label: t("dock.collapse"),
				onClick: () => {
					layout.closeDetails();
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(import_lucide_react.PanelRightClose, {
					size: 16,
					"aria-hidden": true
				})
			})]
		}), selected === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "dsh-od-empty",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(import_lucide_react.Files, {
					size: 28,
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: snapshot.entries.length === 0 ? t("dock.empty") : t("dock.allHidden") }),
				hiddenCount > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "dsh-od-text-btn",
					onClick: clearHidden,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(import_lucide_react.RotateCcw, {
						size: 14,
						"aria-hidden": true
					}), t("dock.clearHidden")]
				})
			]
		}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: "dsh-od-preview-canvas",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Preview, {
				entry: selected,
				onResult: onPreviewResult,
				labels: {
					loading: t("preview.loading"),
					error: t("preview.error"),
					empty: t("preview.empty")
				}
			}, selected.path)
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("footer", {
			className: "dsh-od-footer",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-od-toolbar",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconButton, {
						label: copied === "path" ? t("dock.copied") : t("dock.copyPath"),
						onClick: () => {
							copy(selected.path, "path");
						},
						children: copied === "path" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(import_lucide_react.Check, {
							size: 16,
							"aria-hidden": true
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(import_lucide_react.Link, {
							size: 16,
							"aria-hidden": true
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconButton, {
						label: copied === "content" ? t("dock.copied") : t("dock.copyContent"),
						onClick: () => {
							copyContent(selected);
						},
						disabled: selected.kind === "image" || selected.kind === "pdf",
						children: copied === "content" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(import_lucide_react.Check, {
							size: 16,
							"aria-hidden": true
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(import_lucide_react.Clipboard, {
							size: 16,
							"aria-hidden": true
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconButton, {
						label: t("dock.reveal"),
						onClick: () => {
							props.openPath(directoryOfPath(selected.path));
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(import_lucide_react.FolderOpen, {
							size: 16,
							"aria-hidden": true
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconButton, {
						label: t("dock.download"),
						onClick: () => {
							download(selected);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(import_lucide_react.Download, {
							size: 16,
							"aria-hidden": true
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconButton, {
						label: pinned.has(selected.path) ? t("dock.unpin") : t("dock.pin"),
						active: pinned.has(selected.path),
						onClick: () => {
							togglePin(selected.path);
						},
						children: pinned.has(selected.path) ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(import_lucide_react.PinOff, {
							size: 16,
							"aria-hidden": true
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(import_lucide_react.Pin, {
							size: 16,
							"aria-hidden": true
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconButton, {
						label: t("dock.hide"),
						onClick: () => {
							hide(selected.path);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(import_lucide_react.EyeOff, {
							size: 16,
							"aria-hidden": true
						})
					})
				]
			})
		})] })]
	});
}
function OutputDockPanel(props) {
	if (dockRenderTarget(useCompactViewport()) !== "details") return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(OutputDockSurface, { ...props });
}
function OutputDockLauncher(props) {
	const target = dockRenderTarget(useCompactViewport());
	const snapshot = useDockSnapshot(currentSession(props));
	if (useDetailsSurface(props.layout) === OUTPUT_SURFACE) return target === "mobile" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "dsh-od-mobile-shell",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(OutputDockSurface, { ...props })
	}) : null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "dsh-od-launcher",
		onClick: () => {
			props.layout.openDetails(OUTPUT_SURFACE);
		},
		"aria-label": props.t("dock.expand"),
		title: props.t("dock.expand"),
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(import_lucide_react.Files, {
			size: 17,
			"aria-hidden": true
		}), snapshot.entries.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: snapshot.entries.length })]
	});
}

//#endregion
//#region src/client/locales.ts
/** `output-dock` namespace dictionaries. */
/** Dictionary namespace owned by this plugin. */
const NS = "output-dock";
/** Simplified Chinese dictionary (the key-set source of truth). */
const zh = {
	"dock.title": "Outputs",
	"dock.empty": "还没有可预览的产出物。",
	"dock.allHidden": "所有产出物都已隐藏。",
	"dock.expand": "打开产出物侧边栏",
	"dock.collapse": "关闭产出物侧边栏",
	"dock.chooseFile": "选择产出物",
	"dock.closeTab": "关闭 {name}",
	"dock.preview": "预览 {name}",
	"dock.copyPath": "复制路径",
	"dock.copyContent": "复制内容",
	"dock.pin": "置顶",
	"dock.unpin": "取消置顶",
	"dock.hide": "隐藏",
	"dock.unhide": "取消隐藏",
	"dock.clearHidden": "恢复已隐藏的条目",
	"dock.download": "下载",
	"dock.reveal": "在资源管理器中显示",
	"dock.turn": "第 {turn} 轮",
	"dock.copied": "已复制",
	"dock.hiddenCount": "{count} 个已隐藏",
	"preview.loading": "正在载入预览…",
	"preview.error": "无法读取这个产出物",
	"preview.empty": "文件为空",
	"qc.ok": "检查通过",
	"qc.brokenLink": "{count} 个相对链接指向不存在的文件",
	"qc.unbalancedFence": "代码围栏不成对",
	"qc.svgParse": "SVG 解析失败",
	"qc.svgNoViewBox": "SVG 缺少 viewBox",
	"qc.svgSanitized": "SVG 含被移除的危险元素",
	"qc.imageFailed": "图片无法加载",
	"qc.htmlParse": "HTML 存在 {count} 处解析问题",
	"qc.fileRead": "文件读取失败",
	"qc.loading": "检查中…"
};
/** English dictionary (same key set). */
const en = {
	"dock.title": "Outputs",
	"dock.empty": "No previewable outputs yet.",
	"dock.allHidden": "All outputs are hidden.",
	"dock.expand": "Open outputs sidebar",
	"dock.collapse": "Close outputs sidebar",
	"dock.chooseFile": "Choose an output",
	"dock.closeTab": "Close {name}",
	"dock.preview": "Preview {name}",
	"dock.copyPath": "Copy path",
	"dock.copyContent": "Copy content",
	"dock.pin": "Pin",
	"dock.unpin": "Unpin",
	"dock.hide": "Hide",
	"dock.unhide": "Unhide",
	"dock.clearHidden": "Restore hidden entries",
	"dock.download": "Download",
	"dock.reveal": "Show in File Explorer",
	"dock.turn": "Turn {turn}",
	"dock.copied": "Copied",
	"dock.hiddenCount": "{count} hidden",
	"preview.loading": "Loading preview…",
	"preview.error": "This output could not be read",
	"preview.empty": "This file is empty",
	"qc.ok": "Checks passed",
	"qc.brokenLink": "{count} relative links point to missing files",
	"qc.unbalancedFence": "Unbalanced code fences",
	"qc.svgParse": "SVG failed to parse",
	"qc.svgNoViewBox": "SVG is missing a viewBox",
	"qc.svgSanitized": "SVG contained dangerous elements that were stripped",
	"qc.imageFailed": "Image failed to load",
	"qc.htmlParse": "HTML has {count} parse issues",
	"qc.fileRead": "File read failed",
	"qc.loading": "Checking…"
};

//#endregion
//#region src/client/style.ts
/** Plugin-owned stylesheet for the native details-column output surface. */
const DOCK_STYLE_ID = "dsh-output-dock/styles";
const DOCK_CSS = `
.dsh-od-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  overflow: hidden;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font-family: var(--ds-font-family, ui-sans-serif, system-ui, sans-serif);
  font-size: 13px;
}

.dsh-od-header {
  display: grid;
  flex: none;
  grid-template-columns: minmax(0, 1fr) 30px;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.dsh-od-tabs {
  display: flex;
  min-width: 0;
  height: 32px;
  align-items: center;
  gap: 1px;
  padding: 0 2px 2px 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-color: var(--dsw-alias-border-l2) transparent;
  scrollbar-width: thin;
}

.dsh-od-tab-wrap {
  display: grid;
  flex: 1 1 180px;
  min-width: 112px;
  max-width: 220px;
  height: 30px;
  grid-template-columns: minmax(0, 1fr) 0;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: grab;
  transition: background-color 120ms ease;
}

.dsh-od-tab-wrap:hover {
  grid-template-columns: minmax(0, 1fr) 25px;
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-od-tab-wrap[data-active] {
  grid-template-columns: minmax(0, 1fr) 25px;
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.dsh-od-tab-wrap[data-dragging] {
  opacity: 0.45;
  cursor: grabbing;
}
.dsh-od-tab {
  display: grid;
  width: 100%;
  min-width: 0;
  height: 28px;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  padding: 3px 8px 3px 12px;
  overflow: hidden;
  border: none;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.dsh-od-tab > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-od-tab-close {
  display: grid;
  width: 24px;
  height: 24px;
  padding: 0;
  place-items: center;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
}
.dsh-od-tab-wrap:hover .dsh-od-tab-close,
.dsh-od-tab-wrap[data-active] .dsh-od-tab-close,
.dsh-od-tab-close:focus-visible {
  opacity: 1;
  pointer-events: auto;
}
.dsh-od-tab-close:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.dsh-od-icon-btn {
  display: grid;
  flex: none;
  width: 30px;
  height: 30px;
  padding: 0;
  place-items: center;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}

.dsh-od-icon-btn:hover,
.dsh-od-icon-btn[data-active] {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.dsh-od-icon-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.dsh-od-icon-btn:focus-visible,
.dsh-od-tab:focus-visible,
.dsh-od-tab-close:focus-visible,
.dsh-od-file-picker:focus-visible,
.dsh-od-file-option:focus-visible,
.dsh-od-text-btn:focus-visible,
.dsh-od-launcher:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}

.dsh-od-filebar {
  position: relative;
  z-index: 3;
  flex: none;
  padding: 8px 10px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
}

.dsh-od-file-picker {
  display: grid;
  width: 100%;
  min-height: 48px;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  padding: 6px 8px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.dsh-od-file-picker:hover,
.dsh-od-file-picker[aria-expanded='true'] {
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-interactive-bg-hover);
}

.dsh-od-file-copy,
.dsh-od-option-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1px;
}

.dsh-od-file-name,
.dsh-od-option-copy > span {
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dsh-od-file-path,
.dsh-od-option-copy small {
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dsh-od-kind {
  display: inline-grid;
  min-width: 36px;
  height: 22px;
  place-items: center;
  padding: 0 6px;
  border-radius: 5px;
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-secondary);
  font-size: 9px;
  line-height: 1;
  font-weight: 700;
  text-transform: uppercase;
}

.dsh-od-kind-md { background: #e8f1ff; color: #245ea8; }
.dsh-od-kind-svg { background: #f0eafb; color: #67449a; }
.dsh-od-kind-image { background: #e5f3e9; color: #276d3d; }
.dsh-od-kind-html { background: #fff0df; color: #975019; }
.dsh-od-kind-pdf { background: #fbe7e5; color: #9a3730; }
.dsh-od-kind-text { background: #e8eef1; color: #3f5964; }

.dsh-od-file-menu {
  position: absolute;
  top: calc(100% - 2px);
  right: 10px;
  left: 10px;
  z-index: 5;
  max-height: min(360px, 50vh);
  padding: 5px;
  overflow-y: auto;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-base);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.14);
}

.dsh-od-file-option {
  display: grid;
  width: 100%;
  min-height: 48px;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  padding: 6px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.dsh-od-file-option:hover,
.dsh-od-file-option[aria-selected='true'] {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dsh-od-preview-canvas {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--dsw-alias-bg-base);
}

.dsh-od-preview-state,
.dsh-od-empty {
  display: grid;
  flex: 1;
  min-height: 180px;
  place-content: center;
  justify-items: center;
  gap: 10px;
  padding: 24px;
  color: var(--dsw-alias-label-tertiary);
  text-align: center;
}

.dsh-od-preview-state[data-state='loading'] {
  animation: dsh-od-fade 1.2s ease-in-out infinite alternate;
}

.dsh-od-preview-state[data-state='error'] {
  color: var(--dsw-alias-state-error-primary);
}

.dsh-od-empty p {
  max-width: 30ch;
  margin: 0;
  line-height: 20px;
}

.dsh-od-text-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 5px 9px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}

.dsh-od-preview-md {
  width: 100%;
  max-width: 72ch;
  margin: 0 auto;
  padding: 18px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.dsh-od-preview-md > :first-child { margin-top: 0; }
.dsh-od-preview-md > :last-child { margin-bottom: 0; }
.dsh-od-preview-md h1 { margin: 1.3em 0 0.45em; font-size: 22px; line-height: 1.25; }
.dsh-od-preview-md h2 { margin: 1.2em 0 0.4em; font-size: 18px; line-height: 1.3; }
.dsh-od-preview-md h3 { margin: 1.1em 0 0.35em; font-size: 15px; line-height: 1.4; }
.dsh-od-preview-md a { color: var(--dsw-alias-brand-primary); text-underline-offset: 3px; }
.dsh-od-preview-md img { display: block; max-width: 100%; height: auto; margin: 12px auto; }
.dsh-od-preview-md code {
  padding: 2px 5px;
  border-radius: 4px;
  background: var(--dsw-alias-markdown-code-block);
  font-family: var(--ds-font-family-code);
  font-size: 0.92em;
}
.dsh-od-preview-md pre {
  padding: 14px;
  overflow: hidden;
  border-radius: 8px;
  background: var(--dsw-alias-markdown-code-block);
}
.dsh-od-preview-md pre code {
  padding: 0;
  background: none;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.dsh-od-preview-md table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
.dsh-od-preview-md th,
.dsh-od-preview-md td {
  padding: 6px 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  overflow-wrap: anywhere;
}

.dsh-od-svg-stage {
  display: grid;
  flex: 1;
  min-height: 240px;
  padding: 18px;
  place-items: center;
  box-sizing: border-box;
  overflow: hidden;
}

.dsh-od-svg-stage > svg {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

.dsh-od-preview-img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 240px;
  padding: 18px;
  box-sizing: border-box;
  object-fit: contain;
}

.dsh-od-preview-text {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 16px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  line-height: 20px;
  tab-size: 2;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.dsh-od-preview-frame {
  display: block;
  flex: 1;
  width: 100%;
  min-height: 360px;
  border: none;
  background: #fff;
}

.dsh-od-preview-pdf { height: 100%; }

.dsh-od-footer {
  flex: none;
  border-top: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
}

.dsh-od-toolbar {
  display: flex;
  min-height: 44px;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding: 6px 10px;
}

.dsh-od-launcher {
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 21;
  display: flex;
  min-width: 36px;
  height: 42px;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 7px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-right: none;
  border-radius: 8px 0 0 8px;
  background: var(--dsw-alias-button-floating-fill);
  color: var(--dsw-alias-label-secondary);
  box-shadow: -2px 5px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-50%);
  cursor: pointer;
  pointer-events: auto;
}

.dsh-od-launcher:hover {
  background: var(--dsw-alias-button-floating-hover);
  color: var(--dsw-alias-label-primary);
}

.dsh-od-launcher span {
  font-size: 10px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.dsh-od-mobile-shell {
  display: none;
}

::selection {
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 24%, transparent);
}

@keyframes dsh-od-fade { to { opacity: 0.45; } }

@media (prefers-reduced-motion: reduce) {
  .dsh-od-preview-state[data-state='loading'] {
    animation: none;
  }
}

@media (max-width: 1023px) {
  .dsh-od-mobile-shell {
    position: absolute;
    inset: 0 0 0 56px;
    z-index: 22;
    display: block;
    overflow: hidden;
    background: var(--dsw-alias-bg-base);
    pointer-events: auto;
  }

  .dsh-od-mobile-shell .dsh-od-panel {
    max-width: none;
  }
}
`;
/** Inject the stylesheet once and return its disposer. */
function injectDockStyles() {
	if (typeof document === "undefined") return () => {};
	if (document.querySelector(`style[data-plugin-css="${DOCK_STYLE_ID}"]`) !== null) return () => {};
	const tag$1 = document.createElement("style");
	tag$1.dataset.plugin = "dsh-output-dock";
	tag$1.dataset.pluginCss = DOCK_STYLE_ID;
	tag$1.textContent = DOCK_CSS;
	document.head.appendChild(tag$1);
	return () => {
		document.querySelector(`style[data-plugin-css="${DOCK_STYLE_ID}"]`)?.remove();
	};
}

//#endregion
//#region src/client/view.ts
var OutputDockViewBuilder = class {
	empty = EMPTY_OUTPUT_DOCK_SNAPSHOT;
	turns = /* @__PURE__ */ new Map();
	replace(input) {
		this.turns.clear();
		for (const node of input.nodes) this.turns.set(node.data.turn, node.data);
		return this.snapshot();
	}
	apply(input) {
		for (const node of input.upserts) this.turns.set(node.data.turn, node.data);
		return this.snapshot();
	}
	snapshot() {
		const entries$1 = /* @__PURE__ */ new Map();
		const order = [...this.turns.keys()].sort((left, right) => left - right);
		for (const turn of order) {
			const payload = this.turns.get(turn);
			if (payload === void 0) continue;
			for (const produced of payload.produced) {
				const kind = kindOfPath(produced.path);
				if (kind === null) continue;
				const previous = entries$1.get(produced.path);
				entries$1.set(produced.path, previous === void 0 ? {
					path: produced.path,
					kind,
					firstTurn: turn,
					lastTurn: turn,
					lastSeq: produced.seq
				} : {
					...previous,
					lastTurn: turn,
					lastSeq: produced.seq
				});
			}
		}
		return { entries: [...entries$1.values()] };
	}
};
/** The dock's conversation view target definition. */
const outputDockViewDefinition = {
	target: "outputDock",
	create: () => new OutputDockViewBuilder()
};

//#endregion
//#region src/client/index.ts
/** Required services for the dock surfaces. */
const inject = [
	"slots",
	"locale",
	"conversationEvents",
	"conversationViews",
	"sessions",
	"workspaces",
	"layout"
];
/**
* Client plugin body: install dictionaries and styles, register the
* collection definition and view target, then inject the floating dock.
* @param ctx - client root context.
*/
function apply(ctx) {
	const openPath = (path) => {
		const list$1 = ctx.sessions.list.getSnapshot();
		const cwd = list$1.current === void 0 ? void 0 : list$1.byId[list$1.current]?.cwd;
		ctx.workspaces.openPath((0, __deepseek_ai_dsh_client_runtime_client.resolveWorkspacePath)(cwd, path));
	};
	ctx.effect(() => ctx.locale.register(NS, {
		zh,
		en
	}), "output-dock: dictionaries");
	ctx.effect(injectDockStyles, "output-dock: styles");
	ctx.conversationEvents.register(outputDockDefinition);
	ctx.conversationViews.register(outputDockViewDefinition);
	ctx.slots.inject("details.overlay", () => ctx.slots.register({
		name: "details.overlay",
		id: "output-dock-panel",
		order: 100,
		locale: NS,
		inject: () => ({
			sessions: ctx.sessions,
			layout: ctx.layout,
			openPath
		})
	}, OutputDockPanel));
	ctx.slots.inject("shell.overlay", () => ctx.slots.register({
		name: "shell.overlay",
		id: "output-dock-launcher",
		order: 100,
		locale: NS,
		inject: () => ({
			sessions: ctx.sessions,
			layout: ctx.layout,
			openPath
		})
	}, OutputDockLauncher));
}

//#endregion
exports.apply = apply;
exports.inject = inject;
return module.exports; } });
//# sourceMappingURL=client.js.map