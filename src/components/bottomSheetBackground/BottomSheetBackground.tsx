import React, { memo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import type { BottomSheetBackgroundProps } from './types';

const BottomSheetBackgroundComponent = ({
  pointerEvents,
  style,
}: BottomSheetBackgroundProps) => (
  <View
    pointerEvents={pointerEvents}
    accessible={true}
    accessibilityRole="adjustable"
    accessibilityLabel="Bottom Sheet"
    style={[styles.container, style]}
  />
);

const BottomSheetBackground = memo(BottomSheetBackgroundComponent);
BottomSheetBackground.displayName = 'BottomSheetBackground';

export default BottomSheetBackground;
