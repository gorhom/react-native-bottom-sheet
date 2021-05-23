import React, { memo, useCallback, useMemo, useRef } from 'react';
import Animated, {
  interpolate,
  Extrapolate,
  useAnimatedStyle,
  useAnimatedReaction,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {
  DEFAULT_OPACITY,
  DEFAULT_APPEARS_ON_INDEX,
  DEFAULT_DISAPPEARS_ON_INDEX,
  DEFAULT_ENABLE_TOUCH_THROUGH,
} from './constants';
import { usePressBehavior } from './usePressBehavior';
import { styles } from './styles';
import type { BottomSheetDefaultBackdropProps } from './types';

const BottomSheetBackdropComponent = ({
  animatedIndex,
  opacity = DEFAULT_OPACITY,
  appearsOnIndex = DEFAULT_APPEARS_ON_INDEX,
  disappearsOnIndex = DEFAULT_DISAPPEARS_ON_INDEX,
  enableTouchThrough = DEFAULT_ENABLE_TOUCH_THROUGH,
  pressBehavior,
  closeOnPress,
  style,
}: BottomSheetDefaultBackdropProps) => {
  //#region hooks
  const { handleOnPress, syntheticPressBehavior } = usePressBehavior({
    pressBehavior,
    closeOnPress,
    disappearsOnIndex,
  });
  //#endregion

  //#region variables
  const containerRef = useRef<Animated.View>(null);
  const pointerEvents = useMemo(() => (enableTouchThrough ? 'none' : 'auto'), [
    enableTouchThrough,
  ]);
  //#endregion

  //#region callbacks
  const handleContainerTouchability = useCallback(
    (shouldDisableTouchability: boolean) => {
      if (!containerRef.current) {
        return;
      }
      // @ts-ignore
      containerRef.current.setNativeProps({
        pointerEvents: shouldDisableTouchability ? 'none' : 'auto',
      });
    },
    []
  );
  //#endregion

  //#region tap gesture
  const gestureHandler = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>(
    {
      onFinish: () => {
        runOnJS(handleOnPress)();
      },
    },
    [handleOnPress]
  );
  //#endregion

  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, disappearsOnIndex, appearsOnIndex],
      [0, 0, opacity],
      Extrapolate.CLAMP
    ),
    flex: 1,
  }));
  const containerStyle = useMemo(
    () => [styles.container, style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );
  //#endregion

  //#region effects
  useAnimatedReaction(
    () => animatedIndex.value <= disappearsOnIndex,
    (shouldDisableTouchability, previous) => {
      if (shouldDisableTouchability === previous) {
        return;
      }
      runOnJS(handleContainerTouchability)(shouldDisableTouchability);
    },
    [disappearsOnIndex]
  );
  //#endregion

  return syntheticPressBehavior !== 'none' ? (
    <TapGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        ref={containerRef}
        style={containerStyle}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Bottom Sheet backdrop"
        accessibilityHint={`Tap to ${
          typeof syntheticPressBehavior === 'string'
            ? syntheticPressBehavior
            : 'move'
        } the Bottom Sheet`}
      />
    </TapGestureHandler>
  ) : (
    <Animated.View
      ref={containerRef}
      pointerEvents={pointerEvents}
      style={containerStyle}
    />
  );
};

const BottomSheetBackdrop = memo(BottomSheetBackdropComponent);
BottomSheetBackdrop.displayName = 'BottomSheetBackdrop';

export default BottomSheetBackdrop;
