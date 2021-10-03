import React, { memo, useCallback, useMemo, useRef } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  and,
  block,
  call,
  cond,
  eq,
  Extrapolate,
  neq,
  not,
  set,
  useCode,
} from 'react-native-reanimated';
import isEqual from 'lodash.isequal';
import { useReactiveValue } from '../../hooks';
import {
  DEFAULT_OPACITY,
  DEFAULT_APPEARS_ON_INDEX,
  DEFAULT_DISAPPEARS_ON_INDEX,
  DEFAULT_ENABLE_TOUCH_THROUGH,
  DEFAULT_ACCESSIBLE,
  DEFAULT_ACCESSIBILITY_ROLE,
  DEFAULT_ACCESSIBILITY_LABEL,
  DEFAULT_ACCESSIBILITY_HINT,
} from './constants';
import { WINDOW_HEIGHT } from '../../constants';
import { usePressBehavior } from './usePressBehavior';
import { styles } from './styles';
import type { BottomSheetDefaultBackdropProps } from './types';

const {
  interpolate: interpolateV1,
  interpolateNode: interpolateV2,
} = require('react-native-reanimated');
const interpolate = interpolateV2 || interpolateV1;

const AnimatedTouchableWithoutFeedback = Animated.createAnimatedComponent(
  TouchableWithoutFeedback
);

const BottomSheetBackdropComponent = ({
  animatedIndex,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  animatedPosition,
  opacity = DEFAULT_OPACITY,
  appearsOnIndex = DEFAULT_APPEARS_ON_INDEX,
  disappearsOnIndex = DEFAULT_DISAPPEARS_ON_INDEX,
  enableTouchThrough = DEFAULT_ENABLE_TOUCH_THROUGH,
  pressBehavior,
  closeOnPress,
  style,
  accessible: _providedAccessible = DEFAULT_ACCESSIBLE,
  accessibilityRole: _providedAccessibilityRole = DEFAULT_ACCESSIBILITY_ROLE,
  accessibilityLabel: _providedAccessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
  accessibilityHint: _providedAccessibilityHint = DEFAULT_ACCESSIBILITY_HINT,
  ...rest
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

  //#region animation variables
  const isTouchable = useReactiveValue(
    syntheticPressBehavior !== 'none' ? 1 : 0
  );
  const animatedOpacity = useMemo(
    () =>
      interpolate(animatedIndex, {
        inputRange: [disappearsOnIndex, appearsOnIndex],
        outputRange: [0, opacity],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedIndex, opacity, appearsOnIndex, disappearsOnIndex]
  );
  //#endregion

  //#region styles
  const buttonStyle = useMemo(
    () => [
      style,
      {
        transform: [
          {
            translateY: cond(
              eq(animatedIndex, disappearsOnIndex),
              WINDOW_HEIGHT,
              0
            ),
          },
        ],
      },
    ],
    [disappearsOnIndex, style, animatedIndex]
  );
  const containerStyle = useMemo(
    () => [
      styles.container,
      style,
      {
        opacity: animatedOpacity,
      },
    ],
    [style, animatedOpacity]
  );
  //#endregion

  const setPointerEvents = useCallback((value: string) => {
    if (containerRef.current) {
      ((containerRef.current as any) as View).setNativeProps({
        pointerEvents: value,
      });
    }
  }, []);

  //#region effects
  useCode(
    () =>
      block([
        cond(
          and(eq(animatedIndex, disappearsOnIndex), isTouchable),
          [set(isTouchable, 0), call([], () => setPointerEvents('none'))],
          cond(and(neq(animatedIndex, disappearsOnIndex), not(isTouchable)), [
            set(isTouchable, 1),
            call([], () => setPointerEvents('auto')),
          ])
        ),
      ]),
    [animatedIndex, disappearsOnIndex, isTouchable, setPointerEvents]
  );
  //#endregion

  return syntheticPressBehavior !== 'none' ? (
    <AnimatedTouchableWithoutFeedback
      accessible={_providedAccessible ?? undefined}
      accessibilityRole={_providedAccessibilityRole ?? undefined}
      accessibilityLabel={_providedAccessibilityLabel ?? undefined}
      accessibilityHint={_providedAccessibilityHint ?? undefined}
      style={buttonStyle}
      onPress={handleOnPress}
      {...rest}
    >
      <Animated.View ref={containerRef} key="backdrop" style={containerStyle} />
    </AnimatedTouchableWithoutFeedback>
  ) : (
    <Animated.View
      ref={containerRef}
      key="backdrop"
      accessible={_providedAccessible ?? undefined}
      accessibilityRole={_providedAccessibilityRole ?? undefined}
      accessibilityLabel={_providedAccessibilityLabel ?? undefined}
      accessibilityHint={_providedAccessibilityHint ?? undefined}
      pointerEvents={pointerEvents}
      style={containerStyle}
      {...rest}
    />
  );
};

const BottomSheetBackdrop = memo(BottomSheetBackdropComponent, isEqual);

export default BottomSheetBackdrop;
