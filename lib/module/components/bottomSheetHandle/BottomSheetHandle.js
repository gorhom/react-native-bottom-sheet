import React, { memo, useMemo } from 'react';
import Animated from 'react-native-reanimated';
import { styles } from './styles';
import { DEFAULT_ACCESSIBLE, DEFAULT_ACCESSIBILITY_ROLE, DEFAULT_ACCESSIBILITY_LABEL, DEFAULT_ACCESSIBILITY_HINT } from './constants';
const BottomSheetHandleComponent = ({
  style,
  indicatorStyle: _indicatorStyle,
  children,
  accessible = DEFAULT_ACCESSIBLE,
  accessibilityRole = DEFAULT_ACCESSIBILITY_ROLE,
  accessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
  accessibilityHint = DEFAULT_ACCESSIBILITY_HINT
}) => {
  // styles
  const containerStyle = useMemo(() => [styles.container, ...[Array.isArray(style) ? style : [style]]], [style]);
  const indicatorStyle = useMemo(() => [styles.indicator, ...[Array.isArray(_indicatorStyle) ? _indicatorStyle : [_indicatorStyle]]], [_indicatorStyle]);

  // render
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: containerStyle,
    accessible: accessible ?? undefined,
    accessibilityRole: accessibilityRole ?? undefined,
    accessibilityLabel: accessibilityLabel ?? undefined,
    accessibilityHint: accessibilityHint ?? undefined
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: indicatorStyle
  }), children);
};
const BottomSheetHandle = /*#__PURE__*/memo(BottomSheetHandleComponent);
BottomSheetHandle.displayName = 'BottomSheetHandle';
export default BottomSheetHandle;
//# sourceMappingURL=BottomSheetHandle.js.map