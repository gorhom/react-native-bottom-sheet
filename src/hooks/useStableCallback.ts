import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

// biome-ignore lint: to be addressed!
type Callback<T> = (...args: T[]) => any;

/**
 * Provide a stable version of useCallback.
 */
export function useStableCallback<T>(callback: Callback<T>) {
  const callbackRef = useRef<Callback<T>>();

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    return () => {
      callbackRef.current = undefined;
    };
  }, []);

  return useCallback<Callback<T>>((...args) => {
    return callbackRef.current?.(...args);
  }, []);
}
