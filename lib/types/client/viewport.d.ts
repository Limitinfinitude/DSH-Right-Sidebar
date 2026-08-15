export type DockRenderTarget = 'details' | 'mobile';
export declare const COMPACT_VIEWPORT_QUERY = "(max-width: 1023px)";
export declare function dockRenderTarget(compact: boolean): DockRenderTarget;
export declare function getCompactViewport(): boolean;
export declare function subscribeCompactViewport(listener: () => void): () => void;
