import { describe, expect, it } from 'vitest'
import type { OutputDockSnapshot, PublishedOutput } from '../src/client/contract.ts'
import type { SessionDockState } from '../src/client/dock-store.ts'
import { dockTabs } from '../src/client/DockPanel.tsx'

function local(workId: string, resultId: string, revision: number): PublishedOutput {
  return {
    workId,
    workTitle: workId,
    resultId,
    label: resultId,
    kind: 'visual',
    path: `${resultId}.svg`,
    key: `${workId}\u0000${resultId}`,
    previewKind: 'svg',
    turn: 1,
    revision,
  }
}

function link(workId: string, resultId: string, revision: number): PublishedOutput {
  return {
    workId,
    workTitle: workId,
    resultId,
    label: resultId,
    kind: 'link',
    url: 'http://127.0.0.1:4173/',
    key: `${workId}\u0000${resultId}`,
    previewKind: null,
    turn: 1,
    revision,
  }
}

function snapshot(entries: readonly PublishedOutput[]): OutputDockSnapshot {
  return { entries, history: entries }
}

describe('output dock tabs', () => {
  it('resolves opened local identities in stored order', () => {
    const state: SessionDockState = {
      open: true,
      opened: ['b\u0000two', 'a\u0000one'],
      active: 'b\u0000two',
    }
    const model = dockTabs(state, snapshot([
      local('a', 'one', 1),
      local('b', 'two', 2),
      link('c', 'site', 3),
    ]))
    expect(model.tabs.map(tab => tab.key)).toEqual(['b\u0000two', 'a\u0000one'])
    expect(model.active?.key).toBe('b\u0000two')
  })

  it('never turns links into tabs or selects new publications', () => {
    expect(dockTabs(
      { open: true, opened: ['c\u0000site'], active: 'c\u0000site' },
      snapshot([link('c', 'site', 3)]),
    ).tabs).toEqual([])
    expect(dockTabs(
      { open: false, opened: [], active: null },
      snapshot([local('new', 'result', 4)]),
    )).toEqual({ tabs: [], active: null })
  })
})
