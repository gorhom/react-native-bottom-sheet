import React, {
  useMemo,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  memo,
} from 'react';
import { Insets } from 'react-native';
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
  GESTURE,
  ANIMATION_STATE,
  KEYBOARD_STATE,
  KEYBOARD_BEHAVIOR,
  SHEET_STATE,
  SCROLLABLE_STATE,
  KEYBOARD_BLUR_BEHAVIOR,
} from '../../constants';
import {
  animate,
  getKeyboardAnimationConfigs,
  normalizeSnapPoint,
  print,
} from '../../utilities';
import {
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
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
} from './constants';
import type { ScrollableRef, BottomSheetMethods } from '../../types';
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
      animationDuration:
        _providedAnimationDuration = DEFAULT_ANIMATION_DURATION,
      animationEasing: _providedAnimationEasing = DEFAULT_ANIMATION_EASING,
      animationConfigs: _providedAnimationConfigs,

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

      // layout
      handleHeight: _providedHandleHeight,
      containerHeight: _providedContainerHeight,
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
    const animatedContainerOffset = useSharedValue<Required<Insets>>({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
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
    });
    const animatedHandleHeight = useReactiveSharedValue(
      _providedHandleHeight ?? INITIAL_HANDLE_HEIGHT
    );
    const animatedSnapPoints = useNormalizedSnapPoints(
      _providedSnapPoints,
      animatedContainerHeight,
      topInset,
      bottomInset,
      $modal
    );
    const animatedLastSnapPoint = useDerivedValue(
      () => animatedSnapPoints.value[animatedSnapPoints.value.length - 1]
    );
    const animatedSheetHeight = useDerivedValue(
      () => animatedContainerHeight.value - animatedLastSnapPoint.value
    );
    const animatedCurrentIndex = useReactiveSharedValue(
      animateOnMount ? -1 : _providedIndex
    );
    const animatedPosition = useSharedValue(INITIAL_POSITION);
    //#endregion

    //#region conditional variables
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
        _providedHandleHeight !== null ||
        _providedHandleHeight !== undefined
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
      scrollableContentOffsetY,
      setScrollableRef,
      removeScrollableRef,
      flashScrollableIndicators,
    } = useScrollable();
    // keyboard
    const {
      state: keyboardState,
      height: keyboardHeight,
      animationDuration: keyboardAnimationDuration,
      animationEasing: keyboardAnimationEasing,
      shouldHandleKeyboardEvents,
    } = useKeyboard();
    //#endregion

    //#region state/dynamic variables
    // states
    const isAnimatedOnMount = useSharedValue(false);
    const animatedAnimationState = useSharedValue(ANIMATION_STATE.UNDETERMINED);
    const animatedSheetState = useDerivedValue(() => {
      // keyboard height that is in the root container
      const keyboardHeightInContainer =
        keyboardHeight.value - animatedContainerOffset.value.bottom;

      // closed position = position >= container height
      if (animatedPosition.value >= animatedContainerHeight.value)
        return SHEET_STATE.CLOSED;

      // extended position = container height - sheet height
      const extendedPosition =
        animatedContainerHeight.value - animatedSheetHeight.value;
      if (animatedPosition.value === extendedPosition)
        return SHEET_STATE.EXTENDED;

      // extended position with keyboard =
      // container height - (sheet height + keyboard height in root container)
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
      return animatedSheetState.value === SHEET_STATE.FILL_PARENT ||
        animatedSheetState.value === SHEET_STATE.EXTENDED
        ? SCROLLABLE_STATE.UNLOCKED
        : SCROLLABLE_STATE.LOCKED;
    });
    // dynamic
    const animatedContentHeight = useDerivedValue(() => {
      const contentHeight =
        animatedSheetHeight.value - animatedHandleHeight.value;
      const keyboardHeightInContainer =
        keyboardHeight.value - animatedContainerOffset.value.bottom;

      if (
        (keyboardBehavior === KEYBOARD_BEHAVIOR.none ||
          keyboardBehavior === KEYBOARD_BEHAVIOR.extend) &&
        keyboardState.value === KEYBOARD_STATE.SHOWN
      ) {
        return contentHeight - keyboardHeightInContainer;
      }

      if (
        keyboardBehavior === KEYBOARD_BEHAVIOR.fullScreen &&
        isInTemporaryPosition.value
      ) {
        if (keyboardState.value === KEYBOARD_STATE.SHOWN) {
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
        if (keyboardState.value === KEYBOARD_STATE.SHOWN) {
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

        return contentHeight + keyboardHeightInContainer;
      }

      return contentHeight;
    });
    const animatedIndex = useDerivedValue(() => {
      const adjustedSnapPoints = animatedSnapPoints.value.slice().reverse();
      const adjustedSnapPointsIndexes = animatedSnapPoints.value
        .slice()
        .map((_, index) => index)
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
    //#endregion

    //#region variables
    /**
     * @TODO remove this
     */
    const isClosing = useRef(false);
    //#endregion

    //#region private methods
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

        if (isClosing.current && (index === 0 || index === -1)) {
          isClosing.current = false;
        }

        if (_providedOnChange) {
          /**
           * to avoid having -0 🤷‍♂️
           */
          _providedOnChange(index + 1 - 1);
        }
      },
      [_providedOnChange, animatedCurrentIndex]
    );
    const handleOnAnimate = useCallback(
      (toPoint: number) => {
        if (!_providedOnAnimate) {
          return;
        }
        const snapPoints = animatedSnapPoints.value;
        const toIndex = snapPoints.findIndex(item => item === toPoint);
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
        if (position === animatedPosition.value) {
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
         * set animation state to running
         */
        animatedAnimationState.value = ANIMATION_STATE.RUNNING;

        /**
         * fire `onAnimate` callback
         */
        // runOnJS(handleOnAnimate)(position);

        /**
         * force animation configs from parameters, if provided
         */
        if (configs !== undefined) {
          // @ts-ignore
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
          // @ts-ignore
          animatedPosition.value = animate(
            position,
            _providedAnimationConfigs,
            velocity,
            animateToPositionCompleted
          );
        } else {
          // @ts-ignore
          animatedPosition.value = animate(
            position,
            {
              duration: _providedAnimationDuration,
              easing: _providedAnimationEasing,
            },
            0,
            animateToPositionCompleted
          );
        }
      },
      [
        handleOnAnimate,
        _providedAnimationConfigs,
        _providedAnimationDuration,
        _providedAnimationEasing,
      ]
    );
    //#endregion

    //#region gesture interaction hooks
    const [contentPanGestureHandler, contentPanGestureState] =
      useInteractivePanGestureHandler({
        type: GESTURE.CONTENT,
        enableOverDrag,
        enablePanDownToClose,
        overDragResistanceFactor,
        keyboardState,
        keyboardHeight,
        keyboardBehavior: keyboardBehavior,
        animatedPosition,
        animatedSnapPoints,
        animatedContainerHeight,
        isInTemporaryPosition,
        scrollableContentOffsetY,
        animateToPoint: animateToPosition,
      });
    const [handlePanGestureHandler, handlePanGestureState] =
      useInteractivePanGestureHandler({
        type: GESTURE.HANDLE,
        enableOverDrag,
        enablePanDownToClose,
        overDragResistanceFactor,
        keyboardState,
        keyboardHeight,
        keyboardBehavior,
        animatedPosition,
        animatedSnapPoints,
        animatedContainerHeight,
        isInTemporaryPosition,
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

        /**
         * verify if sheet is closed.
         */
        if (animatedPosition.value === animatedContainerHeight.value) {
          isClosing.current = false;
        }

        /**
         * exit method if sheet is closing.
         */
        if (isClosing.current) {
          return;
        }

        const newSnapPoint = snapPoints[index];
        runOnUI(animateToPosition)(newSnapPoint, 0, animationConfigs);
      },
      [
        animateToPosition,
        animatedSnapPoints,
        animatedContainerHeight,
        animatedPosition,
      ]
    );
    const handleSnapToPosition = useWorkletCallback(
      function handleSnapToPosition(
        position: number | string,
        animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
      ) {
        /**
         * verify if sheet is closed.
         */
        if (animatedPosition.value === animatedContainerHeight.value) {
          isClosing.current = false;
        }

        /**
         * exit method if sheet is closing.
         */
        if (isClosing.current) {
          return;
        }

        /**
         * mark the new position as temporary.
         */
        isInTemporaryPosition.value = true;

        /**
         * normalized provided position.
         */
        const nextPosition = normalizeSnapPoint(
          position,
          animatedContainerHeight.value,
          topInset,
          bottomInset
        );
        animateToPosition(nextPosition, 0, animationConfigs);
      },
      [
        animateToPosition,
        animatedContainerHeight,
        animatedPosition,
        bottomInset,
        topInset,
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
        /**
         * verify if sheet is closed.
         */
        if (animatedPosition.value === animatedContainerHeight.value) {
          isClosing.current = false;
        }

        /**
         * exit method if sheet is closing.
         */
        if (isClosing.current) {
          return;
        }

        isClosing.current = true;
        runOnUI(animateToPosition)(
          animatedContainerHeight.value,
          0,
          animationConfigs
        );
      },
      [animateToPosition, animatedContainerHeight, animatedPosition]
    );
    const handleExpand = useCallback(
      function handleExpand(
        animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
      ) {
        /**
         * verify if sheet is closed.
         */
        if (animatedPosition.value === animatedContainerHeight.value) {
          isClosing.current = false;
        }

        /**
         * exit method if sheet is closing.
         */
        if (isClosing.current) {
          return;
        }
        const snapPoints = animatedSnapPoints.value;
        const newSnapPoint = snapPoints[snapPoints.length - 1];
        runOnUI(animateToPosition)(newSnapPoint, 0, animationConfigs);
      },
      [
        animateToPosition,
        animatedSnapPoints,
        animatedContainerHeight,
        animatedPosition,
      ]
    );
    const handleCollapse = useCallback(
      function handleCollapse(
        animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
      ) {
        /**
         * verify if sheet is closed.
         */
        if (animatedPosition.value === animatedContainerHeight.value) {
          isClosing.current = false;
        }

        /**
         * exit method if sheet is closing.
         */
        if (isClosing.current) {
          return;
        }

        const snapPoints = animatedSnapPoints.value;
        const newSnapPoint = snapPoints[0];
        runOnUI(animateToPosition)(newSnapPoint, 0, animationConfigs);
      },
      [
        animateToPosition,
        animatedSnapPoints,
        animatedContainerHeight,
        animatedPosition,
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
        animatedIndex,
        animatedPosition,
        scrollableContentOffsetY,
        shouldHandleKeyboardEvents,
        simultaneousHandlers: _providedSimultaneousHandlers,
        waitFor: _providedWaitFor,
        activeOffsetX: _providedActiveOffsetX,
        activeOffsetY: _providedActiveOffsetY,
        failOffsetX: _providedFailOffsetX,
        failOffsetY: _providedFailOffsetY,
        contentPanGestureHandler,
        setScrollableRef: handleSettingScrollableRef,
        removeScrollableRef,
      }),
      [
        animatedIndex,
        animatedPosition,
        animatedAnimationState,
        animatedSheetState,
        contentPanGestureHandler,
        handleSettingScrollableRef,
        removeScrollableRef,
        shouldHandleKeyboardEvents,
        animatedScrollableState,
        scrollableContentOffsetY,
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
        snapToIndex: handleSnapToIndex,
        snapToPosition: handleSnapToPosition,
        expand: handleExpand,
        collapse: handleCollapse,
        close: handleClose,
      }),
      [
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
    const contentContainerAnimatedStyle = useAnimatedStyle(() => ({
      height: animatedContentHeight.value,
    }));
    const contentContainerStyle = useMemo(
      () => [styles.contentContainer, contentContainerAnimatedStyle],
      [contentContainerAnimatedStyle]
    );
    /**
     * added safe area to prevent the sheet from floating above
     * the bottom of the screen, when sheet being over dragged or
     * when the sheet is resized.
     */
    const contentMaskContainerAnimatedStyle = useAnimatedStyle(() => ({
      paddingBottom: animatedContainerHeight.value,
    }));
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

        const nextPosition = animatedSnapPoints.value[_providedIndex];

        /**
         * here we exit method early because the next position
         * is out of the screen, this happens when `snapPoints`
         * still being calculated.
         */
        if (
          nextPosition === INITIAL_POSITION ||
          nextPosition === animatedContainerHeight.value
        ) {
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
          // to snap sheet to position without duration
          animateToPosition(nextPosition, 0, { duration: 0 });
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
          !isLayoutCalculated.value ||
          !isAnimatedOnMount.value ||
          animatedAnimationState.value === ANIMATION_STATE.RUNNING
        ) {
          return;
        }

        runOnJS(print)({
          component: BottomSheet.name,
          method: 'useAnimatedReaction::OnSnapPointChange',
          params: {
            animatedSnapPoints: _animatedSnapPoints,
            animatedCurrentIndex: animatedCurrentIndex.value,
          },
        });

        let nextPosition;
        if (animatedCurrentIndex.value === -1) {
          nextPosition = animatedContainerHeight.value;
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
      () => keyboardState.value,
      (_keyboardState, _previousKeyboardState) => {
        if (_keyboardState === _previousKeyboardState) {
          return;
        }

        const snapPoints = animatedSnapPoints.value;
        let animationConfigs = getKeyboardAnimationConfigs(
          keyboardAnimationEasing.value,
          keyboardAnimationDuration.value
        );

        /**
         * Handle restore sheet position on blur
         */
        if (
          keyboardBlurBehavior === KEYBOARD_BLUR_BEHAVIOR.restore &&
          _keyboardState === KEYBOARD_STATE.HIDDEN &&
          contentPanGestureState.value !== State.ACTIVE &&
          handlePanGestureState.value !== State.ACTIVE
        ) {
          isInTemporaryPosition.value = false;
          const newSnapPoint = snapPoints[animatedCurrentIndex.value];
          animateToPosition(newSnapPoint, 0, animationConfigs);
        }

        /**
         * Handle extend behavior
         */
        if (
          keyboardBehavior === KEYBOARD_BEHAVIOR.extend &&
          _keyboardState === KEYBOARD_STATE.SHOWN
        ) {
          const newSnapPoint = snapPoints[snapPoints.length - 1];
          animateToPosition(newSnapPoint, 0, animationConfigs);
          return;
        }

        /**
         * Handle full screen behavior
         */
        if (
          keyboardBehavior === KEYBOARD_BEHAVIOR.fullScreen &&
          _keyboardState === KEYBOARD_STATE.SHOWN
        ) {
          isInTemporaryPosition.value = true;
          animateToPosition(0, 0, animationConfigs);
          return;
        }

        /**
         * handle interactive behavior
         */
        if (
          keyboardBehavior === KEYBOARD_BEHAVIOR.interactive &&
          _keyboardState === KEYBOARD_STATE.SHOWN
        ) {
          isInTemporaryPosition.value = true;
          const keyboardHeightInContainer =
            keyboardHeight.value - animatedContainerOffset.value.bottom;
          const newSnapPoint = snapPoints[snapPoints.length - 1];
          animateToPosition(
            Math.max(0, newSnapPoint - keyboardHeightInContainer),
            0,
            animationConfigs
          );
        }
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
              animatedSheetState,
              animatedScrollableState,
              keyboardState,
              animatedIndex,
              animatedCurrentIndex,
              animatedPosition,

              animatedContainerHeight,
              animatedSheetHeight,
              animatedHandleHeight,
              animatedContentHeight,
              keyboardHeight,
              WINDOW_HEIGHT,
              isLayoutCalculated,
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
