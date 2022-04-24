import React, { memo, useMemo } from 'react';
import Animated from 'react-native-reanimated';
import { styles } from './styles';
import type { BottomSheetDefaultHandleProps } from './types';

const BottomSheetHandleComponent = ({
  style,
  indicatorStyle: _indicatorStyle,
  children,
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
    <Animated.View style={containerStyle}>
      <Animated.View style={indicatorStyle} />
      {children}
    </Animated.View>
  );
};

const BottomSheetHandle = memo(BottomSheetHandleComponent);
BottomSheetHandle.displayName = 'BottomSheetHandle';

export default BottomSheetHandle;
