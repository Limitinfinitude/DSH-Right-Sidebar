# Session Result Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Output Dock's automatic file inventory with explicit agent publications, conversation result actions, and session-scoped on-demand tabs.

**Architecture:** A Node tool validates and publishes one normalized local file or external URL through DSH's existing durable tool lifecycle. A client conversation definition supports native and Code Mode calls, folds successful publications into one per-session view, and feeds both a turn-tail result row and a persisted session UI store. The dock renders only local publications the user opened; link publications open in a new browser tab.

**Tech Stack:** TypeScript, React 18, Cordis, DSH conversation views and slots, Vitest, DOMPurify, marked, lucide-react, browser localStorage.

---

## File Map

- `D:\deepseek-harness\packages\client\ui-conversation\src\client\contract\slots.ts`: add the read-only conversation view store to turn-tail owner currency.
- `D:\deepseek-harness\packages\client\ui-conversation\src\client\chat\TurnTailNodeView.tsx`: pass the current session view store to turn-tail selectors.
- `D:\deepseek-harness\packages\client\ui-conversation\tests\chat-view.client.spec.tsx`: prove the owner receives the exact current view store.
- `D:\deepseek-harness\packages\client\ui-conversation\README.i18n.yaml`: keep bilingual owner-currency documentation synchronized.
- `D:\deepseek-harness\.agents\notes\implemented\architecture\2026-08-15-turn-tail-view-reader.md`: record the host API rationale and verification evidence.
- `D:\deepseek-harness\.agents\notes\implemented\architecture\2026-08-15-turn-tail-view-reader.zh.md`: Chinese projection of the host API note.
- `D:\deepseek-harness\.agents\notes\implemented\architecture\2026-08-15-turn-tail-view-reader.i18n.yaml`: translation ledger for the host API note.
- `src/workspace-file.ts`: own workspace root enumeration and safe file resolution for both publishing and serving.
- `src/publish.ts`: define `output_dock_publish`, normalize arguments, validate local resources and URLs, and register the tool.
- `src/index.ts`: compose the publish tool and read-only file route.
- `src/client/contract.ts`: define publication identities, resources, view nodes, snapshots, and DSH declaration merges.
- `src/client/collect.ts`: derive successful native and Code Mode publications from durable events.
- `src/client/view.ts`: retain publication history for reply actions, fold current nodes by `(workId, resultId)`, and retain resolved turn and revision.
- `src/client/dock-store.ts`: own versioned per-session opened-tab state and localStorage persistence.
- `src/client/ResultActions.tsx`: select a closing turn's publications and route local files to the dock or links to a browser tab.
- `src/client/DockPanel.tsx`: render the Outputs header, horizontal tabs, preview, toolbar, collapse action, and closed launcher.
- `src/client/preview.tsx`: accept a revision key and retain the missing-file error surface.
- `src/client/locales.ts`: replace inventory copy with result, tab, refresh, unavailable, and external-open copy.
- `src/client/style.ts`: replace file-picker, pin/hide, and QC chrome with result actions and stable horizontal tabs.
- `src/client/index.ts`: register the new conversation entry, view, shared UI store, details panel, and launcher.
- `tests/publish.test.ts`: validate publication schemas, paths, kinds, and URL protocols.
- `tests/collect.test.ts`: cover native calls, Code Mode calls, failures, malformed logs, and turn resolution.
- `tests/view.test.ts`: cover identity replacement, historical actions, ordering, and turn filtering.
- `tests/dock-store.test.ts`: cover persistence and state isolation across sessions.
- `tests/result-actions.test.ts`: cover selector and navigation decisions.
- `tests/sidebar-state.test.ts`: delete in the panel replacement commit with the obsolete auto-open path model.
- `src/client/sidebar-state.ts`: delete in the panel replacement commit with the obsolete auto-open path model.
- `README.md`, `README.zh.md`, `package.json`, `package-lock.json`: document and package the `0.3.0` behavior.

### Task 1: Expose Session Views To Turn-Tail Selectors

**Files:**
- Modify: `D:\deepseek-harness\packages\client\ui-conversation\src\client\contract\slots.ts`
- Modify: `D:\deepseek-harness\packages\client\ui-conversation\src\client\chat\TurnTailNodeView.tsx`
- Modify: `D:\deepseek-harness\packages\client\ui-conversation\tests\chat-view.client.spec.tsx`
- Modify: `D:\deepseek-harness\packages\client\ui-conversation\README.md`
- Modify: `D:\deepseek-harness\packages\client\ui-conversation\README.zh.md`
- Modify: `D:\deepseek-harness\packages\client\ui-conversation\README.i18n.yaml`
- Create: `D:\deepseek-harness\.agents\notes\implemented\architecture\2026-08-15-turn-tail-view-reader.md`
- Create: `D:\deepseek-harness\.agents\notes\implemented\architecture\2026-08-15-turn-tail-view-reader.zh.md`
- Create: `D:\deepseek-harness\.agents\notes\implemented\architecture\2026-08-15-turn-tail-view-reader.i18n.yaml`

