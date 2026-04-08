import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetBackground } from './BottomSheetBackground';
import type { BottomSheetBackgroundContainerProps } from './types';

const BottomSheetBackgroundContainerComponent = ({
  animatedIndex,
  animatedPosition,
  backgroundComponent: _providedBackgroundComponent,
  backgroundStyle: _providedBackgroundStyle,
}: BottomSheetBackgroundContainerProps) => {
  //#region style
  const backgroundStyle = useMemo(
    () => [StyleSheet.absoluteFill, _providedBackgroundStyle],
    [_providedBackgroundStyle]
  );
  //#endregion

  const BackgroundComponent =
    _providedBackgroundComponent ?? BottomSheetBackground;
  return (
    <BackgroundComponent
      pointerEvents="none"
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      style={backgroundStyle}
    />
  );
};

export const BottomSheetBackgroundContainer = memo(
  BottomSheetBackgroundContainerComponent
);
BottomSheetBackgroundContainer.displayName = 'BottomSheetBackgroundContainer';
