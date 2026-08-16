export type OutputDisposition = 'automatic' | 'explicit' | 'never'
export type OutputPublication = 'automatic' | 'explicit'

export interface ProducedOutputCandidate {
  readonly path: string
  readonly seq: number
}

export interface PublishedOutput extends ProducedOutputCandidate {
  readonly publication: OutputPublication
}

const AUTOMATIC_EXTENSIONS = new Set([
  'md', 'mdx', 'pdf', 'svg', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'avif', 'bmp',
])
const EXPLICIT_EXTENSIONS = new Set(['json', 'jsonl', 'csv', 'tsv', 'txt'])
const INTERNAL_DIRECTORIES = new Set(['.git', '.github', 'node_modules', 'src', 'config'])
const INTERNAL_NAMES = new Set([
  'package.json', 'composer.json', 'deno.json', 'deno.jsonc', 'package-lock.json',
  'pnpm-lock.yaml', 'yarn.lock', 'bun.lock', 'bun.lockb', 'cargo.lock', 'go.sum',
])

function normalized(path: string): string {
  return path.replaceAll('\\', '/').toLowerCase()
}

function basename(path: string): string {
  const value = normalized(path)
  return value.slice(value.lastIndexOf('/') + 1)
}

function extension(path: string): string {
  const name = basename(path)
  const dot = name.lastIndexOf('.')
  return dot === -1 ? '' : name.slice(dot + 1)
}

/** Classify a changed file by product value, not merely browser readability. */
export function outputDisposition(path: string): OutputDisposition {
  const value = normalized(path)
  const name = basename(value)
  const segments = value.split('/')
  if (segments.some(segment => INTERNAL_DIRECTORIES.has(segment))) return 'never'
  if (name === '.env' || name.startsWith('.env.') || INTERNAL_NAMES.has(name)) return 'never'
  if (/^(?:tsconfig|jsconfig|vite\.config|webpack\.config|eslint\.config|prettier\.config)(?:\.|$)/.test(name)) {
    return 'never'
  }
  const ext = extension(name)
  if (AUTOMATIC_EXTENSIONS.has(ext)) return 'automatic'
  if (EXPLICIT_EXTENSIONS.has(ext)) return 'explicit'
  return 'never'
}

/** Whether one persisted produced entry belongs in the user-facing dock. */
export function shouldPublishOutput(path: string, publication?: OutputPublication): boolean {
  const disposition = outputDisposition(path)
  return disposition === 'automatic' || (disposition === 'explicit' && publication === 'explicit')
}

/** Release conditional outputs explicitly named in an assistant response. */
export function mentionedConditionalOutputs(
  candidates: readonly ProducedOutputCandidate[],
  assistantText: string,
): readonly PublishedOutput[] {
  const message = normalized(assistantText)
  return candidates.flatMap(candidate => {
    if (outputDisposition(candidate.path) !== 'explicit') return []
    const path = normalized(candidate.path)
    const name = basename(path)
    if (!message.includes(path) && !message.includes(name)) return []
    return [{ ...candidate, publication: 'explicit' as const }]
  })
}
