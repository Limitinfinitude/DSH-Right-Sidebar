import { describe, expect, it } from 'vitest'
import {
  mentionedConditionalOutputs, mentionedOutputPaths, outputDisposition, shouldPublishOutput,
} from '../src/client/output-policy.ts'

describe('output product policy', () => {
  it.each([
    'report.md', 'deck.pdf', 'diagram.svg', 'preview.png', 'photo.webp',
    'https://files.example.com/releases/deck.pdf?token=short-lived',
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

  it('extracts output paths from links, inline code, and plain assistant text', () => {
    expect(mentionedOutputPaths([
      '报告见 [report](out/report.md)。',
      '图片保存在 `D:\\exports\\hero image.png`。',
      '表格是 results.csv。',
      '参考 https://example.com/remote.pdf。',
    ].join('\n'))).toEqual([
      'out/report.md',
      'D:\\exports\\hero image.png',
      'results.csv',
    ])
  })

  it('extracts supported file URLs from Markdown links and bare assistant text', () => {
    expect(mentionedOutputPaths([
      '在线报告：[report](https://files.example.com/build/report.pdf?download=1)。',
      '图片：https://cdn.example.com/output/chart.png?v=7',
      '网页：https://example.com/dashboard',
    ].join('\n'))).toEqual([
      'https://files.example.com/build/report.pdf?download=1',
      'https://cdn.example.com/output/chart.png?v=7',
    ])
  })

  it('strips Markdown decoration and prefers the most specific spelling of one path', () => {
    expect(mentionedOutputPaths([
      '**只保留简历.md**',
      '**results.csv**',
      '输出文件为简历_pymupdf.md。',
      '`out/report.md`',
      '`D:\\workspace\\out\\report.md`',
    ].join('\n'))).toEqual([
      'results.csv',
      'D:\\workspace\\out\\report.md',
    ])
  })

  it('does not infer a basename fragment from a Unicode filename in a Markdown table', () => {
    expect(mentionedOutputPaths([
      '**输出文件：`D:\\DS_workspace\\pdf-inspector-node-demo\\简历_pymupdf.md`**',
      '',
      '| | pdf-inspector 版 (简历.md) | PyMuPDF 版 (简历_pymupdf.md) |',
      '|---|---|---|',
    ].join('\n'))).toEqual([
      'D:\\DS_workspace\\pdf-inspector-node-demo\\简历_pymupdf.md',
    ])
  })
})
