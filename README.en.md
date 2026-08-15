# DSH Right Sidebar

[中文](README.md) | English

A native right sidebar for DeepSeek Harness. Produced files stay beside the
conversation in a resizable, session-aware preview workspace.

![DSH Right Sidebar overview](docs/images/show1.png)

## Overview

DSH Right Sidebar derives user-readable outputs directly from successful mutation tool records.
Documents, visuals, data text, and PDFs open automatically in DSH's right column. Source,
configuration, and HTML source files remain in the workspace rather than occupying the preview.

The panel follows DSH's theme and locale, yields the column to tool details when
needed, and can be collapsed or restored from the right edge.

## Highlights

- Keeps a permanent, collapsible launcher on the right edge
- Uses closeable, draggable browser-style tabs with per-session persisted order
- Reopens closed tabs from the footer session-output catalog, which scrolls after seven items
- Adapts Markdown, text, images, PDFs, and SVGs to narrow sidebar widths
- Copies paths or content, downloads files, and opens the containing folder
- Runs Markdown, SVG, HTML, and image checks internally without adding UI noise
- Rebuilds outputs when switching or reopening sessions

## Visual Output

Markdown, SVG, PDF, image, and common text/data previews are rendered inside the dock. Relative
resources stay anchored to the produced file, while images, graphics, and long text are
constrained to the available column width.

![SVG preview in DSH Right Sidebar](docs/images/show2.png)

## Install

DSH Right Sidebar currently targets a DSH Web build that exposes the session-scoped
`details.overlay` slot and named details-surface APIs.

```sh
git clone https://github.com/Limitinfinitude/DSH-Right-Sidebar.git
cd DSH-Right-Sidebar
npm install
npm run build
dsh plugin --profile web add .
```

Refresh the DSH Web session after installation.

## Use

1. Ask DSH to create a document, diagram, image, PDF, or data file.
2. Previewable results open automatically; source and project files stay in the DSH workspace.
3. Switch, close, or drag tabs to arrange the current session's outputs.
4. Reopen a closed item through the session-output catalog at the left of the footer.
5. Use the footer controls to copy, reveal, download, pin, or hide an entry.

## Supported Formats

| Category | Formats |
|---|---|
| Documents | Markdown, MDX, PDF |
| Visuals | SVG, PNG, JPEG, WebP, GIF, AVIF, BMP |
| Text and data | TXT, LOG, JSON, JSONL, CSV, TSV, YAML, TOML, XML, INI, CONF |
| Workspace files | Source, configuration, and HTML/HTM files stay out of the output dock |

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
- HTML/HTM source files are not treated as user outputs; deployed URLs open from the conversation.
- Viewing preferences are stored in the browser; output history is rebuilt from the session log.
- Deployed development servers are not embedded yet; this release previews their produced files.

## License

[MIT](LICENSE)
