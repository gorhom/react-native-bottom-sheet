import { Keyboard, Platform } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import {
  State,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { clamp, snapPoint } from 'react-native-redash';
import {
  GESTURE,
  KEYBOARD_BEHAVIOR,
  KEYBOARD_DISMISS_THRESHOLD,
  KEYBOARD_STATE,
  WINDOW_HEIGHT,
} from '../constants';

interface useInteractivePanGestureHandlerConfigs {
  type: GESTURE;
  enableOverDrag: boolean;
  overDragResistanceFactor: number;
  isExtendedByKeyboard: Animated.SharedValue<boolean>;
  keyboardState: Animated.SharedValue<KEYBOARD_STATE>;
  keyboardHeight: Animated.SharedValue<number>;
  keyboardBehavior: keyof typeof KEYBOARD_BEHAVIOR;
  animatedSnapPoints: Animated.SharedValue<number[]>;
  animatedPosition: Animated.SharedValue<number>;
  scrollableContentOffsetY?: Animated.SharedValue<number>;
  animateToPoint: (point: number, velocity: number) => void;
}

type InteractivePanGestureHandlerContextType = {
  currentPosition: number;
  keyboardState: KEYBOARD_STATE;
};

export const useInteractivePanGestureHandler = ({
  type,
  enableOverDrag,
  overDragResistanceFactor,
  keyboardState,
  keyboardBehavior,
  keyboardHeight,
  isExtendedByKeyboard,
  animatedPosition,
  animatedSnapPoints,
  scrollableContentOffsetY,
  animateToPoint,
}: useInteractivePanGestureHandlerConfigs): [
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
  >({
    onStart: ({ state, translationY, velocityY }, context) => {
      // cancel current animation
      cancelAnimation(animatedPosition);

      // store current animated position
      context.currentPosition = animatedPosition.value;
      context.keyboardState = keyboardState.value;

      if (
        keyboardState.value === KEYBOARD_STATE.SHOWN &&
        (keyboardBehavior === KEYBOARD_BEHAVIOR.interactive ||
          keyboardBehavior === KEYBOARD_BEHAVIOR.fullScreen)
      ) {
        isExtendedByKeyboard.value = true;
      }

      // set variables
      gestureState.value = state;
      gestureTranslationY.value = translationY;
      gestureVelocityY.value = velocityY;
    },
    onActive: ({ state, translationY, velocityY, absoluteY }, context) => {
      gestureState.value = state;
      gestureTranslationY.value = translationY;
      gestureVelocityY.value = velocityY;

      const position = context.currentPosition + translationY;
      const maxSnapPoint = isExtendedByKeyboard.value
        ? context.currentPosition
        : animatedSnapPoints.value[animatedSnapPoints.value.length - 1];

      const negativeScrollableContentOffset =
        context.currentPosition === maxSnapPoint && scrollableContentOffsetY
          ? scrollableContentOffsetY.value * -1
          : 0;
      const clampedPosition = clamp(
        position + negativeScrollableContentOffset,
        maxSnapPoint,
        animatedSnapPoints.value[0]
      );

      /**
       * dismiss the keyboard when panning down
       */
      if (translationY > KEYBOARD_DISMISS_THRESHOLD) {
        if (
          keyboardState.value === KEYBOARD_STATE.SHOWN &&
          (Platform.OS === 'android' ||
            keyboardBehavior !== KEYBOARD_BEHAVIOR.interactive ||
            (keyboardBehavior === KEYBOARD_BEHAVIOR.interactive &&
              absoluteY < WINDOW_HEIGHT - keyboardHeight.value))
        ) {
          runOnJS(Keyboard.dismiss)();
        }
      }

      if (enableOverDrag) {
        if (type === GESTURE.HANDLE && position <= maxSnapPoint) {
          const resistedPosition =
            maxSnapPoint -
            Math.sqrt(1 + (maxSnapPoint - position)) * overDragResistanceFactor;
          animatedPosition.value = resistedPosition;
          return;
        }

        if (type === GESTURE.HANDLE && position > animatedSnapPoints.value[0]) {
          const resistedPosition =
            animatedSnapPoints.value[0] +
            Math.sqrt(1 + (position - animatedSnapPoints.value[0])) *
              overDragResistanceFactor;
          animatedPosition.value = resistedPosition;
          return;
        }

        if (
          type === GESTURE.CONTENT &&
          position + negativeScrollableContentOffset >
            animatedSnapPoints.value[0]
        ) {
          const resistedPosition =
            animatedSnapPoints.value[0] +
            Math.sqrt(
              1 +
                (position +
                  negativeScrollableContentOffset -
                  animatedSnapPoints.value[0])
            ) *
              overDragResistanceFactor;
          animatedPosition.value = resistedPosition;
          return;
        }
      }

      animatedPosition.value = clampedPosition;
    },
    onEnd: ({ state }, context) => {
      gestureState.value = state;

      if (
        isExtendedByKeyboard.value &&
        context.currentPosition >= animatedPosition.value
      ) {
        if (context.currentPosition > animatedPosition.value) {
          animateToPoint(context.currentPosition, gestureVelocityY.value / 2);
        }
        return;
      }

      if (isExtendedByKeyboard.value) {
        isExtendedByKeyboard.value = false;
      }

      const destinationPoint = snapPoint(
        gestureTranslationY.value + context.currentPosition,
        gestureVelocityY.value,
        animatedSnapPoints.value
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
          animatedSnapPoints.value[animatedSnapPoints.value.length - 1] &&
        animatedPosition.value ===
          animatedSnapPoints.value[animatedSnapPoints.value.length - 1]
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
  });

  return [gestureHandler, gestureState, gestureTranslationY, gestureVelocityY];
};
