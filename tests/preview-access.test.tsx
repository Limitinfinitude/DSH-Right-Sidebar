// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { OutputEntry } from '../src/client/contract.ts'
import { Preview, type PreviewLabels } from '../src/client/preview.tsx'

const labels: PreviewLabels = {
  loading: 'Loading', error: 'Error', empty: 'Empty',
  data: {
    search: 'Search', raw: 'Raw', structured: 'Structured', wrap: 'Wrap',
    previous: 'Previous', next: 'Next', page: (page, count) => `${page}/${count}`,
    rows: count => `${count} rows`, matches: count => `${count} matches`,
    expandAll: 'Expand all', collapseAll: 'Collapse all', parseError: 'Parse error',
    truncated: count => `${count} rows shown`,
  },
  media: {
    zoomIn: 'Zoom in', zoomOut: 'Zoom out', fit: 'Fit', actualSize: 'Actual size',
    transparency: 'Transparency', dimensions: (width, height) => `${width}x${height}`,
  },
  pdf: { refresh: 'Refresh', openExternal: 'Open external' },
}

function entry(path: string): OutputEntry {
  return { path, kind: 'md', firstTurn: 1, lastTurn: 1, lastSeq: 8 }
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('preview source authorization', () => {
  it('loads content through the canonical path returned for an incomplete name', async () => {
    const canonical = 'D:\\workspace\\nested\\report.md'
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input)
      if (init?.method === 'POST') return new Response(null, {
        status: 204,
        headers: { 'X-Output-Dock-Resolved': encodeURIComponent(canonical) },
      })
      if (url.includes(encodeURIComponent(canonical))) return new Response('# Canonical report')
      return new Response('not found', { status: 404 })
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<Preview entry={entry('report.md')} onResult={() => {}} labels={labels} />)

    await screen.findByRole('heading', { name: 'Canonical report' })
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining(encodeURIComponent(canonical)))
  })

  it('renders network Markdown as read-only content', async () => {
    const remote = 'https://files.example.com/report.md'
    vi.stubGlobal('fetch', vi.fn(async (_input: string | URL | Request, init?: RequestInit) => {
      if (init?.method === 'POST') return new Response(null, {
        status: 204,
        headers: { 'X-Output-Dock-Resolved': encodeURIComponent(remote) },
      })
      return new Response('# Remote report')
    }))

    const { container } = render(<Preview entry={entry(remote)} onResult={() => {}} labels={labels} />)
    await screen.findByRole('heading', { name: 'Remote report' })
    await waitFor(() => {
      expect(container.querySelector('.dsh-od-preview-md')?.getAttribute('contenteditable')).toBeNull()
    })
  })
})
