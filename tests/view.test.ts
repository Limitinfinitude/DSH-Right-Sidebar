import type { ConversationTimelineSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import { describe, expect, it } from 'vitest'
import type { OutputDockSnapshot, OutputDockViewNode } from '../src/client/contract.ts'
import { OutputDockViewBuilder, publicationsForTurn } from '../src/client/view.ts'

const EMPTY_TIMELINE: ConversationTimelineSnapshot = {
  turnOrder: [],
  turns: new Map(),
}

function node(
  workId: string,
  resultId: string,
  label: string,
  turn: number,
  revision: number,
): OutputDockViewNode {
  return {
    key: `${workId}:${resultId}:${revision}`,
    kind: 'output-dock-publication',
    id: `${workId}:${resultId}:${revision}`,
    target: 'outputDock',
    anchorSeq: revision,
    location: { kind: 'turn', turn: { turn } } as OutputDockViewNode['location'],
    data: {
      publication: {
        workId,
        workTitle: workId,
        resultId,
        label,
        kind: 'visual',
        path: `${resultId}.svg`,
      },
    },
  }
}

describe('output dock view', () => {
  it('replaces the same work/result identity without moving its order', () => {
    const builder = new OutputDockViewBuilder()
    const first = node('sales', 'dashboard', 'Draft', 1, 5)
    const other = node('marketing', 'visual', 'Visual', 1, 6)
    const revised = node('sales', 'dashboard', 'Final', 2, 9)
    builder.replace({ nodes: [first, other], timeline: EMPTY_TIMELINE })
    expect(builder.apply({ upserts: [revised], timeline: EMPTY_TIMELINE }).entries)
      .toEqual([
        expect.objectContaining({ key: 'sales\u0000dashboard', label: 'Final', turn: 2, revision: 9 }),
        expect.objectContaining({ key: 'marketing\u0000visual' }),
      ])
  })

  it('retains history and filters a closing turn at its assistant sequence', () => {
    const builder = new OutputDockViewBuilder()
    const snapshot = builder.replace({
      nodes: [
        node('sales', 'ready-before-close', 'Ready', 3, 19),
        node('sales', 'after-close', 'Late', 3, 21),
        node('other', 'different-turn', 'Other', 4, 18),
      ],
      timeline: EMPTY_TIMELINE,
    }) as OutputDockSnapshot
    expect(snapshot.history).toHaveLength(3)
    expect(publicationsForTurn(snapshot, 3, 20).map(item => item.resultId))
      .toEqual(['ready-before-close'])
  })
})
