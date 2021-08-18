import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
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
    () => StyleSheet.flatten([styles.container, style]),
    [style]
  );
  const indicatorStyle = useMemo(
    () => StyleSheet.flatten([styles.indicator, _indicatorStyle]),
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
