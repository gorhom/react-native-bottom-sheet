import { useCallback } from 'react';
import { Keyboard, Platform } from 'react-native';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import {
  ANIMATION_SOURCE,
  GESTURE_SOURCE,
  KEYBOARD_STATUS,
  SCROLLABLE_TYPE,
  WINDOW_HEIGHT,
} from '../constants';
import type {
  GestureEventHandlerCallbackType,
  GestureEventsHandlersHookType,
} from '../types';
import { clamp } from '../utilities/clamp';
import { snapPoint } from '../utilities/snapPoint';
import { useBottomSheetInternal } from './useBottomSheetInternal';

type GestureEventContextType = {
  initialPosition: number;
  initialKeyboardStatus: KEYBOARD_STATUS;
  isScrollablePositionLocked: boolean;
};

const INITIAL_CONTEXT: GestureEventContextType = {
  initialPosition: 0,
  initialKeyboardStatus: KEYBOARD_STATUS.UNDETERMINED,
  isScrollablePositionLocked: false,
};

const dismissKeyboard = Keyboard.dismiss;

// biome-ignore lint: to be addressed!
const resetContext = (context: any) => {
  'worklet';
  Object.keys(context).map(key => {
    context[key] = undefined;
  });
};

export const useGestureEventsHandlersDefault: GestureEventsHandlersHookType =
  () => {
    //#region variables
    const {
      animatedPosition,
      animatedDetentsState,
      animatedKeyboardState,
      animatedScrollableState,
      animatedLayoutState,
      enableOverDrag,
      enablePanDownToClose,
      overDragResistanceFactor,
      isInTemporaryPosition,
      enableBlurKeyboardOnGesture,
      animateToPosition,
      stopAnimation,
    } = useBottomSheetInternal();

    const context = useSharedValue<GestureEventContextType>({
      ...INITIAL_CONTEXT,
    });
    //#endregion

    //#region gesture methods
    const handleOnStart: GestureEventHandlerCallbackType = useCallback(
      function handleOnStart(__, _) {
        'worklet';
        // cancel current animation
        stopAnimation();

        let initialKeyboardStatus = animatedKeyboardState.get().status;
        // blur the keyboard when user start dragging the bottom sheet
        if (
          enableBlurKeyboardOnGesture &&
          initialKeyboardStatus === KEYBOARD_STATUS.SHOWN
        ) {
          initialKeyboardStatus = KEYBOARD_STATUS.HIDDEN;
          runOnJS(dismissKeyboard)();
        }

        // store current animated position
        context.value = {
          ...context.value,
          initialPosition: animatedPosition.value,
          initialKeyboardStatus,
        };

        /**
         * if the scrollable content is scrolled, then
         * we lock the position.
         */
        if (animatedScrollableState.get().contentOffsetY > 0) {
          context.value = {
            ...context.value,
            isScrollablePositionLocked: true,
          };
        }
      },
      [
        stopAnimation,
        context,
        enableBlurKeyboardOnGesture,
        animatedPosition,
        animatedKeyboardState,
        animatedScrollableState,
      ]
    );
    const handleOnChange: GestureEventHandlerCallbackType = useCallback(
      function handleOnChange(source, { translationY }) {
        'worklet';
        const { highestDetentPosition, detents } = animatedDetentsState.get();
        if (
          highestDetentPosition === undefined ||
          detents === undefined ||
          detents.length === 0
        ) {
          return;
        }

        let highestSnapPoint = highestDetentPosition;

        /**
         * if keyboard is shown, then we set the highest point to the current
         * position which includes the keyboard height.
         */
        if (
          isInTemporaryPosition.value &&
          context.value.initialKeyboardStatus === KEYBOARD_STATUS.SHOWN
        ) {
          highestSnapPoint = context.value.initialPosition;
        }

        /**
         * if current position is out of provided `snapPoints` and smaller then
         * highest snap pont, then we set the highest point to the current position.
         */
        if (
          isInTemporaryPosition.value &&
          context.value.initialPosition < highestSnapPoint
        ) {
          highestSnapPoint = context.value.initialPosition;
        }

        const { containerHeight } = animatedLayoutState.get();
        const lowestSnapPoint = enablePanDownToClose
          ? containerHeight
          : detents[0];

        /**
         * if scrollable is refreshable and sheet position at the highest
         * point, then do not interact with current gesture.
         */
        if (
          source === GESTURE_SOURCE.CONTENT &&
          animatedScrollableState.get().refreshable &&
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
          (context.value.initialPosition === highestSnapPoint &&
            source === GESTURE_SOURCE.CONTENT) ||
          !context.value.isScrollablePositionLocked
            ? animatedScrollableState.get().contentOffsetY * -1
            : 0;

        /**
         * an accumulated value of starting position with gesture translation y.
         */
        const draggedPosition = context.value.initialPosition + translationY;

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
          context.value.isScrollablePositionLocked &&
          source === GESTURE_SOURCE.CONTENT &&
          animatedPosition.value === highestSnapPoint
        ) {
          context.value = {
            ...context.value,
            isScrollablePositionLocked: false,
          };
        }

        /**
         * over-drag implementation.
         */
        if (enableOverDrag) {
          if (
            (source === GESTURE_SOURCE.HANDLE ||
              animatedScrollableState.get().type === SCROLLABLE_TYPE.VIEW) &&
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
            source === GESTURE_SOURCE.HANDLE &&
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
            source === GESTURE_SOURCE.CONTENT &&
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
        isInTemporaryPosition,
        animatedScrollableState,
        animatedDetentsState,
        animatedLayoutState,
        animatedPosition,
        context,
      ]
    );
    const handleOnEnd: GestureEventHandlerCallbackType = useCallback(
      function handleOnEnd(source, { translationY, absoluteY, velocityY }) {
        'worklet';
        const { highestDetentPosition, detents, closedDetentPosition } =
          animatedDetentsState.get();
        if (
          highestDetentPosition === undefined ||
          detents === undefined ||
          detents.length === 0 ||
          closedDetentPosition === undefined
        ) {
          return;
        }

        const highestSnapPoint = highestDetentPosition;
        const isSheetAtHighestSnapPoint =
          animatedPosition.value === highestSnapPoint;
        const {
          refreshable: scrollableIsRefreshable,
          contentOffsetY: scrollableContentOffsetY,
          type: scrollableType,
        } = animatedScrollableState.get();

        /**
         * if scrollable is refreshable and sheet position at the highest
         * point, then do not interact with current gesture.
         */
        if (
          source === GESTURE_SOURCE.CONTENT &&
          scrollableIsRefreshable &&
          isSheetAtHighestSnapPoint
        ) {
          return;
        }

        /**
         * if the sheet is in a temporary position and the gesture ended above
         * the current position, then we snap back to the temporary position.
         */
        if (
          isInTemporaryPosition.value &&
          context.value.initialPosition >= animatedPosition.value
        ) {
          if (context.value.initialPosition > animatedPosition.value) {
            animateToPosition(
              context.value.initialPosition,
              ANIMATION_SOURCE.GESTURE,
              velocityY / 2
            );
          }
          return;
        }

        /**
         * close keyboard if current position is below the recorded
         * start position and keyboard still shown.
         */
        const isScrollable =
          scrollableType !== SCROLLABLE_TYPE.UNDETERMINED &&
          scrollableType !== SCROLLABLE_TYPE.VIEW;

        /**
         * if keyboard is shown and the sheet is dragged down,
         * then we dismiss the keyboard.
         */
        if (
          context.value.initialKeyboardStatus === KEYBOARD_STATUS.SHOWN &&
          animatedPosition.value > context.value.initialPosition
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
              absoluteY >
                WINDOW_HEIGHT -
                  animatedKeyboardState.get().heightWithinContainer
            )
          ) {
            runOnJS(dismissKeyboard)();
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
        const snapPoints = detents.slice();
        if (enablePanDownToClose) {
          snapPoints.unshift(closedDetentPosition);
        }

        /**
         * calculate the destination point, using redash.
         */
        const destinationPoint = snapPoint(
          translationY + context.value.initialPosition,
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

        const wasGestureHandledByScrollView =
          source === GESTURE_SOURCE.CONTENT && scrollableContentOffsetY > 0;
        /**
         * prevents snapping from top to middle / bottom with repeated interrupted scrolls
         */
        if (wasGestureHandledByScrollView && isSheetAtHighestSnapPoint) {
          return;
        }

        animateToPosition(
          destinationPoint,
          ANIMATION_SOURCE.GESTURE,
          velocityY / 2
        );
      },
      [
        enablePanDownToClose,
        isInTemporaryPosition,
        animatedScrollableState,
        animatedDetentsState,
        animatedKeyboardState,
        animatedPosition,
        animateToPosition,
        context,
      ]
    );
    const handleOnFinalize: GestureEventHandlerCallbackType = useCallback(
      function handleOnFinalize() {
        'worklet';
        resetContext(context);
      },
      [context]
    );
    //#endregion

    return {
      handleOnStart,
      handleOnChange,
      handleOnEnd,
      handleOnFinalize,
    };
  };
