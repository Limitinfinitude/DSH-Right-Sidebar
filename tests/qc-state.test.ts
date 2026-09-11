import { describe, expect, it } from 'vitest'
import type { QcResult } from '../src/client/qc.ts'
import { mergeQcResult } from '../src/client/qc-state.ts'
import { qcBadge, qcIssueKey, qcSummaryKey } from '../src/client/qc-labels.ts'

describe('preview QC state', () => {
  it('preserves map identity when a repeated result is unchanged', () => {
    const result: QcResult = { level: 'ok', issues: [] }
    const current = new Map([['report.svg', result]])

    expect(mergeQcResult(current, 'report.svg', { level: 'ok', issues: [] })).toBe(current)
  })

  it('creates a new map when the result changes', () => {
    const current = new Map<string, QcResult>([['report.svg', { level: 'loading', issues: [] }]])
    const next = mergeQcResult(current, 'report.svg', { level: 'ok', issues: [] })

    expect(next).not.toBe(current)
    expect(next.get('report.svg')).toEqual({ level: 'ok', issues: [] })
  })
})

describe('preview QC labels', () => {
  it('maps every issue code to a dictionary key', () => {
    expect(qcIssueKey('md-broken-link')).toBe('qc.brokenLink')
    expect(qcIssueKey('svg-no-viewbox')).toBe('qc.svgNoViewBox')
    expect(qcIssueKey('media-failed')).toBe('qc.mediaFailed')
  })

  it('summarizes a check result for the toolbar badge', () => {
    const warn: QcResult = { level: 'warn', issues: [{ level: 'warn', code: 'md-broken-link', count: 3 }] }
    expect(qcSummaryKey({ level: 'ok', issues: [] })).toBe('qc.ok')
    expect(qcSummaryKey(warn)).toBe('qc.brokenLink')
  })

  it('reports no badge while checks are still running', () => {
    expect(qcBadge(undefined)).toBeNull()
    expect(qcBadge({ level: 'loading', issues: [] })).toBe('loading')
    expect(qcBadge({ level: 'error', issues: [{ level: 'error', code: 'file-read' }] })).toBe('error')
  })
})
