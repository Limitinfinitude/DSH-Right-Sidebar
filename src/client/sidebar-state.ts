import type { OutputEntry } from './contract.ts'

export interface SelectionState {
  readonly path: string | null
  readonly seenSeq: number
  readonly hasNewOutput: boolean
}

/** Reconcile sidebar selection against one visible output snapshot. */
export function reconcileSelection(
  entries: readonly OutputEntry[],
  currentPath: string | null,
  seenSeq: number,
): SelectionState {
  const newest = entries.reduce<OutputEntry | undefined>(
    (current, entry) => current === undefined || entry.lastSeq > current.lastSeq ? entry : current,
    undefined,
  )
  if (newest === undefined) return { path: null, seenSeq, hasNewOutput: false }
  const hasNewOutput = newest.lastSeq > seenSeq
  const nextSeenSeq = Math.max(seenSeq, newest.lastSeq)
  if (hasNewOutput) return { path: newest.path, seenSeq: nextSeenSeq, hasNewOutput: true }
  const currentVisible = currentPath !== null && entries.some(entry => entry.path === currentPath)
  return {
    path: currentVisible ? currentPath : newest.path,
    seenSeq: nextSeenSeq,
    hasNewOutput: false,
  }
}
