import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Context } from '@deepseek-ai/cordis';
import { type OutputDockWorkspaceRegistry } from './workspace-file.ts';
interface OutputDockWebServer {
    register(route: {
        kind: 'route';
        path: string;
        handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
    }): () => void;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        webServer: OutputDockWebServer;
        workspaceRegistry: OutputDockWorkspaceRegistry;
    }
}
export declare const name = "output-dock";
export declare const inject: string[];
export declare function registerFileRoute(webServer: OutputDockWebServer, roots: () => readonly string[]): () => void;
export declare function apply(ctx: Context): void;
export {};
