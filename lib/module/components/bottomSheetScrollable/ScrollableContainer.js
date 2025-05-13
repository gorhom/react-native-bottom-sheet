"use strict";

import React, { forwardRef } from 'react';
import { BottomSheetDraggableScrollable } from './BottomSheetDraggableScrollable';
import { jsx as _jsx } from "react/jsx-runtime";
export const ScrollableContainer = /*#__PURE__*/forwardRef(function ScrollableContainer({
  nativeGesture,
  ScrollableComponent,
  ...rest
}, ref) {
  return /*#__PURE__*/_jsx(BottomSheetDraggableScrollable, {
    scrollableGesture: nativeGesture,
    children: /*#__PURE__*/_jsx(ScrollableComponent, {
      ref: ref,
      ...rest
    })
  });
});
//# sourceMappingURL=ScrollableContainer.js.map