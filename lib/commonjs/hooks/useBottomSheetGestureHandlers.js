"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBottomSheetGestureHandlers = void 0;

var _react = require("react");

var _gesture = require("../contexts/gesture");

const useBottomSheetGestureHandlers = () => {
  const context = (0, _react.useContext)(_gesture.BottomSheetGestureHandlersContext);

  if (context === null) {
    throw "'useBottomSheetGestureHandlers' cannot be used out of the BottomSheet!";
  }

  return context;
};

exports.useBottomSheetGestureHandlers = useBottomSheetGestureHandlers;
//# sourceMappingURL=useBottomSheetGestureHandlers.js.map