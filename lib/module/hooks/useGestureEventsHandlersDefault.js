import { Keyboard, Platform } from 'react-native';
import { runOnJS, useWorkletCallback } from 'react-native-reanimated';
import { useBottomSheetInternal } from './useBottomSheetInternal';
import { ANIMATION_SOURCE, GESTURE_SOURCE, KEYBOARD_STATE, SCROLLABLE_TYPE, WINDOW_HEIGHT } from '../constants';
import { clamp } from '../utilities/clamp';
import { snapPoint } from '../utilities/snapPoint';
const dismissKeyboard = Keyboard.dismiss;
export const useGestureEventsHandlersDefault = () => {
  //#region variables
  const {
    animatedPosition,
    animatedSnapPoints,
    animatedKeyboardState,
    animatedKeyboardHeight,
    animatedContainerHeight,
    animatedScrollableType,
    animatedHighestSnapPoint,
    animatedClosedPosition,
    animatedScrollableContentOffsetY,
    enableOverDrag,
    enablePanDownToClose,
    overDragResistanceFactor,
    isInTemporaryPosition,
    isScrollableRefreshable,
    animateToPosition,
    stopAnimation
  } = useBottomSheetInternal(); //#endregion
  //#region gesture methods

  const handleOnStart = useWorkletCallback(function handleOnStart(__, _, context) {
    // cancel current animation
    stopAnimation(); // store current animated position

    context.initialPosition = animatedPosition.value;
    context.initialKeyboardState = animatedKeyboardState.value;
    /**
     * if the scrollable content is scrolled, then
     * we lock the position.
     */

    if (animatedScrollableContentOffsetY.value > 0) {
      context.isScrollablePositionLocked = true;
    }
  }, [stopAnimation, animatedPosition, animatedKeyboardState, animatedScrollableContentOffsetY]);
  const handleOnActive = useWorkletCallback(function handleOnActive(source, {
    translationY
  }, context) {
    let highestSnapPoint = animatedHighestSnapPoint.value;
    /**
     * if keyboard is shown, then we set the highest point to the current
     * position which includes the keyboard height.
     */

    if (isInTemporaryPosition.value && context.initialKeyboardState === KEYBOARD_STATE.SHOWN) {
      highestSnapPoint = context.initialPosition;
    }
    /**
     * if current position is out of provided `snapPoints` and smaller then
     * highest snap pont, then we set the highest point to the current position.
     */


    if (isInTemporaryPosition.value && context.initialPosition < highestSnapPoint) {
      highestSnapPoint = context.initialPosition;
    }

    const lowestSnapPoint = enablePanDownToClose ? animatedContainerHeight.value : animatedSnapPoints.value[0];
    /**
     * if scrollable is refreshable and sheet position at the highest
     * point, then do not interact with current gesture.
     */

    if (source === GESTURE_SOURCE.SCROLLABLE && isScrollableRefreshable.value && animatedPosition.value === highestSnapPoint) {
      return;
    }
    /**
     * a negative scrollable content offset to be subtracted from accumulated
     * current position and gesture translation Y to allow user to drag the sheet,
     * when scrollable position at the top.
     * a negative scrollable content offset when the scrollable is not locked.
     */


    const negativeScrollableContentOffset = context.initialPosition === highestSnapPoint && source === GESTURE_SOURCE.SCROLLABLE || !context.isScrollablePositionLocked ? animatedScrollableContentOffsetY.value * -1 : 0;
    /**
     * an accumulated value of starting position with gesture translation y.
     */

    const draggedPosition = context.initialPosition + translationY;
    /**
     * an accumulated value of dragged position and negative scrollable content offset,
     * this will insure locking sheet position when user is scrolling the scrollable until,
     * they reach to the top of the scrollable.
     */

    const accumulatedDraggedPosition = draggedPosition + negativeScrollableContentOffset;
    /**
     * a clamped value of the accumulated dragged position, to insure keeping the dragged
     * position between the highest and lowest snap points.
     */

    const clampedPosition = clamp(accumulatedDraggedPosition, highestSnapPoint, lowestSnapPoint);
    /**
     * if scrollable position is locked and the animated position
     * reaches the highest point, then we unlock the scrollable position.
     */

    if (context.isScrollablePositionLocked && source === GESTURE_SOURCE.SCROLLABLE && animatedPosition.value === highestSnapPoint) {
      context.isScrollablePositionLocked = false;
    }
    /**
     * over-drag implementation.
     */


    if (enableOverDrag) {
      if ((source === GESTURE_SOURCE.HANDLE || animatedScrollableType.value === SCROLLABLE_TYPE.VIEW) && draggedPosition < highestSnapPoint) {
        const resistedPosition = highestSnapPoint - Math.sqrt(1 + (highestSnapPoint - draggedPosition)) * overDragResistanceFactor;
        animatedPosition.value = resistedPosition;
        return;
      }

      if (source === GESTURE_SOURCE.HANDLE && draggedPosition > lowestSnapPoint) {
        const resistedPosition = lowestSnapPoint + Math.sqrt(1 + (draggedPosition - lowestSnapPoint)) * overDragResistanceFactor;
        animatedPosition.value = resistedPosition;
        return;
      }

      if (source === GESTURE_SOURCE.SCROLLABLE && draggedPosition + negativeScrollableContentOffset > lowestSnapPoint) {
        const resistedPosition = lowestSnapPoint + Math.sqrt(1 + (draggedPosition + negativeScrollableContentOffset - lowestSnapPoint)) * overDragResistanceFactor;
        animatedPosition.value = resistedPosition;
        return;
      }
    }

    animatedPosition.value = clampedPosition;
  }, [enableOverDrag, enablePanDownToClose, overDragResistanceFactor, isInTemporaryPosition, isScrollableRefreshable, animatedHighestSnapPoint, animatedContainerHeight, animatedSnapPoints, animatedPosition, animatedScrollableType, animatedScrollableContentOffsetY]);
  const handleOnEnd = useWorkletCallback(function handleOnEnd(source, {
    translationY,
    absoluteY,
    velocityY
  }, context) {
    const highestSnapPoint = animatedHighestSnapPoint.value;
    const isSheetAtHighestSnapPoint = animatedPosition.value === highestSnapPoint;
    /**
     * if scrollable is refreshable and sheet position at the highest
     * point, then do not interact with current gesture.
     */

    if (source === GESTURE_SOURCE.SCROLLABLE && isScrollableRefreshable.value && isSheetAtHighestSnapPoint) {
      return;
    }
    /**
     * if the sheet is in a temporary position and the gesture ended above
     * the current position, then we snap back to the temporary position.
     */


    if (isInTemporaryPosition.value && context.initialPosition >= animatedPosition.value) {
      if (context.initialPosition > animatedPosition.value) {
        animateToPosition(context.initialPosition, ANIMATION_SOURCE.GESTURE, velocityY / 2);
      }

      return;
    }
    /**
     * close keyboard if current position is below the recorded
     * start position and keyboard still shown.
     */


    const isScrollable = animatedScrollableType.value !== SCROLLABLE_TYPE.UNDETERMINED && animatedScrollableType.value !== SCROLLABLE_TYPE.VIEW;
    /**
     * if keyboard is shown and the sheet is dragged down,
     * then we dismiss the keyboard.
     */

    if (context.initialKeyboardState === KEYBOARD_STATE.SHOWN && animatedPosition.value > context.initialPosition) {
      /**
       * if the platform is ios, current content is scrollable and
       * the end touch point is below the keyboard position then
       * we exit the method.
       *
       * because the the keyboard dismiss is interactive in iOS.
       */
      if (!(Platform.OS === 'ios' && isScrollable && absoluteY > WINDOW_HEIGHT - animatedKeyboardHeight.value)) {
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


    const snapPoints = animatedSnapPoints.value.slice();

    if (enablePanDownToClose) {
      snapPoints.unshift(animatedClosedPosition.value);
    }
    /**
     * calculate the destination point, using redash.
     */


    const destinationPoint = snapPoint(translationY + context.initialPosition, velocityY, snapPoints);
    /**
     * if destination point is the same as the current position,
     * then no need to perform animation.
     */

    if (destinationPoint === animatedPosition.value) {
      return;
    }

    const wasGestureHandledByScrollView = source === GESTURE_SOURCE.SCROLLABLE && animatedScrollableContentOffsetY.value > 0;
    /**
     * prevents snapping from top to middle / bottom with repeated interrupted scrolls
     */

    if (wasGestureHandledByScrollView && isSheetAtHighestSnapPoint) {
      return;
    }

    animateToPosition(destinationPoint, ANIMATION_SOURCE.GESTURE, velocityY / 2);
  }, [enablePanDownToClose, isInTemporaryPosition, isScrollableRefreshable, animatedClosedPosition, animatedHighestSnapPoint, animatedKeyboardHeight, animatedPosition, animatedScrollableType, animatedSnapPoints, animatedScrollableContentOffsetY, animateToPosition]); //#endregion

  return {
    handleOnStart,
    handleOnActive,
    handleOnEnd
  };
};
//# sourceMappingURL=useGestureEventsHandlersDefault.js.map