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
  useWorkletCallback,
  useAnimatedProps,
} from 'react-native-reanimated';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import {
  useInteractivePanGestureHandler,
  useScrollable,
  usePropsValidator,
  useNormalizedSnapPoints,
} from '../../hooks';
import {
  BottomSheetInternalProvider,
  BottomSheetProvider,
} from '../../contexts';
import BottomSheetContainer from '../bottomSheetContainer';
import BottomSheetBackdropContainer from '../bottomSheetBackdropContainer';
import BottomSheetHandleContainer from '../bottomSheetHandleContainer';
import BottomSheetBackgroundContainer from '../bottomSheetBackgroundContainer';
import BottomSheetContentWrapper from '../bottomSheetContentWrapper';
// import BottomSheetDebugView from '../bottomSheetDebugView';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import { GESTURE, ANIMATION_STATE, WINDOW_HEIGHT } from '../../constants';
import {
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_HANDLE_HEIGHT,
  DEFAULT_ANIMATE_ON_MOUNT,
  DECELERATION_RATE,
  DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
  DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
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
      animationDuration = DEFAULT_ANIMATION_DURATION,
      animationEasing = DEFAULT_ANIMATION_EASING,
      // configurations
      index: _providedIndex = 0,
      snapPoints: _providedSnapPoints,
      animateOnMount = DEFAULT_ANIMATE_ON_MOUNT,
      enableContentPanningGesture = DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
      enableHandlePanningGesture = DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
      // layout
      handleHeight: _providedHandleHeight,
      containerHeight: _providedContainerHeight,
      topInset = 0,
      // animated callback shared values
      animatedPosition: _providedAnimatedPosition,
      animatedIndex: _providedAnimatedIndex,
      // callbacks
      onChange: _providedOnChange,
      // components
      handleComponent,
      backdropComponent,
      backgroundComponent,
      children,
    } = props;
    //#endregion

    //#region component refs
    const contentWrapperGestureRef = useRef<TapGestureHandler>(null);
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
        _providedHandleHeight === undefined &&
        backgroundComponent !== undefined,
      [_providedHandleHeight, backgroundComponent]
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
    const didMountOnAnimate = useRef(false);

    // scrollable variables
    const {
      scrollableContentOffsetY,
      scrollableDecelerationRate,
      setScrollableRef,
      removeScrollableRef,
      flashScrollableIndicators,
    } = useScrollable();

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

    //content wrapper
    const contentWrapperMaxDeltaY = useSharedValue<number>(0);
    const contentWrapperGestureState = useSharedValue<State>(
      State.UNDETERMINED
    );
    //#endregion

    //#region private methods
    const refreshUIElements = useCallback(() => {
      const currentPositionIndex = Math.max(currentIndexRef.current, 0);

      contentWrapperMaxDeltaY.value = Math.abs(
        snapPoints[snapPoints.length - 1] - snapPoints[currentPositionIndex]
      );

      if (currentPositionIndex === snapPoints.length - 1) {
        flashScrollableIndicators();
      }
    }, [contentWrapperMaxDeltaY, snapPoints, flashScrollableIndicators]);
    const handleOnChange = useCallback(
      (index: number) => {
        if (index === currentIndexRef.current) {
          return;
        }
        currentIndexRef.current = index;

        if (_providedOnChange) {
          /**
           * to avoid having -0 🤷‍♂️
           */
          _providedOnChange(index + 1 - 1);
        }
      },
      [_providedOnChange]
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
    const animationState = useSharedValue(ANIMATION_STATE.UNDETERMINED);
    const animatedPosition = useSharedValue(initialPosition, true);
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

      return interpolate(
        animatedPosition.value,
        adjustedSnapPoints,
        adjustedSnapPointsIndexes,
        Extrapolate.CLAMP
      );
    }, [snapPoints, safeContainerHeight]);

    // callbacks
    const animateToPointCompleted = useWorkletCallback(
      didFinish => {
        animationState.value = ANIMATION_STATE.STOPPED;

        if (!didFinish) {
          return;
        }

        const tempCurrentPositionIndex = Math.round(animatedIndex.value);
        runOnJS(handleOnChange)(tempCurrentPositionIndex);
        runOnJS(refreshUIElements)();
      },
      [animatedIndex.value, animationState, handleOnChange, refreshUIElements]
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
    const [contentPanGestureHandler] = useInteractivePanGestureHandler(
      GESTURE.CONTENT,
      animatedPosition,
      snapPoints,
      animateToPoint,
      scrollableContentOffsetY
    );

    // content wrapper
    const contentWrapperAnimatedProps = useAnimatedProps(() => ({
      maxDeltaY: contentWrapperMaxDeltaY.value,
    }));
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
      runOnUI(animateToPoint)(safeContainerHeight);
    }, [animateToPoint, safeContainerHeight]);
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
        enableContentPanningGesture,
        snapPointsCount: snapPoints.length,
        animatedIndex,
        animatedPosition,
        animationState,
        contentWrapperGestureRef,
        contentPanGestureHandler,
        scrollableContentOffsetY,
        scrollableDecelerationRate,
        setScrollableRef: handleSettingScrollableRef,
        removeScrollableRef,
      }),
      [
        snapPoints.length,
        animatedIndex,
        animatedPosition,
        animationState,
        contentPanGestureHandler,
        handleSettingScrollableRef,
        removeScrollableRef,
        scrollableContentOffsetY,
        scrollableDecelerationRate,
        enableContentPanningGesture,
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
              ? animatedPosition.value
              : safeContainerHeight,
          },
        ],
      };
    }, [safeContainerHeight, isLayoutCalculated]);
    const containerStyle = useMemo(
      () => [styles.container, containerAnimatedStyle],
      [containerAnimatedStyle]
    );
    const contentContainerStyle = useMemo<ViewStyle>(
      () => ({
        ...styles.contentContainer,
        height: sheetHeight,
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
        snapPoints[_providedIndex] !== safeContainerHeight
      ) {
        requestAnimationFrame(() =>
          runOnUI(animateToPoint)(snapPoints[_providedIndex])
        );
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
      if (isLayoutCalculated && currentIndexRef.current !== -1) {
        requestAnimationFrame(() =>
          runOnUI(animateToPoint)(snapPoints[currentIndexRef.current])
        );
      }
    }, [isLayoutCalculated, snapPoints, animateToPoint]);

    /**
     * set scrollable deceleration rate based on sheet
     * position.
     */
    useAnimatedReaction(
      () => animatedIndex.value === snapPoints.length - 1,
      (shouldNormalizeDecelerationRate: boolean) => {
        const newDecelerationRate = shouldNormalizeDecelerationRate
          ? DECELERATION_RATE
          : 0;
        if (scrollableDecelerationRate.value !== newDecelerationRate) {
          scrollableDecelerationRate.value = newDecelerationRate;
        }
      },
      [snapPoints.length]
    );

    useAnimatedReaction(
      () => (_providedAnimatedPosition ? animatedPosition.value : null),
      (value: number | null) => {
        if (value) {
          _providedAnimatedPosition!.value = value;
        }
      }
    );
    useAnimatedReaction(
      () => (_providedAnimatedIndex ? animatedIndex.value : null),
      (value: number | null) => {
        if (value) {
          _providedAnimatedIndex!.value = value;
        }
      }
    );
    //#endregion

    // render
    // console.log('BottomSheet', 'render', snapPoints);
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
            ref={contentWrapperGestureRef}
            gestureState={contentWrapperGestureState}
            animatedProps={contentWrapperAnimatedProps}
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
                  simultaneousHandlers={contentWrapperGestureRef}
                  shouldMeasureHeight={shouldMeasureHandleHeight}
                  snapPoints={snapPoints}
                  enableHandlePanningGesture={enableHandlePanningGesture}
                  animateToPoint={animateToPoint}
                  handleComponent={handleComponent}
                  onMeasureHeight={handleOnHandleMeasureHeight}
                />
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
              </BottomSheetInternalProvider>
            </Animated.View>
          </BottomSheetContentWrapper>
          {/* <BottomSheetDebugView
            values={{
              animatedIndex,
              animatedPosition,
              tapState: contentWrapperGestureState,
            }}
          /> */}
        </BottomSheetContainer>
      </BottomSheetProvider>
    );
  }
);

const BottomSheet = memo(BottomSheetComponent, isEqual);

export default BottomSheet;
