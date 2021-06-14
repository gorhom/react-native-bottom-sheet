import React, { memo, useMemo } from 'react';
import BottomSheetBackground from '../bottomSheetBackground';
import type { BottomSheetBackgroundContainerProps } from './types';
import { styles } from './styles';

const BottomSheetBackgroundContainerComponent = ({
  animatedIndex,
  animatedPosition,
  backgroundComponent: _providedBackgroundComponent,
}: BottomSheetBackgroundContainerProps) => {
  const BackgroundComponent = useMemo(
    () => _providedBackgroundComponent || BottomSheetBackground,
    [_providedBackgroundComponent]
  );
  return _providedBackgroundComponent === null ? null : (
    <BackgroundComponent
      pointerEvents="none"
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      style={styles.container}
    />
  );
};

const BottomSheetBackgroundContainer = memo(
  BottomSheetBackgroundContainerComponent
);
BottomSheetBackgroundContainer.displayName = 'BottomSheetBackgroundContainer';

export default BottomSheetBackgroundContainer;
