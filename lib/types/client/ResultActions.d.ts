import type { TurnTailOwnerProps } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { ConversationViewSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { type PublishedOutput } from './contract.ts';
import type { OutputDockUiStore } from './dock-store.ts';
import type { NS } from './locales.ts';
import type { OutputDockLayout } from './DockPanel.tsx';
declare module '@deepseek-ai/dsh-client-ui-conversation/client' {
    interface TurnTailOwnerProps {
        readonly views: ConversationViewSnapshotStore;
    }
}
export declare function selectPublishedOutputs(owner: TurnTailOwnerProps): readonly PublishedOutput[] | null;
export declare function actionDestination(output: PublishedOutput): {
    readonly kind: 'dock';
    readonly key: string;
} | {
    readonly kind: 'browser';
    readonly url: string;
};
interface ResultActionsInjected {
    readonly dockStore: OutputDockUiStore;
    readonly layout: OutputDockLayout;
}
export type ResultActionsProps = PropsRuntime<'conversation.chat.turnTail'> & PropsLocale<typeof NS> & InjectFace<ResultActionsInjected> & {
    readonly matched: readonly PublishedOutput[];
};
export declare function ResultActions({ matched, sessionId, dockStore, layout, t }: ResultActionsProps): React.JSX.Element;
export {};
