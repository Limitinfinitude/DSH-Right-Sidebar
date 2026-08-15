import { describe, expect, it, vi } from 'vitest'
import { createOutputDockUiStore } from '../src/client/dock-store.ts'

function memoryStorage(seed: Record<string, string> = {}): Storage {
  const values = new Map(Object.entries(seed))
  return {
    get length() { return values.size },
    clear: () => values.clear(),
    getItem: key => values.get(key) ?? null,
    key: index => [...values.keys()][index] ?? null,
    removeItem: key => { values.delete(key) },
    setItem: (key, value) => { values.set(key, value) },
  }
}

describe('output dock UI store', () => {
  it('keeps open tabs and focus isolated by session', () => {
    const store = createOutputDockUiStore(memoryStorage())
    store.open('session-a', 'sales\u0000dashboard')
    store.open('session-a', 'marketing\u0000visual')
    store.open('session-b', 'ops\u0000report')
    store.collapse('session-b')

    expect(store.get('session-a')).toEqual({
      open: true,
      opened: ['sales\u0000dashboard', 'marketing\u0000visual'],
      active: 'marketing\u0000visual',
    })
    expect(store.get('session-b')).toEqual({
      open: false,
      opened: ['ops\u0000report'],
      active: 'ops\u0000report',
    })
  })

  it('reconciles removed or link-converted publications', () => {
    const store = createOutputDockUiStore(memoryStorage())
    store.open('s1', 'a\u0000one')
    store.open('s1', 'a\u0000two')
    store.reconcile('s1', new Set(['a\u0000one']))
    expect(store.get('s1')).toEqual({ open: true, opened: ['a\u0000one'], active: 'a\u0000one' })
  })

  it('selects the right neighbor, then left, and collapses after the final close', () => {
    const store = createOutputDockUiStore(memoryStorage())
    store.open('s1', 'a')
    store.open('s1', 'b')
    store.open('s1', 'c')
    store.activate('s1', 'b')
    store.closeTab('s1', 'b')
    expect(store.get('s1')).toMatchObject({ opened: ['a', 'c'], active: 'c', open: true })
    store.closeTab('s1', 'c')
    expect(store.get('s1')).toMatchObject({ opened: ['a'], active: 'a', open: true })
    store.closeTab('s1', 'a')
    expect(store.get('s1')).toEqual({ opened: [], active: null, open: false })
  })

  it('hydrates version 3, ignores old versions, and removes sessions', () => {
    const storage = memoryStorage({
      'dsh-output-dock:v3': JSON.stringify({
        version: 3,
        sessions: { persisted: { open: false, opened: ['one'], active: 'one' } },
      }),
    })
    const store = createOutputDockUiStore(storage)
    expect(store.get('persisted')).toEqual({ open: false, opened: ['one'], active: 'one' })
    store.removeSession('persisted')
    expect(store.get('persisted')).toEqual({ open: false, opened: [], active: null })

    const old = createOutputDockUiStore(memoryStorage({
      'dsh-output-dock:v3': JSON.stringify({ version: 2, sessions: { stale: { open: true, opened: ['x'], active: 'x' } } }),
    }))
    expect(old.get('stale')).toEqual({ open: false, opened: [], active: null })
  })

  it('notifies only listeners for the changed session', () => {
    const store = createOutputDockUiStore(memoryStorage())
    const a = vi.fn()
    const b = vi.fn()
    store.subscribe('a', a)
    store.subscribe('b', b)
    store.open('a', 'one')
    expect(a).toHaveBeenCalledOnce()
    expect(b).not.toHaveBeenCalled()
  })

  it('removes only a session that was previously observed and then deleted', () => {
    const store = createOutputDockUiStore(memoryStorage())
    store.open('s1', 'a\u0000one')
    store.noteSessions(['s1', 's2'])
    store.noteSessions(['s2'])
    expect(store.get('s1')).toEqual({ open: false, opened: [], active: null })
    expect(store.get('s2')).toEqual({ open: false, opened: [], active: null })
  })

  it('does not prune persisted state during initial catalog population', () => {
    const storage = memoryStorage({
      'dsh-output-dock:v3': JSON.stringify({
        version: 3,
        sessions: { s1: { open: false, opened: ['a\u0000one'], active: 'a\u0000one' } },
      }),
    })
    const store = createOutputDockUiStore(storage)
    store.noteSessions([])
    store.noteSessions(['s2'])
    expect(store.get('s1').opened).toEqual(['a\u0000one'])
  })
})
