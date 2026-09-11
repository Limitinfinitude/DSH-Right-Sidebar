import { describe, expect, it } from 'vitest'
import { kindOfPath, outputExtension, OUTPUT_FORMATS } from '../src/formats.ts'
import { outputDisposition } from '../src/client/output-policy.ts'

describe('output format table', () => {
  it.each([
    ['report.md', 'md'],
    ['report.markdown', 'md'],
    ['clip.mp4', 'video'],
    ['clip.webm', 'video'],
    ['clip.mov', 'video'],
    ['voice.mp3', 'audio'],
    ['voice.wav', 'audio'],
    ['voice.m4a', 'audio'],
    ['voice.ogg', 'audio'],
    ['favicon.ico', 'image'],
    ['scan.tiff', 'image'],
    ['notebook.ipynb', 'text'],
  ])('maps %s to the %s preview kind', (path, kind) => {
    expect(kindOfPath(path)).toBe(kind)
  })

  it('keeps every documented extension in the allowlist the file route serves', () => {
    expect(Object.keys(OUTPUT_FORMATS)).toEqual(expect.arrayContaining([
      'mp4', 'webm', 'ogv', 'm4v', 'mov',
      'mp3', 'wav', 'ogg', 'oga', 'opus', 'm4a', 'flac', 'aac',
      'ico', 'tif', 'tiff', 'jfif', 'markdown', 'ipynb',
    ]))
  })

  it('reads extensions without URL query noise', () => {
    expect(outputExtension('https://host/report.pdf?download=1')).toBe('pdf')
  })
})

describe('output disposition for media and notebooks', () => {
  it.each(['clip.mp4', 'clip.m4v', 'clip.webm', 'clip.ogv', 'clip.mov'])(
    'publishes %s automatically',
    (path) => { expect(outputDisposition(path)).toBe('automatic') },
  )

  it.each(['voice.mp3', 'voice.wav', 'voice.ogg', 'voice.flac', 'voice.aac'])(
    'publishes %s automatically',
    (path) => { expect(outputDisposition(path)).toBe('automatic') },
  )

  it('publishes notebooks only when the agent names them', () => {
    expect(outputDisposition('analysis.ipynb')).toBe('explicit')
  })

  it('still refuses project internals', () => {
    expect(outputDisposition('src/app.ts')).toBe('never')
    expect(outputDisposition('package-lock.json')).toBe('never')
  })
})
