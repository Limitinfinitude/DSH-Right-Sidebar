import { describe, expect, it } from 'vitest'
import {
  mentionedConditionalOutputs, outputDisposition, shouldPublishOutput,
} from '../src/client/output-policy.ts'

describe('output product policy', () => {
  it.each([
    'report.md', 'deck.pdf', 'diagram.svg', 'preview.png', 'photo.webp',
  ])('automatically publishes product output %s', path => {
    expect(outputDisposition(path)).toBe('automatic')
  })

  it.each([
    'results.json', 'export.jsonl', 'table.csv', 'rows.tsv', 'summary.txt',
  ])('requires an explicit assistant mention for conditional output %s', path => {
    expect(outputDisposition(path)).toBe('explicit')
  })

  it.each([
    'settings.toml', 'server.conf', 'app.ini', 'config.yaml', 'config.yml',
    'run.log', 'feed.xml', 'index.html', 'src/app.ts', 'package.json', '.env',
  ])('never publishes implementation file %s', path => {
    expect(outputDisposition(path)).toBe('never')
  })

  it('publishes conditional files only when the assistant names them', () => {
    expect(mentionedConditionalOutputs([
      { path: 'out/results.json', seq: 4 },
      { path: 'out/table.csv', seq: 5 },
      { path: 'config/app.toml', seq: 6 },
    ], '分析结果已保存到 `results.json`。')).toEqual([
      { path: 'out/results.json', seq: 4, publication: 'explicit' },
    ])
    expect(shouldPublishOutput('out/table.csv', undefined)).toBe(false)
    expect(shouldPublishOutput('out/table.csv', 'explicit')).toBe(true)
    expect(shouldPublishOutput('config/app.toml', 'explicit')).toBe(false)
  })
})
