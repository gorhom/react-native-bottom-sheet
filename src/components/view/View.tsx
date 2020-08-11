import React, { memo, useMemo, useEffect, useCallback } from 'react';
import { View as RNView } from 'react-native';
import isEqual from 'lodash.isequal';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetViewProps } from './types';
import { styles } from './styles';

const BottomSheetViewComponent = ({
  children,
  style,
  focusHook: useFocusHook = useEffect,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // effects
  useFocusHook(handleSettingScrollable);

  //render
  return <RNView style={containerStyle}>{children}</RNView>;
};

const BottomSheetView = memo(BottomSheetViewComponent, isEqual);

export default BottomSheetView;
