import type {
  ConversationViewBuilder,
  ConversationViewDefinition,
} from '@deepseek-ai/dsh-client-runtime/client'
import { kindOfPath } from '../formats.ts'
import {
  EMPTY_OUTPUT_DOCK_SNAPSHOT,
  publicationKey,
  type OutputDockSnapshot,
  type OutputDockViewNode,
  type PublishedOutput,
} from './contract.ts'

function outputFromNode(node: OutputDockViewNode): PublishedOutput | null {
  const location = node.location
  if (location.kind !== 'turn' && location.kind !== 'step') return null
  const publication = node.data.publication
  return {
    ...publication,
    key: publicationKey(publication.workId, publication.resultId),
    previewKind: publication.path === undefined ? null : kindOfPath(publication.path),
    turn: location.turn.turn,
    revision: node.anchorSeq,
  }
}

export class OutputDockViewBuilder implements ConversationViewBuilder<OutputDockViewNode, OutputDockSnapshot> {
  readonly empty = EMPTY_OUTPUT_DOCK_SNAPSHOT
  private readonly nodes = new Map<string, OutputDockViewNode>()

  replace(input: { readonly nodes: readonly OutputDockViewNode[] }): OutputDockSnapshot {
    this.nodes.clear()
    for (const node of input.nodes) this.nodes.set(node.key, node)
    return this.snapshot()
  }

  apply(input: { readonly upserts: readonly OutputDockViewNode[] }): OutputDockSnapshot {
    for (const node of input.upserts) this.nodes.set(node.key, node)
    return this.snapshot()
  }

  private snapshot(): OutputDockSnapshot {
    const history = [...this.nodes.values()]
      .sort((left, right) => left.anchorSeq - right.anchorSeq)
      .flatMap((node) => {
        const output = outputFromNode(node)
        return output === null ? [] : [output]
      })
    const current = new Map<string, PublishedOutput>()
    for (const output of history) current.set(output.key, output)
    return { history, entries: [...current.values()] }
  }
}

export function publicationsForTurn(
  snapshot: OutputDockSnapshot,
  turn: number,
  closingSeq: number,
): readonly PublishedOutput[] {
  const latest = new Map<string, PublishedOutput>()
  for (const entry of snapshot.history) {
    if (entry.turn === turn && entry.revision <= closingSeq) latest.set(entry.key, entry)
  }
  return [...latest.values()]
}

export const outputDockViewDefinition: ConversationViewDefinition<OutputDockViewNode, OutputDockSnapshot> = {
  target: 'outputDock',
  create: () => new OutputDockViewBuilder(),
}
