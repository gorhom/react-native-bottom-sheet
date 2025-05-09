import React, { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { ShowcaseLabel, useShowcaseTheme } from '@gorhom/showcase-template';
import { MIDDLE_SNAP_POINT } from './LocationListBottomSheet';

interface WeatherProps {
  animatedPosition: Animated.SharedValue<number>;
  animatedIndex: Animated.SharedValue<number>;
}

const SPACE = 8;

const Weather = ({ animatedIndex, animatedPosition }: WeatherProps) => {
  //#region state
  const [height, setHeight] = useState(0);
  //#endregion

  //#region hooks
  const { height: screenHeight } = useSafeAreaFrame();
  const { colors } = useShowcaseTheme();
  //#endregion

  //#region callbacks
  const handleOnLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setHeight(layout.height);
    },
    []
  );
  //#endregion

  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const belowMiddlePosition =
      screenHeight - animatedPosition.value < MIDDLE_SNAP_POINT;
    return {
      opacity: interpolate(
        animatedIndex.value,
        [1, 1.125],
        [1, 0],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateY: belowMiddlePosition
            ? animatedPosition.value - height - SPACE
            : screenHeight - MIDDLE_SNAP_POINT - height - SPACE,
        },
      ],
    };
  }, [animatedIndex.value, animatedPosition.value, height, screenHeight]);
  const containerStyle = useMemo(
    () => [
      styles.container,
      { backgroundColor: colors.secondaryCard },
      containerAnimatedStyle,
    ],
    [colors.secondaryCard, containerAnimatedStyle]
  );
  //#endregion

  return (
    <Animated.View onLayout={handleOnLayout} style={containerStyle}>
      <ShowcaseLabel style={styles.label}>☁️ 12°</ShowcaseLabel>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    top: 0,
    padding: 6,
    marginTop: 0,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    lineHeight: 12,
    fontWeight: '800',
  },
});

export default Weather;
