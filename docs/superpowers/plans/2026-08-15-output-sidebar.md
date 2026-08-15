# Output Sidebar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the bottom-right output popup with a DSH-native right sidebar that opens on new output, previews the latest file immediately, preserves tool details, and supports common document, image, and source formats.

**Architecture:** DSH's layout package will declare an additive `details.overlay` session slot inside the real details grid column. `LayoutController` will track which details surface requested the column, so a tool-row click and the output sidebar can hand the same column back and forth without replacing each other. The plugin will render its full panel in that slot and retain only a slim edge launcher in `shell.overlay` while inactive.

**Tech Stack:** React 18, TypeScript, Cordis client slots, DSH layout service, Vitest/jsdom, DOMPurify, marked, lucide-react.

---

### Task 1: Add a composable details overlay slot to DSH

**Files:**
- Modify: `D:/deepseek-harness/packages/client/ui-layout/src/client/index.ts`
- Modify: `D:/deepseek-harness/packages/client/ui-layout/src/client/AppFrame.tsx`
- Modify: `D:/deepseek-harness/packages/client/ui-layout/src/client/AppFrame.module.css`
- Test: `D:/deepseek-harness/packages/client/ui-layout/tests/app-frame.client.spec.tsx`
- Test: `D:/deepseek-harness/packages/client/ui-layout/tests/apply.client.spec.ts`

- [ ] **Step 1: Write failing slot tests**

Assert that the root registration declares `details.overlay` as `{ kind: 'list', scope: 'session' }`, that `AppFrame` calls `renderSlot('details.overlay', {})`, and that the rendered overlay stays inside the mounted details column.

- [ ] **Step 2: Run the focused tests and confirm RED**

Run: `pnpm exec vitest run packages/client/ui-layout/tests/app-frame.client.spec.tsx packages/client/ui-layout/tests/apply.client.spec.ts`

Expected: failures because `details.overlay` is not declared or rendered.

- [ ] **Step 3: Implement the slot and column layer**

Add `details.overlay` to `SlotMap`, the root registration's `children`, and `AppFrameProps`. Render it in an absolutely positioned, pointer-safe layer inside a `position: relative` details column; keep the existing `details` occupant mounted beneath it.

- [ ] **Step 4: Run the focused tests and confirm GREEN**

Run the Step 2 command. Expected: all selected tests pass.

### Task 2: Coordinate details-surface ownership

**Files:**
- Modify: `D:/deepseek-harness/packages/client/ui-layout/src/client/service.ts`
- Modify: `D:/deepseek-harness/packages/client/ui-layout/src/client/index.ts`
- Modify: `D:/deepseek-harness/packages/client/ui-layout/src/client/AppFrame.tsx`
- Test: `D:/deepseek-harness/packages/client/ui-layout/tests/service.client.spec.ts`
- Test: `D:/deepseek-harness/packages/client/ui-layout/tests/apply.client.spec.ts`

- [ ] **Step 1: Write failing service tests**

Specify this public face:

```ts
interface ILayout {
  openDetails(surface?: string): void
  closeDetails(): void
  getDetailsSurface(): string | null
  subscribeDetailsSurface(listener: () => void): () => void
}
```

Verify that `openDetails()` selects `tool`, `openDetails('output-dock')` publishes the custom surface, redundant selections do not notify, and `closeDetails()` publishes `null`.

- [ ] **Step 2: Run tests and confirm RED**

Run: `pnpm exec vitest run packages/client/ui-layout/tests/service.client.spec.ts packages/client/ui-layout/tests/apply.client.spec.ts`

Expected: failures for missing surface methods and injected close callback.

- [ ] **Step 3: Implement the observable surface state**

Store the active surface on `LayoutController`, notify a `Set<() => void>` only on changes, and continue forwarding geometry actions. Inject `closeDetails: () => layout.closeDetails()` into `AppFrame` so session switches keep the observable state synchronized.

- [ ] **Step 4: Run tests and confirm GREEN**

Run the Step 2 command. Expected: all selected tests pass.

### Task 3: Expand output types and normalize preview resources

**Files:**
- Modify: `D:/DS_chajiankaifa/dsh-output-dock/package.json`
- Modify: `D:/DS_chajiankaifa/dsh-output-dock/src/index.ts`
- Modify: `D:/DS_chajiankaifa/dsh-output-dock/src/client/contract.ts`
- Modify: `D:/DS_chajiankaifa/dsh-output-dock/src/client/collect.ts`
- Create: `D:/DS_chajiankaifa/dsh-output-dock/src/client/resources.ts`
- Test: `D:/DS_chajiankaifa/dsh-output-dock/tests/resources.test.ts`

- [ ] **Step 1: Add Vitest and write failing format/resource tests**

Test `kindOfPath` for Markdown/MDX, SVG, raster/AVIF/BMP, HTML, PDF, and representative text/code extensions. Test sibling URL resolution for Windows and POSIX paths, while leaving anchors, data URLs, absolute URLs, and root URLs unchanged.

