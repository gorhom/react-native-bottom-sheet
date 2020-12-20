import React, { useMemo, useRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import Animated from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetDraggableViewProps } from './types';
import { styles } from './styles';

const BottomSheetDraggableViewComponent = ({
  nativeGestureRef,
  style,
  children,
  ...rest
}: BottomSheetDraggableViewProps) => {
  // refs
  const panGestureRef = useRef<PanGestureHandler>(null);

  // hooks
  const {
    enableContentPanningGesture,
    contentWrapperGestureRef,
    contentPanGestureHandler,
  } = useBottomSheetInternal();

  // variables
  const simultaneousHandlers = useMemo(
    () =>
      nativeGestureRef
        ? [contentWrapperGestureRef, nativeGestureRef]
        : contentWrapperGestureRef,
    [contentWrapperGestureRef, nativeGestureRef]
  );

  // styles
  const containerStyle = useMemo(
    () => (style ? [styles.container, style] : styles.container),
    [style]
  );

  return (
    <PanGestureHandler
      ref={panGestureRef}
      enabled={enableContentPanningGesture}
      simultaneousHandlers={simultaneousHandlers}
      shouldCancelWhenOutside={false}
      onGestureEvent={contentPanGestureHandler}
    >
      <Animated.View style={containerStyle} {...rest}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

const BottomSheetDraggableView = memo(
  BottomSheetDraggableViewComponent,
  isEqual
);

export default BottomSheetDraggableView;
