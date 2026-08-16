/**
 * Inline preview renderers. Content bytes arrive through the plugin's own
 * file route; every HTML-ish surface is sanitized before insertion (svg via
 * a DOMPurify svg profile, html inside a sandboxed iframe, markdown through
 * DOMPurify on rendered output).
 */
import DOMPurify from 'dompurify'
import { ExternalLink, RefreshCw } from 'lucide-react'
import { marked } from 'marked'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { OutputEntry } from './contract.ts'
import { DataFilePreview, type DataPreviewLabels } from './DataFilePreview.tsx'
import { MediaPreview, type MediaPreviewLabels } from './MediaPreview.tsx'
import { renderedHtmlToMarkdown } from './markdown-edit.ts'
import { checkHtml, checkMarkdown, checkSvg, QC_LOADING, type QcResult } from './qc.ts'
import {
  authorizeFileContent, fileUrl, prepareHtml, prepareHtmlFragment, prepareSvg, saveFileContent,
} from './resources.ts'

/** Sanitize Markdown-rendered HTML. */
function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
}

/** Sanitize an SVG document for inline embedding. */
function sanitizeSvg(source: string): string {
  return DOMPurify.sanitize(source, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['style'],
    ADD_ATTR: ['fill', 'stroke', 'viewBox'],
  })
}

/** Text-backed previews (md/svg/html) fetch once per expansion. */
type TextPreviewState =
  | { readonly status: 'idle' | 'loading'; readonly content: '' }
  | { readonly status: 'ready'; readonly content: string }
  | { readonly status: 'error'; readonly content: '' }

function isTextBacked(entry: OutputEntry): boolean {
  return entry.kind === 'md' || entry.kind === 'svg' || entry.kind === 'html'
    || entry.kind === 'text' || entry.kind === 'code'
}

type FileAccessState = 'loading' | 'ready' | 'error'

function useFileAccess(entry: OutputEntry): FileAccessState {
  const [state, setState] = useState<FileAccessState>('loading')
  useEffect(() => {
    let stale = false
    setState('loading')
    void authorizeFileContent(entry.path)
      .then(() => { if (!stale) setState('ready') })
      .catch(() => { if (!stale) setState('error') })
    return () => { stale = true }
  }, [entry.path])
  return state
}

/** Text-backed previews refetch whenever the producing event sequence changes. */
function useTextPreview(entry: OutputEntry, access: FileAccessState): TextPreviewState {
  const [state, setState] = useState<TextPreviewState>({ status: 'idle', content: '' })
  useEffect(() => {
    if (!isTextBacked(entry) || access !== 'ready') {
      setState({ status: 'idle', content: '' })
      return
    }
    let stale = false
    setState({ status: 'loading', content: '' })
    void fetch(fileUrl(entry.path, entry.lastSeq))
      .then(async response => {
        if (!response.ok) throw new Error(String(response.status))
        return response.text()
      })
      .then(text => { if (!stale) setState({ status: 'ready', content: text }) })
      .catch(() => { if (!stale) setState({ status: 'error', content: '' }) })
    return () => { stale = true }
  }, [access, entry.kind, entry.lastSeq, entry.path])
  return state
}

