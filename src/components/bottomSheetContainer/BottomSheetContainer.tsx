import React, { memo, useMemo } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { print } from '../../utilities';
import { INITIAL_CONTAINER_HEIGHT } from '../bottomSheet/constants';
import { styles } from './styles';
import type { BottomSheetContainerProps } from './types';

function BottomSheetContainerComponent({
  containerHeight,
  topInset = 0,
  bottomInset = 0,
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
  const getHandleContainerLayout = useMemo(
    () =>
      containerHeight.value === INITIAL_CONTAINER_HEIGHT
        ? function handleContainerLayout({
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
          }
        : undefined,

    [containerHeight]
  );
  //#endregion

  //#region render
  return (
    <View
      pointerEvents="box-none"
      onLayout={getHandleContainerLayout}
      style={containerStyle}
      children={children}
    />
  );
  //#endregion
}

const BottomSheetContainer = memo(BottomSheetContainerComponent);
BottomSheetContainer.displayName = 'BottomSheetContainer';

export default BottomSheetContainer;
