"use strict";

import { useCallback, useRef } from 'react';
import { findNodeHandle } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { SCROLLABLE_STATE, SCROLLABLE_TYPE } from '../constants';
export const useScrollable = () => {
  // refs
  const scrollableRef = useRef(null);
  const previousScrollableRef = useRef(null);

  // variables
  const animatedScrollableType = useSharedValue(SCROLLABLE_TYPE.UNDETERMINED);
  const animatedScrollableContentOffsetY = useSharedValue(0);
  const animatedScrollableOverrideState = useSharedValue(SCROLLABLE_STATE.UNDETERMINED);
  const isScrollableRefreshable = useSharedValue(false);

  // callbacks
  const setScrollableRef = useCallback(ref => {
    // get current node handle id
    const currentRefId = scrollableRef.current?.id ?? null;
    if (currentRefId !== ref.id) {
      if (scrollableRef.current) {
        // @ts-ignore
        previousScrollableRef.current = scrollableRef.current;
      }
      // @ts-ignore
      scrollableRef.current = ref;
    }
  }, []);
  const removeScrollableRef = useCallback(ref => {
    // find node handle id
    let id;
    try {
      id = findNodeHandle(ref.current);
    } catch {
      return;
    }

    // get current node handle id
    const currentRefId = scrollableRef.current?.id ?? null;

    /**
     * @DEV
     * when the incoming node is actually the current node, we reset
     * the current scrollable ref to the previous one.
     */
    if (id === currentRefId) {
      // @ts-ignore
      scrollableRef.current = previousScrollableRef.current;
    }
  }, []);
  return {
    scrollableRef,
    animatedScrollableType,
    animatedScrollableContentOffsetY,
    animatedScrollableOverrideState,
    isScrollableRefreshable,
    setScrollableRef,
    removeScrollableRef
  };
};
//# sourceMappingURL=useScrollable.js.map