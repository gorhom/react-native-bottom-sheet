import React, { useMemo, useCallback, forwardRef, useImperativeHandle, memo, useEffect } from 'react';
import { Platform } from 'react-native';
import invariant from 'invariant';
import Animated, { useAnimatedReaction, useSharedValue, useAnimatedStyle, useDerivedValue, runOnJS, interpolate, Extrapolate, runOnUI, cancelAnimation, useWorkletCallback } from 'react-native-reanimated';
import { State } from 'react-native-gesture-handler';
import { useScrollable, usePropsValidator, useReactiveSharedValue, useAnimatedSnapPoints, useKeyboard } from '../../hooks';
import { BottomSheetInternalProvider, BottomSheetProvider } from '../../contexts';
import BottomSheetContainer from '../bottomSheetContainer';
import BottomSheetGestureHandlersProvider from '../bottomSheetGestureHandlersProvider';
import BottomSheetBackdropContainer from '../bottomSheetBackdropContainer';
import BottomSheetHandleContainer from '../bottomSheetHandleContainer';
import BottomSheetBackgroundContainer from '../bottomSheetBackgroundContainer';
import BottomSheetFooterContainer from '../bottomSheetFooterContainer/BottomSheetFooterContainer';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
// import BottomSheetDebugView from '../bottomSheetDebugView';
import { ANIMATION_STATE, KEYBOARD_STATE, KEYBOARD_BEHAVIOR, SHEET_STATE, SCROLLABLE_STATE, KEYBOARD_BLUR_BEHAVIOR, KEYBOARD_INPUT_MODE, ANIMATION_SOURCE, SNAP_POINT_TYPE } from '../../constants';
import { animate, getKeyboardAnimationConfigs, normalizeSnapPoint, print } from '../../utilities';
import { DEFAULT_OVER_DRAG_RESISTANCE_FACTOR, DEFAULT_ENABLE_CONTENT_PANNING_GESTURE, DEFAULT_ENABLE_HANDLE_PANNING_GESTURE, DEFAULT_ENABLE_OVER_DRAG, DEFAULT_ANIMATE_ON_MOUNT, DEFAULT_KEYBOARD_BEHAVIOR, DEFAULT_KEYBOARD_BLUR_BEHAVIOR, DEFAULT_KEYBOARD_INPUT_MODE, INITIAL_CONTAINER_HEIGHT, INITIAL_HANDLE_HEIGHT, INITIAL_POSITION, INITIAL_SNAP_POINT, DEFAULT_ENABLE_PAN_DOWN_TO_CLOSE, INITIAL_CONTAINER_OFFSET, INITIAL_VALUE, DEFAULT_DYNAMIC_SIZING, DEFAULT_ACCESSIBLE, DEFAULT_ACCESSIBILITY_LABEL, DEFAULT_ACCESSIBILITY_ROLE } from './constants';
import { styles } from './styles';
Animated.addWhitelistedUIProps({
  decelerationRate: true
});
const BottomSheetComponent = /*#__PURE__*/forwardRef(function BottomSheet(props, ref) {
  //#region extract props
  const {
    // animations configurations
    animationConfigs: _providedAnimationConfigs,
    // configurations
    index: _providedIndex = 0,
    snapPoints: _providedSnapPoints,
    animateOnMount = DEFAULT_ANIMATE_ON_MOUNT,
    enableContentPanningGesture = DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
    enableHandlePanningGesture = DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
    enableOverDrag = DEFAULT_ENABLE_OVER_DRAG,
    enablePanDownToClose = DEFAULT_ENABLE_PAN_DOWN_TO_CLOSE,
    enableDynamicSizing = DEFAULT_DYNAMIC_SIZING,
    overDragResistanceFactor = DEFAULT_OVER_DRAG_RESISTANCE_FACTOR,
    // styles
    style: _providedStyle,
    containerStyle: _providedContainerStyle,
    backgroundStyle: _providedBackgroundStyle,
    handleStyle: _providedHandleStyle,
    handleIndicatorStyle: _providedHandleIndicatorStyle,
    // hooks
    gestureEventsHandlersHook,
    // keyboard
    keyboardBehavior = DEFAULT_KEYBOARD_BEHAVIOR,
    keyboardBlurBehavior = DEFAULT_KEYBOARD_BLUR_BEHAVIOR,
    android_keyboardInputMode = DEFAULT_KEYBOARD_INPUT_MODE,
    // layout
    containerHeight: _providedContainerHeight,
    containerOffset: _providedContainerOffset,
    topInset = 0,
    bottomInset = 0,
    maxDynamicContentSize,
    // animated callback shared values
    animatedPosition: _providedAnimatedPosition,
    animatedIndex: _providedAnimatedIndex,
    // gestures
    simultaneousHandlers: _providedSimultaneousHandlers,
    waitFor: _providedWaitFor,
    activeOffsetX: _providedActiveOffsetX,
    activeOffsetY: _providedActiveOffsetY,
    failOffsetX: _providedFailOffsetX,
    failOffsetY: _providedFailOffsetY,
    // callbacks
    onChange: _providedOnChange,
    onClose: _providedOnClose,
    onAnimate: _providedOnAnimate,
    // private
    $modal = false,
    detached = false,
    // components
    handleComponent,
    backdropComponent,
    backgroundComponent,
    footerComponent,
    children,
    // accessibility
    accessible: _providedAccessible = DEFAULT_ACCESSIBLE,
    accessibilityLabel: _providedAccessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
    accessibilityRole: _providedAccessibilityRole = DEFAULT_ACCESSIBILITY_ROLE
  } = props;
  //#endregion

  //#region validate props
  if (__DEV__) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePropsValidator({
      index: _providedIndex,
      snapPoints: _providedSnapPoints,
      enableDynamicSizing,
      topInset,
      bottomInset
    });
  }
  //#endregion

  //#region layout variables
  /**
   * This variable is consider an internal variable,
   * that will be used conditionally in `animatedContainerHeight`
   */
  const _animatedContainerHeight = useReactiveSharedValue(_providedContainerHeight ?? INITIAL_CONTAINER_HEIGHT);
  /**
   * This is a conditional variable, where if the `BottomSheet` is used
   * in a modal, then it will subset vertical insets (top+bottom) from
   * provided container height.
   */
  const animatedContainerHeight = useDerivedValue(() => {
    const verticalInset = topInset + bottomInset;
    return $modal ? _animatedContainerHeight.value - verticalInset : _animatedContainerHeight.value;
  }, [topInset, bottomInset, $modal, _animatedContainerHeight.value]);
  const animatedContainerOffset = useReactiveSharedValue(_providedContainerOffset ?? INITIAL_CONTAINER_OFFSET);
  const animatedHandleHeight = useReactiveSharedValue(INITIAL_HANDLE_HEIGHT);
  const animatedFooterHeight = useSharedValue(0);
  const animatedContentHeight = useSharedValue(INITIAL_CONTAINER_HEIGHT);
  const [animatedSnapPoints, animatedDynamicSnapPointIndex] = useAnimatedSnapPoints(_providedSnapPoints, animatedContainerHeight, animatedContentHeight, animatedHandleHeight, enableDynamicSizing, maxDynamicContentSize);
  const animatedHighestSnapPoint = useDerivedValue(() => animatedSnapPoints.value[animatedSnapPoints.value.length - 1], [animatedSnapPoints.value]);
  const animatedClosedPosition = useDerivedValue(() => {
    let closedPosition = animatedContainerHeight.value;
    if ($modal || detached) {
      closedPosition = animatedContainerHeight.value + bottomInset;
    }
    return closedPosition;
  }, [animatedContainerHeight.value, $modal, detached, bottomInset]);
  const animatedSheetHeight = useDerivedValue(() => animatedContainerHeight.value - animatedHighestSnapPoint.value, [animatedContainerHeight.value, animatedHighestSnapPoint.value]);
  const animatedCurrentIndex = useReactiveSharedValue(animateOnMount ? -1 : _providedIndex);
  const animatedPosition = useSharedValue(INITIAL_POSITION);
  const animatedNextPosition = useSharedValue(INITIAL_VALUE);
  const animatedNextPositionIndex = useSharedValue(0);

  // conditional
  const isAnimatedOnMount = useSharedValue(false);
  const isContentHeightFixed = useSharedValue(false);
  const isLayoutCalculated = useDerivedValue(() => {
    let isContainerHeightCalculated = false;
    //container height was provided.
    if (_providedContainerHeight !== null || _providedContainerHeight !== undefined) {
      isContainerHeightCalculated = true;
    }
    // container height did set.
    if (animatedContainerHeight.value !== INITIAL_CONTAINER_HEIGHT) {
      isContainerHeightCalculated = true;
    }
    let isHandleHeightCalculated = false;
    // handle component is null.
    if (handleComponent === null) {
      animatedHandleHeight.value = 0;
      isHandleHeightCalculated = true;
    }
    // handle height did set.
    if (animatedHandleHeight.value !== INITIAL_HANDLE_HEIGHT) {
      isHandleHeightCalculated = true;
    }
    let isSnapPointsNormalized = false;
    // the first snap point did normalized
    if (animatedSnapPoints.value[0] !== INITIAL_SNAP_POINT) {
      isSnapPointsNormalized = true;
    }
    return isContainerHeightCalculated && isHandleHeightCalculated && isSnapPointsNormalized;
  }, [_providedContainerHeight, animatedContainerHeight.value, animatedHandleHeight, animatedSnapPoints.value, handleComponent]);
  const isInTemporaryPosition = useSharedValue(false);
  const isForcedClosing = useSharedValue(false);
  const animatedContainerHeightDidChange = useSharedValue(false);

  // gesture
  const animatedContentGestureState = useSharedValue(State.UNDETERMINED);
  const animatedHandleGestureState = useSharedValue(State.UNDETERMINED);
  //#endregion

  //#region hooks variables
  // scrollable variables
  const {
    animatedScrollableType,
    animatedScrollableContentOffsetY,
    animatedScrollableOverrideState,
    isScrollableRefreshable,
    setScrollableRef,
    removeScrollableRef
  } = useScrollable();
  // keyboard
  const {
    state: animatedKeyboardState,
    height: animatedKeyboardHeight,
    animationDuration: keyboardAnimationDuration,
    animationEasing: keyboardAnimationEasing,
    shouldHandleKeyboardEvents
  } = useKeyboard();
  const animatedKeyboardHeightInContainer = useSharedValue(0);
  //#endregion

  //#region state/dynamic variables
  // states
  const animatedAnimationState = useSharedValue(ANIMATION_STATE.UNDETERMINED);
  const animatedAnimationSource = useSharedValue(ANIMATION_SOURCE.MOUNT);
  const animatedSheetState = useDerivedValue(() => {
    // closed position = position >= container height
    if (animatedPosition.value >= animatedClosedPosition.value) return SHEET_STATE.CLOSED;

    // extended position = container height - sheet height
    const extendedPosition = animatedContainerHeight.value - animatedSheetHeight.value;
    if (animatedPosition.value === extendedPosition) return SHEET_STATE.EXTENDED;

    // extended position with keyboard =
    // container height - (sheet height + keyboard height in root container)
    const keyboardHeightInContainer = animatedKeyboardHeightInContainer.value;
    const extendedPositionWithKeyboard = Math.max(0, animatedContainerHeight.value - (animatedSheetHeight.value + keyboardHeightInContainer));

    // detect if keyboard is open and the sheet is in temporary position
    if (keyboardBehavior === KEYBOARD_BEHAVIOR.interactive && isInTemporaryPosition.value && animatedPosition.value === extendedPositionWithKeyboard) {
      return SHEET_STATE.EXTENDED;
    }

    // fill parent = 0
    if (animatedPosition.value === 0) {
      return SHEET_STATE.FILL_PARENT;
    }

    // detect if position is below extended point
    if (animatedPosition.value < extendedPosition) {
      return SHEET_STATE.OVER_EXTENDED;
    }
    return SHEET_STATE.OPENED;
  }, [animatedClosedPosition, animatedContainerHeight, animatedKeyboardHeightInContainer, animatedPosition, animatedSheetHeight, isInTemporaryPosition, keyboardBehavior]);
  const animatedScrollableState = useDerivedValue(() => {
    /**
     * if scrollable override state is set, then we just return its value.
     */
    if (animatedScrollableOverrideState.value !== SCROLLABLE_STATE.UNDETERMINED) {
      return animatedScrollableOverrideState.value;
    }
    /**
     * if sheet state is fill parent, then unlock scrolling
     */
    if (animatedSheetState.value === SHEET_STATE.FILL_PARENT) {
      return SCROLLABLE_STATE.UNLOCKED;
    }

    /**
     * if sheet state is extended, then unlock scrolling
     */
    if (animatedSheetState.value === SHEET_STATE.EXTENDED) {
      return SCROLLABLE_STATE.UNLOCKED;
    }

    /**
     * if keyboard is shown and sheet is animating
     * then we do not lock the scrolling to not lose
     * current scrollable scroll position.
     */
    if (animatedKeyboardState.value === KEYBOARD_STATE.SHOWN && animatedAnimationState.value === ANIMATION_STATE.RUNNING) {
      return SCROLLABLE_STATE.UNLOCKED;
    }
    return SCROLLABLE_STATE.LOCKED;
  }, [animatedAnimationState.value, animatedKeyboardState.value, animatedScrollableOverrideState.value, animatedSheetState.value]);
  // dynamic
  const animatedContentHeightMax = useDerivedValue(() => {
    const keyboardHeightInContainer = animatedKeyboardHeightInContainer.value;
    const handleHeight = Math.max(0, animatedHandleHeight.value);
    let contentHeight = animatedSheetHeight.value - handleHeight;
    if (keyboardBehavior === KEYBOARD_BEHAVIOR.extend && animatedKeyboardState.value === KEYBOARD_STATE.SHOWN) {
      contentHeight = contentHeight - keyboardHeightInContainer;
    } else if (keyboardBehavior === KEYBOARD_BEHAVIOR.fillParent && isInTemporaryPosition.value) {
      if (animatedKeyboardState.value === KEYBOARD_STATE.SHOWN) {
        contentHeight = animatedContainerHeight.value - handleHeight - keyboardHeightInContainer;
      } else {
        contentHeight = animatedContainerHeight.value - handleHeight;
      }
    } else if (keyboardBehavior === KEYBOARD_BEHAVIOR.interactive && isInTemporaryPosition.value) {
      const contentWithKeyboardHeight = contentHeight + keyboardHeightInContainer;
      if (animatedKeyboardState.value === KEYBOARD_STATE.SHOWN) {
        if (keyboardHeightInContainer + animatedSheetHeight.value > animatedContainerHeight.value) {
          contentHeight = animatedContainerHeight.value - keyboardHeightInContainer - handleHeight;
        }
      } else if (contentWithKeyboardHeight + handleHeight > animatedContainerHeight.value) {
        contentHeight = animatedContainerHeight.value - handleHeight;
      } else {
        contentHeight = contentWithKeyboardHeight;
      }
    }

    /**
     * before the container is measured, `contentHeight` value will be below zero,
     * which will lead to freeze the scrollable.
     *
     * @link (https://github.com/gorhom/react-native-bottom-sheet/issues/470)
     */
    return Math.max(contentHeight, 0);
  }, [animatedContainerHeight, animatedHandleHeight, animatedKeyboardHeightInContainer, animatedKeyboardState, animatedSheetHeight, isInTemporaryPosition, keyboardBehavior]);
  const animatedIndex = useDerivedValue(() => {
    const adjustedSnapPoints = animatedSnapPoints.value.slice().reverse();
    const adjustedSnapPointsIndexes = animatedSnapPoints.value.slice().map((_, index) => index).reverse();

    /**
     * we add the close state index `-1`
     */
    adjustedSnapPoints.push(animatedContainerHeight.value);
    adjustedSnapPointsIndexes.push(-1);
    const currentIndex = isLayoutCalculated.value ? interpolate(animatedPosition.value, adjustedSnapPoints, adjustedSnapPointsIndexes, Extrapolate.CLAMP) : -1;

    /**
     * if the sheet is currently running an animation by the keyboard opening,
     * then we clamp the index on android with resize keyboard mode.
     */
    if (android_keyboardInputMode === KEYBOARD_INPUT_MODE.adjustResize && animatedAnimationSource.value === ANIMATION_SOURCE.KEYBOARD && animatedAnimationState.value === ANIMATION_STATE.RUNNING && isInTemporaryPosition.value) {
      return Math.max(animatedCurrentIndex.value, currentIndex);
    }

    /**
     * if the sheet is currently running an animation by snap point change - usually caused
     * by dynamic content height -, then we return the next position index.
     */
    if (animatedAnimationSource.value === ANIMATION_SOURCE.SNAP_POINT_CHANGE && animatedAnimationState.value === ANIMATION_STATE.RUNNING) {
      return animatedNextPositionIndex.value;
    }
    return currentIndex;
  }, [android_keyboardInputMode, animatedAnimationSource.value, animatedAnimationState.value, animatedContainerHeight.value, animatedCurrentIndex.value, animatedNextPositionIndex.value, animatedPosition.value, animatedSnapPoints.value, isInTemporaryPosition.value, isLayoutCalculated.value]);
  //#endregion

  //#region private methods
  const handleOnChange = useCallback(function handleOnChange(index, position) {
    print({
      component: BottomSheet.name,
      method: handleOnChange.name,
      category: 'callback',
      params: {
        index,
        animatedCurrentIndex: animatedCurrentIndex.value
      }
    });
    if (!_providedOnChange) {
      return;
    }
    _providedOnChange(index, position, index === animatedDynamicSnapPointIndex.value ? SNAP_POINT_TYPE.DYNAMIC : SNAP_POINT_TYPE.PROVIDED);
  }, [_providedOnChange, animatedCurrentIndex, animatedDynamicSnapPointIndex]);
  const handleOnAnimate = useCallback(function handleOnAnimate(targetIndex) {
    print({
      component: BottomSheet.name,
      method: handleOnAnimate.name,
      category: 'callback',
      params: {
        toIndex: targetIndex,
        fromIndex: animatedCurrentIndex.value
      }
    });
    if (!_providedOnAnimate) {
      return;
    }
    if (targetIndex !== animatedCurrentIndex.value) {
      _providedOnAnimate(animatedCurrentIndex.value, targetIndex);
    }
  }, [_providedOnAnimate, animatedCurrentIndex]);
  //#endregion

  //#region animation
  const stopAnimation = useWorkletCallback(() => {
    cancelAnimation(animatedPosition);
    isForcedClosing.value = false;
    animatedAnimationSource.value = ANIMATION_SOURCE.NONE;
    animatedAnimationState.value = ANIMATION_STATE.STOPPED;
  }, [animatedPosition, animatedAnimationState, animatedAnimationSource]);
  const animateToPositionCompleted = useWorkletCallback(function animateToPositionCompleted(isFinished) {
    isForcedClosing.value = false;
    if (!isFinished) {
      return;
    }
    runOnJS(print)({
      component: BottomSheet.name,
      method: animateToPositionCompleted.name,
      params: {
        animatedCurrentIndex: animatedCurrentIndex.value,
        animatedNextPosition: animatedNextPosition.value,
        animatedNextPositionIndex: animatedNextPositionIndex.value
      }
    });
    if (animatedAnimationSource.value === ANIMATION_SOURCE.MOUNT) {
      isAnimatedOnMount.value = true;
    }

    // reset values
    animatedAnimationSource.value = ANIMATION_SOURCE.NONE;
    animatedAnimationState.value = ANIMATION_STATE.STOPPED;
    animatedNextPosition.value = INITIAL_VALUE;
    animatedNextPositionIndex.value = INITIAL_VALUE;
    animatedContainerHeightDidChange.value = false;
  });
  const animateToPosition = useWorkletCallback(function animateToPosition(position, source, velocity = 0, configs) {
    runOnJS(print)({
      component: BottomSheet.name,
      method: animateToPosition.name,
      params: {
        currentPosition: animatedPosition.value,
        nextPosition: position
      }
    });
    if (position === animatedPosition.value || position === undefined || animatedAnimationState.value === ANIMATION_STATE.RUNNING && position === animatedNextPosition.value) {
      return;
    }
    stopAnimation();

    /**
     * set animation state to running, and source
     */
    animatedAnimationState.value = ANIMATION_STATE.RUNNING;
    animatedAnimationSource.value = source;

    /**
     * store next position
     */
    animatedNextPosition.value = position;

    /**
     * offset the position if keyboard is shown
     */
    let offset = 0;
    if (animatedKeyboardState.value === KEYBOARD_STATE.SHOWN) {
      offset = animatedKeyboardHeightInContainer.value;
    }
    animatedNextPositionIndex.value = animatedSnapPoints.value.indexOf(position + offset);

    /**
     * fire `onAnimate` callback
     */
    runOnJS(handleOnAnimate)(animatedNextPositionIndex.value);

    /**
     * start animation
     */
    animatedPosition.value = animate({
      point: position,
      configs: configs || _providedAnimationConfigs,
      velocity,
      onComplete: animateToPositionCompleted
    });
  }, [handleOnAnimate, _providedAnimationConfigs]);
  /**
   * Set to position without animation.
   *
   * @param targetPosition position to be set.
   */
  const setToPosition = useWorkletCallback(function setToPosition(targetPosition) {
    if (targetPosition === animatedPosition.value || targetPosition === undefined || animatedAnimationState.value === ANIMATION_STATE.RUNNING && targetPosition === animatedNextPosition.value) {
      return;
    }
    runOnJS(print)({
      component: BottomSheet.name,
      method: setToPosition.name,
      params: {
        currentPosition: animatedPosition.value,
        targetPosition
      }
    });

    /**
     * store next position
     */
    animatedNextPosition.value = targetPosition;
    animatedNextPositionIndex.value = animatedSnapPoints.value.indexOf(targetPosition);
    stopAnimation();

    // set values
    animatedPosition.value = targetPosition;
    animatedContainerHeightDidChange.value = false;
  }, []);
  //#endregion

  //#region private methods
  /**
   * Calculate and evaluate the current position based on multiple
   * local states.
   */
  const getEvaluatedPosition = useWorkletCallback(function getEvaluatedPosition(source) {
    'worklet';

    const currentIndex = animatedCurrentIndex.value;
    const snapPoints = animatedSnapPoints.value;
    const keyboardState = animatedKeyboardState.value;
    const highestSnapPoint = animatedHighestSnapPoint.value;

    /**
     * if the keyboard blur behavior is restore and keyboard is hidden,
     * then we return the previous snap point.
     */
    if (source === ANIMATION_SOURCE.KEYBOARD && keyboardBlurBehavior === KEYBOARD_BLUR_BEHAVIOR.restore && keyboardState === KEYBOARD_STATE.HIDDEN && animatedContentGestureState.value !== State.ACTIVE && animatedHandleGestureState.value !== State.ACTIVE) {
      isInTemporaryPosition.value = false;
      const nextPosition = snapPoints[currentIndex];
      return nextPosition;
    }

    /**
     * if the keyboard appearance behavior is extend and keyboard is shown,
     * then we return the heights snap point.
     */
    if (keyboardBehavior === KEYBOARD_BEHAVIOR.extend && keyboardState === KEYBOARD_STATE.SHOWN) {
      return highestSnapPoint;
    }

    /**
     * if the keyboard appearance behavior is fill parent and keyboard is shown,
     * then we return 0 ( full screen ).
     */
    if (keyboardBehavior === KEYBOARD_BEHAVIOR.fillParent && keyboardState === KEYBOARD_STATE.SHOWN) {
      isInTemporaryPosition.value = true;
      return 0;
    }

    /**
     * if the keyboard appearance behavior is interactive and keyboard is shown,
     * then we return the heights points minus the keyboard in container height.
     */
    if (keyboardBehavior === KEYBOARD_BEHAVIOR.interactive && keyboardState === KEYBOARD_STATE.SHOWN) {
      isInTemporaryPosition.value = true;
      const keyboardHeightInContainer = animatedKeyboardHeightInContainer.value;
      return Math.max(0, highestSnapPoint - keyboardHeightInContainer);
    }

    /**
     * if the bottom sheet is in temporary position, then we return
     * the current position.
     */
    if (isInTemporaryPosition.value) {
      return animatedPosition.value;
    }

    /**
     * if the bottom sheet did not animate on mount,
     * then we return the provided index or the closed position.
     */
    if (!isAnimatedOnMount.value) {
      return _providedIndex === -1 ? animatedClosedPosition.value : snapPoints[_providedIndex];
    }

    /**
     * return the current index position.
     */
    return snapPoints[currentIndex];
  }, [animatedContentGestureState, animatedCurrentIndex, animatedHandleGestureState, animatedHighestSnapPoint, animatedKeyboardHeightInContainer, animatedKeyboardState, animatedPosition, animatedSnapPoints, isInTemporaryPosition, isAnimatedOnMount, keyboardBehavior, keyboardBlurBehavior, _providedIndex]);

  /**
   * Evaluate the bottom sheet position based based on a event source and other local states.
   */
  const evaluatePosition = useWorkletCallback(function evaluatePosition(source, animationConfigs) {
    /**
     * when evaluating the position while layout is not calculated, then we early exit till it is.
     */
    if (!isLayoutCalculated.value) {
      return;
    }
    const proposedPosition = getEvaluatedPosition(source);

    /**
     * when evaluating the position while the mount animation not been handled,
     * then we evaluate on mount use cases.
     */
    if (!isAnimatedOnMount.value) {
      /**
       * if animate on mount is set to true, then we animate to the propose position,
       * else, we set the position with out animation.
       */
      if (animateOnMount) {
        animateToPosition(proposedPosition, ANIMATION_SOURCE.MOUNT, undefined, animationConfigs);
      } else {
        setToPosition(proposedPosition);
        isAnimatedOnMount.value = true;
      }
      return;
    }

    /**
     * when evaluating the position while the bottom sheet is animating.
     */
    if (animatedAnimationState.value === ANIMATION_STATE.RUNNING) {
      /**
       * when evaluating the position while the bottom sheet is
       * closing, then we force closing the bottom sheet with no animation.
       */
      if (animatedNextPositionIndex.value === -1) {
        setToPosition(animatedClosedPosition.value);
        return;
      }

      /**
       * when evaluating the position while it's animating to
       * a position other than the current position, then we
       * restart the animation.
       */
      if (animatedNextPositionIndex.value !== animatedCurrentIndex.value) {
        animateToPosition(animatedNextPosition.value, source, undefined, animationConfigs);
        return;
      }
    }

    /**
     * when evaluating the position while the bottom sheet is in closed
     * position and not animating, we re-set the position to closed position.
     */
    if (animatedAnimationState.value !== ANIMATION_STATE.RUNNING && animatedCurrentIndex.value === -1) {
      setToPosition(animatedClosedPosition.value);
      return;
    }

    /**
     * when evaluating the position after the container resize, then we
     * force the bottom sheet to the proposed position with no
     * animation.
     */
    if (animatedContainerHeightDidChange.value) {
      setToPosition(proposedPosition);
      return;
    }

    /**
     * we fall back to the proposed position.
     */
    animateToPosition(proposedPosition, source, undefined, animationConfigs);
  }, [getEvaluatedPosition, animateToPosition, setToPosition]);
  //#endregion

  //#region public methods
  const handleSnapToIndex = useCallback(function handleSnapToIndex(index, animationConfigs) {
    const snapPoints = animatedSnapPoints.value;
    invariant(index >= -1 && index <= snapPoints.length - 1, `'index' was provided but out of the provided snap points range! expected value to be between -1, ${snapPoints.length - 1}`);
    print({
      component: BottomSheet.name,
      method: handleSnapToIndex.name,
      params: {
        index
      }
    });
    const nextPosition = snapPoints[index];

    /**
     * exit method if :
     * - layout is not calculated.
     * - already animating to next position.
     * - sheet is forced closing.
     */
    if (!isLayoutCalculated.value || index === animatedNextPositionIndex.value || nextPosition === animatedNextPosition.value || isForcedClosing.value) {
      return;
    }

    /**
     * reset temporary position boolean.
     */
    isInTemporaryPosition.value = false;
    runOnUI(animateToPosition)(nextPosition, ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isLayoutCalculated, isInTemporaryPosition, isForcedClosing, animatedSnapPoints, animatedNextPosition, animatedNextPositionIndex]);
  const handleSnapToPosition = useWorkletCallback(function handleSnapToPosition(position, animationConfigs) {
    print({
      component: BottomSheet.name,
      method: handleSnapToPosition.name,
      params: {
        position
      }
    });

    /**
     * normalized provided position.
     */
    const nextPosition = normalizeSnapPoint(position, animatedContainerHeight.value);

    /**
     * exit method if :
     * - layout is not calculated.
     * - already animating to next position.
     * - sheet is forced closing.
     */
    if (!isLayoutCalculated || nextPosition === animatedNextPosition.value || isForcedClosing.value) {
      return;
    }

    /**
     * mark the new position as temporary.
     */
    isInTemporaryPosition.value = true;
    runOnUI(animateToPosition)(nextPosition, ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, bottomInset, topInset, isLayoutCalculated, isForcedClosing, animatedContainerHeight, animatedPosition]);
  const handleClose = useCallback(function handleClose(animationConfigs) {
    print({
      component: BottomSheet.name,
      method: handleClose.name
    });
    const nextPosition = animatedClosedPosition.value;

    /**
     * exit method if :
     * - layout is not calculated.
     * - already animating to next position.
     * - sheet is forced closing.
     */
    if (!isLayoutCalculated.value || nextPosition === animatedNextPosition.value || isForcedClosing.value) {
      return;
    }

    /**
     * reset temporary position variable.
     */
    isInTemporaryPosition.value = false;
    runOnUI(animateToPosition)(nextPosition, ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isForcedClosing, isLayoutCalculated, isInTemporaryPosition, animatedNextPosition, animatedClosedPosition]);
  const handleForceClose = useCallback(function handleForceClose(animationConfigs) {
    print({
      component: BottomSheet.name,
      method: handleForceClose.name
    });
    const nextPosition = animatedClosedPosition.value;

    /**
     * exit method if :
     * - already animating to next position.
     * - sheet is forced closing.
     */
    if (nextPosition === animatedNextPosition.value || isForcedClosing.value) {
      return;
    }

    /**
     * reset temporary position variable.
     */
    isInTemporaryPosition.value = false;

    /**
     * set force closing variable.
     */
    isForcedClosing.value = true;
    runOnUI(animateToPosition)(nextPosition, ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isForcedClosing, isInTemporaryPosition, animatedNextPosition, animatedClosedPosition]);
  const handleExpand = useCallback(function handleExpand(animationConfigs) {
    print({
      component: BottomSheet.name,
      method: handleExpand.name
    });
    const snapPoints = animatedSnapPoints.value;
    const nextPosition = snapPoints[snapPoints.length - 1];

    /**
     * exit method if :
     * - layout is not calculated.
     * - already animating to next position.
     * - sheet is forced closing.
     */
    if (!isLayoutCalculated.value || snapPoints.length - 1 === animatedNextPositionIndex.value || nextPosition === animatedNextPosition.value || isForcedClosing.value) {
      return;
    }

    /**
     * reset temporary position boolean.
     */
    isInTemporaryPosition.value = false;
    runOnUI(animateToPosition)(nextPosition, ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isInTemporaryPosition, isLayoutCalculated, isForcedClosing, animatedSnapPoints, animatedNextPosition, animatedNextPositionIndex]);
  const handleCollapse = useCallback(function handleCollapse(animationConfigs) {
    print({
      component: BottomSheet.name,
      method: handleCollapse.name
    });
    const nextPosition = animatedSnapPoints.value[0];

    /**
     * exit method if :
     * - layout is not calculated.
     * - already animating to next position.
     * - sheet is forced closing.
     */
    if (!isLayoutCalculated || animatedNextPositionIndex.value === 0 || nextPosition === animatedNextPosition.value || isForcedClosing.value) {
      return;
    }

    /**
     * reset temporary position boolean.
     */
    isInTemporaryPosition.value = false;
    runOnUI(animateToPosition)(nextPosition, ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isForcedClosing, isLayoutCalculated, isInTemporaryPosition, animatedSnapPoints, animatedNextPosition, animatedNextPositionIndex]);
  const handleGetState = useCallback(function handleGetState() {
    return animatedSheetState.value;
  }, [animatedSheetState]);
  useImperativeHandle(ref, () => ({
    snapToIndex: handleSnapToIndex,
    snapToPosition: handleSnapToPosition,
    expand: handleExpand,
    collapse: handleCollapse,
    close: handleClose,
    forceClose: handleForceClose,
    getState: handleGetState
  }));
  //#endregion

  //#region contexts variables
  const internalContextVariables = useMemo(() => ({
    enableContentPanningGesture,
    enableDynamicSizing,
    overDragResistanceFactor,
    enableOverDrag,
    enablePanDownToClose,
    animatedAnimationState,
    animatedSheetState,
    animatedScrollableState,
    animatedScrollableOverrideState,
    animatedContentGestureState,
    animatedHandleGestureState,
    animatedKeyboardState,
    animatedScrollableType,
    animatedIndex,
    animatedPosition,
    animatedContentHeight,
    animatedClosedPosition,
    animatedHandleHeight,
    animatedFooterHeight,
    animatedKeyboardHeight,
    animatedKeyboardHeightInContainer,
    animatedContainerHeight,
    animatedSnapPoints,
    animatedHighestSnapPoint,
    animatedScrollableContentOffsetY,
    isInTemporaryPosition,
    isContentHeightFixed,
    isScrollableRefreshable,
    shouldHandleKeyboardEvents,
    simultaneousHandlers: _providedSimultaneousHandlers,
    waitFor: _providedWaitFor,
    activeOffsetX: _providedActiveOffsetX,
    activeOffsetY: _providedActiveOffsetY,
    failOffsetX: _providedFailOffsetX,
    failOffsetY: _providedFailOffsetY,
    animateToPosition,
    stopAnimation,
    setScrollableRef,
    removeScrollableRef
  }), [animatedIndex, animatedPosition, animatedContentHeight, animatedScrollableType, animatedContentGestureState, animatedHandleGestureState, animatedClosedPosition, animatedFooterHeight, animatedContainerHeight, animatedHandleHeight, animatedAnimationState, animatedKeyboardState, animatedKeyboardHeight, animatedKeyboardHeightInContainer, animatedSheetState, animatedHighestSnapPoint, animatedScrollableState, animatedScrollableOverrideState, animatedSnapPoints, shouldHandleKeyboardEvents, animatedScrollableContentOffsetY, isScrollableRefreshable, isContentHeightFixed, isInTemporaryPosition, enableContentPanningGesture, overDragResistanceFactor, enableOverDrag, enablePanDownToClose, enableDynamicSizing, _providedSimultaneousHandlers, _providedWaitFor, _providedActiveOffsetX, _providedActiveOffsetY, _providedFailOffsetX, _providedFailOffsetY, setScrollableRef, removeScrollableRef, animateToPosition, stopAnimation]);
  const externalContextVariables = useMemo(() => ({
    animatedIndex,
    animatedPosition,
    snapToIndex: handleSnapToIndex,
    snapToPosition: handleSnapToPosition,
    expand: handleExpand,
    collapse: handleCollapse,
    close: handleClose,
    forceClose: handleForceClose,
    getState: handleGetState
  }), [animatedIndex, animatedPosition, handleSnapToIndex, handleSnapToPosition, handleExpand, handleCollapse, handleClose, handleForceClose, handleGetState]);
  //#endregion

  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: Platform.OS === 'android' && animatedIndex.value === -1 ? 0 : 1,
    transform: [{
      translateY: animatedPosition.value
    }]
  }), [animatedPosition, animatedIndex]);
  const containerStyle = useMemo(() => [_providedStyle, styles.container, containerAnimatedStyle], [_providedStyle, containerAnimatedStyle]);
  const contentContainerAnimatedStyle = useAnimatedStyle(() => {
    /**
     * if dynamic sizing is enabled, and content height
     * is still not set, then we exit method.
     */
    if (enableDynamicSizing && animatedContentHeight.value === INITIAL_CONTAINER_HEIGHT) {
      return {};
    }
    return {
      height: animate({
        point: animatedContentHeightMax.value,
        configs: _providedAnimationConfigs
      })
    };
  }, [enableDynamicSizing, animatedContentHeight.value, animatedContentHeightMax.value, _providedAnimationConfigs]);
  const contentContainerStyle = useMemo(() => [styles.contentContainer, contentContainerAnimatedStyle], [contentContainerAnimatedStyle]);
  /**
   * added safe area to prevent the sheet from floating above
   * the bottom of the screen, when sheet being over dragged or
   * when the sheet is resized.
   */
  const contentMaskContainerAnimatedStyle = useAnimatedStyle(() => {
    if (detached) {
      return {
        overflow: 'visible'
      };
    }
    return {
      paddingBottom: animatedContainerHeight.value
    };
  }, [animatedContainerHeight.value, detached]);
  const contentMaskContainerStyle = useMemo(() => [styles.contentMaskContainer, contentMaskContainerAnimatedStyle], [contentMaskContainerAnimatedStyle]);
  //#endregion

  //#region effects
  useAnimatedReaction(() => animatedContainerHeight.value, (result, previous) => {
    if (result === INITIAL_CONTAINER_HEIGHT) {
      return;
    }
    animatedContainerHeightDidChange.value = result !== previous;
  });

  /**
   * Reaction to the `snapPoints` change, to insure that the sheet position reflect
   * to the current point correctly.
   *
   * @alias OnSnapPointsChange
   */
  useAnimatedReaction(() => animatedSnapPoints.value, (result, previous) => {
    /**
     * if values did not change, and did handle on mount animation
     * then we early exit the method.
     */
    if (JSON.stringify(result) === JSON.stringify(previous) && isAnimatedOnMount.value) {
      return;
    }

    /**
     * if layout is not calculated yet, then we exit the method.
     */
    if (!isLayoutCalculated.value) {
      return;
    }
    runOnJS(print)({
      component: BottomSheet.name,
      method: 'useAnimatedReaction::OnSnapPointChange',
      category: 'effect',
      params: {
        result
      }
    });
    evaluatePosition(ANIMATION_SOURCE.SNAP_POINT_CHANGE);
  }, [isLayoutCalculated.value, animatedSnapPoints.value]);

  /**
   * Reaction to the keyboard state change.
   *
   * @alias OnKeyboardStateChange
   */
  useAnimatedReaction(() => ({
    _keyboardState: animatedKeyboardState.value,
    _keyboardHeight: animatedKeyboardHeight.value
  }), (result, _previousResult) => {
    const {
      _keyboardState,
      _keyboardHeight
    } = result;
    const _previousKeyboardState = _previousResult?._keyboardState;
    const _previousKeyboardHeight = _previousResult?._keyboardHeight;

    /**
     * if keyboard state is equal to the previous state, then exit the method
     */
    if (_keyboardState === _previousKeyboardState && _keyboardHeight === _previousKeyboardHeight) {
      return;
    }

    /**
     * if state is undetermined, then we early exit.
     */
    if (_keyboardState === KEYBOARD_STATE.UNDETERMINED) {
      return;
    }

    /**
     * if keyboard is hidden by customer gesture, then we early exit.
     */
    if (_keyboardState === KEYBOARD_STATE.HIDDEN && animatedAnimationState.value === ANIMATION_STATE.RUNNING && animatedAnimationSource.value === ANIMATION_SOURCE.GESTURE) {
      return;
    }
    runOnJS(print)({
      component: BottomSheet.name,
      method: 'useAnimatedReaction::OnKeyboardStateChange',
      category: 'effect',
      params: {
        keyboardState: _keyboardState,
        keyboardHeight: _keyboardHeight
      }
    });

    /**
     * Calculate the keyboard height in the container.
     */
    animatedKeyboardHeightInContainer.value = _keyboardHeight === 0 ? 0 : $modal ? Math.abs(_keyboardHeight - Math.abs(bottomInset - animatedContainerOffset.value.bottom)) : Math.abs(_keyboardHeight - animatedContainerOffset.value.bottom);

    /**
     * if user is interacting with sheet, then exit the method
     */
    const hasActiveGesture = animatedContentGestureState.value === State.ACTIVE || animatedContentGestureState.value === State.BEGAN || animatedHandleGestureState.value === State.ACTIVE || animatedHandleGestureState.value === State.BEGAN;
    if (hasActiveGesture) {
      return;
    }

    /**
     * if new keyboard state is hidden and blur behavior is none, then exit the method
     */
    if (_keyboardState === KEYBOARD_STATE.HIDDEN && keyboardBlurBehavior === KEYBOARD_BLUR_BEHAVIOR.none) {
      return;
    }

    /**
     * if platform is android and the input mode is resize, then exit the method
     */
    if (Platform.OS === 'android' && keyboardBehavior === KEYBOARD_BEHAVIOR.interactive && android_keyboardInputMode === KEYBOARD_INPUT_MODE.adjustResize) {
      animatedKeyboardHeightInContainer.value = 0;
      return;
    }
    let animationConfigs = getKeyboardAnimationConfigs(keyboardAnimationEasing.value, keyboardAnimationDuration.value);
    evaluatePosition(ANIMATION_SOURCE.KEYBOARD, animationConfigs);
  }, [$modal, bottomInset, keyboardBehavior, keyboardBlurBehavior, android_keyboardInputMode, animatedContainerOffset, getEvaluatedPosition]);

  /**
   * sets provided animated position
   */
  useAnimatedReaction(() => animatedPosition.value, _animatedPosition => {
    if (_providedAnimatedPosition) {
      _providedAnimatedPosition.value = _animatedPosition + topInset;
    }
  }, []);

  /**
   * sets provided animated index
   */
  useAnimatedReaction(() => animatedIndex.value, _animatedIndex => {
    if (_providedAnimatedIndex) {
      _providedAnimatedIndex.value = _animatedIndex;
    }
  }, []);

  /**
   * React to internal variables to detect change in snap position.
   *
   * @alias OnChange
   */
  useAnimatedReaction(() => ({
    _animatedIndex: animatedIndex.value,
    _animatedPosition: animatedPosition.value,
    _animationState: animatedAnimationState.value,
    _contentGestureState: animatedContentGestureState.value,
    _handleGestureState: animatedHandleGestureState.value
  }), ({
    _animatedIndex,
    _animatedPosition,
    _animationState,
    _contentGestureState,
    _handleGestureState
  }) => {
    /**
     * exit the method if animation state is not stopped.
     */
    if (_animationState !== ANIMATION_STATE.STOPPED) {
      return;
    }

    /**
     * exit the method if index value is not synced with
     * position value.
     *
     * [read more](https://github.com/gorhom/react-native-bottom-sheet/issues/1356)
     */
    if (animatedNextPosition.value !== INITIAL_VALUE && animatedNextPositionIndex.value !== INITIAL_VALUE && (_animatedPosition !== animatedNextPosition.value || _animatedIndex !== animatedNextPositionIndex.value)) {
      return;
    }

    /**
     * exit the method if animated index value
     * has fraction, e.g. 1.99, 0.52
     */
    if (_animatedIndex % 1 !== 0) {
      return;
    }

    /**
     * exit the method if there any active gesture.
     */
    const hasNoActiveGesture = (_contentGestureState === State.END || _contentGestureState === State.UNDETERMINED || _contentGestureState === State.CANCELLED) && (_handleGestureState === State.END || _handleGestureState === State.UNDETERMINED || _handleGestureState === State.CANCELLED);
    if (!hasNoActiveGesture) {
      return;
    }

    /**
     * if the index is not equal to the current index,
     * than the sheet position had changed and we trigger
     * the `onChange` callback.
     */
    if (_animatedIndex !== animatedCurrentIndex.value) {
      runOnJS(print)({
        component: BottomSheet.name,
        method: 'useAnimatedReaction::OnChange',
        category: 'effect',
        params: {
          animatedCurrentIndex: animatedCurrentIndex.value,
          animatedIndex: _animatedIndex
        }
      });
      animatedCurrentIndex.value = _animatedIndex;
      runOnJS(handleOnChange)(_animatedIndex, _animatedPosition);
    }

    /**
     * if index is `-1` than we fire the `onClose` callback.
     */
    if (_animatedIndex === -1 && _providedOnClose) {
      runOnJS(print)({
        component: BottomSheet.name,
        method: 'useAnimatedReaction::onClose',
        category: 'effect',
        params: {
          animatedCurrentIndex: animatedCurrentIndex.value,
          animatedIndex: _animatedIndex
        }
      });
      runOnJS(_providedOnClose)();
    }
  }, [handleOnChange, _providedOnClose]);

  /**
   * React to `index` prop to snap the sheet to the new position.
   *
   * @alias onIndexChange
   */
  useEffect(() => {
    if (isAnimatedOnMount.value) {
      handleSnapToIndex(_providedIndex);
    }
  }, [_providedIndex, animatedCurrentIndex, isAnimatedOnMount, handleSnapToIndex]);
  //#endregion

  // render
  print({
    component: BottomSheet.name,
    method: 'render',
    params: {
      animatedSnapPoints: animatedSnapPoints.value,
      animatedCurrentIndex: animatedCurrentIndex.value,
      providedIndex: _providedIndex
    }
  });
  return /*#__PURE__*/React.createElement(BottomSheetProvider, {
    value: externalContextVariables
  }, /*#__PURE__*/React.createElement(BottomSheetInternalProvider, {
    value: internalContextVariables
  }, /*#__PURE__*/React.createElement(BottomSheetGestureHandlersProvider, {
    gestureEventsHandlersHook: gestureEventsHandlersHook
  }, /*#__PURE__*/React.createElement(BottomSheetBackdropContainer, {
    key: "BottomSheetBackdropContainer",
    animatedIndex: animatedIndex,
    animatedPosition: animatedPosition,
    backdropComponent: backdropComponent
  }), /*#__PURE__*/React.createElement(BottomSheetContainer, {
    key: "BottomSheetContainer",
    shouldCalculateHeight: !$modal,
    containerHeight: _animatedContainerHeight,
    containerOffset: animatedContainerOffset,
    topInset: topInset,
    bottomInset: bottomInset,
    detached: detached,
    style: _providedContainerStyle
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: containerStyle
  }, /*#__PURE__*/React.createElement(BottomSheetBackgroundContainer, {
    key: "BottomSheetBackgroundContainer",
    animatedIndex: animatedIndex,
    animatedPosition: animatedPosition,
    backgroundComponent: backgroundComponent,
    backgroundStyle: _providedBackgroundStyle
  }), /*#__PURE__*/React.createElement(Animated.View, {
    pointerEvents: "box-none",
    style: contentMaskContainerStyle,
    accessible: _providedAccessible ?? undefined,
    accessibilityRole: _providedAccessibilityRole ?? undefined,
    accessibilityLabel: _providedAccessibilityLabel ?? undefined
  }, /*#__PURE__*/React.createElement(BottomSheetDraggableView, {
    key: "BottomSheetRootDraggableView",
    style: contentContainerStyle
  }, children, footerComponent && /*#__PURE__*/React.createElement(BottomSheetFooterContainer, {
    footerComponent: footerComponent
  }))), /*#__PURE__*/React.createElement(BottomSheetHandleContainer, {
    key: "BottomSheetHandleContainer",
    animatedIndex: animatedIndex,
    animatedPosition: animatedPosition,
    handleHeight: animatedHandleHeight,
    enableHandlePanningGesture: enableHandlePanningGesture,
    enableOverDrag: enableOverDrag,
    enablePanDownToClose: enablePanDownToClose,
    overDragResistanceFactor: overDragResistanceFactor,
    keyboardBehavior: keyboardBehavior,
    handleComponent: handleComponent,
    handleStyle: _providedHandleStyle,
    handleIndicatorStyle: _providedHandleIndicatorStyle
  }))))));
});
const BottomSheet = /*#__PURE__*/memo(BottomSheetComponent);
BottomSheet.displayName = 'BottomSheet';
export default BottomSheet;
//# sourceMappingURL=BottomSheet.js.map