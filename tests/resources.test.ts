// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { kindOfPath } from '../src/formats.ts'
import { isDockVisibleKind, isEditableKind } from '../src/client/contract.ts'
import { fileUrl, prepareHtml, prepareSvg, resolveResourceUrl } from '../src/client/resources.ts'

describe('output format classification', () => {
  it.each([
    ['report.mdx', 'md'],
    ['diagram.svg', 'svg'],
    ['photo.avif', 'image'],
    ['scan.bmp', 'image'],
    ['prototype.htm', 'html'],
    ['paper.pdf', 'pdf'],
    ['data.json', 'text'],
    ['component.tsx', 'code'],
    ['server.js', 'code'],
    ['notes.yaml', 'text'],
  ] as const)('classifies %s as %s', (path, expected) => {
    expect(kindOfPath(path)).toBe(expected)
  })

  it('leaves unsupported binary office files out of the preview list', () => {
    expect(kindOfPath('report.docx')).toBeNull()
  })
})

describe('editable output categories', () => {
  it.each(['md', 'svg', 'html', 'text', 'code'] as const)('allows editing %s files', kind => {
    expect(isEditableKind(kind)).toBe(true)
  })

  it.each(['image', 'pdf'] as const)('keeps %s files read-only', kind => {
    expect(isEditableKind(kind)).toBe(false)
  })
})

describe('dock visibility', () => {
  it('keeps source and HTML kinds out of the output dock renderer', () => {
    expect(isDockVisibleKind('code')).toBe(false)
    expect(isDockVisibleKind('html')).toBe(false)
    expect(isDockVisibleKind('md')).toBe(true)
  })
})

describe('preview resource URLs', () => {
  it('versions selected output URLs so repeated edits refetch the same path', () => {
    expect(fileUrl('D:\\work\\report.md', 42))
      .toBe('/api/output-dock/file?path=D%3A%5Cwork%5Creport.md&rev=42')
  })

  it('routes Windows sibling resources through the workspace file endpoint', () => {
    expect(resolveResourceUrl('D:\\work\\docs\\report.md', '../images/chart.png'))
      .toBe('/api/output-dock/file?path=D%3A%2Fwork%2Fimages%2Fchart.png')
  })

  it('routes POSIX sibling resources and preserves query/hash suffixes', () => {
    expect(resolveResourceUrl('/work/docs/report.html', './assets/chart.svg?v=2#plot'))
      .toBe('/api/output-dock/file?path=%2Fwork%2Fdocs%2Fassets%2Fchart.svg&v=2#plot')
  })

  it.each([
    '#section',
    '/absolute/browser/path.png',
    'https://example.com/image.png',
    '//cdn.example.com/image.png',
    'data:image/png;base64,AA==',
    'blob:https://example.com/id',
    'mailto:author@example.com',
  ])('leaves non-sibling URL %s unchanged', (href) => {
    expect(resolveResourceUrl('/work/docs/report.md', href)).toBe(href)
  })
})

describe('SVG preview normalization', () => {
  it('converts fixed numeric dimensions into a responsive contained SVG', () => {
    const source = '<svg width="800" height="400"><image href="assets/chart.png" /></svg>'
    const prepared = prepareSvg('D:\\work\\diagram.svg', source)
    const doc = new DOMParser().parseFromString(prepared, 'image/svg+xml')
    const svg = doc.documentElement
    const image = svg.querySelector('image')

    expect(svg.getAttribute('viewBox')).toBe('0 0 800 400')
    expect(svg.hasAttribute('width')).toBe(false)
    expect(svg.hasAttribute('height')).toBe(false)
    expect(svg.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet')
    expect(image?.getAttribute('href'))
      .toBe('/api/output-dock/file?path=D%3A%2Fwork%2Fassets%2Fchart.png')
  })
})

describe('HTML preview resources', () => {
  it('rewrites local src and href attributes without touching network links', () => {
    const html = prepareHtml('/work/site/report.html', [
      '<img src="images/chart.png">',
      '<a href="notes.txt">notes</a>',
      '<a href="https://example.com">external</a>',
    ].join(''))
    const doc = new DOMParser().parseFromString(html, 'text/html')
    expect(doc.querySelector('img')?.getAttribute('src'))
      .toBe('/api/output-dock/file?path=%2Fwork%2Fsite%2Fimages%2Fchart.png')
    expect(doc.querySelectorAll('a')[0]?.getAttribute('href'))
      .toBe('/api/output-dock/file?path=%2Fwork%2Fsite%2Fnotes.txt')
    expect(doc.querySelectorAll('a')[1]?.getAttribute('href')).toBe('https://example.com')
  })

  it('injects a responsive viewport and sidebar-fit rules into fixed-width pages', () => {
    const html = prepareHtml('/work/site/report.html', '<main style="width: 1200px">Wide</main>')
    const doc = new DOMParser().parseFromString(html, 'text/html')
    expect(doc.querySelector('meta[name="viewport"]')?.getAttribute('content'))
      .toBe('width=device-width, initial-scale=1')
    expect(doc.querySelector('style[data-output-dock-fit]')?.textContent)
      .toContain('max-width: 100%')
  })
})
