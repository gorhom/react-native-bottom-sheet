import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { DEFAULT_ACCESSIBLE } from '../bottomSheet/constants';
import BottomSheetBackground from '../bottomSheetBackground';
import { styles } from './styles';
import type { BottomSheetBackgroundContainerProps } from './types';

const BottomSheetBackgroundContainerComponent = ({
  accessible: _providedAccessible = DEFAULT_ACCESSIBLE,
  animatedIndex,
  animatedPosition,
  backgroundComponent: _providedBackgroundComponent,
  backgroundStyle: _providedBackgroundStyle,
}: BottomSheetBackgroundContainerProps) => {
  const BackgroundComponent =
    _providedBackgroundComponent || BottomSheetBackground;

  const backgroundStyle = useMemo(
    () => StyleSheet.flatten([styles.container, _providedBackgroundStyle]),
    [_providedBackgroundStyle]
  );

  return _providedBackgroundComponent === null ? null : (
    <BackgroundComponent
      accessible={_providedAccessible ?? undefined}
      pointerEvents="none"
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      style={backgroundStyle}
    />
  );
};

const BottomSheetBackgroundContainer = memo(
  BottomSheetBackgroundContainerComponent
);
BottomSheetBackgroundContainer.displayName = 'BottomSheetBackgroundContainer';

export default BottomSheetBackgroundContainer;
