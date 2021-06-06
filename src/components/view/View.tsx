import React, { memo, useMemo, useEffect, useCallback } from 'react';
import { View as RNView } from 'react-native';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetViewProps } from './types';
import { styles } from './styles';

const BottomSheetViewComponent = ({
  style,
  focusHook: useFocusHook = useEffect,
  children,
  ...rest
}: BottomSheetViewProps) => {
  // hooks
  const { scrollableContentOffsetY } = useBottomSheetInternal();

  // styles
  const containerStyle = useMemo(() => [styles.container, style], [style]);

  // callback
  const handleSettingScrollable = useCallback(() => {
    scrollableContentOffsetY.value = 0;
  }, [scrollableContentOffsetY]);

  // effects
  useFocusHook(handleSettingScrollable);

  //render
  return (
    <RNView style={containerStyle} {...rest}>
      {children}
    </RNView>
  );
};

const BottomSheetView = memo(BottomSheetViewComponent);
BottomSheetView.displayName = 'BottomSheetView';

export default BottomSheetView;
