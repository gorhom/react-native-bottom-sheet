import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import type { StyleProp, ViewStyle } from 'react-native';

const { width: windowWidth } = Dimensions.get('window');

export interface BottomSheetHandleProps {
  containerStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  animatedContainerStyle?: Animated.AnimatedStyleProp<ViewStyle>;
  animatedIndicatorStyle?: Animated.AnimatedStyleProp<ViewStyle>;
}

const BottomSheetHandleComponent = ({
  containerStyle,
  indicatorStyle,
  animatedContainerStyle,
  animatedIndicatorStyle,
}: BottomSheetHandleProps) => {
  return (
    <Animated.View
      style={[styles.container, containerStyle, animatedContainerStyle]}
      shouldRasterizeIOS={true}
    >
      <Animated.View
        style={[styles.indicator, indicatorStyle, animatedIndicatorStyle]}
      />
    </Animated.View>
  );
};

export const BottomSheetHandle = BottomSheetHandleComponent;

export const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: 'white',
  },
  indicator: {
    alignSelf: 'center',
    width: (7.5 * windowWidth) / 100,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
});
