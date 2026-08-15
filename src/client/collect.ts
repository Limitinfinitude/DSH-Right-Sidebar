import type {
  ConversationMatch,
  ConversationNodeContext,
  ConversationNodeDefinition,
} from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-tools/types'
import { normalizePublication, OUTPUT_DOCK_TOOL, type OutputPublication } from '../publication.ts'
import type { OutputDockViewNode } from './contract.ts'

interface OutputDockState {
  readonly mode: 'native' | 'code'
  readonly publication: OutputPublication | null
  readonly settledSeq?: number
}

function publicationFromStart(match: ConversationMatch): OutputPublication | null {
  try {
    if (match.event.type === 'tool/call') {
      return normalizePublication(JSON.parse(match.event.data.arguments))
    }
    if (match.event.type === 'tool/code-dispatch-start') {
      return normalizePublication(match.event.data.arguments)
    }
  } catch {
    return null
  }
  return null
}

function succeeded(state: OutputDockState, match: ConversationMatch): boolean {
  if (state.mode === 'native' && match.event.type === 'tool/result') {
    return match.event.data.message.content[0].isError === false
  }
  if (state.mode === 'code' && match.event.type === 'tool/code-dispatch') {
    return match.event.data.name === OUTPUT_DOCK_TOOL && match.event.data.isError === false
  }
  return false
}

function nodeFor(context: ConversationNodeContext<OutputDockState>): OutputDockViewNode | null {
  const state = context.state
  if (state?.publication === null || state?.publication === undefined || state.settledSeq === undefined) return null
  return {
    key: context.key,
    kind: context.kind,
    id: context.id,
    target: 'outputDock',
    anchorSeq: state.settledSeq,
    location: context.start?.location ?? { kind: 'unresolved' },
    data: { publication: state.publication },
  }
}

export const outputDockDefinition: ConversationNodeDefinition<OutputDockState> = {
  kind: 'output-dock-publication',
  target: 'outputDock',
  match(event) {
    if (event.type === 'tool/call' && event.data.name === OUTPUT_DOCK_TOOL) {
      return { id: `native:${event.data.callId}`, role: 'start' }
    }
    if (event.type === 'tool/result') {
      return { id: `native:${event.data.message.source.callId}`, role: 'update' }
    }
    if (event.type === 'tool/code-dispatch-start' && event.data.name === OUTPUT_DOCK_TOOL) {
      return { id: `code:${event.data.subCallId}`, role: 'start' }
    }
    if (event.type === 'tool/code-dispatch') {
      return { id: `code:${event.data.subCallId}`, role: 'update' }
    }
    return null
  },
  start(_context, match) {
    return {
      mode: match.event.type === 'tool/call' ? 'native' : 'code',
      publication: publicationFromStart(match),
    }
  },
  update(context, match) {
    if (context.state.publication === null || !succeeded(context.state, match)) return context.state
    return { ...context.state, settledSeq: match.event.seq }
  },
  publication: () => 'immediate',
  buildViewNode: nodeFor,
}
