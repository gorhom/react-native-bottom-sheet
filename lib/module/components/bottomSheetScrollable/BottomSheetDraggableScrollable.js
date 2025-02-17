"use strict";

import React from 'react';
import { GestureDetector } from 'react-native-gesture-handler';
import { jsx as _jsx } from "react/jsx-runtime";
export function BottomSheetDraggableScrollable({
  scrollableGesture,
  children
}) {
  if (scrollableGesture) {
    return /*#__PURE__*/_jsx(GestureDetector, {
      gesture: scrollableGesture,
      children: children
    });
  }
  return children;
}
//# sourceMappingURL=BottomSheetDraggableScrollable.js.map