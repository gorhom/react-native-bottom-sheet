import React, { memo, useMemo, useRef } from 'react';
import Animated, {
  interpolate,
  Extrapolate,
  useAnimatedStyle,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import isEqual from 'lodash.isequal';
import { useBottomSheet, useReactiveSharedValue } from '../../hooks';
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

  //#region tap gesture
  const gestureHandler = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>(
    {
      onStart: () => {
        runOnJS(close)();
      },
    }
  );
  //#endregion

  //#region animated props
  const isContainerTouchable = useReactiveSharedValue<boolean>(closeOnPress);
  const containerAnimatedProps = useAnimatedProps(
    () => ({
      pointerEvents: animatedIndex.value > disappearsOnIndex ? 'auto' : 'none',
    }),
    [disappearsOnIndex]
  );
  //#endregion

  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        animatedIndex.value,
        [-1, disappearsOnIndex, appearsOnIndex],
        [0, 0, opacity],
        Extrapolate.CLAMP
      ),
      top: animatedIndex.value <= disappearsOnIndex ? WINDOW_HEIGHT : 0,
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
    <TapGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        ref={containerRef}
        style={containerStyle}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Bottom Sheet backdrop"
        accessibilityHint="Tap to close the Bottom Sheet"
        // @ts-ignore
        animatedProps={containerAnimatedProps}
      />
    </TapGestureHandler>
  ) : (
    <Animated.View pointerEvents={pointerEvents} style={containerStyle} />
  );
};

const BottomSheetBackdrop = memo(BottomSheetBackdropComponent, isEqual);

export default BottomSheetBackdrop;
