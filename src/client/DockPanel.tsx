/** Native details-column output viewer and its inactive edge launcher. */
import {
  AlertTriangle, Check, ChevronDown, Copy, Download, EyeOff, Files,
  LoaderCircle, PanelRightClose, Pin, PinOff, RotateCcw,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { ISessions, SessionFace } from '@deepseek-ai/dsh-client-runtime/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { basename } from './collect.ts'
import type { OutputDockSnapshot, OutputEntry } from './contract.ts'
import { EMPTY_OUTPUT_DOCK_SNAPSHOT } from './contract.ts'
import type { NS, OutputDockKey } from './locales.ts'
import { Preview } from './preview.tsx'
import type { QcIssue, QcResult } from './qc.ts'
import { QC_LOADING } from './qc.ts'
import { mergeQcResult } from './qc-state.ts'
import { fileUrl } from './resources.ts'
import { reconcileSelection } from './sidebar-state.ts'
import {
  dockRenderTarget, getCompactViewport, subscribeCompactViewport,
} from './viewport.ts'

export interface OutputDockLayout {
  openDetails(surface?: string): void
  closeDetails(): void
  getDetailsSurface(): string | null
  subscribeDetailsSurface(listener: () => void): () => void
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    layout: OutputDockLayout
  }
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'details.overlay': { kind: 'list'; scope: 'session' }
    'shell.overlay': { kind: 'list'; scope: 'root' }
  }
}

interface PersistedState {
  readonly pinned: readonly string[]
  readonly hidden: readonly string[]
}

const OUTPUT_SURFACE = 'output-dock'
const PERSIST_KEY = 'dsh-output-dock:v2'
const EMPTY_PERSISTED: PersistedState = { pinned: [], hidden: [] }

function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (raw === null) return EMPTY_PERSISTED
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      pinned: Array.isArray(parsed.pinned) ? parsed.pinned.filter(x => typeof x === 'string') : [],
      hidden: Array.isArray(parsed.hidden) ? parsed.hidden.filter(x => typeof x === 'string') : [],
    }
  } catch {
    return EMPTY_PERSISTED
  }
}

