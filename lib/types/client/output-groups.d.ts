import type { OutputEntry, OutputKind } from './contract.ts';
/** Coarse catalog filter groups a preview kind belongs to. */
export type OutputGroup = 'doc' | 'image' | 'data' | 'media';
/** The filter group of one preview kind. */
export declare function kindGroup(kind: OutputKind): OutputGroup;
/** Entries of one group, in the given order; `all` keeps every entry. */
export declare function filterByGroup<E extends Pick<OutputEntry, 'kind'>>(entries: readonly E[], group: OutputGroup | 'all'): readonly E[];
/** Human-readable byte size, one decimal below 10 units, integer above. */
export declare function formatBytes(bytes: number): string;
