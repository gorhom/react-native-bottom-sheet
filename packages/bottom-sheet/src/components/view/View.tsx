import React, { memo, useMemo, useEffect, useCallback } from 'react';
import { View as RNView } from 'react-native';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetViewProps } from './types';
import { styles } from './styles';
import { runOnUI } from 'react-native-reanimated';

const BottomSheetViewComponent = ({
  style,
  focusHook: useFocusHook = useEffect,
  children,
  ...reset
}: BottomSheetViewProps) => {
  // hooks
  const { scrollableContentOffsetY } = useBottomSheetInternal();

  // styles
  const containerStyle = useMemo(
    () => ({
      ...styles.container,
      // @ts-ignore
      ...style,
    }),
    [style]
  );

  // callback
  const handleSettingScrollable = useCallback(() => {
    runOnUI(() => {
      scrollableContentOffsetY.value = 0;
    })();
  }, [scrollableContentOffsetY]);

  // effects
  useFocusHook(handleSettingScrollable);

  //render
  return (
    <RNView style={containerStyle} {...reset}>
      {children}
    </RNView>
  );
};

const BottomSheetView = memo(BottomSheetViewComponent);
BottomSheetView.displayName = 'BottomSheetView';

export default BottomSheetView;
