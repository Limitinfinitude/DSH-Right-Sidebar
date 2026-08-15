/**
 * Convert the controlled subset of HTML emitted by `marked` back to Markdown.
 * Keeping this local avoids loading a generic HTML conversion library merely
 * for the inline editor.
 */
function text(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? ''
  if (!(node instanceof Element)) return ''

  const children = Array.from(node.childNodes).map(text).join('')
  switch (node.localName) {
    case 'strong':
    case 'b': return `**${children}**`
    case 'em':
    case 'i': return `*${children}*`
    case 'del':
    case 's': return `~~${children}~~`
    case 'code': return `\`${children}\``
    case 'br': return '  \n'
    case 'a': {
      const href = node.getAttribute('href') ?? ''
      return href === '' ? children : `[${children}](${href})`
    }
    case 'img': {
      const src = node.getAttribute('src') ?? ''
      const alt = node.getAttribute('alt') ?? ''
      return src === '' ? '' : `![${alt}](${src})`
    }
    default: return children
  }
}

function table(node: Element): string {
  const rows = Array.from(node.querySelectorAll('tr')).map(row => Array.from(row.children)
    .map(cell => text(cell).replaceAll('|', '\\|').trim()))
  if (rows.length === 0) return ''
  const [header, ...body] = rows
  if (header.length === 0) return ''
  const format = (cells: string[]): string => `| ${header.map((_, index) => cells[index] ?? '').join(' | ')} |`
  return [format(header), `| ${header.map(() => '---').join(' | ')} |`, ...body.map(format)].join('\n')
}

function list(node: Element, depth = 0): string {
  const ordered = node.localName === 'ol'
  return Array.from(node.children).filter(child => child.localName === 'li').map((item, index) => {
    const nested = Array.from(item.children).filter(child => child.localName === 'ul' || child.localName === 'ol')
    const contents = Array.from(item.childNodes).filter(child => !(child instanceof Element && (child.localName === 'ul' || child.localName === 'ol')))
      .map(text).join('').trim()
    const prefix = ordered ? `${index + 1}. ` : '- '
    const nestedText = nested.map(child => list(child, depth + 1)).filter(Boolean).join('\n')
    const indent = '  '.repeat(depth)
    return `${indent}${prefix}${contents}${nestedText === '' ? '' : `\n${nestedText}`}`
  }).join('\n')
}

function block(node: Node): string {
  if (!(node instanceof Element)) return text(node).trim()
  const tag = node.localName
  if (/^h[1-6]$/.test(tag)) return `${'#'.repeat(Number(tag[1]))} ${text(node).trim()}`
  if (tag === 'pre') {
    const code = node.querySelector('code')
    const source = (code?.textContent ?? node.textContent ?? '').replace(/\n$/, '')
    const language = /(?:^|\s)language-([^\s]+)/.exec(code?.className ?? '')?.[1] ?? ''
    return `\`\`\`${language}\n${source}\n\`\`\``
  }
  if (tag === 'ul' || tag === 'ol') return list(node)
  if (tag === 'table') return table(node)
  if (tag === 'blockquote') return text(node).trim().split('\n').map(line => `> ${line}`).join('\n')
  if (tag === 'hr') return '---'
  return text(node).trim()
}

/** Convert sanitized, rendered Markdown HTML to a persistable Markdown string. */
export function renderedHtmlToMarkdown(html: string): string {
  const body = new DOMParser().parseFromString(html, 'text/html').body
  return Array.from(body.childNodes).map(block).filter(Boolean).join('\n\n').replace(/\n{3,}/g, '\n\n').trim()
}
