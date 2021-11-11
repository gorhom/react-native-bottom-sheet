import React, { forwardRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import type { BottomSheetContentWrapperProps } from './types';
import { useScreenReader } from '../../hooks/useScreenReader';

const BottomSheetContentWrapperComponent = forwardRef<
  TapGestureHandler,
  BottomSheetContentWrapperProps
>(({ children, onGestureEvent, onHandlerStateChange }, ref) => {
  const { isScreenReaderEnabled } = useScreenReader();

  return (
    <TapGestureHandler
      ref={ref}
      maxDurationMs={1000000}
      shouldCancelWhenOutside={false}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      {isScreenReaderEnabled ? (
        children
      ) : (
        <Animated.View pointerEvents="box-none">{children}</Animated.View>
      )}
    </TapGestureHandler>
  );
});

const BottomSheetContentWrapper = memo(
  BottomSheetContentWrapperComponent,
  isEqual
);

export default BottomSheetContentWrapper;
