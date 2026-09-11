import type { OutputEntry } from './contract.ts';
/** Parent directory spelling for Windows, POSIX, and workspace-relative paths. */
export declare function directoryOfPath(path: string): string;
/** Rich, user-facing formats may reveal themselves; source-like text stays quiet. */
export declare function shouldAutoOpen(entry: OutputEntry): boolean;
/** Visible tab order: pinned first, then newest activity, without mutating input. */
export declare function visibleTabs(entries: readonly OutputEntry[], hidden: ReadonlySet<string>, pinned?: ReadonlySet<string>, closedAt?: ReadonlyMap<string, number>): readonly OutputEntry[];
/** One catalog section: every output first produced in the same turn. */
export interface CatalogGroup {
    readonly turn: number;
    readonly entries: readonly OutputEntry[];
}
/** Group session history by the turn that first produced each output, newest turn first. */
export declare function groupCatalogByTurn(entries: readonly OutputEntry[]): readonly CatalogGroup[];
/** Case-insensitive catalog filter across file name and full path. */
export declare function filterCatalog(entries: readonly OutputEntry[], query: string): readonly OutputEntry[];
/** Close every listed tab at its current revision so nothing reopens by itself. */
export declare function closedAllAt(entries: readonly OutputEntry[]): Readonly<Record<string, number>>;
/** Session history stays available after closing tabs; explicitly hidden files do not. */
export declare function catalogEntries(entries: readonly OutputEntry[], hidden: ReadonlySet<string>): readonly OutputEntry[];
/** Apply manual order to known tabs while leaving newly produced entries in front. */
export declare function orderedTabs(entries: readonly OutputEntry[], order: readonly string[]): readonly OutputEntry[];
/** Move the dragged tab immediately before the drop target. */
export declare function reorderTab(paths: readonly string[], draggedPath: string, targetPath: string): readonly string[];
export interface SelectionState {
    readonly path: string | null;
    readonly seenSeq: number;
    readonly hasNewOutput: boolean;
}
/** Reconcile sidebar selection against one visible output snapshot. */
export declare function reconcileSelection(entries: readonly OutputEntry[], currentPath: string | null, seenSeq: number): SelectionState;
