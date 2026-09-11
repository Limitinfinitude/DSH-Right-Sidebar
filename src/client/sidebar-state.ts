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
  return entry.kind !== 'text' && entry.kind !== 'code'
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

/** One catalog section: every output first produced in the same turn. */
export interface CatalogGroup {
  readonly turn: number
  readonly entries: readonly OutputEntry[]
}

/** Group session history by the turn that first produced each output, newest turn first. */
export function groupCatalogByTurn(
  entries: readonly OutputEntry[],
): readonly CatalogGroup[] {
  const groups = new Map<number, OutputEntry[]>()
  for (const entry of entries) {
    const bucket = groups.get(entry.firstTurn)
    if (bucket === undefined) groups.set(entry.firstTurn, [entry])
    else bucket.push(entry)
  }
  return [...groups.entries()]
    .sort((left, right) => right[0] - left[0])
    .map(([turn, list]) => ({
      turn,
      entries: [...list].sort((left, right) => right.lastSeq - left.lastSeq),
    }))
}

/** Case-insensitive catalog filter across file name and full path. */
export function filterCatalog(
  entries: readonly OutputEntry[],
  query: string,
): readonly OutputEntry[] {
  const needle = query.trim().toLocaleLowerCase()
  if (needle === '') return entries
  return entries.filter(entry => entry.path.toLocaleLowerCase().includes(needle))
}

/** Close every listed tab at its current revision so nothing reopens by itself. */
export function closedAllAt(
  entries: readonly OutputEntry[],
): Readonly<Record<string, number>> {
  const closedAt: Record<string, number> = {}
  for (const entry of entries) closedAt[entry.path] = entry.lastSeq
  return closedAt
}

/** Session history stays available after closing tabs; explicitly hidden files do not. */
export function catalogEntries(
  entries: readonly OutputEntry[],
  hidden: ReadonlySet<string>,
): readonly OutputEntry[] {
  return entries
    .filter(entry => !hidden.has(entry.path))
    .sort((left, right) => right.lastSeq - left.lastSeq)
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
