declare type Callback = (...args: any[]) => any;
/**
 * Provide a stable version of useCallback
 * https://gist.github.com/JakeCoxon/c7ebf6e6496f8468226fd36b596e1985
 */
export declare const useStableCallback: (callback: Callback) => (...args: any) => any;
export {};
