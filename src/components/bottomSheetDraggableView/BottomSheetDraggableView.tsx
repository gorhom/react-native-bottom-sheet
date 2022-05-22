import React, { useMemo, useRef, memo } from 'react';
import Animated from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import {
  useBottomSheetGestureHandlers,
  useBottomSheetInternal,
} from '../../hooks';
import { GESTURE_SOURCE } from '../../constants';
import type { BottomSheetDraggableViewProps } from './types';

const BottomSheetDraggableViewComponent = ({
  gestureType = GESTURE_SOURCE.CONTENT,
  nativeGestureRef,
  refreshControlGestureRef,
  style,
  children,
  ...rest
}: BottomSheetDraggableViewProps) => {
  //#region hooks
  const {
    enableContentPanningGesture,
    simultaneousHandlers: _providedSimultaneousHandlers,
    waitFor,
    activeOffsetX,
    activeOffsetY,
    failOffsetX,
    failOffsetY,
  } = useBottomSheetInternal();
  const { contentPanGestureHandler, scrollablePanGestureHandler } =
    useBottomSheetGestureHandlers();
  //#endregion

  //#region variables
  const panGestureRef = useRef<PanGestureHandler>(null);
  const gestureHandler = useMemo(
    () =>
      gestureType === GESTURE_SOURCE.CONTENT
        ? contentPanGestureHandler
        : scrollablePanGestureHandler,
    [gestureType, contentPanGestureHandler, scrollablePanGestureHandler]
  );
  const simultaneousHandlers = useMemo(() => {
    const refs = [];

    if (nativeGestureRef) {
      refs.push(nativeGestureRef);
    }

    if (refreshControlGestureRef) {
      refs.push(refreshControlGestureRef);
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
    nativeGestureRef,
    refreshControlGestureRef,
  ]);
  //#endregion

  return (
    <PanGestureHandler
      ref={panGestureRef}
      enabled={enableContentPanningGesture}
      simultaneousHandlers={simultaneousHandlers}
      shouldCancelWhenOutside={false}
      waitFor={waitFor}
      onGestureEvent={gestureHandler}
      activeOffsetX={activeOffsetX}
      activeOffsetY={activeOffsetY}
      failOffsetX={failOffsetX}
      failOffsetY={failOffsetY}
    >
      <Animated.View style={style} {...rest}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

const BottomSheetDraggableView = memo(BottomSheetDraggableViewComponent);
BottomSheetDraggableView.displayName = 'BottomSheetDraggableView';

export default BottomSheetDraggableView;