- [ ] **Step 1: Write a failing owner-currency test**

Capture the `conversation.chat.turnTail` owner in `chat-view.client.spec.tsx`, render a closed turn, and assert identity with the session snapshot's view store:

```tsx
let turnTailOwner: TurnTailOwnerProps | undefined
const renderTurnTail = ((_key: string, owner: TurnTailOwnerProps) => {
  turnTailOwner = owner
  return null
}) as React.ComponentProps<typeof TurnTailNodeView>['renderSlotChain']

// After rendering the closed turn:
expect(turnTailOwner?.views).toBe(source.getSnapshot().views)
```

- [ ] **Step 2: Run the focused test and confirm the missing field**

Run:

```powershell
pnpm vitest run packages/client/ui-conversation/tests/chat-view.client.spec.tsx
```

Expected: TypeScript/Vitest fails because `TurnTailOwnerProps` has no `views` member.

- [ ] **Step 3: Add the read-only owner field and wire it from the current snapshot**

In `slots.ts`:

```ts
import type {
  ConversationViewSnapshotStore, TurnLocation,
} from '@deepseek-ai/dsh-client-runtime/client'

export interface TurnTailOwnerProps {
  readonly turn: TurnLocation
  readonly seq: number
  readonly views: ConversationViewSnapshotStore
  readonly openFile: (path: string) => void
}
```

In `TurnTailNodeView.tsx`, read the store through the existing hook and include it in the owner:

```tsx
const views = useSession(snapshot => snapshot.views)
const owner: TurnTailOwnerProps = {
  turn,
  seq: closing?.finalNode.seq ?? data.seq,
  views,
  openFile,
}
```

Document that turn-tail selectors may combine engine-owned turn facts with registered per-session view snapshots, and that both inputs are read-only. Add a bilingual Agent Note describing why Code Mode needs the resolved view location rather than duplicated `turn` fields, and record the focused test and type-build commands in its verification section.

- [ ] **Step 4: Run focused DSH verification**

Run:

```powershell
pnpm vitest run packages/client/ui-conversation/tests/chat-view.client.spec.tsx
pnpm exec tsc -b packages/client/ui-conversation/tsconfig.json --pretty false
```

Expected: the focused suite passes and the package type build exits `0`.

- [ ] **Step 5: Keep the host patch separate**

Run:

```powershell
git diff --check -- packages/client/ui-conversation
git status --short -- packages/client/ui-conversation
```

Expected: only the nine listed DSH files are added to the existing dirty DSH worktree. Do not commit DSH because the existing details-column patch is intentionally still uncommitted and must stay reviewable as one host prerequisite set.

### Task 2: Add The Explicit Publication Tool

**Files:**
- Create: `src/workspace-file.ts`
- Create: `src/publish.ts`
- Create: `tests/publish.test.ts`
- Modify: `src/index.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Add direct development dependencies**

Run:

```powershell
npm install --save-dev @deepseek-ai/dsh-tools@0.1.0-rc.6 @deepseek-ai/dsh-client-ui-conversation@0.1.0-rc.6
```

Expected: both packages appear directly in `devDependencies`; `package-lock.json` records the same release line.

- [ ] **Step 2: Write failing publication validation tests**

Create `tests/publish.test.ts` around exported pure helpers:

```ts
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { normalizePublication, validatePublicationResource } from '../src/publish.ts'

const local = {
  workId: 'sales', workTitle: 'Sales', resultId: 'dashboard',
  label: 'Dashboard', kind: 'visual', path: 'reports/chart.svg',
} as const

describe('output publication', () => {
  it('normalizes a local result and rejects mixed resources', () => {
    expect(normalizePublication(local)).toEqual(local)
    expect(() => normalizePublication({ ...local, url: 'https://example.com' }))
      .toThrow(/exactly one resource/i)
  })

  it('accepts only http and https links', () => {
    expect(normalizePublication({
      workId: 'app', workTitle: 'App', resultId: 'preview',
      label: 'Preview', kind: 'link', url: 'http://127.0.0.1:4173/',
    }).url).toBe('http://127.0.0.1:4173/')
    expect(() => normalizePublication({
      workId: 'app', workTitle: 'App', resultId: 'preview',
      label: 'Preview', kind: 'link', url: 'file:///tmp/index.html',
    })).toThrow(/http/i)
  })

  it('requires a supported existing file inside a workspace', async () => {
    const root = join(process.cwd(), '.tmp-publish-test')
    await mkdir(join(root, 'reports'), { recursive: true })
    await writeFile(join(root, 'reports', 'chart.svg'), '<svg viewBox="0 0 1 1"/>')
    await expect(validatePublicationResource(local, [root]))
      .resolves.toMatch(/chart\.svg$/)
    await expect(validatePublicationResource({ ...local, path: '../secret.svg' }, [root]))
      .rejects.toThrow(/workspace/i)
    await expect(validatePublicationResource({ ...local, path: 'src/app.ts' }, [root]))
      .rejects.toThrow(/format/i)
  })
})
```

Use Vitest lifecycle cleanup with `rm(root, { recursive: true, force: true })`; keep the explicit root under the repository.

- [ ] **Step 3: Run the new test and verify the module is absent**

Run:

```powershell
npm test -- --run tests/publish.test.ts
```

Expected: FAIL because `src/publish.ts` does not exist.

- [ ] **Step 4: Extract workspace-confined file resolution**

Move the existing path canonicalization from `src/index.ts` to `src/workspace-file.ts` and expose these exact interfaces:

```ts
export interface OutputDockWorkspace { readonly path: string }
export interface OutputDockWorkspaceRegistry { list(): readonly OutputDockWorkspace[] }

