export declare const OUTPUT_DOCK_TOOL = "output_dock_publish";
export type PublicationKind = 'document' | 'visual' | 'link';
export interface OutputPublication {
    readonly workId: string;
    readonly workTitle: string;
    readonly resultId: string;
    readonly label: string;
    readonly kind: PublicationKind;
    readonly path?: string;
    readonly url?: string;
}
export declare function normalizePublication(input: unknown): OutputPublication;
