import React, { forwardRef } from 'react';
import { TapGestureHandler } from 'react-native-gesture-handler';
import type { BottomSheetContentWrapperProps } from './types';

const ContentWrapper = forwardRef<
  TapGestureHandler,
  BottomSheetContentWrapperProps
>(
  (
    { children, initialMaxDeltaY, onGestureEvent, onHandlerStateChange },
    ref
  ) => {
    return (
      <TapGestureHandler
        ref={ref}
        maxDurationMs={1000000}
        maxDeltaY={initialMaxDeltaY}
        shouldCancelWhenOutside={false}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        {children}
      </TapGestureHandler>
    );
  }
);

export default ContentWrapper;
