import React, { type ComponentProps, forwardRef, useCallback } from 'react';
import type { SimultaneousGesture } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { BottomSheetDraggableScrollable } from './BottomSheetDraggableScrollable';

interface ScrollableContainerProps {
  nativeGesture: SimultaneousGesture;
  // biome-ignore lint/suspicious/noExplicitAny: 🤷‍♂️
  ScrollableComponent: any;
}

export const ScrollableContainer = forwardRef<
  never,
  ScrollableContainerProps & { animatedProps: never }
>(function ScrollableContainer(
  { nativeGesture, ScrollableComponent, animatedProps, ...rest },
  ref
) {
  const renderScrollComponent = useCallback(
    (props: ComponentProps<typeof Animated.ScrollView>) => (
      <Animated.ScrollView {...props} animatedProps={animatedProps} />
    ),
    [animatedProps]
  );
  return (
    <BottomSheetDraggableScrollable scrollableGesture={nativeGesture}>
      <ScrollableComponent
        ref={ref}
        {...rest}
        renderScrollComponent={renderScrollComponent}
      />
    </BottomSheetDraggableScrollable>
  );
});
