import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { RotateCw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { OutputKind, PublishedOutput } from './contract.ts'
import { fileUrl, prepareHtml, prepareHtmlFragment, prepareSvg } from './resources.ts'

export type PreviewEntry = PublishedOutput & {
  readonly kind: 'document' | 'visual'
  readonly path: string
  readonly previewKind: OutputKind
}

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
}

function sanitizeSvg(source: string): string {
  return DOMPurify.sanitize(source, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['style'],
    ADD_ATTR: ['fill', 'stroke', 'viewBox'],
  })
}

type TextPreviewState =
  | { readonly status: 'idle' | 'loading'; readonly content: '' }
  | { readonly status: 'ready'; readonly content: string }
  | { readonly status: 'error'; readonly content: '' }

function isTextBacked(entry: PreviewEntry): boolean {
  return entry.previewKind === 'md'
    || entry.previewKind === 'svg'
    || entry.previewKind === 'html'
    || entry.previewKind === 'text'
}

function useTextPreview(entry: PreviewEntry): TextPreviewState {
  const [state, setState] = useState<TextPreviewState>({ status: 'idle', content: '' })
  useEffect(() => {
    if (!isTextBacked(entry)) {
      setState({ status: 'idle', content: '' })
      return
    }
    let stale = false
    setState({ status: 'loading', content: '' })
    void fetch(fileUrl(entry.path, entry.revision))
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status))
        return response.text()
      })
      .then(text => { if (!stale) setState({ status: 'ready', content: text }) })
      .catch(() => { if (!stale) setState({ status: 'error', content: '' }) })
    return () => { stale = true }
  }, [entry.path, entry.previewKind, entry.revision])
  return state
}

function MarkdownPreview({ entry, content }: { entry: PreviewEntry; content: string }): React.JSX.Element {
  const html = useMemo(() => prepareHtmlFragment(
    entry.path,
    sanitizeHtml(marked.parse(content, { async: false }) as string),
    entry.revision,
  ), [content, entry.path, entry.revision])
  return <div className="dsh-od-preview-md" dangerouslySetInnerHTML={{ __html: html }} />
}

function SvgPreview({ entry, content }: { entry: PreviewEntry; content: string }): React.JSX.Element {
  const safe = useMemo(
    () => prepareSvg(entry.path, sanitizeSvg(content), entry.revision),
    [content, entry.path, entry.revision],
  )
  return <div className="dsh-od-svg-stage" dangerouslySetInnerHTML={{ __html: safe }} />
}

function HtmlPreview({ entry, content }: { entry: PreviewEntry; content: string }): React.JSX.Element {
  const document = useMemo(
    () => prepareHtml(entry.path, content, entry.revision),
    [content, entry.path, entry.revision],
  )
  return <iframe className="dsh-od-preview-frame" sandbox="" srcDoc={document} title={entry.label} />
}

function TextPreview({ content }: { content: string }): React.JSX.Element {
  return <pre className="dsh-od-preview-text"><code>{content}</code></pre>
}

export interface PreviewLabels {
  readonly loading: string
  readonly unavailable: string
  readonly empty: string
  readonly retry: string
}

function Unavailable({ labels, onRefresh }: {
  readonly labels: PreviewLabels
  readonly onRefresh: () => void
}): React.JSX.Element {
  return (
    <div className="dsh-od-preview-state" data-state="error">
      <span>{labels.unavailable}</span>
      <button type="button" className="dsh-od-text-btn" onClick={onRefresh}>
        <RotateCw size={14} aria-hidden />{labels.retry}
      </button>
    </div>
  )
}

export function Preview({ entry, labels, onRefresh }: {
  readonly entry: PreviewEntry
  readonly labels: PreviewLabels
  readonly onRefresh: () => void
}): React.JSX.Element {
  const state = useTextPreview(entry)
  const [binaryFailed, setBinaryFailed] = useState(false)

  if (state.status === 'error' || binaryFailed) return <Unavailable labels={labels} onRefresh={onRefresh} />
  if (isTextBacked(entry) && state.status !== 'ready') {
    return <div className="dsh-od-preview-state" data-state="loading">{labels.loading}</div>
  }
  if (state.status === 'ready' && state.content === '') {
    return <div className="dsh-od-preview-state">{labels.empty}</div>
  }

  switch (entry.previewKind) {
    case 'md': return <MarkdownPreview entry={entry} content={state.status === 'ready' ? state.content : ''} />
    case 'svg': return <SvgPreview entry={entry} content={state.status === 'ready' ? state.content : ''} />
    case 'html': return <HtmlPreview entry={entry} content={state.status === 'ready' ? state.content : ''} />
    case 'text': return <TextPreview content={state.status === 'ready' ? state.content : ''} />
    case 'image':
      return (
        <img
          className="dsh-od-preview-img"
          src={fileUrl(entry.path, entry.revision)}
          alt={entry.label}
          onError={() => { setBinaryFailed(true) }}
        />
      )
    case 'pdf':
      return (
        <iframe
          className="dsh-od-preview-frame dsh-od-preview-pdf"
          src={fileUrl(entry.path, entry.revision)}
          title={entry.label}
          onError={() => { setBinaryFailed(true) }}
        />
      )
  }
}
