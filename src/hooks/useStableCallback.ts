import { useCallback, useEffect, useRef } from 'react';

// biome-ignore lint: to be addressed!
type Callback = (...args: any[]) => any;
/**
 * Provide a stable version of useCallback
 * https://gist.github.com/JakeCoxon/c7ebf6e6496f8468226fd36b596e1985
 */
export const useStableCallback = (callback: Callback) => {
  const callbackRef = useRef<Callback>();
  const memoCallback = useCallback(
    // biome-ignore lint: to be addressed!
    (...args: any) => callbackRef.current && callbackRef.current(...args),
    []
  );
  useEffect(() => {
    callbackRef.current = callback;
    return () => {
      callbackRef.current = undefined;
    };
  });
  return memoCallback;
};
