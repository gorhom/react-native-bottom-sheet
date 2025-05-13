"use strict";

import React, { useMemo, memo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { BottomSheetDraggableContext } from '../../contexts/gesture';
import { useBottomSheetGestureHandlers, useBottomSheetInternal } from '../../hooks';
import { jsx as _jsx } from "react/jsx-runtime";
const BottomSheetDraggableViewComponent = ({
  nativeGestureRef,
  refreshControlGestureRef,
  style,
  children,
  ...rest
}) => {
  //#region hooks
  const {
    enableContentPanningGesture,
    simultaneousHandlers: _providedSimultaneousHandlers,
    waitFor,
    activeOffsetX,
    activeOffsetY,
    failOffsetX,
    failOffsetY
  } = useBottomSheetInternal();
  const {
    contentPanGestureHandler
  } = useBottomSheetGestureHandlers();
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
    if (_providedSimultaneousHandlers) {
      if (Array.isArray(_providedSimultaneousHandlers)) {
        refs.push(..._providedSimultaneousHandlers);
      } else {
        refs.push(_providedSimultaneousHandlers);
      }
    }
    return refs;
  }, [_providedSimultaneousHandlers, nativeGestureRef, refreshControlGestureRef]);
  const draggableGesture = useMemo(() => {
    let gesture = Gesture.Pan().enabled(enableContentPanningGesture).shouldCancelWhenOutside(false).runOnJS(false).onStart(contentPanGestureHandler.handleOnStart).onChange(contentPanGestureHandler.handleOnChange).onEnd(contentPanGestureHandler.handleOnEnd).onFinalize(contentPanGestureHandler.handleOnFinalize);
    if (waitFor) {
      gesture = gesture.requireExternalGestureToFail(waitFor);
    }
    if (simultaneousHandlers) {
      gesture = gesture.simultaneousWithExternalGesture(simultaneousHandlers);
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
  }, [activeOffsetX, activeOffsetY, enableContentPanningGesture, failOffsetX, failOffsetY, simultaneousHandlers, waitFor, contentPanGestureHandler.handleOnChange, contentPanGestureHandler.handleOnEnd, contentPanGestureHandler.handleOnFinalize, contentPanGestureHandler.handleOnStart]);
  //#endregion

  return /*#__PURE__*/_jsx(GestureDetector, {
    gesture: draggableGesture,
    children: /*#__PURE__*/_jsx(BottomSheetDraggableContext.Provider, {
      value: draggableGesture,
      children: /*#__PURE__*/_jsx(Animated.View, {
        style: style,
        ...rest,
        children: children
      })
    })
  });
};
const BottomSheetDraggableView = /*#__PURE__*/memo(BottomSheetDraggableViewComponent);
BottomSheetDraggableView.displayName = 'BottomSheetDraggableView';
export default BottomSheetDraggableView;
//# sourceMappingURL=BottomSheetDraggableView.js.map