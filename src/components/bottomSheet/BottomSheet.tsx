import React, {
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
  memo,
} from 'react';
import { Keyboard, Platform } from 'react-native';
import invariant from 'invariant';
import Animated, {
  useAnimatedReaction,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  runOnJS,
  interpolate,
  Extrapolate,
  runOnUI,
  cancelAnimation,
  useWorkletCallback,
} from 'react-native-reanimated';
import { State } from 'react-native-gesture-handler';
import {
  useInteractivePanGestureHandler,
  useScrollable,
  usePropsValidator,
  useReactiveSharedValue,
  useNormalizedSnapPoints,
  useKeyboard,
} from '../../hooks';
import {
  BottomSheetInternalProvider,
  BottomSheetProvider,
} from '../../contexts';
import BottomSheetContainer from '../bottomSheetContainer';
import BottomSheetBackdropContainer from '../bottomSheetBackdropContainer';
import BottomSheetHandleContainer from '../bottomSheetHandleContainer';
import BottomSheetBackgroundContainer from '../bottomSheetBackgroundContainer';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
// import BottomSheetDebugView from '../bottomSheetDebugView';
import {
  GESTURE_SOURCE,
  ANIMATION_STATE,
  KEYBOARD_STATE,
  KEYBOARD_BEHAVIOR,
  SHEET_STATE,
  SCROLLABLE_STATE,
  KEYBOARD_BLUR_BEHAVIOR,
  KEYBOARD_INPUT_MODE,
} from '../../constants';
import {
  animate,
  getKeyboardAnimationConfigs,
  normalizeSnapPoint,
  print,
} from '../../utilities';
import {
  DEFAULT_OVER_DRAG_RESISTANCE_FACTOR,
  DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
  DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
  DEFAULT_ENABLE_OVER_DRAG,
  DEFAULT_ENABLE_FLASH_SCROLLABLE_INDICATOR_ON_EXPAND,
  DEFAULT_ANIMATE_ON_MOUNT,
  DEFAULT_KEYBOARD_BEHAVIOR,
  DEFAULT_KEYBOARD_BLUR_BEHAVIOR,
  INITIAL_CONTAINER_HEIGHT,
  INITIAL_HANDLE_HEIGHT,
  INITIAL_POSITION,
  INITIAL_SNAP_POINT,
  DEFAULT_ENABLE_PAN_DOWN_TO_CLOSE,
  INITIAL_CONTAINER_OFFSET,
  DEFAULT_ANIMATION_CONFIGS,
  DEFAULT_KEYBOARD_INPUT_MODE,
} from './constants';
import { ScrollableRef, BottomSheetMethods, Insets } from '../../types';
import type { BottomSheetProps } from './types';
import { styles } from './styles';

Animated.addWhitelistedUIProps({
  decelerationRate: true,
});

