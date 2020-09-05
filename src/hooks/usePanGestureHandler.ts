import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  cancelAnimation,
} from 'react-native-reanimated';
import {
  State,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { snapPoint, clamp } from '../utilities';

export const usePanGestureHandler = (
  animatedPosition: Animated.SharedValue<number>,
  snapPoints: number[],
  animateToPoint: (point: number) => void
): [
  Animated.SharedValue<State>,
  Animated.SharedValue<number>,
  Animated.SharedValue<number>,
  (event: PanGestureHandlerGestureEvent) => void
] => {
  const gestureState = useSharedValue<State>(State.UNDETERMINED);
  const gestureTranslationY = useSharedValue(0);
  const gestureVelocityY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: ({ state, translationY, velocityY }, context) => {
      cancelAnimation(animatedPosition);
      context.lastAnimatedPosition = animatedPosition.value;
      gestureState.value = state;
      gestureTranslationY.value = translationY;
      gestureVelocityY.value = velocityY;
    },
    onActive: ({ state, translationY, velocityY }, context) => {
      gestureState.value = state;
      gestureTranslationY.value = translationY;
      gestureVelocityY.value = velocityY;

      animatedPosition.value = clamp(
        context.lastAnimatedPosition + translationY,
        snapPoints[snapPoints.length - 1],
        snapPoints[0]
      );
    },
    onEnd: ({ state }, context) => {
      gestureState.value = state;
      animateToPoint(
        snapPoint(
          gestureTranslationY.value + context.lastAnimatedPosition,
          gestureVelocityY.value,
          snapPoints
        )
      );
    },
  });

  return [gestureState, gestureTranslationY, gestureVelocityY, gestureHandler];
};
