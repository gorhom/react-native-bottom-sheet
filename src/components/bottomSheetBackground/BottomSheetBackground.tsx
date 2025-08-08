import React, { memo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import type { BottomSheetBackgroundProps } from './types';
import {
  DEFAULT_ACCESSIBILITY_LABEL,
  DEFAULT_ACCESSIBILITY_ROLE,
  DEFAULT_ACCESSIBLE
} from "./constants";

const BottomSheetBackgroundComponent = ({
  accessible = DEFAULT_ACCESSIBLE,
  accessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
  accessibilityRole = DEFAULT_ACCESSIBILITY_ROLE,
  pointerEvents,
  style,
}: BottomSheetBackgroundProps) => (
  <View
    pointerEvents={pointerEvents}
    accessible={accessible}
    accessibilityRole={accessibilityRole}
    accessibilityLabel={accessibilityLabel}
    style={[styles.background, style]}
  />
);

export const BottomSheetBackground = memo(BottomSheetBackgroundComponent);
BottomSheetBackground.displayName = 'BottomSheetBackground';
