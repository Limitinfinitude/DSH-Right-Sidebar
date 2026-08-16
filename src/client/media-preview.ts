export type MediaZoom = 'fit' | number

export function adjustZoom(current: MediaZoom, direction: -1 | 1): number {
  const base = current === 'fit' ? 1 : current
  const factor = direction === 1 ? 1.25 : 0.8
  return Math.min(4, Math.max(0.25, Number((base * factor).toFixed(3))))
}

function numericDimension(value: string | null): number | null {
  const match = /^\s*(\d+(?:\.\d+)?)\s*(?:px)?\s*$/i.exec(value ?? '')
  if (match === null) return null
  const parsed = Number(match[1])
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

export function svgIntrinsicSize(source: string): { readonly width: number; readonly height: number } | null {
  const doc = new DOMParser().parseFromString(source, 'image/svg+xml')
  if (doc.querySelector('parsererror') !== null || doc.documentElement.localName !== 'svg') return null
  const svg = doc.documentElement
  const viewBox = svg.getAttribute('viewBox')?.trim().split(/[\s,]+/).map(Number)
  if (viewBox?.length === 4 && viewBox.every(Number.isFinite)
    && (viewBox[2] ?? 0) > 0 && (viewBox[3] ?? 0) > 0) {
    return { width: viewBox[2] ?? 0, height: viewBox[3] ?? 0 }
  }
  const width = numericDimension(svg.getAttribute('width'))
  const height = numericDimension(svg.getAttribute('height'))
  return width === null || height === null ? null : { width, height }
}
