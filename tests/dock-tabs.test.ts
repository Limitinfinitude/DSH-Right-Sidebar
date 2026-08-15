import { describe, expect, it } from 'vitest'
import type { OutputEntry } from '../src/client/contract.ts'
import { catalogEntries, directoryOfPath, orderedTabs, reorderTab, visibleTabs } from '../src/client/sidebar-state.ts'

function entry(path: string, lastSeq: number): OutputEntry {
  return { path, kind: 'text', firstTurn: 1, lastTurn: 1, lastSeq }
}

describe('output dock tabs', () => {
  it('keeps every visible output available in newest-first tab order', () => {
    expect(visibleTabs([
      entry('first.txt', 1),
      entry('third.txt', 3),
      entry('second.txt', 2),
    ], new Set()).map(item => item.path)).toEqual(['third.txt', 'second.txt', 'first.txt'])
  })

  it('removes hidden outputs without disturbing the remaining order', () => {
    expect(visibleTabs([
      entry('first.txt', 1),
      entry('second.txt', 2),
    ], new Set(['second.txt'])).map(item => item.path)).toEqual(['first.txt'])
  })

  it('keeps a closed tab out until that path is produced again', () => {
    const closed = new Map([['report.txt', 2]])
    expect(visibleTabs([entry('report.txt', 2)], new Set(), new Set(), closed)).toEqual([])
    expect(visibleTabs([entry('report.txt', 3)], new Set(), new Set(), closed)
      .map(item => item.path)).toEqual(['report.txt'])
  })

  it('keeps closed outputs in the session catalog while excluding hidden outputs', () => {
    expect(catalogEntries([
      entry('first.txt', 1),
      entry('third.txt', 3),
      entry('second.txt', 2),
    ], new Set(['second.txt'])).map(item => item.path)).toEqual(['third.txt', 'first.txt'])
  })

  it('moves a later tab in front when it is dragged onto the first tab', () => {
    expect(reorderTab(['first', 'second', 'third'], 'third', 'first'))
      .toEqual(['third', 'first', 'second'])
  })

  it('keeps manual order while placing newly produced tabs first', () => {
    const entries = [entry('new.txt', 4), entry('first.txt', 3), entry('second.txt', 2)]
    expect(orderedTabs(entries, ['second.txt', 'first.txt']).map(item => item.path))
      .toEqual(['new.txt', 'second.txt', 'first.txt'])
  })

  it.each([
    ['D:\\work\\docs\\report.md', 'D:\\work\\docs'],
    ['/work/docs/report.md', '/work/docs'],
    ['report.md', '.'],
  ])('finds the containing directory for %s', (path, expected) => {
    expect(directoryOfPath(path)).toBe(expected)
  })
})
