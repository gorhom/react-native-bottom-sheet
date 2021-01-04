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
    simultaneousHandlers: _providedSimultaneousHandlers,
    waitFor,
    activeOffsetX,
    activeOffsetY,
    failOffsetX,
    failOffsetY,
  } = useBottomSheetInternal();

  // variables
  const simultaneousHandlers = useMemo(() => {
    const refs = [contentWrapperGestureRef];

    if (nativeGestureRef) {
      refs.push(nativeGestureRef);
    }

    if (_providedSimultaneousHandlers) {
      if (Array.isArray(_providedSimultaneousHandlers)) {
        refs.push(..._providedSimultaneousHandlers);
      } else {
        refs.push(_providedSimultaneousHandlers);
      }
    }

    return refs;
  }, [
    _providedSimultaneousHandlers,
    contentWrapperGestureRef,
    nativeGestureRef,
  ]);

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
      waitFor={waitFor}
      onGestureEvent={contentPanGestureHandler}
      activeOffsetX={activeOffsetX}
      activeOffsetY={activeOffsetY}
      failOffsetX={failOffsetX}
      failOffsetY={failOffsetY}
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
