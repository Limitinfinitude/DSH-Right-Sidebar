// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
vi.mock('@deepseek-ai/dsh-client-runtime/client', () => ({
  isAppendSurfaceEvent: (input: { readonly surfaceOp?: string }) => input.surfaceOp === 'append',
}))
import { outputDockDefinition } from '../src/client/collect.ts'

function event(type: string, seq: number, data: object, surfaceOp?: 'append'): never {
  return { type, seq, time: seq, data, ...(surfaceOp === undefined ? {} : { surfaceOp }) } as never
}

function matched(input: never, view?: object): never {
  return {
    event: input,
    view,
    role: 'update',
    location: { kind: 'unresolved' },
  } as never
}

describe('output collection product policy', () => {
  it('publishes the latest conditional file only after the assistant names it', () => {
    const startEvent = event('turn/start', 0, { turn: 1 })
    const startMatch = matched(startEvent)
    let state = outputDockDefinition.start({} as never, startMatch, {} as never)

    const call = event('tool/call', 1, { turn: 1, callId: 'write', name: 'write', arguments: '{}' })
    state = outputDockDefinition.update({ state } as never, matched(call, {
      for: 'call', view: { card: 'diff', locations: [{ path: 'out/results.json' }] },
    }))
    const result = (seq: number): never => event('tool/result', seq, {
      turn: 1,
      message: { content: [{ type: 'text', text: 'ok' }], source: { callId: 'write' } },
    }, 'append')
    state = outputDockDefinition.update({ state } as never, matched(result(2)))
    state = outputDockDefinition.update({ state } as never, matched(result(4)))

    expect(state.produced).toEqual([])
    const assistant = event('assistant/message', 5, {
      turn: 1,
      message: { content: [{ type: 'text', text: '结果见 `results.json`。' }] },
    }, 'append')
    state = outputDockDefinition.update({ state } as never, matched(assistant))

    expect(state.produced).toEqual([
      { path: 'out/results.json', seq: 4, publication: 'explicit' },
    ])
  })
})