export function workspaceRoots(registry: OutputDockWorkspaceRegistry): readonly string[]

export async function resolveWorkspaceFile(
  raw: string,
  roots: readonly string[],
  allowedExtensions: ReadonlySet<string>,
): Promise<string | null>
```

`workspaceRoots` includes canonical `process.cwd()` plus registry paths. `resolveWorkspaceFile` uses `realpath`, checks the canonical child relation with `relative`, rejects non-files later at the caller's `stat` gate, and never widens the root set through symlinks.

- [ ] **Step 5: Implement the normalized tool contract**

In `src/publish.ts`, export:

```ts
export const OUTPUT_DOCK_TOOL = 'output_dock_publish'
export type PublicationKind = 'document' | 'visual' | 'link'

export interface OutputPublication {
  readonly workId: string
  readonly workTitle: string
  readonly resultId: string
  readonly label: string
  readonly kind: PublicationKind
  readonly path?: string
  readonly url?: string
}

export function normalizePublication(input: unknown): OutputPublication
export async function validatePublicationResource(
  publication: OutputPublication,
  roots: readonly string[],
): Promise<string | undefined>
export function registerPublishTool(ctx: Context, roots: () => readonly string[]): () => void
```

Use `defineTool` with closed schemas, 64-character ids, 80-character visible labels, and these public file extension groups:

```ts
const DOCUMENT_EXTENSIONS = new Set([
  'md', 'mdx', 'pdf', 'html', 'htm', 'txt', 'csv', 'tsv',
])
const VISUAL_EXTENSIONS = new Set([
  'svg', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'avif', 'bmp',
])
```

Return the normalized publication as the canonical tool value. Render exactly one confirmation block:

```ts
render: (_args, value) => [{
  type: 'text',
  text: `Published ${value.workTitle} · ${value.label}.`,
}]
```

The description must state that source code, configuration, incidental project files, and complete generated file lists are excluded; deployed applications use `kind: "link"` with their reachable URL.

- [ ] **Step 6: Compose route and tool registration**

Keep `src/index.ts` as the function plugin and register both effects:

```ts
export const inject = ['webServer', 'workspaceRegistry', 'tools']

export function apply(ctx: Context): void {
  const roots = () => workspaceRoots(ctx.workspaceRegistry)
  ctx.effect(() => registerPublishTool(ctx, roots), 'output-dock: publish tool')
  ctx.effect(() => registerFileRoute(ctx.webServer, roots), 'output-dock: file route')
}
```

The file route retains the 16 MiB cap, `HEAD` handling, MIME types, no-cache response, and `400`/`404` behavior.

- [ ] **Step 7: Run tool tests and commit**

Run:

```powershell
npm test -- --run tests/publish.test.ts tests/resources.test.ts
npm run typecheck
git add package.json package-lock.json src/index.ts src/workspace-file.ts src/publish.ts tests/publish.test.ts
git commit -m "feat: add explicit output publication tool"
```

Expected: both suites pass, typecheck exits `0`, and the commit contains no DSH files.

### Task 3: Derive Durable Publications In Native And Code Mode

**Files:**
- Modify: `src/client/contract.ts`
- Replace: `src/client/collect.ts`
- Replace: `src/client/view.ts`
- Create: `tests/collect.test.ts`
- Create: `tests/view.test.ts`

- [ ] **Step 1: Write failing collector tests**

Build small event fixtures for both lifecycles and assert the definition's state transitions:

```ts
const publication = {
  workId: 'sales', workTitle: 'Sales', resultId: 'dashboard',
  label: 'Dashboard', kind: 'visual', path: 'reports/chart.svg',
} as const

it('commits a successful native publication', () => {
  const started = startDefinition(toolCall('c1', publication))
  const settled = updateDefinition(started, toolResult('c1', false, 8))
  expect(nodeFrom(settled)).toMatchObject({
    anchorSeq: 8,
    data: { publication },
  })
})

