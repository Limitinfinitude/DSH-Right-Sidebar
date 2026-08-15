import { stat } from 'node:fs/promises'
import { extname } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { resolveWorkspaceFile } from './workspace-file.ts'

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

const DOCUMENT_EXTENSIONS = new Set(['md', 'mdx', 'pdf', 'html', 'htm', 'txt', 'csv', 'tsv'])
const VISUAL_EXTENSIONS = new Set(['svg', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'avif', 'bmp'])
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

export async function validatePublicationResource(
  publication: OutputPublication,
  roots: readonly string[],
): Promise<string | undefined> {
  if (publication.kind === 'link') return undefined
  const path = publication.path ?? ''
  const extension = extname(path).slice(1).toLowerCase()
  const formats = publication.kind === 'document' ? DOCUMENT_EXTENSIONS : VISUAL_EXTENSIONS
  if (!formats.has(extension)) throw new Error(`unsupported ${publication.kind} format: ${extension || 'none'}`)

  const file = await resolveWorkspaceFile(path, roots, formats)
  if (file === null) throw new Error('published file must exist inside a registered workspace')
  const info = await stat(file)
  if (!info.isFile()) throw new Error('published path must identify a regular file')
  return file
}

const publicationProperties = {
  workId: { type: 'string' as const, required: true as const },
  workTitle: { type: 'string' as const, required: true as const },
  resultId: { type: 'string' as const, required: true as const },
  label: { type: 'string' as const, required: true as const },
  kind: { type: 'string' as const, required: true as const, enum: ['document', 'visual', 'link'] as const },
  path: { type: 'string' as const },
  url: { type: 'string' as const },
}

export function registerPublishTool(ctx: Context, roots: () => readonly string[]): () => void {
  return ctx.tools.register(defineTool({
    name: OUTPUT_DOCK_TOOL,
    description: 'Publish one user-facing output to Output Dock after it is ready. Publish only final documents, visuals, or reachable deployed applications. Exclude source code, configuration, incidental project files, and complete generated file lists. For deployed applications use kind "link" with the reachable HTTP or HTTPS URL.',
    parameters: {
      workId: { ...publicationProperties.workId, description: 'Stable work identity, at most 64 characters.' },
      workTitle: { ...publicationProperties.workTitle, description: 'Visible work title, at most 80 characters.' },
      resultId: { ...publicationProperties.resultId, description: 'Stable result identity within the work, at most 64 characters.' },
      label: { ...publicationProperties.label, description: 'Visible result label, at most 80 characters.' },
      kind: { ...publicationProperties.kind, description: 'document or visual for a workspace file; link for a deployed application.' },
      path: { ...publicationProperties.path, description: 'Workspace-relative or workspace-contained absolute path for document and visual results.' },
      url: { ...publicationProperties.url, description: 'Absolute HTTP or HTTPS URL for link results.' },
    },
    output: {
      schema: { type: 'object', additionalProperties: false, properties: publicationProperties },
      render: (_args, value) => [{ type: 'text', text: `Published ${value.workTitle} · ${value.label}.` }],
    },
    async execute(args) {
      const publication = normalizePublication(args)
      await validatePublicationResource(publication, roots())
      return publication
    },
  }))
}
