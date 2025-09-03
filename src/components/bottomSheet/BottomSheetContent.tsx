import React, { memo, useMemo } from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import Animated, {
  type AnimatedStyle,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import {
  INITIAL_LAYOUT_VALUE,
  KEYBOARD_BEHAVIOR,
  KEYBOARD_STATUS,
} from '../../constants';
import { useBottomSheetInternal } from '../../hooks';
import type { NullableAccessibilityProps } from '../../types';
import { animate } from '../../utilities';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import {} from './constants';
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
    animatedLayoutState,
    animatedDetentsState,
    animatedSheetHeight,
    animatedKeyboardState,
    isInTemporaryPosition,
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
    if (keyboardStatus === KEYBOARD_STATUS.SHOWN) {
      paddingBottom = overDragSafePaddingBottom + keyboardHeightWithinContainer;
    }

    return paddingBottom;
  }, [
    overDragResistanceFactor,
    animatedPosition,
    animatedLayoutState,
    animatedDetentsState,
    animatedKeyboardState,
  ]);
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

    const paddingBottom = detached ? 0 : animatedPaddingBottom.get();
    const height = animatedContentHeightMax.get() + paddingBottom;

    return {
      paddingBottom: animate({
        point: paddingBottom,
        configs: animationConfigs,
        overrideReduceMotion,
      }),
      height: animate({
        point: height,
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
    animatedLayoutState,
    animatedContentHeightMax,
    animatedLayoutState,
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
