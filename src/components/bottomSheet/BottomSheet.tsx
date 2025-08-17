import invariant from 'invariant';
import React, {
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
  memo,
  useEffect,
} from 'react';
import { type Insets, Platform, StyleSheet } from 'react-native';
import { State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useSharedValue,
  useDerivedValue,
  runOnJS,
  interpolate,
  Extrapolation,
  runOnUI,
  cancelAnimation,
  type WithSpringConfig,
  type WithTimingConfig,
  type SharedValue,
  useReducedMotion,
  ReduceMotion,
} from 'react-native-reanimated';
import {
  ANIMATION_SOURCE,
  ANIMATION_STATUS,
  KEYBOARD_BEHAVIOR,
  KEYBOARD_BLUR_BEHAVIOR,
  KEYBOARD_INPUT_MODE,
  KEYBOARD_STATUS,
  SCROLLABLE_STATUS,
  SHEET_STATE,
  SNAP_POINT_TYPE,
} from '../../constants';
import {
  BottomSheetInternalProvider,
  BottomSheetProvider,
} from '../../contexts';
import {
  useAnimatedKeyboard,
  useAnimatedSnapPoints,
  usePropsValidator,
  useReactiveSharedValue,
  useScrollable,
  useStableCallback,
} from '../../hooks';
import type {
  AnimationState,
  BottomSheetMethods,
  BottomSheetPosition,
} from '../../types';
import {
  animate,
  getKeyboardAnimationConfigs,
  normalizeSnapPoint,
  print,
} from '../../utilities';
// import BottomSheetDebugView from '../bottomSheetDebugView';
import { BottomSheetBackgroundContainer } from '../bottomSheetBackground';
import { BottomSheetFooterContainer } from '../bottomSheetFooter';
import BottomSheetGestureHandlersProvider from '../bottomSheetGestureHandlersProvider';
import { BottomSheetHandleContainer } from '../bottomSheetHandle';
import { BottomSheetHostingContainer } from '../bottomSheetHostingContainer';
import { BottomSheetBody } from './BottomSheetBody';
import { BottomSheetContent } from './BottomSheetContent';
import {
  DEFAULT_ACCESSIBILITY_LABEL,
  DEFAULT_ACCESSIBILITY_ROLE,
  DEFAULT_ACCESSIBLE,
  DEFAULT_ANIMATE_ON_MOUNT,
  DEFAULT_DYNAMIC_SIZING,
  DEFAULT_ENABLE_BLUR_KEYBOARD_ON_GESTURE,
  DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
  DEFAULT_ENABLE_OVER_DRAG,
  DEFAULT_ENABLE_PAN_DOWN_TO_CLOSE,
  DEFAULT_KEYBOARD_BEHAVIOR,
  DEFAULT_KEYBOARD_BLUR_BEHAVIOR,
  DEFAULT_KEYBOARD_INPUT_MODE,
  DEFAULT_OVER_DRAG_RESISTANCE_FACTOR,
  INITIAL_CONTAINER_HEIGHT,
  INITIAL_CONTAINER_OFFSET,
  INITIAL_HANDLE_HEIGHT,
  INITIAL_POSITION,
  INITIAL_SNAP_POINT,
  INITIAL_VALUE,
} from './constants';
import type { AnimateToPositionType, BottomSheetProps } from './types';

Animated.addWhitelistedUIProps({
  decelerationRate: true,
});

