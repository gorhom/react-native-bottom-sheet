import React, {
  useMemo,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  memo,
  useEffect,
} from 'react';
import { ViewStyle, View, Text, Platform } from 'react-native';
import isEqual from 'lodash.isequal';
import invariant from 'invariant';
import Animated, {
  useCode,
  onChange,
  call,
  eq,
  cond,
  neq,
  and,
  // concat,
  Easing,
  greaterThan,
  Extrapolate,
  set,
  // defined,
  sub,
  useSharedValue,
  Value,
  useAnimatedStyle,
  concat,
  useDerivedValue,
  withTiming,
  useAnimatedReaction,
  interpolate,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {
  useValue,
  ReText,
  // ReText,
} from 'react-native-redash';
import DraggableView from '../draggableView';
import Handle from '../handle';
import ContentWrapper from '../contentWrapper';
import {
  usePanGestureHandler,
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
} from '../../constants';
import type { ScrollableRef, BottomSheetMethods } from '../../types';
import type { BottomSheetProps } from './types';
import { styles } from './styles';
import DebugView from '../debugView/DebugView';

type BottomSheet = BottomSheetMethods;

Animated.addWhitelistedUIProps({
  maxDeltaY: true,
});

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
      // animated nodes callback
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

    //#region refs
    const currentPositionIndexRef = useRef<number>(initialSnapIndex);
    const handlePanGestureRef = useRef<PanGestureHandler>(null);
    //#endregion

    //#region variables
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
    const contentWrapperTapGestureRef = useRef<TapGestureHandler>(null);
    const contentWrapperTapGestureState = useSharedValue<State>(
      State.UNDETERMINED
    );
    const contentWrapperInitialMaxDeltaY =
      snapPoints[Math.max(initialSnapIndex, 0)];
    //#endregion

    //#region private methods
    const refreshUIElements = useCallback(() => {
      const currentPositionIndex = Math.max(currentPositionIndexRef.current, 0);

      if (currentPositionIndex === snapPoints.length - 1) {
        console.log('refreshUIElements', 'sheet extended');
        flashScrollableIndicators();
        // @ts-ignore
        contentWrapperTapGestureRef.current.setNativeProps({
          maxDeltaY: 0,
        });
      } else {
        console.log('refreshUIElements', 'sheet collapse');
        // @ts-ignore
        contentWrapperTapGestureRef.current.setNativeProps({
          maxDeltaY: snapPoints[currentPositionIndex],
        });
      }
    }, [snapPoints, flashScrollableIndicators]);
    const handleOnChange = useStableCallback((index: number) => {
      if (_onChange) {
        _onChange(index);
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

    //#region gestures
    const lastActiveGesture = useSharedValue<GESTURE>(GESTURE.UNDETERMINED);

    const animatedPosition = useSharedValue(initialPosition);
    const animatedPositionIndex = useDerivedValue(() =>
      interpolate(
        animatedPosition.value,
        snapPoints.slice().reverse(),
        snapPoints
          .slice()
          .map((_, index) => index)
          .reverse()
      )
    );

    const animateToPointCompleted = useCallback(
      isFinished => {
        if (!isFinished) {
          return;
        }
        const tempCurrentPositionIndex = Math.round(
          animatedPositionIndex.value
        );

        if (tempCurrentPositionIndex !== currentPositionIndexRef.current) {
          currentPositionIndexRef.current = tempCurrentPositionIndex;
          handleOnChange(tempCurrentPositionIndex);
          refreshUIElements();
        }
      },
      [animatedPositionIndex, handleOnChange, refreshUIElements]
    );

    const animateToPoint = useCallback(
      (point: number) => {
        'worklet';

        // console.log('animateToPoint', `point: ${point}`);
        animatedPosition.value = withTiming(
          point,
          {
            duration: 250,
            easing: Easing.out(Easing.quad),
          },
          animateToPointCompleted
        );
      },
      [animatedPosition, animateToPointCompleted]
    );

    const [
      handlePanGestureState,
      handlePanGestureTranslationY,
      handlePanGestureVelocityY,
      handlePanGestureHandler,
    ] = usePanGestureHandler({
      type: GESTURE.HANDLE,
      animatedPosition,
      snapPoints,
      lastActiveGesture,
      animateToPoint,
    });

    const [
      contentPanGestureState,
      contentPanGestureTranslationY,
      contentPanGestureVelocityY,
      contentPanGestureHandler,
    ] = usePanGestureHandler({
      type: GESTURE.CONTENT,
      animatedPosition,
      snapPoints,
      lastActiveGesture,
      animateToPoint,
      offset: scrollableContentOffsetY,
    });

    const autoSnapTo = useValue<number>(-1);
    //#endregion

    //#region animation

    //#endregion

    //#region styles
    const containerStyle = useMemo<ViewStyle>(
      () => ({
        ...styles.container,
        height: sheetHeight,
      }),
      [sheetHeight]
    );
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
    });
    //#endregion

    //#region methods
    const handleSnapTo = useCallback(
      (index: number) => {
        invariant(
          index >= -1 && index <= snapPoints.length - 1,
          `'index' was provided but out of the provided snap points range! expected value to be between -1, ${
            snapPoints.length - 1
          }`
        );
        autoSnapTo.setValue(snapPoints[index]);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [snapPoints]
    );
    const handleClose = useCallback(() => {
      autoSnapTo.setValue(sheetHeight);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sheetHeight]);
    const handleExpand = useCallback(() => {
      autoSnapTo.setValue(snapPoints[snapPoints.length - 1]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sheetHeight]);
    const handleCollapse = useCallback(() => {
      autoSnapTo.setValue(snapPoints[0]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sheetHeight]);
    //#endregion

    //#region
    const internalContextVariables = useMemo(
      () => ({
        contentWrapperTapGestureRef,
        handlePanGestureState,
        handlePanGestureTranslationY,
        handlePanGestureVelocityY,
        contentPanGestureState,
        contentPanGestureTranslationY,
        contentPanGestureVelocityY,
        contentPanGestureHandler,
        animatedPosition,
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

    //#region effects
    useImperativeHandle(ref, () => ({
      snapTo: handleSnapTo,
      expand: handleExpand,
      collapse: handleCollapse,
      close: handleClose,
    }));

    /**
     * @DEV
     * here we track the current position and
     * - call on change ( if provided ).
     * - flash scrollable component scroll indicators.
     * - manipulate the root tap gesture handler maxDeltaY,
     *   which allows the scrollable component to be activated.
     */
    // useCode(
    //   () =>
    //     onChange(animatedPosition, [
    //       call([currentPosition.value], args => {
    //         const currentPositionIndex = snapPoints.indexOf(args[0]);

    //         /**
    //          * if animation was interrupted, we ignore the change.
    //          */
    //         if (currentPositionIndex === -1) {
    //           return;
    //         }
    //         currentPositionIndexRef.current = currentPositionIndex;
    //         handleOnChange(currentPositionIndex);
    //         refreshUIElements();
    //       }),
    //     ]),
    //   [snapPoints, refreshUIElements]
    // );

    /**
     * @DEV
     * Once the root tap gesture handler states change to failed
     * and the sheet not fully extended, we make sure to prevent the
     * scrollable component from scrolling.
     */
    // useDerivedValue(() => {
    //   // eq(tapGestureState, State.FAILED),
    //   // eq(currentGesture, GESTURE.CONTENT),
    //   // neq(position, 0)

    //   // console.log(
    //   //   `lastActiveGesture: ${lastActiveGesture.value}`,
    //   //   `TapGestureState: ${contentWrapperTapGestureState.value}`,
    //   //   `animatedPosition: ${animatedPosition.value}`,
    //   //   `scrollableContentOffsetY: ${scrollableContentOffsetY.value}`,
    //   //   lastActiveGesture.value === GESTURE.CONTENT &&
    //   //     animatedPosition.value !== 0 &&
    //   //     scrollableContentOffsetY.value !== 0
    //   //   // lastActiveGesture.value === GESTURE.CONTENT &&
    //   //   //   contentWrapperTapGestureState.value === State.FAILED &&
    //   //   //   animatedPosition.value !== 0
    //   // );

    //   if (
    //     lastActiveGesture.value === GESTURE.CONTENT &&
    //     animatedPosition.value !== 0 &&
    //     scrollableContentOffsetY.value !== 0
    //   ) {
    //     scrollToTop();
    //   }
    //   // if (
    //   //   lastActiveGesture.value === GESTURE.CONTENT &&
    //   //   contentWrapperTapGestureState.value === State.FAILED &&
    //   //   animatedPosition.value !== 0
    //   // ) {
    //   //   // scrollToTop();
    //   // }

    //   return animatedPosition.value;
    // });
    // useCode(
    //   () =>
    //     cond(
    //       and(
    //         eq(tapGestureState.value, State.FAILED),
    //         neq(animatedPosition.value, 0)
    //       ),
    //       call([], () => {
    //         scrollToTop();
    //       })
    //     ),
    //   []
    // );
    //#endregion

    // render
    return (
      <>
        <ContentWrapper
          ref={contentWrapperTapGestureRef}
          gestureState={contentWrapperTapGestureState}
          initialMaxDeltaY={contentWrapperInitialMaxDeltaY}
          style={containerStyle}
        >
          <Animated.View
            style={[contentContainerStyle, contentContainerAnimatedStyle]}
          >
            {BackgroundComponent && (
              <BackgroundComponent pointerEvents="none" />
            )}
            <BottomSheetProvider value={externalContextVariables}>
              <PanGestureHandler
                ref={handlePanGestureRef}
                simultaneousHandlers={contentWrapperTapGestureRef}
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
                  {children}
                  {/* <Animated.View
                    style={{ flex: 1, height: 600, backgroundColor: 'red' }}
                  /> */}
                </DraggableView>
              </BottomSheetInternalProvider>
            </BottomSheetProvider>
          </Animated.View>
        </ContentWrapper>
        <DebugView
          values={{
            contentWrapperTapState: contentWrapperTapGestureState,
            contentPanState: contentPanGestureState,
            lastActiveGesture,
            animatedPosition,
          }}
        />

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
