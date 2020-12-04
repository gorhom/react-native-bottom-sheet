import React, { forwardRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import type { BottomSheetContentWrapperProps } from './types';
import { KeyboardAvoidingView } from 'react-native';

const ContentWrapperComponent = forwardRef<
  TapGestureHandler,
  BottomSheetContentWrapperProps
>(
  (
    { children, initialMaxDeltaY, style, onGestureEvent, onHandlerStateChange },
    ref
  ) => {
    return (
      <KeyboardAvoidingView
        behavior="position"
        pointerEvents="box-none"
        style={{position: 'absolute', left: 0, right: 0, bottom: 0}}
      >
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
      </KeyboardAvoidingView>
    );
  }
);

const ContentWrapper = memo(ContentWrapperComponent, isEqual);

export default ContentWrapper;
