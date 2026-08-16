// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import type { OutputDockViewNode } from '../src/client/contract.ts'
import { OutputDockViewBuilder } from '../src/client/view.ts'

function node(turn: number, seq: number, ...paths: string[]): OutputDockViewNode {
  return {
    key: `turn-${turn}`,
    kind: 'output-dock-turn',
    id: String(turn),
    target: 'outputDock',
    anchorSeq: seq,
    location: { kind: 'unresolved' },
    data: {
      turn,
      produced: paths.map(path => ({ path, seq, publication: 'automatic' })),
    },
  } as OutputDockViewNode
}

describe('output path identity', () => {
  it('replaces an earlier basename with a later absolute path for the same output', () => {
    const builder = new OutputDockViewBuilder()
    const snapshot = builder.replace({ nodes: [
      node(1, 2, '简历.md'),
      node(2, 5, 'D:\\workspace\\简历.md'),
    ] })

    expect(snapshot.entries).toEqual([{
      path: 'D:\\workspace\\简历.md',
      kind: 'md',
      firstTurn: 1,
      lastTurn: 2,
      lastSeq: 5,
    }])
  })

  it('merges a relative suffix into its absolute spelling but keeps distinct absolute files', () => {
    const builder = new OutputDockViewBuilder()
    const snapshot = builder.replace({ nodes: [
      node(1, 2, 'out/report.md'),
      node(2, 5, 'D:\\workspace\\out\\report.md'),
      node(3, 7, 'D:\\other\\report.md'),
    ] })

    expect(snapshot.entries.map(entry => entry.path)).toEqual([
      'D:\\workspace\\out\\report.md',
      'D:\\other\\report.md',
    ])
  })
})
