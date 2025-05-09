import React, { forwardRef } from 'react';
import type { SimultaneousGesture } from 'react-native-gesture-handler';
import BottomSheetRefreshControl from '../bottomSheetRefreshControl';
import { BottomSheetDraggableScrollable } from './BottomSheetDraggableScrollable';
import { styles } from './styles';

interface ScrollableContainerProps {
  nativeGesture: SimultaneousGesture;
  // biome-ignore lint: to be addressed
  refreshControl: any;
  // biome-ignore lint: to be addressed
  progressViewOffset: any;
  // biome-ignore lint: to be addressed
  refreshing: any;
  // biome-ignore lint: to be addressed
  onRefresh: any;
  // biome-ignore lint: to be addressed
  ScrollableComponent: any;
}

// biome-ignore lint: to be addressed
export const ScrollableContainer = forwardRef<any, ScrollableContainerProps>(
  function ScrollableContainer(
    {
      nativeGesture,
      refreshControl: _refreshControl,
      refreshing,
      progressViewOffset,
      onRefresh,
      ScrollableComponent,
      ...rest
    },
    ref
  ) {
    const Scrollable = (
      <BottomSheetDraggableScrollable scrollableGesture={nativeGesture}>
        <ScrollableComponent ref={ref} {...rest} />
      </BottomSheetDraggableScrollable>
    );

    return onRefresh ? (
      <BottomSheetRefreshControl
        scrollableGesture={nativeGesture}
        refreshing={refreshing}
        progressViewOffset={progressViewOffset}
        onRefresh={onRefresh}
        style={styles.container}
      >
        {Scrollable}
      </BottomSheetRefreshControl>
    ) : (
      Scrollable
    );
  }
);
