# Output Dock Session Result Workspace Design

## Summary

Output Dock will stop treating every modified file as a user-facing output. It will become an on-demand, session-scoped result workspace: the agent explicitly publishes inspectable results, the conversation shows those results after the corresponding assistant turn, and the right column opens only after a user chooses a local result or restores a dock they previously opened.

The conversation remains the primary surface. Source files, configuration files, ordinary project documentation, and development-server ports are not collected automatically. Deployed URLs open in the external browser instead of becoming embedded browser tabs.

## Product Rules

1. The Outputs column starts closed for a new session.
2. Publishing a result never opens the column or changes the active tab.
3. A completed assistant turn shows compact result actions for successful publications from that turn.
4. Clicking a local document or visual result opens it in Outputs and creates or activates its horizontal tab.
5. Clicking a deployed page or other URL opens the URL in the external browser. It does not create an Outputs tab.
6. The dock contains only local results the user has opened. It is not a complete file inventory.
7. Source code, configuration, ordinary project documentation, and incidental mutation-tool paths never appear unless the agent deliberately publishes a file as a user-facing document or visual.
8. Each result label includes work context because one session may contain several unrelated work streams. A tab reads, for example, `Sales · Dashboard` or `Marketing · Visual`.
9. Each session owns independent dock state: open or closed, opened tabs, active tab, and tab order.
10. Switching sessions restores the selected session's dock state. A result published in a background session never opens a panel, changes a tab, or steals focus in the current session.

## Publication Contract

The Node half registers one model-visible tool named `output_dock_publish`. The tool is the only way a result becomes eligible for the conversation result row or Outputs.

```ts
interface OutputPublication {
  workId: string
  workTitle: string
  resultId: string
  label: string
  kind: 'document' | 'visual' | 'link'
  path?: string
  url?: string
}
```

`workId` and `resultId` are stable, model-chosen identifiers within a session. The visible identity is `(workId, resultId)`. Publishing the same identity again updates the existing result rather than creating a duplicate. `workTitle` and `label` are short user-facing strings; the client renders `${workTitle} · ${label}`.

The resource rules are strict:

- `document` and `visual` require `path` and reject `url`.
- `link` requires an absolute `http:` or `https:` URL and rejects `path`.
- Paths must resolve to an existing regular file inside the boot workspace or a registered DSH workspace.
- Paths must use a preview format already supported by the file route. The publish tool does not infer intent from an extension.
- All identifiers and labels must be non-empty after trimming and have conservative length limits.

The tool description tells the agent to publish only finished, directly inspectable user results. It explicitly tells the agent not to publish source code, configuration, incidental project files, or every file in a generated application. A deployed application is published as a `link` with its reachable URL.

The canonical success value repeats the normalized publication. The model-facing result is one short confirmation so the agent can mention the result naturally without receiving file contents. Validation or inaccessible resources fail the tool and create no visible result.

## Durable Derivation

No new session event type is required. Output Dock derives publications from DSH's existing durable tool lifecycle:

- Native mode: start from `tool/call` where `name === 'output_dock_publish'`, retain its raw arguments, and commit only after the paired successful `tool/result`.
- Code Mode: start from `tool/code-dispatch-start` where `name === 'output_dock_publish'`, then commit the recorded arguments only after the paired successful `tool/code-dispatch`.

The client validates the recorded arguments again because the session log is a durable input boundary. Failed, aborted, incomplete, and malformed calls produce no publication.

One conversation definition publishes each successful call into a dedicated `outputDock` session view. Every published entry retains its engine-resolved turn location. The view snapshot keeps immutable publication history for closing-turn result actions and separately folds the current result set in sequence order, replacing an earlier current item when `(workId, resultId)` repeats. The latest successful event supplies the current label, kind, resource, turn, and revision sequence without removing the action attached to an earlier completed reply.

This design preserves results across reload and historical-session replay, works in both native and Code Mode, and avoids a second persistence mechanism for result content.

## Conversation Surface

Output Dock registers a new entry in `conversation.chat.turnTail`. DSH's `TurnTailOwnerProps` is extended with the current session's read-only conversation view store. Its selector reads `outputDock`, filters entries to the owner's closing turn and sequence, and claims the chain only when that turn contains one or more successful publications. This small host extension is required because Code Mode dispatch events have engine-resolved locations but intentionally do not duplicate `turn` and `step` fields in their event payloads.

The row contains compact result actions, not a file list. Each action shows the contextual title and a restrained kind icon. Local results call the dock controller with their result identity. Link results call the browser's external navigation capability with `noopener,noreferrer` behavior. The row does not expose filesystem paths or URLs as primary labels.

The existing DSH `ui-deliverables` row remains independent. Output Dock no longer mirrors mutation-tool locations, so installing this plugin does not change DSH's generic produced-file behavior. A future upstream integration may let deployments disable that generic row, but this release does not take over another package's slot.

## Dock Model

The right column uses a browser-like horizontal tab strip without embedding a browser:

- Tabs represent only local `document` and `visual` publications the user opened.
- Opening a result adds its identity to the end of the session's tab order or activates the existing tab.
- Re-publishing an open identity refreshes the tab's metadata and preview revision without changing focus.
- Tabs can be activated and closed. Closing the final tab closes the dock for that session.
- The header contains `Outputs`, the scrollable tab strip, and a collapse button.
- The active result owns the preview canvas and the small action toolbar for refresh, copy path, download, and open externally where supported.
- Pin, hide, the all-files picker, automatic newest-file selection, and automatic quality summaries are removed. They belong to the old inventory model and add state without serving the on-demand workflow.

