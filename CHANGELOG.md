# Changelog

All notable changes to DSH Right Sidebar are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses semantic versioning.

## [0.3.1] - 2026-09-12

### Fixed

- SVG previews no longer collapse into a small, offset box in the middle of the stage. The
  `.dsh-od-media-svg` wrapper now has an explicit size, so the inner `svg` — which sizes itself to
  `100%`/`100%` — fills the stage and letterboxes correctly instead of falling back to the browser's
  default replaced-element dimensions.
- Stemless extension fragments such as `` `.svg` ``, `-.svg`, or `….svg` mentioned in an assistant
  message no longer enter the outputs catalog as fake entries. `outputDisposition` now requires a
  name stem with at least one letter or digit (Unicode-aware, so `图.svg` still publishes). Existing
  bogus entries disappear on the next snapshot rebuild.

## [0.3.0] - 2026-09-11

### Added

- Media outputs: MP4, M4V, WebM, OGV, and MOV render in a native video player; MP3, WAV, OGG, OGA,
  OPUS, M4A, FLAC, and AAC render in a native audio player. Neither is fetched as text.
- More image formats: ICO, TIFF, and JFIF join the automatic-output list, alongside the `markdown`
  extension for Markdown files.
- On-demand IPYNB outputs, shown only when the agent explicitly names the notebook.
- Quality-check badge: broken relative links, unbalanced fences, SVG and HTML structure problems,
  failed image loads, and unplayable media now surface in the dock instead of being computed and dropped.
- Per-item unhide with a hidden-count entry point, so a hidden output can return without clearing the
  whole hidden list.
- Catalog search across file names and paths, turn grouping (`Turn N` sections), and a close-all action.
- Saving feedback for rendered Markdown editing: saving, saved, and failure states.
- Keyboard shortcuts: `Alt+]` / `Alt+[` cycle outputs, `Alt+W` closes the current tab, `Alt+O` toggles
  the sidebar, and `Esc` dismisses popovers.
- Draggable left edge that persists the sidebar width between sessions (320–860 px).

### Changed

- The Markdown editor now reports save progress through the same debounced write path instead of
  failing silently.
- Browser bundle grew to approximately `188 KB gzip`.

### Fixed

- `route.test.ts` no longer fails on Windows when the temporary directory's case differs between
  `TMPDIR` and `fs.realpath`.

## [0.2.0] - 2026-08-16

### Added

- Product-grade previews for JSON, JSONL, CSV, TSV, and TXT with search, sorting, and pagination.
- HTTP(S) file outputs delivered by the agent, proxied without cookies or authorization headers.
- Incomplete workspace paths resolved when exactly one file matches.
- Persistent, session-scoped tabs with pin, hide, drag reordering, and a reopenable catalog.
