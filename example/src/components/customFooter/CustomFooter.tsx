import React, { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  useBottomSheet,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { toRad } from 'react-native-redash';

const AnimatedRectButton = Animated.createAnimatedComponent(Pressable);

interface CustomFooterProps extends BottomSheetFooterProps {}

const CustomFooterComponent = ({
  animatedFooterPosition,
}: CustomFooterProps) => {
  //#region hooks
  const { bottom: bottomSafeArea } = useSafeAreaInsets();
  const { expand, collapse, animatedIndex } = useBottomSheet();
  //#endregion

  //#region styles
  const arrowAnimatedStyle = useAnimatedStyle(() => {
    const arrowRotate = interpolate(
      animatedIndex.value,
      [0, 1],
      [toRad(0), toRad(-180)],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ rotate: `${arrowRotate}rad` }],
    };
  }, [animatedIndex.value]);
  const arrowStyle = useMemo(
    () => [arrowAnimatedStyle, styles.arrow],
    [arrowAnimatedStyle]
  );
  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        animatedIndex.value,
        [-0.85, 0],
        [0, 1],
        Extrapolation.CLAMP
      ),
    }),
    [animatedIndex]
  );
  const containerStyle = useMemo(
    () => [containerAnimatedStyle, styles.container],
    [containerAnimatedStyle]
  );
  //#endregion

  const handleArrowPress = useCallback(() => {
    if (animatedIndex.value === 0) {
      expand();
    } else {
      collapse();
    }
  }, [expand, collapse, animatedIndex]);

  return (
    <BottomSheetFooter
      bottomInset={bottomSafeArea}
      animatedFooterPosition={animatedFooterPosition}
    >
      <AnimatedRectButton style={containerStyle} onPress={handleArrowPress}>
        <Animated.Text style={arrowStyle}>⌃</Animated.Text>
      </AnimatedRectButton>
    </BottomSheetFooter>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 12,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#80f',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8.0,

    elevation: 8,
  },
  arrow: {
    fontSize: 20,
    height: 20,
    textAlignVertical: 'center',
    fontWeight: '900',
    color: '#fff',
  },
});

export const CustomFooter = memo(CustomFooterComponent);
