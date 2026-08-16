// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { adjustZoom, svgIntrinsicSize } from '../src/client/media-preview.ts'

describe('media preview zoom', () => {
  it('enters a useful zoom level from fit mode and clamps extremes', () => {
    expect(adjustZoom('fit', 1)).toBe(1.25)
    expect(adjustZoom('fit', -1)).toBe(0.8)
    expect(adjustZoom(4, 1)).toBe(4)
    expect(adjustZoom(0.25, -1)).toBe(0.25)
  })
})

describe('SVG intrinsic dimensions', () => {
  it('prefers viewBox dimensions and falls back to numeric width and height', () => {
    expect(svgIntrinsicSize('<svg viewBox="0 0 800 400"></svg>')).toEqual({ width: 800, height: 400 })
    expect(svgIntrinsicSize('<svg width="320px" height="180"></svg>')).toEqual({ width: 320, height: 180 })
    expect(svgIntrinsicSize('<svg width="100%" height="auto"></svg>')).toBeNull()
  })
})
