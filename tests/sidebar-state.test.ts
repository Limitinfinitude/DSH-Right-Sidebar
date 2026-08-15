import { describe, expect, it } from 'vitest'
import type { OutputEntry } from '../src/client/contract.ts'
import { reconcileSelection } from '../src/client/sidebar-state.ts'

function entry(path: string, lastSeq: number): OutputEntry {
  return { path, kind: 'text', firstTurn: 1, lastTurn: 1, lastSeq }
}

describe('sidebar output selection', () => {
  it('selects the newest output in the initial snapshot', () => {
    expect(reconcileSelection([entry('older.txt', 2), entry('latest.txt', 7)], null, 0))
      .toEqual({ path: 'latest.txt', seenSeq: 7, hasNewOutput: true })
  })

  it('switches to a newly produced output', () => {
    expect(reconcileSelection([entry('current.txt', 7), entry('new.txt', 9)], 'current.txt', 7))
      .toEqual({ path: 'new.txt', seenSeq: 9, hasNewOutput: true })
  })

  it('preserves a manual selection while the snapshot has no new sequence', () => {
    expect(reconcileSelection([entry('older.txt', 2), entry('latest.txt', 7)], 'older.txt', 7))
      .toEqual({ path: 'older.txt', seenSeq: 7, hasNewOutput: false })
  })

  it('repairs a hidden or stale selection with the newest visible output', () => {
    expect(reconcileSelection([entry('next.txt', 5), entry('old.txt', 2)], 'hidden.txt', 7))
      .toEqual({ path: 'next.txt', seenSeq: 7, hasNewOutput: false })
  })

  it('clears selection when no outputs remain visible', () => {
    expect(reconcileSelection([], 'removed.txt', 7))
      .toEqual({ path: null, seenSeq: 7, hasNewOutput: false })
  })
})
