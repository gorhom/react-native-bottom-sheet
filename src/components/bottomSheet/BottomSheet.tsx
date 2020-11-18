import React, {
  useMemo,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  memo,
} from 'react';
import { ViewStyle } from 'react-native';
import isEqual from 'lodash.isequal';
import invariant from 'invariant';
import Animated, {
  useAnimatedReaction,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
  runOnUI,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {
  useInteractivePanGestureHandler,
  useStableCallback,
  useScrollable,
} from '../../hooks';
import { normalizeSnapPoints } from '../../utilities';
import {
  BottomSheetInternalProvider,
  BottomSheetProvider,
} from '../../contexts';
import {
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
  GESTURE,
  ANIMATION_STATE,
} from '../../constants';
import ContentWrapper from '../contentWrapper';
import DraggableView from '../draggableView';
import Handle from '../handle';
import type { ScrollableRef, BottomSheetMethods } from '../../types';
import type { BottomSheetProps } from './types';
import { styles } from './styles';

Animated.addWhitelistedUIProps({
  decelerationRate: true,
});

type BottomSheet = BottomSheetMethods;

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetProps>(
  (
    {
      // animations
      animationDuration = DEFAULT_ANIMATION_DURATION,
      animationEasing = DEFAULT_ANIMATION_EASING,
      // general
      initialSnapIndex = 0,
      snapPoints: _snapPoints,
      topInset = 0,
      // animated callback shared values
      animatedPosition: _animatedPosition,
      animatedPositionIndex: _animatedPositionIndex,
      // callbacks
      onChange: _onChange,
      // components
      handleComponent: HandleComponent = Handle,
      backgroundComponent: BackgroundComponent = null,
      children,
    },
    ref
  ) => {
    //#region validate props
    // validate `snapPoints`
    invariant(
      _snapPoints,
      `'snapPoints' was not provided! please provide at least one snap point.`
    );

    invariant(
      _snapPoints.length > 0,
      `'snapPoints' was provided with no points! please provide at least one snap point.`
    );

    // validate `initialSnapIndex`
    invariant(
      typeof initialSnapIndex === 'number',
      `'initialSnapIndex' was provided but with wrong type ! expected type is a number.`
    );

    invariant(
      initialSnapIndex >= -1 && initialSnapIndex <= _snapPoints.length - 1,
      `'initialSnapIndex' was provided but out of the provided snap points range! expected value to be between -1, ${
        _snapPoints.length - 1
      }`
    );

    // topInset
    invariant(
      typeof topInset === 'number',
      `'topInset' was provided but with wrong type ! expected type is a number.`
    );

    // validate animations
    invariant(
      typeof animationDuration === 'number',
      `'animationDuration' was provided but with wrong type ! expected type is a number.`
    );

    invariant(
      animationDuration > 0,
      `'animationDuration' was provided but the value is very low! expected value to be greater than 0`
    );

    invariant(
      typeof animationEasing === 'function',
      `'animationEasing' was provided but with wrong type ! expected type is a Animated.EasingFunction.`
    );
    //#endregion

    //#region variables
    const currentPositionIndexRef = useRef<number>(initialSnapIndex);

    // scrollable variables
    const {
      scrollableContentOffsetY,
      scrollableDecelerationRate,
      setScrollableRef,
      removeScrollableRef,
      flashScrollableIndicators,
    } = useScrollable();

    // normalize snap points
    const { snapPoints, sheetHeight } = useMemo(() => {
      const normalizedSnapPoints = normalizeSnapPoints(_snapPoints, topInset);
      const maxSnapPoint =
        normalizedSnapPoints[normalizedSnapPoints.length - 1];
      return {
        snapPoints: normalizedSnapPoints.map(
          normalizedSnapPoint => maxSnapPoint - normalizedSnapPoint
        ),
        sheetHeight: maxSnapPoint,
      };
    }, [_snapPoints, topInset]);
    const initialPosition = useMemo(() => {
      return initialSnapIndex < 0 ? sheetHeight : snapPoints[initialSnapIndex];
    }, [initialSnapIndex, sheetHeight, snapPoints]);

    // content wrapper
    const contentWrapperGestureRef = useRef<TapGestureHandler>(null);
    const contentWrapperGestureState = useSharedValue<State>(
      State.UNDETERMINED
    );
    const contentWrapperMaxDeltaY = useMemo(
      () => snapPoints[Math.max(initialSnapIndex, 0)],
      [snapPoints, initialSnapIndex]
    );
    //#endregion

    //#region private methods
    const refreshUIElements = useCallback(() => {
      const currentPositionIndex = Math.max(currentPositionIndexRef.current, 0);

      if (currentPositionIndex === snapPoints.length - 1) {
        flashScrollableIndicators();
        // @ts-ignore
        contentWrapperGestureRef.current.setNativeProps({
          maxDeltaY: 0,
        });
      } else {
        // @ts-ignore
        contentWrapperGestureRef.current.setNativeProps({
          maxDeltaY: snapPoints[currentPositionIndex],
        });
      }
    }, [snapPoints, flashScrollableIndicators]);
    const handleOnChange = useStableCallback((index: number) => {
      currentPositionIndexRef.current = index;

      if (_onChange) {
        /**
         * to avoid having -0 🤷‍♂️
         */
        _onChange(index + 1 - 1);
      }
    });
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
    const animationState = useSharedValue(ANIMATION_STATE.UNDETERMINED);
    const animatedPosition = useSharedValue(initialPosition);
    const animatedPositionIndex = useDerivedValue(
      () =>
        interpolate(
          animatedPosition.value,
          [sheetHeight].concat(snapPoints.slice().reverse()),
          [-1].concat(
            snapPoints
              .slice()
              .map((_, index) => index)
              .reverse()
          ),
          Extrapolate.CLAMP
        ),
      [snapPoints, sheetHeight]
    );

    // callbacks
    const animateToPointCompleted = useCallback(
      isCancelled => {
        'worklet';
        animationState.value = ANIMATION_STATE.STOPPED;

        if (!isCancelled) {
          return;
        }
        const tempCurrentPositionIndex = Math.round(
          animatedPositionIndex.value
        );

        if (tempCurrentPositionIndex !== currentPositionIndexRef.current) {
          runOnJS(handleOnChange)(tempCurrentPositionIndex);
          runOnJS(refreshUIElements)();
        }
      },
      [
        animatedPositionIndex.value,
        animationState,
        handleOnChange,
        refreshUIElements,
      ]
    );
    const animateToPoint = useCallback(
      (point: number) => {
        'worklet';
        animationState.value = ANIMATION_STATE.RUNNING;
        animatedPosition.value = withTiming(
          point,
          {
            duration: animationDuration,
            easing: animationEasing,
          },
          animateToPointCompleted
        );
      },
      [
        animationState,
        animatedPosition,
        animationDuration,
        animationEasing,
        animateToPointCompleted,
      ]
    );

    // hooks
    const [handlePanGestureHandler] = useInteractivePanGestureHandler(
      GESTURE.HANDLE,
      animatedPosition,
      snapPoints,
      animateToPoint
    );

    const [contentPanGestureHandler] = useInteractivePanGestureHandler(
      GESTURE.CONTENT,
      animatedPosition,
      snapPoints,
      animateToPoint,
      scrollableContentOffsetY
    );
    //#endregion

    //#region public methods
    const handleSnapTo = useCallback(
      (index: number) => {
        invariant(
          index >= -1 && index <= snapPoints.length - 1,
          `'index' was provided but out of the provided snap points range! expected value to be between -1, ${
            snapPoints.length - 1
          }`
        );
        runOnUI(animateToPoint)(snapPoints[index]);
      },
      [animateToPoint, snapPoints]
    );
    const handleClose = useCallback(() => {
      runOnUI(animateToPoint)(sheetHeight);
    }, [animateToPoint, sheetHeight]);
    const handleExpand = useCallback(() => {
      runOnUI(animateToPoint)(snapPoints[snapPoints.length - 1]);
    }, [animateToPoint, snapPoints]);
    const handleCollapse = useCallback(() => {
      runOnUI(animateToPoint)(snapPoints[0]);
    }, [animateToPoint, snapPoints]);
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
        animatedPosition,
        animationState,
        contentWrapperGestureRef,
        contentPanGestureHandler,
        scrollableContentOffsetY,
        scrollableDecelerationRate,
        setScrollableRef: handleSettingScrollableRef,
        removeScrollableRef,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
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
    const contentContainerStyle = useMemo<Animated.AnimateStyle<ViewStyle>>(
      () => ({
        ...styles.container,
        height: sheetHeight,
      }),
      [sheetHeight]
    );
    const contentContainerAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: animatedPosition.value }],
      };
    }, []);
    //#endregion

    //#region effects
    useAnimatedReaction(
      () => (_animatedPosition ? animatedPosition.value : null),
      (value: number | null) => {
        if (value) {
          _animatedPosition!.value = value;
        }
      }
    );
    useAnimatedReaction(
      () => (_animatedPositionIndex ? animatedPositionIndex.value : null),
      (value: number | null) => {
        if (value) {
          _animatedPositionIndex!.value = value;
        }
      }
    );
    //#endregion

    // render
    return (
      <>
        <ContentWrapper
          ref={contentWrapperGestureRef}
          gestureState={contentWrapperGestureState}
          maxDeltaY={contentWrapperMaxDeltaY}
          height={sheetHeight}
        >
          <Animated.View
            style={[contentContainerStyle, contentContainerAnimatedStyle]}
          >
            {BackgroundComponent && (
              <BackgroundComponent pointerEvents="none" />
            )}
            <BottomSheetProvider value={externalContextVariables}>
              <PanGestureHandler
                simultaneousHandlers={contentWrapperGestureRef}
                shouldCancelWhenOutside={false}
                onGestureEvent={handlePanGestureHandler}
              >
                <Animated.View>
                  <HandleComponent
                    animatedPositionIndex={animatedPositionIndex}
                  />
                </Animated.View>
              </PanGestureHandler>

              <BottomSheetInternalProvider value={internalContextVariables}>
                <DraggableView style={styles.contentContainer}>
                  {typeof children === 'function'
                    ? (children as Function)()
                    : children}
                </DraggableView>
              </BottomSheetInternalProvider>
            </BottomSheetProvider>
          </Animated.View>
        </ContentWrapper>
        {/* <DebugView
          values={{
            contentWrapperTapState: contentWrapperTapGestureState,
            contentPanState: contentPanGestureState,
            lastActiveGesture,
            animatedPosition,
          }}
        /> */}

        {/* {_animatedPosition && (
          <Animated.Code
            exec={set(
              _animatedPosition,
              sub(sheetHeight, animatedPosition.value)
            )}
          />
        )}

        {_animatedPositionIndex && (
          <Animated.Code
            exec={set(_animatedPositionIndex, animatedPositionIndex)}
          />
        )} */}
      </>
    );
  }
);

const BottomSheet = memo(BottomSheetComponent, isEqual);

export default BottomSheet;