Markdown, PDF, SVG, raster image, HTML, and plain text rendering continue to use the existing preview modules and workspace-confined file route. HTML remains script-free and sandboxed; a deployed interactive application is represented by a link and opened externally. Refresh increments a view-local request revision. A re-publication uses the durable event sequence as a new content revision so an already-open preview reloads.

## Session UI State

The client introduces a focused `OutputDockUiStore` instead of keeping navigation state inside `DockPanel.tsx`.

```ts
interface SessionDockState {
  open: boolean
  opened: readonly string[]
  active: string | null
}

interface PersistedDockState {
  version: 3
  sessions: Record<string, SessionDockState>
}
```

Each string in `opened` is the encoded `(workId, resultId)` identity. The store exposes operations to open a result, activate a tab, close a tab, collapse a session, restore a session, reconcile publications, and remove a session.

State is persisted in browser `localStorage` under a versioned key. Persisted state contains only navigation preferences, never result metadata or file contents. Durable publication history always comes from the session log. On hydration or replay, reconciliation drops opened identities that no longer exist in the session view and chooses the nearest surviving tab when the active identity disappears.

The dock observes the current DSH session id. On a session change it first lets DSH close the previous details surface, then restores Outputs only when the newly selected session has `open: true` and at least one surviving opened tab. An inactive session's view may update in memory, but no store operation runs merely because a publication arrived.

The store removes a session record after the runtime reports that a previously observed session was deleted. It does not prune records during initial catalog loading, when absence is not evidence of deletion.

## Layout Coordination

Output Dock continues to use the named details-surface API and `details.overlay` slot in the current local DSH integration:

```ts
layout.openDetails('output-dock')
layout.closeDetails()
layout.getDetailsSurface()
layout.subscribeDetailsSurface(listener)
```

Manual collapse writes `open: false` before closing the details surface. Opening a conversation result writes the selected session state before calling `openDetails`. If another details owner replaces Output Dock, the store records Outputs as closed only when the replacement follows an explicit user action or session switch; a transient layout concession must not erase the user's saved session state.

After at least one tab has been opened, closing the column leaves a restrained edge launcher for that session. The launcher restores the saved active tab. Before the first local result is opened, no launcher is shown.

Compact viewports keep the existing full-height mobile sheet behavior. Tabs scroll horizontally and retain stable height; labels truncate rather than resize the header.

## Failures And Lifecycle

- Missing or deleted file: keep the tab and show a recoverable unavailable state with Refresh and Close. Do not silently remove durable history.
- Unsupported or unsafe path: reject `output_dock_publish`; no result action appears.
- Invalid or unreachable URL: validate URL syntax at publish time. Network reachability is left to the external browser and is not polled.
- Updated result identity: replace metadata and revision in place. If its kind changes from local to link, remove the identity from opened tabs during reconciliation; its conversation action now opens externally.
- Plugin unload: dispose the tool registration, conversation definitions, view definition, slots, locale dictionaries, and styles through Cordis effects. Browser state remains for reinstall.
- Session deletion: remove only that session's UI-state record after a positive removal signal.

## Code Organization

The next implementation splits the old inventory component into bounded units:

- `src/publish.ts`: tool schema, normalization, resource validation, and tool registration.
- `src/client/contract.ts`: publication, view snapshot, turn data, and declaration merges.
- `src/client/collect.ts`: native and Code Mode durable-event state machines.
- `src/client/view.ts`: per-session publication fold and same-identity replacement.
- `src/client/dock-store.ts`: versioned per-session UI state and persistence.
- `src/client/ResultActions.tsx`: assistant turn-tail result actions.
- `src/client/DockPanel.tsx`: panel shell, tabs, launcher, and preview orchestration.
- Existing `preview.tsx`, `resources.ts`, `formats.ts`, and the secure Node file route remain focused on local preview rendering.

The old path-based `OutputEntry`, auto-open reconciliation, pin/hide persistence, all-files picker, and mutation-tool collector are deleted rather than retained as compatibility paths.

## Testing

Focused tests cover:

- tool argument validation, path confinement, file existence, extension policy, and URL protocol policy;
- native and Code Mode successful publication derivation;
- failed, aborted, incomplete, malformed, and unrelated tool calls;
- same-identity updates and ordering across multiple work contexts in one session;
- turn-tail selection and local-versus-link click routing;
- per-session open tabs and active-tab restoration across session switches;
- no auto-open on foreground or background publication;
- tab close fallback, changed-kind reconciliation, missing-file state, and session deletion cleanup;
- desktop and compact viewport tab overflow without text overlap;
- existing sanitization, SVG fitting, resource rewriting, route security, locale, typecheck, and build regressions.

The acceptance scenario uses two sessions. Session A publishes and opens two local results from different work contexts, then collapses. Session B publishes a local result and a deployed URL without opening Outputs. Switching between them restores A's collapsed tab set and B's closed state; clicking B's URL opens externally, while clicking B's local result opens only B's new tab.

## Release Scope

This is the `0.3.0` behavior change. The README and screenshots will be updated after the implementation is visually verified. The existing public `0.2.0` release remains the baseline until the new interaction passes tests and browser review.

The local DSH named details-column changes and the read-only turn-tail view-store owner field are prerequisites and stay in the separate `D:\deepseek-harness` worktree. Output Dock will not commit or rewrite unrelated DSH changes as part of the plugin release.
