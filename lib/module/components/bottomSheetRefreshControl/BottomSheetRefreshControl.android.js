function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { memo, useContext, useMemo } from 'react';
import { RefreshControl } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { BottomSheetDraggableContext } from '../../contexts/gesture';
import { SCROLLABLE_STATE } from '../../constants';
import { useBottomSheetInternal } from '../../hooks';
const AnimatedRefreshControl = Animated.createAnimatedComponent(RefreshControl);
function BottomSheetRefreshControlComponent({
  onRefresh,
  scrollableGesture,
  ...rest
}) {
  //#region hooks
  const draggableGesture = useContext(BottomSheetDraggableContext);
  const {
    animatedScrollableState
  } = useBottomSheetInternal();
  //#endregion

  //#region variables
  const animatedProps = useAnimatedProps(() => ({
    enabled: animatedScrollableState.value === SCROLLABLE_STATE.UNLOCKED
  }), [animatedScrollableState.value]);
  const gesture = useMemo(() => Gesture.Simultaneous(Gesture.Native().shouldCancelWhenOutside(false), scrollableGesture, draggableGesture), [draggableGesture, scrollableGesture]);
  //#endregion

  // render
  return /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: gesture
  }, /*#__PURE__*/React.createElement(AnimatedRefreshControl, _extends({}, rest, {
    onRefresh: onRefresh,
    animatedProps: animatedProps
  })));
}
const BottomSheetRefreshControl = /*#__PURE__*/memo(BottomSheetRefreshControlComponent);
BottomSheetRefreshControl.displayName = 'BottomSheetRefreshControl';
export default BottomSheetRefreshControl;
//# sourceMappingURL=BottomSheetRefreshControl.android.js.map