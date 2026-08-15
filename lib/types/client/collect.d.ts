import type { ConversationNodeDefinition } from '@deepseek-ai/dsh-client-runtime/client';
import { type OutputPublication } from '../publication.ts';
interface OutputDockState {
    readonly mode: 'native' | 'code';
    readonly publication: OutputPublication | null;
    readonly settledSeq?: number;
}
export declare const outputDockDefinition: ConversationNodeDefinition<OutputDockState>;
export {};
