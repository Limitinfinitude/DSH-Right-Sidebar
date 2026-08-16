export declare const MAX_TABLE_ROWS = 10000;
export declare const TEXT_PAGE_SIZE = 250;
export type DataPreview = {
    readonly kind: 'json';
    readonly value: unknown;
    readonly records: number;
} | {
    readonly kind: 'table';
    readonly columns: readonly string[];
    readonly rows: readonly (readonly string[])[];
    readonly truncated: boolean;
} | {
    readonly kind: 'text';
    readonly content: string;
} | {
    readonly kind: 'error';
    readonly message: string;
};
export declare function parseDataPreview(path: string, content: string): DataPreview;
export declare function filterTableRows(rows: readonly (readonly string[])[], query: string): readonly (readonly string[])[];
export declare function sortTableRows(rows: readonly (readonly string[])[], column: number, direction: 'asc' | 'desc'): readonly (readonly string[])[];
export declare function paginateRows<T>(rows: readonly T[], requestedPage: number, pageSize: number): {
    readonly page: number;
    readonly pageCount: number;
    readonly rows: readonly T[];
};
export declare function windowTextLines(lines: readonly string[], page: number, pageSize?: number): {
    readonly page: number;
    readonly pageCount: number;
    readonly lines: readonly {
        index: number;
        text: string;
    }[];
};
/** Return matching JSON nodes and their ancestors in one traversal. */
export declare function collectJsonMatchPaths(value: unknown, rawQuery: string): ReadonlySet<string>;
export declare function searchTextLines(content: string, query: string): {
    readonly lines: readonly string[];
    readonly matches: readonly number[];
};
