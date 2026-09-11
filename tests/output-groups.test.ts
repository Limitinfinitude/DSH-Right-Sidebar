import { describe, expect, it } from 'vitest'
import type { OutputEntry } from '../src/client/contract.ts'
import { filterByGroup, formatBytes, kindGroup } from '../src/client/output-groups.ts'

function entry(path: string, kind: OutputEntry['kind'], lastSeq = 1): OutputEntry {
  return { path, kind, firstTurn: 1, lastTurn: 1, lastSeq }
}

describe('output groups', () => {
  it.each([
    ['md', 'doc'],
    ['pdf', 'doc'],
    ['svg', 'image'],
    ['image', 'image'],
    ['text', 'data'],
    ['code', 'data'],
    ['video', 'media'],
    ['audio', 'media'],
  ] as const)('maps preview kind %s into the %s group', (kind, group) => {
    expect(kindGroup(kind)).toBe(group)
  })

  it('filters entries by group and keeps everything under `all`', () => {
    const entries = [
      entry('a.md', 'md'),
      entry('b.png', 'image'),
      entry('c.csv', 'text'),
      entry('d.mp4', 'video'),
    ]
    expect(filterByGroup(entries, 'all')).toHaveLength(4)
    expect(filterByGroup(entries, 'doc').map(e => e.path)).toEqual(['a.md'])
    expect(filterByGroup(entries, 'image').map(e => e.path)).toEqual(['b.png'])
    expect(filterByGroup(entries, 'data').map(e => e.path)).toEqual(['c.csv'])
    expect(filterByGroup(entries, 'media').map(e => e.path)).toEqual(['d.mp4'])
  })

  it('formats byte sizes for humans', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(1024)).toBe('1.0 KB')
    expect(formatBytes(1536)).toBe('1.5 KB')
    expect(formatBytes(10240)).toBe('10 KB')
    expect(formatBytes(1572864)).toBe('1.5 MB')
    expect(formatBytes(-5)).toBe('')
    expect(formatBytes(Number.NaN)).toBe('')
  })
})
