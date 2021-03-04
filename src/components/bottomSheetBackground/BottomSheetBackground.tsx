import React, { memo } from 'react';
import { View } from 'react-native';
import isEqual from 'lodash.isequal';
import type { BottomSheetBackgroundProps } from './types';
import { styles } from './styles';

const BottomSheetBackgroundComponent = ({
  pointerEvents,
  style,
}: BottomSheetBackgroundProps) => (
  <View pointerEvents={pointerEvents} style={[style, styles.container]} />
);

const BottomSheetBackground = memo(BottomSheetBackgroundComponent, isEqual);
BottomSheetBackground.displayName = 'BottomSheetBackground';

export default BottomSheetBackground;
