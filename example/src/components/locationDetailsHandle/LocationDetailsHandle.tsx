import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useAppearance } from '../../hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

const LocationDetailsHandle = () => {
  // hooks
  const { appearance } = useAppearance();

  // styles
  const indicatorStyle = useMemo(
    () => [
      styles.indicator,
      {
        backgroundColor:
          appearance === 'light'
            ? 'rgba(0, 0, 0, 0.25)'
            : 'rgba(255, 255, 255, 0.25)',
      },
    ],
    [appearance]
  );

  // render
  return (
    <View style={styles.container}>
      <View style={indicatorStyle} />
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  indicator: {
    alignSelf: 'center',
    width: (8 * SCREEN_WIDTH) / 100,
    height: 5,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default LocationDetailsHandle;
