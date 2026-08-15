/**
 * Per-session incremental view builder: folds each turn's published payload
 * into a first-seen-deduped flat entry list. Replace clears; apply merges
 * only the changed turns.
 */
import type { ConversationViewBuilder, ConversationViewDefinition } from '@deepseek-ai/dsh-client-runtime/client';
import type { OutputDockSnapshot, OutputDockViewNode } from './contract.ts';
export declare class OutputDockViewBuilder implements ConversationViewBuilder<OutputDockViewNode, OutputDockSnapshot> {
    readonly empty: OutputDockSnapshot;
    private turns;
    replace(input: {
        readonly nodes: readonly OutputDockViewNode[];
    }): OutputDockSnapshot;
    apply(input: {
        readonly upserts: readonly OutputDockViewNode[];
    }): OutputDockSnapshot;
    private snapshot;
}
/** The dock's conversation view target definition. */
export declare const outputDockViewDefinition: ConversationViewDefinition<OutputDockViewNode, OutputDockSnapshot>;
