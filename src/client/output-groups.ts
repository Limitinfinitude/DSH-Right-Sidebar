import type { OutputEntry, OutputKind } from './contract.ts'

/** Coarse catalog filter groups a preview kind belongs to. */
export type OutputGroup = 'doc' | 'image' | 'data' | 'media'

const KIND_GROUPS: Readonly<Record<OutputKind, OutputGroup>> = {
  md: 'doc',
  pdf: 'doc',
  html: 'doc',
  svg: 'image',
  image: 'image',
  text: 'data',
  code: 'data',
  video: 'media',
  audio: 'media',
}

/** The filter group of one preview kind. */
export function kindGroup(kind: OutputKind): OutputGroup {
  return KIND_GROUPS[kind]
}

/** Entries of one group, in the given order; `all` keeps every entry. */
export function filterByGroup<E extends Pick<OutputEntry, 'kind'>>(
  entries: readonly E[],
  group: OutputGroup | 'all',
): readonly E[] {
  if (group === 'all') return entries
  return entries.filter(entry => kindGroup(entry.kind) === group)
}

/** Human-readable byte size, one decimal below 10 units, integer above. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  const text = unit === 0 || value >= 10 ? String(Math.round(value)) : value.toFixed(1)
  return `${text} ${units[unit]}`
}
