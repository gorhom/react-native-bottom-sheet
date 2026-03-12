import React, { memo, useMemo } from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import { State } from 'react-native-gesture-handler';
import Animated, {
  type AnimatedStyle,
  useAnimatedStyle,
  useDerivedValue,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import {
  ANIMATION_STATUS,
  INITIAL_LAYOUT_VALUE,
  KEYBOARD_BEHAVIOR,
  KEYBOARD_STATUS,
} from '../../constants';
import { useBottomSheetInternal } from '../../hooks';
import type { NullableAccessibilityProps } from '../../types';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import {} from './constants';
import type { BottomSheetProps } from './types';

type BottomSheetContent = {
  style?: AnimatedStyle<ViewStyle>;
} & Pick<
  BottomSheetProps,
  'children' | 'detached' | 'keyboardBehavior'
> &
  NullableAccessibilityProps &
  ViewProps;

function BottomSheetContentComponent({
  detached,
  keyboardBehavior,
  accessible,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  children,
}: BottomSheetContent) {
  //#region hooks
  const {
    enableDynamicSizing,
    overDragResistanceFactor,
    enableContentPanningGesture,
    animatedPosition,
    animatedLayoutState,
    animatedDetentsState,
    animatedSheetHeight,
    animatedKeyboardState,
    isInTemporaryPosition,
    animatedContentGestureState,
    animatedHandleGestureState,
    animatedAnimationState,
    animatedScrollableState,
  } = useBottomSheetInternal();
  //#endregion

  //#region variables
  const animatedContentHeightMax = useDerivedValue(() => {
    const { containerHeight, handleHeight } = animatedLayoutState.get();

    /**
     * if container height is not yet calculated, then we exit the method
     */
    if (containerHeight === INITIAL_LAYOUT_VALUE) {
      return 0;
    }

    const {
      status: keyboardStatus,
      heightWithinContainer: keyboardHeightWithinContainer,
    } = animatedKeyboardState.get();

    let contentHeight = animatedSheetHeight.get() - Math.max(0, handleHeight);

    switch (keyboardBehavior) {
      case KEYBOARD_BEHAVIOR.extend:
        if (keyboardStatus === KEYBOARD_STATUS.SHOWN) {
          contentHeight = contentHeight - keyboardHeightWithinContainer;
        }
        break;

      case KEYBOARD_BEHAVIOR.fillParent:
        if (!isInTemporaryPosition.get()) {
          break;
        }

        if (keyboardStatus === KEYBOARD_STATUS.SHOWN) {
          contentHeight =
            containerHeight - handleHeight - keyboardHeightWithinContainer;
        } else {
          contentHeight = containerHeight - handleHeight;
        }
        break;

      case KEYBOARD_BEHAVIOR.interactive: {
        if (!isInTemporaryPosition.get()) {
          break;
        }
        const contentWithKeyboardHeight =
          contentHeight + keyboardHeightWithinContainer;

        if (keyboardStatus === KEYBOARD_STATUS.SHOWN) {
          if (
            keyboardHeightWithinContainer + animatedSheetHeight.get() >
            containerHeight
          ) {
            contentHeight =
              containerHeight - keyboardHeightWithinContainer - handleHeight;
          }
        } else if (contentWithKeyboardHeight + handleHeight > containerHeight) {
          contentHeight = containerHeight - handleHeight;
        } else {
          contentHeight = contentWithKeyboardHeight;
        }
        break;
      }
    }

    /**
     * before the container is measured, `contentHeight` value will be below zero,
     * which will lead to freeze the scrollable.
     *
     * @link (https://github.com/gorhom/react-native-bottom-sheet/issues/470)
     */
    return Math.max(contentHeight, 0);
  }, [
    animatedLayoutState,
    animatedKeyboardState,
    animatedSheetHeight,
    isInTemporaryPosition,
    keyboardBehavior,
  ]);
  const animatedPaddingBottom = useDerivedValue(() => {
    const containerHeight = animatedLayoutState.get().containerHeight;
    /**
     * if container height is not yet calculated, then we exit the method
     */
    if (containerHeight === INITIAL_LAYOUT_VALUE) {
      return 0;
    }

    const { highestDetentPosition } = animatedDetentsState.get();

    const highestSnapPoint = Math.max(
      highestDetentPosition ?? 0,
      animatedPosition.get()
    );
    /**
     * added safe area to prevent the sheet from floating above
     * the bottom of the screen, when sheet being over dragged or
     * when the sheet is resized.
     */
    const overDragSafePaddingBottom =
      Math.sqrt(highestSnapPoint - containerHeight * -1) *
      overDragResistanceFactor;

    let paddingBottom = overDragSafePaddingBottom;

    /**
     * if keyboard is open, then we try to add padding to prevent content
     * from being covered by the keyboard.
     */
    const {
      status: keyboardStatus,
      heightWithinContainer: keyboardHeightWithinContainer,
    } = animatedKeyboardState.get();
    if (
      keyboardStatus === KEYBOARD_STATUS.SHOWN &&
      keyboardBehavior !== KEYBOARD_BEHAVIOR.none
    ) {
      paddingBottom = overDragSafePaddingBottom + keyboardHeightWithinContainer;
    }

    return paddingBottom;
  }, [
    keyboardBehavior,
    overDragResistanceFactor,
    animatedPosition,
    animatedLayoutState,
    animatedDetentsState,
    animatedKeyboardState,
  ]);
  const lastStableContentValues = useSharedValue({
    height: 0,
    paddingBottom: 0,
  });
  const displayContentHeight = useSharedValue(0);
  const displayPaddingBottom = useSharedValue(0);
  const maxOvershoot = useSharedValue(0);
  const lastIsTransitionActive = useSharedValue(false);
  const lastIsGestureActive = useSharedValue(false);
  const gestureStartPosition = useSharedValue(0);
  const maxGesturePosition = useSharedValue(0);
  useAnimatedReaction(
    () => {
      const paddingBottom = detached ? 0 : animatedPaddingBottom.get();
      const height = animatedContentHeightMax.get() + paddingBottom;
      const isContentGestureActive =
        animatedContentGestureState.value === State.ACTIVE ||
        animatedContentGestureState.value === State.BEGAN;
      const isHandleGestureActive =
        animatedHandleGestureState.value === State.ACTIVE ||
        animatedHandleGestureState.value === State.BEGAN;
      const isGestureActive = isContentGestureActive || isHandleGestureActive;
      const isAnimationRunning =
        animatedAnimationState.get().status === ANIMATION_STATUS.RUNNING;
      const isTransitionActive = isGestureActive || isAnimationRunning;
      const detentsState = animatedDetentsState.get();
      const closedDetentPosition =
        detentsState.closedDetentPosition ??
        detentsState.detents?.[0] ??
        animatedLayoutState.get().containerHeight;
      const overshoot =
        closedDetentPosition === undefined
          ? 0
          : Math.max(0, animatedPosition.value - closedDetentPosition);
      const scrollOvershoot = isContentGestureActive
        ? Math.max(0, animatedScrollableState.get().contentOffsetY * -1)
        : 0;

      return {
        height,
        paddingBottom,
        isTransitionActive,
        isGestureActive,
        overshoot,
        scrollOvershoot,
        closedDetentPosition,
        position: animatedPosition.value,
      };
    },
    (state, previous) => {
      const targetHeight = state?.height ?? 0;
      const targetPaddingBottom = state?.paddingBottom ?? 0;
      const rawIsTransitionActive = state?.isTransitionActive ?? false;
      const isGestureActive = state?.isGestureActive ?? false;
      const currentPosition = state?.position ?? 0;
      const previousPosition =
        previous?.position ?? state?.position ?? currentPosition;
      const isMoving = Math.abs(currentPosition - previousPosition) > 0.5;
      const isTransitionActive = rawIsTransitionActive || isMoving;
      const wasTransitionActive = lastIsTransitionActive.value;
      lastIsTransitionActive.value = isTransitionActive;
      const wasGestureActive = lastIsGestureActive.value;
      lastIsGestureActive.value = isGestureActive;
      const gestureEnded = wasGestureActive && !isGestureActive;
      const gestureStarted = !wasGestureActive && isGestureActive;
      const closedDetentPosition = state?.closedDetentPosition;
      if (gestureStarted) {
        gestureStartPosition.value = currentPosition;
        maxGesturePosition.value = currentPosition;
      }
      if (isGestureActive) {
        maxGesturePosition.value = Math.max(
          maxGesturePosition.value,
          currentPosition
        );
      }
      const gestureDragDistance = Math.max(
        0,
        maxGesturePosition.value - gestureStartPosition.value
      );

      const currentOvershoot = Math.max(
        state?.overshoot ?? 0,
        state?.scrollOvershoot ?? 0
      );
      const gestureOvershoot =
        closedDetentPosition === undefined
          ? 0
          : Math.max(0, maxGesturePosition.value - closedDetentPosition);
      const shouldReleaseFromGestureEnd =
        gestureEnded &&
        (maxOvershoot.value > 0 ||
          gestureOvershoot > 0 ||
          currentOvershoot > 0 ||
          gestureDragDistance > 6);
      if (gestureEnded) {
        maxOvershoot.value = Math.max(
          maxOvershoot.value,
          currentOvershoot,
          gestureOvershoot,
          gestureDragDistance
        );
      }
      if (isTransitionActive && !shouldReleaseFromGestureEnd) {
        maxOvershoot.value = Math.max(maxOvershoot.value, currentOvershoot);
        if (
          lastStableContentValues.value.height === 0 &&
          lastStableContentValues.value.paddingBottom === 0 &&
          (targetHeight !== 0 || targetPaddingBottom !== 0)
        ) {
          lastStableContentValues.value = {
            height: targetHeight,
            paddingBottom: targetPaddingBottom,
          };
        }
        displayContentHeight.value = lastStableContentValues.value.height;
        displayPaddingBottom.value = lastStableContentValues.value.paddingBottom;
        return;
      }

      const releasedFromOvershoot =
        shouldReleaseFromGestureEnd ||
        (wasTransitionActive && !isTransitionActive && maxOvershoot.value > 0);
      let extra = 0;
      if (releasedFromOvershoot) {
        extra = Math.min(maxOvershoot.value, 80);
        const overshootHeight = lastStableContentValues.value.height + extra;
        const overshootPadding = lastStableContentValues.value.paddingBottom;
        maxOvershoot.value = 0;

        // Avoid animating layout-affecting props (height/paddingBottom).
        displayContentHeight.value = overshootHeight;
        displayPaddingBottom.value = overshootPadding;
        displayContentHeight.value = targetHeight;
        displayPaddingBottom.value = targetPaddingBottom;
        lastStableContentValues.value = {
          height: targetHeight,
          paddingBottom: targetPaddingBottom,
        };
        return;
      }
      maxOvershoot.value = 0;

      displayContentHeight.value = targetHeight;
      displayPaddingBottom.value = targetPaddingBottom;
      lastStableContentValues.value = {
        height: targetHeight,
        paddingBottom: targetPaddingBottom,
      };
    },
    [
      detached,
      animatedPaddingBottom,
      animatedContentHeightMax,
      animatedContentGestureState,
      animatedHandleGestureState,
      animatedAnimationState,
      animatedDetentsState,
      animatedLayoutState,
      animatedPosition,
    ]
  );
  //#endregion

  //#region styles
  const contentMaskContainerAnimatedStyle = useAnimatedStyle(() => {
    const { containerHeight, contentHeight } = animatedLayoutState.get();
    /**
     * if container height is not yet calculated, then we exit the method
     */
    if (containerHeight === INITIAL_LAYOUT_VALUE) {
      return {};
    }

    /**
     * if dynamic sizing is enabled, and content height
     * is still not set, then we exit method.
     */
    if (enableDynamicSizing && contentHeight === INITIAL_LAYOUT_VALUE) {
      return {};
    }

    return {
      paddingBottom: displayPaddingBottom.value,
      height: displayContentHeight.value,
    };
  }, [enableDynamicSizing, detached, animatedLayoutState]);
  const contentContainerStyle = useMemo(
    () => [
      detached
        ? { overflow: 'visible' as const }
        : { overflow: 'hidden' as const },
      contentMaskContainerAnimatedStyle,
    ],
    [contentMaskContainerAnimatedStyle, detached]
  );
  //#endregion

  //#region render
  const DraggableView = enableContentPanningGesture
    ? BottomSheetDraggableView
    : Animated.View;
  return (
    <DraggableView
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      style={contentContainerStyle}
    >
      {children}
    </DraggableView>
  );
  //#endregion
}

export const BottomSheetContent = memo(BottomSheetContentComponent);
BottomSheetContent.displayName = 'BottomSheetContent';
