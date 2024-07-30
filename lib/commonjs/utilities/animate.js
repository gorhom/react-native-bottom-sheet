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
  } // Users might have an accessibililty setting to reduce motion turned on.
  // This prevents the animation from running when presenting the sheet, which results in
  // the bottom sheet not even appearing so we need to override it to ensure the animation runs.


  if (_reactNativeReanimated.ReduceMotion) {
    // @ts-ignore
    configs.reduceMotion = _reactNativeReanimated.ReduceMotion.Never;
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