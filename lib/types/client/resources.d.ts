/** Browser URL for one workspace-confined output file. */
export declare function fileUrl(path: string, revision?: number): string;
/** Resolve one resource reference found inside a preview document. */
export declare function resolveResourceUrl(sourcePath: string, href: string, revision?: number): string;
/** Normalize a sanitized SVG document for a contained sidebar preview. */
export declare function prepareSvg(_sourcePath: string, source: string, revision?: number): string;
/** Rewrite relative assets in an HTML preview document. */
export declare function prepareHtml(sourcePath: string, source: string, revision?: number): string;
/** Rewrite relative assets in sanitized Markdown-rendered HTML. */
export declare function prepareHtmlFragment(sourcePath: string, source: string, revision?: number): string;
