import {
  AlignLeft, ArrowDown, ArrowUp, Braces, ChevronDown, ChevronLeft, ChevronRight,
  ChevronsUpDown, Search, WrapText,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  collectJsonMatchPaths, filterTableRows, MAX_TABLE_ROWS, paginateRows, parseDataPreview,
  searchTextLines, sortTableRows, TEXT_PAGE_SIZE,
} from './data-preview.ts'

export interface DataPreviewLabels {
  readonly search: string
  readonly raw: string
  readonly structured: string
  readonly wrap: string
  readonly previous: string
  readonly next: string
  readonly page: (page: number, count: number) => string
  readonly rows: (count: number) => string
  readonly matches: (count: number) => string
  readonly expandAll: string
  readonly collapseAll: string
  readonly parseError: string
  readonly truncated: (count: number) => string
}

function PreviewButton(props: {
  readonly label: string
  readonly active?: boolean
  readonly disabled?: boolean
  readonly onClick: () => void
  readonly children: React.ReactNode
}): React.JSX.Element {
  return (
    <button
      type="button"
      className="dsh-od-data-button"
      aria-label={props.label}
      title={props.label}
      aria-pressed={props.active}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}

function SearchField(props: {
  readonly value: string
  readonly label: string
  readonly onChange: (value: string) => void
}): React.JSX.Element {
  return (
    <label className="dsh-od-data-search">
      <Search size={14} aria-hidden />
      <input
        type="search"
        value={props.value}
        placeholder={props.label}
        aria-label={props.label}
        onChange={event => { props.onChange(event.currentTarget.value) }}
      />
    </label>
  )
}

function jsonLabel(value: unknown): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value}"`
  return String(value)
}

function collectJsonBranches(value: unknown, path = '$', output = new Set<string>()): Set<string> {
  if (value === null || typeof value !== 'object' || output.size >= 2_000) return output
  output.add(path)
  for (const [key, child] of Object.entries(value)) {
    collectJsonBranches(child, `${path}.${key}`, output)
  }
  return output
}

function JsonNode(props: {
  readonly name?: string
  readonly value: unknown
  readonly path: string
  readonly depth: number
  readonly matchingPaths: ReadonlySet<string> | null
  readonly expanded: ReadonlySet<string>
  readonly toggle: (path: string) => void
}): React.JSX.Element | null {
  if (props.matchingPaths !== null && !props.matchingPaths.has(props.path)) return null
  const structured = props.value !== null && typeof props.value === 'object'
  if (!structured) {
    return (
      <div className="dsh-od-json-row" style={{ '--dsh-json-depth': props.depth } as React.CSSProperties}>
        <span className="dsh-od-json-spacer" />
        {props.name !== undefined && <span className="dsh-od-json-key">{props.name}</span>}
        {props.name !== undefined && <span className="dsh-od-json-colon">:</span>}
        <span className={`dsh-od-json-value dsh-od-json-${props.value === null ? 'null' : typeof props.value}`}>
          {jsonLabel(props.value)}
        </span>
      </div>
    )
  }
  const entries = Object.entries(props.value)
  const forced = props.matchingPaths !== null
  const open = forced || props.expanded.has(props.path)
  const summary = Array.isArray(props.value) ? `${entries.length} items` : `${entries.length} keys`
  return (
    <div className="dsh-od-json-branch">
      <button
        type="button"
        className="dsh-od-json-row dsh-od-json-toggle"
        style={{ '--dsh-json-depth': props.depth } as React.CSSProperties}
        aria-expanded={open}
        onClick={() => { props.toggle(props.path) }}
      >
        {open ? <ChevronDown size={14} aria-hidden /> : <ChevronRight size={14} aria-hidden />}
        {props.name !== undefined && <span className="dsh-od-json-key">{props.name}</span>}
        {props.name !== undefined && <span className="dsh-od-json-colon">:</span>}
        <span className="dsh-od-json-summary">{summary}</span>
      </button>
      {open && entries.map(([key, child]) => (
        <JsonNode
          key={`${props.path}.${key}`}
          name={key}
          value={child}
          path={`${props.path}.${key}`}
          depth={props.depth + 1}
          matchingPaths={props.matchingPaths}
          expanded={props.expanded}
          toggle={props.toggle}
        />
      ))}
    </div>
  )
}

