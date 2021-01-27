import React, { memo, useMemo, useEffect, useCallback } from 'react';
import { View as RNView } from 'react-native';
import isEqual from 'lodash.isequal';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetViewProps } from './types';
import { styles } from './styles';

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
    scrollableContentOffsetY.setValue(0);
  }, [scrollableContentOffsetY]);

  // effects
  useFocusHook(handleSettingScrollable);

  //render
  return (
    <RNView {...reset} style={containerStyle}>
      {children}
    </RNView>
  );
};

const BottomSheetView = memo(BottomSheetViewComponent, isEqual);

export default BottomSheetView;
