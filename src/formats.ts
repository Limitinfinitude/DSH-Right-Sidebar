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
  js: { kind: 'text', mime: 'text/javascript; charset=utf-8' },
  jsx: { kind: 'text', mime: 'text/javascript; charset=utf-8' },
  ts: { kind: 'text', mime: 'text/plain; charset=utf-8' },
  tsx: { kind: 'text', mime: 'text/plain; charset=utf-8' },
  css: { kind: 'text', mime: 'text/css; charset=utf-8' },
  scss: { kind: 'text', mime: 'text/plain; charset=utf-8' },
  less: { kind: 'text', mime: 'text/plain; charset=utf-8' },
  py: { kind: 'text', mime: 'text/x-python; charset=utf-8' },
  sh: { kind: 'text', mime: 'text/x-shellscript; charset=utf-8' },
  ps1: { kind: 'text', mime: 'text/plain; charset=utf-8' },
  sql: { kind: 'text', mime: 'application/sql; charset=utf-8' },
  go: { kind: 'text', mime: 'text/plain; charset=utf-8' },
  rs: { kind: 'text', mime: 'text/plain; charset=utf-8' },
  java: { kind: 'text', mime: 'text/x-java-source; charset=utf-8' },
  c: { kind: 'text', mime: 'text/x-c; charset=utf-8' },
  h: { kind: 'text', mime: 'text/x-c; charset=utf-8' },
  cpp: { kind: 'text', mime: 'text/x-c++; charset=utf-8' },
  hpp: { kind: 'text', mime: 'text/x-c++; charset=utf-8' },
  vue: { kind: 'text', mime: 'text/plain; charset=utf-8' },
  svelte: { kind: 'text', mime: 'text/plain; charset=utf-8' },
}

/** Preview category for one path, or null when the dock does not collect it. */
export function kindOfPath(path: string): OutputKind | null {
  const dot = path.lastIndexOf('.')
  if (dot < 0) return null
  return OUTPUT_FORMATS[path.slice(dot + 1).toLowerCase()]?.kind ?? null
}
