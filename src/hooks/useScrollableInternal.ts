import { useCallback } from 'react';
import { findNodeHandle, NativeScrollEvent, Platform } from 'react-native';
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
import {
  ANIMATION_STATE,
  SCROLLABLE_DECELERATION_RATE_MAPPER,
  SCROLLABLE_STATE,
} from '../constants';

export const useScrollableInternal = (type: ScrollableType) => {
  // refs
  const scrollableRef = useAnimatedRef<Scrollable>();
  const scrollableContentOffsetY = useSharedValue<number>(0);
  const justStartedScrolling = useSharedValue<number>(0);
  const initialScrollingPosition = useSharedValue<number>(0);

  // hooks
  const {
    scrollableState,
    animationState,
    scrollableContentOffsetY: _rootScrollableContentOffsetY,
    setScrollableRef,
    removeScrollableRef,
  } = useBottomSheetInternal();

  // variables
  const scrollableAnimatedProps = useAnimatedProps(() => ({
    decelerationRate:
      SCROLLABLE_DECELERATION_RATE_MAPPER[scrollableState.value],
  }));

  // callbacks
  const handleScrollEvent = useAnimatedScrollHandler({
    onBeginDrag: ({ contentOffset: { y } }: NativeScrollEvent) => {
      if (scrollableState.value === SCROLLABLE_STATE.LOCKED) {
        initialScrollingPosition.value = y;
        justStartedScrolling.value = 1;
        scrollableContentOffsetY.value = 0;
        _rootScrollableContentOffsetY.value = 0;
        return;
      }
      scrollableContentOffsetY.value = y;
      _rootScrollableContentOffsetY.value = y;
    },
    onScroll: () => {
      if (Platform.OS === 'android' && justStartedScrolling.value === 1) {
        justStartedScrolling.value = 0;
        // @ts-ignore
        scrollTo(scrollableRef, 0, initialScrollingPosition.value, false);
        return;
      }
      if (scrollableState.value === SCROLLABLE_STATE.LOCKED) {
        // @ts-ignore
        scrollTo(scrollableRef, 0, 0, false);
        scrollableContentOffsetY.value = 0;
        return;
      }
    },
    onEndDrag: ({ contentOffset: { y } }: NativeScrollEvent) => {
      if (scrollableState.value === SCROLLABLE_STATE.LOCKED) {
        // @ts-ignore
        scrollTo(scrollableRef, 0, 0, false);
        scrollableContentOffsetY.value = 0;
        return;
      }
      if (animationState.value !== ANIMATION_STATE.RUNNING) {
        scrollableContentOffsetY.value = y;
        _rootScrollableContentOffsetY.value = y;
      }
    },
    onMomentumEnd: ({ contentOffset: { y } }: NativeScrollEvent) => {
      if (scrollableState.value === SCROLLABLE_STATE.LOCKED) {
        // @ts-ignore
        scrollTo(scrollableRef, 0, 0, false);
        scrollableContentOffsetY.value = 0;
        return;
      }
      if (animationState.value !== ANIMATION_STATE.RUNNING) {
        scrollableContentOffsetY.value = y;
        _rootScrollableContentOffsetY.value = y;
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
