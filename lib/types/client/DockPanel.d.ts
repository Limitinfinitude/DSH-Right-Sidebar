import type { ISessions } from '@deepseek-ai/dsh-client-runtime/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { NS, OutputDockKey } from './locales.ts';
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
type SharedInject = {
    sessions: ISessions;
    layout: OutputDockLayout;
};
type PanelProps = PropsRuntime<'details.overlay'> & PropsLocale<typeof NS> & InjectFace<SharedInject>;
type LauncherProps = PropsRuntime<'shell.overlay'> & PropsLocale<typeof NS> & InjectFace<SharedInject>;
export declare function OutputDockPanel(props: PanelProps): React.JSX.Element | null;
export declare function OutputDockLauncher(props: LauncherProps): React.JSX.Element | null;
export type { OutputDockKey };
