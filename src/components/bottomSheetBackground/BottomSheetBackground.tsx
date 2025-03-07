import React, { memo } from 'react';
import { View } from 'react-native';
import { DEFAULT_ACCESSIBLE } from '../bottomSheet/constants';
import { styles } from './styles';
import type { BottomSheetBackgroundProps } from './types';

const BottomSheetBackgroundComponent = ({
  accessible: _providedAccessible = DEFAULT_ACCESSIBLE,
  pointerEvents,
  style,
}: BottomSheetBackgroundProps) => (
  <View
    pointerEvents={pointerEvents}
    accessible={_providedAccessible ?? undefined}
    accessibilityRole="adjustable"
    accessibilityLabel="Bottom Sheet"
    style={[styles.container, style]}
  />
);

const BottomSheetBackground = memo(BottomSheetBackgroundComponent);
BottomSheetBackground.displayName = 'BottomSheetBackground';

export default BottomSheetBackground;