type BottomSheet = BottomSheetMethods;

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetProps>(
  function BottomSheet(props, ref) {
    //#region validate props
    usePropsValidator(props);
    //#endregion

    //#region extract props
    const {
      // animations configurations
      animationConfigs: _providedAnimationConfigs = DEFAULT_ANIMATION_CONFIGS,

      // configurations
      index: _providedIndex = 0,
      snapPoints: _providedSnapPoints,
      animateOnMount = DEFAULT_ANIMATE_ON_MOUNT,
      enableContentPanningGesture = DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
      enableHandlePanningGesture = DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
      enableOverDrag = DEFAULT_ENABLE_OVER_DRAG,
      enableFlashScrollableIndicatorOnExpand = DEFAULT_ENABLE_FLASH_SCROLLABLE_INDICATOR_ON_EXPAND,
      enablePanDownToClose = DEFAULT_ENABLE_PAN_DOWN_TO_CLOSE,
      overDragResistanceFactor = DEFAULT_OVER_DRAG_RESISTANCE_FACTOR,
      style: _providedStyle,

      // keyboard
      keyboardBehavior = DEFAULT_KEYBOARD_BEHAVIOR,
      keyboardBlurBehavior = DEFAULT_KEYBOARD_BLUR_BEHAVIOR,
      android_keyboardInputMode = DEFAULT_KEYBOARD_INPUT_MODE,

      // layout
      handleHeight: _providedHandleHeight,
      containerHeight: _providedContainerHeight,
      contentHeight: _providedContentHeight,
      containerOffset: _providedContainerOffset,
      topInset = 0,
      bottomInset = 0,

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
      onAnimate: _providedOnAnimate,

      // private
      $modal = false,
      detached = false,

      // components
      handleComponent,
      backdropComponent,
      backgroundComponent,
      children,
    } = props;
    //#endregion

    //#region layout variables
    /**
     * This variable is consider an internal variable,
     * that will be used conditionally in `animatedContainerHeight`
     */
    const _animatedContainerHeight = useReactiveSharedValue(
      _providedContainerHeight ?? INITIAL_CONTAINER_HEIGHT
    );
    /**
     * This is a conditional variable, where if the `BottomSheet` is used
     * in a modal, then it will subset vertical insets (top+bottom) from
     * provided container height.
     */
    const animatedContainerHeight = useDerivedValue(() => {
      const verticalInset = topInset + bottomInset;
      return $modal
        ? _animatedContainerHeight.value - verticalInset
        : _animatedContainerHeight.value;
    }, [$modal, topInset, bottomInset]);
    const animatedContainerOffset = useReactiveSharedValue(
      _providedContainerOffset ?? INITIAL_CONTAINER_OFFSET
    ) as Animated.SharedValue<Insets>;
    const animatedHandleHeight = useReactiveSharedValue(
      _providedHandleHeight ?? INITIAL_HANDLE_HEIGHT
    );
    const animatedFooterHeight = useSharedValue(0);
    const animatedSnapPoints = useNormalizedSnapPoints(
      _providedSnapPoints,
      animatedContainerHeight,
      topInset,
      bottomInset,
      $modal
    );
    const animatedHighestSnapPoint = useDerivedValue(
      () => animatedSnapPoints.value[animatedSnapPoints.value.length - 1]
    );
    const animatedClosedPosition = useDerivedValue(() => {
      let closedPosition = animatedContainerHeight.value;

      if ($modal) {
        closedPosition = animatedContainerHeight.value + bottomInset;
      }

      return closedPosition;
    }, [$modal, bottomInset]);
    const animatedSheetHeight = useDerivedValue(
      () => animatedContainerHeight.value - animatedHighestSnapPoint.value
    );
    const animatedCurrentIndex = useReactiveSharedValue(
      animateOnMount ? -1 : _providedIndex
    );
    const animatedPosition = useSharedValue(INITIAL_POSITION);
    const animatedNextPosition = useSharedValue(0);
    const animatedNextPositionIndex = useSharedValue(0);
    //#endregion

    //#region conditional variables
    const isContentHeightFixed = useSharedValue(false);
    const isLayoutCalculated = useDerivedValue(() => {
      let isContainerHeightCalculated = false;
      //container height was provided.
      if (
        _providedContainerHeight !== null ||
        _providedContainerHeight !== undefined
      ) {
        isContainerHeightCalculated = true;
      }
      // container height did set.
      if (animatedContainerHeight.value !== INITIAL_CONTAINER_HEIGHT) {
        isContainerHeightCalculated = true;
      }

      let isHandleHeightCalculated = false;
      // handle height is provided.
      if (
        _providedHandleHeight !== null &&
        _providedHandleHeight !== undefined &&
        typeof _providedHandleHeight === 'number'
      ) {
        isHandleHeightCalculated = true;
      }
      // handle component is null.
      if (handleComponent === null) {
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

      return (
        isContainerHeightCalculated &&
        isHandleHeightCalculated &&
        isSnapPointsNormalized
      );
    });
    const isInTemporaryPosition = useSharedValue(false);
    //#endregion

    //#region hooks variables
    // scrollable variables
    const {
      scrollableType: animatedScrollableType,
      scrollableContentOffsetY,
      isScrollableRefreshable,
      setScrollableRef,
      removeScrollableRef,
      flashScrollableIndicators,
    } = useScrollable();
    // keyboard
    const {
      state: animatedKeyboardState,
      height: animatedKeyboardHeight,
      animationDuration: keyboardAnimationDuration,
      animationEasing: keyboardAnimationEasing,
      shouldHandleKeyboardEvents,
    } = useKeyboard();
    /**
     * Returns keyboard height that in the root container.
     */
    const getKeyboardHeightInContainer = useWorkletCallback(() => {
      'worklet';
      /**
       * if android software input mode is not `adjustPan`, than keyboard
       * height will be 0 all the time.
       */
      if (android_keyboardInputMode === KEYBOARD_INPUT_MODE.adjustResize) {
        return 0;
      }
      return $modal
        ? animatedKeyboardHeight.value -
            Math.abs(bottomInset - animatedContainerOffset.value.bottom)
        : animatedKeyboardHeight.value - animatedContainerOffset.value.bottom;
    }, [$modal, bottomInset]);
    //#endregion

    //#region state/dynamic variables
    // states
    const isAnimatedOnMount = useSharedValue(false);
    const animatedAnimationState = useSharedValue(ANIMATION_STATE.UNDETERMINED);
    const animatedSheetState = useDerivedValue(() => {
      // closed position = position >= container height
      if (animatedPosition.value >= animatedClosedPosition.value)
        return SHEET_STATE.CLOSED;

      // extended position = container height - sheet height
      const extendedPosition =
        animatedContainerHeight.value - animatedSheetHeight.value;
      if (animatedPosition.value === extendedPosition)
        return SHEET_STATE.EXTENDED;

      // extended position with keyboard =
      // container height - (sheet height + keyboard height in root container)
      const keyboardHeightInContainer = getKeyboardHeightInContainer();
      const extendedPositionWithKeyboard = Math.max(
        0,
        animatedContainerHeight.value -
          (animatedSheetHeight.value + keyboardHeightInContainer)
      );

      // detect if keyboard is open and the sheet is in temporary position
      if (
        keyboardBehavior === KEYBOARD_BEHAVIOR.interactive &&
        isInTemporaryPosition.value &&
        animatedPosition.value === extendedPositionWithKeyboard
      ) {
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
    });
    const animatedScrollableState = useDerivedValue(() => {
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
      if (
        animatedKeyboardState.value === KEYBOARD_STATE.SHOWN &&
        animatedAnimationState.value === ANIMATION_STATE.RUNNING
      ) {
        return SCROLLABLE_STATE.UNLOCKED;
      }

      return SCROLLABLE_STATE.LOCKED;
    });
    // dynamic
    const animatedContentHeight = useDerivedValue(() => {
      const contentHeight =
        animatedSheetHeight.value - animatedHandleHeight.value;

      /**
       * before the container is measured, `contentHeight` value will be below zero,
       * which will lead to freeze the scrollable on Android.
       *
       * @link (https://github.com/gorhom/react-native-bottom-sheet/issues/470)
       */
      if (contentHeight <= 0) {
        return 0;
      }
      const keyboardHeightInContainer = getKeyboardHeightInContainer();

      if (
        (keyboardBehavior === KEYBOARD_BEHAVIOR.none ||
          keyboardBehavior === KEYBOARD_BEHAVIOR.extend) &&
        animatedKeyboardState.value === KEYBOARD_STATE.SHOWN
      ) {
        return contentHeight - keyboardHeightInContainer;
      }

      if (
        keyboardBehavior === KEYBOARD_BEHAVIOR.fillParent &&
        isInTemporaryPosition.value
      ) {
        if (animatedKeyboardState.value === KEYBOARD_STATE.SHOWN) {
          return (
            animatedContainerHeight.value -
            animatedHandleHeight.value -
            keyboardHeightInContainer
          );
        }
        return animatedContainerHeight.value - animatedHandleHeight.value;
      }

      if (
        keyboardBehavior === KEYBOARD_BEHAVIOR.interactive &&
        isInTemporaryPosition.value
      ) {
        if (animatedKeyboardState.value === KEYBOARD_STATE.SHOWN) {
          if (
            keyboardHeightInContainer + animatedSheetHeight.value >
            animatedContainerHeight.value
          ) {
            return (
              animatedContainerHeight.value -
              keyboardHeightInContainer -
              animatedHandleHeight.value
            );
          }

          return contentHeight;
        }

        const contentWithKeyboardHeight =
          contentHeight + keyboardHeightInContainer;

        if (
          contentWithKeyboardHeight + animatedHandleHeight.value >
          animatedContainerHeight.value
        ) {
          return animatedContainerHeight.value - animatedHandleHeight.value;
        }

        return contentWithKeyboardHeight;
      }

      return contentHeight;
    });
    const animatedIndex = useDerivedValue(() => {
      const adjustedSnapPoints = animatedSnapPoints.value.slice().reverse();
      const adjustedSnapPointsIndexes = animatedSnapPoints.value
        .slice()
        .map((_: any, index: number) => index)
        .reverse();

      /**
       * we add the close state index `-1`
       */
      adjustedSnapPoints.push(animatedContainerHeight.value);
      adjustedSnapPointsIndexes.push(-1);

      return isLayoutCalculated.value
        ? interpolate(
            animatedPosition.value,
            adjustedSnapPoints,
            adjustedSnapPointsIndexes,
            Extrapolate.CLAMP
          )
        : -1;
    });
    const isSheetClosing = useDerivedValue(
      () =>
        animatedNextPosition.value === animatedClosedPosition.value &&
        animatedAnimationState.value === ANIMATION_STATE.RUNNING
    );
    //#endregion

    //#region private methods
    /**
     * Calculate the next position based on keyboard state.
     */
    const getNextPosition = useWorkletCallback(() => {
      'worklet';
      const currentIndex = animatedCurrentIndex.value;
      const snapPoints = animatedSnapPoints.value;
      const keyboardState = animatedKeyboardState.value;

      /**
       * Handle restore sheet position on blur
       */
      if (
        keyboardBlurBehavior === KEYBOARD_BLUR_BEHAVIOR.restore &&
        keyboardState === KEYBOARD_STATE.HIDDEN &&
        contentPanGestureState.value !== State.ACTIVE &&
        handlePanGestureState.value !== State.ACTIVE
      ) {
        isInTemporaryPosition.value = false;
        const nextPosition = snapPoints[currentIndex];
        return nextPosition;
      }

      /**
       * Handle extend behavior
       */
      if (
        keyboardBehavior === KEYBOARD_BEHAVIOR.extend &&
        keyboardState === KEYBOARD_STATE.SHOWN
      ) {
        const nextPosition = snapPoints[snapPoints.length - 1];
        return nextPosition;
      }

      /**
       * Handle full screen behavior
       */
      if (
        keyboardBehavior === KEYBOARD_BEHAVIOR.fillParent &&
        keyboardState === KEYBOARD_STATE.SHOWN
      ) {
        isInTemporaryPosition.value = true;
        return 0;
      }

      /**
       * handle interactive behavior
       */
      if (
        keyboardBehavior === KEYBOARD_BEHAVIOR.interactive &&
        keyboardState === KEYBOARD_STATE.SHOWN
      ) {
        isInTemporaryPosition.value = true;
        const nextPosition = snapPoints[snapPoints.length - 1];
        const keyboardHeightInContainer = getKeyboardHeightInContainer();
        return Math.max(0, nextPosition - keyboardHeightInContainer);
      }

      return snapPoints[currentIndex];
    }, [keyboardBehavior, keyboardBlurBehavior]);
    const refreshUIElements = useCallback(() => {
      const currentPositionIndex = Math.max(animatedCurrentIndex.value, 0);
      const snapPoints = animatedSnapPoints.value;

      if (
        enableFlashScrollableIndicatorOnExpand &&
        currentPositionIndex === snapPoints.length - 1
      ) {
        flashScrollableIndicators();
      }
    }, [
      animatedSnapPoints,
      animatedCurrentIndex,
      enableFlashScrollableIndicatorOnExpand,
      flashScrollableIndicators,
    ]);
    const handleOnChange = useCallback(
      function handleOnChange(index: number) {
        print({
          component: BottomSheet.name,
          method: handleOnChange.name,
          params: {
            index,
            animatedCurrentIndex: animatedCurrentIndex.value,
          },
        });

        if (
          Platform.OS === 'android' &&
          isInTemporaryPosition.value === false &&
          animatedKeyboardState.value === KEYBOARD_STATE.SHOWN
        ) {
          Keyboard.dismiss();
        }

        if (_providedOnChange) {
          _providedOnChange(index);
        }
      },
      [
        _providedOnChange,
        animatedCurrentIndex,
        animatedKeyboardState,
        isInTemporaryPosition,
      ]
    );
    const handleOnAnimate = useCallback(
      (toPoint: number) => {
        if (!_providedOnAnimate) {
          return;
        }
        const snapPoints = animatedSnapPoints.value;
        const toIndex = snapPoints.indexOf(toPoint);
        if (toIndex !== animatedCurrentIndex.value) {
          _providedOnAnimate(animatedCurrentIndex.value, toIndex);
        }
      },
      [_providedOnAnimate, animatedSnapPoints, animatedCurrentIndex]
    );
    const handleSettingScrollableRef = useCallback(
      (scrollableRef: ScrollableRef) => {
        setScrollableRef(scrollableRef);
        refreshUIElements();
      },
      [setScrollableRef, refreshUIElements]
    );
    const animateToPositionCompleted = useWorkletCallback(() => {
      animatedAnimationState.value = ANIMATION_STATE.STOPPED;
    });
    const animateToPosition = useWorkletCallback(
      function animateToPosition(
        position: number,
        velocity: number = 0,
        configs?: Animated.WithTimingConfig | Animated.WithSpringConfig
      ) {
        if (position === animatedPosition.value || position === undefined) {
          return;
        }

        runOnJS(print)({
          component: BottomSheet.name,
          method: animateToPosition.name,
          params: {
            currentPosition: animatedPosition.value,
            position,
            velocity,
          },
        });
        /**
         * cancel current running animation
         */
        cancelAnimation(animatedPosition);

        /**
         * store next position
         */
        animatedNextPosition.value = position;
        animatedNextPositionIndex.value =
          animatedSnapPoints.value.indexOf(position);

        /**
         * set animation state to running
         */
        animatedAnimationState.value = ANIMATION_STATE.RUNNING;

        /**
         * fire `onAnimate` callback
         */
        runOnJS(handleOnAnimate)(position);

        /**
         * force animation configs from parameters, if provided
         */
        if (configs !== undefined) {
          animatedPosition.value = animate(
            position,
            configs,
            velocity,
            animateToPositionCompleted
          );
        } else if (_providedAnimationConfigs) {
          /**
           * use animationConfigs callback, if provided
           */
          animatedPosition.value = animate(
            position,
            _providedAnimationConfigs,
            velocity,
            animateToPositionCompleted
          );
        } else {
          /**
           * fallback to default animation configs
           */
          animatedPosition.value = animate(
            position,
            DEFAULT_ANIMATION_CONFIGS,
            velocity,
            animateToPositionCompleted
          );
        }
      },
      [handleOnAnimate, _providedAnimationConfigs]
    );
    //#endregion

    //#region gesture interaction hooks
    const [contentPanGestureHandler, contentPanGestureState] =
      useInteractivePanGestureHandler({
        type: GESTURE_SOURCE.SCROLLABLE,
        enableOverDrag,
        enablePanDownToClose,
        overDragResistanceFactor,
        animatedScrollableType,
        animatedKeyboardState,
        animatedKeyboardHeight,
        animatedPosition,
        animatedSnapPoints,
        animatedClosedPosition,
        animatedContainerHeight,
        isInTemporaryPosition,
        isScrollableRefreshable,
        scrollableContentOffsetY,
        animateToPoint: animateToPosition,
      });
    const [handlePanGestureHandler, handlePanGestureState] =
      useInteractivePanGestureHandler({
        type: GESTURE_SOURCE.HANDLE,
        enableOverDrag,
        enablePanDownToClose,
        overDragResistanceFactor,
        animatedScrollableType,
        animatedKeyboardState,
        animatedKeyboardHeight,
        animatedPosition,
        animatedSnapPoints,
        animatedClosedPosition,
        animatedContainerHeight,
        isInTemporaryPosition,
        isScrollableRefreshable,
        scrollableContentOffsetY,
        animateToPoint: animateToPosition,
      });
    //#endregion

    //#region public methods
    const handleSnapToIndex = useCallback(
      function handleSnapToIndex(
        index: number,
        animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
      ) {
        const snapPoints = animatedSnapPoints.value;
        invariant(
          index >= -1 && index <= snapPoints.length - 1,
          `'index' was provided but out of the provided snap points range! expected value to be between -1, ${
            snapPoints.length - 1
          }`
        );
        print({
          component: BottomSheet.name,
          method: handleSnapToIndex.name,
          params: {
            index,
          },
        });

        const nextPosition = snapPoints[index];

        /**
         * exit method if :
         * - already animating to next position.
         * - sheet is closing.
         */
        if (
          index === animatedNextPositionIndex.value ||
          nextPosition === animatedNextPosition.value ||
          isSheetClosing.value
        ) {
          return;
        }

        /**
         * reset temporary position boolean.
         */
        isInTemporaryPosition.value = false;

        runOnUI(animateToPosition)(nextPosition, 0, animationConfigs);
      },
      [
        animateToPosition,
        isInTemporaryPosition,
        isSheetClosing,
        animatedSnapPoints,
        animatedNextPosition,
        animatedNextPositionIndex,
      ]
    );
    const handleSnapToPosition = useWorkletCallback(
      function handleSnapToPosition(
        position: number | string,
        animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
      ) {
        print({
          component: BottomSheet.name,
          method: handleSnapToPosition.name,
          params: {
            position,
          },
        });

        /**
         * normalized provided position.
         */
        const nextPosition = normalizeSnapPoint(
          position,
          animatedContainerHeight.value,
          topInset,
          bottomInset
        );

        /**
         * exit method if :
         * - already animating to next position.
         * - sheet is closing.
         */
        if (
          nextPosition === animatedNextPosition.value ||
          isSheetClosing.value
        ) {
          return;
        }

        /**
         * mark the new position as temporary.
         */
        isInTemporaryPosition.value = true;

        runOnUI(animateToPosition)(nextPosition, 0, animationConfigs);
      },
      [
        animateToPosition,
        bottomInset,
        topInset,
        isSheetClosing,
        animatedContainerHeight,
        animatedPosition,
      ]
    );
    const handleClose = useCallback(
      function handleClose(
        animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
      ) {
        print({
          component: BottomSheet.name,
          method: handleClose.name,
        });

        const nextPosition = animatedClosedPosition.value;

        /**
         * exit method if :
         * - already animating to next position.
         * - sheet is closing.
         */
        if (
          nextPosition === animatedNextPosition.value ||
          isSheetClosing.value
        ) {
          return;
        }

        /**
         * reset temporary position boolean.
         */
        isInTemporaryPosition.value = false;

        runOnUI(animateToPosition)(nextPosition, 0, animationConfigs);
      },
      [
        animateToPosition,
        isSheetClosing,
        isInTemporaryPosition,
        animatedNextPosition,
        animatedClosedPosition,
      ]
    );
    const handleExpand = useCallback(
      function handleExpand(
        animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
      ) {
        print({
          component: BottomSheet.name,
          method: handleExpand.name,
        });

        const snapPoints = animatedSnapPoints.value;
        const nextPosition = snapPoints[snapPoints.length - 1];

        /**
         * exit method if :
         * - already animating to next position.
         * - sheet is closing.
         */
        if (
          snapPoints.length - 1 === animatedNextPositionIndex.value ||
          nextPosition === animatedNextPosition.value ||
          isSheetClosing.value
        ) {
          return;
        }

        /**
         * reset temporary position boolean.
         */
        isInTemporaryPosition.value = false;

        runOnUI(animateToPosition)(nextPosition, 0, animationConfigs);
      },
      [
        animateToPosition,
        isInTemporaryPosition,
        isSheetClosing,
        animatedSnapPoints,
        animatedNextPosition,
        animatedNextPositionIndex,
      ]
    );
    const handleCollapse = useCallback(
      function handleCollapse(
        animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
      ) {
        print({
          component: BottomSheet.name,
          method: handleCollapse.name,
        });

        const nextPosition = animatedSnapPoints.value[0];

        /**
         * exit method if :
         * - already animating to next position.
         * - sheet is closing.
         */
        if (
          animatedNextPositionIndex.value === 0 ||
          nextPosition === animatedNextPosition.value ||
          isSheetClosing.value
        ) {
          return;
        }

        /**
         * reset temporary position boolean.
         */
        isInTemporaryPosition.value = false;

        runOnUI(animateToPosition)(nextPosition, 0, animationConfigs);
      },
      [
        animateToPosition,
        isSheetClosing,
        isInTemporaryPosition,
        animatedSnapPoints,
        animatedNextPosition,
        animatedNextPositionIndex,
      ]
    );

    useImperativeHandle(ref, () => ({
      snapToIndex: handleSnapToIndex,
      snapToPosition: handleSnapToPosition,
      expand: handleExpand,
      collapse: handleCollapse,
      close: handleClose,
    }));
    //#endregion

    //#region contexts variables
    const internalContextVariables = useMemo(
      () => ({
        enableContentPanningGesture,
        animatedAnimationState,
        animatedSheetState,
        animatedScrollableState,
        animatedKeyboardState,
        animatedScrollableType,
        animatedKeyboardHeight,
        animatedIndex,
        animatedPosition,
        animatedContentHeight,
        animatedHandleHeight,
        animatedFooterHeight,
        animatedContainerHeight,
        scrollableContentOffsetY,
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
        contentPanGestureHandler,
        getKeyboardHeightInContainer,
        setScrollableRef: handleSettingScrollableRef,
        removeScrollableRef,
      }),
      [
        animatedIndex,
        animatedPosition,
        animatedContentHeight,
        animatedScrollableType,
        getKeyboardHeightInContainer,
        animatedFooterHeight,
        animatedContainerHeight,
        animatedHandleHeight,
        animatedAnimationState,
        animatedKeyboardState,
        animatedKeyboardHeight,
        animatedSheetState,
        contentPanGestureHandler,
        handleSettingScrollableRef,
        removeScrollableRef,
        shouldHandleKeyboardEvents,
        animatedScrollableState,
        scrollableContentOffsetY,
        isScrollableRefreshable,
        isContentHeightFixed,
        isInTemporaryPosition,
        enableContentPanningGesture,
        _providedSimultaneousHandlers,
        _providedWaitFor,
        _providedActiveOffsetX,
        _providedActiveOffsetY,
        _providedFailOffsetX,
        _providedFailOffsetY,
      ]
    );
    const externalContextVariables = useMemo(
      () => ({
        animatedIndex,
        animatedPosition,
        snapToIndex: handleSnapToIndex,
        snapToPosition: handleSnapToPosition,
        expand: handleExpand,
        collapse: handleCollapse,
        close: handleClose,
      }),
      [
        animatedIndex,
        animatedPosition,
        handleSnapToIndex,
        handleSnapToPosition,
        handleExpand,
        handleCollapse,
        handleClose,
      ]
    );
    //#endregion

    //#region styles
    const containerAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: animatedPosition.value,
        },
      ],
    }));
    const containerStyle = useMemo(
      () => [_providedStyle, styles.container, containerAnimatedStyle],
      [_providedStyle, containerAnimatedStyle]
    );
    const contentContainerAnimatedStyle = useAnimatedStyle(() => {
      /**
       * if content height was provided, then we skip setting
       * calculated height.
       */
      if (_providedContentHeight) {
        return {};
      }

      return {
        height: animate(animatedContentHeight.value, _providedAnimationConfigs),
      };
    }, [_providedContentHeight]);
    const contentContainerStyle = useMemo(
      () => [styles.contentContainer, contentContainerAnimatedStyle],
      [contentContainerAnimatedStyle]
    );
    /**
     * added safe area to prevent the sheet from floating above
     * the bottom of the screen, when sheet being over dragged or
     * when the sheet is resized.
     */
    const contentMaskContainerAnimatedStyle = useAnimatedStyle(() => {
      if (detached) {
        return {
          overflow: 'visible',
        };
      }
      return {
        paddingBottom: animatedContainerHeight.value,
      };
    }, [detached]);
    const contentMaskContainerStyle = useMemo(
      () => [styles.contentMaskContainer, contentMaskContainerAnimatedStyle],
      [contentMaskContainerAnimatedStyle]
    );
    //#endregion

    //#region effects
    /**
     * React to `isLayoutCalculated` change, to insure that the sheet will
     * appears/mounts only when all layout is been calculated.
     *
     * @alias OnMount
     */
    useAnimatedReaction(
      () => isLayoutCalculated.value,
      _isLayoutCalculated => {
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
          animatedNextPositionIndex.value = _providedIndex;
        }

        /**
         * here we exit method early because the next position
         * is out of the screen, this happens when `snapPoints`
         * still being calculated.
         */
        if (
          nextPosition === INITIAL_POSITION ||
          nextPosition === animatedClosedPosition.value
        ) {
          isAnimatedOnMount.value = true;
          return;
        }

        runOnJS(print)({
          component: BottomSheet.name,
          method: 'useAnimatedReaction::OnMount',
          params: {
            _isLayoutCalculated,
            animatedSnapPoints: animatedSnapPoints.value,
            nextPosition,
          },
        });

        if (animateOnMount) {
          animateToPosition(nextPosition);
        } else {
          animatedNextPosition.value = nextPosition;
          animatedPosition.value = nextPosition;
        }
        isAnimatedOnMount.value = true;
      }
    );

    /**
     * React to `snapPoints` change, to insure that the sheet position reflect
     * to the current point correctly.
     */
    useAnimatedReaction(
      () => animatedSnapPoints.value,
      (_animatedSnapPoints, _previousAnimatedSnapPoints) => {
        if (
          JSON.stringify(_animatedSnapPoints) ===
            JSON.stringify(_previousAnimatedSnapPoints) ||
          !isLayoutCalculated.value ||
          !isAnimatedOnMount.value
        ) {
          return;
        }

        runOnJS(print)({
          component: BottomSheet.name,
          method: 'useAnimatedReaction::OnSnapPointChange',
          params: {
            animatedSnapPoints: _animatedSnapPoints,
            prev: _previousAnimatedSnapPoints,
            animatedCurrentIndex: animatedCurrentIndex.value,
          },
        });

        let nextPosition;

        /**
         * if snap points changed while sheet is animating, then
         * we stop the animation and animate to the updated point.
         */
        if (animatedPosition.value !== animatedNextPosition.value) {
          cancelAnimation(animatedPosition);
          nextPosition =
            animatedNextPositionIndex.value !== -1
              ? _animatedSnapPoints[animatedNextPositionIndex.value]
              : animatedNextPosition.value;
        } else if (animatedCurrentIndex.value === -1) {
          nextPosition = animatedClosedPosition.value;
        } else if (isInTemporaryPosition.value) {
          nextPosition = getNextPosition();
        } else {
          nextPosition = _animatedSnapPoints[animatedCurrentIndex.value];
        }
        animateToPosition(nextPosition);
      }
    );

    /**
     * React to keyboard appearance.
     */
    useAnimatedReaction(
      () => animatedKeyboardState.value,
      (_keyboardState, _previousKeyboardState) => {
        if (_keyboardState === _previousKeyboardState) {
          return;
        }

        let animationConfigs = getKeyboardAnimationConfigs(
          keyboardAnimationEasing.value,
          keyboardAnimationDuration.value
        );
        const nextPosition = getNextPosition();
        animateToPosition(nextPosition, 0, animationConfigs);
      }
    );

    /**
     * sets provided animated position
     */
    useAnimatedReaction(
      () => animatedPosition.value,
      _animatedPosition => {
        if (_providedAnimatedPosition) {
          _providedAnimatedPosition.value = _animatedPosition + topInset;
        }
      }
    );

    /**
     * sets provided animated index
     */
    useAnimatedReaction(
      () => animatedIndex.value,
      _animatedIndex => {
        if (_providedAnimatedIndex) {
          _providedAnimatedIndex.value = _animatedIndex;
        }
      }
    );

    /**
     * reaction to trigger `handleOnChange`
     */
    useAnimatedReaction(
      () => ({
        _animatedIndex: animatedIndex.value,
        _animatedPosition: animatedPosition.value,
        _animationState: animatedAnimationState.value,
        _contentGestureState: contentPanGestureState.value,
        _handleGestureState: handlePanGestureState.value,
      }),
      ({
        _animatedIndex,
        _animationState,
        _contentGestureState,
        _handleGestureState,
      }) => {
        if (
          _animatedIndex % 1 === 0 &&
          _animatedIndex !== animatedCurrentIndex.value &&
          _animationState === ANIMATION_STATE.STOPPED &&
          (_contentGestureState === State.END ||
            _contentGestureState === State.UNDETERMINED) &&
          (_handleGestureState === State.END ||
            _handleGestureState === State.UNDETERMINED)
        ) {
          runOnJS(print)({
            component: BottomSheet.name,
            method: 'useAnimatedReaction::OnChange',
            params: {
              animatedCurrentIndex: animatedCurrentIndex.value,
              animatedIndex: _animatedIndex,
            },
          });

          animatedCurrentIndex.value = _animatedIndex;
          runOnJS(handleOnChange)(_animatedIndex);
          runOnJS(refreshUIElements)();
        }
      },
      [handleOnChange]
    );
    //#endregion

    // render
    print({
      component: BottomSheet.name,
      method: 'render',
      params: {
        topInset,
        bottomInset,
        animatedSnapPoints: animatedSnapPoints.value,
      },
    });
    return (
      <BottomSheetProvider value={externalContextVariables}>
        <BottomSheetBackdropContainer
          key="BottomSheetBackdropContainer"
          animatedIndex={animatedIndex}
          animatedPosition={animatedPosition}
          backdropComponent={backdropComponent}
        />
        <BottomSheetContainer
          key="BottomSheetContainer"
          shouldCalculateHeight={!$modal}
          containerHeight={_animatedContainerHeight}
          containerOffset={animatedContainerOffset}
          topInset={topInset}
          bottomInset={bottomInset}
          detached={detached}
        >
          <Animated.View
            accessible={true}
            accessibilityRole="adjustable"
            accessibilityLabel="Bottom Sheet"
            style={containerStyle}
          >
            <BottomSheetInternalProvider value={internalContextVariables}>
              <BottomSheetBackgroundContainer
                key="BottomSheetBackgroundContainer"
                animatedIndex={animatedIndex}
                animatedPosition={animatedPosition}
                backgroundComponent={backgroundComponent}
              />
              <Animated.View
                pointerEvents="box-none"
                style={contentMaskContainerStyle}
              >
                <BottomSheetDraggableView
                  key="BottomSheetRootDraggableView"
                  style={contentContainerStyle}
                >
                  {typeof children === 'function'
                    ? (children as Function)()
                    : children}
                </BottomSheetDraggableView>
              </Animated.View>
              <BottomSheetHandleContainer
                key="BottomSheetHandleContainer"
                animatedIndex={animatedIndex}
                animatedPosition={animatedPosition}
                handleHeight={animatedHandleHeight}
                enableHandlePanningGesture={enableHandlePanningGesture}
                enableOverDrag={enableOverDrag}
                enablePanDownToClose={enablePanDownToClose}
                overDragResistanceFactor={overDragResistanceFactor}
                keyboardBehavior={keyboardBehavior}
                handlePanGestureHandler={handlePanGestureHandler}
                handleComponent={handleComponent}
              />
            </BottomSheetInternalProvider>
          </Animated.View>
          {/* <BottomSheetDebugView
            values={{
              // topInset,
              // bottomInset,
              animatedSheetState,
              animatedScrollableState,
              // isScrollableRefreshable,
              // scrollableContentOffsetY,
              keyboardState,
              // animatedIndex,
              // animatedCurrentIndex,
              // animatedPosition,
              animatedContainerHeight,
              animatedSheetHeight,
              animatedHandleHeight,
              animatedContentHeight,
              // keyboardHeight,
              isLayoutCalculated,
              isContentHeightFixed,
              isInTemporaryPosition,
            }}
          /> */}
        </BottomSheetContainer>
      </BottomSheetProvider>
    );
  }
);

const BottomSheet = memo(BottomSheetComponent);
BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;
