import type { ISessions } from '@deepseek-ai/dsh-client-runtime/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { type OutputDockSnapshot } from './contract.ts';
import type { OutputDockUiStore, SessionDockState } from './dock-store.ts';
import type { NS, OutputDockKey } from './locales.ts';
import { type PreviewEntry } from './preview.tsx';
export interface OutputDockLayout {
    openDetails(surface?: string): void;
    closeDetails(): void;
    getDetailsSurface(): string | null;
    subscribeDetailsSurface(listener: () => void): () => void;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        layout: OutputDockLayout;
    }
}
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface SlotMap {
        'details.overlay': {
            kind: 'list';
            scope: 'session';
        };
        'shell.overlay': {
            kind: 'list';
            scope: 'root';
        };
    }
}
export declare const OUTPUT_SURFACE = "output-dock";
export interface DockTabsModel {
    readonly tabs: readonly PreviewEntry[];
    readonly active: PreviewEntry | null;
}
export declare function dockTabs(state: SessionDockState, snapshot: OutputDockSnapshot): DockTabsModel;
interface SharedInject {
    readonly sessions: ISessions;
    readonly layout: OutputDockLayout;
    readonly dockStore: OutputDockUiStore;
}
type PanelProps = PropsRuntime<'details.overlay'> & PropsLocale<typeof NS> & InjectFace<SharedInject>;
type LauncherProps = PropsRuntime<'shell.overlay'> & PropsLocale<typeof NS> & InjectFace<SharedInject>;
export declare function OutputDockPanel(props: PanelProps): React.JSX.Element | null;
export declare function OutputDockLauncher(props: LauncherProps): React.JSX.Element | null;
export type { OutputDockKey };
