import type { TurnTailOwnerProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import { describe, expect, it } from 'vitest'
import type { PublishedOutput } from '../src/client/contract.ts'
import { actionDestination, selectPublishedOutputs } from '../src/client/ResultActions.tsx'

function published(resultId: string, turn: number, revision: number, kind: 'visual' | 'link' = 'visual'): PublishedOutput {
  const key = `sales\u0000${resultId}`
  return {
    workId: 'sales',
    workTitle: 'Sales',
    resultId,
    label: resultId,
    kind,
    ...(kind === 'link' ? { url: 'http://127.0.0.1:4173/' } : { path: `${resultId}.svg` }),
    key,
    previewKind: kind === 'link' ? null : 'svg',
    turn,
    revision,
  }
}

function owner(history: readonly PublishedOutput[], turn: number, seq: number): TurnTailOwnerProps {
  return {
    turn: { turn } as TurnTailOwnerProps['turn'],
    seq,
    views: { get: target => target === 'outputDock' ? { history, entries: history } : undefined } as TurnTailOwnerProps['views'],
    openFile: () => {},
  }
}

describe('conversation result actions', () => {
  it('claims only publications from the closing turn', () => {
    const matched = selectPublishedOutputs(owner([
      published('local', 2, 10),
      published('later', 3, 20),
    ], 2, 15))
    expect(matched?.map(item => item.resultId)).toEqual(['local'])
  })

  it('declines a turn without publications', () => {
    expect(selectPublishedOutputs(owner([], 2, 15))).toBeNull()
  })

  it('routes local results to Outputs and links to a browser tab', () => {
    expect(actionDestination(published('dashboard', 2, 10)))
      .toEqual({ kind: 'dock', key: 'sales\u0000dashboard' })
    expect(actionDestination(published('site', 2, 10, 'link')))
      .toEqual({ kind: 'browser', url: 'http://127.0.0.1:4173/' })
  })
})
