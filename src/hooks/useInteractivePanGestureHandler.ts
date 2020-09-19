import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  cancelAnimation,
} from 'react-native-reanimated';
import {
  State,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { clamp } from 'react-native-redash';
import { snapPoint } from '../utilities';
import { GESTURE } from '../constants';

export const useInteractivePanGestureHandler = (
  type: GESTURE,
  animatedPosition: Animated.SharedValue<number>,
  snapPoints: number[],
  animateToPoint: (point: number) => void,
  offset?: Animated.SharedValue<number>
): [
  (event: PanGestureHandlerGestureEvent) => void,
  Animated.SharedValue<State>,
  Animated.SharedValue<number>,
  Animated.SharedValue<number>
] => {
  const gestureState = useSharedValue<State>(State.UNDETERMINED);
  const gestureTranslationY = useSharedValue(0);
  const gestureVelocityY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<Record<string, number>>(
    {
      onStart: ({ state, translationY, velocityY }, context) => {
        // cancel current animation
        cancelAnimation(animatedPosition);

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
    },
    /** @TODO this should be fixed with reanimated alpha 7 */
    // @ts-ignore
    [type, snapPoints, animateToPoint]
  );

  return [gestureHandler, gestureState, gestureTranslationY, gestureVelocityY];
};
