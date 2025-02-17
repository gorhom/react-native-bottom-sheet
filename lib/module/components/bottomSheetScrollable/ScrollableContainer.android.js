"use strict";

import React, { forwardRef } from 'react';
import BottomSheetRefreshControl from '../bottomSheetRefreshControl';
import { BottomSheetDraggableScrollable } from './BottomSheetDraggableScrollable';
import { styles } from './styles';
import { jsx as _jsx } from "react/jsx-runtime";
// biome-ignore lint: to be addressed
export const ScrollableContainer = /*#__PURE__*/forwardRef(function ScrollableContainer({
  nativeGesture,
  refreshControl: _refreshControl,
  refreshing,
  progressViewOffset,
  onRefresh,
  ScrollableComponent,
  ...rest
}, ref) {
  const Scrollable = /*#__PURE__*/_jsx(BottomSheetDraggableScrollable, {
    scrollableGesture: nativeGesture,
    children: /*#__PURE__*/_jsx(ScrollableComponent, {
      ref: ref,
      ...rest
    })
  });
  return onRefresh ? /*#__PURE__*/_jsx(BottomSheetRefreshControl, {
    scrollableGesture: nativeGesture,
    refreshing: refreshing,
    progressViewOffset: progressViewOffset,
    onRefresh: onRefresh,
    style: styles.container,
    children: Scrollable
  }) : Scrollable;
});
//# sourceMappingURL=ScrollableContainer.android.js.map