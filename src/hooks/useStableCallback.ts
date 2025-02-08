import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

type Callback<T extends unknown[], R> = (...args: T) => R;

/**
 * Provide a stable version of useCallback.
 */
export function useStableCallback<T extends unknown[], R>(
  callback: Callback<T, R>
) {
  const callbackRef = useRef<Callback<T, R>>();

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    return () => {
      callbackRef.current = undefined;
    };
  }, []);

  return useCallback<Callback<T, R | undefined>>((...args) => {
    return callbackRef.current?.(...args);
  }, []);
}
