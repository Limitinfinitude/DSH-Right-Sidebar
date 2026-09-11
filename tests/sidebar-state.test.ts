import { describe, expect, it } from 'vitest'
import type { OutputEntry } from '../src/client/contract.ts'
import {
  closedAllAt, filterCatalog, groupCatalogByTurn, reconcileSelection, shouldAutoOpen,
} from '../src/client/sidebar-state.ts'

function entry(path: string, lastSeq: number): OutputEntry {
  return { path, kind: 'text', firstTurn: 1, lastTurn: 1, lastSeq }
}

function visual(path: string, lastSeq: number): OutputEntry {
  return { ...entry(path, lastSeq), kind: 'image' }
}

function produced(path: string, lastSeq: number, firstTurn: number): OutputEntry {
  return { ...entry(path, lastSeq), firstTurn, lastTurn: firstTurn }
}

describe('sidebar output selection', () => {
  it('selects the newest output in the initial snapshot', () => {
    expect(reconcileSelection([entry('older.txt', 2), entry('latest.txt', 7)], null, 0))
      .toEqual({ path: 'latest.txt', seenSeq: 7, hasNewOutput: true })
  })

  it('switches to a newly produced output', () => {
    expect(reconcileSelection([entry('current.txt', 7), visual('new.png', 9)], 'current.txt', 7))
      .toEqual({ path: 'new.png', seenSeq: 9, hasNewOutput: true })
  })

  it('adds newly produced source text without stealing the active preview', () => {
    expect(reconcileSelection([visual('current.png', 7), entry('src/app.tsx', 9)], 'current.png', 7))
      .toEqual({ path: 'current.png', seenSeq: 9, hasNewOutput: true })
  })

  it('opens the newest rich output even when a later source file is in the same update', () => {
    expect(reconcileSelection([
      entry('src/app.tsx', 10),
      visual('preview.png', 9),
      entry('old.txt', 7),
    ], 'old.txt', 7)).toEqual({ path: 'preview.png', seenSeq: 10, hasNewOutput: true })
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

describe('sidebar automatic opening', () => {
  it.each(['md', 'svg', 'image', 'html', 'pdf'] as const)('opens for a new %s output', (kind) => {
    expect(shouldAutoOpen({ ...entry(`result.${kind}`, 2), kind })).toBe(true)
  })

  it('keeps source and configuration-like text outputs in the tab list without opening', () => {
    expect(shouldAutoOpen(entry('src/app.tsx', 2))).toBe(false)
    expect(shouldAutoOpen({ ...entry('src/app.tsx', 2), kind: 'code' })).toBe(false)
  })

  it.each(['video', 'audio'] as const)('opens for a new %s output', (kind) => {
    expect(shouldAutoOpen({ ...entry(`result.${kind}`, 2), kind })).toBe(true)
  })
})

describe('sidebar catalog', () => {
  const entries = [
    produced('out/final.md', 12, 3),
    produced('out/chart.png', 9, 2),
    produced('out/notes.md', 4, 1),
  ]

  it('groups history by the turn that first produced each output, newest first', () => {
    expect(groupCatalogByTurn(entries).map(group => [group.turn, group.entries.map(e => e.path)]))
      .toEqual([[3, ['out/final.md']], [2, ['out/chart.png']], [1, ['out/notes.md']]])
  })

  it('filters the catalog by file name and path, case-insensitively', () => {
    expect(filterCatalog(entries, 'CHART').map(entry => entry.path)).toEqual(['out/chart.png'])
    expect(filterCatalog(entries, 'out/').map(entry => entry.path)).toHaveLength(3)
    expect(filterCatalog(entries, '   ')).toEqual(entries)
  })

  it('closes every visible tab at its current revision', () => {
    expect(closedAllAt(entries)).toEqual({
      'out/final.md': 12,
      'out/chart.png': 9,
      'out/notes.md': 4,
    })
  })
})
