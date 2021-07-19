import Animated, { runOnJS, useWorkletCallback } from 'react-native-reanimated';
import {
  GestureEventContextType,
  GestureEventType,
} from '../../hooks/useInteractivePanGestureHandler';
import {
  ANIMATION_SOURCE,
  GESTURE_SOURCE,
  KEYBOARD_STATE,
  SCROLLABLE_TYPE,
  WINDOW_HEIGHT,
} from '../../constants';
import { clamp, snapPoint } from 'react-native-redash';
import { print } from '../../utilities';
import { Keyboard, Platform } from 'react-native';

type SharedValue<T> = Animated.SharedValue<T>;

export type AnimateToPositionType = (
  position: number,
  source: ANIMATION_SOURCE,
  velocity?: number,
  configs?: Animated.WithTimingConfig | Animated.WithSpringConfig
) => void;

export type UseInteractivePanGestureHandlerListenersParams = {
  animatedPosition: SharedValue<number>;
  animatedKeyboardState: SharedValue<KEYBOARD_STATE>;
  scrollableContentOffsetY: SharedValue<number>;
  animatedSnapPoints: SharedValue<Array<number>>;
  isInTemporaryPosition: SharedValue<boolean>;
  enablePanDownToClose: boolean;
  animatedContainerHeight: SharedValue<number>;
  isScrollableRefreshable: SharedValue<boolean>;
  enableOverDrag: boolean;
  animatedScrollableType: SharedValue<SCROLLABLE_TYPE>;
  overDragResistanceFactor: number;
  animatedHighestSnapPoint: SharedValue<number>;
  animatedKeyboardHeight: SharedValue<number>;
  animatedClosedPosition: SharedValue<number>;
  animateToPosition: AnimateToPositionType;
  stopAnimation: () => void;
};

type Listener = (
  gestureSource: GESTURE_SOURCE,
  gestureEventType: GestureEventType,
  context: GestureEventContextType
) => void;

export type PanGestureHandlerListeners = {
  handleGestureStart: Listener;
  handleGestureActive: Listener;
  handleGestureEnd: Listener;
};

export const useInteractivePanGestureHandlerListeners = ({
  animatedPosition,
  animatedKeyboardState,
  scrollableContentOffsetY,
  animatedSnapPoints,
  isInTemporaryPosition,
  enablePanDownToClose,
  animatedContainerHeight,
  isScrollableRefreshable,
  enableOverDrag,
  animatedScrollableType,
  overDragResistanceFactor,
  animatedHighestSnapPoint,
  animatedKeyboardHeight,
  animatedClosedPosition,
  animateToPosition,
  stopAnimation,
}: UseInteractivePanGestureHandlerListenersParams): PanGestureHandlerListeners => {
  //#region gesture methods
  const handleGestureStart = useWorkletCallback(
    function handleGestureStart(__, _, context: GestureEventContextType) {
      // cancel current animation
      stopAnimation();

      // store current animated position
      context.initialPosition = animatedPosition.value;
      context.initialKeyboardState = animatedKeyboardState.value;

      /**
       * if the scrollable content is scrolled, then
       * we lock the position.
       */
      if (scrollableContentOffsetY.value > 0) {
        context.isScrollablePositionLocked = true;
      }
    },
    [animatedPosition, animatedKeyboardState, scrollableContentOffsetY]
  );
  const handleGestureActive = useWorkletCallback(
    function handleGestureActive(
      type: GESTURE_SOURCE,
      { translationY }: GestureEventType,
      context: GestureEventContextType
    ) {
      let highestSnapPoint =
        animatedSnapPoints.value[animatedSnapPoints.value.length - 1];
      /**
       * if keyboard is shown, then we set the highest point to the current
       * position which includes the keyboard height.
       */
      if (
        isInTemporaryPosition.value &&
        context.initialKeyboardState === KEYBOARD_STATE.SHOWN
      ) {
        highestSnapPoint = context.initialPosition;
      }

      /**
       * if current position is out of provided `snapPoints` and smaller then
       * highest snap pont, then we set the highest point to the current position.
       */
      if (
        isInTemporaryPosition.value &&
        context.initialPosition < highestSnapPoint
      ) {
        highestSnapPoint = context.initialPosition;
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
        (context.initialPosition === highestSnapPoint &&
          type === GESTURE_SOURCE.SCROLLABLE) ||
        !context.isScrollablePositionLocked
          ? scrollableContentOffsetY.value * -1
          : 0;

      /**
       * an accumulated value of starting position with gesture translation y.
       */
      const draggedPosition = context.initialPosition + translationY;

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
       * over-drag implementation.
       */
      if (enableOverDrag) {
        if (
          (type === GESTURE_SOURCE.HANDLE ||
            animatedScrollableType.value === SCROLLABLE_TYPE.VIEW) &&
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
    [
      enableOverDrag,
      enablePanDownToClose,
      overDragResistanceFactor,
      animatedContainerHeight,
      animatedKeyboardState,
      animatedPosition,
      animatedSnapPoints,
      isInTemporaryPosition,
      isScrollableRefreshable,
      scrollableContentOffsetY,
    ]
  );
  const handleGestureEnd = useWorkletCallback(
    function handleGestureEnd(
      type: GESTURE_SOURCE,
      { translationY, absoluteY, velocityY }: GestureEventType,
      context: GestureEventContextType
    ) {
      runOnJS(print)({
        component: 'BottomSheet',
        method: handleGestureEnd.name,
      });

      const highestSnapPoint = animatedHighestSnapPoint.value;

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
        context.initialPosition >= animatedPosition.value
      ) {
        if (context.initialPosition > animatedPosition.value) {
          animateToPosition(
            context.initialPosition,
            velocityY / 2,
            ANIMATION_SOURCE.GESTURE
          );
        }
        return;
      }

      /**
       * close keyboard if current position is below the recorded
       * start position and keyboard still shown.
       */
      const isScrollable =
        animatedScrollableType.value !== SCROLLABLE_TYPE.UNDETERMINED &&
        animatedScrollableType.value !== SCROLLABLE_TYPE.VIEW;

      /**
       * if keyboard is shown and the sheet is dragged down,
       * then we dismiss the keyboard.
       */
      if (
        context.initialKeyboardState === KEYBOARD_STATE.SHOWN &&
        animatedPosition.value > context.initialPosition
      ) {
        /**
         * if the platform is ios, current content is scrollable and
         * the end touch point is below the keyboard position then
         * we exit the method.
         *
         * because the the keyboard dismiss is interactive in iOS.
         */
        if (
          !(
            Platform.OS === 'ios' &&
            isScrollable &&
            absoluteY > WINDOW_HEIGHT - animatedKeyboardHeight.value
          )
        ) {
          runOnJS(Keyboard.dismiss)();
        }
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
        translationY + context.initialPosition,
        velocityY,
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
        context.initialPosition === highestSnapPoint &&
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

      animateToPosition(
        destinationPoint,
        velocityY / 2,
        ANIMATION_SOURCE.GESTURE
      );
    },
    [
      enablePanDownToClose,
      animateToPosition,
      animatedClosedPosition,
      animatedHighestSnapPoint,
      animatedKeyboardHeight,
      animatedPosition,
      animatedScrollableType,
      animatedSnapPoints,
      scrollableContentOffsetY,
      isInTemporaryPosition,
      isScrollableRefreshable,
    ]
  );

  return {
    handleGestureStart,
    handleGestureActive,
    handleGestureEnd,
  };
};
