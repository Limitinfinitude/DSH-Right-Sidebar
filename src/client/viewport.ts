export type DockRenderTarget = 'details' | 'mobile'

export const COMPACT_VIEWPORT_QUERY = '(max-width: 1023px)'

export function dockRenderTarget(compact: boolean): DockRenderTarget {
  return compact ? 'mobile' : 'details'
}

export function getCompactViewport(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(COMPACT_VIEWPORT_QUERY).matches
}

export function subscribeCompactViewport(listener: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {}
  const media = window.matchMedia(COMPACT_VIEWPORT_QUERY)
  media.addEventListener('change', listener)
  return () => { media.removeEventListener('change', listener) }
}
