export type MediaZoom = 'fit' | number;
export declare function adjustZoom(current: MediaZoom, direction: -1 | 1): number;
export declare function svgIntrinsicSize(source: string): {
    readonly width: number;
    readonly height: number;
} | null;
