import { useCallback } from 'react';
import { findNodeHandle, NativeScrollEvent } from 'react-native';
import {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  scrollTo,
  runOnUI,
  useAnimatedProps,
} from 'react-native-reanimated';
import { useBottomSheetInternal } from './useBottomSheetInternal';
import type { Scrollable, ScrollableType } from '../types';

export const useScrollableInternal = (type: ScrollableType) => {
  // refs
  const scrollableRef = useAnimatedRef<Scrollable>();
  const scrollableContentOffsetY = useSharedValue<number>(0);

  // hooks
  const {
    snapPointsCount,
    animatedIndex,
    scrollableDecelerationRate,
    scrollableContentOffsetY: _rootScrollableContentOffsetY,
    setScrollableRef,
    removeScrollableRef,
  } = useBottomSheetInternal();

  // variables
  const scrollableAnimatedProps = useAnimatedProps(() => ({
    decelerationRate: scrollableDecelerationRate.value,
  }));

  // callbacks
  const handleScrollEvent = useAnimatedScrollHandler({
    onBeginDrag: ({ contentOffset: { y } }: NativeScrollEvent) => {
      if (animatedIndex.value !== snapPointsCount - 1) {
        scrollableContentOffsetY.value = 0;
        _rootScrollableContentOffsetY.value = 0;
        return;
      }
      scrollableContentOffsetY.value = y;
      _rootScrollableContentOffsetY.value = y;
    },
    onScroll: () => {
      if (animatedIndex.value !== snapPointsCount - 1) {
        // @ts-ignore
        scrollTo(scrollableRef, 0, 0, false);
        scrollableContentOffsetY.value = 0;
        return;
      }
    },
    onEndDrag: () => {
      if (animatedIndex.value !== snapPointsCount - 1) {
        // @ts-ignore
        scrollTo(scrollableRef, 0, 0, false);
        scrollableContentOffsetY.value = 0;
        return;
      }
    },
    onMomentumEnd: () => {
      if (animatedIndex.value !== snapPointsCount - 1) {
        // @ts-ignore
        scrollTo(scrollableRef, 0, 0, false);
        scrollableContentOffsetY.value = 0;
        return;
      }
    },
  });
  const handleSettingScrollable = useCallback(() => {
    // set current content offset
    runOnUI(() => {
      _rootScrollableContentOffsetY.value = scrollableContentOffsetY.value;
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
    _rootScrollableContentOffsetY,
    removeScrollableRef,
    scrollableContentOffsetY,
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
