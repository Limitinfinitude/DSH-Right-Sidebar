/**
 * dsh-right-sidebar, node half. Serves preview bytes for the browser dock:
 * one read-only HTTP route that resolves a workspace file path against the
 * authoritative roots — the boot cwd plus every registered workspace — then
 * enforces a size cap and an extension allowlist. No session, settings, or
 * Typert surface — the dock is read-only.
 */
import { createReadStream, realpathSync } from 'node:fs'
import { realpath, stat, writeFile } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { ROUTE_PATH } from './route.ts'
import { OUTPUT_FORMATS } from './formats.ts'

/** Minimal typed faces of the harness services this half consumes. */
interface OutputDockWebServer {
  register(route: {
    kind: 'route'
    path: string
    handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>
  }): () => void
}

interface OutputDockWorkspace {
  /** Canonical directory path (fs.realpath spelling). */
  readonly path: string
}

interface OutputDockWorkspaceRegistry {
  list(): readonly OutputDockWorkspace[]
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    webServer: OutputDockWebServer
    workspaceRegistry: OutputDockWorkspaceRegistry
  }
}

export const name = 'output-dock'
export const inject = ['webServer', 'workspaceRegistry']

const MAX_BYTES = 16 * 1024 * 1024
const AUTHORIZED_ROOT_LIMIT = 256
const AUTHORIZED_ROOT_TTL = 6 * 60 * 60 * 1000

const ALLOWED_EXTENSIONS = new Set(Object.keys(OUTPUT_FORMATS))
const authorizedRoots = new Map<string, number>()

function activeAuthorizedRoots(now = Date.now()): readonly string[] {
  for (const [root, authorizedAt] of authorizedRoots) {
    if (now - authorizedAt > AUTHORIZED_ROOT_TTL) authorizedRoots.delete(root)
  }
  return [...authorizedRoots.keys()]
}

function authorizeRoot(root: string): void {
  authorizedRoots.delete(root)
  authorizedRoots.set(root, Date.now())
  while (authorizedRoots.size > AUTHORIZED_ROOT_LIMIT) {
    const oldest = authorizedRoots.keys().next().value as string | undefined
    if (oldest === undefined) break
    authorizedRoots.delete(oldest)
  }
}

function isSameOrigin(req: IncomingMessage): boolean {
  const origin = req.headers.origin
  const host = req.headers.host
  if (origin === undefined) return true
  if (typeof origin !== 'string' || typeof host !== 'string') return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

async function supportedFile(raw: string): Promise<string | null> {
  if (raw === '' || !isAbsolute(raw)) return null
  try {
    const real = await realpath(raw)
    return ALLOWED_EXTENSIONS.has(extname(real).slice(1).toLowerCase()) ? real : null
  } catch {
    return null
  }
}

function editableFile(file: string): boolean {
  const kind = OUTPUT_FORMATS[extname(file).slice(1).toLowerCase()]?.kind
  return kind !== undefined && kind !== 'image' && kind !== 'pdf'
}

async function requestText(req: IncomingMessage): Promise<string | null> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += bytes.length
    if (size > MAX_BYTES) return null
    chunks.push(bytes)
  }
  return Buffer.concat(chunks).toString('utf8')
}

/**
 * Resolve a requested path against the workspace roots, keeping the result
 * inside one of them. Absolute paths are accepted only when they already live
 * under a root; relative paths try every root; traversal, cross-drive hops,
 * and non-allowlisted extensions answer null. The final file is canonicalized
 * through realpath so symlink escapes cannot widen the surface.
 * @param raw - the raw `path` query parameter.
 * @param roots - canonical absolute roots (boot cwd plus registered workspaces).
 * @returns the resolved absolute file path, or null when rejected.
 */
async function workspaceFile(raw: string, roots: readonly string[]): Promise<string | null> {
  if (raw === '') return null
  const candidates = isAbsolute(raw) ? [raw] : roots.map(root => join(root, raw))
  for (const candidate of candidates) {
    let real: string
    try {
      real = await realpath(candidate)
    } catch {
      continue // nonexistent candidate — try the next root spelling
    }
    if (!ALLOWED_EXTENSIONS.has(extname(real).slice(1).toLowerCase())) return null
    for (const root of roots) {
      const rel = relative(root, real)
      if (rel !== '' && !rel.startsWith('..') && !isAbsolute(rel)) return real
    }
  }
  return null
}

/**
 * Register the file-content route. The handler is plain Node HTTP: path
 * validation first, then a stat gate (file, size cap), then stream or 404.
 * @param ctx - host context carrying the webserver and workspace services.
 */
export function apply(ctx: Context): void {
  const bootRoot = (): string => {
    try {
      return realpathSync(resolve(process.cwd()))
    } catch {
      return resolve(process.cwd())
    }
  }
  ctx.webServer.register({
    kind: 'route',
    path: ROUTE_PATH,
    async handler(req, res) {
      const roots = [...new Set([bootRoot(), ...ctx.workspaceRegistry.list().map(workspace => workspace.path)])]
      const url = new URL(req.url ?? '/', 'http://localhost')
      const rawPath = url.searchParams.get('path') ?? ''
      if (req.method === 'POST') {
        if (!isSameOrigin(req)) {
          res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('output-dock: cross-origin authorization rejected')
          return
        }
        const workspaceProduced = await workspaceFile(rawPath, roots)
        const produced = workspaceProduced ?? await supportedFile(rawPath)
        if (produced === null) {
          res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('output-dock: unsupported produced path')
          return
        }
        const info = await stat(produced)
        if (!info.isFile() || info.size > MAX_BYTES) {
          res.writeHead(404)
          res.end('not found')
          return
        }
        authorizeRoot(dirname(produced))
        res.writeHead(204, { 'Cache-Control': 'no-store' })
        res.end()
        return
      }
      const file = await workspaceFile(rawPath, [...roots, ...activeAuthorizedRoots()])
      if (file === null) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('output-dock: rejected path (outside any workspace or unsupported extension)')
        return
      }
      let info
      try {
        info = await stat(file)
      } catch {
        res.writeHead(404)
        res.end('not found')
        return
      }
      if (!info.isFile() || info.size > MAX_BYTES) {
        res.writeHead(404)
        res.end('not found')
        return
      }
      if (req.method === 'PUT') {
        if (!editableFile(file)) {
          res.writeHead(415, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('output-dock: this file type is read-only')
          return
        }
        const content = await requestText(req)
        if (content === null) {
          res.writeHead(413, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('output-dock: file content exceeds the size limit')
          return
        }
        await writeFile(file, content, 'utf8')
        res.writeHead(204, { 'Cache-Control': 'no-cache' })
        res.end()
        return
      }
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { Allow: 'GET, HEAD, POST, PUT' })
        res.end()
        return
      }
      const type = OUTPUT_FORMATS[extname(file).slice(1).toLowerCase()]?.mime ?? 'application/octet-stream'
      res.writeHead(200, {
        'Content-Type': type,
        'Content-Length': info.size,
        'Cache-Control': 'no-cache',
      })
      if (req.method === 'HEAD') {
        res.end()
        return
      }
      createReadStream(file).pipe(res)
    },
  })
}
