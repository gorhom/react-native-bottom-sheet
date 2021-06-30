import React, { memo, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetViewProps } from './types';

function BottomSheetViewComponent({
  style,
  focusHook: useFocusHook = useEffect,
  children,
  ...rest
}: BottomSheetViewProps) {
  // hooks
  const {
    scrollableContentOffsetY,
    animatedScrollableType,
    animatedFooterHeight,
  } = useBottomSheetInternal();

  // styles
  const containerStylePaddingBottom = useMemo(() => {
    const flattenStyle = StyleSheet.flatten(style);
    const paddingBottom =
      flattenStyle && 'paddingBottom' in flattenStyle
        ? flattenStyle.paddingBottom
        : 0;
    return typeof paddingBottom === 'number' ? paddingBottom : 0;
  }, [style]);
  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      paddingBottom: animatedFooterHeight.value + containerStylePaddingBottom,
    }),
    [containerStylePaddingBottom]
  );
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  // callback
  const handleSettingScrollable = useCallback(() => {
    scrollableContentOffsetY.value = 0;
    animatedScrollableType.value = SCROLLABLE_TYPE.VIEW;
  }, [scrollableContentOffsetY, animatedScrollableType]);

  // effects
  useFocusHook(handleSettingScrollable);

  //render
  return (
    <Animated.View style={containerStyle} {...rest}>
      {children}
    </Animated.View>
  );
}

const BottomSheetView = memo(BottomSheetViewComponent);
BottomSheetView.displayName = 'BottomSheetView';

export default BottomSheetView;
