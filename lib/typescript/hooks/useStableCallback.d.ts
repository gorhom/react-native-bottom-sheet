type Callback<T> = (...args: T[]) => any;
/**
 * Provide a stable version of useCallback.
 */
export declare function useStableCallback<T>(callback: Callback<T>): Callback<T>;
export {};
//# sourceMappingURL=useStableCallback.d.ts.map