import React, { type FC, forwardRef } from 'react';
import {
  GestureDetector,
  type SimultaneousGesture,
} from 'react-native-gesture-handler';

interface ScrollableContainerProps {
  nativeGesture: SimultaneousGesture;
  // biome-ignore lint/suspicious/noExplicitAny: 🤷‍♂️
  ScrollableComponent: FC<any>;
}

export const ScrollableContainer = forwardRef<never, ScrollableContainerProps>(
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
