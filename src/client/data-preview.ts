import Papa from 'papaparse'

export const MAX_TABLE_ROWS = 10_000
export const TEXT_PAGE_SIZE = 250

export type DataPreview =
  | { readonly kind: 'json'; readonly value: unknown; readonly records: number }
  | {
      readonly kind: 'table'
      readonly columns: readonly string[]
      readonly rows: readonly (readonly string[])[]
      readonly truncated: boolean
    }
  | { readonly kind: 'text'; readonly content: string }
  | { readonly kind: 'error'; readonly message: string }

function extension(path: string): string {
  const name = path.slice(Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\')) + 1)
  const dot = name.lastIndexOf('.')
  return dot === -1 ? '' : name.slice(dot + 1).toLowerCase()
}

function parseJsonLines(content: string): DataPreview {
  const values: unknown[] = []
  const lines = content.split(/\r?\n/)
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]?.trim() ?? ''
    if (line === '') continue
    try {
      values.push(JSON.parse(line) as unknown)
    } catch {
      return { kind: 'error', message: `Invalid JSON on line ${index + 1}` }
    }
  }
  return { kind: 'json', value: values, records: values.length }
}

function parseJson(content: string): DataPreview {
  try {
    return { kind: 'json', value: JSON.parse(content) as unknown, records: 1 }
  } catch {
    return { kind: 'error', message: 'Invalid JSON' }
  }
}

function parseTable(content: string, delimiter: ',' | '\t'): DataPreview {
  const parsed = Papa.parse<string[]>(content, {
    delimiter,
    skipEmptyLines: 'greedy',
  })
  if (parsed.errors.length > 0) {
    const first = parsed.errors[0]
    return { kind: 'error', message: first?.message ?? 'Invalid table data' }
  }
  const [rawColumns = [], ...rawRows] = parsed.data
  const width = Math.max(rawColumns.length, ...rawRows.map(row => row.length), 0)
  const columns = Array.from({ length: width }, (_, index) => {
    const label = rawColumns[index]?.trim() ?? ''
    return label === '' ? `Column ${index + 1}` : label
  })
  const rows = rawRows.slice(0, MAX_TABLE_ROWS).map(row =>
    Array.from({ length: width }, (_, index) => row[index] ?? ''))
  return {
    kind: 'table',
    columns,
    rows,
    truncated: rawRows.length > MAX_TABLE_ROWS,
  }
}

export function parseDataPreview(path: string, content: string): DataPreview {
  switch (extension(path)) {
    case 'json': return parseJson(content)
    case 'jsonl': return parseJsonLines(content)
    case 'csv': return parseTable(content, ',')
    case 'tsv': return parseTable(content, '\t')
    default: return { kind: 'text', content }
  }
}

export function filterTableRows(
  rows: readonly (readonly string[])[],
  query: string,
): readonly (readonly string[])[] {
  const needle = query.trim().toLocaleLowerCase()
  if (needle === '') return rows
  return rows.filter(row => row.some(cell => cell.toLocaleLowerCase().includes(needle)))
}

function compareCells(left: string, right: string): number {
  const leftNumber = Number(left)
  const rightNumber = Number(right)
  if (left.trim() !== '' && right.trim() !== ''
    && Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
    return leftNumber - rightNumber
  }
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' })
}

export function sortTableRows(
  rows: readonly (readonly string[])[],
  column: number,
  direction: 'asc' | 'desc',
): readonly (readonly string[])[] {
  const sign = direction === 'asc' ? 1 : -1
  return [...rows].sort((left, right) =>
    compareCells(left[column] ?? '', right[column] ?? '') * sign)
}

export function paginateRows<T>(
  rows: readonly T[],
  requestedPage: number,
  pageSize: number,
): { readonly page: number; readonly pageCount: number; readonly rows: readonly T[] } {
  const safeSize = Math.max(1, Math.floor(pageSize))
  const pageCount = Math.max(1, Math.ceil(rows.length / safeSize))
  const page = Math.min(pageCount, Math.max(1, Math.floor(requestedPage)))
  const start = (page - 1) * safeSize
  return { page, pageCount, rows: rows.slice(start, start + safeSize) }
}

export function windowTextLines(
  lines: readonly string[],
  page: number,
  pageSize = TEXT_PAGE_SIZE,
): { readonly page: number; readonly pageCount: number; readonly lines: readonly { index: number; text: string }[] } {
  const indexed = lines.map((text, index) => ({ index, text }))
  const window = paginateRows(indexed, page, pageSize)
  return { page: window.page, pageCount: window.pageCount, lines: window.rows }
}

function collectJsonDescendantPaths(value: unknown, path: string, output: Set<string>): void {
  output.add(path)
  if (value === null || typeof value !== 'object') return
  for (const [key, child] of Object.entries(value)) {
    collectJsonDescendantPaths(child, `${path}.${key}`, output)
  }
}

/** Return matching JSON nodes and their ancestors in one traversal. */
export function collectJsonMatchPaths(value: unknown, rawQuery: string): ReadonlySet<string> {
  const query = rawQuery.trim().toLocaleLowerCase()
  const output = new Set<string>()
  if (query === '') return output

  const visit = (current: unknown, path: string): boolean => {
    if (current === null || typeof current !== 'object') {
      const matches = String(current).toLocaleLowerCase().includes(query)
      if (matches) output.add(path)
      return matches
    }
    let matches = false
    for (const [key, child] of Object.entries(current)) {
      const childPath = `${path}.${key}`
      const keyMatches = key.toLocaleLowerCase().includes(query)
      if (keyMatches) collectJsonDescendantPaths(child, childPath, output)
      if (keyMatches || visit(child, childPath)) matches = true
    }
    if (matches) output.add(path)
    return matches
  }

  visit(value, '$')
  return output
}

export function searchTextLines(
  content: string,
  query: string,
): { readonly lines: readonly string[]; readonly matches: readonly number[] } {
  const lines = content.split(/\r?\n/)
  const needle = query.trim().toLocaleLowerCase()
  return {
    lines,
    matches: needle === ''
      ? []
      : lines.flatMap((line, index) =>
          line.toLocaleLowerCase().includes(needle) ? [index] : []),
  }
}
