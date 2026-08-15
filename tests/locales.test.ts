import { describe, expect, it } from 'vitest'
import { en, zh } from '../src/client/locales.ts'

describe('output dock locale headings', () => {
  it('uses the product heading in both locales', () => {
    expect(en['dock.title']).toBe('Outputs')
    expect(zh['dock.title']).toBe('Outputs')
  })
})
