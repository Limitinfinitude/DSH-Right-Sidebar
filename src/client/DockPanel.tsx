/** Native details-column output viewer and its inactive edge launcher. */
import {
  Check, Clipboard, Download, EyeOff, Files, FolderOpen, Link,
  PanelRightClose, Pin, PinOff, RotateCcw, X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { ISessions, SessionFace } from '@deepseek-ai/dsh-client-runtime/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { basename } from './collect.ts'
import type { OutputDockSnapshot, OutputEntry } from './contract.ts'
import { EMPTY_OUTPUT_DOCK_SNAPSHOT } from './contract.ts'
import {
  EMPTY_SESSION_PERSISTED, loadDockState, saveDockState,
  type PersistedState, type SessionPersistedState,
} from './dock-persistence.ts'
import type { NS, OutputDockKey } from './locales.ts'
import { Preview } from './preview.tsx'
import type { QcResult } from './qc.ts'
import { mergeQcResult } from './qc-state.ts'
import { fileUrl } from './resources.ts'
import {
  directoryOfPath, orderedTabs, reconcileSelection, reorderTab, shouldAutoOpen, visibleTabs,
} from './sidebar-state.ts'
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

const OUTPUT_SURFACE = 'output-dock'

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

type SharedInject = {
  sessions: ISessions
  layout: OutputDockLayout
  openPath(path: string): void
}
type PanelProps = PropsRuntime<'details.overlay'> & PropsLocale<typeof NS> & InjectFace<SharedInject>
type LauncherProps = PropsRuntime<'shell.overlay'> & PropsLocale<typeof NS> & InjectFace<SharedInject>
type SurfaceProps = Pick<PanelProps, 'layout' | 'sessions' | 't' | 'useSessions' | 'openPath'>

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
  const sessionId = props.useSessions(state => state.current)
  const session = sessionId === undefined ? undefined : sessions.binding(sessionId)?.session
  const snapshot = useDockSnapshot(session)
  const surface = useDetailsSurface(layout)
  const [persisted, setPersisted] = useState<PersistedState>(() => loadDockState(localStorage))
  const [draggedPath, setDraggedPath] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [qcByPath, setQcByPath] = useState<ReadonlyMap<string, QcResult>>(new Map())
  const [copied, setCopied] = useState<'path' | 'content' | null>(null)
  const selectedRef = useRef<string | null>(null)
  const seenSeqRef = useRef(0)

  const pinned = useMemo(() => new Set(persisted.pinned), [persisted.pinned])
  const hidden = useMemo(() => new Set(persisted.hidden), [persisted.hidden])
  const sessionState = sessionId === undefined
    ? EMPTY_SESSION_PERSISTED
    : persisted.sessions[sessionId] ?? EMPTY_SESSION_PERSISTED
  const closedAt = useMemo(
    () => new Map(Object.entries(sessionState.closedAt)),
    [sessionState.closedAt],
  )
  const automaticOrder = useMemo(
    () => visibleTabs(snapshot.entries, hidden, pinned, closedAt),
    [closedAt, hidden, pinned, snapshot.entries],
  )
  const visible = useMemo(
    () => orderedTabs(automaticOrder, sessionState.order),
    [automaticOrder, sessionState.order],
  )

  useEffect(() => {
    saveDockState(localStorage, persisted)
  }, [persisted])

  const updateSessionState = (update: (state: SessionPersistedState) => SessionPersistedState): void => {
    if (sessionId === undefined) return
    setPersisted(previous => ({
      ...previous,
      sessions: {
        ...previous.sessions,
        [sessionId]: update(previous.sessions[sessionId] ?? EMPTY_SESSION_PERSISTED),
      },
    }))
  }

  useEffect(() => {
    const next = reconcileSelection(visible, selectedRef.current, seenSeqRef.current)
    selectedRef.current = next.path
    seenSeqRef.current = next.seenSeq
    setSelectedPath(next.path)
    const selectedNewOutput = visible.find(entry => entry.path === next.path)
    if (next.hasNewOutput && selectedNewOutput !== undefined && shouldAutoOpen(selectedNewOutput)) {
      layout.openDetails(OUTPUT_SURFACE)
    }
  }, [layout, visible])

  const selected = visible.find(entry => entry.path === selectedPath) ?? null
  const hiddenCount = hidden.size

  const select = (path: string): void => {
    selectedRef.current = path
    setSelectedPath(path)
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
  const closeTab = (entry: OutputEntry): void => {
    updateSessionState(previous => ({
      ...previous,
      closedAt: { ...previous.closedAt, [entry.path]: entry.lastSeq },
    }))
  }
  const dropTab = (targetPath: string, sourcePath: string | null): void => {
    if (sourcePath === null || sourcePath === '') return
    const order = reorderTab(visible.map(entry => entry.path), sourcePath, targetPath)
    updateSessionState(previous => ({ ...previous, order }))
    setDraggedPath(null)
  }

  if (surface !== OUTPUT_SURFACE) return null

  return (
    <section className="dsh-od-panel" aria-label={t('dock.title')}>
      <header className="dsh-od-header">
        <div className="dsh-od-tabs" role="tablist" aria-label={t('dock.chooseFile')}>
          {visible.map(entry => (
            <div
              className="dsh-od-tab-wrap"
              data-active={entry.path === selectedPath || undefined}
              data-dragging={entry.path === draggedPath || undefined}
              key={entry.path}
              title={entry.path}
              onDragOver={(event) => {
                event.preventDefault()
                event.dataTransfer.dropEffect = 'move'
              }}
              onDrop={(event) => {
                event.preventDefault()
                dropTab(entry.path, draggedPath ?? event.dataTransfer.getData('text/plain'))
              }}
              onDragEnd={() => { setDraggedPath(null) }}
            >
              <button
                type="button"
                role="tab"
                aria-selected={entry.path === selectedPath}
                className="dsh-od-tab"
                draggable
                onClick={() => { select(entry.path) }}
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = 'move'
                  event.dataTransfer.setData('text/plain', entry.path)
                  setDraggedPath(entry.path)
                }}
              >
                <span>{basename(entry.path)}</span>
              </button>
              <button
                type="button"
                className="dsh-od-tab-close"
                aria-label={t('dock.closeTab', { name: basename(entry.path) })}
                title={t('dock.closeTab', { name: basename(entry.path) })}
                onClick={() => { closeTab(entry) }}
              >
                <X size={13} aria-hidden />
              </button>
            </div>
          ))}
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
              <div className="dsh-od-toolbar">
                <IconButton label={copied === 'path' ? t('dock.copied') : t('dock.copyPath')} onClick={() => { void copy(selected.path, 'path') }}>
                  {copied === 'path' ? <Check size={16} aria-hidden /> : <Link size={16} aria-hidden />}
                </IconButton>
                <IconButton
                  label={copied === 'content' ? t('dock.copied') : t('dock.copyContent')}
                  onClick={() => { void copyContent(selected) }}
                  disabled={selected.kind === 'image' || selected.kind === 'pdf'}
                >
                  {copied === 'content' ? <Check size={16} aria-hidden /> : <Clipboard size={16} aria-hidden />}
                </IconButton>
                <IconButton label={t('dock.reveal')} onClick={() => { props.openPath(directoryOfPath(selected.path)) }}>
                  <FolderOpen size={16} aria-hidden />
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
      {snapshot.entries.length > 0 && <span>{snapshot.entries.length}</span>}
    </button>
  )
}

export type { OutputDockKey }
