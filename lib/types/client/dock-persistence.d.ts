export interface SessionPersistedState {
    readonly closedAt: Readonly<Record<string, number>>;
    readonly order: readonly string[];
}
export interface PersistedState {
    readonly pinned: readonly string[];
    readonly hidden: readonly string[];
    readonly width: number;
    readonly sessions: Readonly<Record<string, SessionPersistedState>>;
}
export declare const PERSIST_KEY = "dsh-output-dock:v3";
export declare const DEFAULT_DOCK_WIDTH = 420;
export declare const MIN_DOCK_WIDTH = 320;
export declare const MAX_DOCK_WIDTH = 860;
export declare const EMPTY_SESSION_PERSISTED: SessionPersistedState;
export declare const EMPTY_PERSISTED: PersistedState;
/** Keep a dragged width inside the range the sidebar can actually render. */
export declare function clampDockWidth(width: number): number;
export declare function loadDockState(storage: Storage): PersistedState;
export declare function saveDockState(storage: Storage, state: PersistedState): void;
