import React, {
  useState,
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
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import {
  useInteractivePanGestureHandler,
  useStableCallback,
  useScrollable,
  usePropsValidator,
} from '../../hooks';
import { normalizeSnapPoints } from '../../utilities';
import {
  BottomSheetInternalProvider,
  BottomSheetProvider,
} from '../../contexts';
import BottomSheetContainer from '../bottomSheetContainer';
import BottomSheetHandleContainer from '../bottomSheetHandleContainer';
import BottomSheetBackgroundContainer from '../bottomSheetBackgroundContainer';
import ContentWrapper from '../contentWrapper';
import DraggableView from '../draggableView';
import { GESTURE, ANIMATION_STATE, WINDOW_HEIGHT } from '../../constants';
import {
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_HANDLE_HEIGHT,
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
    const currentIndexRef = useRef<number>(_providedIndex);

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
      const normalizedSnapPoints = normalizeSnapPoints(
        _providedSnapPoints,
        topInset
      );
      const maxSnapPoint =
        normalizedSnapPoints[normalizedSnapPoints.length - 1];
      return {
        snapPoints: normalizedSnapPoints.map(
          normalizedSnapPoint => maxSnapPoint - normalizedSnapPoint
        ),
        sheetHeight: maxSnapPoint,
      };
    }, [_providedSnapPoints, topInset]);
    const initialPosition = useMemo(() => {
      return _providedIndex < 0 ? sheetHeight : snapPoints[_providedIndex];
    }, [_providedIndex, sheetHeight, snapPoints]);

    // content wrapper
    const contentWrapperGestureRef = useRef<TapGestureHandler>(null);
    const contentWrapperGestureState = useSharedValue<State>(
      State.UNDETERMINED
    );
    const contentWrapperMaxDeltaY = useMemo(
      () => snapPoints[Math.max(_providedIndex, 0)],
      [snapPoints, _providedIndex]
    );
    //#endregion

    //#region private methods
    const refreshUIElements = useCallback(() => {
      const currentPositionIndex = Math.max(currentIndexRef.current, 0);

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
      currentIndexRef.current = index;

      if (_providedOnChange) {
        /**
         * to avoid having -0 🤷‍♂️
         */
        _providedOnChange(index + 1 - 1);
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
    const animatedIndex = useDerivedValue(
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
        const tempCurrentPositionIndex = Math.round(animatedIndex.value);

        if (tempCurrentPositionIndex !== currentIndexRef.current) {
          runOnJS(handleOnChange)(tempCurrentPositionIndex);
          runOnJS(refreshUIElements)();
        }
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
    const contentContainerAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: animatedPosition.value }],
      };
    }, []);
    const contentContainerStyle = useMemo<Animated.AnimateStyle<ViewStyle>>(
      () => ({
        ...styles.container,
        height: sheetHeight,
      }),
      [sheetHeight]
    );
    //#endregion

    //#region effects
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
    return (
      <BottomSheetProvider value={externalContextVariables}>
        <BottomSheetContainer
          key="BottomSheetContainer"
          shouldMeasureHeight={shouldMeasureContainerHeight}
          onMeasureHeight={handleOnContainerMeasureHeight}
        >
          <ContentWrapper
            ref={contentWrapperGestureRef}
            gestureState={contentWrapperGestureState}
            maxDeltaY={contentWrapperMaxDeltaY}
            height={sheetHeight}
          >
            <Animated.View
              accessible={true}
              accessibilityRole="adjustable"
              accessibilityLabel="Bottom Sheet"
              style={[contentContainerStyle, contentContainerAnimatedStyle]}
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
                  handleComponent={handleComponent}
                  onMeasureHeight={handleOnHandleMeasureHeight}
                  onGestureEvent={handlePanGestureHandler}
                  onHandlerStateChange={handlePanGestureHandler}
                />
                <DraggableView
                  key="BottomSheetRootDraggableView"
                  style={styles.contentContainer}
                >
                  {typeof children === 'function'
                    ? (children as Function)()
                    : children}
                </DraggableView>
              </BottomSheetInternalProvider>
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
        </BottomSheetContainer>
      </BottomSheetProvider>
    );
  }
);

const BottomSheet = memo(BottomSheetComponent, isEqual);

export default BottomSheet;
