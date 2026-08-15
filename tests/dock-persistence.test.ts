import { beforeEach, describe, expect, it } from 'vitest'
import { EMPTY_PERSISTED, loadDockState, saveDockState } from '../src/client/dock-persistence.ts'

let storage: Storage

beforeEach(() => {
  const values = new Map<string, string>()
  storage = {
    get length() { return values.size },
    clear: () => { values.clear() },
    getItem: key => values.get(key) ?? null,
    key: index => [...values.keys()][index] ?? null,
    removeItem: key => { values.delete(key) },
    setItem: (key, value) => { values.set(key, value) },
  }
})

describe('output dock persistence', () => {
  it('restores closed tabs and manual order for each session after reload', () => {
    const state = {
      ...EMPTY_PERSISTED,
      sessions: {
        alpha: { closedAt: { 'report.md': 9 }, order: ['diagram.svg', 'report.md'] },
      },
    }
    saveDockState(storage, state)
    expect(loadDockState(storage).sessions.alpha).toEqual(state.sessions.alpha)
  })

  it('starts clean when persisted data is absent or malformed', () => {
    expect(loadDockState(storage)).toEqual(EMPTY_PERSISTED)
    storage.setItem('dsh-output-dock:v3', '{broken')
    expect(loadDockState(storage)).toEqual(EMPTY_PERSISTED)
  })
})
