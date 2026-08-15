import { describe, expect, it } from 'vitest'
import type { QcResult } from '../src/client/qc.ts'
import { mergeQcResult } from '../src/client/qc-state.ts'

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
