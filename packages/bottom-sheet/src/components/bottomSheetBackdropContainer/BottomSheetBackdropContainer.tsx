import React, { memo } from 'react';
import type { BottomSheetBackdropContainerProps } from './types';
import { styles } from './styles';

const BottomSheetBackdropContainerComponent = ({
  animatedIndex,
  animatedPosition,
  backdropComponent: BackdropComponent,
}: BottomSheetBackdropContainerProps) => {
  return BackdropComponent ? (
    <BackdropComponent
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      style={styles.container}
    />
  ) : null;
};

const BottomSheetBackdropContainer = memo(
  BottomSheetBackdropContainerComponent
);
BottomSheetBackdropContainer.displayName = 'BottomSheetBackdropContainer';

export default BottomSheetBackdropContainer;
