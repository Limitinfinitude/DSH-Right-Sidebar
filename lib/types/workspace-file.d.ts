export interface OutputDockWorkspace {
    readonly path: string;
}
export interface OutputDockWorkspaceRegistry {
    list(): readonly OutputDockWorkspace[];
}
export declare function workspaceRoots(registry: OutputDockWorkspaceRegistry): readonly string[];
export declare function resolveWorkspaceFile(raw: string, roots: readonly string[], allowedExtensions: ReadonlySet<string>): Promise<string | null>;
