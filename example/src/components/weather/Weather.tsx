import React, { useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useAppearance } from '../../hooks';
import Text from '../text';
import { SEARCH_HANDLE_HEIGHT } from '../../components/searchHandle';
import { useSafeArea } from 'react-native-safe-area-context';
import { LOCATION_DETAILS_HEIGHT } from '../locationDetails';

interface WeatherProps {
  animatedPosition: Animated.SharedValue<number>;
  animatedIndex: Animated.SharedValue<number>;
  snapPoints: number[];
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Weather = ({
  animatedIndex,
  animatedPosition,
  snapPoints,
}: WeatherProps) => {
  // hooks
  const { appearance } = useAppearance();
  const { bottom: bottomSafeArea } = useSafeArea();

  // styles
  const lockedYPosition = useMemo(
    () =>
      SCREEN_HEIGHT -
      SEARCH_HANDLE_HEIGHT -
      LOCATION_DETAILS_HEIGHT -
      bottomSafeArea,
    [bottomSafeArea]
  );
  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY:
            animatedPosition.value > lockedYPosition
              ? animatedPosition.value - 24
              : lockedYPosition - 24,
        },
        {
          scale: interpolate(
            animatedIndex.value,
            [1, 1.25],
            [1, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    }),
    [snapPoints, lockedYPosition]
  );
  const containerStyle = useMemo(
    () => [
      styles.container,
      { backgroundColor: appearance === 'dark' ? '#333' : '#FCFCFC' },
      containerAnimatedStyle,
    ],
    [appearance, containerAnimatedStyle]
  );
  return (
    <Animated.View style={containerStyle}>
      <Text style={styles.label}>☁️12°</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    top: 0,
    padding: 2,
    marginTop: 0,
    borderRadius: 4,
  },
  label: {
    fontSize: 16,
    lineHeight: 16,
  },
});

export default Weather;