it('commits a successful Code Mode publication', () => {
  const started = startDefinition(codeStart('sub-1', publication))
  const settled = updateDefinition(started, codeResult('sub-1', publication, false, 12))
  expect(nodeFrom(settled)).toMatchObject({ anchorSeq: 12 })
})

it.each(['native-error', 'code-error', 'unsettled', 'malformed'] as const)(
  'publishes nothing for %s', scenario => {
    expect(nodeForScenario(scenario)).toBeNull()
  },
)
```

The helpers create real `SessionEvent`-compatible values and `ConversationMatch` locations; no model or network is involved.

- [ ] **Step 2: Write failing view-fold tests**

In `tests/view.test.ts`:

```ts
it('replaces the same work/result identity without moving its order', () => {
  const builder = new OutputDockViewBuilder()
  const first = node('sales', 'dashboard', 'Draft', 1, 5)
  const other = node('marketing', 'visual', 'Visual', 1, 6)
  const revised = node('sales', 'dashboard', 'Final', 2, 9)
  builder.replace({ nodes: [first, other], timeline: EMPTY_TIMELINE })
  expect(builder.apply({ upserts: [revised], timeline: EMPTY_TIMELINE }).entries)
    .toEqual([
      expect.objectContaining({ key: 'sales\u0000dashboard', label: 'Final', turn: 2, revision: 9 }),
      expect.objectContaining({ key: 'marketing\u0000visual' }),
    ])
})

it('filters a closing turn at its assistant sequence', () => {
  expect(publicationsForTurn(snapshot, 3, 20).map(item => item.resultId))
    .toEqual(['ready-before-close'])
})
```

- [ ] **Step 3: Run both suites and verify old contracts fail**

Run:

```powershell
npm test -- --run tests/collect.test.ts tests/view.test.ts
```

Expected: FAIL because the old path-based `OutputEntry` and mutation collector do not expose publication semantics.

- [ ] **Step 4: Replace the client contract**

Define the durable and rendered types in `contract.ts`:

```ts
export interface PublishedOutput extends OutputPublication {
  readonly key: string
  readonly previewKind: OutputKind | null
  readonly turn: number
  readonly revision: number
}

export interface OutputDockSnapshot {
  readonly entries: readonly PublishedOutput[]
  readonly history: readonly PublishedOutput[]
}

export interface OutputDockViewNode extends ConversationViewNode {
  readonly target: 'outputDock'
  readonly anchorSeq: number
  readonly location: ConversationLocation
  readonly data: { readonly publication: OutputPublication }
}
```

Export `publicationKey(workId, resultId)` using a NUL separator and augment `ConversationViewSnapshotMap.outputDock`. `history` retains every successful publication node in sequence order; `entries` is the current same-identity fold. Remove `OutputDockTurnPayload` and path/first-turn/last-turn fields.

- [ ] **Step 5: Implement two durable lifecycle arms in one definition**

`collect.ts` starts contexts only for matching direct calls or matching Code Mode dispatch starts:

```ts
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
}
```

The start state stores the client-validated publication or `null`. Update accepts only the paired success type. `buildViewNode` returns `null` until the state is valid and successfully settled, then uses the settle sequence as `anchorSeq` and the start match's resolved location.

- [ ] **Step 6: Implement view folding and turn selection**

The builder holds a `Map<contextKey, OutputDockViewNode>`, sorts by `anchorSeq`, converts every resolved node to `history`, and folds that history to an insertion-ordered `Map<publicationKey, PublishedOutput>` for `entries`. Later nodes replace the current value for the same key without deleting and reinserting it. Derive `turn` only from `node.location.kind === 'turn' || 'step'`; omit unresolved publications from both lists.

Export:

```ts
export function publicationsForTurn(
  snapshot: OutputDockSnapshot,
  turn: number,
  closingSeq: number,
): readonly PublishedOutput[] {
  const latest = new Map<string, PublishedOutput>()
  for (const entry of snapshot.history) {
    if (entry.turn === turn && entry.revision <= closingSeq) latest.set(entry.key, entry)
  }
  return [...latest.values()]
}
```

- [ ] **Step 7: Run and commit the durable model**

Run:

```powershell
npm test -- --run tests/collect.test.ts tests/view.test.ts
npm run typecheck
git add src/client/contract.ts src/client/collect.ts src/client/view.ts tests/collect.test.ts tests/view.test.ts
git commit -m "feat: derive published session results"
```

Expected: native, Code Mode, failure, replacement, and turn-filter tests pass.

### Task 4: Build The Per-Session Dock Store

**Files:**
- Create: `src/client/dock-store.ts`
- Create: `tests/dock-store.test.ts`

- [ ] **Step 1: Write failing store tests**

Use an in-memory `Storage` stub and assert session isolation:

```ts
it('keeps open tabs and focus isolated by session', () => {
  const store = createOutputDockUiStore(memoryStorage())
  store.open('session-a', 'sales\u0000dashboard')
  store.open('session-a', 'marketing\u0000visual')
  store.open('session-b', 'ops\u0000report')
  store.collapse('session-b')

  expect(store.get('session-a')).toEqual({
    open: true,
    opened: ['sales\u0000dashboard', 'marketing\u0000visual'],
    active: 'marketing\u0000visual',
  })
  expect(store.get('session-b')).toEqual({
    open: false,
    opened: ['ops\u0000report'],
    active: 'ops\u0000report',
  })
})

