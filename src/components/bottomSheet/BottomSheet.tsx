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
import { Dimensions, ViewStyle } from 'react-native';
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
import DefaultHandle from '../defaultHandle';
import DefaultBackground from '../defaultBackground';
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

const { height: windowHeight } = Dimensions.get('window');

type BottomSheet = BottomSheetMethods;

Animated.addWhitelistedUIProps({
  decelerationRate: true,
});

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetProps>(
  (
    {
      // animations configurations
      animationDuration = DEFAULT_ANIMATION_DURATION,
      animationEasing = DEFAULT_ANIMATION_EASING,
      // configurations
      index: _index = 0,
      snapPoints: _snapPoints,
      handleHeight: _handleHeight,
      topInset = 0,
      enableContentPanningGesture = DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
      enableHandlePanningGesture = DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
      animateOnMount = DEFAULT_ANIMATE_ON_MOUNT,
      // container props
      containerHeight: _containerHeight,
      containerTapGestureRef,
      containerTapGestureState,
      // animated nodes callback
      animatedPosition: _animatedPositionCallbackNode,
      animatedIndex: _animatedIndexCallbackNode,
      // callbacks
      onChange: _onChange,
      onAnimate: _onAnimate,
      // components
      handleComponent: HandleComponent,
      backgroundComponent: BackgroundComponent = DefaultBackground,
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

    // validate `index`
    invariant(
      typeof _index === 'number',
      `'index' was provided but with wrong type ! expected type is a number.`
    );

    invariant(
      _index >= -1 && _index <= _snapPoints.length - 1,
      `'index' was provided but out of the provided snap points range! expected value to be between -1, ${
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
    const currentIndexRef = useRef<number>(_index);
    const handlePanGestureRef = useRef<PanGestureHandler>(null);

    // ref values
    const didMountOnAnimate = useRef(false);
    const didSetHandleHeight = useRef(false);
    //#endregion

    //#region variables
    const isHandleHeightCalculated = useMemo(() => {
      // user did provide handle height prop
      return _handleHeight !== undefined
        ? true
        : // user did not provide a handle component, we will be using the default handle height
        HandleComponent === undefined || HandleComponent === null
        ? true
        : // user did provide a handle component, and handle layout been calculated
        handleHeight && didSetHandleHeight.current
        ? true
        : false;
    }, [_handleHeight, handleHeight, HandleComponent]);
    const isLayoutCalculated = useMemo(
      () => _containerHeight !== -1 && isHandleHeightCalculated,
      [_containerHeight, isHandleHeightCalculated]
    );
    const containerHeight = useMemo(
      () => (_containerHeight !== -1 ? _containerHeight : windowHeight),
      [_containerHeight]
    );
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
      return currentIndexRef.current < 0 || animateOnMount
        ? containerHeight - topInset
        : snapPoints[currentIndexRef.current];
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
    const handleOnAnimate = useStableCallback(
      (fromIndex: number, toIndex: number) => {
        if (_onAnimate) {
          _onAnimate(fromIndex, toIndex);
        }
      }
    );
    const {
      position,
      manualSnapToPoint,
      currentPosition,
      currentGesture,
    } = useTransition({
      isLayoutCalculated,
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
      currentIndexRef,
      onAnimate: handleOnAnimate,
    });

    // animated values
    const animatedIndex = useMemo(
      () =>
        interpolate(position, {
          /**
           * this been added to resolve issues when provide
           * one snap point.
           */
          inputRange: [...snapPoints.slice().reverse(), containerHeight],
          outputRange: [
            ...snapPoints
              .slice()
              .map((_, index) => index)
              .reverse(),
            -1,
          ],
          extrapolate: Extrapolate.CLAMP,
        }),
      [position, containerHeight, snapPoints]
    );

    const animatedPosition = useMemo(
      () => abs(sub(containerHeight, position)),
      [containerHeight, position]
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
    const containerStyle = useMemo<Animated.AnimateStyle<ViewStyle>>(
      () => ({
        ...styles.container,
        transform: [
          { translateY: isLayoutCalculated ? position : containerHeight },
        ],
      }),
      [containerHeight, position, isLayoutCalculated]
    );
    const contentContainerStyle = useMemo(
      () => ({
        ...styles.contentContainer,
        height: sheetHeight,
      }),
      [sheetHeight]
    );
    //#endregion

    //#region private methods
    const refreshUIElements = useCallback(() => {
      const currentPositionIndex = Math.max(currentIndexRef.current, 0);
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
        if (
          HandleComponent !== undefined &&
          HandleComponent !== null &&
          _handleHeight === undefined
        ) {
          didSetHandleHeight.current = true;
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
      if (
        animateOnMount &&
        isLayoutCalculated &&
        didMountOnAnimate.current === false
      ) {
        manualSnapToPoint.setValue(snapPoints[_index]);
        didMountOnAnimate.current = true;
      }
    }, [
      animateOnMount,
      _index,
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
              args[0] !== containerHeight - topInset
            ) {
              return;
            }
            currentIndexRef.current = currentPositionIndex;
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

    //#region render
    const renderBackground = useCallback(
      () =>
        BackgroundComponent ? (
          <BackgroundComponent
            pointerEvents="none"
            animatedIndex={animatedIndex}
            animatedPosition={animatedPosition}
          />
        ) : null,
      [BackgroundComponent, animatedIndex, animatedPosition]
    );
    const renderHandle = useCallback(
      () =>
        HandleComponent === null ? null : HandleComponent === undefined ? (
          <DefaultHandle />
        ) : (
          <HandleComponent
            animatedIndex={animatedIndex}
            animatedPosition={animatedPosition}
          />
        ),
      [HandleComponent, animatedIndex, animatedPosition]
    );
    return (
      <>
        <Animated.View style={containerStyle}>
          {renderBackground()}
          <BottomSheetProvider value={externalContextVariables}>
            <PanGestureHandler
              enabled={enableHandlePanningGesture}
              ref={handlePanGestureRef}
              simultaneousHandlers={containerTapGestureRef}
              shouldCancelWhenOutside={false}
              {...handlePanGestureHandler}
            >
              <Animated.View onLayout={handleHandleOnLayout}>
                {renderHandle()}
              </Animated.View>
            </PanGestureHandler>

            <BottomSheetInternalProvider value={internalContextVariables}>
              <DraggableView style={contentContainerStyle}>
                {children}
              </DraggableView>
            </BottomSheetInternalProvider>
          </BottomSheetProvider>
        </Animated.View>

        {_animatedPositionCallbackNode && (
          <Animated.Code
            exec={set(_animatedPositionCallbackNode, animatedPosition)}
          />
        )}

        {_animatedIndexCallbackNode && (
          <Animated.Code
            exec={set(_animatedIndexCallbackNode, animatedIndex)}
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
    //#endregion
  }
);

const BottomSheet = memo(BottomSheetComponent, isEqual);

export default BottomSheet;
