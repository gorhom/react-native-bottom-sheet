import React, { memo, useCallback, useMemo, useRef } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import Animated, {
  and,
  call,
  cond,
  eq,
  Extrapolate,
  neq,
  not,
  set,
} from 'react-native-reanimated';
import isEqual from 'lodash.isequal';
import { useValue } from 'react-native-redash';
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
  animatedPosition,
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

  //#region animation variables
  const isTouchable = useValue(closeOnPress !== undefined ? 1 : 0);
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

  //#region callbacks
  const handleOnPress = useCallback(() => {
    close();
  }, [close]);
  //#endregion

  //#region styles
  const buttonStyle = useMemo(
    () => [
      style,
      {
        top: cond(eq(animatedIndex, disappearsOnIndex), WINDOW_HEIGHT, 0),
      },
    ],
    [disappearsOnIndex, style, animatedIndex]
  );
  const containerStyle = useMemo(
    () => [
      style,
      styles.container,
      {
        opacity: animatedOpacity,
      },
    ],
    [style, animatedOpacity]
  );
  //#endregion

  //#region effects

  //#endregion

  return closeOnPress ? (
    <>
      <AnimatedTouchableWithoutFeedback
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Bottom Sheet backdrop"
        accessibilityHint="Tap to close the Bottom Sheet"
        onPress={handleOnPress}
        style={buttonStyle}
      >
        <Animated.View ref={containerRef} style={containerStyle} />
      </AnimatedTouchableWithoutFeedback>
      <Animated.Code>
        {() =>
          cond(
            and(eq(animatedPosition, disappearsOnIndex), isTouchable),
            [
              set(isTouchable, 0),
              call([], () => {
                // @ts-ignore
                containerRef.current.setNativeProps({
                  pointerEvents: 'none',
                });
              }),
            ],
            cond(
              and(neq(animatedPosition, disappearsOnIndex), not(isTouchable)),
              [
                set(isTouchable, 1),
                call([], () => {
                  // @ts-ignore
                  containerRef.current.setNativeProps({
                    pointerEvents: 'auto',
                  });
                }),
              ]
            )
          )
        }
      </Animated.Code>
    </>
  ) : (
    <Animated.View pointerEvents={pointerEvents} style={containerStyle} />
  );
};

const BottomSheetBackdrop = memo(BottomSheetBackdropComponent, isEqual);

export default BottomSheetBackdrop;
