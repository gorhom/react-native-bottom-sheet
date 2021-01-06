import React, { forwardRef, memo } from 'react';
import { ScrollView } from 'react-native';
import isEqual from 'lodash.isequal';
import Animated from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { useTapGestureHandler } from '../../hooks/useTapGestureHandler';
import type { BottomSheetContentWrapperProps } from './types';

// @ts-ignore
const AnimatedTapGestureHandler: typeof TapGestureHandler = Animated.createAnimatedComponent(
  // @ts-ignore
  TapGestureHandler
);

const ContentWrapperComponent = forwardRef<
  TapGestureHandler,
  BottomSheetContentWrapperProps
>(({ gestureState, animatedProps, children }, ref) => {
  // callbacks
  const handleGestureEvent = useTapGestureHandler(gestureState);

  return (
    <ScrollView
      style={{ height: '100%', width: '100%' }}
      contentContainerStyle={{ height: '100.1%', width: '100%' }}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
    >
      <AnimatedTapGestureHandler
        ref={ref}
        maxDurationMs={1000000}
        shouldCancelWhenOutside={false}
        onGestureEvent={handleGestureEvent}
        // @ts-ignore
        animatedProps={animatedProps}
      >
        {children}
      </AnimatedTapGestureHandler>
    </ScrollView>
  );
});

const ContentWrapper = memo(ContentWrapperComponent, isEqual);

export default ContentWrapper;
