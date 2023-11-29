"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBottomSheet = void 0;

var _react = require("react");

var _external = require("../contexts/external");

const useBottomSheet = () => {
  const context = (0, _react.useContext)(_external.BottomSheetContext);

  if (context === null) {
    throw "'useBottomSheet' cannot be used out of the BottomSheet!";
  }

  return context;
};

exports.useBottomSheet = useBottomSheet;
//# sourceMappingURL=useBottomSheet.js.map