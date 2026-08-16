import { describe, expect, it } from 'vitest'
import {
  collectJsonMatchPaths,
  filterTableRows,
  parseDataPreview,
  paginateRows,
  searchTextLines,
  sortTableRows,
  windowTextLines,
} from '../src/client/data-preview.ts'

describe('structured data previews', () => {
  it('parses JSON objects without flattening their structure', () => {
    const result = parseDataPreview('report.json', '{"name":"DSH","stats":{"files":3}}')

    expect(result).toEqual({
      kind: 'json',
      value: { name: 'DSH', stats: { files: 3 } },
      records: 1,
    })
  })

  it('parses JSONL records and reports the failing line', () => {
    expect(parseDataPreview('events.jsonl', '{"id":1}\n{"id":2}')).toMatchObject({
      kind: 'json',
      records: 2,
    })
    expect(parseDataPreview('events.jsonl', '{"id":1}\nnot-json')).toEqual({
      kind: 'error',
      message: 'Invalid JSON on line 2',
    })
  })

  it('parses quoted CSV fields, embedded commas, and multiline values', () => {
    const result = parseDataPreview(
      'people.csv',
      'name,notes\nAda,"compiler, math"\nLinus,"line one\nline two"',
    )

    expect(result).toEqual({
      kind: 'table',
      columns: ['name', 'notes'],
      rows: [
        ['Ada', 'compiler, math'],
        ['Linus', 'line one\nline two'],
      ],
      truncated: false,
    })
  })

  it('uses tabs for TSV and creates stable names for empty headers', () => {
    expect(parseDataPreview('data.tsv', 'name\t\nAda\t42')).toEqual({
      kind: 'table',
      columns: ['name', 'Column 2'],
      rows: [['Ada', '42']],
      truncated: false,
    })
  })

  it('collects matching JSON branches in one traversal', () => {
    expect([...collectJsonMatchPaths({
      profile: { name: 'Ada', role: 'engineer' },
      stats: { score: 85 },
    }, 'ada')]).toEqual(['$.profile.name', '$.profile', '$'])
  })
})

describe('table interactions', () => {
  const rows = [
    ['Ada', '36'],
    ['Grace', '85'],
    ['Linus', '54'],
  ]

  it('filters across every cell without changing the source rows', () => {
    expect(filterTableRows(rows, 'gra')).toEqual([['Grace', '85']])
    expect(rows).toHaveLength(3)
  })

  it('sorts numeric cells numerically and toggles direction', () => {
    expect(sortTableRows(rows, 1, 'asc').map(row => row[0])).toEqual(['Ada', 'Linus', 'Grace'])
    expect(sortTableRows(rows, 1, 'desc').map(row => row[0])).toEqual(['Grace', 'Linus', 'Ada'])
  })

  it('paginates rows and clamps pages after filtering', () => {
    expect(paginateRows(rows, 8, 2)).toEqual({
      page: 2,
      pageCount: 2,
      rows: [['Linus', '54']],
    })
  })
})

describe('text reader search', () => {
  it('returns matching line numbers and preserves the original lines', () => {
    expect(searchTextLines('Alpha\nbeta alpha\nGamma', 'ALPHA')).toEqual({
      lines: ['Alpha', 'beta alpha', 'Gamma'],
      matches: [0, 1],
    })
  })

  it('paginates large text without losing original line numbers', () => {
    const lines = Array.from({ length: 650 }, (_, index) => `line ${index + 1}`)
    const window = windowTextLines(lines, 2, 250)

    expect(window.page).toBe(2)
    expect(window.pageCount).toBe(3)
    expect(window.lines).toHaveLength(250)
    expect(window.lines[0]).toEqual({ index: 250, text: 'line 251' })
  })
})
