"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBottomSheetSpringConfigs = void 0;

var _react = require("react");

/**
 * Generate spring animation configs.
 * @param configs overridable configs.
 */
const useBottomSheetSpringConfigs = configs => {
  return (0, _react.useMemo)(() => configs, [configs]);
};

exports.useBottomSheetSpringConfigs = useBottomSheetSpringConfigs;
//# sourceMappingURL=useBottomSheetSpringConfigs.js.map