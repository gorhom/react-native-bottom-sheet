import Animated, {
  scrollTo,
  useWorkletCallback,
} from 'react-native-reanimated';
import {
  useBottomSheetInternal,
  ANIMATION_STATE,
  SCROLLABLE_STATE,
  ScrollEventHandlerCallbackType,
  ScrollEventsHandlersHookType,
} from '@gorhom/bottom-sheet';
import { useGestureTranslationY } from './GestureTranslationContext';

type ScrollEventContextType = {
  initialContentOffsetY: number;
  startedIndex: number;
};

type GetMetadataParams = {
  context: ScrollEventContextType;
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

export const useCustomScrollEventsHandlers: ScrollEventsHandlersHookType = (
  scrollableRef,
  scrollableContentOffsetY: Animated.SharedValue<number>
) => {
  // hooks
  const {
    animatedScrollableState,
    animatedAnimationState,
    animatedScrollableContentOffsetY: rootScrollableContentOffsetY,
    animatedScrollableOverrideState,
    animatedIndex,
    animatedSnapPoints,
  } = useBottomSheetInternal();
  const gestureTranslationY = useGestureTranslationY();

  // callbacks
  const handleOnBeginDrag: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useWorkletCallback(
      ({ contentOffset: { y } }, context) => {
        scrollableContentOffsetY.value = y;
        rootScrollableContentOffsetY.value = y;
        context.initialContentOffsetY = y;
        context.startedIndex = animatedIndex.value;
      },
      [animatedIndex, rootScrollableContentOffsetY, scrollableContentOffsetY]
    );
  const handleOnScroll: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useWorkletCallback(
      (_, context) => {
        const {
          didDragBelowSecondSnapPoint,
          isDraggingDownFromMiddle,
          isDraggingDownFromTop,
        } = getScrollMetadata({
          context,
          animatedSnapPoints,
          gestureTranslationY,
        });

        /**
         * override scrollable state.
         */
        if (isDraggingDownFromMiddle) {
          animatedScrollableOverrideState.value = SCROLLABLE_STATE.UNLOCKED;
        } else {
          animatedScrollableOverrideState.value = SCROLLABLE_STATE.UNDETERMINED;
        }

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
      [
        scrollableRef,
        scrollableContentOffsetY,
        animatedScrollableState,
        animatedSnapPoints,
        gestureTranslationY,
      ]
    );
  const handleOnEndDrag: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useWorkletCallback(
      ({ contentOffset: { y } }, context) => {
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
      [
        animatedAnimationState,
        animatedScrollableState,
        animatedSnapPoints,
        gestureTranslationY,
        rootScrollableContentOffsetY,
        scrollableContentOffsetY,
        scrollableRef,
      ]
    );
  const handleOnMomentumEnd: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useWorkletCallback(
      ({ contentOffset: { y } }, context) => {
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
      [
        scrollableRef,
        scrollableContentOffsetY,
        animatedAnimationState,
        animatedScrollableState,
        animatedSnapPoints,
        gestureTranslationY,
        rootScrollableContentOffsetY,
      ]
    );

  return {
    handleOnBeginDrag,
    handleOnScroll,
    handleOnEndDrag,
    handleOnMomentumEnd,
  };
};
