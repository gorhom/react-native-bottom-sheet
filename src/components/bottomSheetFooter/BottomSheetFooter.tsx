import React, { memo, useCallback, useMemo } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { KEYBOARD_STATE } from '../../constants';
import { useBottomSheetInternal } from '../../hooks';
import { APPEARANCE_BEHAVIOR } from './constants';
import type { BottomSheetFooterProps } from './types';

function BottomSheetFooterComponent({
  children,
  appearanceBehavior = APPEARANCE_BEHAVIOR.fade,
  bottomInset = 0,
}: BottomSheetFooterProps) {
  //#region hooks
  const {
    animatedContainerHeight,
    animatedHandleHeight,
    animatedFooterHeight,
    animatedPosition,
    animatedKeyboardState,
    getKeyboardHeightInContainer,
  } = useBottomSheetInternal();
  //#endregion

  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const keyboardHeight = getKeyboardHeightInContainer();
    let footerTranslateY = Math.max(
      0,
      animatedContainerHeight.value - animatedPosition.value
    );

    if (animatedKeyboardState.value === KEYBOARD_STATE.SHOWN) {
      footerTranslateY = footerTranslateY - keyboardHeight;
    } else {
      footerTranslateY = footerTranslateY - bottomInset;
    }

    footerTranslateY =
      footerTranslateY -
      animatedFooterHeight.value -
      animatedHandleHeight.value;

    const style: any = {
      transform: [
        {
          translateY: footerTranslateY,
        },
      ],
    };

    // merge appearance behavior styles
    (typeof appearanceBehavior === 'string'
      ? [appearanceBehavior]
      : appearanceBehavior
    ).map(behavior => {
      if (behavior === APPEARANCE_BEHAVIOR.fade) {
        style.opacity = interpolate(
          footerTranslateY,
          [5, 0],
          [1, 0],
          Extrapolate.CLAMP
        );
      } else if (behavior === APPEARANCE_BEHAVIOR.scale) {
        style.transform.push({
          scale: interpolate(
            footerTranslateY,
            [5, 0],
            [1, 0],
            Extrapolate.CLAMP
          ),
        });
      } else if (behavior === APPEARANCE_BEHAVIOR.slide) {
        style.transform.push({
          translateY: interpolate(
            footerTranslateY,
            [5, 0],
            [0, animatedFooterHeight.value + bottomInset],
            Extrapolate.CLAMP
          ),
        });
      }
    });

    return style;
  }, [appearanceBehavior, bottomInset]);
  const containerStyle = useMemo(
    () => [styles.container, containerAnimatedStyle],
    [containerAnimatedStyle]
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
    <Animated.View onLayout={handleContainerLayout} style={containerStyle}>
      {typeof children === 'function' ? children() : children}
    </Animated.View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});

const BottomSheetFooter = memo(BottomSheetFooterComponent);
BottomSheetFooter.displayName = 'BottomSheetFooter';

export default BottomSheetFooter;
