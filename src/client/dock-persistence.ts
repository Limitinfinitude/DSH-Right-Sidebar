export interface SessionPersistedState {
  readonly closedAt: Readonly<Record<string, number>>
  readonly order: readonly string[]
}

export interface PersistedState {
  readonly pinned: readonly string[]
  readonly hidden: readonly string[]
  readonly width: number
  readonly sessions: Readonly<Record<string, SessionPersistedState>>
}

export const PERSIST_KEY = 'dsh-output-dock:v3'
export const DEFAULT_DOCK_WIDTH = 420
export const MIN_DOCK_WIDTH = 320
export const MAX_DOCK_WIDTH = 860
export const EMPTY_SESSION_PERSISTED: SessionPersistedState = { closedAt: {}, order: [] }
export const EMPTY_PERSISTED: PersistedState = {
  pinned: [],
  hidden: [],
  width: DEFAULT_DOCK_WIDTH,
  sessions: {},
}

/** Keep a dragged width inside the range the sidebar can actually render. */
export function clampDockWidth(width: number): number {
  if (!Number.isFinite(width)) return DEFAULT_DOCK_WIDTH
  return Math.min(MAX_DOCK_WIDTH, Math.max(MIN_DOCK_WIDTH, Math.round(width)))
}

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
      width: clampDockWidth(typeof parsed.width === 'number' ? parsed.width : DEFAULT_DOCK_WIDTH),
      sessions,
    }
  } catch {
    return EMPTY_PERSISTED
  }
}

export function saveDockState(storage: Storage, state: PersistedState): void {
  storage.setItem(PERSIST_KEY, JSON.stringify(state))
}
