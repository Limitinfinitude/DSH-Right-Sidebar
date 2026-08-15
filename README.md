# Output Dock

English | [中文](README.zh.md)

A native output sidebar for DeepSeek Harness. Produced files stay beside the
conversation in a resizable, session-aware preview workspace.

![Output Dock overview](docs/images/show1.png)

## Overview

Output Dock derives files directly from successful mutation tool records. Documents,
visuals, pages, and PDFs open automatically in DSH's right column. Source and
configuration files remain available without stealing the current preview.

The panel follows DSH's theme and locale, yields the column to tool details when
needed, and can be collapsed or restored from the right edge.

## Highlights

- Keeps a permanent, collapsible launcher on the right edge
- Uses closeable, draggable browser-style tabs with per-session persisted order
- Restores closed tabs only when the same file is produced again
- Adapts HTML, Markdown, text, images, and SVGs to narrow sidebar widths
- Copies paths or content, downloads files, and opens the containing folder
- Runs Markdown, SVG, HTML, and image checks internally without adding UI noise
- Rebuilds outputs when switching or reopening sessions

## Visual Output

Markdown, SVG, HTML, PDF, and image previews are rendered inside the dock. Relative
resources stay anchored to the produced file, while fixed-width pages and long text
are constrained to the available column width.

![SVG preview in Output Dock](docs/images/show2.png)

## Install

Output Dock currently targets a DSH Web build that exposes the session-scoped
`details.overlay` slot and named details-surface APIs.

```sh
git clone https://github.com/Limitinfinitude/DSH-Output-Dock.git
cd DSH-Output-Dock
npm install
npm run build
dsh plugin --profile web add .
```

Refresh the DSH Web session after installation.

## Use

1. Ask DSH to create a document, diagram, image, page, or source file.
2. Previewable results open automatically; source files are added quietly.
3. Switch, close, or drag tabs to arrange the current session's outputs.
4. Use the footer controls to copy, reveal, download, pin, or hide an entry.

## Supported Formats

| Category | Formats |
|---|---|
| Documents | Markdown, MDX, PDF |
| Visuals | SVG, PNG, JPEG, WebP, GIF, AVIF, BMP |
| Web | HTML, HTM |
| Text and code | Common source, configuration, data, and plain-text extensions |

## How It Works

The Node half exposes a workspace-confined, read-only file route. The client half
derives output paths from mutation tool records, folds them into a per-session view,
and registers the viewer in DSH's native details column. Preview content is sanitized
before rendering; quality checks are deterministic and use no model calls.

## Development

```sh
npm test -- --run
npm run typecheck
npm run build
```

## Current Limitations

- File reads are limited to the boot workspace and registered DSH workspaces.
- HTML previews use a script-free sandbox.
- Viewing preferences are stored in the browser; output history is rebuilt from the session log.
- Deployed development servers are not embedded yet; this release previews their produced files.

## License

[MIT](LICENSE)
