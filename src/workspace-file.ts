import { realpathSync } from 'node:fs'
import { realpath } from 'node:fs/promises'
import { extname, isAbsolute, join, relative, resolve } from 'node:path'

export interface OutputDockWorkspace {
  readonly path: string
}

export interface OutputDockWorkspaceRegistry {
  list(): readonly OutputDockWorkspace[]
}

function canonicalRoot(path: string): string {
  try {
    return realpathSync(resolve(path))
  } catch {
    return resolve(path)
  }
}

export function workspaceRoots(registry: OutputDockWorkspaceRegistry): readonly string[] {
  return [...new Set([
    canonicalRoot(process.cwd()),
    ...registry.list().map(workspace => canonicalRoot(workspace.path)),
  ])]
}

export async function resolveWorkspaceFile(
  raw: string,
  roots: readonly string[],
  allowedExtensions: ReadonlySet<string>,
): Promise<string | null> {
  if (raw.trim() === '') return null
  const extension = extname(raw).slice(1).toLowerCase()
  if (!allowedExtensions.has(extension)) return null

  const candidates = isAbsolute(raw) ? [raw] : roots.map(root => join(root, raw))
  for (const candidate of candidates) {
    let file: string
    try {
      file = await realpath(candidate)
    } catch {
      continue
    }
    for (const root of roots) {
      const rel = relative(root, file)
      if (rel !== '' && !rel.startsWith('..') && !isAbsolute(rel)) return file
    }
  }
  return null
}
