# Output Dock Initial GitHub Release Design

## Scope

Publish the existing `dsh-output-dock` implementation as the public GitHub repository
`Limitinfinitude/DSH-Output-Dock`. This release does not include deployed-site previews.

## Product Naming

- Repository and README product name: **Output Dock**
- GitHub repository: `DSH-Output-Dock`
- npm package id and local directory: `dsh-output-dock`
- Sidebar heading in both locales: `Outputs`

## Documentation

Keep one English README and one Chinese README with a language switch at the top. Use
`docs/images/show1.png` as the primary overview and `docs/images/show2.png` as the SVG
preview example. Avoid badge rows and decorative icon lists; lead with the product,
screenshots, capabilities, installation, usage, architecture, limitations, and license.

## Release Boundary

Commit the plugin source, generated `lib` bundle/types, tests, documentation, screenshots,
and MIT license. Exclude dependencies, local QA artifacts, and editor files. The existing
DSH `details.overlay` host extension remains an explicitly documented requirement because
it belongs to the separate DeepSeek Harness checkout.

## Verification

The release gate is: locale regression test, complete Vitest suite, TypeScript check,
production build, `git diff --check`, and a clean Git status after the initial commit.
