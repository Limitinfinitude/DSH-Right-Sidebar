/**
 * dsh-right-sidebar, browser half. Registers the produced-file conversation
 * definition, the per-session dock view builder, the dictionaries, the
 * stylesheet, the native details-column panel, and its inactive edge launcher.
 * Everything rides the caller's fiber: plugin unload removes the panel, the
 * view, and the definitions together.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Required services for the dock surfaces. */
export declare const inject: string[];
/**
 * Client plugin body: install dictionaries and styles, register the
 * collection definition and view target, then inject the floating dock.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
