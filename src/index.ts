import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { extname } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { OUTPUT_FORMATS } from './formats.ts'
import { registerPublishTool } from './publish.ts'
import { ROUTE_PATH } from './route.ts'
import { resolveWorkspaceFile, workspaceRoots, type OutputDockWorkspaceRegistry } from './workspace-file.ts'

interface OutputDockWebServer {
  register(route: {
    kind: 'route'
    path: string
    handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>
  }): () => void
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    webServer: OutputDockWebServer
    workspaceRegistry: OutputDockWorkspaceRegistry
  }
}

export const name = 'output-dock'
export const inject = ['webServer', 'workspaceRegistry', 'tools']

const MAX_BYTES = 16 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(Object.keys(OUTPUT_FORMATS))

export function registerFileRoute(
  webServer: OutputDockWebServer,
  roots: () => readonly string[],
): () => void {
  return webServer.register({
    kind: 'route',
    path: ROUTE_PATH,
    async handler(req, res) {
      const url = new URL(req.url ?? '/', 'http://localhost')
      const file = await resolveWorkspaceFile(url.searchParams.get('path') ?? '', roots(), ALLOWED_EXTENSIONS)
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

export function apply(ctx: Context): void {
  const roots = (): readonly string[] => workspaceRoots(ctx.workspaceRegistry)
  ctx.effect(() => registerPublishTool(ctx, roots), 'output-dock: publish tool')
  ctx.effect(() => registerFileRoute(ctx.webServer, roots), 'output-dock: file route')
}
