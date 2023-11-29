import React, { memo, useMemo } from 'react';
import Animated from 'react-native-reanimated';
import { styles } from './styles';

const BottomSheetHandleComponent = ({
  style,
  indicatorStyle: _indicatorStyle,
  children
}) => {
  // styles
  const containerStyle = useMemo(() => [styles.container, ...[Array.isArray(style) ? style : [style]]], [style]);
  const indicatorStyle = useMemo(() => [styles.indicator, ...[Array.isArray(_indicatorStyle) ? _indicatorStyle : [_indicatorStyle]]], [_indicatorStyle]); // render

  return /*#__PURE__*/React.createElement(Animated.View, {
    style: containerStyle
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: indicatorStyle
  }), children);
};

const BottomSheetHandle = /*#__PURE__*/memo(BottomSheetHandleComponent);
BottomSheetHandle.displayName = 'BottomSheetHandle';
export default BottomSheetHandle;
//# sourceMappingURL=BottomSheetHandle.js.map