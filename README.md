# Output Dock

English | [中文](README.zh.md)

A focused result workspace for DeepSeek Harness. Finished documents and visuals
open in DSH's native right column; deployed pages open in a regular browser tab.

![Output Dock overview](docs/images/show1.png)

## What It Does

- The agent publishes finished, inspectable results explicitly.
- Results appear beside the completed reply and open only when selected.
- Local documents and visuals use session-scoped horizontal tabs in Outputs.
- Deployed pages open in a regular browser tab; development servers are never embedded.
- Source files, configuration, and incidental project files are not collected.
- Tabs, focus, and collapsed state follow the active DSH session.

Output Dock does not interrupt the conversation when a result is produced. A
background session cannot open the panel or steal focus.

## Preview

Markdown, MDX, SVG, images, HTML, PDF, text, CSV, and TSV files can be previewed
inside Outputs. Relative resources remain anchored to their published file, and
SVG content is sanitized and normalized for contained rendering.

![Output Dock preview](docs/images/show2.png)

## Install

```sh
git clone https://github.com/Limitinfinitude/DSH-Output-Dock.git
cd DSH-Output-Dock
npm install
npm run build
dsh plugin --profile web add .
```

Refresh DSH Web after installation.

## Use

1. Ask DSH to create a finished document, visual, or deployed application.
2. Select the result button beside the completed reply.
3. Local results open in Outputs; deployed links open in a browser tab.
4. Use the horizontal tabs to switch, refresh, download, or close local results.
5. Collapse Outputs when finished. Returning to the session restores its tabs.

## Supported Results

| Category | Formats |
|---|---|
| Documents | Markdown, MDX, PDF, HTML, HTM, TXT, CSV, TSV |
| Visuals | SVG, PNG, JPEG, WebP, GIF, AVIF, BMP |
| Deployed applications | Absolute HTTP or HTTPS URL |

## DSH Integration

Output Dock requires a DSH Web build with:

- the session-scoped `details.overlay` slot;
- the named details-surface API (`openDetails`, `closeDetails`, and surface state);
- `conversation.chat.turnTail` owner access to the per-session `views` store;
- durable Native and Code Mode tool lifecycle events.

The Node half registers `output_dock_publish` and a workspace-confined read-only
file route. The client folds successful publications into a durable per-session
view, renders reply actions, and opens only results selected by the user.

## Development

```sh
npm test -- --run
npm run typecheck
npm run build
```

Local file reads are limited to the DSH boot workspace and registered workspaces.
HTML previews run in a script-free sandbox.

## License

[MIT](LICENSE)
