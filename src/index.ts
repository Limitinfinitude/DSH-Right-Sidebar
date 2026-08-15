/**
 * dsh-right-sidebar, node half. Serves preview bytes for the browser dock:
 * one read-only HTTP route that resolves a workspace file path against the
 * authoritative roots — the boot cwd plus every registered workspace — then
 * enforces a size cap and an extension allowlist. No session, settings, or
 * Typert surface — the dock is read-only.
 */
import { createReadStream, realpathSync } from 'node:fs'
import { realpath, stat } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { extname, isAbsolute, join, relative, resolve } from 'node:path'
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

const ALLOWED_EXTENSIONS = new Set(Object.keys(OUTPUT_FORMATS))

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
      const file = await workspaceFile(url.searchParams.get('path') ?? '', roots)
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
