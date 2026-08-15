# Output Dock Initial GitHub Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the current Output Dock plugin with an English UI title, bilingual documentation, and two supplied showcase images.

**Architecture:** Keep runtime behavior unchanged except for the localized heading. Treat the English and Chinese READMEs as paired entry points sharing the same screenshot assets, and publish the existing build outputs with the source so a checkout is inspectable and installable.

**Tech Stack:** TypeScript, React, Vitest, tsdown, Markdown, Git, GitHub CLI

---

### Task 1: Pin the Outputs heading

**Files:**
- Create: `tests/locales.test.ts`
- Modify: `src/client/locales.ts`

- [ ] Add a test asserting that both locale dictionaries expose `Outputs` for `dock.title`.
- [ ] Run `npm test -- --run tests/locales.test.ts` and confirm the Chinese assertion fails.
- [ ] Change the Chinese `dock.title` value to `Outputs`.
- [ ] Rerun the focused test and confirm it passes.

### Task 2: Add release presentation files

**Files:**
- Create: `.gitignore`
- Create: `LICENSE`
- Create: `docs/images/show1.png`
- Create: `docs/images/show2.png`
- Modify: `README.md`
- Modify: `README.zh.md`

- [ ] Copy the two supplied PNG files without recompression.
- [ ] Add a focused Git ignore list for dependencies, local QA output, logs, and editor state.
- [ ] Add the MIT license for 2026 Limitinfinitude.
- [ ] Rewrite both READMEs with reciprocal language links, the two screenshots, matching section order, accurate installation instructions, architecture, and current limitations.

### Task 3: Verify and publish

**Files:**
- Regenerate: `lib/index.js`
- Regenerate: `lib/client.js`
- Regenerate: `lib/client.js.map`
- Regenerate: `lib/types/**`

- [ ] Run `npm test -- --run` and require all tests to pass.
- [ ] Run `npm run typecheck` and require exit code 0.
- [ ] Run `npm run build` and require exit code 0.
- [ ] Initialize Git with branch `main`, inspect the complete status, and stage only the release files.
- [ ] Commit as `Initial Output Dock release`.
- [ ] Create public repository `Limitinfinitude/DSH-Output-Dock`, set it as `origin`, and push `main`.
- [ ] Verify the remote repository metadata and clean local status.
