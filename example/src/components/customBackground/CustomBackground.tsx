import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import Animated from 'react-native-reanimated';
import { interpolateColor } from 'react-native-redash';

interface CustomBackgroundProps extends BottomSheetBackgroundProps {}

const CustomBackground: React.FC<CustomBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  //#region styles
  const containerStyle = useMemo(
    () => [
      styles.container,
      style,
      {
        backgroundColor: interpolateColor(animatedIndex, {
          inputRange: [0, 1],
          outputRange: ['#ffffff', '#a8b5eb'],
        }),
      },
    ],
    [style, animatedIndex]
  );
  //#endregion

  // render
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default CustomBackground;

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
  },
});
