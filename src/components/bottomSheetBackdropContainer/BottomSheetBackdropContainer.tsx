import React, { memo } from 'react';
import isEqual from 'lodash.isequal';
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
  BottomSheetBackdropContainerComponent,
  isEqual
);

export default BottomSheetBackdropContainer;
