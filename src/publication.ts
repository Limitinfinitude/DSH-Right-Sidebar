export const OUTPUT_DOCK_TOOL = 'output_dock_publish'
export type PublicationKind = 'document' | 'visual' | 'link'

export interface OutputPublication {
  readonly workId: string
  readonly workTitle: string
  readonly resultId: string
  readonly label: string
  readonly kind: PublicationKind
  readonly path?: string
  readonly url?: string
}

const INPUT_KEYS = new Set(['workId', 'workTitle', 'resultId', 'label', 'kind', 'path', 'url'])

function requiredText(record: Record<string, unknown>, key: string, maxLength: number): string {
  const value = record[key]
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${key} must be a non-empty string`)
  if (value.length > maxLength) throw new Error(`${key} must be at most ${maxLength} characters`)
  return value
}

export function normalizePublication(input: unknown): OutputPublication {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new Error('publication must be an object')
  }
  const record = input as Record<string, unknown>
  const unknownKey = Object.keys(record).find(key => !INPUT_KEYS.has(key))
  if (unknownKey !== undefined) throw new Error(`unknown publication field: ${unknownKey}`)

  const workId = requiredText(record, 'workId', 64)
  const workTitle = requiredText(record, 'workTitle', 80)
  const resultId = requiredText(record, 'resultId', 64)
  const label = requiredText(record, 'label', 80)
  const kind = record.kind
  if (kind !== 'document' && kind !== 'visual' && kind !== 'link') {
    throw new Error('kind must be document, visual, or link')
  }

  const hasPath = typeof record.path === 'string' && record.path.trim() !== ''
  const hasUrl = typeof record.url === 'string' && record.url.trim() !== ''
  if (hasPath === hasUrl) throw new Error('exactly one resource, path or url, is required')
  if (kind === 'link' && !hasUrl) throw new Error('link publications require a URL')
  if (kind !== 'link' && !hasPath) throw new Error(`${kind} publications require a path`)

  if (hasUrl) {
    let parsed: URL
    try {
      parsed = new URL(record.url as string)
    } catch {
      throw new Error('link URL must be an absolute HTTP or HTTPS URL')
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('link URL must use HTTP or HTTPS')
    }
    return { workId, workTitle, resultId, label, kind, url: record.url as string }
  }

  return { workId, workTitle, resultId, label, kind, path: record.path as string }
}
