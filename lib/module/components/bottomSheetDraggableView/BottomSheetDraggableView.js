function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useMemo, useRef, memo } from 'react';
import Animated from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useBottomSheetGestureHandlers, useBottomSheetInternal } from '../../hooks';
import { GESTURE_SOURCE } from '../../constants';

const BottomSheetDraggableViewComponent = ({
  gestureType = GESTURE_SOURCE.CONTENT,
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
    contentPanGestureHandler,
    scrollablePanGestureHandler
  } = useBottomSheetGestureHandlers(); //#endregion
  //#region variables

  const panGestureRef = useRef(null);
  const gestureHandler = useMemo(() => gestureType === GESTURE_SOURCE.CONTENT ? contentPanGestureHandler : scrollablePanGestureHandler, [gestureType, contentPanGestureHandler, scrollablePanGestureHandler]);
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
  }, [_providedSimultaneousHandlers, nativeGestureRef, refreshControlGestureRef]); //#endregion

  return /*#__PURE__*/React.createElement(PanGestureHandler, {
    ref: panGestureRef,
    enabled: enableContentPanningGesture,
    simultaneousHandlers: simultaneousHandlers,
    shouldCancelWhenOutside: false,
    waitFor: waitFor,
    onGestureEvent: gestureHandler,
    activeOffsetX: activeOffsetX,
    activeOffsetY: activeOffsetY,
    failOffsetX: failOffsetX,
    failOffsetY: failOffsetY
  }, /*#__PURE__*/React.createElement(Animated.View, _extends({
    style: style
  }, rest), children));
};

const BottomSheetDraggableView = /*#__PURE__*/memo(BottomSheetDraggableViewComponent);
BottomSheetDraggableView.displayName = 'BottomSheetDraggableView';
export default BottomSheetDraggableView;
//# sourceMappingURL=BottomSheetDraggableView.js.map