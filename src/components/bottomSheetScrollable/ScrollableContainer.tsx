import React, { forwardRef } from 'react';
import {
  GestureDetector,
  SimultaneousGesture,
} from 'react-native-gesture-handler';

interface ScrollableContainerProps {
  nativeGesture: SimultaneousGesture;
  ScrollableComponent: any;
}

export const ScrollableContainer = forwardRef<any, ScrollableContainerProps>(
  function ScrollableContainer(
    { nativeGesture, ScrollableComponent, ...rest },
    ref
  ) {
    return (
      <GestureDetector gesture={nativeGesture}>
        <ScrollableComponent ref={ref} {...rest} />
      </GestureDetector>
    );
  }
);
