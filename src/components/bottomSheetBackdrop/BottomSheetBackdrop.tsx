import React, { memo, useMemo } from 'react';
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
import { useReactiveSharedValue } from '../../hooks';
import {
  DEFAULT_OPACITY,
  DEFAULT_APPEARS_ON_INDEX,
  DEFAULT_DISAPPEARS_ON_INDEX,
  DEFAULT_ENABLE_TOUCH_THROUGH,
} from './constants';
import { WINDOW_HEIGHT } from '../../constants';
import { BottomSheetDefaultBackdropProps } from './types';
import { styles } from './styles';
import usePressBehavior from './usePressBehavior';

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
  const pointerEvents = useMemo(() => (enableTouchThrough ? 'none' : 'auto'), [
    enableTouchThrough,
  ]);
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

  //#region animated props
  const isContainerTouchable = useReactiveSharedValue<boolean>(
    syntheticPressBehavior === 'close'
  );
  const containerAnimatedProps = useAnimatedProps(
    () => ({
      pointerEvents: animatedIndex.value > disappearsOnIndex ? 'auto' : 'none',
    }),
    [disappearsOnIndex]
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
    transform: [
      {
        translateY:
          animatedIndex.value <= disappearsOnIndex ? WINDOW_HEIGHT : 0,
      },
    ],
  }));
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

  return syntheticPressBehavior !== 'none' ? (
    <TapGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={containerStyle}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Bottom Sheet backdrop"
        accessibilityHint={`Tap to ${
          typeof syntheticPressBehavior === 'string'
            ? syntheticPressBehavior
            : 'move'
        } the Bottom Sheet`}
        // @ts-ignore
        animatedProps={containerAnimatedProps}
      />
    </TapGestureHandler>
  ) : (
    <Animated.View pointerEvents={pointerEvents} style={containerStyle} />
  );
};

const BottomSheetBackdrop = memo(BottomSheetBackdropComponent, isEqual);
BottomSheetBackdrop.displayName = 'BottomSheetBackdrop';

export default BottomSheetBackdrop;
