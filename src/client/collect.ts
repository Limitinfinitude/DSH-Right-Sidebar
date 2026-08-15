/**
 * Produced-file derivation: one turn-scoped conversation Definition that
 * mirrors the harness's own deliverables engine — paths come from the
 * mutation tools' follow-along `locations` (a diff card, or a generic card
 * whose kind is edit), never from the closing prose — then filters to the
 * dock's extension allowlist.
 */
import type {
  ConversationNodeContext, ConversationNodeDefinition, ConversationMatch, ToolResultNode,
} from '@deepseek-ai/dsh-client-runtime/client'
import { isAppendSurfaceEvent } from '@deepseek-ai/dsh-client-runtime/client'
import type { OutputDockTurnPayload, OutputDockViewNode } from './contract.ts'
import { kindOfPath } from '../formats.ts'

export { kindOfPath } from '../formats.ts'

/** Trailing path segment, the part that identifies the file at a glance. */
export function basename(path: string): string {
  const at = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'))
  return at === -1 ? path : path.slice(at + 1)
}

/**
 * Paths a call view reports having created or changed, by render intent
 * rather than tool name: a diff card, or a generic card whose kind is `edit`.
 * Reads, deletes, and failed calls contribute nothing.
 */
function producedPaths(view: ToolResultNode['callView']): readonly string[] {
  if (view === null) return []
  if (view.card === 'diff') return (view.locations ?? []).map(location => location.path)
  if (view.card === 'generic' && view.kind === 'edit') {
    return (view.locations ?? []).map(location => location.path)
  }
  return []
}

interface OutputDockState {
  readonly turn: number
  readonly calls: ReadonlyMap<string, ToolResultNode['callView']>
  readonly produced: readonly { readonly seq: number; readonly path: string }[]
}

function nodeFor(context: ConversationNodeContext<OutputDockState>): OutputDockViewNode | null {
  const state = context.state
  if (state === undefined || state.produced.length === 0) return null
  const last = state.produced[state.produced.length - 1]
  if (last === undefined) return null
  const payload: OutputDockTurnPayload = { turn: state.turn, produced: state.produced }
  return {
    key: context.key,
    kind: context.kind,
    id: context.id,
    target: 'outputDock',
    anchorSeq: last.seq,
    location: context.start?.location ?? { kind: 'unresolved' },
    data: payload,
  }
}

/** Turn-local successful mutation accumulator with the dock's extension filter. */
export const outputDockDefinition: ConversationNodeDefinition<OutputDockState> = {
  kind: 'output-dock-turn',
  target: 'outputDock',
  match: (event) => {
    if (event.type === 'turn/start') return { id: String(event.data.turn), role: 'start' }
    if (event.type === 'tool/call') return { id: String(event.data.turn), role: 'update' }
    if (event.type === 'tool/result' && isAppendSurfaceEvent(event)) {
      return { id: String(event.data.turn), role: 'update' }
    }
    return null
  },
  start: (_context, match) => {
    if (match.event.type !== 'turn/start') {
      throw new Error('output-dock start requires turn/start')
    }
    return { turn: match.event.data.turn, calls: new Map(), produced: [] }
  },
  update: (context, match) => {
    if (match.event.type === 'tool/call') {
      const calls = new Map(context.state.calls)
      calls.set(
        String(match.event.data.callId),
        match.view?.for === 'call' ? match.view.view : null,
      )
      return { ...context.state, calls }
    }
    if (match.event.type !== 'tool/result') return context.state
    const result = match.event.data.message.content[0]
    if (result.isError === true) return context.state
    const callId = String(match.event.data.message.source.callId)
    const additions = producedPaths(context.state.calls.get(callId) ?? null)
      .map(path => ({ seq: match.event.seq, path }))
      .filter(entry => kindOfPath(entry.path) !== null)
    return additions.length === 0
      ? context.state
      : { ...context.state, produced: [...context.state.produced, ...additions] }
  },
  publication: (_match: ConversationMatch) => 'immediate',
  buildViewNode: nodeFor,
}
