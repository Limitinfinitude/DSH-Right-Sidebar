import { ExternalLink, FileText, Image as ImageIcon } from 'lucide-react'
import type { TurnTailOwnerProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { ConversationViewSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { EMPTY_OUTPUT_DOCK_SNAPSHOT, type PublishedOutput } from './contract.ts'
import type { OutputDockUiStore } from './dock-store.ts'
import type { NS } from './locales.ts'
import type { OutputDockLayout } from './DockPanel.tsx'
import { publicationsForTurn } from './view.ts'

declare module '@deepseek-ai/dsh-client-ui-conversation/client' {
  interface TurnTailOwnerProps {
    readonly views: ConversationViewSnapshotStore
  }
}

export function selectPublishedOutputs(owner: TurnTailOwnerProps): readonly PublishedOutput[] | null {
  const snapshot = owner.views.get('outputDock') ?? EMPTY_OUTPUT_DOCK_SNAPSHOT
  const entries = publicationsForTurn(snapshot, owner.turn.turn, owner.seq)
  return entries.length === 0 ? null : entries
}

export function actionDestination(output: PublishedOutput):
  | { readonly kind: 'dock'; readonly key: string }
  | { readonly kind: 'browser'; readonly url: string } {
  return output.kind === 'link'
    ? { kind: 'browser', url: output.url as string }
    : { kind: 'dock', key: output.key }
}

interface ResultActionsInjected {
  readonly dockStore: OutputDockUiStore
  readonly layout: OutputDockLayout
}

export type ResultActionsProps = PropsRuntime<'conversation.chat.turnTail'>
  & PropsLocale<typeof NS>
  & InjectFace<ResultActionsInjected>
  & { readonly matched: readonly PublishedOutput[] }

function ResultIcon({ output }: { readonly output: PublishedOutput }): React.JSX.Element {
  if (output.kind === 'link') return <ExternalLink size={14} aria-hidden />
  if (output.kind === 'visual') return <ImageIcon size={14} aria-hidden />
  return <FileText size={14} aria-hidden />
}

export function ResultActions({ matched, sessionId, dockStore, layout, t }: ResultActionsProps): React.JSX.Element {
  const id = String(sessionId)
  return (
    <div className="dsh-od-result-actions">
      {matched.map((output) => {
        const label = `${output.workTitle} · ${output.label}`
        const destination = actionDestination(output)
        const actionLabel = destination.kind === 'browser'
          ? t('result.openLink', { name: label })
          : t('result.openOutput', { name: label })
        return (
          <button
            key={`${output.key}:${output.revision}`}
            type="button"
            className="dsh-od-result-action"
            title={actionLabel}
            aria-label={actionLabel}
            onClick={() => {
              if (destination.kind === 'browser') {
                window.open(destination.url, '_blank', 'noopener,noreferrer')
                return
              }
              dockStore.open(id, destination.key)
              layout.openDetails('output-dock')
            }}
          >
            <ResultIcon output={output} />
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
