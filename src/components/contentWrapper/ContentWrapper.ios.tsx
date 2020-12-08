import React, { forwardRef, memo } from 'react';
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
        ref={ref}
        maxDurationMs={1000000}
        maxDeltaY={initialMaxDeltaY}
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
