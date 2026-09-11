import type { OutputDockKey } from './locales.ts';
import type { QcIssue, QcResult } from './qc.ts';
/** Dictionary key describing one QC issue. */
export declare function qcIssueKey(code: QcIssue['code']): OutputDockKey;
/** Icon-friendly summary of a check result for the toolbar badge. */
export declare function qcBadge(result: QcResult | undefined): 'ok' | 'warn' | 'error' | 'loading' | null;
/** Human-readable one-liner for the badge tooltip, without React in the loop. */
export declare function qcSummaryKey(result: QcResult): OutputDockKey | null;
