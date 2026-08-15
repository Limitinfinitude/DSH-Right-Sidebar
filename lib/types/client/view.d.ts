import type { ConversationViewBuilder, ConversationViewDefinition } from '@deepseek-ai/dsh-client-runtime/client';
import { type OutputDockSnapshot, type OutputDockViewNode, type PublishedOutput } from './contract.ts';
export declare class OutputDockViewBuilder implements ConversationViewBuilder<OutputDockViewNode, OutputDockSnapshot> {
    readonly empty: OutputDockSnapshot;
    private readonly nodes;
    replace(input: {
        readonly nodes: readonly OutputDockViewNode[];
    }): OutputDockSnapshot;
    apply(input: {
        readonly upserts: readonly OutputDockViewNode[];
    }): OutputDockSnapshot;
    private snapshot;
}
export declare function publicationsForTurn(snapshot: OutputDockSnapshot, turn: number, closingSeq: number): readonly PublishedOutput[];
export declare const outputDockViewDefinition: ConversationViewDefinition<OutputDockViewNode, OutputDockSnapshot>;
