import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  cancelAnimation,
} from 'react-native-reanimated';
import {
  State,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { clamp, snapPoint } from 'react-native-redash';
import { GESTURE } from '../constants';

type InteractivePanGestureHandlerContextType = {
  currentPosition: number;
};

export const useInteractivePanGestureHandler = (
  type: GESTURE,
  animatedPosition: Animated.SharedValue<number>,
  snapPoints: Animated.SharedValue<number[]>,
  animateToPoint: (point: number, velocity: number) => void,
  enableOverDrag: boolean,
  overDragResistanceFactor: number,
  scrollableContentOffsetY?: Animated.SharedValue<number>
): [
  (event: PanGestureHandlerGestureEvent) => void,
  Animated.SharedValue<State>,
  Animated.SharedValue<number>,
  Animated.SharedValue<number>
] => {
  const gestureState = useSharedValue<State>(State.UNDETERMINED);
  const gestureTranslationY = useSharedValue(0);
  const gestureVelocityY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    InteractivePanGestureHandlerContextType
  >(
    {
      onStart: ({ state, translationY, velocityY }, context) => {
        // cancel current animation
        cancelAnimation(animatedPosition);

        // store current animated position
        context.currentPosition = animatedPosition.value;

        // set variables
        gestureState.value = state;
        gestureTranslationY.value = translationY;
        gestureVelocityY.value = velocityY;
      },
      onActive: ({ state, translationY, velocityY }, context) => {
        gestureState.value = state;
        gestureTranslationY.value = translationY;
        gestureVelocityY.value = velocityY;

        const position = context.currentPosition + translationY;
        const negativeScrollableContentOffset =
          context.currentPosition ===
            snapPoints.value[snapPoints.value.length - 1] &&
          scrollableContentOffsetY
            ? scrollableContentOffsetY.value * -1
            : 0;
        const clampedPosition = clamp(
          position + negativeScrollableContentOffset,
          snapPoints.value[snapPoints.value.length - 1],
          snapPoints.value[0]
        );

        if (enableOverDrag) {
          if (
            type === GESTURE.HANDLE &&
            position <= snapPoints.value[snapPoints.value.length - 1]
          ) {
            const resistedPosition =
              snapPoints.value[snapPoints.value.length - 1] -
              Math.sqrt(
                1 + (snapPoints.value[snapPoints.value.length - 1] - position)
              ) *
                overDragResistanceFactor;
            animatedPosition.value = resistedPosition;
            return;
          }

          if (position >= snapPoints.value[0]) {
            const resistedPosition =
              snapPoints.value[0] +
              Math.sqrt(1 + (position - snapPoints.value[0])) *
                overDragResistanceFactor;
            animatedPosition.value = resistedPosition;
            return;
          }
        }

        animatedPosition.value = clampedPosition;
      },
      onEnd: ({ state }, context) => {
        gestureState.value = state;

        const destinationPoint = snapPoint(
          gestureTranslationY.value + context.currentPosition,
          gestureVelocityY.value,
          snapPoints.value
        );

        /**
         * if destination point is the same as the current position,
         * then no need to perform animation.
         */
        if (destinationPoint === animatedPosition.value) {
          return;
        }

        if (
          (scrollableContentOffsetY ? scrollableContentOffsetY.value : 0) > 0 &&
          context.currentPosition ===
            snapPoints.value[snapPoints.value.length - 1] &&
          animatedPosition.value ===
            snapPoints.value[snapPoints.value.length - 1]
        ) {
          return;
        }

        animateToPoint(destinationPoint, gestureVelocityY.value / 2);
      },
      onCancel: ({ state }) => {
        gestureState.value = state;
      },
      onFail: ({ state }) => {
        gestureState.value = state;
      },
      onFinish: ({ state }) => {
        gestureState.value = state;
      },
    },
    [snapPoints, enableOverDrag, overDragResistanceFactor]
  );

  return [gestureHandler, gestureState, gestureTranslationY, gestureVelocityY];
};
