import React, { memo } from 'react';
import isEqual from 'lodash.isequal';
import type { BottomSheetBackdropContainerProps } from './types';
import { styles } from './styles';

const BottomSheetBackdropContainerComponent = ({
  animatedIndex,
  animatedPosition,
  backdropComponent: BackdropComponent,
  bottomInset,
}: BottomSheetBackdropContainerProps) => {
  return BackdropComponent ? (
    <BackdropComponent
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      // eslint-disable-next-line react-native/no-inline-styles
      style={[styles.container, { bottom: bottomInset ? bottomInset : 0 }]}
    />
  ) : null;
};

const BottomSheetBackdropContainer = memo(
  BottomSheetBackdropContainerComponent,
  isEqual
);

export default BottomSheetBackdropContainer;
