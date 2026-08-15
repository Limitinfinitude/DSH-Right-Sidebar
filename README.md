# Output Dock

English | [中文](README.zh.md)

A native output sidebar for DeepSeek Harness. Agent-produced documents, diagrams,
images, pages, and code stay beside the conversation and open at the moment they
are created.

![Output Dock overview](docs/images/show1.png)

## Overview

Output Dock closes the gap between producing a file and inspecting it. The newest
useful output opens directly in DSH's resizable right column, while every produced
file remains available from the same session-scoped list.

The panel follows DSH's theme and locale, yields the column to tool details when
needed, and can be collapsed or restored from the right edge.

## Highlights

- Selects and renders the newest output automatically
- Rebuilds the output list when a historical session is opened
- Switches between files without leaving the conversation
- Copies paths or content, downloads files, and supports pin and hide controls
- Checks Markdown links, SVG structure, HTML parsing, and image loading locally
- Fits fixed-size SVGs through `viewBox` normalization and safe resource rewriting
- Uses a full-height drawer on compact screens without horizontal overflow

## Visual Output

Markdown, SVG, HTML, PDF, and image previews are rendered inside the dock. Relative
resources stay anchored to the produced file instead of breaking at the plugin route.

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
2. Output Dock opens the latest preview in the native right column.
3. Use the file selector to inspect earlier outputs from the session.
4. Use the footer controls to copy, download, pin, or hide an entry.

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
- Pin and hide preferences are local to the browser; session output history is rebuilt from the log.
- Deployed development servers are not embedded yet; this release previews their produced files.

## License

[MIT](LICENSE)
