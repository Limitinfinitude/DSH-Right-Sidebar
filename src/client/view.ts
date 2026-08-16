/**
 * Per-session incremental view builder: folds each turn's published payload
 * into a first-seen-deduped flat entry list. Replace clears; apply merges
 * only the changed turns.
 */
import type {
  ConversationViewBuilder, ConversationViewDefinition,
} from '@deepseek-ai/dsh-client-runtime/client'
import type {
  OutputDockSnapshot, OutputDockTurnPayload, OutputDockViewNode, OutputEntry,
} from './contract.ts'
import { EMPTY_OUTPUT_DOCK_SNAPSHOT, isDockVisibleKind } from './contract.ts'
import { kindOfPath } from './collect.ts'
import { shouldPublishOutput } from './output-policy.ts'

export class OutputDockViewBuilder implements ConversationViewBuilder<OutputDockViewNode, OutputDockSnapshot> {
  readonly empty = EMPTY_OUTPUT_DOCK_SNAPSHOT
  private turns = new Map<number, OutputDockTurnPayload>()

  replace(input: { readonly nodes: readonly OutputDockViewNode[] }): OutputDockSnapshot {
    this.turns.clear()
    for (const node of input.nodes) this.turns.set(node.data.turn, node.data)
    return this.snapshot()
  }

  apply(input: { readonly upserts: readonly OutputDockViewNode[] }): OutputDockSnapshot {
    for (const node of input.upserts) this.turns.set(node.data.turn, node.data)
    return this.snapshot()
  }

  private snapshot(): OutputDockSnapshot {
    const entries = new Map<string, OutputEntry>()
    const order = [...this.turns.keys()].sort((left, right) => left - right)
    for (const turn of order) {
      const payload = this.turns.get(turn)
      if (payload === undefined) continue
      for (const produced of payload.produced) {
        if (!shouldPublishOutput(produced.path, produced.publication)) continue
        const kind = kindOfPath(produced.path)
        if (kind === null || !isDockVisibleKind(kind)) continue
        const previous = entries.get(produced.path)
        entries.set(produced.path, previous === undefined
          ? {
            path: produced.path,
            kind,
            firstTurn: turn,
            lastTurn: turn,
            lastSeq: produced.seq,
          }
          : { ...previous, lastTurn: turn, lastSeq: produced.seq })
      }
    }
    return { entries: [...entries.values()] }
  }
}

/** The dock's conversation view target definition. */
export const outputDockViewDefinition: ConversationViewDefinition<OutputDockViewNode, OutputDockSnapshot> = {
  target: 'outputDock',
  create: () => new OutputDockViewBuilder(),
}
