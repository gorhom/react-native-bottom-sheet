import React, { forwardRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { useTapGestureHandler } from './useTapGestureHandler';
import type { BottomSheetContentWrapperProps } from './types';

const ContentWrapperComponent = forwardRef<
  TapGestureHandler,
  BottomSheetContentWrapperProps
>(({ gestureState, initialMaxDeltaY, children }, ref) => {
  // callbacks
  const handleGestureEvent = useTapGestureHandler(gestureState);

  return (
    <TapGestureHandler
      ref={ref}
      maxDurationMs={1000000}
      maxDeltaY={initialMaxDeltaY}
      shouldCancelWhenOutside={false}
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleGestureEvent}
    >
      {children}
    </TapGestureHandler>
  );
});

const ContentWrapper = memo(ContentWrapperComponent, isEqual);

export default ContentWrapper;
