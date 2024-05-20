import { useCallback, RefObject, useRef } from 'react';
import { findNodeHandle } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { SCROLLABLE_STATE, SCROLLABLE_TYPE } from '../constants';
import type { ScrollableRef, Scrollable } from '../types';

export const useScrollable = () => {
  // refs
  const scrollableRef = useRef<ScrollableRef>(null);
  const previousScrollableRef = useRef<ScrollableRef>(null);

  // variables
  const animatedScrollableType = useSharedValue<SCROLLABLE_TYPE>(
    SCROLLABLE_TYPE.UNDETERMINED
  );
  const animatedScrollableContentOffsetY = useSharedValue<number>(0);
  const animatedScrollableOverrideState = useSharedValue<SCROLLABLE_STATE>(
    SCROLLABLE_STATE.UNDETERMINED
  );
  const isScrollableRefreshable = useSharedValue<boolean>(false);

  // callbacks
  const setScrollableRef = useCallback((ref: ScrollableRef) => {
    // get current node handle id
    let currentRefId = scrollableRef.current?.id ?? null;

    if (currentRefId !== ref.id) {
      if (scrollableRef.current) {
        // @ts-ignore
        previousScrollableRef.current = scrollableRef.current;
      }
      // @ts-ignore
      scrollableRef.current = ref;
    }
  }, []);

  const removeScrollableRef = useCallback((ref: RefObject<Scrollable>) => {
    // find node handle id
    let id;
    try {
      id = findNodeHandle(ref.current);
    } catch {
      return;
    }

    // get current node handle id
    let currentRefId = scrollableRef.current?.id ?? null;

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
    removeScrollableRef,
  };
};
