import { afterEach, describe, expect, it } from 'vitest'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { apply } from '../src/index.ts'

interface CapturedResponse {
  status?: number
  body: string
}

function response(): { readonly value: CapturedResponse; readonly face: never } {
  const value: CapturedResponse = { body: '' }
  return {
    value,
    face: {
      writeHead: (status: number) => { value.status = status },
      end: (body = '') => { value.body += String(body) },
    } as never,
  }
}

describe('output dock file route', () => {
  const temporary: string[] = []

  afterEach(async () => {
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
})
