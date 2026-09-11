import type { OutputDockKey } from './locales.ts'
import type { QcIssue, QcResult } from './qc.ts'

const ISSUE_KEYS: Readonly<Record<QcIssue['code'], OutputDockKey>> = {
  'md-broken-link': 'qc.brokenLink',
  'md-unbalanced-fence': 'qc.unbalancedFence',
  'svg-parse': 'qc.svgParse',
  'svg-no-viewbox': 'qc.svgNoViewBox',
  'svg-sanitized': 'qc.svgSanitized',
  'image-failed': 'qc.imageFailed',
  'html-parse': 'qc.htmlParse',
  'file-read': 'qc.fileRead',
  'media-failed': 'qc.mediaFailed',
}

/** Dictionary key describing one QC issue. */
export function qcIssueKey(code: QcIssue['code']): OutputDockKey {
  return ISSUE_KEYS[code]
}

/** Icon-friendly summary of a check result for the toolbar badge. */
export function qcBadge(result: QcResult | undefined): 'ok' | 'warn' | 'error' | 'loading' | null {
  if (result === undefined) return null
  if (result.level === 'ok' && result.issues.length === 0) return 'ok'
  return result.level
}

/** Human-readable one-liner for the badge tooltip, without React in the loop. */
export function qcSummaryKey(result: QcResult): OutputDockKey | null {
  const first = result.issues[0]
  if (first === undefined) return 'qc.ok'
  return qcIssueKey(first.code)
}
