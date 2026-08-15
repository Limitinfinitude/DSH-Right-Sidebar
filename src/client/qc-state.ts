import type { QcResult } from './qc.ts'

function sameResult(left: QcResult | undefined, right: QcResult): boolean {
  return left !== undefined
    && left.level === right.level
    && left.issues.length === right.issues.length
    && left.issues.every((issue, index) => {
      const other = right.issues[index]
      return other !== undefined
        && issue.level === other.level
        && issue.code === other.code
        && issue.count === other.count
    })
}

export function mergeQcResult(
  current: ReadonlyMap<string, QcResult>,
  path: string,
  result: QcResult,
): ReadonlyMap<string, QcResult> {
  if (sameResult(current.get(path), result)) return current
  return new Map(current).set(path, result)
}
