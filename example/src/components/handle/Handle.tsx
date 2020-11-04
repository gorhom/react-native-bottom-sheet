import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { BottomSheetHandleProps } from '@gorhom/bottom-sheet';
import Animated, { interpolate, Extrapolate } from 'react-native-reanimated';
import { transformOrigin, toRad } from 'react-native-redash';

interface HandleProps extends BottomSheetHandleProps {
  style?: StyleProp<ViewStyle>;
}

const Handle: React.FC<HandleProps> = ({ style, animatedPositionIndex }) => {
  //#region animations
  const borderTopRadius = useMemo(
    () =>
      interpolate(animatedPositionIndex, {
        inputRange: [1, 2],
        outputRange: [20, 0],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedPositionIndex]
  );
  const indicatorTransformOriginY = useMemo(
    () =>
      interpolate(animatedPositionIndex, {
        inputRange: [0, 1, 2],
        outputRange: [-1, 0, 1],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedPositionIndex]
  );
  const leftIndicatorRotate = useMemo(
    () =>
      interpolate(animatedPositionIndex, {
        inputRange: [0, 1, 2],
        outputRange: [toRad(-30), 0, toRad(30)],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedPositionIndex]
  );
  const rightIndicatorRotate = useMemo(
    () =>
      interpolate(animatedPositionIndex, {
        inputRange: [0, 1, 2],
        outputRange: [toRad(30), 0, toRad(-30)],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedPositionIndex]
  );
  //#endregion

  //#region styles
  const containerStyle = useMemo(
    () => [
      styles.header,
      style,
      {
        borderTopLeftRadius: borderTopRadius,
        borderTopRightRadius: borderTopRadius,
      },
    ],
    [style, borderTopRadius]
  );
  const leftIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.leftIndicator,
      transform: transformOrigin(
        { x: 0, y: indicatorTransformOriginY },
        {
          rotate: leftIndicatorRotate,
          translateX: -5,
        }
      ),
    }),
    [indicatorTransformOriginY, leftIndicatorRotate]
  );
  const rightIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.rightIndicator,
      transform: transformOrigin(
        { x: 0, y: indicatorTransformOriginY },
        {
          rotate: rightIndicatorRotate,
          translateX: 5,
        }
      ),
    }),
    [indicatorTransformOriginY, rightIndicatorRotate]
  );
  //#endregion

  // render
  return (
    <Animated.View style={containerStyle} renderToHardwareTextureAndroid={true}>
      <Animated.View style={leftIndicatorStyle} />
      <Animated.View style={rightIndicatorStyle} />
    </Animated.View>
  );
};

export default Handle;

const styles = StyleSheet.create({
  header: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  indicator: {
    position: 'absolute',
    width: 10,
    height: 4,
    backgroundColor: '#999',
  },
  leftIndicator: {
    borderTopStartRadius: 2,
    borderBottomStartRadius: 2,
  },
  rightIndicator: {
    borderTopEndRadius: 2,
    borderBottomEndRadius: 2,
  },
});
