import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  DEFAULT_ACCESSIBILITY_HINT,
  DEFAULT_ACCESSIBILITY_LABEL,
  DEFAULT_ACCESSIBILITY_ROLE,
  DEFAULT_ACCESSIBLE,
  DEFAULT_IMPORTANT_FOR_ACCESSIBILITY,
} from './constants';
import { styles } from './styles';
import type { BottomSheetDefaultHandleProps } from './types';

function BottomSheetHandleComponent({
  style,
  indicatorStyle: _indicatorStyle,
  accessible = DEFAULT_ACCESSIBLE,
  accessibilityRole = DEFAULT_ACCESSIBILITY_ROLE,
  accessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
  accessibilityHint = DEFAULT_ACCESSIBILITY_HINT,
  importantForAccessibility = DEFAULT_IMPORTANT_FOR_ACCESSIBILITY,
  children,
}: BottomSheetDefaultHandleProps) {
  //#region styles
  const containerStyle = useMemo(
    () => [styles.container, StyleSheet.flatten(style)],
    [style]
  );
  const indicatorStyle = useMemo(
    () => [styles.indicator, StyleSheet.flatten(_indicatorStyle)],
    [_indicatorStyle]
  );
  //#endregion

  // render
  return (
    <View
      style={containerStyle}
      accessible={accessible ?? undefined}
      accessibilityRole={accessibilityRole ?? undefined}
      accessibilityLabel={accessibilityLabel ?? undefined}
      accessibilityHint={accessibilityHint ?? undefined}
      importantForAccessibility={importantForAccessibility ?? undefined}
      collapsable={true}
    >
      <View style={indicatorStyle} />
      {children}
    </View>
  );
}

const BottomSheetHandle = memo(BottomSheetHandleComponent);
BottomSheetHandle.displayName = 'BottomSheetHandle';

export default BottomSheetHandle;
