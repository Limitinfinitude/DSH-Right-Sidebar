import type { OutputKind } from './client/contract.ts';
/** Extension metadata shared by the node route and browser collection path. */
export declare const OUTPUT_FORMATS: Readonly<Record<string, {
    kind: OutputKind;
    mime: string;
}>>;
/** Preview category for one path, or null when the dock does not collect it. */
export declare function kindOfPath(path: string): OutputKind | null;
