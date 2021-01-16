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
import { ViewStyle, AccessibilityInfo } from 'react-native';
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
  Extrapolate,
  set,
  sub,
  abs,
  greaterThan,
} from 'react-native-reanimated';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import {
  usePanGestureHandler,
  useTapGestureHandler,
} from 'react-native-redash';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import BottomSheetContentWrapper from '../bottomSheetContentWrapper';
import BottomSheetContainer from '../bottomSheetContainer';
import BottomSheetHandleContainer from '../bottomSheetHandleContainer';
import BottomSheetBackgroundContainer from '../bottomSheetBackgroundContainer';
import BottomSheetBackdropContainer from '../bottomSheetBackdropContainer';
// import BottomSheetDebugView from '../bottomSheetDebugView';
import { useTransition } from './useTransition';
import {
  useStableCallback,
  useScrollable,
  useNormalizedSnapPoints,
  usePropsValidator,
  useReactiveValue,
} from '../../hooks';
import {
  BottomSheetInternalProvider,
  BottomSheetProvider,
} from '../../contexts';
import { GESTURE, WINDOW_HEIGHT } from '../../constants';
import {
  NORMAL_DECELERATION_RATE,
  DEFAULT_ANIMATE_ON_MOUNT,
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_HANDLE_HEIGHT,
  DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
  DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
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
  (props, ref) => {
    //#region validate props
    usePropsValidator(props);
    //#endregion

    //#region extract props
    const {
      // animations configurations
      animationDuration = DEFAULT_ANIMATION_DURATION,
      animationEasing = DEFAULT_ANIMATION_EASING,
      // configurations
      index: _providedIndex = 0,
      snapPoints: _providedSnapPoints,
      handleHeight: _providedHandleHeight,
      containerHeight: _providedContainerHeight,
      topInset = 0,
      enableContentPanningGesture = DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
      enableHandlePanningGesture = DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
      animateOnMount = DEFAULT_ANIMATE_ON_MOUNT,
      // animated nodes callback
      animatedPosition: _providedAnimatedPosition,
      animatedIndex: _providedAnimatedIndex,
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

    //#region component refs
    const containerTapGestureRef = useRef<TapGestureHandler>(null);
    //#endregion

    //#region layout variables
    // state
    const [containerHeight, setContainerHeight] = useState(
      _providedContainerHeight
    );
    const [handleHeight, setHandleHeight] = useState(_providedHandleHeight);

    // safe layout values

    const safeHandleHeight = useMemo(
      () => handleHeight || DEFAULT_HANDLE_HEIGHT,
      [handleHeight]
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
        _providedHandleHeight === undefined && handleComponent !== undefined,
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
    const animatedIsLayoutReady = useReactiveValue(isLayoutCalculated ? 1 : 0);

    //#endregion

    //#region variables

    // refs
    const currentIndexRef = useRef<number>(_providedIndex);
    const isClosing = useRef(false);
    const didMountOnAnimate = useRef(false);

    const {
      scrollableContentOffsetY,
      setScrollableRef,
      removeScrollableRef,
      scrollToTop,
      flashScrollableIndicators,
    } = useScrollable();

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

    //#region gestures
    const {
      state: containerTapGestureState,
      gestureHandler: containerTapGestureHandler,
    } = useTapGestureHandler();
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

    //#region animated variables
    const handleOnAnimate = useStableCallback(
      (fromIndex: number, toIndex: number) => {
        if (_providedOnAnimate) {
          _providedOnAnimate(fromIndex, toIndex);
        }
      }
    );
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
      animatedIsLayoutReady,
      snapPoints,
      initialPosition,
      currentIndexRef,
      onAnimate: handleOnAnimate,
    });

    // animated values
    const animatedIndex = useMemo(() => {
      const adjustedSnapPoints = snapPoints.slice().reverse();
      const adjustedSnapPointsIndexes = snapPoints
        .slice()
        .map((_, index) => index)
        .reverse();

      /**
       * this been added to resolve issues when provide
       * one snap point.
       */
      if (snapPoints.length === 1) {
        adjustedSnapPoints.push(safeContainerHeight);
        adjustedSnapPointsIndexes.push(-1);
      }

      return interpolate(position, {
        inputRange: adjustedSnapPoints,
        outputRange: adjustedSnapPointsIndexes,
        extrapolate: Extrapolate.CLAMP,
      });
    }, [position, safeContainerHeight, snapPoints]);

    const animatedPosition = useMemo(
      () => abs(sub(safeContainerHeight, position)),
      [safeContainerHeight, position]
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

    //#region private methods
    const refreshUIElements = useCallback(() => {
      const currentPositionIndex = Math.max(currentIndexRef.current, 0);
      if (containerTapGestureRef.current) {
        // @ts-ignore
        containerTapGestureRef.current.setNativeProps({
          maxDeltaY: Math.abs(
            snapPoints[snapPoints.length - 1] - snapPoints[currentPositionIndex]
          ),
        });
      }

      if (currentPositionIndex === snapPoints.length - 1) {
        flashScrollableIndicators();
      }
    }, [snapPoints, containerTapGestureRef, flashScrollableIndicators]);
    const handleOnChange = useStableCallback((index: number) => {
      if (_providedOnChange) {
        _providedOnChange(index);
      }

      if (isClosing.current && (index === 0 || index === -1)) {
        isClosing.current = false;
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

    //#region public methods
    const handleSnapTo = useCallback(
      (index: number) => {
        invariant(
          index >= -1 && index <= snapPoints.length - 1,
          `'index' was provided but out of the provided snap points range! expected value to be between -1, ${
            snapPoints.length - 1
          }`
        );
        if (isClosing.current) {
          return;
        }
        manualSnapToPoint.setValue(snapPoints[index]);
      },
      [snapPoints, manualSnapToPoint]
    );
    const handleClose = useCallback(() => {
      isClosing.current = true;
      manualSnapToPoint.setValue(safeContainerHeight);
    }, [manualSnapToPoint, safeContainerHeight]);
    const handleExpand = useCallback(() => {
      if (isClosing.current) {
        return;
      }
      manualSnapToPoint.setValue(snapPoints[snapPoints.length - 1]);
    }, [snapPoints, manualSnapToPoint]);
    const handleCollapse = useCallback(() => {
      if (isClosing.current) {
        return;
      }
      manualSnapToPoint.setValue(snapPoints[0]);
    }, [snapPoints, manualSnapToPoint]);
    //#endregion

    //#region context variables
    const internalContextVariables = useMemo(
      () => ({
        enableContentPanningGesture,
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
      [
        enableContentPanningGesture,
        containerTapGestureRef,
        contentPanGestureState,
        contentPanGestureTranslationY,
        contentPanGestureVelocityY,
        handlePanGestureState,
        handlePanGestureTranslationY,
        handlePanGestureVelocityY,
        decelerationRate,
        scrollableContentOffsetY,
        handleSettingScrollableRef,
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

    //#region expose public methods
    useImperativeHandle(ref, () => ({
      snapTo: handleSnapTo,
      expand: handleExpand,
      collapse: handleCollapse,
      close: handleClose,
    }));
    //#endregion

    //#region styles
    const containerStyle = useMemo<Animated.AnimateStyle<ViewStyle>>(
      () => ({
        ...styles.container,
        opacity: animatedIsLayoutReady,
        transform: [
          {
            translateY: cond(
              animatedIsLayoutReady,
              position,
              safeContainerHeight
            ),
          },
        ],
      }),
      [safeContainerHeight, position, animatedIsLayoutReady]
    );
    const contentContainerStyle = useMemo(
      () => ({
        ...styles.contentContainer,
        height: sheetHeight,
      }),
      [sheetHeight]
    );

    /**
     * added safe area to prevent the sheet from floating above
     * the bottom of the screen, when sheet being over dragged or
     * when the sheet is resized.
     */
    const contentMaskContainerStyle = useMemo<ViewStyle>(
      () => ({
        ...styles.contentMaskContainer,
        paddingBottom: animatedIsLayoutReady ? sheetHeight : 0,
      }),
      [sheetHeight, animatedIsLayoutReady]
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
        didMountOnAnimate.current === false
      ) {
        manualSnapToPoint.setValue(snapPoints[_providedIndex]);
        didMountOnAnimate.current = true;
      }
    }, [
      _providedIndex,
      animateOnMount,
      isLayoutCalculated,
      manualSnapToPoint,
      snapPoints,
    ]);

    /*
     * keep animated position synced with snap points.
     */
    useEffect(() => {
      if (isLayoutCalculated && currentIndexRef.current !== -1) {
        manualSnapToPoint.setValue(snapPoints[currentIndexRef.current]);
      }
    }, [isLayoutCalculated, snapPoints, manualSnapToPoint]);

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
              args[0] !== safeContainerHeight - topInset
            ) {
              return;
            }

            /**
             * Here we announce the bottom sheet position
             * for accessibility service.
             */
            AccessibilityInfo.isScreenReaderEnabled().then(isEnabled => {
              if (!isEnabled) {
                return;
              }
              const positionInScreen = Math.max(
                Math.floor(
                  ((WINDOW_HEIGHT - snapPoints[currentPositionIndex] || 1) /
                    WINDOW_HEIGHT) *
                    100
                ),
                0
              ).toFixed(0);
              AccessibilityInfo.announceForAccessibility(
                `Bottom sheet snapped to ${positionInScreen}% of the screen`
              );
            });

            currentIndexRef.current = currentPositionIndex;
            refreshUIElements();
            handleOnChange(currentPositionIndex);
          }),
        ]),
      [snapPoints, safeContainerHeight, topInset, refreshUIElements]
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

    //#region render
    // console.log(
    //   'BottomSheet',
    //   'render',
    //   snapPoints,
    //   sheetHeight,
    //   safeHandleHeight
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
          shouldMeasureHeight={shouldMeasureContainerHeight}
          onMeasureHeight={handleOnContainerMeasureHeight}
        >
          <BottomSheetContentWrapper
            key="BottomSheetContentWrapper"
            ref={containerTapGestureRef}
            {...containerTapGestureHandler}
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
                <BottomSheetHandleContainer
                  key="BottomSheetHandleContainer"
                  animatedIndex={animatedIndex}
                  animatedPosition={animatedPosition}
                  simultaneousHandlers={containerTapGestureRef}
                  shouldMeasureHeight={shouldMeasureHandleHeight}
                  enableHandlePanningGesture={enableHandlePanningGesture}
                  handleComponent={handleComponent}
                  onMeasureHeight={handleOnHandleMeasureHeight}
                  {...handlePanGestureHandler}
                />
                <Animated.View
                  pointerEvents="box-none"
                  style={contentMaskContainerStyle}
                >
                  <BottomSheetDraggableView
                    key="BottomSheetRootDraggableView"
                    style={contentContainerStyle}
                  >
                    {children}
                  </BottomSheetDraggableView>
                </Animated.View>
              </BottomSheetInternalProvider>
            </Animated.View>
          </BottomSheetContentWrapper>

          {_providedAnimatedPosition && (
            <Animated.Code
              exec={set(_providedAnimatedPosition, animatedPosition)}
            />
          )}

          {_providedAnimatedIndex && (
            <Animated.Code exec={set(_providedAnimatedIndex, animatedIndex)} />
          )}

          {/* <BottomSheetDebugView
          values={{
            position,
            manualSnapToPoint,
          }}
        /> */}
        </BottomSheetContainer>
      </BottomSheetProvider>
    );
    //#endregion
  }
);

const BottomSheet = memo(BottomSheetComponent, isEqual);

export default BottomSheet;
