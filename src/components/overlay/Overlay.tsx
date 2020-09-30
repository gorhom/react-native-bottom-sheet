import React, { memo, useMemo } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import Animated from 'react-native-reanimated';
import isEqual from 'lodash.isequal';
import { styles } from './styles';
import type { BottomSheetOverlayProps } from './types';

const BottomSheetOverlayComponent = ({
  color = 'black',
  pointerEvents,
  animatedOpacity,
  onPress,
}: BottomSheetOverlayProps) => {
  //#region styles
  const containerStyle = useMemo(
    () => [
      styles.container,
      { opacity: animatedOpacity, backgroundColor: color },
    ],
    [color, animatedOpacity]
  );
  //#endregion

  //#region render
  if (onPress) {
    return (
      <TouchableWithoutFeedback onPress={onPress} style={styles.container}>
        <Animated.View pointerEvents={pointerEvents} style={containerStyle} />
      </TouchableWithoutFeedback>
    );
  } else {
    return (
      <Animated.View pointerEvents={pointerEvents} style={containerStyle} />
    );
  }
  //#endregion
};

const BottomSheetOverlay = memo(BottomSheetOverlayComponent, isEqual);

export default BottomSheetOverlay;
