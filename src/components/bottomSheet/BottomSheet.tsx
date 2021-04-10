import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  memo,
  useLayoutEffect,
  useEffect,
} from 'react';
import { ViewStyle } from 'react-native';
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
  useNormalizedSnapPoints,
  useReactiveSharedValue,
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
  WINDOW_HEIGHT,
  KEYBOARD_STATE,
  KEYBOARD_BEHAVIOR,
  SHEET_STATE,
  SCROLLABLE_STATE,
  KEYBOARD_BLUR_BEHAVIOR,
} from '../../constants';
import { animate, getKeyboardAnimationConfigs } from '../../utilities';
import {
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_HANDLE_HEIGHT,
  DEFAULT_OVER_DRAG_RESISTANCE_FACTOR,
  DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
  DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
  DEFAULT_ENABLE_OVER_DRAG,
  DEFAULT_ENABLE_FLASH_SCROLLABLE_INDICATOR_ON_EXPAND,
  DEFAULT_ANIMATE_ON_MOUNT,
  DEFAULT_KEYBOARD_BEHAVIOR,
  DEFAULT_KEYBOARD_BLUR_BEHAVIOR,
} from './constants';
import type { ScrollableRef, BottomSheetMethods } from '../../types';
import type { BottomSheetProps } from './types';
import { styles } from './styles';

Animated.addWhitelistedUIProps({
  decelerationRate: true,
});

