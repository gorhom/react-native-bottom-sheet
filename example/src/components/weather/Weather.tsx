import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Extrapolate, interpolate } from 'react-native-reanimated';
import { ShowcaseLabel, useShowcaseTheme } from '@gorhom/showcase-template';
import { SEARCH_HANDLE_HEIGHT } from '../../components/searchHandle';

interface WeatherProps {
  animatedPosition: Animated.Node<number>;
  snapPoints: number[];
}

const Weather = ({ animatedPosition, snapPoints }: WeatherProps) => {
  // hooks
  const { colors } = useShowcaseTheme();

  // styles
  const containerStyle = useMemo(
    () => ({
      ...styles.container,
      backgroundColor: colors.secondaryCard,
      transform: [
        {
          translateY: interpolate(animatedPosition, {
            inputRange: [
              snapPoints[0] + SEARCH_HANDLE_HEIGHT,
              snapPoints[1] + SEARCH_HANDLE_HEIGHT,
            ],
            outputRange: [
              -(snapPoints[0] + SEARCH_HANDLE_HEIGHT),
              -(snapPoints[1] + SEARCH_HANDLE_HEIGHT),
            ],
            extrapolate: Extrapolate.CLAMP,
          }),
        },
        {
          scale: interpolate(animatedPosition, {
            inputRange: [snapPoints[1], snapPoints[2]],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP,
          }),
        },
      ],
    }),
    [colors.secondaryCard, animatedPosition, snapPoints]
  );
  return (
    <Animated.View style={containerStyle}>
      <ShowcaseLabel style={styles.label}>☁️12°</ShowcaseLabel>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    padding: 2,
    borderRadius: 4,
  },
  label: {
    fontSize: 16,
  },
});

export default Weather;
