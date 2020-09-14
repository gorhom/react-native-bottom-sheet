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
import { GESTURE } from '../constants';

interface PanGestureHandlerConfigs {
  type: GESTURE;
  animatedPosition: Animated.SharedValue<number>;
  snapPoints: number[];
  offset?: Animated.SharedValue<number>;
  lastActiveGesture: Animated.SharedValue<GESTURE>;
  animateToPoint: (point: number) => void;
}

export const usePanGestureHandler = ({
  type,
  animatedPosition,
  snapPoints,
  offset,
  lastActiveGesture,
  animateToPoint,
}: PanGestureHandlerConfigs): [
  Animated.SharedValue<State>,
  Animated.SharedValue<number>,
  Animated.SharedValue<number>,
  (event: PanGestureHandlerGestureEvent) => void
] => {
  const gestureState = useSharedValue<State>(State.UNDETERMINED);
  const gestureTranslationY = useSharedValue(0);
  const gestureVelocityY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<Record<string, number>>({
    onStart: ({ state, translationY, velocityY }, context) => {
      // cancel current animation
      cancelAnimation(animatedPosition);

      // set active gesture type
      lastActiveGesture.value = type;

      // store current animated position
      context.lastAnimatedPosition = animatedPosition.value;

      // set variables
      gestureState.value = state;
      gestureTranslationY.value = translationY;
      gestureVelocityY.value = velocityY;
    },
    onActive: ({ state, translationY, velocityY }, context) => {
      gestureState.value = state;
      gestureTranslationY.value = translationY;
      gestureVelocityY.value = velocityY;

      animatedPosition.value = clamp(
        context.lastAnimatedPosition +
          translationY +
          (offset && context.lastAnimatedPosition === 0 ? offset.value : 0) *
            -1,
        snapPoints[snapPoints.length - 1],
        snapPoints[0]
      );
    },
    onEnd: ({ state }, context) => {
      gestureState.value = state;
      if (
        (offset ? offset.value : 0) > 0 &&
        context.lastAnimatedPosition === 0 &&
        animatedPosition.value === 0
      ) {
        return;
      }
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
