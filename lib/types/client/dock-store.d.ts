export interface SessionDockState {
    readonly open: boolean;
    readonly opened: readonly string[];
    readonly active: string | null;
}
export interface OutputDockUiStore {
    get(sessionId: string): SessionDockState;
    subscribe(sessionId: string, listener: () => void): () => void;
    open(sessionId: string, key: string): void;
    activate(sessionId: string, key: string): void;
    closeTab(sessionId: string, key: string): void;
    collapse(sessionId: string): void;
    restore(sessionId: string): void;
    reconcile(sessionId: string, localKeys: ReadonlySet<string>): void;
    removeSession(sessionId: string): void;
    noteSessions(ids: readonly string[]): void;
}
export declare function createOutputDockUiStore(storage: Storage): OutputDockUiStore;
