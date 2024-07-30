interface PrintOptions {
    component?: string;
    method?: string;
    params?: Record<string, any> | string | number | boolean;
}
declare type Print = (options: PrintOptions) => void;
declare const enableLogging: () => void;
declare let print: Print;
export { print, enableLogging };
