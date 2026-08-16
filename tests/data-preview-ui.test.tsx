// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { DataFilePreview, type DataPreviewLabels } from '../src/client/DataFilePreview.tsx'

const labels: DataPreviewLabels = {
  search: 'Search',
  raw: 'Raw',
  structured: 'Structured',
  wrap: 'Wrap lines',
  previous: 'Previous',
  next: 'Next',
  page: (page, count) => `${page} / ${count}`,
  rows: count => `${count} rows`,
  matches: count => `${count} matches`,
  expandAll: 'Expand all',
  collapseAll: 'Collapse all',
  parseError: 'Cannot parse this file',
  truncated: count => `Showing ${count} rows`,
}

afterEach(cleanup)

describe('JSON product preview', () => {
  it('shows a searchable tree and can switch to raw data', () => {
    render(<DataFilePreview path="report.json" content='{"name":"DSH","stats":{"files":3}}' labels={labels} />)

    expect(screen.getByText('name')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Raw' }))
    expect(screen.getByText(/"files": 3/)).toBeTruthy()
  })
})

describe('tabular product preview', () => {
  it('filters rows and sorts a column through its header', () => {
    render(<DataFilePreview path="people.csv" content={'name,score\nAda,36\nGrace,85\nLinus,54'} labels={labels} />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'grace' } })
    expect(screen.getByText('Grace')).toBeTruthy()
    expect(screen.queryByText('Ada')).toBeNull()
    expect(screen.getByText('1 rows')).toBeTruthy()
  })
})

describe('text product preview', () => {
  it('finds matching lines and exposes line wrapping as a toggle', () => {
    render(<DataFilePreview path="notes.txt" content={'Alpha\nbeta alpha\nGamma'} labels={labels} />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'alpha' } })
    expect(screen.getByText('2 matches')).toBeTruthy()
    const wrap = screen.getByRole('button', { name: 'Wrap lines' })
    expect(wrap.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(wrap)
    expect(wrap.getAttribute('aria-pressed')).toBe('false')
  })

  it('renders large text in bounded pages', () => {
    const content = Array.from({ length: 650 }, (_, index) => `line ${index + 1}`).join('\n')
    const { container } = render(<DataFilePreview path="large.txt" content={content} labels={labels} />)

    expect(container.querySelectorAll('.dsh-od-text-line')).toHaveLength(250)
    expect(screen.getByText('1 / 3')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('line 251')).toBeTruthy()
  })
})
