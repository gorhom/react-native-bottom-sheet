"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _invariant = _interopRequireDefault(require("invariant"));

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _hooks = require("../../hooks");

var _contexts = require("../../contexts");

var _bottomSheetContainer = _interopRequireDefault(require("../bottomSheetContainer"));

var _bottomSheetGestureHandlersProvider = _interopRequireDefault(require("../bottomSheetGestureHandlersProvider"));

var _bottomSheetBackdropContainer = _interopRequireDefault(require("../bottomSheetBackdropContainer"));

var _bottomSheetHandleContainer = _interopRequireDefault(require("../bottomSheetHandleContainer"));

var _bottomSheetBackgroundContainer = _interopRequireDefault(require("../bottomSheetBackgroundContainer"));

var _BottomSheetFooterContainer = _interopRequireDefault(require("../bottomSheetFooterContainer/BottomSheetFooterContainer"));

var _bottomSheetDraggableView = _interopRequireDefault(require("../bottomSheetDraggableView"));

var _constants = require("../../constants");

var _utilities = require("../../utilities");

var _constants2 = require("./constants");

var _styles = require("./styles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// import BottomSheetDebugView from '../bottomSheetDebugView';
_reactNativeReanimated.default.addWhitelistedUIProps({
  decelerationRate: true
});

const BottomSheetComponent = /*#__PURE__*/(0, _react.forwardRef)(function BottomSheet(props, ref) {
  //#region validate props
  (0, _hooks.usePropsValidator)(props); //#endregion
  //#region extract props

  const {
    // animations configurations
    animationConfigs: _providedAnimationConfigs,
    // configurations
    index: _providedIndex = 0,
    snapPoints: _providedSnapPoints,
    animateOnMount = _constants2.DEFAULT_ANIMATE_ON_MOUNT,
    enableContentPanningGesture = _constants2.DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
    enableHandlePanningGesture = _constants2.DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
    enableOverDrag = _constants2.DEFAULT_ENABLE_OVER_DRAG,
    enablePanDownToClose = _constants2.DEFAULT_ENABLE_PAN_DOWN_TO_CLOSE,
    enableDynamicSizing = _constants2.DEFAULT_DYNAMIC_SIZING,
    overDragResistanceFactor = _constants2.DEFAULT_OVER_DRAG_RESISTANCE_FACTOR,
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
    // layout
    handleHeight: _providedHandleHeight,
    containerHeight: _providedContainerHeight,
    contentHeight: _providedContentHeight,
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
    children: Content
  } = props; //#endregion
  //#region layout variables

  /**
   * This variable is consider an internal variable,
   * that will be used conditionally in `animatedContainerHeight`
   */

  const _animatedContainerHeight = (0, _hooks.useReactiveSharedValue)(_providedContainerHeight !== null && _providedContainerHeight !== void 0 ? _providedContainerHeight : _constants2.INITIAL_CONTAINER_HEIGHT);
  /**
   * This is a conditional variable, where if the `BottomSheet` is used
   * in a modal, then it will subset vertical insets (top+bottom) from
   * provided container height.
   */


  const animatedContainerHeight = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const verticalInset = topInset + bottomInset;
    return $modal ? _animatedContainerHeight.value - verticalInset : _animatedContainerHeight.value;
  }, [$modal, topInset, bottomInset]);
  const animatedContainerOffset = (0, _hooks.useReactiveSharedValue)(_providedContainerOffset !== null && _providedContainerOffset !== void 0 ? _providedContainerOffset : _constants2.INITIAL_CONTAINER_OFFSET);
  const animatedHandleHeight = (0, _hooks.useReactiveSharedValue)(_providedHandleHeight !== null && _providedHandleHeight !== void 0 ? _providedHandleHeight : _constants2.INITIAL_HANDLE_HEIGHT);
  const animatedFooterHeight = (0, _reactNativeReanimated.useSharedValue)(0);
  const animatedContentHeight = (0, _reactNativeReanimated.useSharedValue)(_constants2.INITIAL_CONTAINER_HEIGHT);
  const animatedSnapPoints = (0, _hooks.useNormalizedSnapPoints)(_providedSnapPoints, animatedContainerHeight, animatedContentHeight, animatedHandleHeight, enableDynamicSizing, maxDynamicContentSize);
  const animatedHighestSnapPoint = (0, _reactNativeReanimated.useDerivedValue)(() => animatedSnapPoints.value[animatedSnapPoints.value.length - 1]);
  const animatedClosedPosition = (0, _reactNativeReanimated.useDerivedValue)(() => {
    let closedPosition = animatedContainerHeight.value;

    if ($modal || detached) {
      closedPosition = animatedContainerHeight.value + bottomInset;
    }

    return closedPosition;
  }, [$modal, detached, bottomInset]);
  const animatedSheetHeight = (0, _reactNativeReanimated.useDerivedValue)(() => animatedContainerHeight.value - animatedHighestSnapPoint.value);
  const animatedCurrentIndex = (0, _hooks.useReactiveSharedValue)(animateOnMount ? -1 : _providedIndex);
  const animatedPosition = (0, _reactNativeReanimated.useSharedValue)(_constants2.INITIAL_POSITION);
  const animatedNextPosition = (0, _reactNativeReanimated.useSharedValue)(_constants2.INITIAL_VALUE);
  const animatedNextPositionIndex = (0, _reactNativeReanimated.useSharedValue)(0); // conditional

  const isAnimatedOnMount = (0, _reactNativeReanimated.useSharedValue)(false);
  const isContentHeightFixed = (0, _reactNativeReanimated.useSharedValue)(false);
  const isLayoutCalculated = (0, _reactNativeReanimated.useDerivedValue)(() => {
    let isContainerHeightCalculated = false; //container height was provided.

    if (_providedContainerHeight !== null || _providedContainerHeight !== undefined) {
      isContainerHeightCalculated = true;
    } // container height did set.


    if (animatedContainerHeight.value !== _constants2.INITIAL_CONTAINER_HEIGHT) {
      isContainerHeightCalculated = true;
    }

    let isHandleHeightCalculated = false; // handle height is provided.

    if (_providedHandleHeight !== null && _providedHandleHeight !== undefined && typeof _providedHandleHeight === 'number') {
      isHandleHeightCalculated = true;
    } // handle component is null.


    if (handleComponent === null) {
      animatedHandleHeight.value = 0;
      isHandleHeightCalculated = true;
    } // handle height did set.


    if (animatedHandleHeight.value !== _constants2.INITIAL_HANDLE_HEIGHT) {
      isHandleHeightCalculated = true;
    }

    let isSnapPointsNormalized = false; // the first snap point did normalized

    if (animatedSnapPoints.value[0] !== _constants2.INITIAL_SNAP_POINT) {
      isSnapPointsNormalized = true;
    }

    return isContainerHeightCalculated && isHandleHeightCalculated && isSnapPointsNormalized;
  });
  const isInTemporaryPosition = (0, _reactNativeReanimated.useSharedValue)(false);
  const isForcedClosing = (0, _reactNativeReanimated.useSharedValue)(false); // gesture

  const animatedContentGestureState = (0, _reactNativeReanimated.useSharedValue)(_reactNativeGestureHandler.State.UNDETERMINED);
  const animatedHandleGestureState = (0, _reactNativeReanimated.useSharedValue)(_reactNativeGestureHandler.State.UNDETERMINED); //#endregion
  //#region hooks variables
  // scrollable variables

  const {
    animatedScrollableType,
    animatedScrollableContentOffsetY,
    animatedScrollableOverrideState,
    isScrollableRefreshable,
    setScrollableRef,
    removeScrollableRef
  } = (0, _hooks.useScrollable)(); // keyboard

  const {
    state: animatedKeyboardState,
    height: animatedKeyboardHeight,
    animationDuration: keyboardAnimationDuration,
    animationEasing: keyboardAnimationEasing,
    shouldHandleKeyboardEvents
  } = (0, _hooks.useKeyboard)();
  const animatedKeyboardHeightInContainer = (0, _reactNativeReanimated.useSharedValue)(0); //#endregion
  //#region state/dynamic variables
  // states

  const animatedAnimationState = (0, _reactNativeReanimated.useSharedValue)(_constants.ANIMATION_STATE.UNDETERMINED);
  const animatedAnimationSource = (0, _reactNativeReanimated.useSharedValue)(_constants.ANIMATION_SOURCE.MOUNT);
  const animatedSheetState = (0, _reactNativeReanimated.useDerivedValue)(() => {
    // closed position = position >= container height
    if (animatedPosition.value >= animatedClosedPosition.value) return _constants.SHEET_STATE.CLOSED; // extended position = container height - sheet height

    const extendedPosition = animatedContainerHeight.value - animatedSheetHeight.value;
    if (animatedPosition.value === extendedPosition) return _constants.SHEET_STATE.EXTENDED; // extended position with keyboard =
    // container height - (sheet height + keyboard height in root container)

    const keyboardHeightInContainer = animatedKeyboardHeightInContainer.value;
    const extendedPositionWithKeyboard = Math.max(0, animatedContainerHeight.value - (animatedSheetHeight.value + keyboardHeightInContainer)); // detect if keyboard is open and the sheet is in temporary position

    if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.interactive && isInTemporaryPosition.value && animatedPosition.value === extendedPositionWithKeyboard) {
      return _constants.SHEET_STATE.EXTENDED;
    } // fill parent = 0


    if (animatedPosition.value === 0) {
      return _constants.SHEET_STATE.FILL_PARENT;
    } // detect if position is below extended point


    if (animatedPosition.value < extendedPosition) {
      return _constants.SHEET_STATE.OVER_EXTENDED;
    }

    return _constants.SHEET_STATE.OPENED;
  }, [animatedClosedPosition, animatedContainerHeight, animatedKeyboardHeightInContainer, animatedPosition, animatedSheetHeight, isInTemporaryPosition, keyboardBehavior]);
  const animatedScrollableState = (0, _reactNativeReanimated.useDerivedValue)(() => {
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
  }); // dynamic

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
    const currentIndex = isLayoutCalculated.value ? (0, _reactNativeReanimated.interpolate)(animatedPosition.value, adjustedSnapPoints, adjustedSnapPointsIndexes, _reactNativeReanimated.Extrapolate.CLAMP) : -1;
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
  }, [android_keyboardInputMode]); //#endregion
  //#region private methods

  /**
   * Calculate the next position based on keyboard state.
   */

  const getNextPosition = (0, _reactNativeReanimated.useWorkletCallback)(function getNextPosition() {
    'worklet';

    const currentIndex = animatedCurrentIndex.value;
    const snapPoints = animatedSnapPoints.value;
    const keyboardState = animatedKeyboardState.value;
    const highestSnapPoint = animatedHighestSnapPoint.value;
    /**
     * Handle restore sheet position on blur
     */

    if (keyboardBlurBehavior === _constants.KEYBOARD_BLUR_BEHAVIOR.restore && keyboardState === _constants.KEYBOARD_STATE.HIDDEN && animatedContentGestureState.value !== _reactNativeGestureHandler.State.ACTIVE && animatedHandleGestureState.value !== _reactNativeGestureHandler.State.ACTIVE) {
      isInTemporaryPosition.value = false;
      const nextPosition = snapPoints[currentIndex];
      return nextPosition;
    }
    /**
     * Handle extend behavior
     */


    if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.extend && keyboardState === _constants.KEYBOARD_STATE.SHOWN) {
      return highestSnapPoint;
    }
    /**
     * Handle full screen behavior
     */


    if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.fillParent && keyboardState === _constants.KEYBOARD_STATE.SHOWN) {
      isInTemporaryPosition.value = true;
      return 0;
    }
    /**
     * handle interactive behavior
     */


    if (keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.interactive && keyboardState === _constants.KEYBOARD_STATE.SHOWN) {
      isInTemporaryPosition.value = true;
      const keyboardHeightInContainer = animatedKeyboardHeightInContainer.value;
      return Math.max(0, highestSnapPoint - keyboardHeightInContainer);
    }

    if (isInTemporaryPosition.value) {
      return animatedPosition.value;
    }

    return snapPoints[currentIndex];
  }, [animatedContentGestureState, animatedCurrentIndex, animatedHandleGestureState, animatedHighestSnapPoint, animatedKeyboardHeightInContainer, animatedKeyboardState, animatedPosition, animatedSnapPoints, isInTemporaryPosition, keyboardBehavior, keyboardBlurBehavior]);
  const handleOnChange = (0, _react.useCallback)(function handleOnChange(index) {
    (0, _utilities.print)({
      component: BottomSheet.name,
      method: handleOnChange.name,
      params: {
        index,
        animatedCurrentIndex: animatedCurrentIndex.value
      }
    });

    if (_providedOnChange) {
      _providedOnChange(index);
    }
  }, [_providedOnChange, animatedCurrentIndex]);
  const handleOnAnimate = (0, _react.useCallback)(function handleOnAnimate(toPoint) {
    const snapPoints = animatedSnapPoints.value;
    const toIndex = snapPoints.indexOf(toPoint);
    (0, _utilities.print)({
      component: BottomSheet.name,
      method: handleOnAnimate.name,
      params: {
        toIndex,
        fromIndex: animatedCurrentIndex.value
      }
    });

    if (!_providedOnAnimate) {
      return;
    }

    if (toIndex !== animatedCurrentIndex.value) {
      _providedOnAnimate(animatedCurrentIndex.value, toIndex);
    }
  }, [_providedOnAnimate, animatedSnapPoints, animatedCurrentIndex]); //#endregion
  //#region animation

  const stopAnimation = (0, _reactNativeReanimated.useWorkletCallback)(() => {
    (0, _reactNativeReanimated.cancelAnimation)(animatedPosition);
    isForcedClosing.value = false;
    animatedAnimationSource.value = _constants.ANIMATION_SOURCE.NONE;
    animatedAnimationState.value = _constants.ANIMATION_STATE.STOPPED;
  }, [animatedPosition, animatedAnimationState, animatedAnimationSource]);
  const animateToPositionCompleted = (0, _reactNativeReanimated.useWorkletCallback)(function animateToPositionCompleted(isFinished) {
    isForcedClosing.value = false;

    if (!isFinished) {
      return;
    }

    (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
      component: BottomSheet.name,
      method: animateToPositionCompleted.name,
      params: {
        animatedCurrentIndex: animatedCurrentIndex.value,
        animatedNextPosition: animatedNextPosition.value,
        animatedNextPositionIndex: animatedNextPositionIndex.value
      }
    });
    animatedAnimationSource.value = _constants.ANIMATION_SOURCE.NONE;
    animatedAnimationState.value = _constants.ANIMATION_STATE.STOPPED;
    animatedNextPosition.value = _constants2.INITIAL_VALUE;
    animatedNextPositionIndex.value = _constants2.INITIAL_VALUE;
  });
  const animateToPosition = (0, _reactNativeReanimated.useWorkletCallback)(function animateToPosition(position, source, velocity = 0, configs) {
    if (position === animatedPosition.value || position === undefined || animatedAnimationState.value === _constants.ANIMATION_STATE.RUNNING && position === animatedNextPosition.value) {
      return;
    }

    (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
      component: BottomSheet.name,
      method: animateToPosition.name,
      params: {
        currentPosition: animatedPosition.value,
        position,
        velocity,
        animatedContainerHeight: animatedContainerHeight.value
      }
    });
    stopAnimation();
    /**
     * set animation state to running, and source
     */

    animatedAnimationState.value = _constants.ANIMATION_STATE.RUNNING;
    animatedAnimationSource.value = source;
    /**
     * store next position
     */

    animatedNextPosition.value = position;
    animatedNextPositionIndex.value = animatedSnapPoints.value.indexOf(position);
    /**
     * fire `onAnimate` callback
     */

    (0, _reactNativeReanimated.runOnJS)(handleOnAnimate)(position);
    /**
     * force animation configs from parameters, if provided
     */

    if (configs !== undefined) {
      animatedPosition.value = (0, _utilities.animate)({
        point: position,
        configs,
        velocity,
        onComplete: animateToPositionCompleted
      });
    } else {
      /**
       * use animationConfigs callback, if provided
       */
      animatedPosition.value = (0, _utilities.animate)({
        point: position,
        velocity,
        configs: _providedAnimationConfigs,
        onComplete: animateToPositionCompleted
      });
    }
  }, [handleOnAnimate, _providedAnimationConfigs]); //#endregion
  //#region public methods

  const handleSnapToIndex = (0, _react.useCallback)(function handleSnapToIndex(index, animationConfigs) {
    const snapPoints = animatedSnapPoints.value;
    (0, _invariant.default)(index >= -1 && index <= snapPoints.length - 1, `'index' was provided but out of the provided snap points range! expected value to be between -1, ${snapPoints.length - 1}`);
    (0, _utilities.print)({
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
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(nextPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isLayoutCalculated, isInTemporaryPosition, isForcedClosing, animatedSnapPoints, animatedNextPosition, animatedNextPositionIndex]);
  const handleSnapToPosition = (0, _reactNativeReanimated.useWorkletCallback)(function handleSnapToPosition(position, animationConfigs) {
    (0, _utilities.print)({
      component: BottomSheet.name,
      method: handleSnapToPosition.name,
      params: {
        position
      }
    });
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
  const handleClose = (0, _react.useCallback)(function handleClose(animationConfigs) {
    (0, _utilities.print)({
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
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(nextPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isForcedClosing, isLayoutCalculated, isInTemporaryPosition, animatedNextPosition, animatedClosedPosition]);
  const handleForceClose = (0, _react.useCallback)(function handleForceClose(animationConfigs) {
    (0, _utilities.print)({
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
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(nextPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isForcedClosing, isInTemporaryPosition, animatedNextPosition, animatedClosedPosition]);
  const handleExpand = (0, _react.useCallback)(function handleExpand(animationConfigs) {
    (0, _utilities.print)({
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
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(nextPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isInTemporaryPosition, isLayoutCalculated, isForcedClosing, animatedSnapPoints, animatedNextPosition, animatedNextPositionIndex]);
  const handleCollapse = (0, _react.useCallback)(function handleCollapse(animationConfigs) {
    (0, _utilities.print)({
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
    (0, _reactNativeReanimated.runOnUI)(animateToPosition)(nextPosition, _constants.ANIMATION_SOURCE.USER, 0, animationConfigs);
  }, [animateToPosition, isForcedClosing, isLayoutCalculated, isInTemporaryPosition, animatedSnapPoints, animatedNextPosition, animatedNextPositionIndex]);
  (0, _react.useImperativeHandle)(ref, () => ({
    snapToIndex: handleSnapToIndex,
    snapToPosition: handleSnapToPosition,
    expand: handleExpand,
    collapse: handleCollapse,
    close: handleClose,
    forceClose: handleForceClose
  })); //#endregion
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
    animateToPosition,
    stopAnimation,
    setScrollableRef,
    removeScrollableRef
  }), [animatedIndex, animatedPosition, animatedContentHeight, animatedScrollableType, animatedContentGestureState, animatedHandleGestureState, animatedClosedPosition, animatedFooterHeight, animatedContainerHeight, animatedHandleHeight, animatedAnimationState, animatedKeyboardState, animatedKeyboardHeight, animatedKeyboardHeightInContainer, animatedSheetState, animatedHighestSnapPoint, animatedScrollableState, animatedScrollableOverrideState, animatedSnapPoints, shouldHandleKeyboardEvents, animatedScrollableContentOffsetY, isScrollableRefreshable, isContentHeightFixed, isInTemporaryPosition, enableContentPanningGesture, overDragResistanceFactor, enableOverDrag, enablePanDownToClose, enableDynamicSizing, _providedSimultaneousHandlers, _providedWaitFor, _providedActiveOffsetX, _providedActiveOffsetY, _providedFailOffsetX, _providedFailOffsetY, setScrollableRef, removeScrollableRef, animateToPosition, stopAnimation]);
  const externalContextVariables = (0, _react.useMemo)(() => ({
    animatedIndex,
    animatedPosition,
    snapToIndex: handleSnapToIndex,
    snapToPosition: handleSnapToPosition,
    expand: handleExpand,
    collapse: handleCollapse,
    close: handleClose,
    forceClose: handleForceClose
  }), [animatedIndex, animatedPosition, handleSnapToIndex, handleSnapToPosition, handleExpand, handleCollapse, handleClose, handleForceClose]); //#endregion
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
     * if content height was provided, then we skip setting
     * calculated height.
     */
    if (_providedContentHeight) {
      return {};
    }

    return {
      height: (0, _utilities.animate)({
        point: animatedContentHeightMax.value,
        configs: _providedAnimationConfigs
      })
    };
  }, [animatedContentHeightMax, enableDynamicSizing, animatedContentHeight]);
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
  }, [detached]);
  const contentMaskContainerStyle = (0, _react.useMemo)(() => [_styles.styles.contentMaskContainer, contentMaskContainerAnimatedStyle], [contentMaskContainerAnimatedStyle]); //#endregion
  //#region effects

  /**
   * React to `isLayoutCalculated` change, to insure that the sheet will
   * appears/mounts only when all layout is been calculated.
   *
   * @alias OnMount
   */

  (0, _reactNativeReanimated.useAnimatedReaction)(() => isLayoutCalculated.value, _isLayoutCalculated => {
    /**
     * exit method if:
     * - layout is not calculated yet.
     * - already did animate on mount.
     */
    if (!_isLayoutCalculated || isAnimatedOnMount.value) {
      return;
    }

    let nextPosition;

    if (_providedIndex === -1) {
      nextPosition = animatedClosedPosition.value;
      animatedNextPositionIndex.value = -1;
    } else {
      nextPosition = animatedSnapPoints.value[_providedIndex];
    }

    (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
      component: BottomSheet.name,
      method: 'useAnimatedReaction::OnMount',
      params: {
        isLayoutCalculated: _isLayoutCalculated,
        animatedSnapPoints: animatedSnapPoints.value,
        nextPosition
      }
    });
    /**
     * here we exit method early because the next position
     * is out of the screen, this happens when `snapPoints`
     * still being calculated.
     */

    if (nextPosition === _constants2.INITIAL_POSITION || nextPosition === animatedClosedPosition.value) {
      isAnimatedOnMount.value = true;
      animatedCurrentIndex.value = _providedIndex;
      return;
    }

    if (animateOnMount) {
      animateToPosition(nextPosition, _constants.ANIMATION_SOURCE.MOUNT);
    } else {
      animatedPosition.value = nextPosition;
    }

    isAnimatedOnMount.value = true;
  }, [_providedIndex, animateOnMount]);
  /**
   * React to `snapPoints` change, to insure that the sheet position reflect
   * to the current point correctly.
   *
   * @alias OnSnapPointsChange
   */

  (0, _reactNativeReanimated.useAnimatedReaction)(() => ({
    snapPoints: animatedSnapPoints.value,
    containerHeight: animatedContainerHeight.value
  }), (result, _previousResult) => {
    const {
      snapPoints,
      containerHeight
    } = result;

    const _previousSnapPoints = _previousResult === null || _previousResult === void 0 ? void 0 : _previousResult.snapPoints;

    const _previousContainerHeight = _previousResult === null || _previousResult === void 0 ? void 0 : _previousResult.containerHeight;

    let nextPosition;
    let animationConfig;
    let animationSource = _constants.ANIMATION_SOURCE.SNAP_POINT_CHANGE;
    /**
     * if the bottom sheet is closing and the container gets resized,
     * then we restart the closing animation to the new position.
     */

    if (animatedAnimationState.value === _constants.ANIMATION_STATE.RUNNING && animatedNextPositionIndex.value === -1 && _previousContainerHeight !== containerHeight) {
      animationSource = _constants.ANIMATION_SOURCE.CONTAINER_RESIZE;
      animationConfig = {
        duration: 0
      };
      animateToPosition(containerHeight, animationSource, 0, animationConfig);
    }

    if (JSON.stringify(snapPoints) === JSON.stringify(_previousSnapPoints) || !isLayoutCalculated.value || !isAnimatedOnMount.value || containerHeight <= 0) {
      return;
    }

    (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
      component: BottomSheet.name,
      method: 'useAnimatedReaction::OnSnapPointChange',
      params: {
        snapPoints
      }
    });
    /**
     * if snap points changed while sheet is animating, then
     * we stop the animation and animate to the updated point.
     */

    if (animatedAnimationState.value === _constants.ANIMATION_STATE.RUNNING && animatedNextPositionIndex.value !== animatedCurrentIndex.value) {
      nextPosition = animatedNextPositionIndex.value !== -1 ? snapPoints[animatedNextPositionIndex.value] : animatedNextPosition.value;
    } else if (animatedCurrentIndex.value === -1) {
      nextPosition = animatedClosedPosition.value;
    } else if (isInTemporaryPosition.value) {
      nextPosition = getNextPosition();
    } else {
      nextPosition = snapPoints[animatedCurrentIndex.value];
      /**
       * if snap points changes because of the container height change,
       * then we skip the snap animation by setting the duration to 0.
       */

      if (containerHeight !== _previousContainerHeight) {
        animationSource = _constants.ANIMATION_SOURCE.CONTAINER_RESIZE;
        animationConfig = {
          duration: 0
        };
      }
    }

    animateToPosition(nextPosition, animationSource, 0, animationConfig);
  });
  /**
   * React to keyboard appearance state.
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

    const _previousKeyboardState = _previousResult === null || _previousResult === void 0 ? void 0 : _previousResult._keyboardState;

    const _previousKeyboardHeight = _previousResult === null || _previousResult === void 0 ? void 0 : _previousResult._keyboardHeight;
    /**
     * Calculate the keyboard height in the container.
     */


    animatedKeyboardHeightInContainer.value = $modal ? Math.abs(_keyboardHeight - Math.abs(bottomInset - animatedContainerOffset.value.bottom)) : Math.abs(_keyboardHeight - animatedContainerOffset.value.bottom);
    const hasActiveGesture = animatedContentGestureState.value === _reactNativeGestureHandler.State.ACTIVE || animatedContentGestureState.value === _reactNativeGestureHandler.State.BEGAN || animatedHandleGestureState.value === _reactNativeGestureHandler.State.ACTIVE || animatedHandleGestureState.value === _reactNativeGestureHandler.State.BEGAN;

    if (
    /**
     * if keyboard state is equal to the previous state, then exit the method
     */
    _keyboardState === _previousKeyboardState && _keyboardHeight === _previousKeyboardHeight ||
    /**
     * if user is interacting with sheet, then exit the method
     */
    hasActiveGesture ||
    /**
     * if sheet not animated on mount yet, then exit the method
     */
    !isAnimatedOnMount.value || _keyboardState === _constants.KEYBOARD_STATE.HIDDEN && keyboardBlurBehavior === _constants.KEYBOARD_BLUR_BEHAVIOR.none || _reactNative.Platform.OS === 'android' && keyboardBehavior === _constants.KEYBOARD_BEHAVIOR.interactive && android_keyboardInputMode === _constants.KEYBOARD_INPUT_MODE.adjustResize) {
      animatedKeyboardHeightInContainer.value = 0;
      return;
    }

    (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
      component: BottomSheet.name,
      method: 'useAnimatedReaction::OnKeyboardStateChange',
      params: {
        keyboardState: _keyboardState,
        keyboardHeight: _keyboardHeight
      }
    });
    let animationConfigs = (0, _utilities.getKeyboardAnimationConfigs)(keyboardAnimationEasing.value, keyboardAnimationDuration.value);
    const nextPosition = getNextPosition();
    animateToPosition(nextPosition, _constants.ANIMATION_SOURCE.KEYBOARD, 0, animationConfigs);
  }, [$modal, bottomInset, keyboardBehavior, keyboardBlurBehavior, android_keyboardInputMode, animatedContainerOffset, getNextPosition]);
  /**
   * sets provided animated position
   */

  (0, _reactNativeReanimated.useAnimatedReaction)(() => animatedPosition.value, _animatedPosition => {
    if (_providedAnimatedPosition) {
      _providedAnimatedPosition.value = _animatedPosition + topInset;
    }
  });
  /**
   * sets provided animated index
   */

  (0, _reactNativeReanimated.useAnimatedReaction)(() => animatedIndex.value, _animatedIndex => {
    if (_providedAnimatedIndex) {
      _providedAnimatedIndex.value = _animatedIndex;
    }
  });
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
     * if the index is not equal to the current index,
     * than the sheet position had changed and we trigger
     * the `onChange` callback.
     */


    if (_animatedIndex !== animatedCurrentIndex.value) {
      (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
        component: BottomSheet.name,
        method: 'useAnimatedReaction::OnChange',
        params: {
          animatedCurrentIndex: animatedCurrentIndex.value,
          animatedIndex: _animatedIndex
        }
      });
      animatedCurrentIndex.value = _animatedIndex;
      (0, _reactNativeReanimated.runOnJS)(handleOnChange)(_animatedIndex);
    }
    /**
     * if index is `-1` than we fire the `onClose` callback.
     */


    if (_animatedIndex === -1 && _providedOnClose) {
      (0, _reactNativeReanimated.runOnJS)(_utilities.print)({
        component: BottomSheet.name,
        method: 'useAnimatedReaction::onClose',
        params: {
          animatedCurrentIndex: animatedCurrentIndex.value,
          animatedIndex: _animatedIndex
        }
      });
      (0, _reactNativeReanimated.runOnJS)(_providedOnClose)();
    }
  }, [handleOnChange, _providedOnClose]);
  /**
   * React to `index` prop to snap the sheet to the new position.
   *
   * @alias onIndexChange
   */

  (0, _react.useEffect)(() => {
    if (isAnimatedOnMount.value) {
      handleSnapToIndex(_providedIndex);
    }
  }, [_providedIndex, animatedCurrentIndex, isAnimatedOnMount, handleSnapToIndex]); //#endregion
  // render

  (0, _utilities.print)({
    component: BottomSheet.name,
    method: 'render',
    params: {
      animatedSnapPoints: animatedSnapPoints.value,
      animatedCurrentIndex: animatedCurrentIndex.value,
      providedIndex: _providedIndex
    }
  });
  return /*#__PURE__*/_react.default.createElement(_contexts.BottomSheetProvider, {
    value: externalContextVariables
  }, /*#__PURE__*/_react.default.createElement(_contexts.BottomSheetInternalProvider, {
    value: internalContextVariables
  }, /*#__PURE__*/_react.default.createElement(_bottomSheetGestureHandlersProvider.default, {
    gestureEventsHandlersHook: gestureEventsHandlersHook
  }, /*#__PURE__*/_react.default.createElement(_bottomSheetBackdropContainer.default, {
    key: "BottomSheetBackdropContainer",
    animatedIndex: animatedIndex,
    animatedPosition: animatedPosition,
    backdropComponent: backdropComponent
  }), /*#__PURE__*/_react.default.createElement(_bottomSheetContainer.default, {
    key: "BottomSheetContainer",
    shouldCalculateHeight: !$modal,
    containerHeight: _animatedContainerHeight,
    containerOffset: animatedContainerOffset,
    topInset: topInset,
    bottomInset: bottomInset,
    detached: detached,
    style: _providedContainerStyle
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: containerStyle
  }, /*#__PURE__*/_react.default.createElement(_bottomSheetBackgroundContainer.default, {
    key: "BottomSheetBackgroundContainer",
    animatedIndex: animatedIndex,
    animatedPosition: animatedPosition,
    backgroundComponent: backgroundComponent,
    backgroundStyle: _providedBackgroundStyle
  }), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    pointerEvents: "box-none",
    style: contentMaskContainerStyle
  }, /*#__PURE__*/_react.default.createElement(_bottomSheetDraggableView.default, {
    key: "BottomSheetRootDraggableView",
    style: contentContainerStyle
  }, typeof Content === 'function' ? /*#__PURE__*/_react.default.createElement(Content, null) : Content, footerComponent && /*#__PURE__*/_react.default.createElement(_BottomSheetFooterContainer.default, {
    footerComponent: footerComponent
  }))), /*#__PURE__*/_react.default.createElement(_bottomSheetHandleContainer.default, {
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
const BottomSheet = /*#__PURE__*/(0, _react.memo)(BottomSheetComponent);
BottomSheet.displayName = 'BottomSheet';
var _default = BottomSheet;
exports.default = _default;
//# sourceMappingURL=BottomSheet.js.map