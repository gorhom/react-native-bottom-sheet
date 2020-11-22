import React, {
  useMemo,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  memo,
  useLayoutEffect,
  useEffect,
  useState,
} from 'react';
import { ViewStyle } from 'react-native';
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
  Extrapolate,
  set,
  sub,
  abs,
  greaterThan,
} from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import {
  usePanGestureHandler,
  // ReText,
} from 'react-native-redash';
import DraggableView from '../draggableView';
import Handle from '../handle';
import { useTransition } from './useTransition';
import {
  useStableCallback,
  useScrollable,
  useNormalizedSnapPoints,
} from '../../hooks';
import {
  BottomSheetInternalProvider,
  BottomSheetProvider,
} from '../../contexts';
import { GESTURE } from '../../constants';
import {
  NORMAL_DECELERATION_RATE,
  DEFAULT_ANIMATE_ON_MOUNT,
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_HANDLE_HEIGHT,
} from './constants';
import type { ScrollableRef, BottomSheetMethods } from '../../types';
import type { BottomSheetProps } from './types';
import { styles } from './styles';

const {
  interpolate: interpolateV1,
  interpolateNode: interpolateV2,
} = require('react-native-reanimated');
const interpolate = interpolateV2 || interpolateV1;

type BottomSheet = BottomSheetMethods;

