import React, { memo, useMemo, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useBottomSheetInternal } from '../../hooks';
import { styles } from './styles';
import type { BottomSheetViewProps } from './types';

function BottomSheetViewComponent({
  shouldMeasureLayout = false,
  style,
  focusHook: useFocusHook = useEffect,
  children,
  ...rest
}: BottomSheetViewProps) {
  // hooks
  const { scrollableContentOffsetY, isContentHeightFixed } =
    useBottomSheetInternal();

  // styles
  const containerStyle = useMemo(() => [styles.container, style], [style]);

  // callback
  const handleSettingScrollable = useCallback(() => {
    isContentHeightFixed.value = shouldMeasureLayout;
    scrollableContentOffsetY.value = 0;
  }, [isContentHeightFixed, scrollableContentOffsetY, shouldMeasureLayout]);

  // effects
  useFocusHook(handleSettingScrollable);

  //render
  return (
    <View style={containerStyle} {...rest}>
      {children}
    </View>
  );
}

const BottomSheetView = memo(BottomSheetViewComponent);
BottomSheetView.displayName = 'BottomSheetView';

export default BottomSheetView;
