export type QcLevel = 'ok' | 'warn' | 'error' | 'loading';
export interface QcIssue {
    readonly level: 'warn' | 'error';
    readonly code: 'md-broken-link' | 'md-unbalanced-fence' | 'svg-parse' | 'svg-no-viewbox' | 'svg-sanitized' | 'image-failed' | 'html-parse' | 'file-read';
    readonly count?: number;
}
export interface QcResult {
    readonly level: QcLevel;
    readonly issues: readonly QcIssue[];
}
export declare const QC_LOADING: QcResult;
/** Relative link/image targets from Markdown source (deduped, ordered). */
export declare function markdownRelativeTargets(source: string): readonly string[];
export declare function checkMarkdown(path: string, source: string): Promise<QcResult>;
export declare function checkSvg(source: string): Promise<QcResult>;
export declare function checkHtml(source: string): Promise<QcResult>;
export declare function checkImage(element: HTMLImageElement): QcResult;
