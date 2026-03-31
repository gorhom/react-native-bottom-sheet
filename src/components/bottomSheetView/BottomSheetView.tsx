import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';
import { SCROLLABLE_TYPE } from '../../constants';
import {
  useBottomSheetContentContainerStyle,
  useBottomSheetInternal,
} from '../../hooks';
import { print } from '../../utilities';
import { styles } from './styles';
import type { BottomSheetViewProps } from './types';

function BottomSheetViewComponent({
  focusHook: useFocusHook = useEffect,
  enableFooterMarginAdjustment = false,
  onLayout,
  style: _providedStyle,
  children,
  ...rest
}: BottomSheetViewProps) {
  const { animatedScrollableState, enableDynamicSizing, animatedLayoutState } =
    useBottomSheetInternal();

  const containerStyle = useBottomSheetContentContainerStyle(
    enableFooterMarginAdjustment,
    _providedStyle
  );
  const style = useMemo(
    () => [containerStyle, styles.container],
    [containerStyle]
  );

  const handleSettingScrollable = useCallback(() => {
    animatedScrollableState.set(state => ({
      ...state,
      contentOffsetY: 0,
      type: SCROLLABLE_TYPE.VIEW,
    }));
  }, [animatedScrollableState]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (enableDynamicSizing) {
        const {
          nativeEvent: {
            layout: { height },
          },
        } = event;
        animatedLayoutState.modify(state => {
          'worklet';
          state.contentHeight = height;
          return state;
        });
      }

      onLayout?.(event);

      if (__DEV__) {
        print({
          component: 'BottomSheetView',
          method: 'handleLayout',
          category: 'layout',
          params: { height: event.nativeEvent.layout.height },
        });
      }
    },
    [animatedLayoutState, enableDynamicSizing, onLayout]
  );

  useFocusHook(handleSettingScrollable);

  return (
    <View {...rest} onLayout={handleLayout} style={style}>
      {children}
    </View>
  );
}

const BottomSheetView = memo(BottomSheetViewComponent);
BottomSheetView.displayName = 'BottomSheetView';

export default BottomSheetView;
