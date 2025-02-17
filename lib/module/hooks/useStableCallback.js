"use strict";

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
/**
 * Provide a stable version of useCallback.
 */
export function useStableCallback(callback) {
  const callbackRef = useRef();
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });
  useEffect(() => {
    return () => {
      callbackRef.current = undefined;
    };
  }, []);
  return useCallback((...args) => {
    return callbackRef.current?.(...args);
  }, []);
}
//# sourceMappingURL=useStableCallback.js.map