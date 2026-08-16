import type { OutputKind } from './client/contract.ts';
/** Extension metadata shared by the node route and browser collection path. */
export declare const OUTPUT_FORMATS: Readonly<Record<string, {
    kind: OutputKind;
    mime: string;
}>>;
/** Whether a produced output is an HTTP(S) resource rather than a local path. */
export declare function isNetworkOutput(value: string): boolean;
/** Path portion used for format checks and labels, excluding URL query/hash data. */
export declare function outputPathname(value: string): string;
/** Lowercase output extension without URL query or fragment suffixes. */
export declare function outputExtension(value: string): string;
/** Preview category for one path, or null when the dock does not collect it. */
export declare function kindOfPath(path: string): OutputKind | null;
