import React, { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useAppearance } from '../../hooks';

const BlurredBackground = () => {
  const { appearance } = useAppearance();
  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        backgroundColor: appearance === 'light' ? 'white' : 'black',
        opacity: 0.95,
      },
    ],
    [appearance]
  );
  return Platform.OS === 'ios' ? (
    <View style={styles.container}>
      <BlurView blurType="chromeMaterial" style={styles.blurView} />
    </View>
  ) : (
    <View style={containerStyle} />
  );
};

const styles = StyleSheet.create({
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
});

export default BlurredBackground;
