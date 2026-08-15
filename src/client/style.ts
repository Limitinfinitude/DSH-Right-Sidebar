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
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.dsh-od-heading {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}

.dsh-od-count {
  display: inline-grid;
  min-width: 20px;
  height: 20px;
  place-items: center;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
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
.dsh-od-file-picker:focus-visible,
.dsh-od-file-option:focus-visible,
.dsh-od-text-btn:focus-visible,
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
  overflow: auto;
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
  overflow: auto;
  border-radius: 8px;
  background: var(--dsw-alias-markdown-code-block);
}
.dsh-od-preview-md pre code { padding: 0; background: none; }
.dsh-od-preview-md table { width: 100%; border-collapse: collapse; }
.dsh-od-preview-md th,
.dsh-od-preview-md td { padding: 6px 8px; border: 1px solid var(--dsw-alias-border-l2); }

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
  min-height: 100%;
  margin: 0;
  padding: 16px;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary);
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  line-height: 20px;
  tab-size: 2;
  white-space: pre;
}

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
  flex: none;
  border-top: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
}

.dsh-od-qc {
  display: flex;
  min-height: 32px;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 16px;
}

.dsh-od-qc > svg { flex: none; }
.dsh-od-qc[data-level='ok'] { color: var(--dsw-alias-state-success-primary); }
.dsh-od-qc[data-level='warn'] { color: var(--dsw-alias-state-warning-primary); }
.dsh-od-qc[data-level='error'] { color: var(--dsw-alias-state-error-primary); }
.dsh-od-qc[data-level='loading'] > svg { animation: dsh-od-spin 1s linear infinite; }

.dsh-od-toolbar {
  display: flex;
  min-height: 44px;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding: 6px 10px;
  border-top: 1px solid var(--dsw-alias-border-l2);
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

@keyframes dsh-od-spin { to { transform: rotate(360deg); } }
@keyframes dsh-od-fade { to { opacity: 0.45; } }

@media (prefers-reduced-motion: reduce) {
  .dsh-od-preview-state[data-state='loading'],
  .dsh-od-qc[data-level='loading'] > svg {
    animation: none;
  }
}

@media (max-width: 1023px) {
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
