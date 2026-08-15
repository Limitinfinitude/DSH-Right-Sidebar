# DSH Right Sidebar

[中文](README.md) | English

DSH Right Sidebar is a native output workspace for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). It keeps the reports,
diagrams, images, data, and documents generated in a session beside the conversation instead
of scattering them across the workspace and tool history.

![Output Dock overview](docs/images/show1.png)

## Purpose

Output Dock is not a file manager, and it does not surface every file in a project. It keeps
only results a person can read, inspect, download, or use. Source code, configuration,
dependencies, and HTML source files remain the responsibility of the DSH workspace.

- Permanent right-edge entry that can open automatically, collapse, and restore manually
- Session-aware outputs, tab order, and closed-tab state
- Closeable, draggable stacked tabs that retain readable names in a narrow sidebar
- A footer catalog that reopens closed outputs and scrolls independently after seven entries
- Direct, rendered Markdown editing with silent save after typing stops
- Copy path or content, download, reveal the containing directory, pin, or hide an output

## Preview Coverage

| Category | Supported now |
| --- | --- |
| Documents | Markdown, MDX, PDF |
| Graphics and images | SVG, PNG, JPEG, WebP, GIF, AVIF, BMP |
| Text and data | TXT, LOG, JSON, JSONL, CSV, TSV, YAML, TOML, XML, INI, CONF |
| Workspace files | Source, configuration, and HTML/HTM stay out of the output dock |

HTML files are project source. A deployed website should instead be provided by the agent as an
accessible URL in the conversation. This keeps a frontend or full-stack project with many `js`,
`ts`, `css`, and configuration files from drowning out its actual deliverables.

![Output Dock preview](docs/images/show2.png)

## Use

1. Ask DSH to generate a report, diagram, image, PDF, or data file.
2. When a previewable result appears, the right sidebar opens with the newest output selected.
3. Switch between outputs through tabs; reopen a closed item from the footer catalog.
4. Use "Reveal directory" when you need the source or project files in the DSH workspace.

## Install

DSH Right Sidebar requires a DSH Web build that exposes the session-scoped `details.overlay` slot
and named details-surface APIs.

```sh
git clone https://github.com/Limitinfinitude/DSH-Right-Sidebar.git
cd DSH-Right-Sidebar
npm install
npm run build
dsh plugin --profile web add .
```

Refresh the DSH Web session after installation.

## Performance and Security

The dock does not poll files or ports while idle. Output content is fetched only after selection,
and complex previews initialize on demand. Markdown editing no longer loads a generic HTML
conversion package; the browser bundle is approximately `163 KB gzip`.

Local file access is constrained to validated workspace paths. Markdown and SVG are sanitized
before rendering, binary files are read-only, and HTML/HTM source is never embedded in the dock.

## Development

```sh
npm test -- --run
npm run typecheck
npm run build
```

See the [preview PRD](docs/prd-output-preview.md) for coverage and the roadmap.

## License

[MIT](LICENSE)
