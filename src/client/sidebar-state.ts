import type { OutputEntry } from './contract.ts'

/** Parent directory spelling for Windows, POSIX, and workspace-relative paths. */
export function directoryOfPath(path: string): string {
  const at = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'))
  if (at < 0) return '.'
  if (at === 0) return path[0] ?? '.'
  return path.slice(0, at)
}

/** Rich, user-facing formats may reveal themselves; source-like text stays quiet. */
export function shouldAutoOpen(entry: OutputEntry): boolean {
  return entry.kind !== 'text'
}

/** Visible tab order: pinned first, then newest activity, without mutating input. */
export function visibleTabs(
  entries: readonly OutputEntry[],
  hidden: ReadonlySet<string>,
  pinned: ReadonlySet<string> = new Set(),
  closedAt: ReadonlyMap<string, number> = new Map(),
): readonly OutputEntry[] {
  return entries
    .filter(entry => !hidden.has(entry.path) && entry.lastSeq > (closedAt.get(entry.path) ?? -1))
    .sort((left, right) =>
      Number(pinned.has(right.path)) - Number(pinned.has(left.path))
      || right.lastSeq - left.lastSeq)
}

/** Apply manual order to known tabs while leaving newly produced entries in front. */
export function orderedTabs(
  entries: readonly OutputEntry[],
  order: readonly string[],
): readonly OutputEntry[] {
  const byPath = new Map(entries.map(entry => [entry.path, entry]))
  const orderedPaths = new Set(order)
  return [
    ...entries.filter(entry => !orderedPaths.has(entry.path)),
    ...order.flatMap(path => {
      const entry = byPath.get(path)
      return entry === undefined ? [] : [entry]
    }),
  ]
}

/** Move the dragged tab immediately before the drop target. */
export function reorderTab(
  paths: readonly string[],
  draggedPath: string,
  targetPath: string,
): readonly string[] {
  if (draggedPath === targetPath || !paths.includes(draggedPath) || !paths.includes(targetPath)) {
    return paths
  }
  const next = paths.filter(path => path !== draggedPath)
  next.splice(next.indexOf(targetPath), 0, draggedPath)
  return next
}

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
  const currentVisible = currentPath !== null && entries.some(entry => entry.path === currentPath)
  if (hasNewOutput) {
    const newestRich = entries.reduce<OutputEntry | undefined>((current, entry) => {
      if (entry.lastSeq <= seenSeq || !shouldAutoOpen(entry)) return current
      return current === undefined || entry.lastSeq > current.lastSeq ? entry : current
    }, undefined)
    return {
      path: newestRich?.path ?? (currentVisible ? currentPath : newest.path),
      seenSeq: nextSeenSeq,
      hasNewOutput: true,
    }
  }
  return {
    path: currentVisible ? currentPath : newest.path,
    seenSeq: nextSeenSeq,
    hasNewOutput: false,
  }
}
