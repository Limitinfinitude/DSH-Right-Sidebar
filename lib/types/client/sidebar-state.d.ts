import type { OutputEntry } from './contract.ts';
export interface SelectionState {
    readonly path: string | null;
    readonly seenSeq: number;
    readonly hasNewOutput: boolean;
}
/** Reconcile sidebar selection against one visible output snapshot. */
export declare function reconcileSelection(entries: readonly OutputEntry[], currentPath: string | null, seenSeq: number): SelectionState;
