"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _invariant = _interopRequireDefault(require("invariant"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _contexts = require("../../contexts");
var _hooks = require("../../hooks");
var _utilities = require("../../utilities");
var _bottomSheetBackdropContainer = _interopRequireDefault(require("../bottomSheetBackdropContainer"));
var _bottomSheetBackgroundContainer = _interopRequireDefault(require("../bottomSheetBackgroundContainer"));
var _bottomSheetContainer = _interopRequireDefault(require("../bottomSheetContainer"));
var _bottomSheetDraggableView = _interopRequireDefault(require("../bottomSheetDraggableView"));
var _BottomSheetFooterContainer = _interopRequireDefault(require("../bottomSheetFooterContainer/BottomSheetFooterContainer"));
var _bottomSheetGestureHandlersProvider = _interopRequireDefault(require("../bottomSheetGestureHandlersProvider"));
var _bottomSheetHandleContainer = _interopRequireDefault(require("../bottomSheetHandleContainer"));
var _constants2 = require("./constants");
var _styles = require("./styles");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// import BottomSheetDebugView from '../bottomSheetDebugView';

_reactNativeReanimated.default.addWhitelistedUIProps({
  decelerationRate: true
});
const BottomSheetComponent = /*#__PURE__*/(0, _react.forwardRef)(function BottomSheet(props, ref) {
  //#region extract props
  const {
    // animations configurations
    animationConfigs: _providedAnimationConfigs,
    // configurations
    index: _providedIndex = 0,
    snapPoints: _providedSnapPoints,
    animateOnMount = _constants2.DEFAULT_ANIMATE_ON_MOUNT,
    enableContentPanningGesture = _constants2.DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
    enableHandlePanningGesture,
    enableOverDrag = _constants2.DEFAULT_ENABLE_OVER_DRAG,
    enablePanDownToClose = _constants2.DEFAULT_ENABLE_PAN_DOWN_TO_CLOSE,
    enableDynamicSizing = _constants2.DEFAULT_DYNAMIC_SIZING,
    overDragResistanceFactor = _constants2.DEFAULT_OVER_DRAG_RESISTANCE_FACTOR,
    overrideReduceMotion: _providedOverrideReduceMotion,
    // styles
    style: _providedStyle,
    containerStyle: _providedContainerStyle,
    backgroundStyle: _providedBackgroundStyle,
    handleStyle: _providedHandleStyle,
    handleIndicatorStyle: _providedHandleIndicatorStyle,
    // hooks
    gestureEventsHandlersHook,
    // keyboard
    keyboardBehavior = _constants2.DEFAULT_KEYBOARD_BEHAVIOR,
    keyboardBlurBehavior = _constants2.DEFAULT_KEYBOARD_BLUR_BEHAVIOR,
    android_keyboardInputMode = _constants2.DEFAULT_KEYBOARD_INPUT_MODE,
    enableBlurKeyboardOnGesture = _constants2.DEFAULT_ENABLE_BLUR_KEYBOARD_ON_GESTURE,
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
    accessible: _providedAccessible = _constants2.DEFAULT_ACCESSIBLE,
    accessibilityLabel: _providedAccessibilityLabel = _constants2.DEFAULT_ACCESSIBILITY_LABEL,
    accessibilityRole: _providedAccessibilityRole = _constants2.DEFAULT_ACCESSIBILITY_ROLE
  } = props;
  //#endregion

  //#region validate props
  if (__DEV__) {
    // biome-ignore lint/correctness/useHookAtTopLevel: used in development only.
    (0, _hooks.usePropsValidator)({
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
  const _animatedContainerHeight = (0, _hooks.useReactiveSharedValue)(_providedContainerHeight ?? _constants2.INITIAL_CONTAINER_HEIGHT);
  /**
   * This is a conditional variable, where if the `BottomSheet` is used
   * in a modal, then it will subset vertical insets (top+bottom) from
   * provided container height.
   */
  const animatedContainerHeight = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const verticalInset = topInset + bottomInset;
    return $modal ? _animatedContainerHeight.value - verticalInset : _animatedContainerHeight.value;
  }, [topInset, bottomInset, $modal, _animatedContainerHeight]);
  const animatedContainerOffset = (0, _hooks.useReactiveSharedValue)(_providedContainerOffset ?? _constants2.INITIAL_CONTAINER_OFFSET);
  const animatedHandleHeight = (0, _hooks.useReactiveSharedValue)(_constants2.INITIAL_HANDLE_HEIGHT);
  const animatedFooterHeight = (0, _reactNativeReanimated.useSharedValue)(0);
  const animatedContentHeight = (0, _reactNativeReanimated.useSharedValue)(_constants2.INITIAL_CONTAINER_HEIGHT);
  const [animatedSnapPoints, animatedDynamicSnapPointIndex] = (0, _hooks.useAnimatedSnapPoints)(_providedSnapPoints, animatedContainerHeight, animatedContentHeight, animatedHandleHeight, animatedFooterHeight, enableDynamicSizing, maxDynamicContentSize);
  const animatedHighestSnapPoint = (0, _reactNativeReanimated.useDerivedValue)(() => animatedSnapPoints.value[animatedSnapPoints.value.length - 1], [animatedSnapPoints]);
  const animatedClosedPosition = (0, _reactNativeReanimated.useDerivedValue)(() => {
    let closedPosition = animatedContainerHeight.value;
    if ($modal || detached) {
      closedPosition = animatedContainerHeight.value + bottomInset;
    }
    return closedPosition;
  }, [animatedContainerHeight, $modal, detached, bottomInset]);
  const animatedSheetHeight = (0, _reactNativeReanimated.useDerivedValue)(() => animatedContainerHeight.value - animatedHighestSnapPoint.value, [animatedContainerHeight, animatedHighestSnapPoint]);
  const animatedCurrentIndex = (0, _hooks.useReactiveSharedValue)(animateOnMount ? -1 : _providedIndex);
  const animatedPosition = (0, _reactNativeReanimated.useSharedValue)(_constants2.INITIAL_POSITION);
  const animatedNextPosition = (0, _reactNativeReanimated.useSharedValue)(_constants2.INITIAL_VALUE);
  const animatedNextPositionIndex = (0, _reactNativeReanimated.useSharedValue)(_constants2.INITIAL_VALUE);

  // conditional
  const isAnimatedOnMount = (0, _reactNativeReanimated.useSharedValue)(!animateOnMount || _providedIndex === -1);
  const isContentHeightFixed = (0, _reactNativeReanimated.useSharedValue)(false);
  const isLayoutCalculated = (0, _reactNativeReanimated.useDerivedValue)(() => {
    let isContainerHeightCalculated = false;
    //container height was provided.
    if (_providedContainerHeight !== null || _providedContainerHeight !== undefined) {
      isContainerHeightCalculated = true;
    }
    // container height did set.
    if (animatedContainerHeight.value !== _constants2.INITIAL_CONTAINER_HEIGHT) {
      isContainerHeightCalculated = true;
    }
    let isHandleHeightCalculated = false;
    // handle component is null.
    if (handleComponent === null) {
      animatedHandleHeight.value = 0;
      isHandleHeightCalculated = true;
    }
    // handle height did set.
    if (animatedHandleHeight.value !== _constants2.INITIAL_HANDLE_HEIGHT) {
      isHandleHeightCalculated = true;
    }
    let isSnapPointsNormalized = false;
    // the first snap point did normalized
    if (animatedSnapPoints.value[0] !== _constants2.INITIAL_SNAP_POINT) {
      isSnapPointsNormalized = true;
    }
    return isContainerHeightCalculated && isHandleHeightCalculated && isSnapPointsNormalized;
  }, [_providedContainerHeight, animatedContainerHeight, animatedHandleHeight, animatedSnapPoints, handleComponent]);
  const isInTemporaryPosition = (0, _reactNativeReanimated.useSharedValue)(false);
  const isForcedClosing = (0, _reactNativeReanimated.useSharedValue)(false);
  const animatedContainerHeightDidChange = (0, _reactNativeReanimated.useSharedValue)(false);

  // gesture
  const animatedContentGestureState = (0, _reactNativeReanimated.useSharedValue)(_reactNativeGestureHandler.State.UNDETERMINED);
  const animatedHandleGestureState = (0, _reactNativeReanimated.useSharedValue)(_reactNativeGestureHandler.State.UNDETERMINED);
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
  } = (0, _hooks.useScrollable)();
  // keyboard
  const {
    state: animatedKeyboardState,
    height: animatedKeyboardHeight,
    animationDuration: keyboardAnimationDuration,
    animationEasing: keyboardAnimationEasing,
    shouldHandleKeyboardEvents
  } = (0, _hooks.useKeyboard)();
  const animatedKeyboardHeightInContainer = (0, _reactNativeReanimated.useSharedValue)(0);
  const userReduceMotionSetting = (0, _reactNativeReanimated.useReducedMotion)();
  const reduceMotion = (0, _react.useMemo)(() => {
    return !_providedOverrideReduceMotion || _providedOverrideReduceMotion === _reactNativeReanimated.ReduceMotion.System ? userReduceMotionSetting : _providedOverrideReduceMotion === _reactNativeReanimated.ReduceMotion.Always;
  }, [userReduceMotionSetting, _providedOverrideReduceMotion]);
  //#endregion

  //#region state/dynamic variables
  // states
  const animatedAnimationState = (0, _reactNativeReanimated.useSharedValue)(_constants.ANIMATION_STATE.UNDETERMINED);
  const animatedAnimationSource = (0, _reactNativeReanimated.useSharedValue)(_constants.ANIMATION_SOURCE.MOUNT);
  const animatedSheetState = (0, _reactNativeReanimated.useDerivedValue)(() => {
    // closed position = position >= container height
    if (animatedPosition.value >= animatedClosedPosition.value) {
      return _constants.SHEET_STATE.CLOSED;
    }

    // extended position = container height - sheet height
    const extendedPosition = animatedContainerHeight.value - animatedSheetHeight.value;
    if (animatedPosition.value === extendedPosition) {
      return _constants.SHEET_STATE.EXTENDED;
    }

    // extended position with keyboard =
    // container height - (sheet height + keyboard height in root container)
    const keyboardHeightInContainer = animatedKeyboardHeightInContainer.value;
    const extendedPositionWithKeyboard = Math.max(0, animatedContainerHeight.value - (animatedSheetHeight.value + keyboardHeightInContainer));

    // detect if keyboard is open and the sheet is in temporary position
    if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.interactive && isInTemporaryPosition.value && animatedPosition.value === extendedPositionWithKeyboard) {
      return _constants.SHEET_STATE.EXTENDED;
    }

    // fill parent = 0
    if (animatedPosition.value === 0) {
      return _constants.SHEET_STATE.FILL_PARENT;
    }

    // detect if position is below extended point
    if (animatedPosition.value < extendedPosition) {
      return _constants.SHEET_STATE.OVER_EXTENDED;
    }
    return _constants.SHEET_STATE.OPENED;
  }, [animatedClosedPosition, animatedContainerHeight, animatedKeyboardHeightInContainer, animatedPosition, animatedSheetHeight, isInTemporaryPosition, keyboardBehavior]);
  const animatedScrollableState = (0, _reactNativeReanimated.useDerivedValue)(() => {
    /**
     * if user had disabled content panning gesture, then we unlock
     * the scrollable state.
     */
    if (!enableContentPanningGesture) {
      return _constants.SCROLLABLE_STATE.UNLOCKED;
    }

    /**
     * if scrollable override state is set, then we just return its value.
     */
    if (animatedScrollableOverrideState.value !== _constants.SCROLLABLE_STATE.UNDETERMINED) {
      return animatedScrollableOverrideState.value;
    }
    /**
     * if sheet state is fill parent, then unlock scrolling
     */
    if (animatedSheetState.value === _constants.SHEET_STATE.FILL_PARENT) {
      return _constants.SCROLLABLE_STATE.UNLOCKED;
    }

    /**
     * if sheet state is extended, then unlock scrolling
     */
    if (animatedSheetState.value === _constants.SHEET_STATE.EXTENDED) {
      return _constants.SCROLLABLE_STATE.UNLOCKED;
    }

    /**
     * if keyboard is shown and sheet is animating
     * then we do not lock the scrolling to not lose
     * current scrollable scroll position.
     */
    if (animatedKeyboardState.value === _constants.KEYBOARD_STATE.SHOWN && animatedAnimationState.value === _constants.ANIMATION_STATE.RUNNING) {
      return _constants.SCROLLABLE_STATE.UNLOCKED;
    }
    return _constants.SCROLLABLE_STATE.LOCKED;
  }, [enableContentPanningGesture, animatedAnimationState, animatedKeyboardState, animatedScrollableOverrideState, animatedSheetState]);
  // dynamic
  const animatedContentHeightMax = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const keyboardHeightInContainer = animatedKeyboardHeightInContainer.value;
    const handleHeight = Math.max(0, animatedHandleHeight.value);
    let contentHeight = animatedSheetHeight.value - handleHeight;
    if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.extend && animatedKeyboardState.value === _constants.KEYBOARD_STATE.SHOWN) {
      contentHeight = contentHeight - keyboardHeightInContainer;
    } else if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.fillParent && isInTemporaryPosition.value) {
      if (animatedKeyboardState.value === _constants.KEYBOARD_STATE.SHOWN) {
        contentHeight = animatedContainerHeight.value - handleHeight - keyboardHeightInContainer;
      } else {
        contentHeight = animatedContainerHeight.value - handleHeight;
      }
    } else if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.interactive && isInTemporaryPosition.value) {
      const contentWithKeyboardHeight = contentHeight + keyboardHeightInContainer;
      if (animatedKeyboardState.value === _constants.KEYBOARD_STATE.SHOWN) {
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
  const animatedIndex = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const adjustedSnapPoints = animatedSnapPoints.value.slice().reverse();
    const adjustedSnapPointsIndexes = animatedSnapPoints.value.slice().map((_, index) => index).reverse();

    /**
     * we add the close state index `-1`
     */
    adjustedSnapPoints.push(animatedContainerHeight.value);
    adjustedSnapPointsIndexes.push(-1);
    const currentIndex = isLayoutCalculated.value ? (0, _reactNativeReanimated.interpolate)(animatedPosition.value, adjustedSnapPoints, adjustedSnapPointsIndexes, _reactNativeReanimated.Extrapolation.CLAMP) : -1;

    /**
     * if the sheet is currently running an animation by the keyboard opening,
     * then we clamp the index on android with resize keyboard mode.
     */
    if (android_keyboardInputMode === _constants.KEYBOARD_INPUT_MODE.adjustResize && animatedAnimationSource.value === _constants.ANIMATION_SOURCE.KEYBOARD && animatedAnimationState.value === _constants.ANIMATION_STATE.RUNNING && isInTemporaryPosition.value) {
      return Math.max(animatedCurrentIndex.value, currentIndex);
    }

    /**
     * if the sheet is currently running an animation by snap point change - usually caused
     * by dynamic content height -, then we return the next position index.
     */
    if (animatedAnimationSource.value === _constants.ANIMATION_SOURCE.SNAP_POINT_CHANGE && animatedAnimationState.value === _constants.ANIMATION_STATE.RUNNING) {
      return animatedNextPositionIndex.value;
    }
    return currentIndex;
  }, [android_keyboardInputMode, animatedAnimationSource, animatedAnimationState, animatedContainerHeight, animatedCurrentIndex, animatedNextPositionIndex, animatedPosition, animatedSnapPoints, isInTemporaryPosition, isLayoutCalculated]);
  //#endregion

  //#region private methods
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheet.name): used for debug only
  const handleOnChange = (0, _react.useCallback)(function handleOnChange(index, position) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheet.name,
        method: handleOnChange.name,
        category: 'callback',
        params: {
          index,
          animatedCurrentIndex: animatedCurrentIndex.value
        }
      });
    }
    if (!_providedOnChange) {
      return;
    }
    _providedOnChange(index, position, index === animatedDynamicSnapPointIndex.value ? _constants.SNAP_POINT_TYPE.DYNAMIC : _constants.SNAP_POINT_TYPE.PROVIDED);
  }, [_providedOnChange, animatedCurrentIndex, animatedDynamicSnapPointIndex]);
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheet.name): used for debug only
  const handleOnAnimate = (0, _react.useCallback)(function handleOnAnimate(targetIndex) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheet.name,
        method: handleOnAnimate.name,
        category: 'callback',
        params: {
          toIndex: targetIndex,
          fromIndex: animatedCurrentIndex.value
        }
      });
    }
    if (!_providedOnAnimate) {
      return;
    }
    if (targetIndex !== animatedCurrentIndex.value) {
      _providedOnAnimate(animatedCurrentIndex.value, targetIndex);
    }
  }, [_providedOnAnimate, animatedCurrentIndex]);
  //#endregion

  //#region animation
  const stopAnimation = (0, _reactNativeReanimated.useWorkletCallback)(() => {
    (0, _reactNativeReanimated.cancelAnimation)(animatedPosition);
    animatedAnimationSource.value = _constants.ANIMATION_SOURCE.NONE;
    animatedAnimationState.value = _constants.ANIMATION_STATE.STOPPED;
  }, [animatedPosition, animatedAnimationState, animatedAnimationSource]);
  const animateToPositionCompleted = (0, _reactNativeReanimated.useWorkletCallback)(function animateToPositionCompleted(isFinished) {
    if (!isFinished) {
      return;
    }
    if (__DEV__) {
      (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
        component: BottomSheet.name,
        method: animateToPositionCompleted.name,
        params: {
          animatedCurrentIndex: animatedCurrentIndex.value,
          animatedNextPosition: animatedNextPosition.value,
          animatedNextPositionIndex: animatedNextPositionIndex.value
        }
      });
    }
    if (animatedAnimationSource.value === _constants.ANIMATION_SOURCE.MOUNT) {
      isAnimatedOnMount.value = true;
    }

    // reset values
    isForcedClosing.value = false;
    animatedAnimationSource.value = _constants.ANIMATION_SOURCE.NONE;
    animatedAnimationState.value = _constants.ANIMATION_STATE.STOPPED;
    animatedNextPosition.value = _constants2.INITIAL_VALUE;
    animatedNextPositionIndex.value = _constants2.INITIAL_VALUE;
    animatedContainerHeightDidChange.value = false;
  });
  const animateToPosition = (0, _reactNativeReanimated.useWorkletCallback)(function animateToPosition(position, source, velocity = 0, configs) {
    if (__DEV__) {
      (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
        component: BottomSheet.name,
        method: animateToPosition.name,
        params: {
          currentPosition: animatedPosition.value,
          nextPosition: position,
          source
        }
      });
    }
    if (position === animatedPosition.value || position === undefined || animatedAnimationState.value === _constants.ANIMATION_STATE.RUNNING && position === animatedNextPosition.value) {
      return;
    }

    // stop animation if it is running
    if (animatedAnimationState.value === _constants.ANIMATION_STATE.RUNNING) {
      stopAnimation();
    }

    /**
     * set animation state to running, and source
     */
    animatedAnimationState.value = _constants.ANIMATION_STATE.RUNNING;
    animatedAnimationSource.value = source;

    /**
     * store next position
     */
    animatedNextPosition.value = position;

    /**
     * offset the position if keyboard is shown
     */
    let offset = 0;
    if (animatedKeyboardState.value === _constants.KEYBOARD_STATE.SHOWN) {
      offset = animatedKeyboardHeightInContainer.value;
    }
    animatedNextPositionIndex.value = animatedSnapPoints.value.indexOf(position + offset);

    /**
     * fire `onAnimate` callback
     */
    (0, _reactNativeReanimated.runOnJS)(handleOnAnimate)(animatedNextPositionIndex.value);

    /**
     * start animation
     */
    animatedPosition.value = (0, _utilities.animate)({
      point: position,
      configs: configs || _providedAnimationConfigs,
      velocity,
      overrideReduceMotion: _providedOverrideReduceMotion,
      onComplete: animateToPositionCompleted
    });
  }, [handleOnAnimate, _providedAnimationConfigs, _providedOverrideReduceMotion]);
  /**
   * Set to position without animation.
   *
   * @param targetPosition position to be set.
   */
  const setToPosition = (0, _reactNativeReanimated.useWorkletCallback)(function setToPosition(targetPosition) {
    if (targetPosition === animatedPosition.value || targetPosition === undefined || animatedAnimationState.value === _constants.ANIMATION_STATE.RUNNING && targetPosition === animatedNextPosition.value) {
      return;
    }
    if (__DEV__) {
      (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
        component: BottomSheet.name,
        method: setToPosition.name,
        params: {
          currentPosition: animatedPosition.value,
          targetPosition
        }
      });
    }

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
  const getEvaluatedPosition = (0, _reactNativeReanimated.useWorkletCallback)(function getEvaluatedPosition(source) {
    'worklet';

    const currentIndex = animatedCurrentIndex.value;
    const snapPoints = animatedSnapPoints.value;
    const keyboardState = animatedKeyboardState.value;
    const highestSnapPoint = animatedHighestSnapPoint.value;

    /**
     * if the keyboard blur behavior is restore and keyboard is hidden,
     * then we return the previous snap point.
     */
    if (source === _constants.ANIMATION_SOURCE.KEYBOARD && keyboardBlurBehavior === _constants.KEYBOARD_BLUR_BEHAVIOR.restore && keyboardState === _constants.KEYBOARD_STATE.HIDDEN && animatedContentGestureState.value !== _reactNativeGestureHandler.State.ACTIVE && animatedHandleGestureState.value !== _reactNativeGestureHandler.State.ACTIVE) {
      isInTemporaryPosition.value = false;
      const nextPosition = snapPoints[currentIndex];
      return nextPosition;
    }

    /**
     * if the keyboard appearance behavior is extend and keyboard is shown,
     * then we return the heights snap point.
     */
    if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.extend && keyboardState === _constants.KEYBOARD_STATE.SHOWN) {
      return highestSnapPoint;
    }

    /**
     * if the keyboard appearance behavior is fill parent and keyboard is shown,
     * then we return 0 ( full screen ).
     */
    if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.fillParent && keyboardState === _constants.KEYBOARD_STATE.SHOWN) {
      isInTemporaryPosition.value = true;
      return 0;
    }

    /**
     * if the keyboard appearance behavior is interactive and keyboard is shown,
     * then we return the heights points minus the keyboard in container height.
     */
    if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.interactive && keyboardState === _constants.KEYBOARD_STATE.SHOWN &&
    // ensure that this logic does not run on android
    // with resize input mode
    !(_reactNative.Platform.OS === 'android' && android_keyboardInputMode === 'adjustResize')) {
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
  const evaluatePosition = (0, _reactNativeReanimated.useWorkletCallback)(function evaluatePosition(source, animationConfigs) {
    /**
     * if a force closing is running and source not from user, then we early exit
     */
    if (isForcedClosing.value && source !== _constants.ANIMATION_SOURCE.USER) {
      return;
    }
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
        animateToPosition(proposedPosition, _constants.ANIMATION_SOURCE.MOUNT, undefined, animationConfigs);
      } else {
        setToPosition(proposedPosition);
        isAnimatedOnMount.value = true;
      }
      return;
    }

    /**
     * when evaluating the position while the bottom sheet is animating.
     */
    if (animatedAnimationState.value === _constants.ANIMATION_STATE.RUNNING) {
      /**
       * when evaluating the position while the bottom sheet is
       * closing, then we force closing the bottom sheet with no animation.
       */
      if (animatedNextPositionIndex.value === -1 && !isInTemporaryPosition.value) {
        setToPosition(animatedClosedPosition.value);
        return;
      }

      /**
       * when evaluating the position while it's animating to
       * a position other than the current position, then we
       * restart the animation.
       */
      if (animatedNextPositionIndex.value !== animatedCurrentIndex.value) {
        animateToPosition(animatedSnapPoints.value[animatedNextPositionIndex.value], source, undefined, animationConfigs);
        return;
      }
    }

    /**
     * when evaluating the position while the bottom sheet is in closed
     * position and not animating, we re-set the position to closed position.
     */
    if (animatedAnimationState.value !== _constants.ANIMATION_STATE.RUNNING && animatedCurrentIndex.value === -1) {
      /**
       * early exit if reduce motion is enabled and index is out of sync with position.
       */
      if (reduceMotion && animatedSnapPoints.value[animatedIndex.value] !== animatedPosition.value) {
        return;
      }
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
  }, [getEvaluatedPosition, animateToPosition, setToPosition, reduceMotion]);
  //#endregion

  //#region public methods
  const handleSnapToIndex = (0, _hooks.useStableCallback)(function handleSnapToIndex(index, animationConfigs) {
    const snapPoints = animatedSnapPoints.value;
    (0, _invariant.default)(index >= -1 && index <= snapPoints.length - 1, `'index' was provided but out of the provided snap points range! expected value to be between -1, ${snapPoints.length - 1}`);
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheet.name,
        method: handleSnapToIndex.name,
        params: {
          index
        }
      });
    }
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
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(nextPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  });
  const handleSnapToPosition = (0, _reactNativeReanimated.useWorkletCallback)(function handleSnapToPosition(position, animationConfigs) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheet.name,
        method: handleSnapToPosition.name,
        params: {
          position
        }
      });
    }

    /**
     * normalized provided position.
     */
    const nextPosition = (0, _utilities.normalizeSnapPoint)(position, animatedContainerHeight.value);

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
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(nextPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, bottomInset, topInset, isLayoutCalculated, isForcedClosing, animatedContainerHeight, animatedPosition]);
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheet.name): used for debug only
  const handleClose = (0, _react.useCallback)(function handleClose(animationConfigs) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheet.name,
        method: handleClose.name
      });
    }
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
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(nextPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isForcedClosing, isLayoutCalculated, isInTemporaryPosition, animatedNextPosition, animatedClosedPosition]);
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheet.name): used for debug only
  const handleForceClose = (0, _react.useCallback)(function handleForceClose(animationConfigs) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheet.name,
        method: handleForceClose.name
      });
    }
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
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(nextPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isForcedClosing, isInTemporaryPosition, animatedNextPosition, animatedClosedPosition]);
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheet.name): used for debug only
  const handleExpand = (0, _react.useCallback)(function handleExpand(animationConfigs) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheet.name,
        method: handleExpand.name
      });
    }
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
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(nextPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isInTemporaryPosition, isLayoutCalculated, isForcedClosing, animatedSnapPoints, animatedNextPosition, animatedNextPositionIndex]);
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheet.name): used for debug only
  const handleCollapse = (0, _react.useCallback)(function handleCollapse(animationConfigs) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheet.name,
        method: handleCollapse.name
      });
    }
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
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(nextPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isForcedClosing, isLayoutCalculated, isInTemporaryPosition, animatedSnapPoints, animatedNextPosition, animatedNextPositionIndex]);
  (0, _react.useImperativeHandle)(ref, () => ({
    snapToIndex: handleSnapToIndex,
    snapToPosition: handleSnapToPosition,
    expand: handleExpand,
    collapse: handleCollapse,
    close: handleClose,
    forceClose: handleForceClose
  }));
  //#endregion

  //#region contexts variables
  const internalContextVariables = (0, _react.useMemo)(() => ({
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
    enableBlurKeyboardOnGesture,
    animateToPosition,
    stopAnimation,
    setScrollableRef,
    removeScrollableRef
  }), [animatedIndex, animatedPosition, animatedContentHeight, animatedScrollableType, animatedContentGestureState, animatedHandleGestureState, animatedClosedPosition, animatedFooterHeight, animatedContainerHeight, animatedHandleHeight, animatedAnimationState, animatedKeyboardState, animatedKeyboardHeight, animatedKeyboardHeightInContainer, animatedSheetState, animatedHighestSnapPoint, animatedScrollableState, animatedScrollableOverrideState, animatedSnapPoints, shouldHandleKeyboardEvents, animatedScrollableContentOffsetY, isScrollableRefreshable, isContentHeightFixed, isInTemporaryPosition, enableContentPanningGesture, overDragResistanceFactor, enableOverDrag, enablePanDownToClose, enableDynamicSizing, enableBlurKeyboardOnGesture, _providedSimultaneousHandlers, _providedWaitFor, _providedActiveOffsetX, _providedActiveOffsetY, _providedFailOffsetX, _providedFailOffsetY, setScrollableRef, removeScrollableRef, animateToPosition, stopAnimation]);
  const externalContextVariables = (0, _react.useMemo)(() => ({
    animatedIndex,
    animatedPosition,
    snapToIndex: handleSnapToIndex,
    snapToPosition: handleSnapToPosition,
    expand: handleExpand,
    collapse: handleCollapse,
    close: handleClose,
    forceClose: handleForceClose
  }), [animatedIndex, animatedPosition, handleSnapToIndex, handleSnapToPosition, handleExpand, handleCollapse, handleClose, handleForceClose]);
  //#endregion

  //#region styles
  const containerAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: _reactNative.Platform.OS === 'android' && animatedIndex.value === -1 ? 0 : 1,
    transform: [{
      translateY: animatedPosition.value
    }]
  }), [animatedPosition, animatedIndex]);
  const containerStyle = (0, _react.useMemo)(() => [_providedStyle, _styles.styles.container, containerAnimatedStyle], [_providedStyle, containerAnimatedStyle]);
  const contentContainerAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    /**
     * if dynamic sizing is enabled, and content height
     * is still not set, then we exit method.
     */
    if (enableDynamicSizing && animatedContentHeight.value === _constants2.INITIAL_CONTAINER_HEIGHT) {
      return {};
    }
    return {
      height: (0, _utilities.animate)({
        point: animatedContentHeightMax.value,
        configs: _providedAnimationConfigs,
        overrideReduceMotion: _providedOverrideReduceMotion
      })
    };
  }, [enableDynamicSizing, animatedContentHeight, animatedContentHeightMax, _providedOverrideReduceMotion, _providedAnimationConfigs]);
  const contentContainerStyle = (0, _react.useMemo)(() => [_styles.styles.contentContainer, contentContainerAnimatedStyle], [contentContainerAnimatedStyle]);
  /**
   * added safe area to prevent the sheet from floating above
   * the bottom of the screen, when sheet being over dragged or
   * when the sheet is resized.
   */
  const contentMaskContainerAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    if (detached) {
      return {
        overflow: 'visible'
      };
    }
    return {
      paddingBottom: animatedContainerHeight.value
    };
  }, [animatedContainerHeight, detached]);
  const contentMaskContainerStyle = (0, _react.useMemo)(() => [_styles.styles.contentMaskContainer, contentMaskContainerAnimatedStyle], [contentMaskContainerAnimatedStyle]);
  //#endregion

  //#region effects
  (0, _reactNativeReanimated.useAnimatedReaction)(() => animatedContainerHeight.value, (result, previous) => {
    if (result === _constants2.INITIAL_CONTAINER_HEIGHT) {
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
  (0, _reactNativeReanimated.useAnimatedReaction)(() => animatedSnapPoints.value, (result, previous) => {
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
    if (__DEV__) {
      (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
        component: BottomSheet.name,
        method: 'useAnimatedReaction::OnSnapPointChange',
        category: 'effect',
        params: {
          result
        }
      });
    }
    evaluatePosition(_constants.ANIMATION_SOURCE.SNAP_POINT_CHANGE);
  }, [isLayoutCalculated, animatedSnapPoints]);

  /**
   * Reaction to the keyboard state change.
   *
   * @alias OnKeyboardStateChange
   */
  (0, _reactNativeReanimated.useAnimatedReaction)(() => ({
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
    if (_keyboardState === _constants.KEYBOARD_STATE.UNDETERMINED) {
      return;
    }

    /**
     * if keyboard is hidden by customer gesture, then we early exit.
     */
    if (_keyboardState === _constants.KEYBOARD_STATE.HIDDEN && animatedAnimationState.value === _constants.ANIMATION_STATE.RUNNING && animatedAnimationSource.value === _constants.ANIMATION_SOURCE.GESTURE) {
      return;
    }
    if (__DEV__) {
      (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
        component: BottomSheet.name,
        method: 'useAnimatedReaction::OnKeyboardStateChange',
        category: 'effect',
        params: {
          keyboardState: _keyboardState,
          keyboardHeight: _keyboardHeight
        }
      });
    }

    /**
     * Calculate the keyboard height in the container.
     */
    animatedKeyboardHeightInContainer.value = _keyboardHeight === 0 ? 0 : $modal ? Math.abs(_keyboardHeight - Math.abs(bottomInset - animatedContainerOffset.value.bottom)) : Math.abs(_keyboardHeight - animatedContainerOffset.value.bottom);

    /**
     * if platform is android and the input mode is resize, then exit the method
     */
    if (_reactNative.Platform.OS === 'android' && android_keyboardInputMode === _constants.KEYBOARD_INPUT_MODE.adjustResize) {
      animatedKeyboardHeightInContainer.value = 0;
      if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.interactive) {
        return;
      }
    }

    /**
     * if user is interacting with sheet, then exit the method
     */
    const hasActiveGesture = animatedContentGestureState.value === _reactNativeGestureHandler.State.ACTIVE || animatedContentGestureState.value === _reactNativeGestureHandler.State.BEGAN || animatedHandleGestureState.value === _reactNativeGestureHandler.State.ACTIVE || animatedHandleGestureState.value === _reactNativeGestureHandler.State.BEGAN;
    if (hasActiveGesture) {
      return;
    }

    /**
     * if new keyboard state is hidden and blur behavior is none, then exit the method
     */
    if (_keyboardState === _constants.KEYBOARD_STATE.HIDDEN && keyboardBlurBehavior === _constants.KEYBOARD_BLUR_BEHAVIOR.none) {
      return;
    }
    const animationConfigs = (0, _utilities.getKeyboardAnimationConfigs)(keyboardAnimationEasing.value, keyboardAnimationDuration.value);
    evaluatePosition(_constants.ANIMATION_SOURCE.KEYBOARD, animationConfigs);
  }, [$modal, bottomInset, keyboardBehavior, keyboardBlurBehavior, android_keyboardInputMode, animatedContainerOffset, getEvaluatedPosition]);

  /**
   * sets provided animated position
   */
  (0, _reactNativeReanimated.useAnimatedReaction)(() => animatedPosition.value, _animatedPosition => {
    if (_providedAnimatedPosition) {
      _providedAnimatedPosition.value = _animatedPosition + topInset;
    }
  }, []);

  /**
   * sets provided animated index
   */
  (0, _reactNativeReanimated.useAnimatedReaction)(() => animatedIndex.value, _animatedIndex => {
    if (_providedAnimatedIndex) {
      _providedAnimatedIndex.value = _animatedIndex;
    }
  }, []);

  /**
   * React to internal variables to detect change in snap position.
   *
   * @alias OnChange
   */
  (0, _reactNativeReanimated.useAnimatedReaction)(() => ({
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
    if (_animationState !== _constants.ANIMATION_STATE.STOPPED) {
      return;
    }

    /**
     * exit the method if index value is not synced with
     * position value.
     *
     * [read more](https://github.com/gorhom/react-native-bottom-sheet/issues/1356)
     */
    if (animatedNextPosition.value !== _constants2.INITIAL_VALUE && animatedNextPositionIndex.value !== _constants2.INITIAL_VALUE && (_animatedPosition !== animatedNextPosition.value || _animatedIndex !== animatedNextPositionIndex.value)) {
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
    const hasNoActiveGesture = (_contentGestureState === _reactNativeGestureHandler.State.END || _contentGestureState === _reactNativeGestureHandler.State.UNDETERMINED || _contentGestureState === _reactNativeGestureHandler.State.CANCELLED) && (_handleGestureState === _reactNativeGestureHandler.State.END || _handleGestureState === _reactNativeGestureHandler.State.UNDETERMINED || _handleGestureState === _reactNativeGestureHandler.State.CANCELLED);
    if (!hasNoActiveGesture) {
      return;
    }

    /**
     * exit the method if the animated index is out of sync with the
     * animated position. this happened when the user enable reduce
     * motion setting only.
     */
    if (reduceMotion && _animatedIndex === animatedCurrentIndex.value && animatedSnapPoints.value[_animatedIndex] !== _animatedPosition) {
      return;
    }

    /**
     * if the index is not equal to the current index,
     * than the sheet position had changed and we trigger
     * the `onChange` callback.
     */
    if (_animatedIndex !== animatedCurrentIndex.value) {
      if (__DEV__) {
        (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
          component: BottomSheet.name,
          method: 'useAnimatedReaction::OnChange',
          category: 'effect',
          params: {
            animatedCurrentIndex: animatedCurrentIndex.value,
            animatedIndex: _animatedIndex
          }
        });
      }
      animatedCurrentIndex.value = _animatedIndex;
      (0, _reactNativeReanimated.runOnJS)(handleOnChange)(_animatedIndex, _animatedPosition);
    }

    /**
     * if index is `-1` than we fire the `onClose` callback.
     */
    if (_animatedIndex === -1 && _providedOnClose) {
      if (__DEV__) {
        (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
          component: BottomSheet.name,
          method: 'useAnimatedReaction::onClose',
          category: 'effect',
          params: {
            animatedCurrentIndex: animatedCurrentIndex.value,
            animatedIndex: _animatedIndex
          }
        });
      }
      (0, _reactNativeReanimated.runOnJS)(_providedOnClose)();
    }
  }, [reduceMotion, handleOnChange, _providedOnClose]);

  /**
   * React to `index` prop to snap the sheet to the new position.
   *
   * @alias onIndexChange
   */
  (0, _react.useEffect)(() => {
    // early exit, if animate on mount is set and it did not animate yet.
    if (animateOnMount && !isAnimatedOnMount.value) {
      return;
    }
    handleSnapToIndex(_providedIndex);
  }, [animateOnMount, _providedIndex, isAnimatedOnMount, handleSnapToIndex]);
  //#endregion

  // render
  const DraggableView = enableContentPanningGesture ? _bottomSheetDraggableView.default : _reactNativeReanimated.default.View;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_contexts.BottomSheetProvider, {
    value: externalContextVariables,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_contexts.BottomSheetInternalProvider, {
      value: internalContextVariables,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_bottomSheetGestureHandlersProvider.default, {
        gestureEventsHandlersHook: gestureEventsHandlersHook,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_bottomSheetBackdropContainer.default, {
          animatedIndex: animatedIndex,
          animatedPosition: animatedPosition,
          backdropComponent: backdropComponent
        }, "BottomSheetBackdropContainer"), /*#__PURE__*/(0, _jsxRuntime.jsx)(_bottomSheetContainer.default, {
          shouldCalculateHeight: !$modal,
          containerHeight: _animatedContainerHeight,
          containerOffset: animatedContainerOffset,
          topInset: topInset,
          bottomInset: bottomInset,
          detached: detached,
          style: _providedContainerStyle,
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNativeReanimated.default.View, {
            style: containerStyle,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_bottomSheetBackgroundContainer.default, {
              animatedIndex: animatedIndex,
              animatedPosition: animatedPosition,
              backgroundComponent: backgroundComponent,
              backgroundStyle: _providedBackgroundStyle
            }, "BottomSheetBackgroundContainer"), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNativeReanimated.default.View, {
              pointerEvents: "box-none",
              style: contentMaskContainerStyle,
              accessible: _providedAccessible ?? undefined,
              accessibilityRole: _providedAccessibilityRole ?? undefined,
              accessibilityLabel: _providedAccessibilityLabel ?? undefined,
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(DraggableView, {
                style: contentContainerStyle,
                children: children
              }, "BottomSheetRootDraggableView"), footerComponent && /*#__PURE__*/(0, _jsxRuntime.jsx)(_BottomSheetFooterContainer.default, {
                footerComponent: footerComponent
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_bottomSheetHandleContainer.default, {
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
            }, "BottomSheetHandleContainer")]
          })
        }, "BottomSheetContainer")]
      })
    })
  });
});
const BottomSheet = /*#__PURE__*/(0, _react.memo)(BottomSheetComponent);
BottomSheet.displayName = 'BottomSheet';
var _default = exports.default = BottomSheet;
//# sourceMappingURL=BottomSheet.js.map