function JsonPreview(props: {
  readonly value: unknown
  readonly labels: DataPreviewLabels
}): React.JSX.Element {
  const [query, setQuery] = useState('')
  const [rawMode, setRawMode] = useState(false)
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set(['$']))
  const allBranches = useMemo(() => collectJsonBranches(props.value), [props.value])
  const formatted = useMemo(() => JSON.stringify(props.value, null, 2), [props.value])
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const matchingPaths = useMemo(() => normalizedQuery === ''
    ? null
    : collectJsonMatchPaths(props.value, normalizedQuery), [normalizedQuery, props.value])
  const toggle = (path: string): void => {
    setExpanded(current => {
      const next = new Set(current)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }
  return (
    <section className="dsh-od-data-preview">
      <div className="dsh-od-data-toolbar">
        <SearchField value={query} label={props.labels.search} onChange={setQuery} />
        <div className="dsh-od-data-actions">
          {!rawMode && (
            <PreviewButton
              label={expanded.size >= allBranches.size ? props.labels.collapseAll : props.labels.expandAll}
              onClick={() => {
                setExpanded(expanded.size >= allBranches.size ? new Set(['$']) : allBranches)
              }}
            >
              <ChevronsUpDown size={15} aria-hidden />
            </PreviewButton>
          )}
          <PreviewButton label={rawMode ? props.labels.structured : props.labels.raw} active={rawMode}
            onClick={() => { setRawMode(current => !current) }}>
            {rawMode ? <Braces size={15} aria-hidden /> : <AlignLeft size={15} aria-hidden />}
          </PreviewButton>
        </div>
      </div>
      {rawMode
        ? <pre className="dsh-od-data-raw"><code>{formatted}</code></pre>
        : (
          <div className="dsh-od-json-tree">
            <JsonNode value={props.value} path="$" depth={0} matchingPaths={matchingPaths}
              expanded={expanded} toggle={toggle} />
          </div>
        )}
    </section>
  )
}

function TablePreview(props: {
  readonly columns: readonly string[]
  readonly rows: readonly (readonly string[])[]
  readonly raw: string
  readonly truncated: boolean
  readonly labels: DataPreviewLabels
}): React.JSX.Element {
  const [query, setQuery] = useState('')
  const [rawMode, setRawMode] = useState(false)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<{ column: number; direction: 'asc' | 'desc' } | null>(null)
  const [widths, setWidths] = useState<Readonly<Record<number, number>>>({})
  const filtered = useMemo(() => filterTableRows(props.rows, query), [props.rows, query])
  const sorted = useMemo(() => sort === null
    ? filtered
    : sortTableRows(filtered, sort.column, sort.direction), [filtered, sort])
  const paged = paginateRows(sorted, page, 100)
  useEffect(() => { setPage(current => Math.min(current, paged.pageCount)) }, [paged.pageCount])
  const resize = (column: number, event: React.PointerEvent<HTMLSpanElement>): void => {
    event.preventDefault()
    const startX = event.clientX
    const startWidth = widths[column] ?? 160
    const move = (next: PointerEvent): void => {
      setWidths(current => ({ ...current, [column]: Math.max(88, startWidth + next.clientX - startX) }))
    }
    const stop = (): void => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
  }
  return (
    <section className="dsh-od-data-preview">
      <div className="dsh-od-data-toolbar">
        <SearchField value={query} label={props.labels.search} onChange={(value) => { setQuery(value); setPage(1) }} />
        <span className="dsh-od-data-count">{props.labels.rows(filtered.length)}</span>
        <PreviewButton label={rawMode ? props.labels.structured : props.labels.raw} active={rawMode}
          onClick={() => { setRawMode(current => !current) }}>
          {rawMode ? <Braces size={15} aria-hidden /> : <AlignLeft size={15} aria-hidden />}
        </PreviewButton>
      </div>
      {props.truncated && <div className="dsh-od-data-notice">{props.labels.truncated(MAX_TABLE_ROWS)}</div>}
      {rawMode
        ? <pre className="dsh-od-data-raw"><code>{props.raw}</code></pre>
        : (
          <div className="dsh-od-table-scroll">
            <table className="dsh-od-data-table">
              <colgroup>{props.columns.map((_, index) =>
                <col key={index} style={{ width: widths[index] ?? 160 }} />)}</colgroup>
              <thead><tr>{props.columns.map((column, index) => (
                <th key={`${index}:${column}`}>
                  <button type="button" onClick={() => {
                    setSort(current => current?.column === index
                      ? { column: index, direction: current.direction === 'asc' ? 'desc' : 'asc' }
                      : { column: index, direction: 'asc' })
                  }}>
                    <span>{column}</span>
                    {sort?.column === index && (sort.direction === 'asc'
                      ? <ArrowUp size={12} aria-hidden />
                      : <ArrowDown size={12} aria-hidden />)}
                  </button>
                  <span className="dsh-od-column-resize" role="separator" aria-orientation="vertical"
                    onPointerDown={event => { resize(index, event) }} />
                </th>
              ))}</tr></thead>
              <tbody>{paged.rows.map((row, rowIndex) => (
                <tr key={(paged.page - 1) * 100 + rowIndex}>
                  {props.columns.map((_, columnIndex) =>
                    <td key={columnIndex} title={row[columnIndex] ?? ''}>{row[columnIndex] ?? ''}</td>)}
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      {!rawMode && paged.pageCount > 1 && (
        <div className="dsh-od-data-pagination">
          <PreviewButton label={props.labels.previous} disabled={paged.page === 1}
            onClick={() => { setPage(current => Math.max(1, current - 1)) }}>
            <ChevronLeft size={15} aria-hidden />
          </PreviewButton>
          <span>{props.labels.page(paged.page, paged.pageCount)}</span>
          <PreviewButton label={props.labels.next} disabled={paged.page === paged.pageCount}
            onClick={() => { setPage(current => Math.min(paged.pageCount, current + 1)) }}>
            <ChevronRight size={15} aria-hidden />
          </PreviewButton>
        </div>
      )}
    </section>
  )
}

function TextReader(props: {
  readonly content: string
  readonly labels: DataPreviewLabels
}): React.JSX.Element {
  const [query, setQuery] = useState('')
  const [wrap, setWrap] = useState(true)
  const [page, setPage] = useState(1)
  const search = useMemo(() => searchTextLines(props.content, query), [props.content, query])
  const matches = useMemo(() => new Set(search.matches), [search.matches])
  const indexedLines = useMemo(() => {
    const indexes = query.trim() === ''
      ? search.lines.map((_, index) => index)
      : search.matches
    return indexes.map(index => ({ index, text: search.lines[index] ?? '' }))
  }, [query, search.lines, search.matches])
  const paged = paginateRows(indexedLines, page, TEXT_PAGE_SIZE)
  useEffect(() => { setPage(current => Math.min(current, paged.pageCount)) }, [paged.pageCount])
  return (
    <section className="dsh-od-data-preview">
      <div className="dsh-od-data-toolbar">
        <SearchField value={query} label={props.labels.search} onChange={(value) => { setQuery(value); setPage(1) }} />
        {query.trim() !== '' && <span className="dsh-od-data-count">{props.labels.matches(matches.size)}</span>}
        <PreviewButton label={props.labels.wrap} active={wrap} onClick={() => { setWrap(current => !current) }}>
          <WrapText size={15} aria-hidden />
        </PreviewButton>
      </div>
      <div className="dsh-od-text-reader" data-wrap={wrap || undefined}>
        {paged.rows.map(line => (
          <div className="dsh-od-text-line" data-match={matches.has(line.index) || undefined} key={line.index}>
            <span>{line.index + 1}</span><code>{line.text || ' '}</code>
          </div>
        ))}
      </div>
      {paged.pageCount > 1 && (
        <div className="dsh-od-data-pagination">
          <PreviewButton label={props.labels.previous} disabled={paged.page === 1}
            onClick={() => { setPage(current => Math.max(1, current - 1)) }}>
            <ChevronLeft size={15} aria-hidden />
          </PreviewButton>
          <span>{props.labels.page(paged.page, paged.pageCount)}</span>
          <PreviewButton label={props.labels.next} disabled={paged.page === paged.pageCount}
            onClick={() => { setPage(current => Math.min(paged.pageCount, current + 1)) }}>
            <ChevronRight size={15} aria-hidden />
          </PreviewButton>
        </div>
      )}
    </section>
  )
}

export function DataFilePreview(props: {
  readonly path: string
  readonly content: string
  readonly labels: DataPreviewLabels
}): React.JSX.Element {
  const preview = useMemo(() => parseDataPreview(props.path, props.content), [props.content, props.path])
  if (preview.kind === 'error') {
    return (
      <div className="dsh-od-preview-state" data-state="error">
        <strong>{props.labels.parseError}</strong><span>{preview.message}</span>
      </div>
    )
  }
  if (preview.kind === 'json') {
    return <JsonPreview value={preview.value} labels={props.labels} />
  }
  if (preview.kind === 'table') {
    return <TablePreview columns={preview.columns} rows={preview.rows} raw={props.content}
      truncated={preview.truncated} labels={props.labels} />
  }
  return <TextReader content={preview.content} labels={props.labels} />
}
