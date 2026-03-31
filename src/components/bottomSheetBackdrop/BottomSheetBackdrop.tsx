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
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
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

function BottomSheetBackdropComponent({
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
}: BottomSheetDefaultBackdropProps) {
  const { snapToIndex, close } = useBottomSheet();
  const isMounted = useRef(false);

  const opacity = _providedOpacity ?? DEFAULT_OPACITY;
  const appearsOnIndex = _providedAppearsOnIndex ?? DEFAULT_APPEARS_ON_INDEX;
  const disappearsOnIndex =
    _providedDisappearsOnIndex ?? DEFAULT_DISAPPEARS_ON_INDEX;
  const enableTouchThrough =
    _providedEnableTouchThrough ?? DEFAULT_ENABLE_TOUCH_THROUGH;

  const [pointerEvents, setPointerEvents] = useState<ViewProps['pointerEvents']>(
    enableTouchThrough ? 'none' : 'auto'
  );

  const handleOnPress = useCallback(() => {
    onPress?.();

    if (pressBehavior === 'close') {
      close();
      return;
    }

    if (pressBehavior === 'collapse') {
      snapToIndex(disappearsOnIndex);
      return;
    }

    if (typeof pressBehavior === 'number') {
      snapToIndex(pressBehavior);
    }
  }, [close, disappearsOnIndex, onPress, pressBehavior, snapToIndex]);

  const handleContainerTouchability = useCallback(
    (shouldDisableTouchability: boolean) => {
      if (isMounted.current) {
        setPointerEvents(shouldDisableTouchability ? 'none' : 'auto');
      }
    },
    []
  );

  const tapHandler = useMemo(
    () =>
      Gesture.Tap().onEnd(() => {
        runOnJS(handleOnPress)();
      }),
    [handleOnPress]
  );

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
    [containerAnimatedStyle, style]
  );

  useAnimatedReaction(
    () => animatedIndex.value <= disappearsOnIndex,
    (shouldDisableTouchability, previous) => {
      if (shouldDisableTouchability !== previous) {
        runOnJS(handleContainerTouchability)(shouldDisableTouchability);
      }
    },
    [disappearsOnIndex]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const animatedView = (
    <Animated.View
      style={containerStyle}
      pointerEvents={pointerEvents}
      accessible={_providedAccessible ?? undefined}
      accessibilityRole={_providedAccessibilityRole ?? undefined}
      accessibilityLabel={_providedAccessibilityLabel ?? undefined}
      accessibilityHint={
        _providedAccessibilityHint ??
        `Tap to ${
          typeof pressBehavior === 'string' ? pressBehavior : 'move'
        } the Bottom Sheet`
      }
    >
      {children}
    </Animated.View>
  );

  if (pressBehavior === 'none') {
    return animatedView;
  }

  return <GestureDetector gesture={tapHandler}>{animatedView}</GestureDetector>;
}

export const BottomSheetBackdrop = memo(BottomSheetBackdropComponent);
BottomSheetBackdrop.displayName = 'BottomSheetBackdrop';
