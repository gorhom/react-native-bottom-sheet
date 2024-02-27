import React, { memo, useMemo } from 'react';
import Animated from 'react-native-reanimated';
import { styles } from './styles';
import type { BottomSheetDefaultHandleProps } from './types';
import {
  DEFAULT_ACCESSIBLE,
  DEFAULT_ACCESSIBILITY_ROLE,
  DEFAULT_ACCESSIBILITY_LABEL,
  DEFAULT_ACCESSIBILITY_HINT,
} from './constants';

const BottomSheetHandleComponent = ({
  style,
  indicatorStyle: _indicatorStyle,
  children,
  accessible = DEFAULT_ACCESSIBLE,
  accessibilityRole = DEFAULT_ACCESSIBILITY_ROLE,
  accessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
  accessibilityHint = DEFAULT_ACCESSIBILITY_HINT,
}: BottomSheetDefaultHandleProps) => {
  // styles
  const containerStyle = useMemo(
    () => [styles.container, ...[Array.isArray(style) ? style : [style]]],
    [style]
  );
  const indicatorStyle = useMemo(
    () => [
      styles.indicator,
      ...[Array.isArray(_indicatorStyle) ? _indicatorStyle : [_indicatorStyle]],
    ],
    [_indicatorStyle]
  );

  // render
  return (
    <Animated.View
      style={containerStyle}
      accessible={accessible ?? undefined}
      accessibilityRole={accessibilityRole ?? undefined}
      accessibilityLabel={accessibilityLabel ?? undefined}
      accessibilityHint={accessibilityHint ?? undefined}
    >
      <Animated.View style={indicatorStyle} />
      {children}
    </Animated.View>
  );
};

const BottomSheetHandle = memo(BottomSheetHandleComponent);
BottomSheetHandle.displayName = 'BottomSheetHandle';

export default BottomSheetHandle;
