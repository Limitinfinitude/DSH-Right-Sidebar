import type { QcResult } from './qc.ts';
export declare function mergeQcResult(current: ReadonlyMap<string, QcResult>, path: string, result: QcResult): ReadonlyMap<string, QcResult>;
