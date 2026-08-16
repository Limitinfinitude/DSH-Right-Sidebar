export interface DataPreviewLabels {
    readonly search: string;
    readonly raw: string;
    readonly structured: string;
    readonly wrap: string;
    readonly previous: string;
    readonly next: string;
    readonly page: (page: number, count: number) => string;
    readonly rows: (count: number) => string;
    readonly matches: (count: number) => string;
    readonly expandAll: string;
    readonly collapseAll: string;
    readonly parseError: string;
    readonly truncated: (count: number) => string;
}
export declare function DataFilePreview(props: {
    readonly path: string;
    readonly content: string;
    readonly labels: DataPreviewLabels;
}): React.JSX.Element;
