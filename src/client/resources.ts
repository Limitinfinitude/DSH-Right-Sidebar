import { ROUTE_PATH } from '../route.ts'

/** Browser URL for one workspace-confined output file. */
export function fileUrl(path: string): string {
  return `${ROUTE_PATH}?path=${encodeURIComponent(path)}`
}

/** Save text-backed output content through the workspace-confined file route. */
export async function saveFileContent(path: string, content: string): Promise<void> {
  const response = await fetch(fileUrl(path), {
    method: 'PUT',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    body: content,
  })
  if (!response.ok) throw new Error(String(response.status))
}

function isSiblingReference(href: string): boolean {
  return href !== ''
    && !href.startsWith('#')
    && !href.startsWith('/')
    && !href.startsWith('//')
    && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(href)
}

function normalizeSibling(sourcePath: string, reference: string): string {
  const normalized = sourcePath.replaceAll('\\', '/')
  const base = normalized.slice(0, Math.max(0, normalized.lastIndexOf('/') + 1))
  const parts = (base.endsWith('/') ? base.slice(0, -1) : base).split('/')
  for (const part of reference.replaceAll('\\', '/').split('/')) {
    if (part === '' || part === '.') continue
    if (part === '..') {
      const floor = parts[0] === '' || /^[A-Za-z]:$/.test(parts[0] ?? '') ? 1 : 0
      if (parts.length > floor) parts.pop()
      continue
    }
    parts.push(part)
  }
  return parts.join('/')
}

/** Resolve one resource reference found inside a preview document. */
export function resolveResourceUrl(sourcePath: string, href: string): string {
  if (!isSiblingReference(href)) return href
  const hashAt = href.indexOf('#')
  const beforeHash = hashAt === -1 ? href : href.slice(0, hashAt)
  const hash = hashAt === -1 ? '' : href.slice(hashAt)
  const queryAt = beforeHash.indexOf('?')
  const reference = queryAt === -1 ? beforeHash : beforeHash.slice(0, queryAt)
  const query = queryAt === -1 ? '' : beforeHash.slice(queryAt + 1)
  const target = normalizeSibling(sourcePath, reference)
  return `${fileUrl(target)}${query === '' ? '' : `&${query}`}${hash}`
}

/** Normalize a sanitized SVG document for a contained sidebar preview. */
export function prepareSvg(_sourcePath: string, source: string): string {
  const doc = new DOMParser().parseFromString(source, 'image/svg+xml')
  const svg = doc.documentElement
  if (svg.localName !== 'svg' || doc.querySelector('parsererror') !== null) return source

  const numericDimension = (value: string | null): number | null => {
    const match = /^\s*(\d+(?:\.\d+)?)\s*(?:px)?\s*$/i.exec(value ?? '')
    if (match === null) return null
    const parsed = Number(match[1])
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null
  }
  if (!svg.hasAttribute('viewBox')) {
    const width = numericDimension(svg.getAttribute('width'))
    const height = numericDimension(svg.getAttribute('height'))
    if (width !== null && height !== null) svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  }
  if (svg.hasAttribute('viewBox')) {
    svg.removeAttribute('width')
    svg.removeAttribute('height')
  }
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')

  for (const node of svg.querySelectorAll('[href]')) {
    const href = node.getAttribute('href')
    if (href !== null) node.setAttribute('href', resolveResourceUrl(_sourcePath, href))
  }
  for (const node of svg.querySelectorAll('[*|href]')) {
    const href = node.getAttribute('xlink:href')
    if (href !== null) node.setAttribute('xlink:href', resolveResourceUrl(_sourcePath, href))
  }
  return new XMLSerializer().serializeToString(svg)
}

function rewriteHtmlResources(sourcePath: string, doc: Document): void {
  for (const attribute of ['src', 'href', 'poster'] as const) {
    for (const node of doc.querySelectorAll(`[${attribute}]`)) {
      const value = node.getAttribute(attribute)
      if (value !== null) node.setAttribute(attribute, resolveResourceUrl(sourcePath, value))
    }
  }
}

const HTML_FIT_CSS = `
html { width: 100%; overflow-x: hidden; }
body { width: 100%; min-width: 0; margin: 0; overflow-x: hidden; overflow-wrap: anywhere; }
*, *::before, *::after { box-sizing: border-box; }
img, svg, video, canvas, iframe, table, pre { max-width: 100%; }
img, svg, video, canvas { height: auto; }
main, section, article, header, footer, nav, aside, div, form { min-width: 0; max-width: 100%; }
pre, code { white-space: pre-wrap; overflow-wrap: anywhere; }
table { width: 100%; table-layout: fixed; border-collapse: collapse; }
th, td { overflow-wrap: anywhere; }
`

function makeHtmlResponsive(doc: Document): void {
  let viewport = doc.head.querySelector<HTMLMetaElement>('meta[name="viewport"]')
  if (viewport === null) {
    viewport = doc.createElement('meta')
    viewport.name = 'viewport'
    doc.head.prepend(viewport)
  }
  viewport.content = 'width=device-width, initial-scale=1'
  const style = doc.createElement('style')
  style.dataset.outputDockFit = ''
  style.textContent = HTML_FIT_CSS
  doc.head.append(style)
}

/** Rewrite relative assets in an HTML preview document. */
export function prepareHtml(sourcePath: string, source: string): string {
  const doc = new DOMParser().parseFromString(source, 'text/html')
  rewriteHtmlResources(sourcePath, doc)
  makeHtmlResponsive(doc)
  return `<!doctype html>${doc.documentElement.outerHTML}`
}

/** Rewrite relative assets in sanitized Markdown-rendered HTML. */
export function prepareHtmlFragment(sourcePath: string, source: string): string {
  const doc = new DOMParser().parseFromString(source, 'text/html')
  rewriteHtmlResources(sourcePath, doc)
  return doc.body.innerHTML
}
