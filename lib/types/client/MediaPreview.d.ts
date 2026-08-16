export interface MediaPreviewLabels {
    readonly zoomIn: string;
    readonly zoomOut: string;
    readonly fit: string;
    readonly actualSize: string;
    readonly transparency: string;
    readonly dimensions: (width: number, height: number) => string;
}
export declare function MediaPreview(props: {
    readonly kind: 'image' | 'svg';
    readonly source: string;
    readonly alt: string;
    readonly labels: MediaPreviewLabels;
    readonly onLoad: () => void;
    readonly onError: () => void;
}): React.JSX.Element;
