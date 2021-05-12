import React, { memo, useCallback, useMemo } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { print } from '../../utilities';
import { styles } from './styles';
import type { BottomSheetContainerProps } from './types';

function BottomSheetContainerComponent({
  containerHeight,
  topInset = 0,
  bottomInset = 0,
  shouldCalculateHeight = true,
  children,
}: BottomSheetContainerProps) {
  //#region styles
  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        top: topInset,
        bottom: bottomInset,
      },
    ],
    [topInset, bottomInset]
  );
  //#endregion

  //#region callbacks
  const handleContainerLayout = useCallback(
    function handleContainerLayout({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) {
      if (height === containerHeight.value) {
        return;
      }
      containerHeight.value = height;
      print({
        component: BottomSheetContainer.displayName,
        method: 'handleContainerLayout',
        params: {
          height,
        },
      });
    },
    [containerHeight]
  );
  //#endregion

  //#region render
  return (
    <View
      pointerEvents="box-none"
      onLayout={shouldCalculateHeight ? handleContainerLayout : undefined}
      style={containerStyle}
      children={children}
    />
  );
  //#endregion
}

const BottomSheetContainer = memo(BottomSheetContainerComponent);
BottomSheetContainer.displayName = 'BottomSheetContainer';

export default BottomSheetContainer;
