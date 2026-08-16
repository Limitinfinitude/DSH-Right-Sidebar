// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MediaPreview, type MediaPreviewLabels } from '../src/client/MediaPreview.tsx'

const labels: MediaPreviewLabels = {
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  fit: 'Fit',
  actualSize: 'Actual size',
  transparency: 'Transparency background',
  dimensions: (width, height) => `${width} × ${height}`,
}

afterEach(cleanup)

describe('SVG media preview', () => {
  it('shows dimensions and exposes zoom and background controls', () => {
    render(<MediaPreview kind="svg" source='<svg viewBox="0 0 800 400"><rect width="800" height="400" /></svg>'
      alt="diagram.svg" labels={labels} onLoad={() => {}} onError={() => {}} />)

    expect(screen.getByText('800 × 400')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Actual size' }))
    expect(screen.getByText('100%')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(screen.getByText('125%')).toBeTruthy()
    const background = screen.getByRole('button', { name: 'Transparency background' })
    fireEvent.click(background)
    expect(background.getAttribute('aria-pressed')).toBe('true')
  })
})
