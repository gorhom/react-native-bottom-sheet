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
  GESTURE_SOURCE,
  KEYBOARD_DISMISS_THRESHOLD,
  KEYBOARD_STATE,
  WINDOW_HEIGHT,
} from '../constants';

export interface useInteractivePanGestureHandlerConfigs {
  type: GESTURE_SOURCE;
  enableOverDrag: boolean;
  enablePanDownToClose: boolean;
  overDragResistanceFactor: number;
  isInTemporaryPosition: Animated.SharedValue<boolean>;
  animatedKeyboardState: Animated.SharedValue<KEYBOARD_STATE>;
  animatedKeyboardHeight: Animated.SharedValue<number>;
  animatedSnapPoints: Animated.SharedValue<number[]>;
  animatedPosition: Animated.SharedValue<number>;
  animatedContainerHeight: Animated.SharedValue<number>;
  animatedClosedPosition: Animated.SharedValue<number>;
  scrollableContentOffsetY: Animated.SharedValue<number>;
  isScrollableRefreshable: Animated.SharedValue<boolean>;
  animateToPoint: (point: number, velocity: number) => void;
}

type InteractivePanGestureHandlerContextType = {
  startPosition: number;
  keyboardState: KEYBOARD_STATE;
  isScrollablePositionLocked: boolean;
};

