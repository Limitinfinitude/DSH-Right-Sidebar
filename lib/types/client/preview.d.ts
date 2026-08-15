import type { OutputEntry } from './contract.ts';
import { type QcResult } from './qc.ts';
export declare function MarkdownPreview({ entry, content }: {
    entry: OutputEntry;
    content: string;
}): React.JSX.Element;
export declare function SvgPreview({ entry, content }: {
    entry: OutputEntry;
    content: string;
}): React.JSX.Element;
export declare function ImagePreview({ entry, onResult }: {
    entry: OutputEntry;
    onResult: (result: QcResult) => void;
}): React.JSX.Element;
export declare function HtmlPreview({ entry, content }: {
    entry: OutputEntry;
    content: string;
}): React.JSX.Element;
export declare function TextPreview({ content }: {
    content: string;
}): React.JSX.Element;
export declare function PdfPreview({ entry, onResult }: {
    entry: OutputEntry;
    onResult: (result: QcResult) => void;
}): React.JSX.Element;
export interface PreviewLabels {
    readonly loading: string;
    readonly error: string;
    readonly empty: string;
}
export declare function Preview({ entry, onResult, labels }: {
    entry: OutputEntry;
    onResult: (result: QcResult) => void;
    labels: PreviewLabels;
}): React.JSX.Element;
