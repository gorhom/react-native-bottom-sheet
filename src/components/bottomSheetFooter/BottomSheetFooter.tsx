import React, { memo, useCallback, useMemo, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { KEYBOARD_STATUS } from '../../constants';
import {
  type BoundingClientRect,
  useBottomSheetInternal,
  useBoundingClientRect,
} from '../../hooks';
import { print } from '../../utilities';
import { styles } from './styles';
import type { BottomSheetDefaultFooterProps } from './types';

function BottomSheetFooterComponent({
  animatedFooterPosition,
  bottomInset = 0,
  style,
  children,
}: BottomSheetDefaultFooterProps) {
  const ref = useRef<Animated.View>(null);
  const { animatedLayoutState, animatedKeyboardState } =
    useBottomSheetInternal();

  const containerAnimatedStyle = useAnimatedStyle(() => {
    let footerTranslateY = animatedFooterPosition.get();

    if (animatedKeyboardState.get().status !== KEYBOARD_STATUS.SHOWN) {
      footerTranslateY -= bottomInset;
    }

    return {
      transform: [{ translateY: Math.max(0, footerTranslateY) }],
    };
  }, [animatedFooterPosition, animatedKeyboardState, bottomInset]);
  const containerStyle = useMemo(
    () => [styles.container, style, containerAnimatedStyle],
    [containerAnimatedStyle, style]
  );

  const updateFooterHeight = useCallback(
    (
      height: number,
      method: 'handleContainerLayout' | 'handleBoundingClientRect'
    ) => {
      animatedLayoutState.modify(state => {
        'worklet';
        state.footerHeight = height;
        return state;
      });

      if (__DEV__) {
        print({
          component: 'BottomSheetFooter',
          method,
          category: 'layout',
          params: { height },
        });
      }
    },
    [animatedLayoutState]
  );

  const handleContainerLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) => {
      updateFooterHeight(height, 'handleContainerLayout');
    },
    [updateFooterHeight]
  );

  const handleBoundingClientRect = useCallback(
    ({ height }: BoundingClientRect) => {
      updateFooterHeight(height, 'handleBoundingClientRect');
    },
    [updateFooterHeight]
  );

  useBoundingClientRect(ref, handleBoundingClientRect);

  if (children === null) {
    return null;
  }

  return (
    <Animated.View
      ref={ref}
      onLayout={handleContainerLayout}
      style={containerStyle}
    >
      {children}
    </Animated.View>
  );
}

export const BottomSheetFooter = memo(BottomSheetFooterComponent);
BottomSheetFooter.displayName = 'BottomSheetFooter';
