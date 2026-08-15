import type { OutputEntry } from './contract.ts';
/** Parent directory spelling for Windows, POSIX, and workspace-relative paths. */
export declare function directoryOfPath(path: string): string;
/** Rich, user-facing formats may reveal themselves; source-like text stays quiet. */
export declare function shouldAutoOpen(entry: OutputEntry): boolean;
/** Visible tab order: pinned first, then newest activity, without mutating input. */
export declare function visibleTabs(entries: readonly OutputEntry[], hidden: ReadonlySet<string>, pinned?: ReadonlySet<string>, closedAt?: ReadonlyMap<string, number>): readonly OutputEntry[];
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
