import type { OutputKind } from './client/contract.ts'

/** Extension metadata shared by the node route and browser collection path. */
export const OUTPUT_FORMATS: Readonly<Record<string, { kind: OutputKind; mime: string }>> = {
  md: { kind: 'md', mime: 'text/markdown; charset=utf-8' },
  mdx: { kind: 'md', mime: 'text/markdown; charset=utf-8' },
  svg: { kind: 'svg', mime: 'image/svg+xml' },
  png: { kind: 'image', mime: 'image/png' },
  jpg: { kind: 'image', mime: 'image/jpeg' },
  jpeg: { kind: 'image', mime: 'image/jpeg' },
  webp: { kind: 'image', mime: 'image/webp' },
  gif: { kind: 'image', mime: 'image/gif' },
  avif: { kind: 'image', mime: 'image/avif' },
  bmp: { kind: 'image', mime: 'image/bmp' },
  html: { kind: 'html', mime: 'text/html; charset=utf-8' },
  htm: { kind: 'html', mime: 'text/html; charset=utf-8' },
  pdf: { kind: 'pdf', mime: 'application/pdf' },
  txt: { kind: 'text', mime: 'text/plain; charset=utf-8' },
  log: { kind: 'text', mime: 'text/plain; charset=utf-8' },
  json: { kind: 'text', mime: 'application/json; charset=utf-8' },
  jsonl: { kind: 'text', mime: 'application/x-ndjson; charset=utf-8' },
  csv: { kind: 'text', mime: 'text/csv; charset=utf-8' },
  tsv: { kind: 'text', mime: 'text/tab-separated-values; charset=utf-8' },
  yaml: { kind: 'text', mime: 'application/yaml; charset=utf-8' },
  yml: { kind: 'text', mime: 'application/yaml; charset=utf-8' },
  toml: { kind: 'text', mime: 'application/toml; charset=utf-8' },
  xml: { kind: 'text', mime: 'application/xml; charset=utf-8' },
  ini: { kind: 'text', mime: 'text/plain; charset=utf-8' },
  conf: { kind: 'text', mime: 'text/plain; charset=utf-8' },
  js: { kind: 'code', mime: 'text/javascript; charset=utf-8' },
  jsx: { kind: 'code', mime: 'text/javascript; charset=utf-8' },
  ts: { kind: 'code', mime: 'text/plain; charset=utf-8' },
  tsx: { kind: 'code', mime: 'text/plain; charset=utf-8' },
  css: { kind: 'code', mime: 'text/css; charset=utf-8' },
  scss: { kind: 'code', mime: 'text/plain; charset=utf-8' },
  less: { kind: 'code', mime: 'text/plain; charset=utf-8' },
  py: { kind: 'code', mime: 'text/x-python; charset=utf-8' },
  sh: { kind: 'code', mime: 'text/x-shellscript; charset=utf-8' },
  ps1: { kind: 'code', mime: 'text/plain; charset=utf-8' },
  sql: { kind: 'code', mime: 'application/sql; charset=utf-8' },
  go: { kind: 'code', mime: 'text/plain; charset=utf-8' },
  rs: { kind: 'code', mime: 'text/plain; charset=utf-8' },
  java: { kind: 'code', mime: 'text/x-java-source; charset=utf-8' },
  c: { kind: 'code', mime: 'text/x-c; charset=utf-8' },
  h: { kind: 'code', mime: 'text/x-c; charset=utf-8' },
  cpp: { kind: 'code', mime: 'text/x-c++; charset=utf-8' },
  hpp: { kind: 'code', mime: 'text/x-c++; charset=utf-8' },
  vue: { kind: 'code', mime: 'text/plain; charset=utf-8' },
  svelte: { kind: 'code', mime: 'text/plain; charset=utf-8' },
}

/** Whether a produced output is an HTTP(S) resource rather than a local path. */
export function isNetworkOutput(value: string): boolean {
  try {
    const url = new URL(value)
    return (url.protocol === 'http:' || url.protocol === 'https:')
      && url.username === '' && url.password === ''
  } catch {
    return false
  }
}

/** Path portion used for format checks and labels, excluding URL query/hash data. */
export function outputPathname(value: string): string {
  if (isNetworkOutput(value)) {
    try { return decodeURIComponent(new URL(value).pathname) } catch { return new URL(value).pathname }
  }
  return value.split(/[?#]/, 1)[0] ?? value
}

/** Lowercase output extension without URL query or fragment suffixes. */
export function outputExtension(value: string): string {
  const path = outputPathname(value)
  const dot = path.lastIndexOf('.')
  return dot < 0 ? '' : path.slice(dot + 1).toLowerCase()
}

/** Preview category for one path, or null when the dock does not collect it. */
export function kindOfPath(path: string): OutputKind | null {
  return OUTPUT_FORMATS[outputExtension(path)]?.kind ?? null
}
