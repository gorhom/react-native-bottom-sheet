import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

const BlurredBackground = () => {
  return (
    <View style={styles.container}>
      <BlurView
        tint="systemThickMaterialDark"
        blurReductionFactor={1}
        experimentalBlurMethod="dimezisBlurView"
        intensity={100}
        style={styles.blurView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  blurView: {
    ...StyleSheet.absoluteFill,
  },
  container: {
    ...StyleSheet.absoluteFill,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
});

export default BlurredBackground;
