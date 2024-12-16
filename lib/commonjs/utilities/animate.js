"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animate = void 0;
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../constants");
const animate = ({
  point,
  configs,
  velocity = 0,
  overrideReduceMotion,
  onComplete
}) => {
  'worklet';

  if (!configs) {
    configs = _constants.ANIMATION_CONFIGS;
  }

  // Users might have an accessibility setting to reduce motion turned on.
  // This prevents the animation from running when presenting the sheet, which results in
  // the bottom sheet not even appearing so we need to override it to ensure the animation runs.
  // configs.reduceMotion = ReduceMotion.Never;

  if (overrideReduceMotion) {
    configs.reduceMotion = overrideReduceMotion;
  }

  // detect animation type
  const type = 'duration' in configs || 'easing' in configs ? _constants.ANIMATION_METHOD.TIMING : _constants.ANIMATION_METHOD.SPRING;
  if (type === _constants.ANIMATION_METHOD.TIMING) {
    return (0, _reactNativeReanimated.withTiming)(point, configs, onComplete);
  }
  return (0, _reactNativeReanimated.withSpring)(point, Object.assign({
    velocity
  }, configs), onComplete);
};
exports.animate = animate;
//# sourceMappingURL=animate.js.map