import React, { memo, useMemo } from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import Animated, {
  type AnimatedStyle,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { KEYBOARD_BEHAVIOR, KEYBOARD_STATE } from '../../constants';
import { useBottomSheetInternal } from '../../hooks';
import type { NullableAccessibilityProps } from '../../types';
import { animate } from '../../utilities';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import { INITIAL_CONTAINER_HEIGHT } from './constants';
import type { BottomSheetProps } from './types';

type BottomSheetContent = {
  style?: AnimatedStyle<ViewStyle>;
} & Pick<
  BottomSheetProps,
  | 'children'
  | 'detached'
  | 'animationConfigs'
  | 'overrideReduceMotion'
  | 'keyboardBehavior'
> &
  NullableAccessibilityProps &
  ViewProps;

function BottomSheetContentComponent({
  detached,
  animationConfigs,
  overrideReduceMotion,
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
    animatedHandleHeight,
    animatedHighestSnapPoint,
    animatedContainerHeight,
    animatedContentHeight,
    animatedSheetHeight,
    animatedKeyboardState,
    animatedKeyboardHeightInContainer,
    isInTemporaryPosition,
  } = useBottomSheetInternal();
  //#endregion

  //#region variables
  const animatedContentHeightMax = useDerivedValue(() => {
    /**
     * if container height is not yet calculated, then we exit the method
     */
    if (animatedContainerHeight.get() === INITIAL_CONTAINER_HEIGHT) {
      return 0;
    }

    const keyboardState = animatedKeyboardState.get();
    const keyboardHeightInContainer = animatedKeyboardHeightInContainer.get();
    const handleHeight = Math.max(0, animatedHandleHeight.get());
    const containerHeight = animatedContainerHeight.get();
    let contentHeight = animatedSheetHeight.get() - handleHeight;

    switch (keyboardBehavior) {
      case KEYBOARD_BEHAVIOR.extend:
        if (keyboardState === KEYBOARD_STATE.SHOWN) {
          contentHeight = contentHeight - keyboardHeightInContainer;
        }
        break;

      case KEYBOARD_BEHAVIOR.fillParent:
        if (!isInTemporaryPosition.get()) {
          break;
        }

        if (keyboardState === KEYBOARD_STATE.SHOWN) {
          contentHeight =
            containerHeight - handleHeight - keyboardHeightInContainer;
        } else {
          contentHeight = containerHeight - handleHeight;
        }
        break;

      case KEYBOARD_BEHAVIOR.interactive: {
        if (!isInTemporaryPosition.get()) {
          break;
        }
        const contentWithKeyboardHeight =
          contentHeight + keyboardHeightInContainer;

        if (keyboardState === KEYBOARD_STATE.SHOWN) {
          if (
            keyboardHeightInContainer + animatedSheetHeight.get() >
            containerHeight
          ) {
            contentHeight =
              containerHeight - keyboardHeightInContainer - handleHeight;
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
    animatedContainerHeight,
    animatedHandleHeight,
    animatedKeyboardHeightInContainer,
    animatedKeyboardState,
    animatedSheetHeight,
    isInTemporaryPosition,
    keyboardBehavior,
  ]);
  const animatedPaddingBottom = useDerivedValue(() => {
    const containerHeight = animatedContainerHeight.get();
    /**
     * if container height is not yet calculated, then we exit the method
     */
    if (containerHeight === INITIAL_CONTAINER_HEIGHT) {
      return 0;
    }

    const highestSnapPoint = Math.max(
      animatedHighestSnapPoint.get(),
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
    if (animatedKeyboardState.get() === KEYBOARD_STATE.SHOWN) {
      paddingBottom =
        overDragSafePaddingBottom + animatedKeyboardHeightInContainer.get();
    }

    return paddingBottom;
  }, [
    overDragResistanceFactor,
    animatedPosition,
    animatedContainerHeight,
    animatedHighestSnapPoint,
    animatedKeyboardState,
    animatedKeyboardHeightInContainer,
  ]);
  //#endregion

  //#region styles
  const contentMaskContainerAnimatedStyle = useAnimatedStyle(() => {
    /**
     * if container height is not yet calculated, then we exit the method
     */
    if (animatedContainerHeight.get() === INITIAL_CONTAINER_HEIGHT) {
      return {};
    }

    /**
     * if dynamic sizing is enabled, and content height
     * is still not set, then we exit method.
     */
    if (
      enableDynamicSizing &&
      animatedContentHeight.get() === INITIAL_CONTAINER_HEIGHT
    ) {
      return {};
    }

    const paddingBottom = detached ? 0 : animatedPaddingBottom.get();

    return {
      paddingBottom: animate({
        point: paddingBottom,
        configs: animationConfigs,
        overrideReduceMotion,
      }),
      height: animate({
        point: animatedContentHeightMax.get() + paddingBottom,
        configs: animationConfigs,
        overrideReduceMotion,
      }),
    };
  }, [
    overDragResistanceFactor,
    enableDynamicSizing,
    detached,
    animationConfigs,
    overrideReduceMotion,
    animatedContentHeight,
    animatedContentHeightMax,
    animatedContainerHeight,
  ]);
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
