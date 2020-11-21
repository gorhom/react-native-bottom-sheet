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
    { style, children, onLayout, onGestureEvent, onHandlerStateChange },
    ref
  ) => {
    return (
      <TapGestureHandler
        ref={ref}
        maxDurationMs={1000000}
        shouldCancelWhenOutside={false}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          onLayout={onLayout}
          pointerEvents="box-none"
          style={style}
        >
          {children}
        </Animated.View>
      </TapGestureHandler>
    );
  }
);

const ContentWrapper = memo(ContentWrapperComponent, isEqual);

export default ContentWrapper;
