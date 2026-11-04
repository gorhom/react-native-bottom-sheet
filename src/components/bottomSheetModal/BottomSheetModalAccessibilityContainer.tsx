import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useBottomSheetModalInternal } from '../../hooks';

type BottomSheetModalAccessibilityContainerProps = React.PropsWithChildren<{
  name: string;
  onAccessibilityEscape?: ViewProps['onAccessibilityEscape'];
}>;

export function BottomSheetModalAccessibilityContainer({
  name,
  children,
  onAccessibilityEscape,
}: BottomSheetModalAccessibilityContainerProps) {
  const { activeSheetKey } = useBottomSheetModalInternal();
  const isActive = activeSheetKey === name;
  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="box-none"
      accessible={false}
      accessibilityViewIsModal={isActive}
      accessibilityElementsHidden={!isActive}
      importantForAccessibility={isActive ? 'auto' : 'no-hide-descendants'}
      onAccessibilityEscape={onAccessibilityEscape}
    >
      {children}
    </View>
  );
}
