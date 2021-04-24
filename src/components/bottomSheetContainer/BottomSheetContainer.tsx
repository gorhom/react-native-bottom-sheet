import React, { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import type { BottomSheetContainerProps } from './types';
import { styles } from './styles';

const BottomSheetContainerComponent = ({
  shouldMeasureHeight,
  containerHeight,
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

  //#region styles
  const containerStyle = useMemo(
    () => [
      styles.container,
      !shouldMeasureHeight && containerHeight
        ? { height: containerHeight }
        : {},
    ],
    [containerHeight, shouldMeasureHeight]
  );
  //#endregion

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

const BottomSheetContainer = memo(BottomSheetContainerComponent);
BottomSheetContainer.displayName = 'BottomSheetContainer';

export default BottomSheetContainer;
