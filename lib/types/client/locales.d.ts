/** `output-dock` namespace dictionaries. */
/** Dictionary namespace owned by this plugin. */
export declare const NS = "output-dock";
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    'dock.title': string;
    'dock.empty': string;
    'dock.allHidden': string;
    'dock.expand': string;
    'dock.collapse': string;
    'dock.chooseFile': string;
    'dock.openCatalog': string;
    'dock.closeTab': string;
    'dock.preview': string;
    'dock.copyPath': string;
    'dock.copyContent': string;
    'dock.edit': string;
    'dock.save': string;
    'dock.cancel': string;
    'dock.saving': string;
    'dock.saveError': string;
    'dock.pin': string;
    'dock.unpin': string;
    'dock.hide': string;
    'dock.unhide': string;
    'dock.clearHidden': string;
    'dock.download': string;
    'dock.reveal': string;
    'dock.turn': string;
    'dock.copied': string;
    'dock.hiddenCount': string;
    'preview.loading': string;
    'preview.error': string;
    'preview.empty': string;
    'qc.ok': string;
    'qc.brokenLink': string;
    'qc.unbalancedFence': string;
    'qc.svgParse': string;
    'qc.svgNoViewBox': string;
    'qc.svgSanitized': string;
    'qc.imageFailed': string;
    'qc.htmlParse': string;
    'qc.fileRead': string;
    'qc.loading': string;
};
/** English dictionary (same key set). */
export declare const en: Record<OutputDockKey, string>;
/** Union of this namespace's dictionary keys. */
export type OutputDockKey = keyof typeof zh;
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        'output-dock': OutputDockKey;
    }
}