it('reconciles removed or link-converted publications', () => {
  const store = createOutputDockUiStore(memoryStorage())
  store.open('s1', 'a\u0000one')
  store.open('s1', 'a\u0000two')
  store.reconcile('s1', new Set(['a\u0000one']))
  expect(store.get('s1')).toEqual({ open: true, opened: ['a\u0000one'], active: 'a\u0000one' })
})
```

Also cover closing active/middle/final tabs, version-2 data being ignored, reload hydration, and positive session removal.

- [ ] **Step 2: Run the store test and confirm the module is absent**

Run:

```powershell
npm test -- --run tests/dock-store.test.ts
```

Expected: FAIL because `dock-store.ts` does not exist.

- [ ] **Step 3: Implement the external store**

Export this interface:

```ts
export interface SessionDockState {
  readonly open: boolean
  readonly opened: readonly string[]
  readonly active: string | null
}

export interface OutputDockUiStore {
  get(sessionId: string): SessionDockState
  subscribe(sessionId: string, listener: () => void): () => void
  open(sessionId: string, key: string): void
  activate(sessionId: string, key: string): void
  closeTab(sessionId: string, key: string): void
  collapse(sessionId: string): void
  restore(sessionId: string): void
  reconcile(sessionId: string, localKeys: ReadonlySet<string>): void
  removeSession(sessionId: string): void
}
```

Persist `{ version: 3, sessions }` under `dsh-output-dock:v3`. Every mutation creates new session and root objects, notifies only that session's listeners, and writes once. `closeTab` selects the right neighbor, then the left neighbor, and closes the dock when no tabs remain.

- [ ] **Step 4: Run the new store and existing suites**

Run:

```powershell
npm test -- --run tests/dock-store.test.ts
npm test -- --run
```

Expected: the new store suite and all existing suites pass; the old panel still uses its unchanged state helper until Task 6 replaces both together.

- [ ] **Step 5: Commit the state model**

Run:

```powershell
git add src/client/dock-store.ts tests/dock-store.test.ts
git commit -m "feat: persist output tabs by session"
```

Expected: the commit adds the session store without temporarily breaking the old panel.

### Task 5: Add Conversation Result Actions

**Files:**
- Create: `src/client/ResultActions.tsx`
- Create: `tests/result-actions.test.ts`
- Modify: `src/client/index.ts`
- Modify: `src/client/locales.ts`

- [ ] **Step 1: Write failing selector and destination tests**

```ts
import { describe, expect, it, vi } from 'vitest'
import { actionDestination, selectPublishedOutputs } from '../src/client/ResultActions.tsx'

it('claims only publications from the closing turn', () => {
  const owner = ownerWithOutputSnapshot([
    published('local', 2, 10),
    published('later', 3, 20),
  ], 2, 15)
  expect(selectPublishedOutputs(owner)?.map(item => item.resultId)).toEqual(['local'])
})

it('routes local results to Outputs and links to a browser tab', () => {
  expect(actionDestination(publishedLocal())).toEqual({ kind: 'dock', key: 'sales\u0000dashboard' })
  expect(actionDestination(publishedLink())).toEqual({ kind: 'browser', url: 'http://127.0.0.1:4173/' })
})
```

- [ ] **Step 2: Run the test and confirm the component is absent**

Run:

```powershell
npm test -- --run tests/result-actions.test.ts
```

Expected: FAIL because `ResultActions.tsx` does not exist.

- [ ] **Step 3: Implement selection and click routing**

Use the approved host owner field:

```ts
export function selectPublishedOutputs(owner: TurnTailOwnerProps): readonly PublishedOutput[] | null {
  const snapshot = owner.views.get('outputDock') ?? EMPTY_OUTPUT_DOCK_SNAPSHOT
  const entries = publicationsForTurn(snapshot, owner.turn.turn, owner.seq)
  return entries.length === 0 ? null : entries
}

