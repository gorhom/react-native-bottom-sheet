"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBottomSheetInternal = useBottomSheetInternal;

var _react = require("react");

var _internal = require("../contexts/internal");

function useBottomSheetInternal(unsafe) {
  const context = (0, _react.useContext)(_internal.BottomSheetInternalContext);

  if (unsafe !== true && context === null) {
    throw "'useBottomSheetInternal' cannot be used out of the BottomSheet!";
  }

  return context;
}
//# sourceMappingURL=useBottomSheetInternal.js.map