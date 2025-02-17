"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBottomSheetModalInternal = useBottomSheetModalInternal;
var _react = require("react");
var _contexts = require("../contexts");
function useBottomSheetModalInternal(unsafe) {
  const context = (0, _react.useContext)(_contexts.BottomSheetModalInternalContext);
  if (unsafe !== true && context === null) {
    throw "'BottomSheetModalInternalContext' cannot be null!";
  }
  return context;
}
//# sourceMappingURL=useBottomSheetModalInternal.js.map