import type { BottomSheetHandleProps } from '@gorhom/bottom-sheet';
import React, { memo, useMemo } from 'react';
import { type StyleProp, StyleSheet, Text, type ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { toRad } from 'react-native-redash';
import { transformOrigin } from '../../utilities/transformOrigin';

interface CustomHandleProps extends BottomSheetHandleProps {
  title: string;
}

const CustomHandleComponent: React.FC<CustomHandleProps> = ({
  ref,
  title,
  style,
  onLayout,
  animatedIndex,
}) => {
  //#region animations

  const indicatorTransformOriginY = useDerivedValue(
    () =>
      interpolate(
        animatedIndex.value,
        [0, 1, 2],
        [-1, 0, 1],
        Extrapolation.CLAMP
      ),
    [animatedIndex.value]
  );
  //#endregion

  //#region styles
  const containerStyle = useMemo(() => [styles.container, style], [style]);
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const borderTopRadius = interpolate(
      animatedIndex.value,
      [1, 2],
      [20, 0],
      Extrapolation.CLAMP
    );
    return {
      borderTopLeftRadius: borderTopRadius,
      borderTopRightRadius: borderTopRadius,
    };
  }, [animatedIndex.value]);
  const leftIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.leftIndicator,
    }),
    []
  );
  const leftIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const leftIndicatorRotate = interpolate(
      animatedIndex.value,
      [0, 1, 2],
      [toRad(-30), 0, toRad(30)],
      Extrapolation.CLAMP
    );
    return {
      transform: transformOrigin(
        { x: 0, y: indicatorTransformOriginY.value },
        {
          rotate: `${leftIndicatorRotate}rad`,
        },
        {
          translateX: -5,
        }
      ),
    };
  }, [animatedIndex.value, indicatorTransformOriginY.value]);
  const rightIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.rightIndicator,
    }),
    []
  );
  const rightIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const rightIndicatorRotate = interpolate(
      animatedIndex.value,
      [0, 1, 2],
      [toRad(30), 0, toRad(-30)],
      Extrapolation.CLAMP
    );
    return {
      transform: transformOrigin(
        { x: 0, y: indicatorTransformOriginY.value },
        {
          rotate: `${rightIndicatorRotate}rad`,
        },
        {
          translateX: 5,
        }
      ),
    };
  }, [animatedIndex.value, indicatorTransformOriginY.value]);
  //#endregion

  // render
  return (
    <Animated.View
      ref={ref}
      style={[containerStyle, containerAnimatedStyle]}
      onLayout={onLayout}
      renderToHardwareTextureAndroid={true}
    >
      <Animated.View style={[leftIndicatorStyle, leftIndicatorAnimatedStyle]} />
      <Animated.View
        style={[rightIndicatorStyle, rightIndicatorAnimatedStyle]}
      />
      <Text style={styles.title}>{title}</Text>
    </Animated.View>
  );
};

export const CustomHandle = memo(CustomHandleComponent);

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    alignItems: 'center',
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.125)',
    zIndex: 99999,
  },
  indicator: {
    marginTop: 10,
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
  title: {
    marginTop: 26,
    fontSize: 20,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
