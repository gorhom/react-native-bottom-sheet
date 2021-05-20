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

export interface useInteractivePanGestureHandlerConfigs {
  type: GESTURE;
  enableOverDrag: boolean;
  enablePanDownToClose: boolean;
  overDragResistanceFactor: number;
  keyboardBehavior: keyof typeof KEYBOARD_BEHAVIOR;
  isInTemporaryPosition: Animated.SharedValue<boolean>;
  keyboardState: Animated.SharedValue<KEYBOARD_STATE>;
  keyboardHeight: Animated.SharedValue<number>;
  animatedSnapPoints: Animated.SharedValue<number[]>;
  animatedPosition: Animated.SharedValue<number>;
  animatedContainerHeight: Animated.SharedValue<number>;
  scrollableContentOffsetY?: Animated.SharedValue<number>;
  animateToPoint: (point: number, velocity: number) => void;
}

type InteractivePanGestureHandlerContextType = {
  startPosition: number;
  keyboardState: KEYBOARD_STATE;
};

export const useInteractivePanGestureHandler = ({
  type,
  enableOverDrag,
  enablePanDownToClose,
  overDragResistanceFactor,
  keyboardState,
  keyboardBehavior,
  keyboardHeight,
  isInTemporaryPosition,
  animatedPosition,
  animatedSnapPoints,
  animatedContainerHeight,
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
      context.startPosition = animatedPosition.value;
      context.keyboardState = keyboardState.value;

      if (
        keyboardState.value === KEYBOARD_STATE.SHOWN &&
        (keyboardBehavior === KEYBOARD_BEHAVIOR.interactive ||
          keyboardBehavior === KEYBOARD_BEHAVIOR.fullScreen)
      ) {
        isInTemporaryPosition.value = true;
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

      const position = context.startPosition + translationY;
      let maxSnapPoint =
        animatedSnapPoints.value[animatedSnapPoints.value.length - 1];
      /**
       * if keyboard is shown, then we set the max point to the current
       * position.
       */
      if (
        isInTemporaryPosition.value &&
        context.keyboardState === KEYBOARD_STATE.SHOWN
      ) {
        maxSnapPoint = context.startPosition;
      }
      /**
       * if current position is out of provided `snapPoints` and smaller then
       * max snap pont, then we set the max point to the current position.
       */
      if (isInTemporaryPosition.value && context.startPosition < maxSnapPoint) {
        maxSnapPoint = context.startPosition;
      }

      const minSnapPoint = enablePanDownToClose
        ? animatedContainerHeight.value
        : animatedSnapPoints.value[0];

      const negativeScrollableContentOffset =
        context.startPosition === maxSnapPoint && scrollableContentOffsetY
          ? scrollableContentOffsetY.value * -1
          : 0;
      const clampedPosition = clamp(
        position + negativeScrollableContentOffset,
        maxSnapPoint,
        minSnapPoint
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

        if (type === GESTURE.HANDLE && position > minSnapPoint) {
          const resistedPosition =
            minSnapPoint +
            Math.sqrt(1 + (position - minSnapPoint)) * overDragResistanceFactor;
          animatedPosition.value = resistedPosition;
          return;
        }

        if (
          type === GESTURE.CONTENT &&
          position + negativeScrollableContentOffset > minSnapPoint
        ) {
          const resistedPosition =
            minSnapPoint +
            Math.sqrt(
              1 + (position + negativeScrollableContentOffset - minSnapPoint)
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

      /**
       * if the sheet is in a temporary position and the gesture ended above
       * the current position, then we snap back to the temporary position.
       */
      if (
        isInTemporaryPosition.value &&
        context.startPosition >= animatedPosition.value
      ) {
        if (context.startPosition > animatedPosition.value) {
          animateToPoint(context.startPosition, gestureVelocityY.value / 2);
        }
        return;
      }

      /**
       * close keyboard if current position is below the recorded
       * start position and keyboard still shown.
       */
      if (
        animatedPosition.value > context.startPosition &&
        context.keyboardState === KEYBOARD_STATE.SHOWN
      ) {
        runOnJS(Keyboard.dismiss)();
      }

      if (isInTemporaryPosition.value) {
        isInTemporaryPosition.value = false;
      }

      const snapPoints = animatedSnapPoints.value.slice();
      if (enablePanDownToClose) {
        snapPoints.unshift(animatedContainerHeight.value);
      }

      const destinationPoint = snapPoint(
        gestureTranslationY.value + context.startPosition,
        gestureVelocityY.value,
        snapPoints
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
        context.startPosition ===
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