export function MarkdownPreview({ entry, content }: { entry: OutputEntry; content: string }): React.JSX.Element {
  const html = useMemo(() => prepareHtmlFragment(
    entry.path,
    sanitizeHtml(marked.parse(content, { async: false }) as string),
  ), [content, entry.path])
  const latest = useRef(content)
  const timer = useRef<number | null>(null)
  useEffect(() => {
    latest.current = content
  }, [content])
  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
  }, [])
  const onInput = (event: React.FormEvent<HTMLDivElement>): void => {
    const markdown = renderedHtmlToMarkdown(DOMPurify.sanitize(event.currentTarget.innerHTML, {
      USE_PROFILES: { html: true },
    }))
    if (markdown === latest.current) return
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      void saveFileContent(entry.path, markdown).then(() => { latest.current = markdown }).catch(() => {})
    }, 700)
  }
  return (
    <div className="dsh-od-preview-md" contentEditable suppressContentEditableWarning
      onInput={onInput} dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export function SvgPreview({ entry, content, labels }: {
  entry: OutputEntry
  content: string
  labels: MediaPreviewLabels
}): React.JSX.Element {
  const safe = useMemo(() => prepareSvg(entry.path, sanitizeSvg(content)), [content, entry.path])
  return <MediaPreview kind="svg" source={safe} alt={entry.path} labels={labels}
    onLoad={() => {}} onError={() => {}} />
}

export function ImagePreview({ entry, onResult, labels }: {
  entry: OutputEntry
  onResult: (result: QcResult) => void
  labels: MediaPreviewLabels
}): React.JSX.Element {
  const src = fileUrl(entry.path, entry.lastSeq)
  return (
    <MediaPreview kind="image" source={src} alt={entry.path} labels={labels}
      onLoad={() => { onResult({ level: 'ok', issues: [] }) }}
      onError={() => { onResult({ level: 'error', issues: [{ level: 'error', code: 'image-failed' }] }) }}
    />
  )
}

export function HtmlPreview({ entry, content }: { entry: OutputEntry; content: string }): React.JSX.Element {
  // sandbox="" blocks scripts, same-origin reads, and top-navigation escapes.
  const document = useMemo(() => prepareHtml(entry.path, content), [content, entry.path])
  return <iframe className="dsh-od-preview-frame" sandbox="" srcDoc={document} title={entry.path} />
}

function codeLanguage(path: string): string {
  const extension = path.slice(path.lastIndexOf('.') + 1).toLowerCase()
  const labels: Record<string, string> = {
    js: 'JavaScript', jsx: 'JSX', ts: 'TypeScript', tsx: 'TSX', css: 'CSS', scss: 'SCSS',
    less: 'Less', py: 'Python', sh: 'Shell', ps1: 'PowerShell', sql: 'SQL', go: 'Go',
    rs: 'Rust', java: 'Java', c: 'C', h: 'C Header', cpp: 'C++', hpp: 'C++ Header',
    vue: 'Vue', svelte: 'Svelte',
  }
  return labels[extension] ?? extension.toUpperCase()
}

export function CodePreview({ entry, content }: { entry: OutputEntry; content: string }): React.JSX.Element {
  const lines = content.split('\n')
  return (
    <section className="dsh-od-code-preview" aria-label={codeLanguage(entry.path)}>
      <div className="dsh-od-code-language">{codeLanguage(entry.path)}</div>
      <ol className="dsh-od-code-lines">
        {lines.map((line, index) => <li key={`${index}:${line}`}><code>{line || ' '}</code></li>)}
      </ol>
    </section>
  )
}

export function PdfPreview({ entry, onResult, labels }: {
  entry: OutputEntry
  onResult: (result: QcResult) => void
  labels: { readonly refresh: string; readonly openExternal: string }
}): React.JSX.Element {
  const [revision, setRevision] = useState(0)
  const src = `${fileUrl(entry.path, entry.lastSeq)}&view=${revision}`
  return (
    <section className="dsh-od-pdf-preview">
      <div className="dsh-od-media-toolbar">
        <span className="dsh-od-media-meta">PDF</span>
        <div className="dsh-od-data-actions">
          <button type="button" className="dsh-od-data-button" aria-label={labels.refresh}
            title={labels.refresh} onClick={() => { setRevision(current => current + 1) }}>
            <RefreshCw size={15} aria-hidden />
          </button>
          <button type="button" className="dsh-od-data-button" aria-label={labels.openExternal}
            title={labels.openExternal}
            onClick={() => { window.open(src, '_blank', 'noopener,noreferrer') }}>
            <ExternalLink size={15} aria-hidden />
          </button>
        </div>
      </div>
      <iframe className="dsh-od-preview-frame dsh-od-preview-pdf" src={src} title={entry.path}
        onLoad={() => { onResult({ level: 'ok', issues: [] }) }}
        onError={() => { onResult({ level: 'error', issues: [{ level: 'error', code: 'file-read' }] }) }} />
    </section>
  )
}

export interface PreviewLabels {
  readonly loading: string
  readonly error: string
  readonly empty: string
  readonly data: DataPreviewLabels
  readonly media: MediaPreviewLabels
  readonly pdf: { readonly refresh: string; readonly openExternal: string }
}

export function Preview({ entry, onResult, labels }: {
  entry: OutputEntry
  onResult: (result: QcResult) => void
  labels: PreviewLabels
}): React.JSX.Element {
  const access = useFileAccess(entry)
  const state = useTextPreview(entry, access)

  useEffect(() => {
    if (!isTextBacked(entry)) return
    if (state.status === 'error') {
      onResult({ level: 'error', issues: [{ level: 'error', code: 'file-read' }] })
      return
    }
    if (state.status !== 'ready') {
      onResult(QC_LOADING)
      return
    }
    let stale = false
    const run = async (): Promise<void> => {
      const result = entry.kind === 'md'
        ? await checkMarkdown(entry.path, state.content)
        : entry.kind === 'svg'
          ? await checkSvg(state.content)
          : entry.kind === 'html'
            ? await checkHtml(state.content)
            : { level: 'ok', issues: [] } as const
      if (!stale) onResult(result)
    }
    void run()
    return () => { stale = true }
  }, [entry, onResult, state])

  if (access === 'error' || state.status === 'error') {
    return <div className="dsh-od-preview-state" data-state="error">{labels.error}</div>
  }
  if (access !== 'ready' || (isTextBacked(entry) && state.status !== 'ready')) {
    return <div className="dsh-od-preview-state" data-state="loading">{labels.loading}</div>
  }
  if (state.status === 'ready' && state.content === '') {
    return <div className="dsh-od-preview-state">{labels.empty}</div>
  }
  switch (entry.kind) {
    case 'md':
      return <MarkdownPreview entry={entry} content={state.status === 'ready' ? state.content : ''} />
    case 'svg':
      return <SvgPreview entry={entry} content={state.status === 'ready' ? state.content : ''}
        labels={labels.media} />
    case 'html':
      return <HtmlPreview entry={entry} content={state.status === 'ready' ? state.content : ''} />
    case 'image':
      return <ImagePreview entry={entry} onResult={onResult} labels={labels.media} />
    case 'pdf':
      return <PdfPreview entry={entry} onResult={onResult} labels={labels.pdf} />
    case 'text':
      return <DataFilePreview path={entry.path}
        content={state.status === 'ready' ? state.content : ''} labels={labels.data} />
    case 'code':
      return <CodePreview entry={entry} content={state.status === 'ready' ? state.content : ''} />
  }
}
