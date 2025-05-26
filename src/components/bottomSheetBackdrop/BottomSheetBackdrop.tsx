import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ViewProps } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
  Extrapolation,
} from 'react-native-reanimated';
import { useBottomSheet } from '../../hooks';
import {
  DEFAULT_ACCESSIBILITY_HINT,
  DEFAULT_ACCESSIBILITY_LABEL,
  DEFAULT_ACCESSIBILITY_ROLE,
  DEFAULT_ACCESSIBLE,
  DEFAULT_APPEARS_ON_INDEX,
  DEFAULT_DISAPPEARS_ON_INDEX,
  DEFAULT_ENABLE_TOUCH_THROUGH,
  DEFAULT_OPACITY,
  DEFAULT_PRESS_BEHAVIOR,
} from './constants';
import { styles } from './styles';
import type { BottomSheetDefaultBackdropProps } from './types';

const BottomSheetBackdropComponent = ({
  animatedIndex,
  opacity: _providedOpacity,
  appearsOnIndex: _providedAppearsOnIndex,
  disappearsOnIndex: _providedDisappearsOnIndex,
  enableTouchThrough: _providedEnableTouchThrough,
  pressBehavior = DEFAULT_PRESS_BEHAVIOR,
  onPress,
  style,
  children,
  accessible: _providedAccessible = DEFAULT_ACCESSIBLE,
  accessibilityRole: _providedAccessibilityRole = DEFAULT_ACCESSIBILITY_ROLE,
  accessibilityLabel: _providedAccessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
  accessibilityHint: _providedAccessibilityHint = DEFAULT_ACCESSIBILITY_HINT,
}: BottomSheetDefaultBackdropProps) => {
  //#region hooks
  const { snapToIndex, close } = useBottomSheet();
  const isMounted = useRef(false);
  //#endregion

  //#region defaults
  const opacity = _providedOpacity ?? DEFAULT_OPACITY;
  const appearsOnIndex = _providedAppearsOnIndex ?? DEFAULT_APPEARS_ON_INDEX;
  const disappearsOnIndex =
    _providedDisappearsOnIndex ?? DEFAULT_DISAPPEARS_ON_INDEX;
  const enableTouchThrough =
    _providedEnableTouchThrough ?? DEFAULT_ENABLE_TOUCH_THROUGH;
  //#endregion

  //#region variables
  const [pointerEvents, setPointerEvents] = useState<
    ViewProps['pointerEvents']
  >(enableTouchThrough ? 'none' : 'auto');
  //#endregion

  //#region callbacks
  const handleOnPress = useCallback(() => {
    onPress?.();

    if (pressBehavior === 'close') {
      close();
    } else if (pressBehavior === 'collapse') {
      snapToIndex(disappearsOnIndex as number);
    } else if (typeof pressBehavior === 'number') {
      snapToIndex(pressBehavior);
    }
  }, [snapToIndex, close, disappearsOnIndex, pressBehavior, onPress]);
  const handleContainerTouchability = useCallback(
    (shouldDisableTouchability: boolean) => {
      isMounted.current &&
        setPointerEvents(shouldDisableTouchability ? 'none' : 'auto');
    },
    []
  );
  //#endregion

  //#region tap gesture
  const tapHandler = useMemo(() => {
    const gesture = Gesture.Tap().onEnd(() => {
      runOnJS(handleOnPress)();
    });
    return gesture;
  }, [handleOnPress]);
  //#endregion

  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        animatedIndex.value,
        [-1, disappearsOnIndex, appearsOnIndex],
        [0, 0, opacity],
        Extrapolation.CLAMP
      ),
    }),
    [animatedIndex, appearsOnIndex, disappearsOnIndex, opacity]
  );
  const containerStyle = useMemo(
    () => [styles.backdrop, style, containerAnimatedStyle],
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

  // addressing updating the state after unmounting.
  // [link](https://github.com/gorhom/react-native-bottom-sheet/issues/1376)
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  //#endregion

  const AnimatedView = (
    <Animated.View
      style={containerStyle}
      pointerEvents={pointerEvents}
      accessible={_providedAccessible ?? undefined}
      accessibilityRole={_providedAccessibilityRole ?? undefined}
      accessibilityLabel={_providedAccessibilityLabel ?? undefined}
      accessibilityHint={
        _providedAccessibilityHint
          ? _providedAccessibilityHint
          : `Tap to ${
              typeof pressBehavior === 'string' ? pressBehavior : 'move'
            } the Bottom Sheet`
      }
    >
      {children}
    </Animated.View>
  );

  return pressBehavior !== 'none' ? (
    <GestureDetector gesture={tapHandler}>{AnimatedView}</GestureDetector>
  ) : (
    AnimatedView
  );
};

export const BottomSheetBackdrop = memo(BottomSheetBackdropComponent);
BottomSheetBackdrop.displayName = 'BottomSheetBackdrop';
