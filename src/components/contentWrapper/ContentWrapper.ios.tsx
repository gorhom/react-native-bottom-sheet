import React, { forwardRef, memo, useMemo } from 'react';
import isEqual from 'lodash.isequal';
import Animated from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { useTapGestureHandler } from '../../hooks/useTapGestureHandler';
import type { BottomSheetContentWrapperProps } from './types';
import { styles } from './styles';

const ContentWrapperComponent = forwardRef<
  TapGestureHandler,
  BottomSheetContentWrapperProps
>(({ gestureState, maxDeltaY, height, children }, ref) => {
  // callbacks
  const handleGestureEvent = useTapGestureHandler(gestureState);

  // styles
  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        height,
      },
    ],
    [height]
  );

  return (
    <TapGestureHandler
      ref={ref}
      maxDurationMs={1000000}
      maxDeltaY={maxDeltaY}
      shouldCancelWhenOutside={false}
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleGestureEvent}
    >
      <Animated.View pointerEvents="box-none" style={containerStyle}>
        {children}
      </Animated.View>
    </TapGestureHandler>
  );
});

const ContentWrapper = memo(ContentWrapperComponent, isEqual);

export default ContentWrapper;
