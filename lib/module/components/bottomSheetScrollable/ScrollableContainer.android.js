function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { forwardRef } from 'react';
import { GestureDetector } from 'react-native-gesture-handler';
import BottomSheetRefreshControl from '../bottomSheetRefreshControl';
import { styles } from './styles';
export const ScrollableContainer = /*#__PURE__*/forwardRef(function ScrollableContainer({
  nativeGesture,
  refreshControl: _refreshControl,
  refreshing,
  progressViewOffset,
  onRefresh,
  ScrollableComponent,
  ...rest
}, ref) {
  const Scrollable = /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: nativeGesture
  }, /*#__PURE__*/React.createElement(ScrollableComponent, _extends({
    ref: ref
  }, rest)));
  return onRefresh ? /*#__PURE__*/React.createElement(BottomSheetRefreshControl, {
    refreshing: refreshing,
    progressViewOffset: progressViewOffset,
    onRefresh: onRefresh,
    scrollableGesture: nativeGesture,
    style: styles.container
  }, Scrollable) : Scrollable;
});
//# sourceMappingURL=ScrollableContainer.android.js.map