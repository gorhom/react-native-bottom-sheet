import React, { forwardRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import Animated from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { useTapGestureHandler } from '../../hooks/useTapGestureHandler';
import type { BottomSheetContentWrapperProps } from './types';

const BottomSheetContentWrapperComponent = forwardRef<
  TapGestureHandler,
  BottomSheetContentWrapperProps
>(({ gestureState, children }, ref) => {
  // callbacks
  const handleGestureEvent = useTapGestureHandler(gestureState);
  return (
    <TapGestureHandler
      ref={ref}
      maxDurationMs={1000000}
      shouldCancelWhenOutside={false}
      onGestureEvent={handleGestureEvent}
    >
      <Animated.View pointerEvents="box-none">{children}</Animated.View>
    </TapGestureHandler>
  );
});

const BottomSheetContentWrapper = memo(
  BottomSheetContentWrapperComponent,
  isEqual
);

export default BottomSheetContentWrapper;
