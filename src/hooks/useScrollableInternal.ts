import { useCallback } from 'react';
import { findNodeHandle } from 'react-native';
import {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  scrollTo,
} from 'react-native-reanimated';
import { useBottomSheetInternal } from '../hooks/useBottomSheetInternal';
import type { Scrollable, ScrollableType } from '../types';

export const useScrollableInternal = (type: ScrollableType) => {
  // refs
  const scrollableRef = useAnimatedRef<Scrollable>();
  const scrollablePosition = useSharedValue<number>(0);
  const scrollableContentOffsetY = useSharedValue<number>(0);

  // hooks
  const {
    animatedPosition,
    scrollableContentOffsetY: _scrollableContentOffsetY,
    setScrollableRef,
    removeScrollableRef,
  } = useBottomSheetInternal();

  // callbacks
  const handleScrollEvent = useAnimatedScrollHandler({
    onBeginDrag: ({ contentOffset: { y } }) => {
      if (animatedPosition.value !== 0) {
        return;
      }

      scrollableContentOffsetY.value = y;
      scrollablePosition.value = y;
      _scrollableContentOffsetY.value = y;
    },
    onScroll: ({ contentOffset: { y } }) => {
      if (animatedPosition.value !== 0) {
        scrollTo(scrollableRef, 0, scrollablePosition.value, false);
        return;
      }
      scrollablePosition.value = y;
    },
    onEndDrag: () => {
      if (animatedPosition.value !== 0) {
        scrollTo(scrollableRef, 0, scrollablePosition.value, false);
        return;
      }
    },
    onMomentumEnd: ({ contentOffset: { y } }) => {
      if (animatedPosition.value !== 0) {
        scrollTo(scrollableRef, 0, scrollablePosition.value, false);
        return;
      }
      scrollablePosition.value = y;
    },
  });
  const handleSettingScrollable = useCallback(() => {
    'worklet';
    // set current content offset
    _scrollableContentOffsetY.value = scrollableContentOffsetY.value;

    // set current scrollable ref
    const id = findNodeHandle(scrollableRef.current);
    if (id) {
      setScrollableRef({
        id: id,
        type,
        node: scrollableRef,
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
