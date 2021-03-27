import React, { memo, useMemo, useRef } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
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

  //#region effects
  useCode(
    () =>
      block([
        cond(
          and(eq(animatedIndex, disappearsOnIndex), isTouchable),
          [
            set(isTouchable, 0),
            call([], () => {
              // @ts-ignore
              containerRef.current.setNativeProps({
                pointerEvents: 'none',
              });
            }),
          ],
          cond(and(neq(animatedIndex, disappearsOnIndex), not(isTouchable)), [
            set(isTouchable, 1),
            call([], () => {
              // @ts-ignore
              containerRef.current.setNativeProps({
                pointerEvents: 'auto',
              });
            }),
          ])
        ),
      ]),
    []
  );
  //#endregion

  return syntheticPressBehavior !== 'none' ? (
    <AnimatedTouchableWithoutFeedback
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Bottom Sheet backdrop"
      accessibilityHint="Tap to close the Bottom Sheet"
      onPress={handleOnPress}
      style={buttonStyle}
    >
      <Animated.View key="backdrop" ref={containerRef} style={containerStyle} />
    </AnimatedTouchableWithoutFeedback>
  ) : (
    <Animated.View
      key="backdrop"
      ref={containerRef}
      pointerEvents={pointerEvents}
      style={containerStyle}
    />
  );
};

const BottomSheetBackdrop = memo(BottomSheetBackdropComponent, isEqual);

export default BottomSheetBackdrop;
