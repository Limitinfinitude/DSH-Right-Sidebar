// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { renderedHtmlToMarkdown } from '../src/client/markdown-edit.ts'

describe('rendered HTML Markdown editing', () => {
  it('converts common rendered Markdown elements back to Markdown', () => {
    expect(renderedHtmlToMarkdown([
      '<h1>Release notes</h1>',
      '<p>A <strong>focused</strong> sidebar with <a href="https://example.com">details</a>.</p>',
      '<ul><li>Fast</li><li>Quiet</li></ul>',
      '<pre><code class="language-ts">const dock = true;</code></pre>',
    ].join(''))).toBe([
      '# Release notes',
      '',
      'A **focused** sidebar with [details](https://example.com).',
      '',
      '- Fast',
      '- Quiet',
      '',
      '```ts',
      'const dock = true;',
      '```',
    ].join('\n'))
  })

  it('preserves a rendered table and normalizes editable line breaks', () => {
    expect(renderedHtmlToMarkdown([
      '<p>First line<br>Second line</p>',
      '<table><thead><tr><th>Name</th><th>State</th></tr></thead>',
      '<tbody><tr><td>Output Dock</td><td>Ready</td></tr></tbody></table>',
    ].join(''))).toBe([
      'First line  ',
      'Second line',
      '',
      '| Name | State |',
      '| --- | --- |',
      '| Output Dock | Ready |',
    ].join('\n'))
  })
})