Animated.addWhitelistedUIProps({
  decelerationRate: true,
});

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetProps>(
  (
    {
      // animations
      animationDuration = DEFAULT_ANIMATION_DURATION,
      animationEasing = DEFAULT_ANIMATION_EASING,
      // configurations
      initialSnapIndex = 0,
      snapPoints: _snapPoints,
      topInset = 0,
      enabled = true,
      animateOnMount = DEFAULT_ANIMATE_ON_MOUNT,
      handleHeight: _handleHeight,
      // container props
      containerHeight,
      containerTapGestureRef,
      containerTapGestureState,
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

    //#region state
    const [handleHeight, setHandleHeight] = useState(
      _handleHeight || DEFAULT_HANDLE_HEIGHT
    );
    //#endregion

    //#region refs
    const currentPositionIndexRef = useRef<number>(initialSnapIndex);
    const handlePanGestureRef = useRef<PanGestureHandler>(null);
    //#endregion

    //#region variables
    const {
      scrollableContentOffsetY,
      setScrollableRef,
      removeScrollableRef,
      scrollToTop,
      flashScrollableIndicators,
    } = useScrollable();

    // normalize snap points
    const { snapPoints, sheetHeight } = useNormalizedSnapPoints(
      _snapPoints,
      topInset,
      containerHeight,
      handleHeight
    );

    const initialPosition = useMemo(() => {
      return currentPositionIndexRef.current < 0 || animateOnMount
        ? containerHeight - topInset
        : snapPoints[currentPositionIndexRef.current];
    }, [snapPoints, animateOnMount, containerHeight, topInset]);
    //#endregion

    //#region gestures
    const {
      state: handlePanGestureState,
      translation: { y: handlePanGestureTranslationY },
      velocity: { y: handlePanGestureVelocityY },
      gestureHandler: handlePanGestureHandler,
    } = usePanGestureHandler();

    const {
      state: contentPanGestureState,
      translation: { y: contentPanGestureTranslationY },
      velocity: { y: contentPanGestureVelocityY },
    } = usePanGestureHandler();
    //#endregion

    //#region animation
    const {
      position,
      manualSnapToPoint,
      currentPosition,
      currentGesture,
    } = useTransition({
      animationDuration,
      animationEasing,
      contentPanGestureState,
      contentPanGestureTranslationY,
      contentPanGestureVelocityY,
      handlePanGestureState,
      handlePanGestureTranslationY,
      handlePanGestureVelocityY,
      scrollableContentOffsetY,
      snapPoints,
      initialPosition,
    });

    const animatedPositionIndex = useMemo(
      () =>
        interpolate(position, {
          inputRange: snapPoints.slice().reverse(),
          outputRange: snapPoints
            .slice()
            .map((_, index) => index)
            .reverse(),
          extrapolate: Extrapolate.CLAMP,
        }),
      [position, snapPoints]
    );
    /**
     * Scrollable animated props.
     */
    const decelerationRate = useMemo(
      () =>
        cond(
          greaterThan(position, snapPoints[snapPoints.length - 1]),
          0.001,
          NORMAL_DECELERATION_RATE
        ),
      [position, snapPoints]
    );
    //#endregion

    //#region styles
    const sheetContainerStyle = useMemo<Animated.AnimateStyle<ViewStyle>>(
      () => ({
        ...styles.sheetContainer,
        height: sheetHeight,
        transform: [{ translateY: position }],
      }),
      [sheetHeight, position]
    );
    //#endregion

    //#region private methods
    const refreshUIElements = useCallback(() => {
      const currentPositionIndex = Math.max(currentPositionIndexRef.current, 0);
      if (currentPositionIndex === snapPoints.length - 1) {
        flashScrollableIndicators();
        // @ts-ignore
        containerTapGestureRef.current.setNativeProps({
          maxDeltaY: 0,
        });
      } else {
        // @ts-ignore
        containerTapGestureRef.current.setNativeProps({
          maxDeltaY: snapPoints[currentPositionIndex],
        });
      }
    }, [snapPoints, flashScrollableIndicators, containerTapGestureRef]);
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
    const handleHandleOnLayout = useCallback(
      ({
        nativeEvent: {
          layout: { height },
        },
      }) => {
        if (HandleComponent !== undefined && _handleHeight === undefined) {
          console.log('BottomSheet', 'handleHandleOnLayout', height);
          setHandleHeight(height);
        }
      },
      [_handleHeight, HandleComponent]
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
        manualSnapToPoint.setValue(snapPoints[index]);
      },
      [snapPoints, manualSnapToPoint]
    );
    const handleClose = useCallback(() => {
      manualSnapToPoint.setValue(containerHeight);
    }, [manualSnapToPoint, containerHeight]);
    const handleExpand = useCallback(() => {
      manualSnapToPoint.setValue(snapPoints[snapPoints.length - 1]);
    }, [snapPoints, manualSnapToPoint]);
    const handleCollapse = useCallback(() => {
      manualSnapToPoint.setValue(snapPoints[0]);
    }, [snapPoints, manualSnapToPoint]);
    //#endregion

    //#region context variables
    const internalContextVariables = useMemo(
      () => ({
        enabled,
        containerTapGestureRef,
        handlePanGestureState,
        handlePanGestureTranslationY,
        handlePanGestureVelocityY,
        contentPanGestureState,
        contentPanGestureTranslationY,
        contentPanGestureVelocityY,
        scrollableContentOffsetY,
        decelerationRate,
        setScrollableRef: handleSettingScrollableRef,
        removeScrollableRef,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [enabled]
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
     * This will animate the sheet to the initial snap point
     * when component is mounted.
     */
    useLayoutEffect(() => {
      if (animateOnMount) {
        manualSnapToPoint.setValue(snapPoints[initialSnapIndex]);
      }
    }, [animateOnMount, initialSnapIndex, manualSnapToPoint, snapPoints]);

    /*
     * keep animated position synced with snap points.
     */
    useEffect(() => {
      if (currentPositionIndexRef.current !== -1) {
        manualSnapToPoint.setValue(snapPoints[currentPositionIndexRef.current]);
      }
    }, [snapPoints, manualSnapToPoint]);

    /**
     * @DEV
     * here we track the current position and
     * - call on change ( if provided ).
     * - flash scrollable component scroll indicators.
     * - manipulate the root tap gesture handler maxDeltaY,
     *   which allows the scrollable component to be activated.
     */
    useCode(
      () =>
        onChange(currentPosition, [
          call([currentPosition], args => {
            const currentPositionIndex = snapPoints.indexOf(args[0]);

            /**
             * if animation was interrupted, we ignore the change.
             */
            if (
              currentPositionIndex === -1 &&
              args[0] !== containerHeight - topInset
            ) {
              return;
            }
            currentPositionIndexRef.current = currentPositionIndex;
            refreshUIElements();
            handleOnChange(currentPositionIndex);
          }),
        ]),
      [snapPoints, containerHeight, topInset, refreshUIElements]
    );

    /**
     * @DEV
     * Once the root tap gesture handler states change to failed
     * and the sheet not fully extended, we make sure to prevent the
     * scrollable component from scrolling.
     */
    useCode(
      () =>
        cond(
          and(
            eq(containerTapGestureState, State.FAILED),
            eq(currentGesture, GESTURE.CONTENT),
            neq(position, snapPoints[snapPoints.length - 1])
          ),
          call([], () => {
            scrollToTop();
          })
        ),
      [snapPoints]
    );
    //#endregion

    // render
    console.log('BottomSheet', 'render');
    return (
      <>
        <Animated.View style={sheetContainerStyle}>
          {BackgroundComponent && <BackgroundComponent pointerEvents="none" />}
          <BottomSheetProvider value={externalContextVariables}>
            <PanGestureHandler
              enabled={enabled}
              ref={handlePanGestureRef}
              simultaneousHandlers={containerTapGestureRef}
              shouldCancelWhenOutside={false}
              {...handlePanGestureHandler}
            >
              <Animated.View onLayout={handleHandleOnLayout}>
                <HandleComponent
                  animatedPositionIndex={animatedPositionIndex}
                />
              </Animated.View>
            </PanGestureHandler>

            <BottomSheetInternalProvider value={internalContextVariables}>
              <DraggableView style={styles.contentContainer}>
                {children}
              </DraggableView>
            </BottomSheetInternalProvider>
          </BottomSheetProvider>
        </Animated.View>

        {_animatedPosition && (
          <Animated.Code
            exec={set(_animatedPosition, abs(sub(containerHeight, position)))}
          />
        )}

        {_animatedPositionIndex && (
          <Animated.Code
            exec={set(_animatedPositionIndex, animatedPositionIndex)}
          />
        )}
        {/* <Animated.View pointerEvents="none" style={styles.debug}>
          <ReText
            style={styles.debugText}
            text={concat('manualSnapToPoint: ', manualSnapToPoint)}
          />
          <ReText
            style={styles.debugText}
            text={concat('tapState: ', containerTapGestureState)}
          />
          <ReText
            style={styles.debugText}
            text={concat('contentState: ', contentPanGestureState)}
          />
          <ReText
            style={styles.debugText}
            text={concat('handleState: ', handlePanGestureState)}
          />
          <ReText
            style={styles.debugText}
            text={concat(
              'contentTranslationY: ',
              contentPanGestureTranslationY
            )}
          />
          <ReText
            style={styles.debugText}
            text={concat('scrollableOffsetY: ', scrollableContentOffsetY)}
          />
          <ReText
            style={styles.debugText}
            text={concat('position: ', position)}
          />
          <ReText
            style={styles.debugText}
            text={concat('animatedPositionIndex: ', animatedPositionIndex)}
          />
        </Animated.View> */}
      </>
    );
  }
);

const BottomSheet = memo(BottomSheetComponent, isEqual);

export default BottomSheet;
