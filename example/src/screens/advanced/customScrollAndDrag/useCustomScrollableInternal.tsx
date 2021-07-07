import Animated, {
  runOnUI,
  scrollTo,
  useAnimatedProps,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { Scrollable } from '../../../../../src/types';
import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import { findNodeHandle, NativeScrollEvent } from 'react-native';
import {
  ANIMATION_STATE,
  SCROLLABLE_STATE,
} from '../../../../../src/constants';
import { useCallback } from 'react';
import { useGestureTranslationY } from './GestureTranslationContext';

type HandleScrollEventContextType = {
  initialContentOffsetY: number;
  startedIndex: number;
};

type GetMetadataParams = {
  context: HandleScrollEventContextType;
  gestureTranslationY: Animated.SharedValue<number>;
  animatedSnapPoints: Animated.SharedValue<number[]>;
};

function getScrollMetadata({
  gestureTranslationY,
  animatedSnapPoints,
  context,
}: GetMetadataParams) {
  'worklet';
  const isDraggingDown = gestureTranslationY.value > 0;
  const didStartAtMiddle = context.startedIndex === 1;
  const isDraggingDownFromMiddle = isDraggingDown && didStartAtMiddle;
  const isDraggingDownFromTop = isDraggingDown && context.startedIndex === 2;
  const secondHighestSnapPoint =
    animatedSnapPoints.value[animatedSnapPoints.value.length - 2];
  const didDragBelowSecondSnapPoint =
    gestureTranslationY.value > secondHighestSnapPoint;

  const ret = {
    isDraggingDownFromMiddle,
    isDraggingDownFromTop,
    didStartAtMiddle,
    didDragBelowSecondSnapPoint,
  };
  return ret;
}

export const useCustomScrollableInternal = () => {
  // refs
  const scrollableRef = useAnimatedRef<Scrollable>();
  const scrollableContentOffsetY = useSharedValue<number>(0);

  // hooks
  const {
    animatedScrollableState,
    animatedAnimationState,
    scrollableContentOffsetY: rootScrollableContentOffsetY,
    setScrollableRef,
    removeScrollableRef,
    animatedIndex,
    animatedSnapPoints,
  } = useBottomSheetInternal();
  const gestureTranslationY = useGestureTranslationY();

  // callbacks
  const handleScrollEvent =
    useAnimatedScrollHandler<HandleScrollEventContextType>({
      onBeginDrag: ({ contentOffset: { y } }: NativeScrollEvent, context) => {
        scrollableContentOffsetY.value = y;
        rootScrollableContentOffsetY.value = y;
        context.initialContentOffsetY = y;
        context.startedIndex = animatedIndex.value;
      },
      onScroll: (_, context) => {
        const {
          didDragBelowSecondSnapPoint,
          isDraggingDownFromMiddle,
          isDraggingDownFromTop,
        } = getScrollMetadata({
          context,
          animatedSnapPoints,
          gestureTranslationY,
        });

        if (
          isDraggingDownFromMiddle ||
          (isDraggingDownFromTop && didDragBelowSecondSnapPoint)
        ) {
          return;
        }

        if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
          const lockPosition = context.initialContentOffsetY ?? 0;
          // @ts-ignore
          scrollTo(scrollableRef, 0, lockPosition, false);
          scrollableContentOffsetY.value = lockPosition;
          return;
        }
      },
      onEndDrag: ({ contentOffset: { y } }: NativeScrollEvent, context) => {
        const {
          didStartAtMiddle,
          didDragBelowSecondSnapPoint,
          isDraggingDownFromTop,
        } = getScrollMetadata({
          context,
          animatedSnapPoints,
          gestureTranslationY,
        });

        if (
          didStartAtMiddle ||
          (isDraggingDownFromTop && didDragBelowSecondSnapPoint)
        ) {
          return;
        }
        if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
          const lockPosition = context.initialContentOffsetY ?? 0;
          // @ts-ignore
          scrollTo(scrollableRef, 0, lockPosition, false);
          scrollableContentOffsetY.value = lockPosition;
          return;
        }
        if (animatedAnimationState.value !== ANIMATION_STATE.RUNNING) {
          scrollableContentOffsetY.value = y;
          rootScrollableContentOffsetY.value = y;
        }
      },
      onMomentumEnd: ({ contentOffset: { y } }: NativeScrollEvent, context) => {
        const {
          didStartAtMiddle,
          didDragBelowSecondSnapPoint,
          isDraggingDownFromTop,
        } = getScrollMetadata({
          context,
          animatedSnapPoints,
          gestureTranslationY,
        });

        if (
          didStartAtMiddle ||
          (isDraggingDownFromTop && didDragBelowSecondSnapPoint)
        ) {
          return;
        }
        if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
          const lockPosition = context.initialContentOffsetY ?? 0;
          // @ts-ignore
          scrollTo(scrollableRef, 0, lockPosition, false);
          scrollableContentOffsetY.value = 0;
          return;
        }
        if (animatedAnimationState.value !== ANIMATION_STATE.RUNNING) {
          scrollableContentOffsetY.value = y;
          rootScrollableContentOffsetY.value = y;
        }
      },
    });
  const handleSettingScrollable = useCallback(() => {
    // set current content offset
    runOnUI(() => {
      rootScrollableContentOffsetY.value = scrollableContentOffsetY.value;
    })();

    // set current scrollable ref
    const id = findNodeHandle(scrollableRef.current);
    if (id) {
      setScrollableRef({
        id: id,
        node: scrollableRef,
      });
    } else {
      console.warn(`Couldn't find the scrollable node handle id!`);
    }

    return () => {
      removeScrollableRef(scrollableRef);
    };
  }, [
    rootScrollableContentOffsetY,
    removeScrollableRef,
    scrollableContentOffsetY,
    scrollableRef,
    setScrollableRef,
  ]);

  const scrollableAnimatedProps = useAnimatedProps(() => ({}));

  return {
    scrollableRef,
    handleScrollEvent,
    handleSettingScrollable,
    scrollableAnimatedProps,
  };
};
