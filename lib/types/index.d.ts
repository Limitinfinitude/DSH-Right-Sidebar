import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Context } from '@deepseek-ai/cordis';
/** Minimal typed faces of the harness services this half consumes. */
interface OutputDockWebServer {
    register(route: {
        kind: 'route';
        path: string;
        handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
    }): () => void;
}
interface OutputDockWorkspace {
    /** Canonical directory path (fs.realpath spelling). */
    readonly path: string;
}
interface OutputDockWorkspaceRegistry {
    list(): readonly OutputDockWorkspace[];
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        webServer: OutputDockWebServer;
        workspaceRegistry: OutputDockWorkspaceRegistry;
    }
}
export declare const name = "output-dock";
export declare const inject: string[];
/**
 * Register the file-content route. The handler is plain Node HTTP: path
 * validation first, then a stat gate (file, size cap), then stream or 404.
 * @param ctx - host context carrying the webserver and workspace services.
 */
export declare function apply(ctx: Context): void;
export {};
