import type { ConversationLocation, ConversationViewNode } from '@deepseek-ai/dsh-client-runtime/client';
import type { OutputPublication } from '../publication.ts';
export type OutputKind = 'md' | 'svg' | 'image' | 'html' | 'pdf' | 'text';
export interface PublishedOutput extends OutputPublication {
    readonly key: string;
    readonly previewKind: OutputKind | null;
    readonly turn: number;
    readonly revision: number;
}
export interface OutputDockSnapshot {
    readonly entries: readonly PublishedOutput[];
    readonly history: readonly PublishedOutput[];
}
export declare const EMPTY_OUTPUT_DOCK_SNAPSHOT: OutputDockSnapshot;
export interface OutputDockViewNode extends ConversationViewNode {
    readonly target: 'outputDock';
    readonly anchorSeq: number;
    readonly location: ConversationLocation;
    readonly data: {
        readonly publication: OutputPublication;
    };
}
export declare function publicationKey(workId: string, resultId: string): string;
declare module '@deepseek-ai/dsh-client-runtime/client' {
    interface ConversationViewSnapshotMap {
        outputDock: OutputDockSnapshot;
    }
}
