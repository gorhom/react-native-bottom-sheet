import React, { forwardRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import { TapGestureHandler } from 'react-native-gesture-handler';
import type { BottomSheetContentWrapperProps } from './types';

const ContentWrapperComponent = forwardRef<
  TapGestureHandler,
  BottomSheetContentWrapperProps
>(
  (
    { children, initialMaxDeltaY, onGestureEvent, onHandlerStateChange },
    ref
  ) => {
    return (
      <TapGestureHandler
        ref={(tapHandler) => {
          tapHandler?.setNativeProps({
            maxDeltaY: initialMaxDeltaY,
          });
          if (typeof ref === 'function') {
            ref(tapHandler);
          } else if (ref) {
            ref.current = tapHandler;
          }
        }}
        maxDurationMs={1000000}
        shouldCancelWhenOutside={false}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        {children}
      </TapGestureHandler>
    );
  }
);

const ContentWrapper = memo(ContentWrapperComponent, isEqual);

export default ContentWrapper;
