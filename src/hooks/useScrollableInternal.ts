import { useCallback } from 'react';
import { findNodeHandle } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedRef,
} from 'react-native-reanimated';
import { useBottomSheetInternal } from '../hooks/useBottomSheetInternal';
import type { Scrollable, ScrollableType } from '../types';

export const useScrollableInternal = (type: ScrollableType) => {
  // refs
  const scrollableContentOffsetY = useSharedValue<number>(0);
  const scrollableRef = useAnimatedRef<Scrollable>(null);

  // hooks
  const {
    scrollableContentOffsetY: _scrollableContentOffsetY,
    setScrollableRef,
    removeScrollableRef,
  } = useBottomSheetInternal();

  // callbacks
  const handleScrollEvent = useAnimatedScrollHandler({
    onBeginDrag: event => {
      scrollableContentOffsetY.value = event.contentOffset.y;
    },
  });
  const handleSettingScrollable = useCallback(() => {
    'worklet';
    _scrollableContentOffsetY.value = scrollableContentOffsetY.value;

    const id = findNodeHandle(scrollableRef.current);
    if (id) {
      setScrollableRef({
        id: id,
        type,
        // @ts-ignore
        node: scrollableRef.current,
      });
    } else {
      console.warn(`Couldn't find the scrollable node handle id!`);
    }

    return () => {
      removeScrollableRef(scrollableRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    scrollableRef,
    handleScrollEvent,
    handleSettingScrollable,
  };
};
