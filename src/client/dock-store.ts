export interface SessionDockState {
  readonly open: boolean
  readonly opened: readonly string[]
  readonly active: string | null
}

export interface OutputDockUiStore {
  get(sessionId: string): SessionDockState
  subscribe(sessionId: string, listener: () => void): () => void
  open(sessionId: string, key: string): void
  activate(sessionId: string, key: string): void
  closeTab(sessionId: string, key: string): void
  collapse(sessionId: string): void
  restore(sessionId: string): void
  reconcile(sessionId: string, localKeys: ReadonlySet<string>): void
  removeSession(sessionId: string): void
}

const STORAGE_KEY = 'dsh-output-dock:v3'
const EMPTY_STATE: SessionDockState = { open: false, opened: [], active: null }

function isSessionState(value: unknown): value is SessionDockState {
  if (typeof value !== 'object' || value === null) return false
  const state = value as Record<string, unknown>
  return typeof state.open === 'boolean'
    && Array.isArray(state.opened)
    && state.opened.every(key => typeof key === 'string')
    && (state.active === null || typeof state.active === 'string')
}

function hydrate(storage: Storage): Readonly<Record<string, SessionDockState>> {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (raw === null) return {}
    const value = JSON.parse(raw) as unknown
    if (typeof value !== 'object' || value === null) return {}
    const root = value as Record<string, unknown>
    if (root.version !== 3 || typeof root.sessions !== 'object' || root.sessions === null) return {}
    const sessions: Record<string, SessionDockState> = {}
    for (const [sessionId, state] of Object.entries(root.sessions)) {
      if (isSessionState(state)) {
        const opened = [...new Set(state.opened)]
        const active = state.active !== null && opened.includes(state.active) ? state.active : opened.at(-1) ?? null
        sessions[sessionId] = { open: state.open && opened.length > 0, opened, active }
      }
    }
    return sessions
  } catch {
    return {}
  }
}

export function createOutputDockUiStore(storage: Storage): OutputDockUiStore {
  let sessions = hydrate(storage)
  const listeners = new Map<string, Set<() => void>>()

  const write = (sessionId: string, next: SessionDockState | null): void => {
    const previous = sessions[sessionId]
    if (next === null && previous === undefined) return
    if (next !== null && previous === next) return
    const changed = { ...sessions }
    if (next === null) delete changed[sessionId]
    else changed[sessionId] = next
    sessions = changed
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify({ version: 3, sessions }))
    } catch {
      // Persistence failure must not break the live dock.
    }
    for (const listener of listeners.get(sessionId) ?? []) listener()
  }

  const get = (sessionId: string): SessionDockState => sessions[sessionId] ?? EMPTY_STATE

  return {
    get,
    subscribe(sessionId, listener) {
      const owned = listeners.get(sessionId) ?? new Set()
      owned.add(listener)
      listeners.set(sessionId, owned)
      return () => {
        owned.delete(listener)
        if (owned.size === 0) listeners.delete(sessionId)
      }
    },
    open(sessionId, key) {
      const previous = get(sessionId)
      const opened = previous.opened.includes(key) ? previous.opened : [...previous.opened, key]
      write(sessionId, { open: true, opened, active: key })
    },
    activate(sessionId, key) {
      const previous = get(sessionId)
      if (!previous.opened.includes(key)) return
      write(sessionId, { ...previous, open: true, active: key })
    },
    closeTab(sessionId, key) {
      const previous = get(sessionId)
      const index = previous.opened.indexOf(key)
      if (index < 0) return
      const opened = previous.opened.filter(openedKey => openedKey !== key)
      if (opened.length === 0) {
        write(sessionId, { open: false, opened: [], active: null })
        return
      }
      const active = previous.active === key
        ? opened[index] ?? opened[index - 1] ?? null
        : previous.active
      write(sessionId, { ...previous, opened, active })
    },
    collapse(sessionId) {
      const previous = get(sessionId)
      if (!previous.open) return
      write(sessionId, { ...previous, open: false })
    },
    restore(sessionId) {
      const previous = get(sessionId)
      if (previous.open || previous.opened.length === 0) return
      write(sessionId, { ...previous, open: true })
    },
    reconcile(sessionId, localKeys) {
      const previous = get(sessionId)
      const opened = previous.opened.filter(key => localKeys.has(key))
      if (opened.length === previous.opened.length) return
      const active = previous.active !== null && opened.includes(previous.active)
        ? previous.active
        : opened.at(-1) ?? null
      write(sessionId, { open: previous.open && opened.length > 0, opened, active })
    },
    removeSession(sessionId) {
      write(sessionId, null)
    },
  }
}
