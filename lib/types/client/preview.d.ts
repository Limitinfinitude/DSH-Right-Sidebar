import type { OutputEntry } from './contract.ts';
import { type DataPreviewLabels } from './DataFilePreview.tsx';
import { type MediaPreviewLabels } from './MediaPreview.tsx';
import { type QcResult } from './qc.ts';
export declare function MarkdownPreview({ source, content }: {
    source: string;
    content: string;
}): React.JSX.Element;
export declare function SvgPreview({ entry, source, content, labels }: {
    entry: OutputEntry;
    source: string;
    content: string;
    labels: MediaPreviewLabels;
}): React.JSX.Element;
export declare function ImagePreview({ entry, source, onResult, labels }: {
    entry: OutputEntry;
    source: string;
    onResult: (result: QcResult) => void;
    labels: MediaPreviewLabels;
}): React.JSX.Element;
export declare function HtmlPreview({ entry, source, content }: {
    entry: OutputEntry;
    source: string;
    content: string;
}): React.JSX.Element;
export declare function CodePreview({ entry, content }: {
    entry: OutputEntry;
    content: string;
}): React.JSX.Element;
export declare function PdfPreview({ entry, source, onResult, labels }: {
    entry: OutputEntry;
    source: string;
    onResult: (result: QcResult) => void;
    labels: {
        readonly refresh: string;
        readonly openExternal: string;
    };
}): React.JSX.Element;
export interface PreviewLabels {
    readonly loading: string;
    readonly error: string;
    readonly empty: string;
    readonly data: DataPreviewLabels;
    readonly media: MediaPreviewLabels;
    readonly pdf: {
        readonly refresh: string;
        readonly openExternal: string;
    };
}
export declare function Preview({ entry, onResult, labels }: {
    entry: OutputEntry;
    onResult: (result: QcResult) => void;
    labels: PreviewLabels;
}): React.JSX.Element;
