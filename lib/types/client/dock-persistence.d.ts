export interface SessionPersistedState {
    readonly closedAt: Readonly<Record<string, number>>;
    readonly order: readonly string[];
}
export interface PersistedState {
    readonly pinned: readonly string[];
    readonly hidden: readonly string[];
    readonly sessions: Readonly<Record<string, SessionPersistedState>>;
}
export declare const PERSIST_KEY = "dsh-output-dock:v3";
export declare const EMPTY_SESSION_PERSISTED: SessionPersistedState;
export declare const EMPTY_PERSISTED: PersistedState;
export declare function loadDockState(storage: Storage): PersistedState;
export declare function saveDockState(storage: Storage, state: PersistedState): void;
