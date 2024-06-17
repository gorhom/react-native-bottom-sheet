function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { forwardRef, memo } from 'react';
import { RefreshControl } from 'react-native';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { SCROLLABLE_STATE } from '../../constants';
import { useBottomSheetInternal } from '../../hooks';
const AnimatedRefreshControl = Animated.createAnimatedComponent(RefreshControl);
const BottomSheetRefreshControlComponent = /*#__PURE__*/forwardRef(({
  onRefresh,
  ...rest
}, ref) => {
  // hooks
  const {
    animatedScrollableState
  } = useBottomSheetInternal(); // variables

  const animatedProps = useAnimatedProps(() => ({
    enabled: animatedScrollableState.value === SCROLLABLE_STATE.UNLOCKED
  })); // render

  return /*#__PURE__*/React.createElement(NativeViewGestureHandler, {
    ref: ref,
    shouldCancelWhenOutside: false
  }, /*#__PURE__*/React.createElement(AnimatedRefreshControl, _extends({}, rest, {
    onRefresh: onRefresh,
    animatedProps: animatedProps
  })));
});
const BottomSheetRefreshControl = /*#__PURE__*/memo(BottomSheetRefreshControlComponent);
BottomSheetRefreshControl.displayName = 'BottomSheetRefreshControl';
export default BottomSheetRefreshControl;
//# sourceMappingURL=BottomSheetRefreshControl.android.js.map