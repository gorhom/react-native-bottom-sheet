import React, { forwardRef, useCallback } from 'react';
import {
  GestureDetector,
  SimultaneousGesture,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

interface ScrollableContainerProps {
  nativeGesture: SimultaneousGesture;
  ScrollableComponent: any;
}

export const ScrollableContainer = forwardRef<
  any,
  ScrollableContainerProps & { animatedProps: any }
>(function ScrollableContainer(
  { nativeGesture, ScrollableComponent, animatedProps, ...rest },
  ref
) {
  const renderScrollComponent = useCallback(
    (props: any) => (
      <Animated.ScrollView {...props} animatedProps={animatedProps} />
    ),
    [animatedProps]
  );
  return (
    <GestureDetector gesture={nativeGesture}>
      <ScrollableComponent
        ref={ref}
        {...rest}
        renderScrollComponent={renderScrollComponent}
      />
    </GestureDetector>
  );
});