export function actionDestination(output: PublishedOutput):
  | { readonly kind: 'dock'; readonly key: string }
  | { readonly kind: 'browser'; readonly url: string } {
  return output.kind === 'link'
    ? { kind: 'browser', url: output.url as string }
    : { kind: 'dock', key: output.key }
}
```

`ResultActions` receives `sessionId`, `matched`, `dockStore`, and `layout`. Local clicks call `dockStore.open(sessionId, key)` then `layout.openDetails('output-dock')`. Link clicks call `window.open(url, '_blank', 'noopener,noreferrer')`. Render compact buttons labelled `${workTitle} · ${label}` with `FileText`, `Image`, or `ExternalLink` icons and native title/ARIA text.

- [ ] **Step 4: Register the chain entry**

In `src/client/index.ts`:

```ts
ctx.slots.inject('conversation.chat.turnTail', () => ctx.slots.register({
  name: 'conversation.chat.turnTail',
  order: 80,
  select: selectPublishedOutputs,
  locale: NS,
  inject: () => ({ dockStore, layout: ctx.layout }),
}, ResultActions))
```

Add concise Chinese and English labels for open output and open link.

- [ ] **Step 5: Run and commit the conversation surface**

Run:

```powershell
npm test -- --run tests/result-actions.test.ts tests/locales.test.ts
npm run typecheck
git add src/client/ResultActions.tsx src/client/index.ts src/client/locales.ts tests/result-actions.test.ts tests/locales.test.ts
git commit -m "feat: show published results in conversation"
```

Expected: selectors decline empty turns, local and URL destinations differ, and both locale dictionaries retain identical keys.

### Task 6: Replace The Inventory With Horizontal Result Tabs

**Files:**
- Replace: `src/client/DockPanel.tsx`
- Modify: `src/client/preview.tsx`
- Modify: `src/client/resources.ts`
- Modify: `src/client/locales.ts`
- Modify: `src/client/style.ts`
- Create: `tests/dock-tabs.test.ts`
- Modify: `tests/viewport.test.ts`
- Delete: `src/client/qc-state.ts`
- Delete: `tests/qc-state.test.ts`
- Delete: `src/client/sidebar-state.ts`
- Delete: `tests/sidebar-state.test.ts`

- [ ] **Step 1: Write failing tab model tests**

Keep render decisions pure and testable:

```ts
it('resolves opened local identities in stored order', () => {
  const state = { open: true, opened: ['b\u0000two', 'a\u0000one'], active: 'b\u0000two' }
  const model = dockTabs(state, snapshot([
    local('a', 'one', 1), local('b', 'two', 2), link('c', 'site', 3),
  ]))
  expect(model.tabs.map(tab => tab.key)).toEqual(['b\u0000two', 'a\u0000one'])
  expect(model.active?.key).toBe('b\u0000two')
})

it('never turns links into tabs', () => {
  expect(dockTabs(
    { open: true, opened: ['c\u0000site'], active: 'c\u0000site' },
    snapshot([link('c', 'site', 3)]),
  ).tabs).toEqual([])
})
```

- [ ] **Step 2: Run the tab test and confirm the helper is absent**

Run:

```powershell
npm test -- --run tests/dock-tabs.test.ts
```

Expected: FAIL because `dockTabs` is not defined.

- [ ] **Step 3: Implement the dock model and panel behavior**

Export `dockTabs(state, snapshot)` from `DockPanel.tsx`. It maps only `document` and `visual` entries with non-null `previewKind`, preserves `state.opened` order, and resolves `state.active` without selecting newly published results.

Render a stable header:

```tsx
<header className="dsh-od-header">
  <span className="dsh-od-title">Outputs</span>
  <div className="dsh-od-tabs" role="tablist" aria-label={t('dock.tabs')}>
    {tabs.map(tab => (
      <div className="dsh-od-tab-wrap" key={tab.key} data-active={tab.key === active?.key || undefined}>
        <button type="button" role="tab" aria-selected={tab.key === active?.key}
          onClick={() => dockStore.activate(sessionId, tab.key)}>
          {tab.workTitle} · {tab.label}
        </button>
        <button type="button" aria-label={t('dock.closeTab', { name: tab.label })}
          onClick={() => dockStore.closeTab(sessionId, tab.key)}>
          <X size={13} aria-hidden />
        </button>
      </div>
    ))}
  </div>
  <IconButton label={t('dock.collapse')} onClick={collapse}>
    <PanelRightClose size={16} aria-hidden />
  </IconButton>
</header>
```

The preview key is `${active.key}:${active.revision}:${manualRefresh}`. The toolbar contains Refresh, Copy Path, Download, and Close. Remove pin, hide, picker, auto-selection, auto-open, and QC summary state.

- [ ] **Step 4: Preserve explicit unavailable and refresh states**

Add `revision: number` to `fileUrl(path, revision)` as `&v=${revision}`. Pass revision through preview resource URLs. When fetch/image/PDF loading fails, keep the tab and render `preview.unavailable` with a Refresh button. Manual refresh increments only the active preview's local counter.

- [ ] **Step 5: Replace CSS with fixed tab geometry**

Use these constraints in `style.ts`:

```css
.dsh-od-header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) 30px;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 8px 10px 8px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}
.dsh-od-tabs {
  display: flex;
  min-width: 0;
  height: 32px;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}