export const useInteractivePanGestureHandler = ({
  type,
  enableOverDrag,
  enablePanDownToClose,
  overDragResistanceFactor,
  animatedKeyboardState,
  animatedKeyboardHeight,
  isInTemporaryPosition,
  animatedPosition,
  animatedSnapPoints,
  animatedContainerHeight,
  animatedClosedPosition,
  scrollableContentOffsetY,
  isScrollableRefreshable,
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
      context.keyboardState = animatedKeyboardState.value;

      /**
       * if scrollable scrolled
       */
      if (scrollableContentOffsetY.value > 0) {
        context.isScrollablePositionLocked = true;
      }

      // set variables
      gestureState.value = state;
      gestureTranslationY.value = translationY;
      gestureVelocityY.value = velocityY;
    },
    onActive: ({ state, translationY, velocityY }, context) => {
      gestureState.value = state;
      gestureTranslationY.value = translationY;
      gestureVelocityY.value = velocityY;

      let highestSnapPoint =
        animatedSnapPoints.value[animatedSnapPoints.value.length - 1];
      /**
       * if keyboard is shown, then we set the highest point to the current
       * position which includes the keyboard height.
       */
      if (
        isInTemporaryPosition.value &&
        context.keyboardState === KEYBOARD_STATE.SHOWN
      ) {
        highestSnapPoint = context.startPosition;
      }
      /**
       * if current position is out of provided `snapPoints` and smaller then
       * highest snap pont, then we set the highest point to the current position.
       */
      if (
        isInTemporaryPosition.value &&
        context.startPosition < highestSnapPoint
      ) {
        highestSnapPoint = context.startPosition;
      }

      const lowestSnapPoint = enablePanDownToClose
        ? animatedContainerHeight.value
        : animatedSnapPoints.value[0];

      /**
       * if scrollable is refreshable and sheet position at the highest
       * point, then do not interact with current gesture.
       */
      if (
        type === GESTURE_SOURCE.SCROLLABLE &&
        isScrollableRefreshable.value &&
        animatedPosition.value === highestSnapPoint
      ) {
        return;
      }
      /**
       * a negative scrollable content offset to be subtracted from accumulated
       * current position and gesture translation Y to allow user to drag the sheet,
       * when scrollable position at the top.
       * a negative scrollable content offset when the scrollable is not locked.
       */
      const negativeScrollableContentOffset =
        (context.startPosition === highestSnapPoint &&
          type === GESTURE_SOURCE.SCROLLABLE) ||
        !context.isScrollablePositionLocked
          ? scrollableContentOffsetY.value * -1
          : 0;

      /**
       * an accumulated value of starting position with gesture translation y.
       */
      const draggedPosition = context.startPosition + translationY;

      /**
       * an accumulated value of dragged position and negative scrollable content offset,
       * this will insure locking sheet position when user is scrolling the scrollable until,
       * they reach to the top of the scrollable.
       */
      const accumulatedDraggedPosition =
        draggedPosition + negativeScrollableContentOffset;

      /**
       * a clamped value of the accumulated dragged position, to insure keeping the dragged
       * position between the highest and lowest snap points.
       */
      const clampedPosition = clamp(
        accumulatedDraggedPosition,
        highestSnapPoint,
        lowestSnapPoint
      );

      /**
       * if scrollable position is locked and the animated position
       * reaches the highest point, then we unlock the scrollable position.
       */
      if (
        context.isScrollablePositionLocked &&
        type === GESTURE_SOURCE.SCROLLABLE &&
        animatedPosition.value === highestSnapPoint
      ) {
        context.isScrollablePositionLocked = false;
      }

      /**
       * dismiss the keyboard when panning down, when:
       * - keyboard is shown.
       * - distance is more than threshold.
       * - scrollable content is on the top.
       * -
       */
      if (
        animatedKeyboardState.value === KEYBOARD_STATE.SHOWN &&
        translationY > KEYBOARD_DISMISS_THRESHOLD &&
        scrollableContentOffsetY.value === 0 &&
        Platform.OS === 'android'
      ) {
        runOnJS(Keyboard.dismiss)();
      }

      /**
       * over-drag implementation.
       */
      if (enableOverDrag) {
        if (
          type === GESTURE_SOURCE.HANDLE &&
          draggedPosition < highestSnapPoint
        ) {
          const resistedPosition =
            highestSnapPoint -
            Math.sqrt(1 + (highestSnapPoint - draggedPosition)) *
              overDragResistanceFactor;
          animatedPosition.value = resistedPosition;
          return;
        }

        if (
          type === GESTURE_SOURCE.HANDLE &&
          draggedPosition > lowestSnapPoint
        ) {
          const resistedPosition =
            lowestSnapPoint +
            Math.sqrt(1 + (draggedPosition - lowestSnapPoint)) *
              overDragResistanceFactor;
          animatedPosition.value = resistedPosition;
          return;
        }

        if (
          type === GESTURE_SOURCE.SCROLLABLE &&
          draggedPosition + negativeScrollableContentOffset > lowestSnapPoint
        ) {
          const resistedPosition =
            lowestSnapPoint +
            Math.sqrt(
              1 +
                (draggedPosition +
                  negativeScrollableContentOffset -
                  lowestSnapPoint)
            ) *
              overDragResistanceFactor;
          animatedPosition.value = resistedPosition;
          return;
        }
      }

      animatedPosition.value = clampedPosition;
    },
    onEnd: ({ state, absoluteY }, context) => {
      gestureState.value = state;
      let highestSnapPoint =
        animatedSnapPoints.value[animatedSnapPoints.value.length - 1];

      /**
       * if scrollable is refreshable and sheet position at the highest
       * point, then do not interact with current gesture.
       */
      if (
        type === GESTURE_SOURCE.SCROLLABLE &&
        isScrollableRefreshable.value &&
        animatedPosition.value === highestSnapPoint
      ) {
        return;
      }

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
        context.keyboardState === KEYBOARD_STATE.SHOWN &&
        animatedPosition.value > context.startPosition &&
        (Platform.OS === 'android' ||
          (Platform.OS === 'ios' &&
            absoluteY < WINDOW_HEIGHT - animatedKeyboardHeight.value))
      ) {
        runOnJS(Keyboard.dismiss)();
      }

      /**
       * reset isInTemporaryPosition value
       */
      if (isInTemporaryPosition.value) {
        isInTemporaryPosition.value = false;
      }

      /**
       * clone snap points array, and insert the container height
       * if pan down to close is enabled.
       */
      const snapPoints = animatedSnapPoints.value.slice();
      if (enablePanDownToClose) {
        snapPoints.unshift(animatedClosedPosition.value);
      }

      /**
       * calculate the destination point, using redash.
       */
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

      /**
       * if gesture was picked by scrollable and did not move the sheet,
       * then exit the method to prevent snapping.
       */
      if (
        (type === GESTURE_SOURCE.SCROLLABLE
          ? scrollableContentOffsetY.value
          : 0) > 0 &&
        context.startPosition === highestSnapPoint &&
        animatedPosition.value === highestSnapPoint
      ) {
        return;
      }

      /**
       * if gesture started by scrollable dragging the sheet than continue scrolling,
       * then exit the method to prevent snapping.
       */
      if (
        type === GESTURE_SOURCE.SCROLLABLE &&
        scrollableContentOffsetY.value > 0 &&
        animatedPosition.value === highestSnapPoint
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
