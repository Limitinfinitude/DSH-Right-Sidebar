import { Grid2X2, Maximize2, Scan, ZoomIn, ZoomOut } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { adjustZoom, svgIntrinsicSize, type MediaZoom } from './media-preview.ts'

export interface MediaPreviewLabels {
  readonly zoomIn: string
  readonly zoomOut: string
  readonly fit: string
  readonly actualSize: string
  readonly transparency: string
  readonly dimensions: (width: number, height: number) => string
}

function ToolButton(props: {
  readonly label: string
  readonly active?: boolean
  readonly onClick: () => void
  readonly children: React.ReactNode
}): React.JSX.Element {
  return (
    <button type="button" className="dsh-od-data-button" aria-label={props.label}
      title={props.label} aria-pressed={props.active} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export function MediaPreview(props: {
  readonly kind: 'image' | 'svg'
  readonly source: string
  readonly alt: string
  readonly labels: MediaPreviewLabels
  readonly onLoad: () => void
  readonly onError: () => void
}): React.JSX.Element {
  const stageRef = useRef<HTMLDivElement>(null)
  const svgSize = useMemo(() => props.kind === 'svg' ? svgIntrinsicSize(props.source) : null,
    [props.kind, props.source])
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)
  const [zoom, setZoom] = useState<MediaZoom>('fit')
  const [checker, setChecker] = useState(false)
  const size = props.kind === 'svg' ? svgSize : imageSize
  const scaleLabel = zoom === 'fit' ? null : `${Math.round(zoom * 100)}%`
  const contentStyle: React.CSSProperties = zoom === 'fit'
    ? {}
    : size === null
      ? { width: `${zoom * 100}%` }
      : { width: size.width * zoom, height: size.height * zoom }
  const beginPan = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (zoom === 'fit' || stageRef.current === null) return
    event.preventDefault()
    const stage = stageRef.current
    const startX = event.clientX
    const startY = event.clientY
    const startLeft = stage.scrollLeft
    const startTop = stage.scrollTop
    const move = (next: PointerEvent): void => {
      stage.scrollLeft = startLeft - (next.clientX - startX)
      stage.scrollTop = startTop - (next.clientY - startY)
    }
    const stop = (): void => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
  }
  return (
    <section className="dsh-od-media-preview">
      <div className="dsh-od-media-toolbar">
        <div className="dsh-od-media-meta">
          {size !== null && <span>{props.labels.dimensions(Math.round(size.width), Math.round(size.height))}</span>}
          {scaleLabel !== null && <span>{scaleLabel}</span>}
        </div>
        <div className="dsh-od-data-actions">
          <ToolButton label={props.labels.zoomOut} onClick={() => { setZoom(current => adjustZoom(current, -1)) }}>
            <ZoomOut size={15} aria-hidden />
          </ToolButton>
          <ToolButton label={props.labels.zoomIn} onClick={() => { setZoom(current => adjustZoom(current, 1)) }}>
            <ZoomIn size={15} aria-hidden />
          </ToolButton>
          <ToolButton label={props.labels.fit} active={zoom === 'fit'} onClick={() => { setZoom('fit') }}>
            <Maximize2 size={15} aria-hidden />
          </ToolButton>
          <ToolButton label={props.labels.actualSize} active={zoom === 1} onClick={() => { setZoom(1) }}>
            <Scan size={15} aria-hidden />
          </ToolButton>
          <ToolButton label={props.labels.transparency} active={checker}
            onClick={() => { setChecker(current => !current) }}>
            <Grid2X2 size={15} aria-hidden />
          </ToolButton>
        </div>
      </div>
      <div ref={stageRef} className="dsh-od-media-stage" data-checker={checker || undefined}
        data-pannable={zoom !== 'fit' || undefined} onPointerDown={beginPan}>
        {props.kind === 'svg'
          ? <div className="dsh-od-media-content dsh-od-media-svg" style={contentStyle}
              dangerouslySetInnerHTML={{ __html: props.source }} />
          : <img className="dsh-od-media-content" style={contentStyle} src={props.source} alt={props.alt}
              onLoad={event => {
                setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })
                props.onLoad()
              }} onError={props.onError} />}
      </div>
    </section>
  )
}
