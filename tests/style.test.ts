import { describe, expect, it } from 'vitest'
import { DOCK_CSS } from '../src/client/style.ts'

describe('output dock chrome', () => {
  it('uses the conversation header baseline for the desktop tab row', () => {
    expect(DOCK_CSS).toMatch(/\.dsh-od-header\s*\{[\s\S]*?min-height: 61px;/)
    expect(DOCK_CSS).toMatch(/\.dsh-od-header\s*\{[\s\S]*?border-bottom: 1\.5px solid/)
  })

  it('keeps the session catalog to seven visible rows before scrolling', () => {
    expect(DOCK_CSS).toMatch(/\.dsh-od-catalog\s*\{[\s\S]*?max-height: min\(332px, 50vh\);/)
  })

  it('keeps structured data controls visible while large tables scroll', () => {
    expect(DOCK_CSS).toContain('.dsh-od-data-toolbar')
    expect(DOCK_CSS).toMatch(/\.dsh-od-data-table thead[\s\S]*position: sticky/)
    expect(DOCK_CSS).toContain('.dsh-od-column-resize')
  })

  it('contains oversized media inside a pannable preview stage', () => {
    expect(DOCK_CSS).toContain('.dsh-od-media-toolbar')
    expect(DOCK_CSS).toMatch(/\.dsh-od-media-stage[\s\S]*overflow: auto/)
    expect(DOCK_CSS).toContain(".dsh-od-media-stage[data-checker]")
  })
})
