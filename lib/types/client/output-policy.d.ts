export type OutputDisposition = 'automatic' | 'explicit' | 'never';
export type OutputPublication = 'automatic' | 'explicit';
export interface ProducedOutputCandidate {
    readonly path: string;
    readonly seq: number;
}
export interface PublishedOutput extends ProducedOutputCandidate {
    readonly publication: OutputPublication;
}
/** Classify a changed file by product value, not merely browser readability. */
export declare function outputDisposition(path: string): OutputDisposition;
/** Whether one persisted produced entry belongs in the user-facing dock. */
export declare function shouldPublishOutput(path: string, publication?: OutputPublication): boolean;
/** Release conditional outputs explicitly named in an assistant response. */
export declare function mentionedConditionalOutputs(candidates: readonly ProducedOutputCandidate[], assistantText: string): readonly PublishedOutput[];
/** Paths the assistant explicitly presents as outputs, including shell-produced files. */
export declare function mentionedOutputPaths(assistantText: string): readonly string[];
