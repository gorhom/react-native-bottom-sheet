import React, { memo } from 'react';
import { View } from 'react-native';
import isEqual from 'lodash.isequal';
import { styles } from './styles';

const BottomSheetDefaultBackgroundComponent = () => (
  <View pointerEvents="none" style={styles.container} />
);

const BottomSheetDefaultBackground = memo(
  BottomSheetDefaultBackgroundComponent,
  isEqual
);

export default BottomSheetDefaultBackground;