type BottomSheet = BottomSheetMethods;

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetProps>(
  function BottomSheet(props, ref) {
    //#region extract props
    const {
      // animations configurations
      animationConfigs: _providedAnimationConfigs,

      // configurations
      index: _providedIndex = 0,
      snapPoints: _providedSnapPoints,
      animateOnMount = DEFAULT_ANIMATE_ON_MOUNT,
      enableContentPanningGesture = DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
      enableHandlePanningGesture,
      enableOverDrag = DEFAULT_ENABLE_OVER_DRAG,
      enablePanDownToClose = DEFAULT_ENABLE_PAN_DOWN_TO_CLOSE,
      enableDynamicSizing = DEFAULT_DYNAMIC_SIZING,
      overDragResistanceFactor = DEFAULT_OVER_DRAG_RESISTANCE_FACTOR,
      overrideReduceMotion: _providedOverrideReduceMotion,

      // styles
      style,
      containerStyle: _providedContainerStyle,
      backgroundStyle: _providedBackgroundStyle,
      handleStyle: _providedHandleStyle,
      handleIndicatorStyle: _providedHandleIndicatorStyle,

      // hooks
      gestureEventsHandlersHook,

      // keyboard
      keyboardBehavior = DEFAULT_KEYBOARD_BEHAVIOR,
      keyboardBlurBehavior = DEFAULT_KEYBOARD_BLUR_BEHAVIOR,
      android_keyboardInputMode = DEFAULT_KEYBOARD_INPUT_MODE,
      enableBlurKeyboardOnGesture = DEFAULT_ENABLE_BLUR_KEYBOARD_ON_GESTURE,

      // layout
      containerHeight: _providedContainerHeight,
      containerOffset: _providedContainerOffset,
      topInset = 0,
      bottomInset = 0,
      maxDynamicContentSize,

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
      onClose: _providedOnClose,
      onAnimate: _providedOnAnimate,

      // private
      $modal = false,
      detached = false,

      // components
      handleComponent,
      backdropComponent: BackdropComponent,
      backgroundComponent,
      footerComponent,
      children,

      // accessibility
      accessible: _providedAccessible = DEFAULT_ACCESSIBLE,
      accessibilityLabel:
        _providedAccessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
      accessibilityRole:
        _providedAccessibilityRole = DEFAULT_ACCESSIBILITY_ROLE,
    } = props;
    //#endregion

    //#region validate props
    if (__DEV__) {
      // biome-ignore lint/correctness/useHookAtTopLevel: used in development only.
      usePropsValidator({
        index: _providedIndex,
        snapPoints: _providedSnapPoints,
        enableDynamicSizing,
        topInset,
        bottomInset,
      });
    }
    //#endregion

    //#region layout variables
    /**
     * This variable is consider an internal variable,
     * that will be used conditionally in `animatedContainerHeight`
     */
    const _animatedContainerHeight = useReactiveSharedValue(
      _providedContainerHeight ?? INITIAL_CONTAINER_HEIGHT
    );
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
    }, [topInset, bottomInset, $modal, _animatedContainerHeight]);
    const animatedContainerOffset = useReactiveSharedValue(
      _providedContainerOffset ?? INITIAL_CONTAINER_OFFSET
    ) as SharedValue<Required<Insets>>;
    const animatedHandleHeight = useReactiveSharedValue<number>(
      INITIAL_HANDLE_HEIGHT
    );
    const animatedFooterHeight = useSharedValue(0);
    const animatedContentHeight = useSharedValue(INITIAL_CONTAINER_HEIGHT);
    const [animatedSnapPoints, animatedDynamicSnapPointIndex] =
      useAnimatedSnapPoints(
        _providedSnapPoints,
        animatedContainerHeight,
        animatedContentHeight,
        animatedHandleHeight,
        animatedFooterHeight,
        enableDynamicSizing,
        maxDynamicContentSize
      );
    const animatedHighestSnapPoint = useDerivedValue(
      () => animatedSnapPoints.value[animatedSnapPoints.value.length - 1],
      [animatedSnapPoints]
    );
    const animatedClosedPosition = useDerivedValue(() => {
      let closedPosition = animatedContainerHeight.value;

      if ($modal || detached) {
        closedPosition = animatedContainerHeight.value + bottomInset;
      }

      return closedPosition;
    }, [animatedContainerHeight, $modal, detached, bottomInset]);
    const animatedSheetHeight = useDerivedValue(
      () => animatedContainerHeight.value - animatedHighestSnapPoint.value,
      [animatedContainerHeight, animatedHighestSnapPoint]
    );
    const animatedCurrentIndex = useReactiveSharedValue(
      animateOnMount ? -1 : _providedIndex
    );
    const animatedPosition = useSharedValue(INITIAL_POSITION);
    const animatedNextPosition = useSharedValue<
      BottomSheetPosition | undefined
    >(undefined);

    // conditional
    const isAnimatedOnMount = useSharedValue(
      !animateOnMount || _providedIndex === -1
    );
    const isContentHeightFixed = useSharedValue(false);
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
      // handle component is null.
      if (handleComponent === null) {
        animatedHandleHeight.value = 0;
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
    }, [
      _providedContainerHeight,
      animatedContainerHeight,
      animatedHandleHeight,
      animatedSnapPoints,
      handleComponent,
    ]);
    const isInTemporaryPosition = useSharedValue(false);
    const isForcedClosing = useSharedValue(false);
    const animatedContainerHeightDidChange = useSharedValue(false);

    // gesture
    const animatedContentGestureState = useSharedValue<State>(
      State.UNDETERMINED
    );
    const animatedHandleGestureState = useSharedValue<State>(
      State.UNDETERMINED
    );
    //#endregion

    //#region hooks variables
    // keyboard
    const animatedKeyboardState = useAnimatedKeyboard();
    const userReduceMotionSetting = useReducedMotion();
    const reduceMotion = useMemo(() => {
      return !_providedOverrideReduceMotion ||
        _providedOverrideReduceMotion === ReduceMotion.System
        ? userReduceMotionSetting
        : _providedOverrideReduceMotion === ReduceMotion.Always;
    }, [userReduceMotionSetting, _providedOverrideReduceMotion]);
    //#endregion

    //#region state/dynamic variables
    // states
    const animatedAnimationState = useSharedValue<AnimationState>({
      status: ANIMATION_STATUS.UNDETERMINED,
      source: ANIMATION_SOURCE.MOUNT,
    });
    const animatedSheetState = useDerivedValue(() => {
      // closed position = position >= container height
      if (animatedPosition.value >= animatedClosedPosition.value) {
        return SHEET_STATE.CLOSED;
      }

      // extended position = container height - sheet height
      const extendedPosition =
        animatedContainerHeight.value - animatedSheetHeight.value;
      if (animatedPosition.value === extendedPosition) {
        return SHEET_STATE.EXTENDED;
      }

      // extended position with keyboard =
      // container height - (sheet height + keyboard height in root container)
      const keyboardHeightInContainer =
        animatedKeyboardState.get().heightWithinContainer;
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
    }, [
      animatedClosedPosition,
      animatedContainerHeight,
      animatedKeyboardState,
      animatedPosition,
      animatedSheetHeight,
      isInTemporaryPosition,
      keyboardBehavior,
    ]);
    const {
      state: animatedScrollableState,
      status: animatedScrollableStatus,
      setScrollableRef,
      removeScrollableRef,
    } = useScrollable(
      enableContentPanningGesture,
      animatedSheetState,
      animatedKeyboardState,
      animatedAnimationState
    );
    // dynamic
    const animatedIndex = useDerivedValue(() => {
      const adjustedSnapPoints = animatedSnapPoints.value.slice().reverse();
      const adjustedSnapPointsIndexes = animatedSnapPoints.value
        .slice()
        .map((_, index: number) => index)
        .reverse();

      /**
       * we add the close state index `-1`
       */
      adjustedSnapPoints.push(animatedContainerHeight.value);
      adjustedSnapPointsIndexes.push(-1);

      const currentIndex = isLayoutCalculated.value
        ? interpolate(
            animatedPosition.value,
            adjustedSnapPoints,
            adjustedSnapPointsIndexes,
            Extrapolation.CLAMP
          )
        : -1;

      const { status: animationStatus, source: animationSource } =
        animatedAnimationState.get();
      /**
       * if the sheet is currently running an animation by the keyboard opening,
       * then we clamp the index on android with resize keyboard mode.
       */
      if (
        android_keyboardInputMode === KEYBOARD_INPUT_MODE.adjustResize &&
        animationStatus === ANIMATION_STATUS.RUNNING &&
        animationSource === ANIMATION_SOURCE.KEYBOARD &&
        isInTemporaryPosition.value
      ) {
        return Math.max(animatedCurrentIndex.value, currentIndex);
      }

      /**
       * if the sheet is currently running an animation by snap point change - usually caused
       * by dynamic content height -, then we return the next position index.
       */
      const nextPosition = animatedNextPosition.get();
      if (
        animationStatus === ANIMATION_STATUS.RUNNING &&
        animationSource === ANIMATION_SOURCE.SNAP_POINT_CHANGE &&
        nextPosition
      ) {
        return nextPosition.index;
      }

      return currentIndex;
    }, [
      android_keyboardInputMode,
      animatedAnimationState,
      animatedContainerHeight,
      animatedCurrentIndex,
      animatedNextPosition,
      animatedPosition,
      animatedSnapPoints,
      isInTemporaryPosition,
      isLayoutCalculated,
    ]);
    //#endregion

    //#region private methods
    // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheet.name): used for debug only
    const handleOnChange = useCallback(
      function handleOnChange(index: number, position: number) {
        if (__DEV__) {
          print({
            component: BottomSheet.name,
            method: handleOnChange.name,
            category: 'callback',
            params: {
              index,
              animatedCurrentIndex: animatedCurrentIndex.value,
            },
          });
        }

        if (!_providedOnChange) {
          return;
        }

        _providedOnChange(
          index,
          position,
          index === animatedDynamicSnapPointIndex.value
            ? SNAP_POINT_TYPE.DYNAMIC
            : SNAP_POINT_TYPE.PROVIDED
        );
      },
      [_providedOnChange, animatedCurrentIndex, animatedDynamicSnapPointIndex]
    );
    // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheet.name): used for debug only
    const handleOnAnimate = useCallback(
      function handleOnAnimate(targetIndex: number, targetPosition: number) {
        if (__DEV__) {
          print({
            component: BottomSheet.name,
            method: handleOnAnimate.name,
            category: 'callback',
            params: {
              toIndex: targetIndex,
              toPosition: targetPosition,
              fromIndex: animatedCurrentIndex.value,
              fromPosition: animatedPosition.value,
            },
          });
        }

        if (!_providedOnAnimate) {
          return;
        }

        if (targetIndex !== animatedCurrentIndex.value) {
          _providedOnAnimate(
            animatedCurrentIndex.value,
            targetIndex,
            animatedPosition.value,
            targetPosition
          );
        }
      },
      [_providedOnAnimate, animatedCurrentIndex, animatedPosition]
    );
    //#endregion

    //#region animation
    const stopAnimation = useCallback(() => {
      'worklet';
      cancelAnimation(animatedPosition);
      animatedAnimationState.set({
        status: ANIMATION_STATUS.STOPPED,
        source: ANIMATION_SOURCE.NONE,
      });
    }, [animatedPosition, animatedAnimationState]);
    const animateToPositionCompleted = useCallback(
      function animateToPositionCompleted(isFinished?: boolean) {
        'worklet';
        if (!isFinished) {
          return;
        }

        if (__DEV__) {
          runOnJS(print)({
            component: 'BottomSheet',
            method: 'animateToPositionCompleted',
            params: {
              animatedCurrentIndex: animatedCurrentIndex.value,
              animatedNextPosition: animatedNextPosition.get()?.y,
              animatedNextPositionIndex: animatedNextPosition.get()?.index,
            },
          });
        }

        if (animatedAnimationState.get().source === ANIMATION_SOURCE.MOUNT) {
          isAnimatedOnMount.value = true;
        }

        // reset values
        isForcedClosing.value = false;
        animatedAnimationState.set({
          status: ANIMATION_STATUS.STOPPED,
          source: ANIMATION_SOURCE.NONE,
        });
        animatedNextPosition.set(undefined);
        animatedContainerHeightDidChange.value = false;
      },
      [
        animatedAnimationState,
        animatedContainerHeightDidChange,
        animatedCurrentIndex,
        animatedNextPosition,
        isAnimatedOnMount,
        isForcedClosing,
      ]
    );
    const animateToPosition: AnimateToPositionType = useCallback(
      function animateToPosition(
        position: number,
        source: ANIMATION_SOURCE,
        velocity = 0,
        configs?: WithTimingConfig | WithSpringConfig
      ) {
        'worklet';
        if (__DEV__) {
          runOnJS(print)({
            component: 'BottomSheet',
            method: 'animateToPosition',
            params: {
              currentPosition: animatedPosition.value,
              nextPosition: position,
              source,
            },
          });
        }

        if (position === undefined) {
          return;
        }

        if (position === animatedPosition.get()) {
          return;
        }

        // early exit if there is a running animation to
        // the same position
        const nextPosition = animatedNextPosition.get();
        const animationStatus = animatedAnimationState.get().status;
        if (
          animationStatus === ANIMATION_STATUS.RUNNING &&
          nextPosition &&
          position === nextPosition.y
        ) {
          return;
        }

        // stop animation if it is running
        if (animationStatus === ANIMATION_STATUS.RUNNING) {
          stopAnimation();
        }

        /**
         * set animation state to running, and source
         */
        animatedAnimationState.set({
          status: ANIMATION_STATUS.RUNNING,
          source,
        });

        /**
         * offset the position if keyboard is shown,
         * and behavior not extend.
         */
        let offset = 0;
        if (
          animatedKeyboardState.get().status === KEYBOARD_STATUS.SHOWN &&
          keyboardBehavior !== KEYBOARD_BEHAVIOR.extend &&
          position < animatedPosition.value
        ) {
          offset = animatedKeyboardState.get().heightWithinContainer;
        }
        const index = animatedSnapPoints.value.indexOf(position + offset);
        animatedNextPosition.set({
          index,
          y: position,
        });

        /**
         * fire `onAnimate` callback
         */
        runOnJS(handleOnAnimate)(index, position);

        /**
         * start animation
         */
        animatedPosition.value = animate({
          point: position,
          configs: configs || _providedAnimationConfigs,
          velocity,
          overrideReduceMotion: _providedOverrideReduceMotion,
          onComplete: animateToPositionCompleted,
        });
      },
      [
        handleOnAnimate,
        keyboardBehavior,
        _providedAnimationConfigs,
        _providedOverrideReduceMotion,
        animateToPositionCompleted,
        animatedAnimationState,
        animatedKeyboardState,
        animatedNextPosition,
        animatedPosition,
        animatedSnapPoints,
        stopAnimation,
      ]
    );
    /**
     * Set to position without animation.
     *
     * @param targetPosition position to be set.
     */
    const setToPosition = useCallback(
      function setToPosition(targetPosition: number) {
        'worklet';
        if (!targetPosition) {
          return;
        }

        if (targetPosition === animatedPosition.get()) {
          return;
        }

        // early exit if there is a running animation to
        // the same position
        const nextPosition = animatedNextPosition.get();
        if (
          animatedAnimationState.get().status === ANIMATION_STATUS.RUNNING &&
          nextPosition &&
          targetPosition === nextPosition.y
        ) {
          return;
        }

        if (__DEV__) {
          runOnJS(print)({
            component: 'BottomSheet',
            method: 'setToPosition',
            params: {
              currentPosition: animatedPosition.value,
              targetPosition,
            },
          });
        }

        /**
         * store next position
         */
        animatedNextPosition.set({
          index: animatedSnapPoints.get().indexOf(targetPosition),
          y: targetPosition,
        });

        stopAnimation();

        // set values
        animatedPosition.value = targetPosition;
        animatedContainerHeightDidChange.value = false;
      },
      [
        animatedAnimationState,
        animatedPosition,
        animatedContainerHeightDidChange,
        animatedNextPosition,
        animatedSnapPoints,
        stopAnimation,
      ]
    );
    //#endregion

    //#region private methods
    /**
     * Calculate and evaluate the current position based on multiple
     * local states.
     */
    const getEvaluatedPosition = useCallback(
      function getEvaluatedPosition(source: ANIMATION_SOURCE) {
        'worklet';
        const currentIndex = animatedCurrentIndex.value;
        const snapPoints = animatedSnapPoints.value;
        const keyboardStatus = animatedKeyboardState.get().status;
        const highestSnapPoint = animatedHighestSnapPoint.value;

        /**
         * if the keyboard blur behavior is restore and keyboard is hidden,
         * then we return the previous snap point.
         */
        if (
          source === ANIMATION_SOURCE.KEYBOARD &&
          keyboardBlurBehavior === KEYBOARD_BLUR_BEHAVIOR.restore &&
          keyboardStatus === KEYBOARD_STATUS.HIDDEN &&
          animatedContentGestureState.value !== State.ACTIVE &&
          animatedHandleGestureState.value !== State.ACTIVE
        ) {
          isInTemporaryPosition.value = false;
          const nextPosition = snapPoints[currentIndex];
          return nextPosition;
        }

        /**
         * if the keyboard appearance behavior is extend and keyboard is shown,
         * then we return the heights snap point.
         */
        if (
          keyboardBehavior === KEYBOARD_BEHAVIOR.extend &&
          keyboardStatus === KEYBOARD_STATUS.SHOWN
        ) {
          return highestSnapPoint;
        }

        /**
         * if the keyboard appearance behavior is fill parent and keyboard is shown,
         * then we return 0 ( full screen ).
         */
        if (
          keyboardBehavior === KEYBOARD_BEHAVIOR.fillParent &&
          keyboardStatus === KEYBOARD_STATUS.SHOWN
        ) {
          isInTemporaryPosition.value = true;
          return 0;
        }

        /**
         * if the keyboard appearance behavior is interactive and keyboard is shown,
         * then we return the heights points minus the keyboard in container height.
         */
        if (
          keyboardBehavior === KEYBOARD_BEHAVIOR.interactive &&
          keyboardStatus === KEYBOARD_STATUS.SHOWN &&
          // ensure that this logic does not run on android
          // with resize input mode
          !(
            Platform.OS === 'android' &&
            android_keyboardInputMode === 'adjustResize'
          )
        ) {
          isInTemporaryPosition.value = true;
          const keyboardHeightInContainer =
            animatedKeyboardState.get().heightWithinContainer;
          return Math.max(0, highestSnapPoint - keyboardHeightInContainer);
        }

        /**
         * if the bottom sheet is in temporary position, then we return
         * the current position.
         */
        if (isInTemporaryPosition.value) {
          return animatedPosition.value;
        }

        /**
         * if the bottom sheet did not animate on mount,
         * then we return the provided index or the closed position.
         */
        if (!isAnimatedOnMount.value) {
          return _providedIndex === -1
            ? animatedClosedPosition.value
            : snapPoints[_providedIndex];
        }

        /**
         * return the current index position.
         */
        return snapPoints[currentIndex];
      },
      [
        animatedContentGestureState,
        animatedCurrentIndex,
        animatedHandleGestureState,
        animatedHighestSnapPoint,
        animatedKeyboardState,
        animatedPosition,
        animatedSnapPoints,
        isInTemporaryPosition,
        isAnimatedOnMount,
        keyboardBehavior,
        keyboardBlurBehavior,
        _providedIndex,
        android_keyboardInputMode,
        animatedClosedPosition,
      ]
    );

    /**
     * Evaluate the bottom sheet position based based on a event source and other local states.
     */
    const evaluatePosition = useCallback(
      function evaluatePosition(
        source: ANIMATION_SOURCE,
        animationConfigs?: WithSpringConfig | WithTimingConfig
      ) {
        'worklet';
        /**
         * if a force closing is running and source not from user, then we early exit
         */
        if (isForcedClosing.value && source !== ANIMATION_SOURCE.USER) {
          return;
        }
        /**
         * when evaluating the position while layout is not calculated, then we early exit till it is.
         */
        if (!isLayoutCalculated.value) {
          return;
        }

        const proposedPosition = getEvaluatedPosition(source);

        /**
         * when evaluating the position while the mount animation not been handled,
         * then we evaluate on mount use cases.
         */
        if (!isAnimatedOnMount.value) {
          /**
           * if animate on mount is set to true, then we animate to the propose position,
           * else, we set the position with out animation.
           */
          if (animateOnMount) {
            animateToPosition(
              proposedPosition,
              ANIMATION_SOURCE.MOUNT,
              undefined,
              animationConfigs
            );
          } else {
            setToPosition(proposedPosition);
            isAnimatedOnMount.value = true;
          }
          return;
        }

        const { status: animationStatus } = animatedAnimationState.get();
        /**
         * when evaluating the position while the bottom sheet is animating.
         */
        if (animationStatus === ANIMATION_STATUS.RUNNING) {
          const nextPositionIndex =
            animatedNextPosition.get()?.index ?? INITIAL_VALUE;
          /**
           * when evaluating the position while the bottom sheet is
           * closing, then we force closing the bottom sheet with no animation.
           */
          if (nextPositionIndex === -1 && !isInTemporaryPosition.value) {
            setToPosition(animatedClosedPosition.value);
            return;
          }

          /**
           * when evaluating the position while it's animating to
           * a position other than the current position, then we
           * restart the animation.
           */
          if (nextPositionIndex !== animatedCurrentIndex.value) {
            animateToPosition(
              animatedSnapPoints.value[nextPositionIndex],
              source,
              undefined,
              animationConfigs
            );
            return;
          }
        }

        /**
         * when evaluating the position while the bottom sheet is in closed
         * position and not animating, we re-set the position to closed position.
         */
        if (
          animationStatus !== ANIMATION_STATUS.RUNNING &&
          animatedCurrentIndex.value === -1
        ) {
          /**
           * early exit if reduce motion is enabled and index is out of sync with position.
           */
          if (
            reduceMotion &&
            animatedSnapPoints.value[animatedIndex.value] !==
              animatedPosition.value
          ) {
            return;
          }
          setToPosition(animatedClosedPosition.value);
          return;
        }

        /**
         * when evaluating the position after the container resize, then we
         * force the bottom sheet to the proposed position with no
         * animation.
         */
        if (animatedContainerHeightDidChange.value) {
          setToPosition(proposedPosition);
          return;
        }

        /**
         * we fall back to the proposed position.
         */
        animateToPosition(
          proposedPosition,
          source,
          undefined,
          animationConfigs
        );
      },
      [
        getEvaluatedPosition,
        animateToPosition,
        setToPosition,
        reduceMotion,
        animateOnMount,
        animatedAnimationState,
        animatedClosedPosition,
        animatedContainerHeightDidChange,
        animatedCurrentIndex,
        animatedIndex,
        animatedNextPosition,
        animatedPosition,
        animatedSnapPoints,
        isAnimatedOnMount,
        isForcedClosing,
        isInTemporaryPosition,
        isLayoutCalculated,
      ]
    );
    //#endregion

    //#region public methods
    const handleSnapToIndex = useStableCallback(function handleSnapToIndex(
      index: number,
      animationConfigs?: WithSpringConfig | WithTimingConfig
    ) {
      const snapPoints = animatedSnapPoints.get();
      const isLayoutReady = isLayoutCalculated.get();

      // early exit if layout is not ready yet.
      if (!isLayoutReady) {
        return;
      }

      invariant(
        index >= -1 && index <= snapPoints.length - 1,
        `'index' was provided but out of the provided snap points range! expected value to be between -1, ${
          snapPoints.length - 1
        }`
      );
      if (__DEV__) {
        print({
          component: BottomSheet.name,
          method: handleSnapToIndex.name,
          params: {
            index,
          },
        });
      }

      const targetPosition = snapPoints[index];

      /**
       * exit method if :
       * - layout is not calculated.
       * - already animating to next position.
       * - sheet is forced closing.
       */
      const nextPosition = animatedNextPosition.get();
      if (
        !isLayoutCalculated.value ||
        (nextPosition && index === nextPosition.index) ||
        (nextPosition && targetPosition === nextPosition.y) ||
        isForcedClosing.value
      ) {
        return;
      }

      /**
       * reset temporary position boolean.
       */
      isInTemporaryPosition.value = false;

      runOnUI(animateToPosition)(
        targetPosition,
        ANIMATION_SOURCE.USER,
        0,
        animationConfigs
      );
    });
    const handleSnapToPosition = useCallback(
      function handleSnapToPosition(
        position: number | string,
        animationConfigs?: WithSpringConfig | WithTimingConfig
      ) {
        'worklet';
        if (__DEV__) {
          print({
            component: 'BottomSheet',
            method: handleSnapToPosition.name,
            params: {
              position,
            },
          });
        }

        /**
         * normalized provided position.
         */
        const targetPosition = normalizeSnapPoint(
          position,
          animatedContainerHeight.value
        );

        /**
         * exit method if :
         * - layout is not calculated.
         * - already animating to next position.
         * - sheet is forced closing.
         */
        const nextPosition = animatedNextPosition.get();
        if (
          !isLayoutCalculated ||
          (nextPosition && targetPosition === nextPosition.y) ||
          isForcedClosing.value
        ) {
          return;
        }

        /**
         * mark the new position as temporary.
         */
        isInTemporaryPosition.value = true;

        runOnUI(animateToPosition)(
          targetPosition,
          ANIMATION_SOURCE.USER,
          0,
          animationConfigs
        );
      },
      [
        animateToPosition,
        isLayoutCalculated,
        isForcedClosing,
        animatedContainerHeight,
        animatedNextPosition,
        isInTemporaryPosition,
      ]
    );
    // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheet.name): used for debug only
    const handleClose = useCallback(
      function handleClose(
        animationConfigs?: WithSpringConfig | WithTimingConfig
      ) {
        if (__DEV__) {
          print({
            component: BottomSheet.name,
            method: handleClose.name,
          });
        }

        const targetPosition = animatedClosedPosition.value;

        /**
         * exit method if :
         * - layout is not calculated.
         * - already animating to next position.
         * - sheet is forced closing.
         */
        const nextPosition = animatedNextPosition.get();
        if (
          !isLayoutCalculated.value ||
          (nextPosition && targetPosition === nextPosition.y) ||
          isForcedClosing.value
        ) {
          return;
        }

        /**
         * reset temporary position variable.
         */
        isInTemporaryPosition.value = false;

        runOnUI(animateToPosition)(
          targetPosition,
          ANIMATION_SOURCE.USER,
          0,
          animationConfigs
        );
      },
      [
        animateToPosition,
        isForcedClosing,
        isLayoutCalculated,
        isInTemporaryPosition,
        animatedNextPosition,
        animatedClosedPosition,
      ]
    );
    // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheet.name): used for debug only
    const handleForceClose = useCallback(
      function handleForceClose(
        animationConfigs?: WithSpringConfig | WithTimingConfig
      ) {
        if (__DEV__) {
          print({
            component: BottomSheet.name,
            method: handleForceClose.name,
          });
        }

        const targetPosition = animatedClosedPosition.value;

        /**
         * exit method if :
         * - already animating to next position.
         * - sheet is forced closing.
         */
        const nextPosition = animatedNextPosition.get();
        if (
          (nextPosition && targetPosition === nextPosition.y) ||
          isForcedClosing.value
        ) {
          return;
        }

        /**
         * reset temporary position variable.
         */
        isInTemporaryPosition.value = false;

        /**
         * set force closing variable.
         */
        isForcedClosing.value = true;

        runOnUI(animateToPosition)(
          targetPosition,
          ANIMATION_SOURCE.USER,
          0,
          animationConfigs
        );
      },
      [
        animateToPosition,
        isForcedClosing,
        isInTemporaryPosition,
        animatedNextPosition,
        animatedClosedPosition,
      ]
    );
    // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheet.name): used for debug only
    const handleExpand = useCallback(
      function handleExpand(
        animationConfigs?: WithSpringConfig | WithTimingConfig
      ) {
        if (__DEV__) {
          print({
            component: BottomSheet.name,
            method: handleExpand.name,
          });
        }

        const snapPoints = animatedSnapPoints.value;
        const targetIndex = snapPoints.length - 1;
        const targetPosition = snapPoints[targetIndex];

        /**
         * exit method if :
         * - layout is not calculated.
         * - already animating to next position.
         * - sheet is forced closing.
         */
        const nextPosition = animatedNextPosition.get();
        if (
          !isLayoutCalculated.value ||
          (nextPosition && targetIndex === nextPosition.index) ||
          (nextPosition && targetPosition === nextPosition.y) ||
          isForcedClosing.value
        ) {
          return;
        }

        /**
         * reset temporary position boolean.
         */
        isInTemporaryPosition.value = false;

        runOnUI(animateToPosition)(
          targetPosition,
          ANIMATION_SOURCE.USER,
          0,
          animationConfigs
        );
      },
      [
        animateToPosition,
        isInTemporaryPosition,
        isLayoutCalculated,
        isForcedClosing,
        animatedSnapPoints,
        animatedNextPosition,
      ]
    );
    // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheet.name): used for debug only
    const handleCollapse = useCallback(
      function handleCollapse(
        animationConfigs?: WithSpringConfig | WithTimingConfig
      ) {
        if (__DEV__) {
          print({
            component: BottomSheet.name,
            method: handleCollapse.name,
          });
        }

        const targetPosition = animatedSnapPoints.value[0];

        /**
         * exit method if :
         * - layout is not calculated.
         * - already animating to next position.
         * - sheet is forced closing.
         */
        const nextPosition = animatedNextPosition.get();
        if (
          !isLayoutCalculated ||
          (nextPosition && nextPosition.index === 0) ||
          (nextPosition && targetPosition === nextPosition.y) ||
          isForcedClosing.value
        ) {
          return;
        }

        /**
         * reset temporary position boolean.
         */
        isInTemporaryPosition.value = false;

        runOnUI(animateToPosition)(
          targetPosition,
          ANIMATION_SOURCE.USER,
          0,
          animationConfigs
        );
      },
      [
        animateToPosition,
        isForcedClosing,
        isLayoutCalculated,
        isInTemporaryPosition,
        animatedSnapPoints,
        animatedNextPosition,
      ]
    );

    useImperativeHandle(ref, () => ({
      snapToIndex: handleSnapToIndex,
      snapToPosition: handleSnapToPosition,
      expand: handleExpand,
      collapse: handleCollapse,
      close: handleClose,
      forceClose: handleForceClose,
    }));
    //#endregion

    //#region contexts variables
    const internalContextVariables = useMemo(
      () => ({
        enableContentPanningGesture,
        enableDynamicSizing,
        overDragResistanceFactor,
        enableOverDrag,
        enablePanDownToClose,
        animatedAnimationState,
        animatedSheetState,
        animatedScrollableState,
        animatedScrollableStatus,
        animatedContentGestureState,
        animatedHandleGestureState,
        animatedKeyboardState,
        animatedIndex,
        animatedPosition,
        animatedSheetHeight,
        animatedContentHeight,
        animatedClosedPosition,
        animatedHandleHeight,
        animatedFooterHeight,
        animatedContainerHeight,
        animatedSnapPoints,
        animatedHighestSnapPoint,
        isInTemporaryPosition,
        isContentHeightFixed,
        simultaneousHandlers: _providedSimultaneousHandlers,
        waitFor: _providedWaitFor,
        activeOffsetX: _providedActiveOffsetX,
        activeOffsetY: _providedActiveOffsetY,
        failOffsetX: _providedFailOffsetX,
        failOffsetY: _providedFailOffsetY,
        enableBlurKeyboardOnGesture,
        animateToPosition,
        stopAnimation,
        setScrollableRef,
        removeScrollableRef,
      }),
      [
        animatedIndex,
        animatedPosition,
        animatedContentHeight,
        animatedSheetHeight,
        animatedContentGestureState,
        animatedHandleGestureState,
        animatedClosedPosition,
        animatedFooterHeight,
        animatedContainerHeight,
        animatedHandleHeight,
        animatedAnimationState,
        animatedKeyboardState,
        animatedSheetState,
        animatedHighestSnapPoint,
        animatedScrollableState,
        animatedScrollableStatus,
        animatedSnapPoints,
        isContentHeightFixed,
        isInTemporaryPosition,
        enableContentPanningGesture,
        overDragResistanceFactor,
        enableOverDrag,
        enablePanDownToClose,
        enableDynamicSizing,
        enableBlurKeyboardOnGesture,
        _providedSimultaneousHandlers,
        _providedWaitFor,
        _providedActiveOffsetX,
        _providedActiveOffsetY,
        _providedFailOffsetX,
        _providedFailOffsetY,
        setScrollableRef,
        removeScrollableRef,
        animateToPosition,
        stopAnimation,
      ]
    );
    const externalContextVariables = useMemo(
      () => ({
        animatedIndex,
        animatedPosition,
        snapToIndex: handleSnapToIndex,
        snapToPosition: handleSnapToPosition,
        expand: handleExpand,
        collapse: handleCollapse,
        close: handleClose,
        forceClose: handleForceClose,
      }),
      [
        animatedIndex,
        animatedPosition,
        handleSnapToIndex,
        handleSnapToPosition,
        handleExpand,
        handleCollapse,
        handleClose,
        handleForceClose,
      ]
    );
    //#endregion

    //#region effects
    useAnimatedReaction(
      () => animatedContainerHeight.value,
      (result, previous) => {
        if (result === INITIAL_CONTAINER_HEIGHT) {
          return;
        }

        animatedContainerHeightDidChange.value = result !== previous;

        /**
         * When user close the bottom sheet while the keyboard open on Android with
         * software keyboard layout mode set to resize, the close position would be
         * set to the container height - the keyboard height, and when the keyboard
         * closes, the container height and here we restart the animation again.
         *
         * [read more](https://github.com/gorhom/react-native-bottom-sheet/issues/2163)
         */
        const { status: animationStatus, source: animationSource } =
          animatedAnimationState.get();
        if (
          animationStatus === ANIMATION_STATUS.RUNNING &&
          animationSource === ANIMATION_SOURCE.GESTURE &&
          animatedNextPosition.get()?.index === -1
        ) {
          animateToPosition(
            animatedClosedPosition.value,
            ANIMATION_SOURCE.GESTURE
          );
        }
      },
      [
        animatedContainerHeightDidChange,
        animatedAnimationState,
        animatedNextPosition,
        animatedClosedPosition,
      ]
    );

    /**
     * Reaction to the `snapPoints` change, to insure that the sheet position reflect
     * to the current point correctly.
     *
     * @alias OnSnapPointsChange
     */
    useAnimatedReaction(
      () => animatedSnapPoints.value,
      (result, previous) => {
        /**
         * if values did not change, and did handle on mount animation
         * then we early exit the method.
         */
        if (
          JSON.stringify(result) === JSON.stringify(previous) &&
          isAnimatedOnMount.value
        ) {
          return;
        }

        /**
         * if layout is not calculated yet, then we exit the method.
         */
        if (!isLayoutCalculated.value) {
          return;
        }

        if (__DEV__) {
          runOnJS(print)({
            component: 'BottomSheet',
            method: 'useAnimatedReaction::OnSnapPointChange',
            category: 'effect',
            params: {
              result,
            },
          });
        }

        evaluatePosition(ANIMATION_SOURCE.SNAP_POINT_CHANGE);
      },
      [isLayoutCalculated, animatedSnapPoints]
    );

    /**
     * Reaction to the keyboard state change.
     *
     * @alias OnKeyboardStateChange
     */
    useAnimatedReaction(
      () =>
        animatedKeyboardState.get().status + animatedKeyboardState.get().height,
      (result, _previousResult) => {
        /**
         * if keyboard state is equal to the previous state, then exit the method
         */
        if (result === _previousResult) {
          return;
        }

        const { status, height, easing, duration, target } =
          animatedKeyboardState.get();

        /**
         * if state is undetermined, then we early exit.
         */
        if (status === KEYBOARD_STATUS.UNDETERMINED) {
          return;
        }

        const { status: animationStatus, source: animationSource } =
          animatedAnimationState.get();
        /**
         * if keyboard is hidden by customer gesture, then we early exit.
         */
        if (
          status === KEYBOARD_STATUS.HIDDEN &&
          animationStatus === ANIMATION_STATUS.RUNNING &&
          animationSource === ANIMATION_SOURCE.GESTURE
        ) {
          return;
        }

        if (__DEV__) {
          runOnJS(print)({
            component: 'BottomSheet',
            method: 'useAnimatedReaction::OnKeyboardStateChange',
            category: 'effect',
            params: {
              status,
              height,
            },
          });
        }

        /**
         * Calculate the keyboard height in the container.
         */
        let heightWithinContainer =
          height === 0
            ? 0
            : $modal
              ? Math.abs(
                  height -
                    Math.abs(bottomInset - animatedContainerOffset.value.bottom)
                )
              : Math.abs(height - animatedContainerOffset.value.bottom);

        /**
         * if platform is android and the input mode is resize, then exit the method
         */
        if (
          Platform.OS === 'android' &&
          android_keyboardInputMode === KEYBOARD_INPUT_MODE.adjustResize
        ) {
          heightWithinContainer = 0;

          if (keyboardBehavior === KEYBOARD_BEHAVIOR.interactive) {
            animatedKeyboardState.set({
              target,
              status,
              height,
              easing,
              duration,
              heightWithinContainer,
            });
            return;
          }
        }
        animatedKeyboardState.set({
          target,
          status,
          height,
          easing,
          duration,
          heightWithinContainer,
        });

        /**
         * if user is interacting with sheet, then exit the method
         */
        const hasActiveGesture =
          animatedContentGestureState.value === State.ACTIVE ||
          animatedContentGestureState.value === State.BEGAN ||
          animatedHandleGestureState.value === State.ACTIVE ||
          animatedHandleGestureState.value === State.BEGAN;
        if (hasActiveGesture) {
          return;
        }

        /**
         * if new keyboard state is hidden and blur behavior is none, then exit the method
         */
        if (
          status === KEYBOARD_STATUS.HIDDEN &&
          keyboardBlurBehavior === KEYBOARD_BLUR_BEHAVIOR.none
        ) {
          return;
        }

        const animationConfigs = getKeyboardAnimationConfigs(easing, duration);
        evaluatePosition(ANIMATION_SOURCE.KEYBOARD, animationConfigs);
      },
      [
        $modal,
        bottomInset,
        keyboardBehavior,
        keyboardBlurBehavior,
        android_keyboardInputMode,
        animatedKeyboardState,
        animatedContainerOffset,
        getEvaluatedPosition,
      ]
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
      },
      [_providedAnimatedPosition, topInset]
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
      },
      [_providedAnimatedIndex]
    );

    /**
     * React to internal variables to detect change in snap position.
     *
     * @alias OnChange
     */
    useAnimatedReaction(
      () => ({
        _animatedIndex: animatedIndex.value,
        _animatedPosition: animatedPosition.value,
        _animationStatus: animatedAnimationState.get().status,
        _contentGestureState: animatedContentGestureState.value,
        _handleGestureState: animatedHandleGestureState.value,
      }),
      ({
        _animatedIndex,
        _animatedPosition,
        _animationStatus,
        _contentGestureState,
        _handleGestureState,
      }) => {
        /**
         * exit the method if animation state is not stopped.
         */
        if (_animationStatus !== ANIMATION_STATUS.STOPPED) {
          return;
        }

        /**
         * exit the method if index value is not synced with
         * position value.
         *
         * [read more](https://github.com/gorhom/react-native-bottom-sheet/issues/1356)
         */
        const nextPosition = animatedNextPosition.get();
        if (
          nextPosition &&
          (_animatedPosition !== nextPosition.y ||
            _animatedIndex !== nextPosition.index)
        ) {
          return;
        }

        /**
         * exit the method if animated index value
         * has fraction, e.g. 1.99, 0.52
         */
        if (_animatedIndex % 1 !== 0) {
          return;
        }

        /**
         * exit the method if there any active gesture.
         */
        const hasNoActiveGesture =
          (_contentGestureState === State.END ||
            _contentGestureState === State.UNDETERMINED ||
            _contentGestureState === State.CANCELLED) &&
          (_handleGestureState === State.END ||
            _handleGestureState === State.UNDETERMINED ||
            _handleGestureState === State.CANCELLED);
        if (!hasNoActiveGesture) {
          return;
        }

        /**
         * exit the method if the animated index is out of sync with the
         * animated position. this happened when the user enable reduce
         * motion setting only.
         */
        if (
          reduceMotion &&
          _animatedIndex === animatedCurrentIndex.value &&
          animatedSnapPoints.value[_animatedIndex] !== _animatedPosition
        ) {
          return;
        }

        /**
         * if the index is not equal to the current index,
         * than the sheet position had changed and we trigger
         * the `onChange` callback.
         */
        if (_animatedIndex !== animatedCurrentIndex.value) {
          if (__DEV__) {
            runOnJS(print)({
              component: BottomSheet.name,
              method: 'useAnimatedReaction::OnChange',
              category: 'effect',
              params: {
                animatedCurrentIndex: animatedCurrentIndex.value,
                animatedIndex: _animatedIndex,
              },
            });
          }

          animatedCurrentIndex.value = _animatedIndex;
          runOnJS(handleOnChange)(_animatedIndex, _animatedPosition);
        }

        /**
         * if index is `-1` than we fire the `onClose` callback.
         */
        if (_animatedIndex === -1 && _providedOnClose) {
          if (__DEV__) {
            runOnJS(print)({
              component: BottomSheet.name,
              method: 'useAnimatedReaction::onClose',
              category: 'effect',
              params: {
                animatedCurrentIndex: animatedCurrentIndex.value,
                animatedIndex: _animatedIndex,
              },
            });
          }
          runOnJS(_providedOnClose)();
        }
      },
      [reduceMotion, handleOnChange, _providedOnClose]
    );

    /**
     * React to `index` prop to snap the sheet to the new position.
     *
     * @alias onIndexChange
     */
    useEffect(() => {
      // early exit, if animate on mount is set and it did not animate yet.
      if (animateOnMount && !isAnimatedOnMount.value) {
        return;
      }

      handleSnapToIndex(_providedIndex);
    }, [animateOnMount, _providedIndex, isAnimatedOnMount, handleSnapToIndex]);
    //#endregion

    // render
    return (
      <BottomSheetProvider value={externalContextVariables}>
        <BottomSheetInternalProvider value={internalContextVariables}>
          <BottomSheetGestureHandlersProvider
            gestureEventsHandlersHook={gestureEventsHandlersHook}
          >
            {BackdropComponent ? (
              <BackdropComponent
                animatedIndex={animatedIndex}
                animatedPosition={animatedPosition}
                style={StyleSheet.absoluteFillObject}
              />
            ) : null}
            <BottomSheetHostingContainer
              key="BottomSheetContainer"
              shouldCalculateHeight={!$modal}
              containerHeight={_animatedContainerHeight}
              containerOffset={animatedContainerOffset}
              topInset={topInset}
              bottomInset={bottomInset}
              detached={detached}
              style={_providedContainerStyle}
            >
              <BottomSheetBody style={style}>
                {backgroundComponent === null ? null : (
                  <BottomSheetBackgroundContainer
                    key="BottomSheetBackgroundContainer"
                    animatedIndex={animatedIndex}
                    animatedPosition={animatedPosition}
                    backgroundComponent={backgroundComponent}
                    backgroundStyle={_providedBackgroundStyle}
                  />
                )}
                <BottomSheetContent
                  pointerEvents="box-none"
                  accessible={_providedAccessible ?? undefined}
                  accessibilityRole={_providedAccessibilityRole ?? undefined}
                  accessibilityLabel={_providedAccessibilityLabel ?? undefined}
                  keyboardBehavior={keyboardBehavior}
                  detached={detached}
                >
                  {children}
                  {footerComponent ? (
                    <BottomSheetFooterContainer
                      footerComponent={footerComponent}
                    />
                  ) : null}
                </BottomSheetContent>
                {handleComponent !== null ? (
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
                    handleComponent={handleComponent}
                    handleStyle={_providedHandleStyle}
                    handleIndicatorStyle={_providedHandleIndicatorStyle}
                  />
                ) : null}
              </BottomSheetBody>
              {/* <BottomSheetDebugView
                values={{
                  // topInset,
                  // bottomInset,
                  animatedSheetState,
                  // animatedScrollableState,
                  // isScrollableRefreshable,
                  // animatedScrollableContentOffsetY,
                  // keyboardState,
                  animatedIndex,
                  animatedCurrentIndex,
                  animatedPosition,
                  // animatedHandleGestureState,
                  // animatedContentGestureState,
                  animatedContainerHeight,
                  animatedHighestSnapPoint,
                  animatedSheetHeight,
                  animatedHandleHeight,
                  animatedContentHeight,
                  animatedFooterHeight,
                  animatedKeyboardHeight,
                  // // keyboardHeight,
                  // isLayoutCalculated,
                  // isContentHeightFixed,
                  // isInTemporaryPosition,
                }}
              /> */}
            </BottomSheetHostingContainer>
          </BottomSheetGestureHandlersProvider>
        </BottomSheetInternalProvider>
      </BottomSheetProvider>
    );
  }
);

const BottomSheet = memo(BottomSheetComponent);
BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;
