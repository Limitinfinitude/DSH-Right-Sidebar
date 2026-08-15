/**
 * dsh-right-sidebar, browser half. Registers the produced-file conversation
 * definition, the per-session dock view builder, the dictionaries, the
 * stylesheet, the native details-column panel, and its inactive edge launcher.
 * Everything rides the caller's fiber: plugin unload removes the panel, the
 * view, and the definitions together.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { resolveWorkspacePath } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { outputDockDefinition } from './collect.ts'
import { OutputDockLauncher, OutputDockPanel } from './DockPanel.tsx'
import { en, NS, zh } from './locales.ts'
import { injectDockStyles } from './style.ts'
import { outputDockViewDefinition } from './view.ts'

/** Required services for the dock surfaces. */
export const inject = ['slots', 'locale', 'conversationEvents', 'conversationViews', 'sessions', 'workspaces', 'layout']

/**
 * Client plugin body: install dictionaries and styles, register the
 * collection definition and view target, then inject the floating dock.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  const openPath = (path: string): void => {
    const list = ctx.sessions.list.getSnapshot()
    const cwd = list.current === undefined ? undefined : list.byId[list.current]?.cwd
    void ctx.workspaces.openPath(resolveWorkspacePath(cwd, path))
  }
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'output-dock: dictionaries')
  ctx.effect(injectDockStyles, 'output-dock: styles')
  ctx.conversationEvents.register(outputDockDefinition)
  ctx.conversationViews.register(outputDockViewDefinition)
  ctx.slots.inject('details.overlay', () => ctx.slots.register({
    name: 'details.overlay',
    id: 'output-dock-panel',
    order: 100,
    locale: NS,
    inject: () => ({
      sessions: ctx.sessions,
      layout: ctx.layout,
      openPath,
    }),
  }, OutputDockPanel))
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'output-dock-launcher',
    order: 100,
    locale: NS,
    inject: () => ({
      sessions: ctx.sessions,
      layout: ctx.layout,
      openPath,
    }),
  }, OutputDockLauncher))
}
