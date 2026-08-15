export const DOCK_STYLE_ID = 'dsh-output-dock/styles'

export const DOCK_CSS = `
.dsh-od-panel {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font-family: var(--ds-font-family, ui-sans-serif, system-ui, sans-serif);
  font-size: 13px;
}

.dsh-od-header {
  display: grid;
  flex: none;
  min-height: 48px;
  grid-template-columns: auto minmax(0, 1fr) 30px;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 8px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.dsh-od-title {
  font-size: 13px;
  line-height: 20px;
  font-weight: 600;
}

.dsh-od-tabs {
  display: flex;
  min-width: 0;
  height: 32px;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}
.dsh-od-tabs::-webkit-scrollbar { display: none; }

.dsh-od-tab-wrap {
  display: grid;
  flex: 0 0 auto;
  width: max-content;
  max-width: min(220px, 55vw);
  height: 30px;
  grid-template-columns: minmax(72px, 1fr) 24px;
  align-items: center;
  border-bottom: 2px solid transparent;
  color: var(--dsw-alias-label-secondary);
}
.dsh-od-tab-wrap[data-active] {
  border-bottom-color: var(--dsw-alias-label-primary);
  color: var(--dsw-alias-label-primary);
}
.dsh-od-tab-wrap > [role='tab'],
.dsh-od-tab-close {
  height: 28px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.dsh-od-tab-wrap > [role='tab'] {
  min-width: 0;
  padding: 0 4px 0 8px;
  overflow: hidden;
  font: inherit;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-od-tab-close { display: grid; width: 24px; padding: 0; place-items: center; }
.dsh-od-tab-close:hover { background: var(--dsw-alias-interactive-bg-hover); }

.dsh-od-icon-btn {
  display: grid;
  flex: none;
  width: 30px;
  height: 30px;
  padding: 0;
  place-items: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}
.dsh-od-icon-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.dsh-od-icon-btn:focus-visible,
.dsh-od-tab-wrap button:focus-visible,
.dsh-od-text-btn:focus-visible,
.dsh-od-result-action:focus-visible,
.dsh-od-launcher:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}

.dsh-od-resource-bar {
  display: grid;
  flex: none;
  min-height: 42px;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 7px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}
.dsh-od-resource-name { font-weight: 500; }
.dsh-od-resource-path {
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dsh-od-preview-canvas {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  overflow: auto;
}
.dsh-od-preview-state {
  display: grid;
  flex: 1;
  min-height: 180px;
  place-content: center;
  justify-items: center;
  gap: 12px;
  padding: 24px;
  color: var(--dsw-alias-label-tertiary);
  text-align: center;
}
.dsh-od-preview-state[data-state='loading'] { animation: dsh-od-fade 1.2s ease-in-out infinite alternate; }
.dsh-od-preview-state[data-state='error'] { color: var(--dsw-alias-state-error-primary); }
.dsh-od-text-btn {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  gap: 6px;
  padding: 5px 9px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
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
.dsh-od-preview-md pre { padding: 14px; overflow: auto; border-radius: 6px; background: var(--dsw-alias-markdown-code-block); }
.dsh-od-preview-md pre code { padding: 0; background: none; }
.dsh-od-preview-md table { width: 100%; border-collapse: collapse; }
.dsh-od-preview-md th, .dsh-od-preview-md td { padding: 6px 8px; border: 1px solid var(--dsw-alias-border-l2); }

.dsh-od-svg-stage {
  display: grid;
  flex: 1;
  min-height: 240px;
  padding: 18px;
  place-items: center;
  box-sizing: border-box;
  overflow: hidden;
}
.dsh-od-svg-stage > svg { display: block; width: 100%; height: 100%; max-width: 100%; max-height: 100%; }
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
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  line-height: 20px;
  tab-size: 2;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.dsh-od-preview-frame { display: block; flex: 1; width: 100%; min-height: 360px; border: 0; background: #fff; }
.dsh-od-preview-pdf { height: 100%; }

.dsh-od-toolbar {
  display: flex;
  flex: none;
  min-height: 44px;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding: 6px 10px;
  border-top: 1px solid var(--dsw-alias-border-l2);
}

.dsh-od-result-actions {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.dsh-od-result-action {
  display: inline-flex;
  max-width: 100%;
  min-height: 30px;
  align-items: center;
  gap: 7px;
  padding: 5px 9px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  cursor: pointer;
}
.dsh-od-result-action:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-od-result-action > svg { flex: none; }
.dsh-od-result-action > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

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
  border-right: 0;
  border-radius: 7px 0 0 7px;
  background: var(--dsw-alias-button-floating-fill);
  color: var(--dsw-alias-label-secondary);
  box-shadow: -2px 5px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-50%);
  cursor: pointer;
  pointer-events: auto;
}
.dsh-od-launcher:hover { background: var(--dsw-alias-button-floating-hover); color: var(--dsw-alias-label-primary); }
.dsh-od-launcher span { font-size: 10px; font-weight: 600; font-variant-numeric: tabular-nums; }
.dsh-od-mobile-shell { display: none; }

@keyframes dsh-od-fade { to { opacity: 0.45; } }
@media (prefers-reduced-motion: reduce) { .dsh-od-preview-state[data-state='loading'] { animation: none; } }
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
  .dsh-od-header { grid-template-columns: auto minmax(0, 1fr) 30px; }
  .dsh-od-resource-bar { grid-template-columns: minmax(0, 1fr); gap: 2px; }
  .dsh-od-resource-path { text-align: left; }
}
`

export function injectDockStyles(): () => void {
  if (typeof document === 'undefined') return () => {}
  if (document.querySelector(`style[data-plugin-css="${DOCK_STYLE_ID}"]`) !== null) return () => {}
  const tag = document.createElement('style')
  tag.dataset.plugin = 'dsh-output-dock'
  tag.dataset.pluginCss = DOCK_STYLE_ID
  tag.textContent = DOCK_CSS
  document.head.appendChild(tag)
  return () => { document.querySelector(`style[data-plugin-css="${DOCK_STYLE_ID}"]`)?.remove() }
}
