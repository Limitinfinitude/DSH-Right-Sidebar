import { describe, expect, it } from 'vitest'
import { dockRenderTarget } from '../src/client/viewport.ts'

describe('output dock viewport routing', () => {
  it('mounts exactly one surface for each viewport class', () => {
    expect(dockRenderTarget(false)).toBe('details')
    expect(dockRenderTarget(true)).toBe('mobile')
  })
})
