import type { OutputKind, PublishedOutput } from './contract.ts';
export type PreviewEntry = PublishedOutput & {
    readonly kind: 'document' | 'visual';
    readonly path: string;
    readonly previewKind: OutputKind;
};
export interface PreviewLabels {
    readonly loading: string;
    readonly unavailable: string;
    readonly empty: string;
    readonly retry: string;
}
export declare function Preview({ entry, labels, onRefresh }: {
    readonly entry: PreviewEntry;
    readonly labels: PreviewLabels;
    readonly onRefresh: () => void;
}): React.JSX.Element;
