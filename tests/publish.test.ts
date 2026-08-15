import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { normalizePublication, validatePublicationResource } from '../src/publish.ts'

const root = join(process.cwd(), '.tmp-publish-test')
const local = {
  workId: 'sales',
  workTitle: 'Sales',
  resultId: 'dashboard',
  label: 'Dashboard',
  kind: 'visual',
  path: 'reports/chart.svg',
} as const

afterEach(async () => {
  await rm(root, { recursive: true, force: true })
})

describe('output publication', () => {
  it('normalizes a local result and rejects mixed resources', () => {
    expect(normalizePublication(local)).toEqual(local)
    expect(() => normalizePublication({ ...local, url: 'https://example.com' }))
      .toThrow(/exactly one resource/i)
  })

  it('accepts only http and https links', () => {
    expect(normalizePublication({
      workId: 'app',
      workTitle: 'App',
      resultId: 'preview',
      label: 'Preview',
      kind: 'link',
      url: 'http://127.0.0.1:4173/',
    }).url).toBe('http://127.0.0.1:4173/')
    expect(() => normalizePublication({
      workId: 'app',
      workTitle: 'App',
      resultId: 'preview',
      label: 'Preview',
      kind: 'link',
      url: 'file:///tmp/index.html',
    })).toThrow(/http/i)
  })

  it('requires a supported existing file inside a workspace', async () => {
    await mkdir(join(root, 'reports'), { recursive: true })
    await writeFile(join(root, 'reports', 'chart.svg'), '<svg viewBox="0 0 1 1"/>')
    await expect(validatePublicationResource(local, [root]))
      .resolves.toMatch(/chart\.svg$/)
    await expect(validatePublicationResource({ ...local, path: '../secret.svg' }, [root]))
      .rejects.toThrow(/workspace/i)
    await expect(validatePublicationResource({ ...local, path: 'src/app.ts' }, [root]))
      .rejects.toThrow(/format/i)
  })
})
