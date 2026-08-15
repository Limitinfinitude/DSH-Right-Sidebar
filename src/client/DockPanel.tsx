import { Check, Copy, Download, Files, PanelRightClose, RotateCw, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type { ISessions, SessionFace } from '@deepseek-ai/dsh-client-runtime/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { EMPTY_OUTPUT_DOCK_SNAPSHOT, type OutputDockSnapshot } from './contract.ts'
import type { OutputDockUiStore, SessionDockState } from './dock-store.ts'
import type { NS, OutputDockKey } from './locales.ts'
import { Preview, type PreviewEntry } from './preview.tsx'
import { fileUrl } from './resources.ts'
import { dockRenderTarget, getCompactViewport, subscribeCompactViewport } from './viewport.ts'

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

export const OUTPUT_SURFACE = 'output-dock'

export interface DockTabsModel {
  readonly tabs: readonly PreviewEntry[]
  readonly active: PreviewEntry | null
}

function isPreviewEntry(entry: OutputDockSnapshot['entries'][number]): entry is PreviewEntry {
  return entry.kind !== 'link'
    && typeof entry.path === 'string'
    && entry.previewKind !== null
}

export function dockTabs(state: SessionDockState, snapshot: OutputDockSnapshot): DockTabsModel {
  const local = new Map(snapshot.entries.filter(isPreviewEntry).map(entry => [entry.key, entry]))
  const tabs = state.opened.flatMap((key) => {
    const entry = local.get(key)
    return entry === undefined ? [] : [entry]
  })
  return {
    tabs,
    active: state.active === null ? null : tabs.find(tab => tab.key === state.active) ?? null,
  }
}

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

function useDockState(store: OutputDockUiStore, sessionId: string): SessionDockState {
  const subscribe = useCallback(
    (onChange: () => void) => store.subscribe(sessionId, onChange),
    [sessionId, store],
  )
  const getSnapshot = useCallback(() => store.get(sessionId), [sessionId, store])
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

interface SharedInject {
  readonly sessions: ISessions
  readonly layout: OutputDockLayout
  readonly dockStore: OutputDockUiStore
}

type PanelProps = PropsRuntime<'details.overlay'> & PropsLocale<typeof NS> & InjectFace<SharedInject>
type LauncherProps = PropsRuntime<'shell.overlay'> & PropsLocale<typeof NS> & InjectFace<SharedInject>
type SurfaceProps = Pick<PanelProps, 'sessions' | 'layout' | 'dockStore' | 't' | 'useSessions'>

function currentSession(props: SurfaceProps): { readonly id: string; readonly session: SessionFace } | null {
  const current = props.useSessions(state => state.current)
  if (current === undefined) return null
  const session = props.sessions.binding(current)?.session
  return session === undefined ? null : { id: String(current), session }
}

function IconButton(props: {
  readonly label: string
  readonly onClick: () => void
  readonly children: React.ReactNode
}): React.JSX.Element {
  return (
    <button
      type="button"
      className="dsh-od-icon-btn"
      onClick={props.onClick}
      aria-label={props.label}
      title={props.label}
    >
      {props.children}
    </button>
  )
}

function basename(path: string): string {
  const at = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'))
  return at < 0 ? path : path.slice(at + 1)
}

function OutputDockSurface(props: SurfaceProps): React.JSX.Element | null {
  const current = currentSession(props)
  const snapshot = useDockSnapshot(current?.session)
  const state = useDockState(props.dockStore, current?.id ?? '')
  const surface = useDetailsSurface(props.layout)
  const model = useMemo(() => dockTabs(state, snapshot), [snapshot, state])
  const [refreshByKey, setRefreshByKey] = useState<ReadonlyMap<string, number>>(new Map())
  const [copied, setCopied] = useState(false)
  const active = model.active

  const refresh = useCallback(() => {
    if (active === null) return
    setRefreshByKey(previous => {
      const next = new Map(previous)
      next.set(active.key, (previous.get(active.key) ?? 0) + 1)
      return next
    })
  }, [active])

  const close = useCallback((key: string) => {
    const final = state.opened.length === 1 && state.opened[0] === key
    props.dockStore.closeTab(current?.id ?? '', key)
    if (final) props.layout.closeDetails()
  }, [current?.id, props.dockStore, props.layout, state.opened])

  if (current === null || surface !== OUTPUT_SURFACE || !state.open || active === null) return null
  const manualRefresh = refreshByKey.get(active.key) ?? 0

  const copyPath = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(active.path)
      setCopied(true)
      window.setTimeout(() => { setCopied(false) }, 1400)
    } catch {
      // Clipboard access is optional.
    }
  }

  const download = (): void => {
    const anchor = document.createElement('a')
    anchor.href = fileUrl(active.path, active.revision)
    anchor.download = basename(active.path)
    anchor.click()
  }

  return (
    <section className="dsh-od-panel" aria-label={props.t('dock.title')}>
      <header className="dsh-od-header">
        <span className="dsh-od-title">{props.t('dock.title')}</span>
        <div className="dsh-od-tabs" role="tablist" aria-label={props.t('dock.tabs')}>
          {model.tabs.map(tab => (
            <div className="dsh-od-tab-wrap" key={tab.key} data-active={tab.key === active.key || undefined}>
              <button
                type="button"
                role="tab"
                aria-selected={tab.key === active.key}
                title={`${tab.workTitle} · ${tab.label}`}
                onClick={() => { props.dockStore.activate(current.id, tab.key) }}
              >
                {tab.workTitle} · {tab.label}
              </button>
              <button
                type="button"
                className="dsh-od-tab-close"
                aria-label={props.t('dock.closeTab', { name: tab.label })}
                title={props.t('dock.closeTab', { name: tab.label })}
                onClick={() => { close(tab.key) }}
              >
                <X size={13} aria-hidden />
              </button>
            </div>
          ))}
        </div>
        <IconButton
          label={props.t('dock.collapse')}
          onClick={() => {
            props.dockStore.collapse(current.id)
            props.layout.closeDetails()
          }}
        >
          <PanelRightClose size={16} aria-hidden />
        </IconButton>
      </header>

      <div className="dsh-od-resource-bar">
        <span className="dsh-od-resource-name">{active.label}</span>
        <span className="dsh-od-resource-path" title={active.path}>{active.path}</span>
      </div>

      <div className="dsh-od-preview-canvas">
        <Preview
          key={`${active.key}:${active.revision}:${manualRefresh}`}
          entry={active}
          onRefresh={refresh}
          labels={{
            loading: props.t('preview.loading'),
            unavailable: props.t('preview.unavailable'),
            empty: props.t('preview.empty'),
            retry: props.t('preview.retry'),
          }}
        />
      </div>

      <footer className="dsh-od-toolbar">
        <IconButton label={props.t('dock.refresh')} onClick={refresh}>
          <RotateCw size={16} aria-hidden />
        </IconButton>
        <IconButton label={copied ? props.t('dock.copied') : props.t('dock.copyPath')} onClick={() => { void copyPath() }}>
          {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
        </IconButton>
        <IconButton label={props.t('dock.download')} onClick={download}>
          <Download size={16} aria-hidden />
        </IconButton>
        <IconButton label={props.t('dock.close')} onClick={() => { close(active.key) }}>
          <X size={16} aria-hidden />
        </IconButton>
      </footer>
    </section>
  )
}

export function OutputDockPanel(props: PanelProps): React.JSX.Element | null {
  if (dockRenderTarget(useCompactViewport()) !== 'details') return null
  return <OutputDockSurface {...props} />
}

export function OutputDockLauncher(props: LauncherProps): React.JSX.Element | null {
  const target = dockRenderTarget(useCompactViewport())
  const current = currentSession(props)
  const sessionIds = props.useSessions(state => state.ids)
  const snapshot = useDockSnapshot(current?.session)
  const state = useDockState(props.dockStore, current?.id ?? '')
  const surface = useDetailsSurface(props.layout)
  const localKeys = useMemo(
    () => new Set(snapshot.entries.filter(isPreviewEntry).map(entry => entry.key)),
    [snapshot.entries],
  )

  useEffect(() => {
    if (current !== null) props.dockStore.reconcile(current.id, localKeys)
  }, [current?.id, localKeys, props.dockStore])

  useEffect(() => {
    props.dockStore.noteSessions(sessionIds.map(String))
  }, [props.dockStore, sessionIds])

  useEffect(() => {
    if (current === null) return
    const restored = props.dockStore.get(current.id)
    if (!restored.open || restored.opened.length === 0) return
    queueMicrotask(() => { props.layout.openDetails(OUTPUT_SURFACE) })
  }, [current?.id, props.dockStore, props.layout])

  useEffect(() => {
    if (surface === OUTPUT_SURFACE && state.opened.length === 0) props.layout.closeDetails()
  }, [props.layout, state.opened.length, surface])

  if (current === null || state.opened.length === 0) return null
  if (surface === OUTPUT_SURFACE && state.open) {
    return target === 'mobile'
      ? <div className="dsh-od-mobile-shell"><OutputDockSurface {...props} /></div>
      : null
  }
  return (
    <button
      type="button"
      className="dsh-od-launcher"
      onClick={() => {
        props.dockStore.restore(current.id)
        props.layout.openDetails(OUTPUT_SURFACE)
      }}
      aria-label={props.t('dock.expand')}
      title={props.t('dock.expand')}
    >
      <Files size={17} aria-hidden />
      <span>{state.opened.length}</span>
    </button>
  )
}

export type { OutputDockKey }
