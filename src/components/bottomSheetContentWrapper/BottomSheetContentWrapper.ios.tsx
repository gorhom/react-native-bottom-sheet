import React, { forwardRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import Animated from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { useTapGestureHandler } from '../../hooks/useTapGestureHandler';
import type { BottomSheetContentWrapperProps } from './types';

const AnimatedTapGestureHandler: typeof TapGestureHandler = Animated.createAnimatedComponent(
  TapGestureHandler
);

const BottomSheetContentWrapperComponent = forwardRef<
  TapGestureHandler,
  BottomSheetContentWrapperProps
>(({ gestureState, animatedProps, children }, ref) => {
  // callbacks
  const handleGestureEvent = useTapGestureHandler(gestureState);
  return (
    <AnimatedTapGestureHandler
      ref={ref}
      maxDurationMs={1000000}
      shouldCancelWhenOutside={false}
      onGestureEvent={handleGestureEvent}
      // @ts-ignore
      animatedProps={animatedProps}
    >
      <Animated.View pointerEvents="box-none">{children}</Animated.View>
    </AnimatedTapGestureHandler>
  );
});

const BottomSheetContentWrapper = memo(
  BottomSheetContentWrapperComponent,
  isEqual
);

export default BottomSheetContentWrapper;
