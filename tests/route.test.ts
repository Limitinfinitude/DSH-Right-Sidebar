import { afterEach, describe, expect, it, vi } from 'vitest'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { apply } from '../src/index.ts'

interface CapturedResponse {
  status?: number
  body: string
  headers?: Record<string, string>
}

function response(): { readonly value: CapturedResponse; readonly face: never } {
  const value: CapturedResponse = { body: '' }
  return {
    value,
    face: {
      writeHead: (status: number, headers?: Record<string, string>) => {
        value.status = status
        value.headers = headers
      },
      end: (body = '') => { value.body += String(body) },
    } as never,
  }
}

describe('output dock file route', () => {
  const temporary: string[] = []

  afterEach(async () => {
    vi.unstubAllGlobals()
    await Promise.all(temporary.splice(0).map(path => rm(path, { recursive: true, force: true })))
  })

  it('writes an editable workspace source file through PUT', async () => {
    const root = await mkdtemp(join(tmpdir(), 'output-dock-route-'))
    temporary.push(root)
    const file = join(root, 'app.ts')
    await writeFile(file, 'const oldValue = 1\n')
    let handler: ((req: never, res: never) => Promise<void>) | undefined
    apply({
      webServer: { register: route => { handler = route.handler as never; return () => {} } },
      workspaceRegistry: { list: () => [{ path: root }] },
    } as never)

    const req = Object.assign(Readable.from(['const newValue = 2\n']), {
      method: 'PUT', url: `/api/output-dock/file?path=${encodeURIComponent(file)}`,
    })
    const res = response()
    await handler!(req as never, res.face)

    expect(res.value.status).toBe(204)
    await expect(readFile(file, 'utf8')).resolves.toBe('const newValue = 2\n')
  })

  it('serves a produced file outside registered workspaces after same-origin authorization', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'output-dock-workspace-'))
    const external = await mkdtemp(join(tmpdir(), 'output-dock-external-'))
    temporary.push(workspace, external)
    const file = join(external, 'report.md')
    await writeFile(file, '# External report\n')
    let handler: ((req: never, res: never) => Promise<void>) | undefined
    apply({
      webServer: { register: route => { handler = route.handler as never; return () => {} } },
      workspaceRegistry: { list: () => [{ path: workspace }] },
    } as never)

    const headBefore = response()
    await handler!(Object.assign(Readable.from([]), {
      method: 'HEAD', url: `/api/output-dock/file?path=${encodeURIComponent(file)}`,
    }) as never, headBefore.face)
    expect(headBefore.value.status).toBe(400)

    const authorize = response()
    await handler!(Object.assign(Readable.from([]), {
      method: 'POST',
      url: `/api/output-dock/file?path=${encodeURIComponent(file)}`,
      headers: { host: '127.0.0.1:3080', origin: 'http://127.0.0.1:3080' },
    }) as never, authorize.face)
    expect(authorize.value.status).toBe(204)

    const headAfter = response()
    await handler!(Object.assign(Readable.from([]), {
      method: 'HEAD', url: `/api/output-dock/file?path=${encodeURIComponent(file)}`,
    }) as never, headAfter.face)
    expect(headAfter.value.status).toBe(200)
  })

  it('authorizes workspace-relative produced paths without requiring an absolute path', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'output-dock-relative-'))
    temporary.push(workspace)
    await writeFile(join(workspace, 'notes.md'), '# Notes\n')
    let handler: ((req: never, res: never) => Promise<void>) | undefined
    apply({
      webServer: { register: route => { handler = route.handler as never; return () => {} } },
      workspaceRegistry: { list: () => [{ path: workspace }] },
    } as never)

    const authorize = response()
    await handler!(Object.assign(Readable.from([]), {
      method: 'POST', url: '/api/output-dock/file?path=notes.md', headers: {},
    }) as never, authorize.face)

    expect(authorize.value.status).toBe(204)
  })

  it('resolves a unique nested file from an incomplete basename', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'output-dock-incomplete-'))
    const nested = join(workspace, 'project', 'reports')
    temporary.push(workspace)
    await mkdir(nested, { recursive: true })
    const file = join(nested, 'summary.md')
    await writeFile(file, '# Summary\n')
    let handler: ((req: never, res: never) => Promise<void>) | undefined
    apply({
      webServer: { register: route => { handler = route.handler as never; return () => {} } },
      workspaceRegistry: { list: () => [{ path: workspace }] },
    } as never)

    const authorize = response()
    await handler!(Object.assign(Readable.from([]), {
      method: 'POST', url: '/api/output-dock/file?path=summary.md', headers: {},
    }) as never, authorize.face)

    expect(authorize.value.status).toBe(204)
    expect(decodeURIComponent(authorize.value.headers?.['X-Output-Dock-Resolved'] ?? '')).toBe(file)
  })

  it('rejects an incomplete basename when multiple workspace files match', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'output-dock-ambiguous-'))
    temporary.push(workspace)
    await Promise.all(['one', 'two'].map(async directory => {
      const nested = join(workspace, directory)
      await mkdir(nested, { recursive: true })
      await writeFile(join(nested, 'summary.md'), `# ${directory}\n`)
    }))
    let handler: ((req: never, res: never) => Promise<void>) | undefined
    apply({
      webServer: { register: route => { handler = route.handler as never; return () => {} } },
      workspaceRegistry: { list: () => [{ path: workspace }] },
    } as never)

    const authorize = response()
    await handler!(Object.assign(Readable.from([]), {
      method: 'POST', url: '/api/output-dock/file?path=summary.md', headers: {},
    }) as never, authorize.face)

    expect(authorize.value.status).toBe(409)
  })

  it('authorizes and proxies a supported file URL without forwarding credentials', async () => {
    const remote = 'https://files.example.com/report.md?token=abc'
    const fetchMock = vi.fn().mockResolvedValue(new Response('# Remote report\n', {
      status: 200,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    }))
    vi.stubGlobal('fetch', fetchMock)
    let handler: ((req: never, res: never) => Promise<void>) | undefined
    apply({
      webServer: { register: route => { handler = route.handler as never; return () => {} } },
      workspaceRegistry: { list: () => [] },
    } as never)

    const authorize = response()
    await handler!(Object.assign(Readable.from([]), {
      method: 'POST',
      url: `/api/output-dock/file?path=${encodeURIComponent(remote)}`,
      headers: { host: '127.0.0.1:3080', origin: 'http://127.0.0.1:3080' },
    }) as never, authorize.face)
    expect(authorize.value.status).toBe(204)

    const preview = response()
    await handler!(Object.assign(Readable.from([]), {
      method: 'GET', url: `/api/output-dock/file?path=${encodeURIComponent(remote)}`, headers: {},
    }) as never, preview.face)

    expect(preview.value.status).toBe(200)
    expect(preview.value.body).toBe('# Remote report\n')
    expect(fetchMock).toHaveBeenCalledWith(remote, expect.objectContaining({
      redirect: 'follow',
      headers: expect.not.objectContaining({ Cookie: expect.anything(), Authorization: expect.anything() }),
    }))
  })
})
