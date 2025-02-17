type Callback<T extends unknown[], R> = (...args: T) => R;
/**
 * Provide a stable version of useCallback.
 */
export declare function useStableCallback<T extends unknown[], R>(callback: Callback<T, R>): Callback<T, R | undefined>;
export {};
//# sourceMappingURL=useStableCallback.d.ts.map