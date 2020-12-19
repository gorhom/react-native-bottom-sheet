import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import isEqual from 'lodash.isequal';
import type { BottomSheetContainerProps } from './types';
import { styles } from './styles';

const BottomSheetContainerComponent = ({
  shouldMeasureHeight,
  onMeasureHeight,
  children,
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

  //#region render
  // console.log('BottomSheetContainer', 'render', shouldMeasureHeight);
  return (
    <View
      pointerEvents="box-none"
      style={styles.container}
      onLayout={shouldMeasureHeight ? handleOnLayout : undefined}
      children={children}
    />
  );
  //#endregion
};

const BottomSheetContainer = memo(BottomSheetContainerComponent, isEqual);

export default BottomSheetContainer;
