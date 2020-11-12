import React, { forwardRef, memo, useEffect } from 'react';
import isEqual from 'lodash.isequal';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import type { BottomSheetContentWrapperProps } from './types';

const ContentWrapperComponent = forwardRef<
  TapGestureHandler,
  BottomSheetContentWrapperProps
>(
  (
    { children, initialMaxDeltaY, style, onGestureEvent, onHandlerStateChange },
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
        <Animated.View pointerEvents="box-none" style={style}>
          {children}
        </Animated.View>
      </TapGestureHandler>
    );
  }
);

const ContentWrapper = memo(ContentWrapperComponent, isEqual);

export default ContentWrapper;
