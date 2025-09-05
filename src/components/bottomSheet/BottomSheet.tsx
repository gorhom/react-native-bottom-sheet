import invariant from 'invariant';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Platform, StyleSheet } from 'react-native';
import { State } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Extrapolation,
  interpolate,
  ReduceMotion,
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated';
import {
  ANIMATION_SOURCE,
  ANIMATION_STATUS,
  INITIAL_LAYOUT_VALUE,
  KEYBOARD_BEHAVIOR,
  KEYBOARD_BLUR_BEHAVIOR,
  KEYBOARD_INPUT_MODE,
  KEYBOARD_STATUS,
  SHEET_STATE,
  SNAP_POINT_TYPE,
} from '../../constants';
import {
  BottomSheetInternalProvider,
  BottomSheetProvider,
} from '../../contexts';
import {
  useAnimatedDetents,
  useAnimatedKeyboard,
  useAnimatedLayout,
  usePropsValidator,
  useReactiveSharedValue,
  useScrollable,
  useStableCallback,
} from '../../hooks';
import type { AnimationState, BottomSheetMethods } from '../../types';
import {
  animate,
  getKeyboardAnimationConfigs,
  normalizeSnapPoint,
  print,
} from '../../utilities';
import { BottomSheetBackgroundContainer } from '../bottomSheetBackground';
// import BottomSheetDebugView from '../bottomSheetDebugView';
import { BottomSheetFooterContainer } from '../bottomSheetFooter';
import BottomSheetGestureHandlersProvider from '../bottomSheetGestureHandlersProvider';
import {
  BottomSheetHandle,
  BottomSheetHandleContainer,
} from '../bottomSheetHandle';
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
  DEFAULT_KEYBOARD_INDEX,
  DEFAULT_KEYBOARD_INPUT_MODE,
  DEFAULT_OVER_DRAG_RESISTANCE_FACTOR,
  INITIAL_POSITION,
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
      containerLayoutState,
      topInset = 0,
      bottomInset = 0,
      maxDynamicContentSize,
      containerHeight,
      containerOffset,

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
      handleComponent = BottomSheetHandle,
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
        containerHeight,
        containerOffset,
      });
    }
    //#endregion

    //#region layout variables
    const animatedLayoutState = useAnimatedLayout(
      containerLayoutState,
      topInset,
      bottomInset,
      $modal,
      handleComponent === null
    );
    const animatedDetentsState = useAnimatedDetents(
      _providedSnapPoints,
      animatedLayoutState,
      enableDynamicSizing,
      maxDynamicContentSize,
      detached,
      $modal,
      bottomInset
    );
    const animatedSheetHeight = useDerivedValue(() => {
      const { containerHeight } = animatedLayoutState.get();
      const { highestDetentPosition } = animatedDetentsState.get();

      if (highestDetentPosition === undefined) {
        return INITIAL_LAYOUT_VALUE;
      }

      return containerHeight - highestDetentPosition;
    }, [animatedLayoutState, animatedDetentsState]);
    const animatedCurrentIndex = useReactiveSharedValue(
      animateOnMount ? -1 : _providedIndex
    );
    const animatedPosition = useSharedValue(INITIAL_POSITION);

    // conditional
    const isAnimatedOnMount = useSharedValue(
      !animateOnMount || _providedIndex === -1
    );
    const isLayoutCalculated = useDerivedValue(() => {
      let isContainerHeightCalculated = false;
      const { containerHeight, handleHeight } = animatedLayoutState.get();
      //container height was provided.
      if (containerHeight !== null || containerHeight !== undefined) {
        isContainerHeightCalculated = true;
      }
      // container height did set.
      if (containerHeight !== INITIAL_LAYOUT_VALUE) {
        isContainerHeightCalculated = true;
      }

      let isHandleHeightCalculated = false;
      // handle component is null.
      if (handleComponent === null) {
        isHandleHeightCalculated = true;
      }
      // handle height did set.
      if (handleHeight !== INITIAL_LAYOUT_VALUE) {
        isHandleHeightCalculated = true;
      }

      let isSnapPointsNormalized = false;
      const { detents } = animatedDetentsState.get();
      // the first snap point did normalized
      if (detents) {
        isSnapPointsNormalized = true;
      }

      return (
        isContainerHeightCalculated &&
        isHandleHeightCalculated &&
        isSnapPointsNormalized
      );
    }, [animatedLayoutState, animatedDetentsState, handleComponent]);
    const isInTemporaryPosition = useSharedValue(false);
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
    const { state: animatedKeyboardState, textInputNodesRef } =
      useAnimatedKeyboard();
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
      const { detents, closedDetentPosition } = animatedDetentsState.get();

      if (
        !detents ||
        detents.length === 0 ||
        closedDetentPosition === undefined
      ) {
        return SHEET_STATE.CLOSED;
      }

      // closed position = position >= container height
      if (animatedPosition.value >= closedDetentPosition) {
        return SHEET_STATE.CLOSED;
      }

      const { containerHeight } = animatedLayoutState.get();
      // extended position = container height - sheet height
      const extendedPosition = containerHeight - animatedSheetHeight.value;
      if (animatedPosition.value === extendedPosition) {
        return SHEET_STATE.EXTENDED;
      }

      // extended position with keyboard =
      // container height - (sheet height + keyboard height in root container)
      const keyboardHeightInContainer =
        animatedKeyboardState.get().heightWithinContainer;
      const extendedPositionWithKeyboard = Math.max(
        0,
        containerHeight -
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
      animatedLayoutState,
      animatedDetentsState,
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
      const { detents } = animatedDetentsState.get();
      if (!detents || detents.length === 0) {
        return -1;
      }

      const adjustedSnapPoints = detents.slice().reverse();
      const adjustedSnapPointsIndexes = detents
        .slice()
        .map((_, index: number) => index)
        .reverse();

      const { containerHeight } = animatedLayoutState.get();
      /**
       * we add the close state index `-1`
       */
      adjustedSnapPoints.push(containerHeight);
      adjustedSnapPointsIndexes.push(-1);

      const currentIndex = isLayoutCalculated.value
        ? interpolate(
            animatedPosition.value,
            adjustedSnapPoints,
            adjustedSnapPointsIndexes,
            Extrapolation.CLAMP
          )
        : -1;

      const {
        status: animationStatus,
        source: animationSource,
        nextIndex,
        nextPosition,
      } = animatedAnimationState.get();
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
      if (
        animationStatus === ANIMATION_STATUS.RUNNING &&
        animationSource === ANIMATION_SOURCE.SNAP_POINT_CHANGE &&
        nextIndex !== undefined &&
        nextPosition !== undefined
      ) {
        return nextIndex;
      }

      return currentIndex;
    }, [
      android_keyboardInputMode,
      animatedAnimationState,
      animatedLayoutState,
      animatedCurrentIndex,
      animatedPosition,
      animatedDetentsState,
      isInTemporaryPosition,
      isLayoutCalculated,
    ]);
    //#endregion

    //#region private methods
    const handleOnChange = useCallback(
      function handleOnChange(index: number, position: number) {
        if (__DEV__) {
          print({
            component: 'BottomSheet',
            method: 'handleOnChange',
            category: 'callback',
            params: {
              index,
              position,
            },
          });
        }

        if (!_providedOnChange) {
          return;
        }

        const { dynamicDetentIndex } = animatedDetentsState.get();

        _providedOnChange(
          index,
          position,
          index === dynamicDetentIndex
            ? SNAP_POINT_TYPE.DYNAMIC
            : SNAP_POINT_TYPE.PROVIDED
        );
      },
      [_providedOnChange, animatedDetentsState]
    );
    const handleOnAnimate = useCallback(
      function handleOnAnimate(targetIndex: number, targetPosition: number) {
        if (__DEV__) {
          print({
            component: 'BottomSheet',
            method: 'handleOnAnimate',
            category: 'callback',
            params: {
              toIndex: targetIndex,
              toPosition: targetPosition,
              fromIndex: animatedCurrentIndex.value,
              fromPosition: animatedPosition.value,
            },
          });
        }

        if (targetIndex === animatedCurrentIndex.get()) {
          return;
        }

        if (!_providedOnAnimate) {
          return;
        }

        _providedOnAnimate(
          animatedCurrentIndex.value,
          targetIndex,
          animatedPosition.value,
          targetPosition
        );
      },
      [_providedOnAnimate, animatedCurrentIndex, animatedPosition]
    );
    const handleOnClose = useCallback(
      function handleOnClose() {
        if (__DEV__) {
          print({
            component: 'BottomSheet',
            method: 'handleOnClose',
            category: 'callback',
          });
        }

        if (!_providedOnClose) {
          return;
        }

        _providedOnClose();
      },
      [_providedOnClose]
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

        const { nextIndex, nextPosition } = animatedAnimationState.get();

        if (__DEV__) {
          runOnJS(print)({
            component: 'BottomSheet',
            method: 'animateToPositionCompleted',
            params: {
              currentIndex: animatedCurrentIndex.value,
              nextIndex,
              nextPosition,
            },
          });
        }

        if (nextIndex === undefined || nextPosition === undefined) {
          return;
        }

        // callbacks
        if (nextIndex !== animatedCurrentIndex.get()) {
          runOnJS(handleOnChange)(nextIndex, nextPosition);
        }

        if (nextIndex === -1) {
          runOnJS(handleOnClose)();
        }

        animatedCurrentIndex.set(nextIndex);

        // reset values
        animatedContainerHeightDidChange.set(false);
        isAnimatedOnMount.set(true);
        animatedAnimationState.set({
          status: ANIMATION_STATUS.STOPPED,
          source: ANIMATION_SOURCE.NONE,
          nextIndex: undefined,
          nextPosition: undefined,
          isForcedClosing: undefined,
        });
      },
      [
        handleOnChange,
        handleOnClose,
        animatedCurrentIndex,
        animatedAnimationState,
        animatedContainerHeightDidChange,
        isAnimatedOnMount,
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
        const { status: animationStatus, nextPosition } =
          animatedAnimationState.get();
        if (
          animationStatus === ANIMATION_STATUS.RUNNING &&
          position === nextPosition
        ) {
          return;
        }

        // stop animation if it is running
        if (animationStatus === ANIMATION_STATUS.RUNNING) {
          stopAnimation();
        }

        /**
         * offset the position if keyboard is shown and behavior not extend.
         */
        let offset = 0;

        const { status, heightWithinContainer } = animatedKeyboardState.get();
        const sheetState = animatedSheetState.get();
        if (
          status === KEYBOARD_STATUS.SHOWN &&
          keyboardBehavior !== KEYBOARD_BEHAVIOR.extend &&
          ([
            ANIMATION_SOURCE.KEYBOARD,
            ANIMATION_SOURCE.SNAP_POINT_CHANGE,
          ].includes(source) ||
            sheetState === SHEET_STATE.OVER_EXTENDED)
        ) {
          offset = heightWithinContainer;
        }
        const { detents, closedDetentPosition, highestDetentPosition } =
          animatedDetentsState.get();
        let index = detents?.indexOf(position + offset) ?? -1;

        /**
         * because keyboard position is not part of the detents array,
         * we will need to manually set the index to the highest detent index.
         */
        if (
          index === -1 &&
          status === KEYBOARD_STATUS.SHOWN &&
          position !== closedDetentPosition
        ) {
          index = highestDetentPosition ?? DEFAULT_KEYBOARD_INDEX;
        }

        /**
         * set the animation state
         */
        animatedAnimationState.set(state => {
          'worklet';
          return {
            ...state,
            status: ANIMATION_STATUS.RUNNING,
            source,
            nextIndex: index,
            nextPosition: position,
          };
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
        stopAnimation,
        animateToPositionCompleted,
        keyboardBehavior,
        _providedAnimationConfigs,
        _providedOverrideReduceMotion,
        animatedDetentsState,
        animatedAnimationState,
        animatedKeyboardState,
        animatedPosition,
        animatedSheetState,
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

        const { status: animationStatus, nextPosition } =
          animatedAnimationState.get();

        // early exit if there is a running animation to
        // the same position
        if (
          animationStatus === ANIMATION_STATUS.RUNNING &&
          targetPosition === nextPosition
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
        const { detents } = animatedDetentsState.get();
        const index = detents?.indexOf(targetPosition) ?? -1;
        animatedAnimationState.set(state => {
          'worklet';
          return {
            ...state,
            nextPosition: targetPosition,
            nextIndex: index,
          };
        });

        stopAnimation();

        // set values
        animatedPosition.value = targetPosition;
        animatedContainerHeightDidChange.value = false;
      },
      [
        stopAnimation,
        animatedPosition,
        animatedContainerHeightDidChange,
        animatedAnimationState,
        animatedDetentsState,
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
        const { detents, highestDetentPosition, closedDetentPosition } =
          animatedDetentsState.get();
        const keyboardStatus = animatedKeyboardState.get().status;

        if (
          detents === undefined ||
          highestDetentPosition === undefined ||
          closedDetentPosition === undefined
        ) {
          return;
        }

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
          const nextPosition = detents[currentIndex];
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
          return highestDetentPosition;
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
          return Math.max(0, highestDetentPosition - keyboardHeightInContainer);
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
            ? closedDetentPosition
            : detents[_providedIndex];
        }

        const { status, nextIndex, nextPosition } =
          animatedAnimationState.get();

        /**
         * if the evaluated position is for a snap change source while the sheet is currently running
         * an animation and the next position is different than the detent at next index,
         * then we return the detent at next index.
         *
         * https://github.com/gorhom/react-native-bottom-sheet/issues/2431
         */
        if (
          source === ANIMATION_SOURCE.SNAP_POINT_CHANGE &&
          status === ANIMATION_STATUS.RUNNING &&
          nextIndex !== undefined &&
          nextPosition !== undefined &&
          detents[nextIndex] !== nextPosition
        ) {
          return detents[nextIndex];
        }

        /**
         * return the current index position.
         */
        return detents[currentIndex];
      },
      [
        animatedContentGestureState,
        animatedCurrentIndex,
        animatedHandleGestureState,
        animatedAnimationState,
        animatedKeyboardState,
        animatedPosition,
        animatedDetentsState,
        isInTemporaryPosition,
        isAnimatedOnMount,
        keyboardBehavior,
        keyboardBlurBehavior,
        _providedIndex,
        android_keyboardInputMode,
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
        const {
          status: animationStatus,
          nextIndex,
          isForcedClosing,
        } = animatedAnimationState.get();

        const { detents, closedDetentPosition } = animatedDetentsState.get();
        if (
          detents === undefined ||
          detents.length === 0 ||
          closedDetentPosition === undefined
        ) {
          return;
        }

        /**
         * if a force closing is running and source not from user, then we early exit
         */
        if (isForcedClosing && source !== ANIMATION_SOURCE.USER) {
          return;
        }
        /**
         * when evaluating the position while layout is not calculated, then we early exit till it is.
         */
        if (!isLayoutCalculated.value) {
          return;
        }

        const proposedPosition = getEvaluatedPosition(source);
        if (proposedPosition === undefined) {
          return;
        }

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

        /**
         * when evaluating the position while the bottom sheet is animating.
         */
        if (animationStatus === ANIMATION_STATUS.RUNNING) {
          const nextPositionIndex = nextIndex ?? INITIAL_VALUE;
          /**
           * when evaluating the position while the bottom sheet is
           * closing, then we force closing the bottom sheet with no animation.
           */
          if (nextPositionIndex === -1 && !isInTemporaryPosition.value) {
            setToPosition(closedDetentPosition);
            return;
          }

          /**
           * when evaluating the position while it's animating to
           * a position other than the current position, then we
           * restart the animation.
           */
          if (nextPositionIndex !== animatedCurrentIndex.value) {
            animateToPosition(
              detents[nextPositionIndex],
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
            detents[animatedIndex.value] !== animatedPosition.value
          ) {
            return;
          }
          setToPosition(closedDetentPosition);
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
        animatedContainerHeightDidChange,
        animatedCurrentIndex,
        animatedIndex,
        animatedPosition,
        animatedDetentsState,
        isAnimatedOnMount,
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
      const { detents } = animatedDetentsState.get();
      const isLayoutReady = isLayoutCalculated.get();

      if (detents === undefined || detents.length === 0) {
        return;
      }

      // early exit if layout is not ready yet.
      if (!isLayoutReady) {
        return;
      }

      invariant(
        index >= -1 && index <= detents.length - 1,
        `'index' was provided but out of the provided snap points range! expected value to be between -1, ${
          detents.length - 1
        }`
      );

      if (__DEV__) {
        print({
          component: 'BottomSheet',
          method: 'handleSnapToIndex',
          params: {
            index,
          },
        });
      }

      const targetPosition = detents[index];

      /**
       * exit method if :
       * - layout is not calculated.
       * - already animating to next position.
       * - sheet is forced closing.
       */
      const { nextPosition, nextIndex, isForcedClosing } =
        animatedAnimationState.get();
      if (
        !isLayoutCalculated.value ||
        index === nextIndex ||
        targetPosition === nextPosition ||
        isForcedClosing
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
            method: 'handleSnapToPosition',
            params: {
              position,
            },
          });
        }

        const { containerHeight } = animatedLayoutState.get();
        /**
         * normalized provided position.
         */
        const targetPosition = normalizeSnapPoint(position, containerHeight);

        /**
         * exit method if :
         * - layout is not calculated.
         * - already animating to next position.
         * - sheet is forced closing.
         */
        const { nextPosition, isForcedClosing } = animatedAnimationState.get();
        if (
          !isLayoutCalculated ||
          targetPosition === nextPosition ||
          isForcedClosing
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
        isInTemporaryPosition,
        isLayoutCalculated,
        animatedLayoutState,
        animatedAnimationState,
      ]
    );
    const handleClose = useCallback(
      function handleClose(
        animationConfigs?: WithSpringConfig | WithTimingConfig
      ) {
        if (__DEV__) {
          print({
            component: 'BottomSheet',
            method: 'handleClose',
          });
        }

        const closedDetentPosition =
          animatedDetentsState.get().closedDetentPosition;
        if (closedDetentPosition === undefined) {
          return;
        }

        const targetPosition = closedDetentPosition;

        /**
         * exit method if :
         * - layout is not calculated.
         * - already animating to next position.
         * - sheet is forced closing.
         */
        const { nextPosition, isForcedClosing } = animatedAnimationState.get();
        if (
          !isLayoutCalculated.value ||
          targetPosition === nextPosition ||
          isForcedClosing
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
        isLayoutCalculated,
        isInTemporaryPosition,
        animatedDetentsState,
        animatedAnimationState,
      ]
    );
    const handleForceClose = useCallback(
      function handleForceClose(
        animationConfigs?: WithSpringConfig | WithTimingConfig
      ) {
        if (__DEV__) {
          print({
            component: 'BottomSheet',
            method: 'handleForceClose',
          });
        }

        const closedDetentPosition =
          animatedDetentsState.get().closedDetentPosition;
        if (closedDetentPosition === undefined) {
          return;
        }

        const targetPosition = closedDetentPosition;

        /**
         * exit method if :
         * - already animating to next position.
         * - sheet is forced closing.
         */
        const { nextPosition, isForcedClosing } = animatedAnimationState.get();
        if (targetPosition === nextPosition || isForcedClosing) {
          return;
        }

        /**
         * reset temporary position variable.
         */
        isInTemporaryPosition.value = false;

        /**
         * set force closing variable.
         */
        animatedAnimationState.set(state => {
          'worklet';
          return {
            ...state,
            isForcedClosing: true,
          };
        });

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
        animatedDetentsState,
        animatedAnimationState,
      ]
    );
    const handleExpand = useCallback(
      function handleExpand(
        animationConfigs?: WithSpringConfig | WithTimingConfig
      ) {
        if (__DEV__) {
          print({
            component: 'BottomSheet',
            method: 'handleExpand',
          });
        }

        const { detents } = animatedDetentsState.get();
        if (detents === undefined || detents.length === 0) {
          return;
        }

        const targetIndex = detents.length - 1;
        const targetPosition = detents[targetIndex];

        /**
         * exit method if :
         * - layout is not calculated.
         * - already animating to next position.
         * - sheet is forced closing.
         */
        const { nextPosition, nextIndex, isForcedClosing } =
          animatedAnimationState.get();
        if (
          !isLayoutCalculated.value ||
          targetIndex === nextIndex ||
          targetPosition === nextPosition ||
          isForcedClosing
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
        animatedDetentsState,
        animatedAnimationState,
      ]
    );
    const handleCollapse = useCallback(
      function handleCollapse(
        animationConfigs?: WithSpringConfig | WithTimingConfig
      ) {
        if (__DEV__) {
          print({
            component: 'BottomSheet',
            method: 'handleCollapse',
          });
        }

        const { detents } = animatedDetentsState.get();
        if (detents === undefined || detents.length === 0) {
          return;
        }

        const targetPosition = detents[0];

        /**
         * exit method if :
         * - layout is not calculated.
         * - already animating to next position.
         * - sheet is forced closing.
         */
        const { nextPosition, nextIndex, isForcedClosing } =
          animatedAnimationState.get();
        if (
          !isLayoutCalculated ||
          nextIndex === 0 ||
          targetPosition === nextPosition ||
          isForcedClosing
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
        isLayoutCalculated,
        isInTemporaryPosition,
        animatedDetentsState,
        animatedAnimationState,
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
        textInputNodesRef,
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
        animatedLayoutState,
        animatedIndex,
        animatedPosition,
        animatedSheetHeight,
        animatedDetentsState,
        isInTemporaryPosition,
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
        textInputNodesRef,
        animatedIndex,
        animatedPosition,
        animatedSheetHeight,
        animatedLayoutState,
        animatedContentGestureState,
        animatedHandleGestureState,
        animatedAnimationState,
        animatedKeyboardState,
        animatedSheetState,
        animatedScrollableState,
        animatedScrollableStatus,
        animatedDetentsState,
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
      () => animatedLayoutState.get().containerHeight,
      (result, previous) => {
        if (result === INITIAL_LAYOUT_VALUE) {
          return;
        }

        animatedContainerHeightDidChange.value = result !== previous;

        const { closedDetentPosition } = animatedDetentsState.get();
        if (closedDetentPosition === undefined) {
          return;
        }

        /**
         * When user close the bottom sheet while the keyboard open on Android with
         * software keyboard layout mode set to resize, the close position would be
         * set to the container height - the keyboard height, and when the keyboard
         * closes, the container height and here we restart the animation again.
         *
         * [read more](https://github.com/gorhom/react-native-bottom-sheet/issues/2163)
         */
        const {
          status: animationStatus,
          source: animationSource,
          nextIndex,
        } = animatedAnimationState.get();
        if (
          animationStatus === ANIMATION_STATUS.RUNNING &&
          animationSource === ANIMATION_SOURCE.GESTURE &&
          nextIndex === -1
        ) {
          animateToPosition(closedDetentPosition, ANIMATION_SOURCE.GESTURE);
        }
      },
      [
        animatedContainerHeightDidChange,
        animatedAnimationState,
        animatedDetentsState,
      ]
    );

    /**
     * Reaction to the `snapPoints` change, to insure that the sheet position reflect
     * to the current point correctly.
     *
     * @alias OnSnapPointsChange
     */
    useAnimatedReaction(
      () => animatedDetentsState.get().detents,
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
      [isLayoutCalculated, isAnimatedOnMount, animatedDetentsState]
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

        /**
         * Calculate the keyboard height in the container.
         */
        const containerOffset = animatedLayoutState.get().containerOffset;
        let heightWithinContainer =
          height === 0
            ? 0
            : $modal
              ? Math.abs(
                  height - Math.abs(bottomInset - containerOffset.bottom)
                )
              : Math.abs(height - containerOffset.bottom);

        if (__DEV__) {
          runOnJS(print)({
            component: 'BottomSheet',
            method: 'useAnimatedReaction::OnKeyboardStateChange',
            category: 'effect',
            params: {
              status,
              height,
              heightWithinContainer,
              containerOffset,
            },
          });
        }

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
        animatedKeyboardState.set(state => ({
          ...state,
          heightWithinContainer,
        }));

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
        animatedLayoutState,
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
              layoutState={animatedLayoutState}
              containerLayoutState={containerLayoutState}
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
                  index: animatedIndex,
                  position: animatedPosition,
                  sheetStatus: animatedSheetState,
                  scrollableStatus: animatedScrollableStatus,
                  layoutState: animatedLayoutState,
                  detentsState: animatedDetentsState,
                  sheetHeight: animatedSheetHeight,
                  isLayoutCalculated,
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
