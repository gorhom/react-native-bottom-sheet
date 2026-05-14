import React, { memo, useContext, useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {
  BottomSheetDraggableContext,
  NativeScrollGestureContext,
} from '../../contexts/gesture';
import {
  useBottomSheetGestureHandlers,
  useBottomSheetInternal,
} from '../../hooks';
import type { BottomSheetDraggableViewProps } from './types';

const BottomSheetDraggableViewComponent = ({
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
  const { contentPanGestureHandler } = useBottomSheetGestureHandlers();
  /**
   * The inner scrollable component registers its native scroll gesture here so
   * we can declare `simultaneousWithExternalGesture(nativeScroll)` on the pan,
   * matching the scrollable side's own `simultaneousWithExternalGesture(pan)`
   * declaration. Without this bidirectional declaration, the parent pan
   * cancels the child native scroll on every drag on Android (one-sided
   * simultaneousness is insufficient there).
   */
  const nativeScrollGestureCtx = useContext(NativeScrollGestureContext);
  const nativeScrollGesture = nativeScrollGestureCtx?.nativeScrollGesture;
  //#endregion

  //#region variables
  const simultaneousHandlers = useMemo(() => {
    const refs = [];

    if (nativeGestureRef) {
      refs.push(nativeGestureRef);
    }

    if (refreshControlGestureRef) {
      refs.push(refreshControlGestureRef);
    }

    if (nativeScrollGesture) {
      refs.push(nativeScrollGesture);
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
    nativeScrollGesture,
  ]);
  const draggableGesture = useMemo(() => {
    let gesture = Gesture.Pan()
      .enabled(enableContentPanningGesture)
      .shouldCancelWhenOutside(false)
      .runOnJS(false)
      .onStart(contentPanGestureHandler.handleOnStart)
      .onChange(contentPanGestureHandler.handleOnChange)
      .onEnd(contentPanGestureHandler.handleOnEnd)
      .onFinalize(contentPanGestureHandler.handleOnFinalize);

    if (waitFor) {
      gesture = gesture.requireExternalGestureToFail(waitFor);
    }

    if (simultaneousHandlers) {
      gesture = gesture.simultaneousWithExternalGesture(
        simultaneousHandlers as never
      );
    }

    if (activeOffsetX) {
      gesture = gesture.activeOffsetX(activeOffsetX);
    }

    if (activeOffsetY) {
      gesture = gesture.activeOffsetY(activeOffsetY);
    }

    if (failOffsetX) {
      gesture = gesture.failOffsetX(failOffsetX);
    }

    if (failOffsetY) {
      gesture = gesture.failOffsetY(failOffsetY);
    }

    return gesture;
  }, [
    activeOffsetX,
    activeOffsetY,
    enableContentPanningGesture,
    failOffsetX,
    failOffsetY,
    simultaneousHandlers,
    waitFor,
    contentPanGestureHandler.handleOnChange,
    contentPanGestureHandler.handleOnEnd,
    contentPanGestureHandler.handleOnFinalize,
    contentPanGestureHandler.handleOnStart,
  ]);
  //#endregion

  return (
    <GestureDetector gesture={draggableGesture}>
      <BottomSheetDraggableContext.Provider value={draggableGesture}>
        <Animated.View style={style} {...rest}>
          {children}
        </Animated.View>
      </BottomSheetDraggableContext.Provider>
    </GestureDetector>
  );
};

const BottomSheetDraggableView = memo(BottomSheetDraggableViewComponent);
BottomSheetDraggableView.displayName = 'BottomSheetDraggableView';

export default BottomSheetDraggableView;
