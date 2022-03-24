import React, { memo } from 'react';
import { View } from 'react-native';
import type { BottomSheetBackgroundProps } from './types';
import { styles } from './styles';
import {
  DEFAULT_ACCESSIBILITY_ROLE,
  DEFAULT_ACCESSIBLE,
  DEFAULT_ACCESSIBILITY_LABEL,
} from './constants';

const BottomSheetBackgroundComponent = ({
  pointerEvents,
  style,
  accessible: _providedAccessible = DEFAULT_ACCESSIBLE,
  accessibilityRole: _providedAccessibilityRole = DEFAULT_ACCESSIBILITY_ROLE,
  accessibilityLabel: _providedAccessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
}: BottomSheetBackgroundProps) => (
  <View
    pointerEvents={pointerEvents}
    accessible={_providedAccessible ?? undefined}
    accessibilityRole={_providedAccessibilityRole ?? undefined}
    accessibilityLabel={_providedAccessibilityLabel ?? undefined}
    style={[styles.container, style]}
  />
);

const BottomSheetBackground = memo(BottomSheetBackgroundComponent);
BottomSheetBackground.displayName = 'BottomSheetBackground';

export default BottomSheetBackground;