type BottomSheet = BottomSheetMethods;

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetProps>(
  (props, ref) => {
    //#region validate props
    usePropsValidator(props);
    //#endregion

    //#region extract props
    const {
      // animations configurations
      animationDuration: _providedAnimationDuration = DEFAULT_ANIMATION_DURATION,
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
      style: _providedStyle,

      // keyboard
      keyboardBehavior = DEFAULT_KEYBOARD_BEHAVIOR,
      keyboardBlurBehavior = DEFAULT_KEYBOARD_BLUR_BEHAVIOR,

      // layout
      handleHeight: _providedHandleHeight,
      containerHeight: _providedContainerHeight,
      topInset = 0,
      overDragResistanceFactor = DEFAULT_OVER_DRAG_RESISTANCE_FACTOR,

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
      // components
      handleComponent,
      backdropComponent,
      backgroundComponent,
      children,
    } = props;
    //#endregion

    //#region layout variables
    // state
    const [containerHeight, setContainerHeight] = useState(
      _providedContainerHeight
    );
    const [handleHeight, setHandleHeight] = useState(_providedHandleHeight);

    // safe layout values
    const safeHandleHeight = useMemo(
      () =>
        handleComponent === null ? 0 : handleHeight || DEFAULT_HANDLE_HEIGHT,
      [handleHeight, handleComponent]
    );
    const safeContainerHeight = useMemo(
      () => _providedContainerHeight || containerHeight || WINDOW_HEIGHT,
      [_providedContainerHeight, containerHeight]
    );

    // conditions
    const shouldMeasureContainerHeight = useMemo(
      () => _providedContainerHeight === undefined,
      [_providedContainerHeight]
    );
    const shouldMeasureHandleHeight = useMemo(
      () =>
        _providedHandleHeight === undefined &&
        handleComponent !== undefined &&
        handleComponent !== null,
      [_providedHandleHeight, handleComponent]
    );

    // refs
    const didSetHandleHeight = useRef(!shouldMeasureHandleHeight);
    const didSetContainerHeight = useRef(!shouldMeasureContainerHeight);

    const isLayoutCalculated = useMemo(
      () => {
        return didSetHandleHeight.current && didSetContainerHeight.current;
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [containerHeight, handleHeight]
    );
    //#endregion

    //#region variables
    const currentIndexRef = useRef<number>(
      animateOnMount ? -1 : _providedIndex
    );
    const isClosing = useRef(false);
    const didMountOnAnimate = useRef(false);

    // scrollable variables
    const {
      scrollableContentOffsetY,
      setScrollableRef,
      removeScrollableRef,
      flashScrollableIndicators,
    } = useScrollable();

    // keyboard
    const isExtendedByKeyboard = useSharedValue(false);
    const animatedKeyboardOffset = useSharedValue(0);
    const {
      state: keyboardState,
      height: keyboardHeight,
      animationDuration: keyboardAnimationDuration,
      animationEasing: keyboardAnimationEasing,
      shouldHandleKeyboardEvents,
    } = useKeyboard();

    // normalize snap points
    const snapPoints = useNormalizedSnapPoints(
      _providedSnapPoints,
      topInset,
      safeContainerHeight,
      safeHandleHeight
    );
    const sheetHeight = useMemo(
      () =>
        safeContainerHeight -
        snapPoints[snapPoints.length - 1] -
        safeHandleHeight,
      [snapPoints, safeContainerHeight, safeHandleHeight]
    );

    const initialPosition = useMemo(() => {
      return currentIndexRef.current < 0 || animateOnMount
        ? safeContainerHeight - topInset
        : snapPoints[currentIndexRef.current];
    }, [snapPoints, animateOnMount, safeContainerHeight, topInset]);

    //#endregion

    //#region private methods
    const refreshUIElements = useCallback(() => {
      const currentPositionIndex = Math.max(currentIndexRef.current, 0);

      if (
        enableFlashScrollableIndicatorOnExpand &&
        currentPositionIndex === snapPoints.length - 1
      ) {
        flashScrollableIndicators();
      }
    }, [
      snapPoints,
      flashScrollableIndicators,
      enableFlashScrollableIndicatorOnExpand,
    ]);
    const handleOnChange = useCallback(
      (index: number) => {
        if (index === currentIndexRef.current) {
          return;
        }
        currentIndexRef.current = index;

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
      [_providedOnChange]
    );
    const handleOnAnimate = useCallback(
      (toPoint: number) => {
        if (!_providedOnAnimate) {
          return;
        }
        const toIndex = snapPoints.findIndex(item => item === toPoint);
        if (toIndex !== currentIndexRef.current) {
          _providedOnAnimate(currentIndexRef.current, toIndex);
        }
      },
      [_providedOnAnimate, snapPoints]
    );
    const handleSettingScrollableRef = useCallback(
      (scrollableRef: ScrollableRef) => {
        setScrollableRef(scrollableRef);
        refreshUIElements();
      },
      [setScrollableRef, refreshUIElements]
    );
    //#endregion

    //#region gesture interaction / animation
    // variables
    const animatedSheetHeight = useDerivedValue(() => {
      if (
        keyboardBehavior === KEYBOARD_BEHAVIOR.none ||
        keyboardBehavior === KEYBOARD_BEHAVIOR.extend
      ) {
        return sheetHeight;
      }

      if (keyboardBehavior === KEYBOARD_BEHAVIOR.fullScreen) {
        return isExtendedByKeyboard.value
          ? safeContainerHeight - topInset - safeHandleHeight
          : sheetHeight;
      }

      if (
        keyboardBehavior === KEYBOARD_BEHAVIOR.interactive &&
        isExtendedByKeyboard.value
      ) {
        const safeFullScreenSheetHeight =
          safeContainerHeight - topInset - safeHandleHeight;
        const sheetWithKeyboardHeight = sheetHeight + keyboardHeight.value;

        if (keyboardState.value === KEYBOARD_STATE.SHOWN) {
          if (sheetHeight >= safeFullScreenSheetHeight) {
            return safeFullScreenSheetHeight - keyboardHeight.value;
          }
          return sheetHeight;
        }

        if (sheetWithKeyboardHeight > safeFullScreenSheetHeight) {
          return safeFullScreenSheetHeight;
        }

        return sheetWithKeyboardHeight;
      }

      return sheetHeight;
    });
    const animationState = useSharedValue(ANIMATION_STATE.UNDETERMINED);
    const animatedSnapPoints = useReactiveSharedValue(snapPoints);
    const animatedPosition = useSharedValue(initialPosition);
    const animatedIndex = useDerivedValue(() => {
      const adjustedSnapPoints = snapPoints.slice().reverse();
      const adjustedSnapPointsIndexes = snapPoints
        .slice()
        .map((_, index) => index)
        .reverse();

      /**
       * we add the close state index `-1`
       */
      adjustedSnapPoints.push(safeContainerHeight);
      adjustedSnapPointsIndexes.push(-1);

      return isLayoutCalculated
        ? interpolate(
            animatedPosition.value,
            adjustedSnapPoints,
            adjustedSnapPointsIndexes,
            Extrapolate.CLAMP
          )
        : -1;
    }, [snapPoints, safeContainerHeight, isLayoutCalculated]);
    const animatedSheetState = useDerivedValue(() => {
      const extendedSheetPosition =
        safeContainerHeight - safeHandleHeight - sheetHeight;
      const extendedSheetWithKeyboardPosition =
        safeContainerHeight -
        safeHandleHeight -
        sheetHeight -
        keyboardHeight.value;

      if (animatedPosition.value >= safeContainerHeight) {
        return SHEET_STATE.CLOSED;
      } else if (
        animatedPosition.value === extendedSheetPosition ||
        (keyboardBehavior === KEYBOARD_BEHAVIOR.interactive &&
          isExtendedByKeyboard.value &&
          animatedPosition.value === extendedSheetWithKeyboardPosition)
      ) {
        return SHEET_STATE.EXTENDED;
      } else if (animatedPosition.value === topInset) {
        return SHEET_STATE.FULL_SCREEN;
      } else if (animatedPosition.value < extendedSheetPosition) {
        return SHEET_STATE.OVER_EXTENDED;
      }

      return SHEET_STATE.OPENED;
    });
    const animatedCurrentIndex = useSharedValue(currentIndexRef.current);

    // callbacks
    const animateToPointCompleted = useWorkletCallback(() => {
      animationState.value = ANIMATION_STATE.STOPPED;
    });
    const animateToPoint = useWorkletCallback(
      (
        point: number,
        velocity: number = 0,
        configs?: Animated.WithTimingConfig | Animated.WithSpringConfig
      ) => {
        /**
         * cancel current running animation
         */
        cancelAnimation(animatedPosition);

        /**
         * set animation state to running
         */
        animationState.value = ANIMATION_STATE.RUNNING;

        /**
         * fire `onAnimate` callback
         */
        runOnJS(handleOnAnimate)(point);

        /**
         * force animation configs from parameters, if provided
         */
        if (configs !== undefined) {
          animatedPosition.value = animate(
            point,
            configs,
            velocity,
            animateToPointCompleted
          );
        } else if (_providedAnimationConfigs) {
          /**
           * use animationConfigs callback, if provided
           */
          animatedPosition.value = animate(
            point,
            _providedAnimationConfigs,
            velocity,
            animateToPointCompleted
          );
        } else {
          animatedPosition.value = animate(
            point,
            {
              duration: _providedAnimationDuration,
              easing: _providedAnimationEasing,
            },
            0,
            animateToPointCompleted
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

    const scrollableState = useDerivedValue(() => {
      return animatedSheetState.value === SHEET_STATE.FULL_SCREEN ||
        animatedSheetState.value === SHEET_STATE.EXTENDED
        ? SCROLLABLE_STATE.UNLOCKED
        : SCROLLABLE_STATE.LOCKED;
    });

    // hooks
    const [
      contentPanGestureHandler,
      contentPanGestureState,
    ] = useInteractivePanGestureHandler({
      type: GESTURE.CONTENT,
      enableOverDrag,
      overDragResistanceFactor,
      keyboardState,
      keyboardHeight,
      keyboardBehavior: keyboardBehavior,
      animatedPosition,
      animatedSnapPoints,
      isExtendedByKeyboard,
      scrollableContentOffsetY,
      animateToPoint,
    });

    const [
      handlePanGestureHandler,
      handlePanGestureState,
    ] = useInteractivePanGestureHandler({
      type: GESTURE.HANDLE,
      enableOverDrag,
      overDragResistanceFactor,
      keyboardState,
      keyboardHeight,
      keyboardBehavior,
      animatedPosition,
      animatedSnapPoints,
      isExtendedByKeyboard,
      animateToPoint,
    });
    //#endregion

    //#region layout callbacks
    const handleOnContainerMeasureHeight = useCallback((height: number) => {
      // console.log('BottomSheet', 'handleOnContainerMeasureHeight', height);
      didSetContainerHeight.current = true;
      setContainerHeight(height);
    }, []);

    const handleOnHandleMeasureHeight = useCallback((height: number) => {
      // console.log('BottomSheet', 'handleOnHandleMeasureHeight', height);
      didSetHandleHeight.current = true;
      setHandleHeight(height);
    }, []);
    //#endregion

    //#region public methods
    const handleSnapTo = useCallback(
      (
        index: number,
        animationDuration: number = DEFAULT_ANIMATION_DURATION,
        animationEasing: Animated.EasingFunction = DEFAULT_ANIMATION_EASING
      ) => {
        invariant(
          index >= -1 && index <= snapPoints.length - 1,
          `'index' was provided but out of the provided snap points range! expected value to be between -1, ${
            snapPoints.length - 1
          }`
        );

        /**
         * verify if sheet is closed.
         */
        if (animatedPosition.value === safeContainerHeight) {
          isClosing.current = false;
        }

        /**
         * exit method if sheet is closing.
         */
        if (isClosing.current) {
          return;
        }

        const newSnapPoint = snapPoints[index];
        runOnUI(animateToPoint)(newSnapPoint, 0, {
          duration: animationDuration,
          easing: animationEasing,
        });
      },
      [animateToPoint, snapPoints, safeContainerHeight, animatedPosition]
    );
    const handleClose = useCallback(
      (
        animationDuration: number = DEFAULT_ANIMATION_DURATION,
        animationEasing: Animated.EasingFunction = DEFAULT_ANIMATION_EASING
      ) => {
        /**
         * verify if sheet is closed.
         */
        if (animatedPosition.value === safeContainerHeight) {
          isClosing.current = false;
        }

        /**
         * exit method if sheet is closing.
         */
        if (isClosing.current) {
          return;
        }

        isClosing.current = true;
        runOnUI(animateToPoint)(safeContainerHeight, 0, {
          duration: animationDuration,
          easing: animationEasing,
        });
      },
      [animateToPoint, safeContainerHeight, animatedPosition]
    );
    const handleExpand = useCallback(
      (
        animationDuration: number = DEFAULT_ANIMATION_DURATION,
        animationEasing: Animated.EasingFunction = DEFAULT_ANIMATION_EASING
      ) => {
        /**
         * verify if sheet is closed.
         */
        if (animatedPosition.value === safeContainerHeight) {
          isClosing.current = false;
        }

        /**
         * exit method if sheet is closing.
         */
        if (isClosing.current) {
          return;
        }

        const newSnapPoint = snapPoints[snapPoints.length - 1];
        runOnUI(animateToPoint)(newSnapPoint, 0, {
          duration: animationDuration,
          easing: animationEasing,
        });
      },
      [animateToPoint, snapPoints, safeContainerHeight, animatedPosition]
    );
    const handleCollapse = useCallback(
      (
        animationDuration: number = DEFAULT_ANIMATION_DURATION,
        animationEasing: Animated.EasingFunction = DEFAULT_ANIMATION_EASING
      ) => {
        /**
         * verify if sheet is closed.
         */
        if (animatedPosition.value === safeContainerHeight) {
          isClosing.current = false;
        }

        /**
         * exit method if sheet is closing.
         */
        if (isClosing.current) {
          return;
        }

        const newSnapPoint = snapPoints[0];
        runOnUI(animateToPoint)(newSnapPoint, 0, {
          duration: animationDuration,
          easing: animationEasing,
        });
      },
      [animateToPoint, snapPoints, safeContainerHeight, animatedPosition]
    );

    useImperativeHandle(ref, () => ({
      snapTo: handleSnapTo,
      expand: handleExpand,
      collapse: handleCollapse,
      close: handleClose,
    }));
    //#endregion

    //#region contexts variables
    const internalContextVariables = useMemo(
      () => ({
        enableContentPanningGesture,
        snapPointsCount: snapPoints.length,
        animatedIndex,
        animatedPosition,
        animationState,
        animatedSheetState,
        contentPanGestureHandler,
        scrollableState,
        scrollableContentOffsetY,
        shouldHandleKeyboardEvents,
        simultaneousHandlers: _providedSimultaneousHandlers,
        waitFor: _providedWaitFor,
        activeOffsetX: _providedActiveOffsetX,
        activeOffsetY: _providedActiveOffsetY,
        failOffsetX: _providedFailOffsetX,
        failOffsetY: _providedFailOffsetY,
        setScrollableRef: handleSettingScrollableRef,
        removeScrollableRef,
      }),
      [
        snapPoints.length,
        animatedIndex,
        animatedPosition,
        animationState,
        animatedSheetState,
        contentPanGestureHandler,
        handleSettingScrollableRef,
        removeScrollableRef,
        shouldHandleKeyboardEvents,
        scrollableState,
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
        snapTo: handleSnapTo,
        expand: handleExpand,
        collapse: handleCollapse,
        close: handleClose,
      }),
      [handleSnapTo, handleExpand, handleCollapse, handleClose]
    );
    //#endregion

    //#region styles
    const containerAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: isLayoutCalculated ? 1 : 0,
        transform: [
          {
            translateY: isLayoutCalculated
              ? Math.max(
                  animatedPosition.value + animatedKeyboardOffset.value,
                  topInset
                )
              : safeContainerHeight,
          },
        ],
      };
    }, [
      safeContainerHeight,
      isLayoutCalculated,
      animatedKeyboardOffset,
      topInset,
    ]);
    const containerStyle = useMemo(
      () => [_providedStyle, styles.container, containerAnimatedStyle],
      [_providedStyle, containerAnimatedStyle]
    );
    const contentContainerAnimatedStyle = useAnimatedStyle(
      () => ({
        height: animatedSheetHeight.value,
      }),
      []
    );
    const contentContainerStyle = useMemo(
      () => [styles.contentContainer, contentContainerAnimatedStyle],
      [contentContainerAnimatedStyle]
    );

    /**
     * added safe area to prevent the sheet from floating above
     * the bottom of the screen, when sheet being over dragged or
     * when the sheet is resized.
     */
    const contentMaskContainerStyle = useMemo<ViewStyle>(
      () => ({
        ...styles.contentMaskContainer,
        paddingBottom: sheetHeight,
      }),
      [sheetHeight]
    );
    //#endregion

    //#region effects
    /**
     * This will animate the sheet to the initial snap point
     * when component is mounted.
     */
    useLayoutEffect(() => {
      if (
        animateOnMount &&
        isLayoutCalculated &&
        didMountOnAnimate.current === false &&
        isClosing.current === false &&
        snapPoints[_providedIndex] !== safeContainerHeight &&
        _providedIndex !== -1
      ) {
        const newSnapPoint = snapPoints[_providedIndex];
        requestAnimationFrame(() => runOnUI(animateToPoint)(newSnapPoint));
        didMountOnAnimate.current = true;
      }
    }, [
      _providedIndex,
      animateOnMount,
      isLayoutCalculated,
      snapPoints,
      safeContainerHeight,
      animateToPoint,
    ]);

    /*
     * keep animated position synced with snap points.
     */
    useEffect(() => {
      if (
        isLayoutCalculated &&
        currentIndexRef.current !== -1 &&
        isClosing.current === false
      ) {
        /**
         * Set index to new the snap points length, if previous index
         * is out of bond.
         */
        const safeCurrentIndex = Math.min(
          currentIndexRef.current,
          snapPoints.length - 1
        );

        const newSnapPoint = snapPoints[safeCurrentIndex];
        requestAnimationFrame(() => runOnUI(animateToPoint)(newSnapPoint));
      }
    }, [isLayoutCalculated, snapPoints, animateToPoint]);

    /**
     * handle keyboard appearance behavior
     */
    useAnimatedReaction(
      () => keyboardState.value,
      (state, previousState) => {
        if (state === previousState) {
          return;
        }

        let animationConfigs = getKeyboardAnimationConfigs(
          keyboardAnimationEasing.value,
          keyboardAnimationDuration.value
        );

        /**
         * Handle restore sheet position on blur
         */
        if (
          keyboardBlurBehavior === KEYBOARD_BLUR_BEHAVIOR.restore &&
          state === KEYBOARD_STATE.HIDDEN &&
          contentPanGestureState.value !== State.ACTIVE &&
          handlePanGestureState.value !== State.ACTIVE
        ) {
          isExtendedByKeyboard.value = false;
          const newSnapPoint = snapPoints[animatedCurrentIndex.value];
          animateToPoint(newSnapPoint, 0, animationConfigs);
        }

        /**
         * Handle extend behavior
         */
        if (
          keyboardBehavior === KEYBOARD_BEHAVIOR.extend &&
          state === KEYBOARD_STATE.SHOWN
        ) {
          const newSnapPoint = snapPoints[snapPoints.length - 1];
          animateToPoint(newSnapPoint, 0, animationConfigs);
          return;
        }

        /**
         * Handle full screen behavior
         */
        if (
          keyboardBehavior === KEYBOARD_BEHAVIOR.fullScreen &&
          state === KEYBOARD_STATE.SHOWN
        ) {
          isExtendedByKeyboard.value = true;
          animateToPoint(topInset, 0, animationConfigs);
          return;
        }

        /**
         * handle interactive behavior
         */
        if (
          keyboardBehavior === KEYBOARD_BEHAVIOR.interactive &&
          state === KEYBOARD_STATE.SHOWN
        ) {
          isExtendedByKeyboard.value = true;
          const newSnapPoint = snapPoints[snapPoints.length - 1];
          animateToPoint(
            Math.max(topInset, newSnapPoint - keyboardHeight.value),
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
      value => {
        if (_providedAnimatedPosition) {
          _providedAnimatedPosition.value = value;
        }
      }
    );

    /**
     * sets provided animated index
     */
    useAnimatedReaction(
      () => animatedIndex.value,
      value => {
        if (_providedAnimatedIndex) {
          _providedAnimatedIndex.value = value;
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
        _animationState: animationState.value,
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
          _animationState === ANIMATION_STATE.STOPPED &&
          (_contentGestureState === State.END ||
            _contentGestureState === State.UNDETERMINED) &&
          (_handleGestureState === State.END ||
            _handleGestureState === State.UNDETERMINED)
        ) {
          animatedCurrentIndex.value = animatedIndex.value;
          runOnJS(handleOnChange)(animatedIndex.value);
          runOnJS(refreshUIElements)();
        }
      },
      [handleOnChange]
    );
    //#endregion

    // render
    // console.log(
    //   'BottomSheet',
    //   'render',
    //   snapPoints,
    //   safeContainerHeight,
    //   safeHandleHeight,
    //   sheetHeight
    // );
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
          containerHeight={safeContainerHeight}
          shouldMeasureHeight={shouldMeasureContainerHeight}
          onMeasureHeight={handleOnContainerMeasureHeight}
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
                {isLayoutCalculated && (
                  <BottomSheetDraggableView
                    key="BottomSheetRootDraggableView"
                    style={contentContainerStyle}
                  >
                    {typeof children === 'function'
                      ? (children as Function)()
                      : children}
                  </BottomSheetDraggableView>
                )}
              </Animated.View>
              <BottomSheetHandleContainer
                key="BottomSheetHandleContainer"
                animatedIndex={animatedIndex}
                animatedPosition={animatedPosition}
                shouldMeasureHeight={shouldMeasureHandleHeight}
                enableHandlePanningGesture={enableHandlePanningGesture}
                handlePanGestureHandler={handlePanGestureHandler}
                handleComponent={handleComponent}
                snapPoints={snapPoints}
                onMeasureHeight={handleOnHandleMeasureHeight}
              />
            </BottomSheetInternalProvider>
          </Animated.View>
          {/* <BottomSheetDebugView
            values={{
              animatedIndex,
              animatedPosition,
              keyboardState,
              keyboardHeight,
              animatedSheetHeight,
              animatedSheetState,
              scrollableContentOffsetY,
              scrollableState,
              isExtendedByKeyboard,
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
