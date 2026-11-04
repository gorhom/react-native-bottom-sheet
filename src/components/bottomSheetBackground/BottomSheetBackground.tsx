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
    accessible={false}
    accessibilityElementsHidden={true}
    importantForAccessibility="no-hide-descendants"
    style={[styles.background, style]}
  />
);

export const BottomSheetBackground = memo(BottomSheetBackgroundComponent);
BottomSheetBackground.displayName = 'BottomSheetBackground';
