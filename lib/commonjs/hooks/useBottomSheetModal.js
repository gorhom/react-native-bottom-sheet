"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBottomSheetModal = void 0;

var _react = require("react");

var _contexts = require("../contexts");

const useBottomSheetModal = () => {
  const context = (0, _react.useContext)(_contexts.BottomSheetModalContext);

  if (context === null) {
    throw "'BottomSheetModalContext' cannot be null!";
  }

  return context;
};

exports.useBottomSheetModal = useBottomSheetModal;
//# sourceMappingURL=useBottomSheetModal.js.map