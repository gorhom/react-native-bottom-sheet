import React, { forwardRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import type { BottomSheetContentWrapperProps } from './types';

const BottomSheetContentWrapperComponent = forwardRef<
  TapGestureHandler,
  BottomSheetContentWrapperProps
>(({ children, onGestureEvent, onHandlerStateChange }, ref) => {
  return (
    <TapGestureHandler
      ref={ref}
      maxDurationMs={1000000}
      shouldCancelWhenOutside={false}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
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
