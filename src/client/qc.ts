/**
 * Deterministic, rule-only quality checks per output kind. Everything here
 * runs locally: no model, no extra tokens. Markdown checks the fence balance
 * and probes relative links against the plugin's file route; SVG/HTML parse
 * with the DOM parser and report structure problems; images report load and
 * dimension facts.
 */
import { fileUrl, resolveResourceUrl } from './resources.ts'

export type QcLevel = 'ok' | 'warn' | 'error' | 'loading'

export interface QcIssue {
  readonly level: 'warn' | 'error'
  readonly code: 'md-broken-link' | 'md-unbalanced-fence' | 'svg-parse' | 'svg-no-viewbox'
    | 'svg-sanitized' | 'image-failed' | 'html-parse' | 'file-read'
  readonly count?: number
}

export interface QcResult {
  readonly level: QcLevel
  readonly issues: readonly QcIssue[]
}

export const QC_LOADING: QcResult = { level: 'loading', issues: [] }

async function probeExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

/** Relative link/image targets from Markdown source (deduped, ordered). */
export function markdownRelativeTargets(source: string): readonly string[] {
  const seen = new Set<string>()
  const targets: string[] = []
  const pattern = /!?\[[^\]]*]\(([^()\s]+)\)/g
  for (const match of source.matchAll(pattern)) {
    const target = match[1] ?? ''
    if (target === '' || target.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue
    if (seen.has(target)) continue
    seen.add(target)
    targets.push(target)
  }
  return targets
}

function fenceBalance(source: string): number {
  let count = 0
  for (const line of source.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) count++
  }
  return count
}

/** Resolve a produced-file-relative target against the produced path's directory. */
function resolveRelative(basePath: string, target: string): string {
  const sep = basePath.includes('\\') ? '\\' : '/'
  const parts = basePath.split(sep)
  parts.pop()
  for (const segment of target.split('/')) {
    if (segment === '.' || segment === '') continue
    if (segment === '..') parts.pop()
    else parts.push(segment)
  }
  return parts.join(sep)
}

export async function checkMarkdown(path: string, source: string): Promise<QcResult> {
  const issues: QcIssue[] = []
  if (fenceBalance(source) % 2 !== 0) {
    issues.push({ level: 'error', code: 'md-unbalanced-fence' })
  }
  const targets = markdownRelativeTargets(source).slice(0, 32)
  let missing = 0
  for (const target of targets) {
    if (!(await probeExists(resolveResourceUrl(path, target)))) missing++
  }
  if (missing > 0) issues.push({ level: 'warn', code: 'md-broken-link', count: missing })
  return finish(issues)
}

export async function checkSvg(source: string): Promise<QcResult> {
  const issues: QcIssue[] = []
  const doc = new DOMParser().parseFromString(source, 'image/svg+xml')
  const root = doc.documentElement
  if (doc.querySelector('parsererror') !== null || root.localName !== 'svg') {
    return { level: 'error', issues: [{ level: 'error', code: 'svg-parse' }] }
  }
  if (!root.hasAttribute('viewBox')) issues.push({ level: 'warn', code: 'svg-no-viewbox' })
  const dangerous = root.querySelectorAll(
    'script, foreignObject, iframe, [onclick], [onload], [href^="javascript:"]',
  )
  if (dangerous.length > 0) issues.push({ level: 'warn', code: 'svg-sanitized' })
  return finish(issues)
}

export async function checkHtml(source: string): Promise<QcResult> {
  const issues: QcIssue[] = []
  const doc = new DOMParser().parseFromString(source, 'text/html')
  const problems = doc.querySelectorAll('parsererror').length
  if (problems > 0) issues.push({ level: 'warn', code: 'html-parse', count: problems })
  return finish(issues)
}

export function checkImage(element: HTMLImageElement): QcResult {
  if (element.complete && element.naturalWidth === 0) {
    return { level: 'error', issues: [{ level: 'error', code: 'image-failed' }] }
  }
  return { level: 'ok', issues: [] }
}

function finish(issues: QcIssue[]): QcResult {
  if (issues.length === 0) return { level: 'ok', issues: [] }
  const level = issues.some(issue => issue.level === 'error') ? 'error' : 'warn'
  return { level, issues }
}
