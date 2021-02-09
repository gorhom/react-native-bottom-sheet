import React, { memo, useCallback, useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import isEqual from 'lodash.isequal';
import type { BottomSheetContainerProps } from './types';
import { styles } from './styles';

const BottomSheetContainerComponent = ({
  shouldMeasureHeight,
  onMeasureHeight,
  children,
  topInset = 0,
  bottomInset = 0,
}: BottomSheetContainerProps) => {
  //#region callbacks
  const handleOnLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      onMeasureHeight(height);
    },
    [onMeasureHeight]
  );
  //#endregion

  const containerStyle: ViewStyle[] = useMemo(
    () => [
      styles.container,
      {
        top: topInset,
        bottom: bottomInset,
        overflow: 'hidden',
      },
    ],
    [bottomInset, topInset]
  );

  //#region render
  // console.log('BottomSheetContainer', 'render', shouldMeasureHeight);
  return (
    <View
      pointerEvents="box-none"
      style={containerStyle}
      onLayout={shouldMeasureHeight ? handleOnLayout : undefined}
      children={children}
    />
  );
  //#endregion
};

const BottomSheetContainer = memo(BottomSheetContainerComponent, isEqual);

export default BottomSheetContainer;
