/** Browser URL for one workspace-confined output file. */
export declare function fileUrl(path: string): string;
/** Save text-backed output content through the workspace-confined file route. */
export declare function saveFileContent(path: string, content: string): Promise<void>;
/** Resolve one resource reference found inside a preview document. */
export declare function resolveResourceUrl(sourcePath: string, href: string): string;
/** Normalize a sanitized SVG document for a contained sidebar preview. */
export declare function prepareSvg(_sourcePath: string, source: string): string;
/** Rewrite relative assets in an HTML preview document. */
export declare function prepareHtml(sourcePath: string, source: string): string;
/** Rewrite relative assets in sanitized Markdown-rendered HTML. */
export declare function prepareHtmlFragment(sourcePath: string, source: string): string;
