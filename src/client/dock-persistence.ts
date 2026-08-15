export interface SessionPersistedState {
  readonly closedAt: Readonly<Record<string, number>>
  readonly order: readonly string[]
}

export interface PersistedState {
  readonly pinned: readonly string[]
  readonly hidden: readonly string[]
  readonly sessions: Readonly<Record<string, SessionPersistedState>>
}

export const PERSIST_KEY = 'dsh-output-dock:v3'
export const EMPTY_SESSION_PERSISTED: SessionPersistedState = { closedAt: {}, order: [] }
export const EMPTY_PERSISTED: PersistedState = { pinned: [], hidden: [], sessions: {} }

export function loadDockState(storage: Storage): PersistedState {
  try {
    const raw = storage.getItem(PERSIST_KEY)
    if (raw === null) return EMPTY_PERSISTED
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    const sessions: Record<string, SessionPersistedState> = {}
    if (parsed.sessions !== null && typeof parsed.sessions === 'object') {
      for (const [id, candidate] of Object.entries(parsed.sessions)) {
        if (candidate === null || typeof candidate !== 'object') continue
        const value = candidate as Partial<SessionPersistedState>
        const closedAt: Record<string, number> = {}
        if (value.closedAt !== null && typeof value.closedAt === 'object') {
          for (const [path, seq] of Object.entries(value.closedAt)) {
            if (typeof seq === 'number' && Number.isFinite(seq)) closedAt[path] = seq
          }
        }
        sessions[id] = {
          closedAt,
          order: Array.isArray(value.order) ? value.order.filter(x => typeof x === 'string') : [],
        }
      }
    }
    return {
      pinned: Array.isArray(parsed.pinned) ? parsed.pinned.filter(x => typeof x === 'string') : [],
      hidden: Array.isArray(parsed.hidden) ? parsed.hidden.filter(x => typeof x === 'string') : [],
      sessions,
    }
  } catch {
    return EMPTY_PERSISTED
  }
}

export function saveDockState(storage: Storage, state: PersistedState): void {
  storage.setItem(PERSIST_KEY, JSON.stringify(state))
}
