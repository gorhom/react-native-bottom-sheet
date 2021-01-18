import React, { memo, useCallback, useMemo, useRef } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import Animated, {
  interpolate,
  Extrapolate,
  useAnimatedStyle,
  useAnimatedProps,
  useSharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';
import isEqual from 'lodash.isequal';
import { useBottomSheet } from '../../hooks/useBottomSheet';
import {
  DEFAULT_OPACITY,
  DEFAULT_APPEARS_ON_INDEX,
  DEFAULT_DISAPPEARS_ON_INDEX,
  DEFAULT_ENABLE_TOUCH_THROUGH,
  DEFAULT_CLOSE_ON_PRESS,
} from './constants';
import { WINDOW_HEIGHT } from '../../constants';
import type { BottomSheetDefaultBackdropProps } from './types';
import { styles } from './styles';

const AnimatedTouchableWithoutFeedback = Animated.createAnimatedComponent(
  TouchableWithoutFeedback
);

const BottomSheetBackdropComponent = ({
  animatedIndex,
  opacity = DEFAULT_OPACITY,
  appearsOnIndex = DEFAULT_APPEARS_ON_INDEX,
  disappearsOnIndex = DEFAULT_DISAPPEARS_ON_INDEX,
  enableTouchThrough = DEFAULT_ENABLE_TOUCH_THROUGH,
  closeOnPress = DEFAULT_CLOSE_ON_PRESS,
  style,
}: BottomSheetDefaultBackdropProps) => {
  //#region hooks
  const { close } = useBottomSheet();
  //#endregion

  //#region variables
  const containerRef = useRef<Animated.View>(null);
  const pointerEvents = useMemo(() => (enableTouchThrough ? 'none' : 'auto'), [
    enableTouchThrough,
  ]);
  //#endregion

  //#region callbacks
  const handleOnPress = useCallback(() => {
    close();
  }, [close]);
  //#endregion

  //#region animated props
  const isContainerTouchable = useSharedValue<boolean>(closeOnPress, true);
  const containerAnimatedProps = useAnimatedProps(() => ({
    pointerEvents: isContainerTouchable.value ? 'auto' : 'none',
  }));
  //#endregion

  //#region styles
  const buttonAnimatedStyle = useAnimatedStyle(
    () => ({
      top: animatedIndex.value <= disappearsOnIndex ? WINDOW_HEIGHT : 0,
    }),
    [disappearsOnIndex]
  );
  const buttonStyle = useMemo(() => [style, buttonAnimatedStyle], [
    style,
    buttonAnimatedStyle,
  ]);
  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        animatedIndex.value,
        [-1, disappearsOnIndex, appearsOnIndex],
        [0, 0, opacity],
        Extrapolate.CLAMP
      ),
    }),
    [opacity, disappearsOnIndex, appearsOnIndex]
  );
  const containerStyle = useMemo(
    () => [styles.container, style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );
  //#endregion

  //#region effects
  useAnimatedReaction(
    () => animatedIndex.value <= disappearsOnIndex,
    shouldDisableTouchability => {
      if (shouldDisableTouchability) {
        isContainerTouchable.value = false;
      } else {
        isContainerTouchable.value = true;
      }
    },
    [disappearsOnIndex]
  );
  //#endregion

  return closeOnPress ? (
    <AnimatedTouchableWithoutFeedback
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Bottom Sheet backdrop"
      accessibilityHint="Tap to close the Bottom Sheet"
      onPress={handleOnPress}
      style={buttonStyle}
    >
      <Animated.View
        ref={containerRef}
        style={containerStyle}
        // @ts-ignore
        animatedProps={containerAnimatedProps}
      />
    </AnimatedTouchableWithoutFeedback>
  ) : (
    <Animated.View pointerEvents={pointerEvents} style={containerStyle} />
  );
};

const BottomSheetBackdrop = memo(BottomSheetBackdropComponent, isEqual);

export default BottomSheetBackdrop;
