import type { Context } from '@deepseek-ai/cordis';
import { type OutputPublication } from './publication.ts';
export { normalizePublication, OUTPUT_DOCK_TOOL, type OutputPublication, type PublicationKind } from './publication.ts';
export declare function validatePublicationResource(publication: OutputPublication, roots: readonly string[]): Promise<string | undefined>;
export declare function registerPublishTool(ctx: Context, roots: () => readonly string[]): () => void;
