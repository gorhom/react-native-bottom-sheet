function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { forwardRef, useCallback } from 'react';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
export const ScrollableContainer = /*#__PURE__*/forwardRef(function ScrollableContainer({
  nativeGesture,
  ScrollableComponent,
  animatedProps,
  ...rest
}, ref) {
  const renderScrollComponent = useCallback(props => /*#__PURE__*/React.createElement(Animated.ScrollView, _extends({}, props, {
    animatedProps: animatedProps
  })), [animatedProps]);
  return /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: nativeGesture
  }, /*#__PURE__*/React.createElement(ScrollableComponent, _extends({
    ref: ref
  }, rest, {
    renderScrollComponent: renderScrollComponent
  })));
});
//# sourceMappingURL=ScrollableContainer.web.js.map