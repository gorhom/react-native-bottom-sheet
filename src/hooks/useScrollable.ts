import { useCallback, RefObject, useRef } from 'react';
import { findNodeHandle, Platform } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { SCROLLABLE_STATE } from '../constants';
import type { ScrollableRef, Scrollable } from '../types';

export const useScrollable = () => {
  // refs
  const scrollableRef = useRef<ScrollableRef>(null);
  const previousScrollableRef = useRef<ScrollableRef>(null);

  // variables
  const scrollableState = useSharedValue<SCROLLABLE_STATE>(
    SCROLLABLE_STATE.LOCKED
  );
  const scrollableContentOffsetY = useSharedValue<number>(0);

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
    let id = findNodeHandle(ref.current);

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

  const flashScrollableIndicators = useCallback(() => {
    let type = scrollableRef.current?.type ?? undefined;
    let node = scrollableRef.current?.node ?? undefined;
    let didResize = scrollableRef.current?.didResize ?? false;

    if (!type || !node) {
      return;
    }

    // @ts-ignore
    if (node.current.flashScrollIndicators) {
      // @ts-ignore
      node.current.flashScrollIndicators();

      /**
       * this is a hack to resize the scroll indicator
       * size on iOS.
       */
      if (Platform.OS === 'ios' && !didResize) {
        // @ts-ignore
        node.current.setNativeProps({
          bottom: 0.5,
        });

        // @ts-ignore
        scrollableRef.current.didResize = true;
      }
    }
  }, []);

  return {
    scrollableRef,
    scrollableState,
    scrollableContentOffsetY,
    setScrollableRef,
    removeScrollableRef,
    flashScrollableIndicators,
  };
};
