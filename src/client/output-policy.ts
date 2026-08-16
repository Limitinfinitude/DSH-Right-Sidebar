import { marked } from 'marked'

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
const MENTIONED_EXTENSION_PATTERN = [
  ...AUTOMATIC_EXTENSIONS, ...EXPLICIT_EXTENSIONS,
].sort((left, right) => right.length - left.length).join('|')
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

function cleanMentionedPath(raw: string): string | null {
  let path = raw.trim().replace(/^[<'"(]+|[>'"),.;:!?，。；：！？]+$/g, '')
  if (path === '') return null
  try { path = decodeURIComponent(path) } catch {}
  if (path.startsWith('//')) return null
  if (/^[A-Za-z][A-Za-z\d+.-]*:/.test(path) && !/^[A-Za-z]:[\\/]/.test(path)) return null
  return outputDisposition(path) === 'never' ? null : path
}

/** Paths the assistant explicitly presents as outputs, including shell-produced files. */
export function mentionedOutputPaths(assistantText: string): readonly string[] {
  const paths = new Set<string>()
  const add = (raw: string): void => {
    const path = cleanMentionedPath(raw)
    if (path !== null) paths.add(path)
  }
  const plainPattern = new RegExp(
    `(?<![\\p{L}\\p{N}_])(?:[A-Za-z]:[\\\\/][^\\r\\n\`\"'<>|?*]+?\\.(?:${MENTIONED_EXTENSION_PATTERN})|(?:\\.{0,2}[\\\\/])?[A-Za-z0-9_@+.,()\\-]+(?:[\\\\/][A-Za-z0-9_@+.,()\\-]+)*\\.(?:${MENTIONED_EXTENSION_PATTERN}))(?=$|[\\s，。；：！？,;:!?)])`,
    'giu',
  )
  const tokens = marked.lexer(assistantText)
  marked.walkTokens(tokens, token => {
    if (token.type === 'link') add(token.href)
    if (token.type === 'codespan') add(token.text)
    if (token.type === 'text') {
      const searchable = token.text.replace(/[A-Za-z][A-Za-z\d+.-]*:\/\/\S+/g, '')
      for (const match of searchable.matchAll(plainPattern)) add(match[0])
    }
  })
  const output: string[] = []
  for (const path of paths) {
    const value = normalized(path)
    const related = output.findIndex(candidate => {
      const existing = normalized(candidate)
      return value === existing || value.endsWith(`/${existing}`) || existing.endsWith(`/${value}`)
    })
    if (related === -1) output.push(path)
    else if (path.length > (output[related]?.length ?? 0)) output[related] = path
  }
  return output
}
