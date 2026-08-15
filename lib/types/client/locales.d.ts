export declare const NS = "output-dock";
export declare const zh: {
    'result.openOutput': string;
    'result.openLink': string;
    'dock.title': string;
    'dock.tabs': string;
    'dock.expand': string;
    'dock.collapse': string;
    'dock.closeTab': string;
    'dock.refresh': string;
    'dock.copyPath': string;
    'dock.download': string;
    'dock.close': string;
    'dock.copied': string;
    'preview.loading': string;
    'preview.unavailable': string;
    'preview.empty': string;
    'preview.retry': string;
};
export type OutputDockKey = keyof typeof zh;
export declare const en: Record<OutputDockKey, string>;
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        'output-dock': OutputDockKey;
    }
}
