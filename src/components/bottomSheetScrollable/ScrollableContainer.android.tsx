import React, { forwardRef } from 'react';
import {
  GestureDetector,
  SimultaneousGesture,
} from 'react-native-gesture-handler';
import BottomSheetRefreshControl from '../bottomSheetRefreshControl';
import { styles } from './styles';

interface ScrollableContainerProps {
  nativeGesture: SimultaneousGesture;
  refreshControl: any;
  progressViewOffset: any;
  refreshing: any;
  onRefresh: any;
  ScrollableComponent: any;
}

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
      <GestureDetector gesture={nativeGesture}>
        <ScrollableComponent ref={ref} {...rest} />
      </GestureDetector>
    );

    return onRefresh ? (
      <BottomSheetRefreshControl
        refreshing={refreshing}
        progressViewOffset={progressViewOffset}
        onRefresh={onRefresh}
        scrollableGesture={nativeGesture}
        style={styles.container}
      >
        {Scrollable}
      </BottomSheetRefreshControl>
    ) : (
      Scrollable
    );
  }
);
