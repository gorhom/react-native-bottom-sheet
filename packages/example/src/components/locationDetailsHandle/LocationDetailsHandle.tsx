import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useShowcaseTheme } from '@gorhom/showcase-template';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

const LocationDetailsHandle = () => {
  // hooks
  const { colors } = useShowcaseTheme();

  // styles
  const indicatorStyle = useMemo(
    () => [
      styles.indicator,
      {
        backgroundColor: colors.border,
      },
    ],
    [colors.border]
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
