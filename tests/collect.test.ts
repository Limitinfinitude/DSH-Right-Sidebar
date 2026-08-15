import type {
  ConversationMatch,
  ConversationNodeContext,
} from '@deepseek-ai/dsh-client-runtime/client'
import type { SessionEvent } from '@deepseek-ai/dsh-session/types'
import { describe, expect, it } from 'vitest'
import { outputDockDefinition } from '../src/client/collect.ts'
import { OUTPUT_DOCK_TOOL } from '../src/publish.ts'

const publication = {
  workId: 'sales',
  workTitle: 'Sales',
  resultId: 'dashboard',
  label: 'Dashboard',
  kind: 'visual',
  path: 'reports/chart.svg',
} as const

function event(seq: number, type: string, data: unknown): SessionEvent {
  return { seq, time: 1_700_000_000_000 + seq, type, data } as unknown as SessionEvent
}

function match(input: SessionEvent, role: 'start' | 'update'): ConversationMatch {
  return {
    event: input,
    role,
    view: undefined,
    location: {
      kind: 'step',
      turn: { turn: 3 },
      step: { step: 1 },
    },
  } as unknown as ConversationMatch
}

function context<State>(
  state: State | undefined,
  matches: readonly ConversationMatch[],
): ConversationNodeContext<State> {
  return {
    key: 'output-dock-publication:test',
    kind: outputDockDefinition.kind,
    id: 'test',
    matches,
    start: matches[0],
    state,
    current: new Map(),
  }
}

function nativeStart(args: unknown = publication): ConversationMatch {
  return match(event(5, 'tool/call', {
    turn: 3,
    step: 1,
    callId: 'c1',
    name: OUTPUT_DOCK_TOOL,
    arguments: JSON.stringify(args),
  }), 'start')
}

function nativeResult(isError = false): ConversationMatch {
  return match(event(8, 'tool/result', {
    turn: 3,
    step: 1,
    message: {
      source: { kind: 'tool', callId: 'c1' },
      content: [{ type: 'tool-result', toolCallId: 'c1', content: [], isError }],
    },
  }), 'update')
}

function codeStart(args: unknown = publication): ConversationMatch {
  return match(event(10, 'tool/code-dispatch-start', {
    rootCallId: 'root',
    parentCallId: 'root',
    subCallId: 'sub-1',
    name: OUTPUT_DOCK_TOOL,
    arguments: args,
  }), 'start')
}

function codeResult(isError = false): ConversationMatch {
  return match(event(12, 'tool/code-dispatch', {
    rootCallId: 'root',
    parentCallId: 'root',
    subCallId: 'sub-1',
    name: OUTPUT_DOCK_TOOL,
    arguments: publication,
    content: [],
    isError,
  }), 'update')
}

function settle(start: ConversationMatch, result?: ConversationMatch) {
  const initial = outputDockDefinition.start(context(undefined, [start]), start, { previous: () => undefined })
  const state = result === undefined
    ? initial
    : outputDockDefinition.update(context(initial, [start, result]), result)
  return outputDockDefinition.buildViewNode?.(context(state, result === undefined ? [start] : [start, result])) ?? null
}

describe('published output collection', () => {
  it('commits a successful native publication', () => {
    expect(settle(nativeStart(), nativeResult())).toMatchObject({
      anchorSeq: 8,
      data: { publication },
    })
  })

  it('commits a successful Code Mode publication', () => {
    expect(settle(codeStart(), codeResult())).toMatchObject({
      anchorSeq: 12,
      data: { publication },
    })
  })

  it.each([
    ['native error', nativeStart(), nativeResult(true)],
    ['code error', codeStart(), codeResult(true)],
    ['unsettled', nativeStart(), undefined],
    ['malformed', nativeStart({ workId: 'broken' }), nativeResult()],
  ] as const)('publishes nothing for %s', (_name, start, result) => {
    expect(settle(start, result)).toBeNull()
  })
})
