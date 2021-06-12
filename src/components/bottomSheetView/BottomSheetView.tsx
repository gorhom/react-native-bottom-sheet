import React, { memo, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetViewProps } from './types';

function BottomSheetViewComponent({
  style,
  focusHook: useFocusHook = useEffect,
  children,
  ...rest
}: BottomSheetViewProps) {
  // hooks
  const { scrollableContentOffsetY } = useBottomSheetInternal();

  // callback
  const handleSettingScrollable = useCallback(() => {
    scrollableContentOffsetY.value = 0;
  }, [scrollableContentOffsetY]);

  // effects
  useFocusHook(handleSettingScrollable);

  //render
  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
}

const BottomSheetView = memo(BottomSheetViewComponent);
BottomSheetView.displayName = 'BottomSheetView';

export default BottomSheetView;
