import React, { memo } from 'react';
import { Platform, View } from 'react-native';
import type { BottomSheetBackgroundProps } from './types';
import { styles } from './styles';

const BottomSheetBackgroundComponent = ({
  pointerEvents,
  style,
}: BottomSheetBackgroundProps) => (
  <View
    pointerEvents={pointerEvents}
    accessible={Platform.OS === 'ios'? false: true}
    accessibilityRole="adjustable"
    accessibilityLabel="Bottom Sheet"
    style={[styles.container, style]}
  />
);

const BottomSheetBackground = memo(BottomSheetBackgroundComponent);
BottomSheetBackground.displayName = 'BottomSheetBackground';

export default BottomSheetBackground;
