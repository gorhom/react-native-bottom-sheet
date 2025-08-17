import { useMemo, useState } from 'react';
import {
  Platform,
  StyleSheet,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { useBottomSheetInternal } from './useBottomSheetInternal';

export function useBottomSheetContentContainerStyle(
  enableFooterMarginAdjustment: boolean,
  _style?: ViewProps['style']
) {
  const [footerHeight, setFooterHeight] = useState(0);
  //#region hooks
  const { animatedLayoutState } = useBottomSheetInternal();
  //#endregion

  //#region styles
  const flattenStyle = useMemo<ViewStyle>(() => {
    return !_style
      ? {}
      : Array.isArray(_style)
        ? // @ts-ignore
          (StyleSheet.compose(..._style) as ViewStyle)
        : (_style as ViewStyle);
  }, [_style]);
  const style = useMemo<ViewProps['style']>(() => {
    if (!enableFooterMarginAdjustment) {
      return flattenStyle;
    }

    let currentBottomPadding = 0;
    if (flattenStyle && typeof flattenStyle === 'object') {
      const { paddingBottom, padding, paddingVertical } = flattenStyle;
      if (paddingBottom !== undefined && typeof paddingBottom === 'number') {
        currentBottomPadding = paddingBottom;
      } else if (
        paddingVertical !== undefined &&
        typeof paddingVertical === 'number'
      ) {
        currentBottomPadding = paddingVertical;
      } else if (padding !== undefined && typeof padding === 'number') {
        currentBottomPadding = padding;
      }
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
    () => animatedLayoutState.get().footerHeight,
    (result, previousFooterHeight) => {
      if (!enableFooterMarginAdjustment) {
        return;
      }
      runOnJS(setFooterHeight)(result);

      if (Platform.OS === 'web') {
        /**
         * a reaction that will append the footer height to the content
         * height if margin adjustment is true.
         *
         * This is needed due to the web layout the footer after the content.
         */
        if (result && !previousFooterHeight) {
          animatedLayoutState.modify(state => {
            'worklet';
            state.contentHeight = state.contentHeight + result;
            return state;
          });
        }
      }
    },
    [animatedLayoutState, enableFooterMarginAdjustment]
  );
  //#endregion
  return style;
}
