/** Browser URL for one workspace-confined output file. */
export declare function fileUrl(path: string, revision?: number): string;
/** Authorize one agent-produced path before loading it from the local route. */
export declare function authorizeFileContent(path: string): Promise<string>;
/** Save text-backed output content through the workspace-confined file route. */
export declare function saveFileContent(path: string, content: string): Promise<void>;
/** Byte size of one output via a HEAD probe; null when unknown (e.g. network outputs). */
export declare function outputFileSize(path: string): Promise<number | null>;
/** Resolve one resource reference found inside a preview document. */
export declare function resolveResourceUrl(sourcePath: string, href: string): string;
/** Normalize a sanitized SVG document for a contained sidebar preview. */
export declare function prepareSvg(_sourcePath: string, source: string): string;
/** Rewrite relative assets in an HTML preview document. */
export declare function prepareHtml(sourcePath: string, source: string): string;
/** Rewrite relative assets in sanitized Markdown-rendered HTML. */
export declare function prepareHtmlFragment(sourcePath: string, source: string): string;
