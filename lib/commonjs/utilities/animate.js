"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animate = void 0;

var _reactNativeReanimated = require("react-native-reanimated");

var _constants = require("../constants");

const animate = ({
  point,
  configs = undefined,
  velocity = 0,
  onComplete
}) => {
  'worklet';

  if (!configs) {
    configs = _constants.ANIMATION_CONFIGS;
  } // detect animation type


  const type = 'duration' in configs || 'easing' in configs ? _constants.ANIMATION_METHOD.TIMING : _constants.ANIMATION_METHOD.SPRING;

  if (type === _constants.ANIMATION_METHOD.TIMING) {
    return (0, _reactNativeReanimated.withTiming)(point, configs, onComplete);
  } else {
    return (0, _reactNativeReanimated.withSpring)(point, Object.assign({
      velocity
    }, configs), onComplete);
  }
};

exports.animate = animate;
//# sourceMappingURL=animate.js.map