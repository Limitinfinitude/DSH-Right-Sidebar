/** Native details-column output viewer and its inactive edge launcher. */
import {
  AlertTriangle, Check, Clipboard, Download, ExternalLink, Eye, EyeOff, Files, FolderOpen,
  Link, List, PanelRightClose, Pin, PinOff, RotateCcw, Search, ShieldCheck, X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { ISessions, SessionFace } from '@deepseek-ai/dsh-client-runtime/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { basename } from './collect.ts'
import { isNetworkOutput } from '../formats.ts'
import type { OutputDockSnapshot, OutputEntry } from './contract.ts'
import { EMPTY_OUTPUT_DOCK_SNAPSHOT } from './contract.ts'
import {
  clampDockWidth, EMPTY_SESSION_PERSISTED, loadDockState, saveDockState,
  type PersistedState, type SessionPersistedState,
} from './dock-persistence.ts'
import type { NS, OutputDockKey } from './locales.ts'
import { Preview, type SaveState } from './preview.tsx'
import type { QcResult } from './qc.ts'
import { mergeQcResult } from './qc-state.ts'
import { qcIssueKey, qcSummaryKey } from './qc-labels.ts'
import { authorizeFileContent, fileUrl, outputFileSize } from './resources.ts'
import { filterByGroup, formatBytes, kindGroup, type OutputGroup } from './output-groups.ts'
import {
  catalogEntries, closedAllAt, directoryOfPath, filterCatalog, groupCatalogByTurn, orderedTabs,
  reconcileSelection, reorderTab, shouldAutoOpen, visibleTabs,
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

const FILTER_KEYS: Readonly<Record<OutputGroup | 'all', OutputDockKey>> = {
  all: 'dock.filterAll',
  doc: 'dock.filterDoc',
  image: 'dock.filterImage',
  data: 'dock.filterData',
  media: 'dock.filterMedia',
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
  const compact = useCompactViewport()
  const [persisted, setPersisted] = useState<PersistedState>(() => loadDockState(localStorage))
  const [draggedPath, setDraggedPath] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [qcByPath, setQcByPath] = useState<ReadonlyMap<string, QcResult>>(new Map())
  const [qcOpen, setQcOpen] = useState(false)
  const [copied, setCopied] = useState<'path' | 'content' | null>(null)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [catalogQuery, setCatalogQuery] = useState('')
  const [catalogGroup, setCatalogGroup] = useState<OutputGroup | 'all'>('all')
  const [hiddenOpen, setHiddenOpen] = useState(false)
  const [sizes, setSizes] = useState<ReadonlyMap<string, {
    readonly seq: number
    readonly bytes: number | null
  }>>(new Map())
  const sizesRef = useRef(sizes)
  const [saveState, setSaveState] = useState<SaveState | null>(null)
  const [resizing, setResizing] = useState(false)
  const [liveWidth, setLiveWidth] = useState<number | null>(null)
  const selectedRef = useRef<string | null>(null)
  const seenSeqRef = useRef(0)
  const liveWidthRef = useRef<number | null>(null)

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
  const catalog = useMemo(
    () => catalogEntries(snapshot.entries, hidden),
    [hidden, snapshot.entries],
  )
  const hiddenEntries = useMemo(
    () => snapshot.entries.filter(entry => hidden.has(entry.path)),
    [hidden, snapshot.entries],
  )
  const grouped = useMemo(() => filterByGroup(catalog, catalogGroup), [catalog, catalogGroup])
  const filtered = useMemo(() => filterCatalog(grouped, catalogQuery), [grouped, catalogQuery])
  const groups = useMemo(() => groupCatalogByTurn(filtered), [filtered])
  const groupCounts = useMemo(() => {
    const counts = new Map<OutputGroup, number>()
    for (const entry of catalog) {
      const key = kindGroup(entry.kind)
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return counts
  }, [catalog])
  const width = liveWidth ?? persisted.width

  useEffect(() => {
    let stale = false
    void Promise.all(snapshot.entries.map(async entry => {
      if (sizesRef.current.get(entry.path)?.seq === entry.lastSeq) return null
      const bytes = await outputFileSize(entry.path)
      return stale ? null : { path: entry.path, seq: entry.lastSeq, bytes }
    })).then(updates => {
      const fresh = updates.filter(update => update !== null)
      if (stale || fresh.length === 0) return
      const next = new Map(sizesRef.current)
      for (const update of fresh) next.set(update.path, { seq: update.seq, bytes: update.bytes })
      sizesRef.current = next
      setSizes(next)
    })
    return () => { stale = true }
  }, [snapshot.entries])

  useEffect(() => {
    saveDockState(localStorage, persisted)
  }, [persisted])

  useEffect(() => {
    if (saveState !== 'saved') return
    const id = window.setTimeout(() => { setSaveState(null) }, 1500)
    return () => { window.clearTimeout(id) }
  }, [saveState])

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
  const qc = selectedPath === null ? undefined : qcByPath.get(selectedPath)

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
  const onSave = useCallback((state: SaveState) => { setSaveState(state) }, [])
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
      const source = await authorizeFileContent(entry.path)
      const response = await fetch(fileUrl(source))
      if (!response.ok) return
      await copy(await response.text(), 'content')
    } catch {
      // Reading is best-effort and already has a visible preview error state.
    }
  }
  const download = async (entry: OutputEntry): Promise<void> => {
    try {
      const source = await authorizeFileContent(entry.path)
      const anchor = document.createElement('a')
      anchor.href = fileUrl(source)
      anchor.download = basename(entry.path)
      anchor.click()
    } catch {
      // The selected preview already exposes authorization and read failures.
    }
  }
  const reveal = (entry: OutputEntry): void => {
    if (isNetworkOutput(entry.path)) {
      window.open(entry.path, '_blank', 'noopener,noreferrer')
      return
    }
    void authorizeFileContent(entry.path)
      .then(source => { props.openPath(directoryOfPath(source)) })
      .catch(() => {})
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
  const unhide = (path: string): void => {
    setPersisted(previous => ({ ...previous, hidden: previous.hidden.filter(item => item !== path) }))
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
  const closeAllTabs = (): void => {
    updateSessionState(previous => ({
      ...previous,
      closedAt: { ...previous.closedAt, ...closedAllAt(visible) },
    }))
  }
  const reopen = (entry: OutputEntry): void => {
    updateSessionState(previous => {
      const { [entry.path]: _closedAt, ...closedAt } = previous.closedAt
      return { ...previous, closedAt }
    })
    select(entry.path)
    setCatalogOpen(false)
  }
  const dropTab = (targetPath: string, sourcePath: string | null): void => {
    if (sourcePath === null || sourcePath === '') return
    const order = reorderTab(visible.map(entry => entry.path), sourcePath, targetPath)
    updateSessionState(previous => ({ ...previous, order }))
    setDraggedPath(null)
  }
  const startResize = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.preventDefault()
    const origin = event.clientX
    const base = persisted.width
    setResizing(true)
    const onMove = (move: MouseEvent): void => {
      const next = clampDockWidth(base + (origin - move.clientX))
      liveWidthRef.current = next
      setLiveWidth(next)
    }
    const onUp = (): void => {
      setResizing(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      const next = liveWidthRef.current
      liveWidthRef.current = null
      setLiveWidth(null)
      if (next !== null) setPersisted(previous => ({ ...previous, width: next }))
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setCatalogOpen(false)
        setQcOpen(false)
        setHiddenOpen(false)
        return
      }
      if (!event.altKey || event.ctrlKey || event.metaKey) return
      if (event.code === 'BracketRight' || event.code === 'BracketLeft') {
        if (visible.length === 0) return
        event.preventDefault()
        const step = event.code === 'BracketRight' ? 1 : -1
        const index = visible.findIndex(entry => entry.path === selectedPath)
        const next = visible[(index + step + visible.length) % visible.length]
        if (next !== undefined) select(next.path)
        return
      }
      if (event.code === 'KeyW') {
        if (selected === null) return
        event.preventDefault()
        closeTab(selected)
        return
      }
      if (event.code === 'KeyO') {
        event.preventDefault()
        if (surface === OUTPUT_SURFACE) layout.closeDetails()
        else layout.openDetails(OUTPUT_SURFACE)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [layout, selected, selectedPath, surface, visible])

  if (surface !== OUTPUT_SURFACE) return null

  return (
    <section
      className="dsh-od-panel"
      aria-label={t('dock.title')}
      style={compact ? undefined : { width }}
    >
      {!compact && (
        <div
          className="dsh-od-resize"
          role="separator"
          aria-label={t('dock.resize')}
          data-active={resizing || undefined}
          onMouseDown={startResize}
        />
      )}
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
          <div className="dsh-od-preview-canvas">
              <Preview
                key={selected.path}
                entry={selected}
                onResult={onPreviewResult}
                onSaveState={onSave}
                labels={{
                  loading: t('preview.loading'),
                  error: t('preview.error'),
                  empty: t('preview.empty'),
                  data: {
                    search: t('preview.search'),
                    raw: t('preview.raw'),
                    structured: t('preview.structured'),
                    wrap: t('preview.wrap'),
                    previous: t('preview.previous'),
                    next: t('preview.next'),
                    page: (page, count) => t('preview.page', { page, count }),
                    rows: count => t('preview.rows', { count }),
                    matches: count => t('preview.matches', { count }),
                    expandAll: t('preview.expandAll'),
                    collapseAll: t('preview.collapseAll'),
                    parseError: t('preview.parseError'),
                    truncated: count => t('preview.truncated', { count }),
                  },
                  media: {
                    zoomIn: t('preview.zoomIn'),
                    zoomOut: t('preview.zoomOut'),
                    fit: t('preview.fit'),
                    actualSize: t('preview.actualSize'),
                    transparency: t('preview.transparency'),
                    dimensions: (width, height) => t('preview.dimensions', { width, height }),
                  },
                  pdf: {
                    refresh: t('preview.refresh'),
                    openExternal: t('preview.openExternal'),
                  },
                  video: {
                    title: t('preview.video'),
                    openExternal: t('preview.openExternal'),
                  },
                  audio: {
                    title: t('preview.audio'),
                    openExternal: t('preview.openExternal'),
                  },
                }}
              />
          </div>
        )}

      <footer className="dsh-od-footer">
        {hiddenOpen && hiddenEntries.length > 0 && (
          <div className="dsh-od-catalog" role="listbox" aria-label={t('dock.clearHidden')}>
            <div className="dsh-od-catalog-group">{t('dock.hiddenCount', { count: hiddenCount })}</div>
            {hiddenEntries.map(entry => (
              <div className="dsh-od-catalog-item" key={entry.path}>
                <span className={`dsh-od-kind dsh-od-kind-${entry.kind}`}>{entry.kind}</span>
                <span className="dsh-od-catalog-copy">
                  <span>{basename(entry.path)}</span>
                  <small>{entry.path}</small>
                </span>
                <IconButton label={t('dock.unhide')} onClick={() => { unhide(entry.path) }}>
                  <Eye size={16} aria-hidden />
                </IconButton>
              </div>
            ))}
            <div className="dsh-od-catalog-foot">
              <button type="button" className="dsh-od-text-btn" onClick={clearHidden}>
                <RotateCcw size={14} aria-hidden />{t('dock.clearHidden')}
              </button>
            </div>
          </div>
        )}
        {qcOpen && qc !== undefined && (
          <div className="dsh-od-qc" aria-live="polite">
            <div className="dsh-od-qc-title">{t('qc.title')}</div>
            <ul className="dsh-od-qc-list">
              {qc.issues.length === 0
                ? <li>{t('qc.ok')}</li>
                : qc.issues.map((issue, index) => (
                  <li key={`${issue.code}:${index}`} data-level={issue.level}>
                    {t(qcIssueKey(issue.code), issue.count === undefined ? undefined : { count: issue.count })}
                  </li>
                ))}
            </ul>
          </div>
        )}
        {catalogOpen && (
          <div className="dsh-od-catalog" role="listbox" aria-label={t('dock.openCatalog')}>
            <div className="dsh-od-catalog-tools">
              <label className="dsh-od-catalog-search">
                <Search size={14} aria-hidden />
                <input
                  type="search"
                  value={catalogQuery}
                  placeholder={t('dock.search')}
                  aria-label={t('dock.search')}
                  onChange={event => { setCatalogQuery(event.target.value) }}
                />
              </label>
              <div className="dsh-od-catalog-filters" role="group" aria-label={t('dock.filter')}>
                {(['all', 'doc', 'image', 'data', 'media'] as const).map(key => (
                  <button
                    type="button"
                    key={key}
                    className="dsh-od-catalog-chip"
                    data-active={catalogGroup === key || undefined}
                    aria-pressed={catalogGroup === key}
                    onClick={() => { setCatalogGroup(key) }}
                  >
                    {t(FILTER_KEYS[key])}
                    {key !== 'all' && (groupCounts.get(key) ?? 0) > 0
                      ? <small>{groupCounts.get(key)}</small>
                      : null}
                  </button>
                ))}
              </div>
            </div>
            {groups.length === 0 && <div className="dsh-od-catalog-group">{t('dock.noMatch')}</div>}
            {groups.map(group => (
              <div role="group" aria-label={t('dock.turn', { turn: group.turn })} key={group.turn}>
                <div className="dsh-od-catalog-group">{t('dock.turn', { turn: group.turn })}</div>
                {group.entries.map(entry => {
                  const size = sizes.get(entry.path)
                  const sizeText = size?.bytes === undefined || size.bytes === null
                    ? '' : ` · ${formatBytes(size.bytes)}`
                  return (
                    <button
                      type="button"
                      className="dsh-od-catalog-item"
                      role="option"
                      aria-selected={entry.path === selectedPath}
                      key={entry.path}
                      onClick={() => { reopen(entry) }}
                      title={entry.path}
                    >
                      <span className={`dsh-od-kind dsh-od-kind-${entry.kind}`}>{entry.kind}</span>
                      <span className="dsh-od-catalog-copy">
                        <span>{basename(entry.path)}</span>
                        <small>{entry.path}{sizeText}</small>
                      </span>
                    </button>
                  )
                })}
              </div>
            ))}
            {visible.length > 0 && (
              <div className="dsh-od-catalog-foot">
                <button type="button" className="dsh-od-text-btn" onClick={closeAllTabs}>
                  <X size={14} aria-hidden />{t('dock.closeAll')}
                </button>
              </div>
            )}
          </div>
        )}
        <div className="dsh-od-toolbar">
          <IconButton label={t('dock.openCatalog')} active={catalogOpen} onClick={() => { setCatalogOpen(current => !current) }}>
            <List size={16} aria-hidden />
          </IconButton>
          {hiddenCount > 0 && (
            <IconButton
              label={t('dock.hiddenCount', { count: hiddenCount })}
              active={hiddenOpen}
              onClick={() => { setHiddenOpen(current => !current) }}
            >
              <EyeOff size={16} aria-hidden />
            </IconButton>
          )}
          {qc !== undefined && qc.level !== 'loading' && (
            <IconButton
              label={qc.issues.length === 0
                ? t('qc.ok')
                : t(qcSummaryKey(qc) ?? 'qc.ok', qc.issues[0]?.count === undefined
                  ? undefined
                  : { count: qc.issues[0]?.count })}
              active={qcOpen}
              onClick={() => { setQcOpen(current => !current) }}
            >
              {qc.level === 'ok'
                ? <ShieldCheck size={16} aria-hidden />
                : <AlertTriangle size={16} aria-hidden />}
            </IconButton>
          )}
          {saveState === 'saving' && (
            <span className="dsh-od-status">{t('dock.saving')}</span>
          )}
          {saveState === 'saved' && (
            <span className="dsh-od-status" data-state="ok">
              <Check size={12} aria-hidden />{t('dock.saved')}
            </span>
          )}
          {saveState === 'error' && (
            <span className="dsh-od-status" data-state="error">{t('dock.saveError')}</span>
          )}
          {selected !== null && (
            <div className="dsh-od-toolbar-actions">
                <IconButton label={copied === 'path' ? t('dock.copied') : t('dock.copyPath')} onClick={() => { void copy(selected.path, 'path') }}>
                  {copied === 'path' ? <Check size={16} aria-hidden /> : <Link size={16} aria-hidden />}
                </IconButton>
                <IconButton
                  label={copied === 'content' ? t('dock.copied') : t('dock.copyContent')}
                  onClick={() => { void copyContent(selected) }}
                  disabled={selected.kind === 'image' || selected.kind === 'pdf'
                    || selected.kind === 'video' || selected.kind === 'audio'}
                >
                  {copied === 'content' ? <Check size={16} aria-hidden /> : <Clipboard size={16} aria-hidden />}
                </IconButton>
                <IconButton label={isNetworkOutput(selected.path) ? t('preview.openExternal') : t('dock.reveal')}
                  onClick={() => { reveal(selected) }}>
                  {isNetworkOutput(selected.path)
                    ? <ExternalLink size={16} aria-hidden />
                    : <FolderOpen size={16} aria-hidden />}
                </IconButton>
                <IconButton label={t('dock.download')} onClick={() => { void download(selected) }}>
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
          )}
        </div>
      </footer>
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
