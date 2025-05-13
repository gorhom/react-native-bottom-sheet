interface PrintOptions {
    component?: string;
    category?: 'layout' | 'effect' | 'callback';
    method?: string;
    params?: Record<string, unknown> | string | number | boolean;
}
type Print = (options: PrintOptions) => void;
declare const enableLogging: (excludeCategories?: PrintOptions["category"][]) => void;
declare let print: Print;
export { print, enableLogging };
//# sourceMappingURL=logger.d.ts.map