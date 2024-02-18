import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from 'react-native-reanimated';

interface CustomBackgroundProps extends BottomSheetBackgroundProps {}

const CustomBackgroundComponent: React.FC<CustomBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      // @ts-ignore
      backgroundColor: interpolateColor(
        animatedIndex.value,
        [0, 1],
        ['#ffffff', '#a8b5eb']
      ),
    }),
    [animatedIndex.value]
  );
  const containerStyle = useMemo(
    () => [styles.container, style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );
  //#endregion

  // render
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export const CustomBackground = memo(CustomBackgroundComponent);

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
  },
});
