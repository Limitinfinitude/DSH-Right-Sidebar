/**
 * dsh-output-dock client contracts: entry/snapshot types plus the
 * declaration-merged business keys the runtime engine types against.
 */
import type { ConversationLocation, ConversationViewNode } from '@deepseek-ai/dsh-client-runtime/client'

/** Preview category an output file renders as. */
export type OutputKind = 'md' | 'svg' | 'image' | 'html' | 'pdf' | 'text'

/** One collected output file, first-seen deduped across turns. */
export interface OutputEntry {
  /** Host-side path as reported by the mutation tool's locations. */
  readonly path: string
  readonly kind: OutputKind
  readonly firstTurn: number
  readonly lastTurn: number
  readonly lastSeq: number
}

/** Immutable dock view snapshot: every output entry of the current session. */
export interface OutputDockSnapshot {
  readonly entries: readonly OutputEntry[]
}

export const EMPTY_OUTPUT_DOCK_SNAPSHOT: OutputDockSnapshot = { entries: [] }

/** Per-turn payload the definition publishes to the view builder. */
export interface OutputDockTurnPayload {
  readonly turn: number
  readonly produced: readonly { readonly seq: number; readonly path: string }[]
}

/** View node envelope the definition materializes. */
export interface OutputDockViewNode extends ConversationViewNode {
  readonly target: 'outputDock'
  readonly anchorSeq: number
  readonly location: ConversationLocation
  readonly data: OutputDockTurnPayload
}

declare module '@deepseek-ai/dsh-client-runtime/client' {
  interface ConversationViewSnapshotMap {
    outputDock: OutputDockSnapshot
  }
}
