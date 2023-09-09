import React, { memo, useEffect, useCallback, useMemo } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetViewProps } from './types';
import { print } from '../../utilities';

function BottomSheetViewComponent({
  focusHook: useFocusHook = useEffect,
  enableFooterMarginAdjustment = false,
  onLayout,
  style,
  children,
  ...rest
}: BottomSheetViewProps) {
  //#region hooks
  const {
    animatedScrollableContentOffsetY,
    animatedScrollableType,
    animatedFooterHeight,
    enableDynamicSizing,
    animatedContentHeight,
  } = useBottomSheetInternal();
  //#endregion

  //#region styles
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
      paddingBottom: enableFooterMarginAdjustment
        ? animatedFooterHeight.value + containerStylePaddingBottom
        : containerStylePaddingBottom,
    }),
    [containerStylePaddingBottom, enableFooterMarginAdjustment]
  );
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );
  //#endregion

  //#region callbacks
  const handleSettingScrollable = useCallback(() => {
    animatedScrollableContentOffsetY.value = 0;
    animatedScrollableType.value = SCROLLABLE_TYPE.VIEW;
  }, [animatedScrollableContentOffsetY, animatedScrollableType]);
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (enableDynamicSizing) {
        animatedContentHeight.value = event.nativeEvent.layout.height;
      }

      if (onLayout) {
        onLayout(event);
      }

      print({
        component: BottomSheetView.displayName,
        method: 'handleLayout',
        params: {
          height: event.nativeEvent.layout.height,
        },
      });
    },
    [onLayout, animatedContentHeight, enableDynamicSizing]
  );
  //#endregion

  // effects
  useFocusHook(handleSettingScrollable);

  //render
  return (
    <Animated.View onLayout={handleLayout} style={containerStyle} {...rest}>
      {children}
    </Animated.View>
  );
}

const BottomSheetView = memo(BottomSheetViewComponent);
BottomSheetView.displayName = 'BottomSheetView';

export default BottomSheetView;
