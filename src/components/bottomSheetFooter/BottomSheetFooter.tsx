import React, { memo, useCallback, useMemo } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { KEYBOARD_STATE } from '../../constants';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetDefaultFooterProps } from './types';
import { styles } from './styles';

function BottomSheetFooterComponent({
  animatedFooterPosition,
  bottomInset = 0,
  style,
  children,
}: BottomSheetDefaultFooterProps) {
  //#region hooks
  const { animatedFooterHeight, animatedKeyboardState } =
    useBottomSheetInternal();
  //#endregion

  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let footerTranslateY = animatedFooterPosition.value;

    /**
     * Offset the bottom inset only when keyboard is not shown
     */
    if (animatedKeyboardState.value !== KEYBOARD_STATE.SHOWN) {
      footerTranslateY = footerTranslateY - bottomInset;
    }

    return {
      transform: [
        {
          translateY: Math.max(0, footerTranslateY),
        },
      ],
    };
  }, [bottomInset, animatedKeyboardState, animatedFooterPosition]);
  const containerStyle = useMemo(
    () => [styles.container, style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );
  //#endregion

  //#region callbacks
  const handleContainerLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) => {
      animatedFooterHeight.value = height;
    },
    [animatedFooterHeight]
  );
  //#endregion

  return children !== null ? (
    <Animated.View
      pointerEvents="box-none"
      onLayout={handleContainerLayout}
      style={containerStyle}
    >
      {typeof children === 'function' ? children() : children}
    </Animated.View>
  ) : null;
}

const BottomSheetFooter = memo(BottomSheetFooterComponent);
BottomSheetFooter.displayName = 'BottomSheetFooter';

export default BottomSheetFooter;