/** Subscribe to just the output view snapshot of one session. */
function useDockSnapshot(session: SessionFace | undefined): OutputDockSnapshot {
  const subscribe = useCallback((onChange: () => void) => {
    if (session === undefined) return () => {}
    let last = session.getSnapshot().views.get('outputDock')
    return session.subscribe(() => {
      const next = session.getSnapshot().views.get('outputDock')
      if (next !== last) {
        last = next
        onChange()
      }
    })
  }, [session])
  const getSnapshot = useCallback(
    () => session?.getSnapshot().views.get('outputDock') ?? EMPTY_OUTPUT_DOCK_SNAPSHOT,
    [session],
  )
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

function useDetailsSurface(layout: OutputDockLayout): string | null {
  const subscribe = useCallback(
    (onChange: () => void) => layout.subscribeDetailsSurface(onChange),
    [layout],
  )
  const getSnapshot = useCallback(() => layout.getDetailsSurface(), [layout])
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

function useCompactViewport(): boolean {
  return useSyncExternalStore(subscribeCompactViewport, getCompactViewport, () => false)
}

type SharedInject = { sessions: ISessions; layout: OutputDockLayout }
type PanelProps = PropsRuntime<'details.overlay'> & PropsLocale<typeof NS> & InjectFace<SharedInject>
type LauncherProps = PropsRuntime<'shell.overlay'> & PropsLocale<typeof NS> & InjectFace<SharedInject>
type SurfaceProps = Pick<PanelProps, 'layout' | 'sessions' | 't' | 'useSessions'>

function issueText(t: PanelProps['t'], issue: QcIssue): string {
  switch (issue.code) {
    case 'md-broken-link': return t('qc.brokenLink', { count: String(issue.count ?? 0) })
    case 'md-unbalanced-fence': return t('qc.unbalancedFence')
    case 'svg-parse': return t('qc.svgParse')
    case 'svg-no-viewbox': return t('qc.svgNoViewBox')
    case 'svg-sanitized': return t('qc.svgSanitized')
    case 'image-failed': return t('qc.imageFailed')
    case 'html-parse': return t('qc.htmlParse', { count: String(issue.count ?? 0) })
    case 'file-read': return t('qc.fileRead')
  }
}

function QcSummary({ result, t }: { result: QcResult; t: PanelProps['t'] }): React.JSX.Element {
  if (result.level === 'loading') {
    return <div className="dsh-od-qc" data-level="loading"><LoaderCircle size={14} aria-hidden />{t('qc.loading')}</div>
  }
  if (result.level === 'ok') {
    return <div className="dsh-od-qc" data-level="ok"><Check size={14} aria-hidden />{t('qc.ok')}</div>
  }
  return (
    <div className="dsh-od-qc" data-level={result.level}>
      <AlertTriangle size={14} aria-hidden />
      <span>{result.issues.map(issue => issueText(t, issue)).join(' · ')}</span>
    </div>
  )
}

function currentSession(props: SurfaceProps): SessionFace | undefined {
  const current = props.useSessions(state => state.current)
  return current === undefined ? undefined : props.sessions.binding(current)?.session
}

function IconButton(props: {
  readonly label: string
  readonly onClick: () => void
  readonly active?: boolean
  readonly disabled?: boolean
  readonly children: React.ReactNode
}): React.JSX.Element {
  return (
    <button
      type="button"
      className="dsh-od-icon-btn"
      data-active={props.active || undefined}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props.label}
      title={props.label}
    >
      {props.children}
    </button>
  )
}

function OutputDockSurface(props: SurfaceProps): React.JSX.Element | null {
  const { layout, sessions, t } = props
  const snapshot = useDockSnapshot(currentSession(props))
  const surface = useDetailsSurface(layout)
  const [persisted, setPersisted] = useState<PersistedState>(loadPersisted)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [fileMenuOpen, setFileMenuOpen] = useState(false)
  const [qcByPath, setQcByPath] = useState<ReadonlyMap<string, QcResult>>(new Map())
  const [copied, setCopied] = useState<'path' | 'content' | null>(null)
  const selectedRef = useRef<string | null>(null)
  const seenSeqRef = useRef(0)

  const pinned = useMemo(() => new Set(persisted.pinned), [persisted.pinned])
  const hidden = useMemo(() => new Set(persisted.hidden), [persisted.hidden])
  const visible = useMemo(() => snapshot.entries
    .filter(entry => !hidden.has(entry.path))
    .sort((left, right) =>
      Number(pinned.has(right.path)) - Number(pinned.has(left.path))
      || right.lastSeq - left.lastSeq), [hidden, pinned, snapshot.entries])

  useEffect(() => {
    localStorage.setItem(PERSIST_KEY, JSON.stringify(persisted))
  }, [persisted])

  useEffect(() => {
    const next = reconcileSelection(visible, selectedRef.current, seenSeqRef.current)
    selectedRef.current = next.path
    seenSeqRef.current = next.seenSeq
    setSelectedPath(next.path)
    if (next.hasNewOutput) layout.openDetails(OUTPUT_SURFACE)
  }, [layout, visible])

  const selected = visible.find(entry => entry.path === selectedPath) ?? null
  const qc = selected === null ? QC_LOADING : qcByPath.get(selected.path) ?? QC_LOADING
  const hiddenCount = hidden.size

  const select = (path: string): void => {
    selectedRef.current = path
    setSelectedPath(path)
    setFileMenuOpen(false)
  }
  const setQc = useCallback((path: string, result: QcResult) => {
    setQcByPath(previous => mergeQcResult(previous, path, result))
  }, [])
  const onPreviewResult = useCallback((result: QcResult) => {
    if (selectedPath !== null) setQc(selectedPath, result)
  }, [selectedPath, setQc])
  const copy = async (text: string, kind: 'path' | 'content'): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      window.setTimeout(() => { setCopied(current => current === kind ? null : current) }, 1500)
    } catch {
      // Clipboard access is optional; the preview remains usable without it.
    }
  }
  const copyContent = async (entry: OutputEntry): Promise<void> => {
    try {
      const response = await fetch(fileUrl(entry.path))
      if (!response.ok) return
      await copy(await response.text(), 'content')
    } catch {
      // Reading is best-effort and already has a visible preview error state.
    }
  }
  const download = (entry: OutputEntry): void => {
    const anchor = document.createElement('a')
    anchor.href = fileUrl(entry.path)
    anchor.download = basename(entry.path)
    anchor.click()
  }
  const togglePin = (path: string): void => {
    setPersisted(previous => ({
      ...previous,
      pinned: previous.pinned.includes(path)
        ? previous.pinned.filter(item => item !== path)
        : [...previous.pinned, path],
    }))
  }
  const hide = (path: string): void => {
    setPersisted(previous => ({ ...previous, hidden: [...new Set([...previous.hidden, path])] }))
  }
  const clearHidden = (): void => {
    setPersisted(previous => ({ ...previous, hidden: [] }))
  }

  if (surface !== OUTPUT_SURFACE) return null

  return (
    <section className="dsh-od-panel" aria-label={t('dock.title')}>
      <header className="dsh-od-header">
        <div className="dsh-od-heading">
          <Files size={16} aria-hidden />
          <span>{t('dock.title')}</span>
          <span className="dsh-od-count">{snapshot.entries.length}</span>
        </div>
        <IconButton label={t('dock.collapse')} onClick={() => { layout.closeDetails() }}>
          <PanelRightClose size={16} aria-hidden />
        </IconButton>
      </header>

      {selected === null
        ? (
          <div className="dsh-od-empty">
            <Files size={28} aria-hidden />
            <p>{snapshot.entries.length === 0 ? t('dock.empty') : t('dock.allHidden')}</p>
            {hiddenCount > 0 && (
              <button type="button" className="dsh-od-text-btn" onClick={clearHidden}>
                <RotateCcw size={14} aria-hidden />{t('dock.clearHidden')}
              </button>
            )}
          </div>
        )
        : (
          <>
            <div className="dsh-od-filebar">
              <button
                type="button"
                className="dsh-od-file-picker"
                onClick={() => { setFileMenuOpen(open => !open) }}
                aria-expanded={fileMenuOpen}
                aria-haspopup="listbox"
              >
                <span className={`dsh-od-kind dsh-od-kind-${selected.kind}`}>{selected.kind}</span>
                <span className="dsh-od-file-copy">
                  <span className="dsh-od-file-name">{basename(selected.path)}</span>
                  <span className="dsh-od-file-path" title={selected.path}>{selected.path}</span>
                </span>
                <ChevronDown size={15} aria-hidden />
              </button>
              {fileMenuOpen && (
                <div className="dsh-od-file-menu" role="listbox" aria-label={t('dock.chooseFile')}>
                  {visible.map(entry => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={entry.path === selected.path}
                      className="dsh-od-file-option"
                      key={entry.path}
                      onClick={() => { select(entry.path) }}
                    >
                      <span className={`dsh-od-kind dsh-od-kind-${entry.kind}`}>{entry.kind}</span>
                      <span className="dsh-od-option-copy">
                        <span>{basename(entry.path)}</span>
                        <small>{t('dock.turn', { turn: String(entry.lastTurn) })}</small>
                      </span>
                      {pinned.has(entry.path) && <Pin size={13} aria-label={t('dock.pin')} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="dsh-od-preview-canvas">
              <Preview
                key={selected.path}
                entry={selected}
                onResult={onPreviewResult}
                labels={{
                  loading: t('preview.loading'),
                  error: t('preview.error'),
                  empty: t('preview.empty'),
                }}
              />
            </div>

            <footer className="dsh-od-footer">
              <QcSummary result={qc} t={t} />
              <div className="dsh-od-toolbar">
                <IconButton label={copied === 'path' ? t('dock.copied') : t('dock.copyPath')} onClick={() => { void copy(selected.path, 'path') }}>
                  {copied === 'path' ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                </IconButton>
                <IconButton
                  label={copied === 'content' ? t('dock.copied') : t('dock.copyContent')}
                  onClick={() => { void copyContent(selected) }}
                  disabled={selected.kind === 'image' || selected.kind === 'pdf'}
                >
                  {copied === 'content' ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                </IconButton>
                <IconButton label={t('dock.download')} onClick={() => { download(selected) }}>
                  <Download size={16} aria-hidden />
                </IconButton>
                <IconButton
                  label={pinned.has(selected.path) ? t('dock.unpin') : t('dock.pin')}
                  active={pinned.has(selected.path)}
                  onClick={() => { togglePin(selected.path) }}
                >
                  {pinned.has(selected.path) ? <PinOff size={16} aria-hidden /> : <Pin size={16} aria-hidden />}
                </IconButton>
                <IconButton label={t('dock.hide')} onClick={() => { hide(selected.path) }}>
                  <EyeOff size={16} aria-hidden />
                </IconButton>
              </div>
            </footer>
          </>
        )}
    </section>
  )
}

export function OutputDockPanel(props: PanelProps): React.JSX.Element | null {
  const target = dockRenderTarget(useCompactViewport())
  if (target !== 'details') return null
  return <OutputDockSurface {...props} />
}

export function OutputDockLauncher(props: LauncherProps): React.JSX.Element | null {
  const target = dockRenderTarget(useCompactViewport())
  const session = currentSession(props)
  const snapshot = useDockSnapshot(session)
  const surface = useDetailsSurface(props.layout)
  if (session === undefined || snapshot.entries.length === 0) return null
  if (surface === OUTPUT_SURFACE) {
    return target === 'mobile'
      ? <div className="dsh-od-mobile-shell"><OutputDockSurface {...props} /></div>
      : null
  }
  return (
    <button
      type="button"
      className="dsh-od-launcher"
      onClick={() => { props.layout.openDetails(OUTPUT_SURFACE) }}
      aria-label={props.t('dock.expand')}
      title={props.t('dock.expand')}
    >
      <Files size={17} aria-hidden />
      <span>{snapshot.entries.length}</span>
    </button>
  )
}

export type { OutputDockKey }
