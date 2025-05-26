import { useMemo, useState } from 'react';
import { StyleSheet, type ViewProps, type ViewStyle } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { useBottomSheetInternal } from './useBottomSheetInternal';

export function useBottomSheetContentContainerStyle(
  enableFooterMarginAdjustment: boolean,
  _style?: ViewProps['style']
) {
  const [footerHeight, setFooterHeight] = useState(0);
  //#region hooks
  const { animatedFooterHeight } = useBottomSheetInternal();
  //#endregion

  //#region styles
  const flattenStyle = useMemo<ViewStyle>(() => {
    return !_style
      ? {}
      : Array.isArray(_style)
        ? StyleSheet.compose(..._style)
        : _style;
  }, [_style]);
  const style = useMemo<ViewProps['style']>(() => {
    if (!enableFooterMarginAdjustment) {
      return flattenStyle;
    }

    let currentBottomPadding = 0;
    if (flattenStyle && typeof flattenStyle === 'object') {
      const { paddingBottom, padding, paddingVertical } = flattenStyle;
      currentBottomPadding = paddingBottom ?? paddingVertical ?? padding ?? 0;
    }

    return [
      flattenStyle,
      {
        paddingBottom: currentBottomPadding + footerHeight,
        overflow: 'visible',
      },
    ];
  }, [footerHeight, enableFooterMarginAdjustment, flattenStyle]);
  //#endregion

  //#region effects
  useAnimatedReaction(
    () => animatedFooterHeight.get(),
    result => {
      if (!enableFooterMarginAdjustment) {
        return;
      }
      runOnJS(setFooterHeight)(result);
    },
    [animatedFooterHeight]
  );
  //#endregion

  return style;
}
