import React, {
  useMemo,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  memo,
  useState,
  useEffect,
} from 'react';
import { ViewStyle, Dimensions } from 'react-native';
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
  lessThan,
  Extrapolate,
  set,
  // concat,
  sub,
  abs,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {
  usePanGestureHandler,
  useTapGestureHandler,
  // ReText,
} from 'react-native-redash';
import DraggableView from '../draggableView';
import Handle from '../handle';
import ContentWrapper from '../contentWrapper';
import { useTransition } from './useTransition';
import { useStableCallback, useScrollable } from '../../hooks';
import { normalizeSnapPoints } from '../../utilities';
import {
  BottomSheetInternalContextType,
  BottomSheetInternalProvider,
  BottomSheetProvider,
} from '../../contexts';
import { GESTURE } from '../../constants';
import {
  NORMAL_DECELERATION_RATE,
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
} from './constants';
import type { ScrollableRef, BottomSheetMethods } from '../../types';
import type { BottomSheetProps } from './types';
import { styles } from './styles';

const {
  interpolate: interpolateV1,
  interpolateNode: interpolateV2,
} = require('react-native-reanimated');
const interpolate = interpolateV2 || interpolateV1;
const { height: windowHeight } = Dimensions.get('window');

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
      // general
      initialSnapIndex = 0,
      snapPoints: _snapPoints,
      topInset = 0,
      enabled = true,
      shouldMeasureContentHeight = false,
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
    const rootTapGestureRef = useRef<TapGestureHandler>(null);
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

    // heights
    const [contentHeight, setContentHeight] = useState(-1);
    const [handleHeight, setHandleHeight] = useState(-1);

    // normalize snap points
    const { snapPoints, sheetHeight } = useMemo(() => {
      let normalizedSnapPoints = normalizeSnapPoints(_snapPoints, topInset);
      if (shouldMeasureContentHeight) {
        if (contentHeight !== -1 && handleHeight !== -1) {
          // remove snap points larger than content height
          normalizedSnapPoints = normalizedSnapPoints.filter(
            snapPoint => snapPoint < contentHeight + handleHeight
          );

          const sheetSafeHeight = contentHeight + handleHeight;
          normalizedSnapPoints.push(
            Math.min(sheetSafeHeight, windowHeight - topInset)
          );

          // reset currentPositionIndexRef to the nearest point
          if (currentPositionIndexRef.current >= normalizedSnapPoints.length) {
            currentPositionIndexRef.current = normalizedSnapPoints.length - 1;
          }
        } else {
          normalizedSnapPoints.push(
            normalizedSnapPoints[normalizedSnapPoints.length - 1]
          );
        }
      }
      const maxSnapPoint = Math.max(...normalizedSnapPoints);
      console.log(
        '_snapPoints',
        _snapPoints,
        'normalizedSnapPoints',
        normalizedSnapPoints
      );
      return {
        snapPoints: normalizedSnapPoints.map(
          normalizedSnapPoint => windowHeight - normalizedSnapPoint
        ),
        sheetHeight: maxSnapPoint,
      };
    }, [
      _snapPoints,
      topInset,
      contentHeight,
      handleHeight,
      shouldMeasureContentHeight,
    ]);
    const initialPosition = useMemo(() => {
      return currentPositionIndexRef.current < 0
        ? windowHeight
        : snapPoints[currentPositionIndexRef.current];
    }, [snapPoints]);
    console.log('snapPoints', snapPoints);

    const contentSafeHeight = useMemo(
      () => (handleHeight === -1 ? -1 : sheetHeight - handleHeight),
      [sheetHeight, handleHeight]
    );
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

    const {
      state: tapGestureState,
      gestureHandler: tapGestureHandler,
    } = useTapGestureHandler();
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
          lessThan(position, snapPoints[snapPoints.length - 1]),
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
        ...(shouldMeasureContentHeight ? {} : { height: sheetHeight }),
        transform: [{ translateY: position }],
      }),
      [sheetHeight, position, shouldMeasureContentHeight]
    );
    //#endregion

    //#region callbacks
    const refreshUIElements = useCallback(() => {
      const currentPositionIndex = Math.max(currentPositionIndexRef.current, 0);
      if (currentPositionIndex === snapPoints.length - 1) {
        flashScrollableIndicators();
        // @ts-ignore
        rootTapGestureRef.current.setNativeProps({
          maxDeltaY: 0,
        });
      } else {
        // @ts-ignore
        rootTapGestureRef.current.setNativeProps({
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
    const handleSettingContentHeight = useCallback(
      (height: number) => {
        if (shouldMeasureContentHeight) {
          console.log('handleContentOnLayout', height);
          setContentHeight(height);
        }
      },
      [shouldMeasureContentHeight]
    );
    const handleHandleOnLayout = useCallback(
      ({
        nativeEvent: {
          layout: { height },
        },
      }) => {
        if (shouldMeasureContentHeight) {
          console.log('handleHandleOnLayout', height);
          setHandleHeight(height);
        }
      },
      [shouldMeasureContentHeight]
    );
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
        manualSnapToPoint.setValue(snapPoints[index]);
      },
      [snapPoints, manualSnapToPoint]
    );
    const handleClose = useCallback(() => {
      manualSnapToPoint.setValue(windowHeight);
    }, [manualSnapToPoint]);
    const handleExpand = useCallback(() => {
      manualSnapToPoint.setValue(snapPoints[snapPoints.length - 1]);
    }, [snapPoints, manualSnapToPoint]);
    const handleCollapse = useCallback(() => {
      manualSnapToPoint.setValue(snapPoints[0]);
    }, [snapPoints, manualSnapToPoint]);
    //#endregion

    //#region context variables
    const internalContextVariables = useMemo<BottomSheetInternalContextType>(
      () => ({
        enabled,
        rootTapGestureRef,
        contentPanGestureState,
        contentPanGestureTranslationY,
        contentPanGestureVelocityY,
        handlePanGestureState,
        handlePanGestureTranslationY,
        handlePanGestureVelocityY,
        scrollableContentOffsetY,
        decelerationRate,
        contentHeight:
          contentHeight !== -1 && contentSafeHeight !== -1
            ? contentHeight
            : 'auto',
        contentSafeHeight:
          contentHeight !== -1 && contentSafeHeight !== -1
            ? contentSafeHeight
            : 'auto',
        setScrollableRef: handleSettingScrollableRef,
        removeScrollableRef,
        setContentHeight: handleSettingContentHeight,
      }),
      [
        enabled,
        handlePanGestureState,
        handlePanGestureTranslationY,
        handlePanGestureVelocityY,
        contentPanGestureState,
        contentPanGestureTranslationY,
        contentPanGestureVelocityY,
        scrollableContentOffsetY,
        decelerationRate,
        contentHeight,
        contentSafeHeight,
        handleSettingScrollableRef,
        handleSettingContentHeight,
        removeScrollableRef,
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

    //#region effects
    useImperativeHandle(ref, () => ({
      snapTo: handleSnapTo,
      expand: handleExpand,
      collapse: handleCollapse,
      close: handleClose,
    }));

    /**
     * to keep sheet position synced with snap points array.
     * this is needed when `shouldMeasureContentHeight` is true
     */
    useEffect(() => {
      if (currentPositionIndexRef.current !== -1) {
        manualSnapToPoint.setValue(snapPoints[currentPositionIndexRef.current]);
      }
    }, [manualSnapToPoint, snapPoints]);

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
            if (currentPositionIndex === -1 && args[0] !== sheetHeight) {
              return;
            }
            currentPositionIndexRef.current = currentPositionIndex;
            refreshUIElements();
            handleOnChange(currentPositionIndex);
          }),
        ]),
      [snapPoints, refreshUIElements]
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
            eq(tapGestureState, State.FAILED),
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

    console.log(initialPosition, currentPositionIndexRef.current);
    // render
    return (
      <>
        <ContentWrapper
          ref={rootTapGestureRef}
          initialMaxDeltaY={snapPoints[Math.max(initialSnapIndex, 0)]}
          style={styles.container}
          {...tapGestureHandler}
        >
          <Animated.View style={sheetContainerStyle}>
            {BackgroundComponent && (
              <BackgroundComponent pointerEvents="none" />
            )}
            <BottomSheetProvider value={externalContextVariables}>
              <PanGestureHandler
                enabled={enabled}
                ref={handlePanGestureRef}
                simultaneousHandlers={rootTapGestureRef}
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
                <DraggableView>{children}</DraggableView>
              </BottomSheetInternalProvider>
            </BottomSheetProvider>
          </Animated.View>
        </ContentWrapper>

        {_animatedPosition && (
          <Animated.Code
            exec={set(_animatedPosition, abs(sub(windowHeight, position)))}
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
            text={concat('tapState: ', tapGestureState)}
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
            text={concat('currentPosition: ', currentPosition)}
          />
        </Animated.View> */}
      </>
    );
  }
);

const BottomSheet = memo(BottomSheetComponent, isEqual);

export default BottomSheet;
