import React, { memo } from 'react';
import type { BottomSheetBackdropContainerProps } from './types';
import { styles } from './styles';

const BottomSheetBackdropContainerComponent = ({
  animatedIndex,
  animatedPosition,
  backdropComponent: BackdropComponent,
  bottomInset
}: BottomSheetBackdropContainerProps) => {
  return BackdropComponent ? (
    <BackdropComponent
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      style={[styles.container, { bottom: bottomInset ? bottomInset : 0 }]}
    />
  ) : null;
};

const BottomSheetBackdropContainer = memo(
  BottomSheetBackdropContainerComponent
);
BottomSheetBackdropContainer.displayName = 'BottomSheetBackdropContainer';

export default BottomSheetBackdropContainer;
