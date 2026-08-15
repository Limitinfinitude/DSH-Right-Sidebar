/**
 * Produced-file derivation: one turn-scoped conversation Definition that
 * mirrors the harness's own deliverables engine — paths come from the
 * mutation tools' follow-along `locations` (a diff card, or a generic card
 * whose kind is edit), never from the closing prose — then filters to the
 * dock's extension allowlist.
 */
import type { ConversationNodeDefinition, ToolResultNode } from '@deepseek-ai/dsh-client-runtime/client';
export { kindOfPath } from '../formats.ts';
/** Trailing path segment, the part that identifies the file at a glance. */
export declare function basename(path: string): string;
interface OutputDockState {
    readonly turn: number;
    readonly calls: ReadonlyMap<string, ToolResultNode['callView']>;
    readonly produced: readonly {
        readonly seq: number;
        readonly path: string;
    }[];
}
/** Turn-local successful mutation accumulator with the dock's extension filter. */
export declare const outputDockDefinition: ConversationNodeDefinition<OutputDockState>;
