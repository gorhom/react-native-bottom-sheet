"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBottomSheetTimingConfigs = void 0;

var _react = require("react");

var _constants = require("../constants");

/**
 * Generate timing animation configs.
 * @default
 * - easing: Easing.out(Easing.exp)
 * - duration 250
 * @param configs overridable configs.
 */
const useBottomSheetTimingConfigs = configs => {
  return (0, _react.useMemo)(() => {
    const _configs = {
      easing: configs.easing || _constants.ANIMATION_EASING,
      duration: configs.duration || _constants.ANIMATION_DURATION
    };
    return _configs;
  }, [configs.duration, configs.easing]);
};

exports.useBottomSheetTimingConfigs = useBottomSheetTimingConfigs;
//# sourceMappingURL=useBottomSheetTimingConfigs.js.map