/** Plugin-owned stylesheet for the native details-column output surface. */
export const DOCK_STYLE_ID = 'dsh-output-dock/styles'

export const DOCK_CSS = `
.dsh-od-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  overflow: hidden;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font-family: var(--ds-font-family, ui-sans-serif, system-ui, sans-serif);
  font-size: 13px;
}

.dsh-od-header {
  display: grid;
  flex: none;
  grid-template-columns: minmax(0, 1fr) 30px;
  align-items: center;
  gap: 8px;
  min-height: 61px;
  padding: 6px 10px;
  border-bottom: 1.5px solid var(--dsw-alias-border-l2);
}

.dsh-od-tabs {
  display: flex;
  min-width: 0;
  height: 32px;
  align-items: center;
  gap: 1px;
  padding: 0 2px 2px 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-color: var(--dsw-alias-border-l2) transparent;
  scrollbar-width: thin;
}

.dsh-od-tab-wrap {
  display: grid;
  flex: 1 1 180px;
  min-width: 112px;
  max-width: 220px;
  height: 30px;
  grid-template-columns: minmax(0, 1fr) 0;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: grab;
  transition: background-color 120ms ease;
}

.dsh-od-tab-wrap:hover {
  grid-template-columns: minmax(0, 1fr) 25px;
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-od-tab-wrap[data-active] {
  grid-template-columns: minmax(0, 1fr) 25px;
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.dsh-od-tab-wrap[data-dragging] {
  opacity: 0.45;
  cursor: grabbing;
}
.dsh-od-tab {
  display: grid;
  width: 100%;
  min-width: 0;
  height: 28px;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  padding: 3px 8px 3px 12px;
  overflow: hidden;
  border: none;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.dsh-od-tab > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-od-tab-close {
  display: grid;
  width: 24px;
  height: 24px;
  padding: 0;
  place-items: center;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
}
.dsh-od-tab-wrap:hover .dsh-od-tab-close,
.dsh-od-tab-wrap[data-active] .dsh-od-tab-close,
.dsh-od-tab-close:focus-visible {
  opacity: 1;
  pointer-events: auto;
}
.dsh-od-tab-close:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.dsh-od-icon-btn {
  display: grid;
  flex: none;
  width: 30px;
  height: 30px;
  padding: 0;
  place-items: center;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}

.dsh-od-icon-btn:hover,
.dsh-od-icon-btn[data-active] {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.dsh-od-icon-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.dsh-od-icon-btn:focus-visible,
.dsh-od-tab:focus-visible,
.dsh-od-tab-close:focus-visible,
.dsh-od-file-picker:focus-visible,
.dsh-od-file-option:focus-visible,
.dsh-od-text-btn:focus-visible,
.dsh-od-data-button:focus-visible,
.dsh-od-data-search:focus-within,
.dsh-od-data-table th button:focus-visible,
.dsh-od-launcher:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}

.dsh-od-filebar {
  position: relative;
  z-index: 3;
  flex: none;
  padding: 8px 10px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
}

.dsh-od-file-picker {
  display: grid;
  width: 100%;
  min-height: 48px;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  padding: 6px 8px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.dsh-od-file-picker:hover,
.dsh-od-file-picker[aria-expanded='true'] {
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-interactive-bg-hover);
}

.dsh-od-file-copy,
.dsh-od-option-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1px;
}

.dsh-od-file-name,
.dsh-od-option-copy > span {
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dsh-od-file-path,
.dsh-od-option-copy small {
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dsh-od-kind {
  display: inline-grid;
  min-width: 36px;
  height: 22px;
  place-items: center;
  padding: 0 6px;
  border-radius: 5px;
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-secondary);
  font-size: 9px;
  line-height: 1;
  font-weight: 700;
  text-transform: uppercase;
}

.dsh-od-kind-md { background: #e8f1ff; color: #245ea8; }
.dsh-od-kind-svg { background: #f0eafb; color: #67449a; }
.dsh-od-kind-image { background: #e5f3e9; color: #276d3d; }
.dsh-od-kind-html { background: #fff0df; color: #975019; }
.dsh-od-kind-pdf { background: #fbe7e5; color: #9a3730; }
.dsh-od-kind-text { background: #e8eef1; color: #3f5964; }

.dsh-od-file-menu {
  position: absolute;
  top: calc(100% - 2px);
  right: 10px;
  left: 10px;
  z-index: 5;
  max-height: min(360px, 50vh);
  padding: 5px;
  overflow-y: auto;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-base);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.14);
}

.dsh-od-file-option {
  display: grid;
  width: 100%;
  min-height: 48px;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  padding: 6px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.dsh-od-file-option:hover,
.dsh-od-file-option[aria-selected='true'] {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dsh-od-preview-canvas {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--dsw-alias-bg-base);
}

.dsh-od-preview-state,
.dsh-od-empty {
  display: grid;
  flex: 1;
  min-height: 180px;
  place-content: center;
  justify-items: center;
  gap: 10px;
  padding: 24px;
  color: var(--dsw-alias-label-tertiary);
  text-align: center;
}

.dsh-od-preview-state[data-state='loading'] {
  animation: dsh-od-fade 1.2s ease-in-out infinite alternate;
}

.dsh-od-preview-state[data-state='error'] {
  color: var(--dsw-alias-state-error-primary);
}

.dsh-od-empty p {
  max-width: 30ch;
  margin: 0;
  line-height: 20px;
}

.dsh-od-text-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 5px 9px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}

.dsh-od-preview-md {
  width: 100%;
  max-width: 72ch;
  margin: 0 auto;
  padding: 18px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.dsh-od-preview-md > :first-child { margin-top: 0; }
.dsh-od-preview-md > :last-child { margin-bottom: 0; }
.dsh-od-preview-md h1 { margin: 1.3em 0 0.45em; font-size: 22px; line-height: 1.25; }
.dsh-od-preview-md h2 { margin: 1.2em 0 0.4em; font-size: 18px; line-height: 1.3; }
.dsh-od-preview-md h3 { margin: 1.1em 0 0.35em; font-size: 15px; line-height: 1.4; }
.dsh-od-preview-md a { color: var(--dsw-alias-brand-primary); text-underline-offset: 3px; }
.dsh-od-preview-md img { display: block; max-width: 100%; height: auto; margin: 12px auto; }
.dsh-od-preview-md code {
  padding: 2px 5px;
  border-radius: 4px;
  background: var(--dsw-alias-markdown-code-block);
  font-family: var(--ds-font-family-code);
  font-size: 0.92em;
}
.dsh-od-preview-md pre {
  padding: 14px;
  overflow: hidden;
  border-radius: 8px;
  background: var(--dsw-alias-markdown-code-block);
}
.dsh-od-preview-md pre code {
  padding: 0;
  background: none;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.dsh-od-preview-md table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
.dsh-od-preview-md th,
.dsh-od-preview-md td {
  padding: 6px 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  overflow-wrap: anywhere;
}

.dsh-od-svg-stage {
  display: grid;
  flex: 1;
  min-height: 240px;
  padding: 18px;
  place-items: center;
  box-sizing: border-box;
  overflow: hidden;
}

.dsh-od-svg-stage > svg {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

.dsh-od-preview-img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 240px;
  padding: 18px;
  box-sizing: border-box;
  object-fit: contain;
}

.dsh-od-preview-text {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 16px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  line-height: 20px;
  tab-size: 2;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.dsh-od-data-preview {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  background: var(--dsw-alias-bg-base);
}

.dsh-od-data-toolbar {
  position: relative;
  z-index: 2;
  display: flex;
  flex: none;
  min-height: 44px;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
}

.dsh-od-data-search {
  display: flex;
  flex: 1;
  min-width: 88px;
  height: 30px;
  align-items: center;
  gap: 7px;
  padding: 0 9px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 7px;
  color: var(--dsw-alias-label-tertiary);
  background: var(--dsw-alias-bg-base);
}

.dsh-od-data-search input {
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
}

.dsh-od-data-search input::placeholder { color: var(--dsw-alias-label-tertiary); }
.dsh-od-data-search input::-webkit-search-cancel-button { cursor: pointer; }

.dsh-od-data-actions {
  display: flex;
  flex: none;
  gap: 3px;
}

.dsh-od-data-button {
  display: grid;
  flex: none;
  width: 30px;
  height: 30px;
  padding: 0;
  place-items: center;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}

.dsh-od-data-button:hover,
.dsh-od-data-button[aria-pressed='true'] {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.dsh-od-data-button:disabled { opacity: 0.35; cursor: not-allowed; }

.dsh-od-data-count {
  flex: none;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.dsh-od-data-notice {
  flex: none;
  padding: 6px 10px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-interactive-bg-hover);
  font-size: 11px;
}

.dsh-od-data-raw {
  flex: 1;
  min-width: 0;
  min-height: 0;
  margin: 0;
  padding: 16px;
  overflow: auto;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-markdown-code-block);
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  line-height: 20px;
  tab-size: 2;
  white-space: pre;
}

.dsh-od-json-tree {
  flex: 1;
  min-height: 0;
  padding: 8px 0 16px;
  overflow: auto;
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  line-height: 20px;
}

.dsh-od-json-row {
  display: flex;
  width: 100%;
  min-width: max-content;
  min-height: 26px;
  align-items: center;
  gap: 5px;
  padding: 3px 12px 3px calc(10px + var(--dsh-json-depth) * 16px);
  box-sizing: border-box;
}

.dsh-od-json-toggle {
  border: none;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.dsh-od-json-toggle:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-od-json-spacer { width: 14px; flex: none; }
.dsh-od-json-key { color: var(--dsw-alias-brand-primary); }
.dsh-od-json-colon,
.dsh-od-json-summary,
.dsh-od-json-null { color: var(--dsw-alias-label-tertiary); }
.dsh-od-json-string { color: var(--dsw-alias-state-success-primary, var(--dsw-alias-label-primary)); }
.dsh-od-json-number,
.dsh-od-json-boolean { color: var(--dsw-alias-state-warning-primary, var(--dsw-alias-label-primary)); }

.dsh-od-table-scroll {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  scrollbar-color: var(--dsw-alias-border-l2) transparent;
  scrollbar-width: thin;
}

.dsh-od-data-table {
  width: max-content;
  min-width: 100%;
  border-spacing: 0;
  table-layout: fixed;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  line-height: 18px;
}

.dsh-od-data-table thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--dsw-alias-bg-base);
}

.dsh-od-data-table th {
  position: relative;
  height: 34px;
  padding: 0;
  border-right: 1px solid var(--dsw-alias-border-l2);
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-secondary);
  font-weight: 600;
  text-align: left;
}

.dsh-od-data-table th button {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 0 11px;
  overflow: hidden;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.dsh-od-data-table th button:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-od-data-table th button span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.dsh-od-column-resize {
  position: absolute;
  top: 0;
  right: -4px;
  z-index: 2;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  touch-action: none;
}

.dsh-od-column-resize:hover::after {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 3px;
  width: 1px;
  background: var(--dsw-alias-brand-primary);
  content: '';
}

.dsh-od-data-table td {
  height: 32px;
  padding: 6px 11px;
  overflow: hidden;
  border-right: 1px solid var(--dsw-alias-border-l2);
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dsh-od-data-table tbody tr:hover td { background: var(--dsw-alias-interactive-bg-hover); }

.dsh-od-data-pagination {
  display: flex;
  flex: none;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-top: 1px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}

.dsh-od-text-reader {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: 10px 0 18px;
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  line-height: 20px;
}

.dsh-od-text-line {
  display: grid;
  width: max-content;
  min-width: 100%;
  grid-template-columns: 44px minmax(0, 1fr);
  padding: 1px 12px 1px 0;
  box-sizing: border-box;
}

.dsh-od-text-line > span {
  padding-right: 10px;
  color: var(--dsw-alias-label-tertiary);
  text-align: right;
  user-select: none;
}

.dsh-od-text-line code { white-space: pre; }
.dsh-od-text-reader[data-wrap] .dsh-od-text-line { width: 100%; }
.dsh-od-text-reader[data-wrap] .dsh-od-text-line code { white-space: pre-wrap; overflow-wrap: anywhere; }
.dsh-od-text-line[data-match] { background: var(--dsw-alias-interactive-bg-hover); }

.dsh-od-media-preview,
.dsh-od-pdf-preview {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
}

.dsh-od-media-toolbar {
  display: flex;
  flex: none;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 10px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
}

.dsh-od-media-meta {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.dsh-od-media-stage {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 18px;
  box-sizing: border-box;
  background-color: var(--dsw-alias-bg-base);
}

.dsh-od-media-stage[data-checker] {
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
    linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
    linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
  background-position: 0 0, 0 8px, 8px -8px, -8px 0;
  background-size: 16px 16px;
}

.dsh-od-media-stage[data-pannable] { cursor: grab; }
.dsh-od-media-stage[data-pannable]:active { cursor: grabbing; }

.dsh-od-media-content {
  display: block;
  flex: none;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
}

.dsh-od-media-stage[data-pannable] .dsh-od-media-content {
  max-width: none;
  max-height: none;
}

.dsh-od-media-svg {
  display: grid;
  place-items: center;
}

.dsh-od-media-svg > svg {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

.dsh-od-code-preview {
  min-width: 0;
  min-height: 100%;
  background: var(--dsw-alias-markdown-code-block);
  color: var(--dsw-alias-label-primary);
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  line-height: 20px;
}

.dsh-od-code-language,
.dsh-od-editor-tools {
  display: flex;
  min-height: 36px;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-tertiary);
  font-family: var(--ds-font-family, ui-sans-serif, system-ui, sans-serif);
  font-size: 11px;
  font-weight: 600;
}

.dsh-od-code-lines {
  margin: 0;
  padding: 12px 12px 12px 48px;
  overflow-x: auto;
  tab-size: 2;
}

.dsh-od-code-lines li {
  padding-left: 10px;
  white-space: pre;
}

.dsh-od-code-lines li::marker {
  color: var(--dsw-alias-label-tertiary);
}

.dsh-od-editor {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  background: var(--dsw-alias-markdown-code-block);
}

.dsh-od-editor-tools > div {
  display: flex;
  gap: 3px;
}

.dsh-od-editor-tools button {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.dsh-od-editor-tools button:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-od-editor-tools button:disabled { opacity: 0.45; cursor: wait; }

.dsh-od-editor textarea {
  flex: 1;
  width: 100%;
  min-height: 0;
  resize: none;
  padding: 14px 16px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  line-height: 20px;
  tab-size: 2;
  white-space: pre;
  overflow: auto;
}

.dsh-od-editor p {
  margin: 0;
  padding: 7px 12px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
}

.dsh-od-editor p[data-state='error'] { color: var(--dsw-alias-state-error-primary); }

.dsh-od-preview-frame {
  display: block;
  flex: 1;
  width: 100%;
  min-height: 360px;
  border: none;
  background: #fff;
}

.dsh-od-preview-pdf { height: 100%; }

.dsh-od-footer {
  position: relative;
  flex: none;
  border-top: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
}

.dsh-od-toolbar {
  display: flex;
  min-height: 44px;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  padding: 6px 10px;
}

.dsh-od-toolbar-actions {
  display: flex;
  min-width: 0;
  margin-left: auto;
  gap: 4px;
}

.dsh-od-catalog {
  position: absolute;
  right: 10px;
  bottom: calc(100% + 8px);
  left: 10px;
  z-index: 8;
  max-height: min(332px, 50vh);
  padding: 5px;
  overflow-y: auto;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-base);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.14);
}

.dsh-od-catalog-item {
  display: grid;
  width: 100%;
  min-height: 46px;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 9px;
  padding: 6px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.dsh-od-catalog-item:hover,
.dsh-od-catalog-item[aria-selected='true'] {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dsh-od-catalog-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1px;
}

.dsh-od-catalog-copy > span,
.dsh-od-catalog-copy > small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dsh-od-catalog-copy > span {
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
}

.dsh-od-catalog-copy > small {
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 16px;
}

.dsh-od-launcher {
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 21;
  display: flex;
  min-width: 36px;
  height: 42px;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 7px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-right: none;
  border-radius: 8px 0 0 8px;
  background: var(--dsw-alias-button-floating-fill);
  color: var(--dsw-alias-label-secondary);
  box-shadow: -2px 5px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-50%);
  cursor: pointer;
  pointer-events: auto;
}

.dsh-od-launcher:hover {
  background: var(--dsw-alias-button-floating-hover);
  color: var(--dsw-alias-label-primary);
}

.dsh-od-launcher span {
  font-size: 10px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.dsh-od-mobile-shell {
  display: none;
}

::selection {
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 24%, transparent);
}

@keyframes dsh-od-fade { to { opacity: 0.45; } }

@media (prefers-reduced-motion: reduce) {
  .dsh-od-preview-state[data-state='loading'] {
    animation: none;
  }
}

@media (max-width: 1023px) {
  .dsh-od-header {
    min-height: 48px;
  }
  .dsh-od-mobile-shell {
    position: absolute;
    inset: 0 0 0 56px;
    z-index: 22;
    display: block;
    overflow: hidden;
    background: var(--dsw-alias-bg-base);
    pointer-events: auto;
  }

  .dsh-od-mobile-shell .dsh-od-panel {
    max-width: none;
  }
}
`

/** Inject the stylesheet once and return its disposer. */
export function injectDockStyles(): () => void {
  if (typeof document === 'undefined') return () => {}
  if (document.querySelector(`style[data-plugin-css="${DOCK_STYLE_ID}"]`) !== null) return () => {}
  const tag = document.createElement('style')
  tag.dataset.plugin = 'dsh-output-dock'
  tag.dataset.pluginCss = DOCK_STYLE_ID
  tag.textContent = DOCK_CSS
  document.head.appendChild(tag)
  return () => {
    document.querySelector(`style[data-plugin-css="${DOCK_STYLE_ID}"]`)?.remove()
  }
}