.dsh-od-tab-wrap {
  display: grid;
  flex: 0 0 auto;
  max-width: min(220px, 55vw);
  height: 30px;
  grid-template-columns: minmax(0, 1fr) 24px;
  align-items: center;
  border-bottom: 2px solid transparent;
}
.dsh-od-tab-wrap[data-active] {
  border-bottom-color: var(--dsw-alias-label-primary);
}
.dsh-od-tab-wrap > [role='tab'] {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

Result action buttons wrap on narrow chat widths. The mobile sheet remains full-height. No text uses viewport-scaled font sizes.

- [ ] **Step 6: Reconcile and restore per-session state without auto-opening**

The panel subscribes to the current `outputDock` snapshot and `dockStore` session slice. On snapshot changes, call `reconcile` with only local preview keys. On session change, schedule restoration after DSH's own close effect:

```ts
useEffect(() => {
  const state = dockStore.get(sessionId)
  if (!state.open || state.opened.length === 0) return
  queueMicrotask(() => layout.openDetails(OUTPUT_SURFACE))
}, [dockStore, layout, sessionId])
```

No publication effect calls `openDetails`. The launcher appears only when the current session has at least one opened tab and the surface is closed; clicking it calls `restore` and opens the named surface.

- [ ] **Step 7: Run tab, viewport, preview, and full tests**

Run:

```powershell
npm test -- --run tests/dock-tabs.test.ts tests/viewport.test.ts tests/resources.test.ts
npm test -- --run
npm run typecheck
```

Expected: all suites pass; there is no reference to `reconcileSelection`, pin/hide state, or automatic `openDetails` on publication.

- [ ] **Step 8: Commit the new panel**

Run:

```powershell
git add src/client/DockPanel.tsx src/client/preview.tsx src/client/resources.ts src/client/locales.ts src/client/style.ts src/client/qc-state.ts src/client/sidebar-state.ts tests/dock-tabs.test.ts tests/viewport.test.ts tests/qc-state.test.ts tests/sidebar-state.test.ts
git commit -m "feat: add session-scoped output tabs"
```

Expected: the commit replaces inventory navigation and its QC summary state with the on-demand tab model.

### Task 7: Register Lifecycle Cleanup And Session Removal

**Files:**
- Modify: `src/client/index.ts`
- Modify: `src/client/dock-store.ts`
- Modify: `tests/dock-store.test.ts`
- Modify: `cordis.patch.yml`

- [ ] **Step 1: Add a failing positive-removal test**

```ts
it('removes only a session that was previously observed and then deleted', () => {
  const store = createOutputDockUiStore(memoryStorage())
  store.open('s1', 'a\u0000one')
  store.noteSessions(['s1', 's2'])
  store.noteSessions(['s2'])
  expect(store.get('s1')).toEqual(EMPTY_SESSION_DOCK_STATE)
  expect(store.get('s2')).toEqual(EMPTY_SESSION_DOCK_STATE)
})

it('does not prune during initial catalog population', () => {
  const storage = persistedStorageFor('s1')
  const store = createOutputDockUiStore(storage)
  store.noteSessions([])
  expect(store.get('s1').opened).toEqual(['a\u0000one'])
})
```

- [ ] **Step 2: Run and verify the lifecycle method is absent**

Run:

```powershell
npm test -- --run tests/dock-store.test.ts
```

Expected: FAIL because `noteSessions` is not defined.

- [ ] **Step 3: Implement observed-catalog cleanup**

Add `noteSessions(ids: readonly string[]): void` to the store. The first non-empty catalog seeds `observedSessionIds` without pruning. Later calls remove persisted states only for ids that were previously observed and are now absent, then replace the observed set.

In the root-scoped launcher, subscribe to `useSessions(state => state.ids)` and pass ids into `noteSessions` from an effect. Session-scoped panel instances remain responsible only for their active session.

- [ ] **Step 4: Verify Cordis disposal and bundle metadata**

Ensure every registration is inside `ctx.effect`, `ctx.slots.inject`, or a registry whose registration is owned by the plugin fiber. Update `cordis.patch.yml` comments to describe explicit publication rather than automatic file collection. No new shipped DSH package row is added.

- [ ] **Step 5: Run and commit lifecycle behavior**

Run:

```powershell
npm test -- --run tests/dock-store.test.ts
npm run typecheck
git add src/client/index.ts src/client/dock-store.ts tests/dock-store.test.ts cordis.patch.yml
git commit -m "fix: clean output state with session lifecycle"
```

Expected: catalog hydration preserves stored sessions and a later positive removal deletes only the removed session.

### Task 8: Update The Release Documentation

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `README.md`
- Modify: `README.zh.md`
- Modify: `docs/images/show1.png` after visual verification
- Modify: `docs/images/show2.png` after visual verification

- [ ] **Step 1: Write the new README behavior before changing screenshots**

Replace automatic-opening claims with these exact concepts in both languages:

```markdown
- The agent publishes finished, inspectable results explicitly.
- Results appear beside the completed reply and open only when selected.
- Local documents and visuals use session-scoped tabs in Outputs.
- Deployed pages open in a regular browser tab; Output Dock does not embed development servers.
- Source files, configuration, and incidental project files are not collected.
```

Document the required DSH `details.overlay`, named surface API, and turn-tail `views` owner field. Update Use to show one local artifact click, one deployed link click, collapse, and session restoration.

- [ ] **Step 2: Bump package metadata to `0.3.0`**

Run:

```powershell
npm version 0.3.0 --no-git-tag-version
```

Expected: `package.json` and `package-lock.json` both report `0.3.0`.

- [ ] **Step 3: Run copy and package checks**

Run:

```powershell
rg -n "automatically|newest output|pin|hide|all produced|自动打开|最新产出|置顶|隐藏" README.md README.zh.md src/client/locales.ts
npm test -- --run tests/locales.test.ts
```

Expected: `rg` finds no obsolete product claims; locale tests pass.

- [ ] **Step 4: Commit metadata and prose without claiming new screenshots yet**

Run:

```powershell
git add package.json package-lock.json README.md README.zh.md
git commit -m "docs: describe on-demand result workspace"
```

Expected: the commit includes bilingual prose and version metadata only.

### Task 9: Verify, Exercise In DSH, And Refresh Screenshots

**Files:**
- Modify: `docs/images/show1.png`
- Modify: `docs/images/show2.png`

- [ ] **Step 1: Run fresh automated verification**

Run:

```powershell
npm test -- --run
npm run typecheck
npm run build
git diff --check
```

Expected: all tests pass, typecheck and build exit `0`, and the diff check prints nothing.

- [ ] **Step 2: Rebuild the local DSH client package and plugin**

Run in `D:\deepseek-harness`:

```powershell
pnpm --filter @deepseek-ai/dsh-client-ui-conversation bundle
pnpm --filter @deepseek-ai/dsh-client-ui-layout bundle
```

Run in `D:\DS_chajiankaifa\dsh-output-dock`:

```powershell
npm run build
dsh plugin --profile web add .
```

Expected: both host client bundles and Output Dock build; the web profile resolves `dsh-output-dock` without a missing export.

- [ ] **Step 3: Start or reuse the DSH web server**

If `http://127.0.0.1:5173/` is not responding, run the repository's existing web profile command from `D:\deepseek-harness` and keep the process session alive. If port 5173 is occupied by the intended DSH instance, reuse it.

Expected: the DSH conversation UI loads and the browser console has no module-loader or slot-registration errors.

- [ ] **Step 4: Exercise the acceptance scenario**

Use a fixture or real agent call to produce these publications:

```json
{"workId":"sales","workTitle":"Sales","resultId":"dashboard","label":"Dashboard","kind":"visual","path":"docs/images/show1.png"}
{"workId":"marketing","workTitle":"Marketing","resultId":"visual","label":"Visual","kind":"visual","path":"docs/images/show2.png"}
{"workId":"app","workTitle":"Demo App","resultId":"preview","label":"Preview","kind":"link","url":"http://127.0.0.1:5173/"}
```

Verify: no automatic panel opening; the two local action buttons create two horizontal tabs only after clicking; the URL opens a new browser tab; collapse and restore retain the active tab; switching to a second session shows that session's independent closed state.

- [ ] **Step 5: Verify desktop and mobile rendering**

Use browser screenshots at `1440x900`, `1024x768`, and `390x844`. Check that tabs scroll without resizing the header, labels truncate without overlap, the preview is nonblank, SVG/image content is contained, the launcher does not cover composer controls, and the compact sheet fits the viewport.

- [ ] **Step 6: Replace the two README images with verified captures**

Capture one desktop image showing conversation result actions plus the open horizontal tabs, and one compact or visual-preview image showing a contained output. Save them as `docs/images/show1.png` and `docs/images/show2.png`.

- [ ] **Step 7: Run final verification and commit screenshots**

Run:

```powershell
npm test -- --run
npm run typecheck
npm run build
git diff --check
git add docs/images/show1.png docs/images/show2.png
git commit -m "docs: refresh output dock screenshots"
git status --short
```

Expected: all checks pass and the plugin repository is clean. The DSH repository remains dirty only with the intentional details-column and turn-tail prerequisite changes.

- [ ] **Step 8: Push the completed plugin release**

Run:

```powershell
git log --oneline --decorate -8
git push origin main
```

Expected: `origin/main` advances through the `0.3.0` implementation and screenshot commits; no DSH worktree commit is pushed from the plugin repository.