- [ ] **Step 2: Run plugin tests and confirm RED**

Run: `npm test -- --run tests/resources.test.ts`

Expected: failures for unsupported PDF/text extensions and missing resource helpers.

- [ ] **Step 3: Implement shared extension/MIME tables and resource rewriting**

Define one extension metadata table used by collection and the node route. Add MIME types for the new allowlist. Implement URL rewriting through `/api/output-dock/file?path=...` without weakening the route's workspace-root validation.

- [ ] **Step 4: Run plugin tests and confirm GREEN**

Run the Step 2 command. Expected: all tests pass.

### Task 4: Build immediate previews and SVG containment

**Files:**
- Modify: `D:/DS_chajiankaifa/dsh-output-dock/src/client/preview.tsx`
- Modify: `D:/DS_chajiankaifa/dsh-output-dock/src/client/qc.ts`
- Test: `D:/DS_chajiankaifa/dsh-output-dock/tests/resources.test.ts`

- [ ] **Step 1: Write failing SVG normalization tests**

Verify that sanitized SVGs receive a responsive `viewBox` derived from numeric width/height when possible, drop fixed dimensions, use `preserveAspectRatio="xMidYMid meet"`, and rewrite safe relative image references.

- [ ] **Step 2: Run the test and confirm RED**

Run: `npm test -- --run tests/resources.test.ts`

Expected: failure because SVG normalization is absent.

- [ ] **Step 3: Implement renderers**

Add dedicated loading/error states; Markdown with rewritten links/images; contained SVG; image; sandboxed HTML with rewritten relative assets; PDF iframe; and plain text/code preview. Avoid nested preview containers.

- [ ] **Step 4: Run the test and confirm GREEN**

Run the Step 2 command. Expected: all tests pass.

### Task 5: Replace the popup with the native sidebar experience

**Files:**
- Modify: `D:/DS_chajiankaifa/dsh-output-dock/src/client/index.ts`
- Replace: `D:/DS_chajiankaifa/dsh-output-dock/src/client/DockPanel.tsx`
- Replace: `D:/DS_chajiankaifa/dsh-output-dock/src/client/style.ts`
- Modify: `D:/DS_chajiankaifa/dsh-output-dock/src/client/locales.ts`
- Test: `D:/DS_chajiankaifa/dsh-output-dock/tests/sidebar-state.test.ts`

- [ ] **Step 1: Write failing selection tests**

Specify pure selection behavior: initial entries select the newest output; a newly produced output becomes selected; hiding the selected output chooses the next visible item; a stale selection is repaired.

- [ ] **Step 2: Run tests and confirm RED**

Run: `npm test -- --run tests/sidebar-state.test.ts`

Expected: failure because the selection helper does not exist.

- [ ] **Step 3: Implement the sidebar**

Register `OutputDockPanel` in `details.overlay` and a slim `OutputDockLauncher` in `shell.overlay`. Subscribe to `ctx.layout` surface state. Auto-select and preview the newest output, open the native details column on a new sequence, provide an accessible file switcher and icon toolbar, keep pin/hide/download/copy/QC behavior, and make the close action return ownership cleanly.

- [ ] **Step 4: Implement DSH-native styling**

Use the host's `--dsw-*` tokens, full-height unframed panel geometry, fixed control dimensions, visible focus states, reduced-motion handling, responsive preview containment, and an edge-attached launcher rather than a floating bottom-right card.

- [ ] **Step 5: Run tests and confirm GREEN**

Run: `npm test -- --run tests/sidebar-state.test.ts`

Expected: all tests pass.

### Task 6: Documentation, build, and browser verification

**Files:**
- Modify: `D:/DS_chajiankaifa/dsh-output-dock/README.zh.md`
- Modify: `D:/DS_chajiankaifa/dsh-output-dock/README.md`

- [ ] **Step 1: Update behavior and compatibility docs**

Document the native details-column slot requirement, automatic latest-file preview, manual/native control, expanded format table, SVG containment, and the inactive edge launcher.

- [ ] **Step 2: Run complete focused verification**

Run in the plugin: `npm test -- --run && npm run typecheck && npm run build`.

Run in DSH: `pnpm exec vitest run packages/client/ui-layout/tests && pnpm exec tsc -p packages/client/ui-layout/tsconfig.json --noEmit`.

Expected: every command exits 0 with no failed tests.

- [ ] **Step 3: Load the local plugin and inspect both viewports**

Start/restart the DSH web app, generate representative Markdown/SVG/PDF/text outputs, and capture desktop plus narrow screenshots. Verify the panel occupies the right grid column, the center column resizes, latest output is visible without a click, the edge launcher reopens it, tool-details selection takes ownership, SVG stays contained, and controls do not overlap.

- [ ] **Step 4: Run the Impeccable detector once**

Run: `node C:/Users/Infinite/.codex/skills/impeccable/scripts/detect.mjs --json src/client/DockPanel.tsx src/client/style.ts src/client/preview.tsx`

Fix mechanical findings once, rebuild, and perform one final screenshot round.
