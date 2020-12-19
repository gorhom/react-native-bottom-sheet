import { useCallback } from 'react';
import { findNodeHandle, NativeScrollEvent } from 'react-native';
import {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  scrollTo,
  runOnUI,
} from 'react-native-reanimated';
import { useScrollableAnimatedProps } from './useScrollableAnimatedProps';
import { useBottomSheetInternal } from './useBottomSheetInternal';
import type { Scrollable, ScrollableType } from '../types';

export const useScrollableInternal = (type: ScrollableType) => {
  // refs
  const scrollableRef = useAnimatedRef<Scrollable>();
  const scrollablePosition = useSharedValue<number>(0);
  const scrollableContentOffsetY = useSharedValue<number>(0);

  // hooks
  const scrollableAnimatedProps = useScrollableAnimatedProps();
  const {
    snapPointsCount,
    animatedIndex,
    scrollableContentOffsetY: _scrollableContentOffsetY,
    setScrollableRef,
    removeScrollableRef,
  } = useBottomSheetInternal();

  // callbacks
  const handleScrollEvent = useAnimatedScrollHandler({
    onBeginDrag: ({ contentOffset: { y } }: NativeScrollEvent) => {
      if (animatedIndex.value !== snapPointsCount - 1) {
        return;
      }
      scrollablePosition.value = y;
      scrollableContentOffsetY.value = y;
      _scrollableContentOffsetY.value = y;
    },
    onScroll: ({ contentOffset: { y } }: NativeScrollEvent) => {
      if (animatedIndex.value !== snapPointsCount - 1) {
        // @ts-ignore
        scrollTo(scrollableRef, 0, scrollablePosition.value, false);
        return;
      }
      scrollablePosition.value = y;
    },
    onEndDrag: () => {
      if (animatedIndex.value !== snapPointsCount - 1) {
        // @ts-ignore
        scrollTo(scrollableRef, 0, scrollablePosition.value, false);
        return;
      }
    },
    onMomentumEnd: () => {
      if (animatedIndex.value !== snapPointsCount - 1) {
        // @ts-ignore
        scrollTo(scrollableRef, 0, scrollablePosition.value, false);
        return;
      }
    },
  });
  const handleSettingScrollable = useCallback(() => {
    // set current content offset
    runOnUI(() => {
      _scrollableContentOffsetY.value = scrollableContentOffsetY.value;
    })();

    // set current scrollable ref
    const id = findNodeHandle(scrollableRef.current);
    if (id) {
      setScrollableRef({
        id: id,
        type,
        node: scrollableRef,
        didResize: false,
      });
    } else {
      console.warn(`Couldn't find the scrollable node handle id!`);
    }

    return () => {
      removeScrollableRef(scrollableRef);
    };
  }, [
    _scrollableContentOffsetY,
    removeScrollableRef,
    scrollableContentOffsetY.value,
    scrollableRef,
    setScrollableRef,
    type,
  ]);

  return {
    scrollableRef,
    scrollableAnimatedProps,
    handleScrollEvent,
    handleSettingScrollable,
  };
};
