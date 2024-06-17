"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKeyboardAnimationConfigs = void 0;
var _reactNativeReanimated = require("react-native-reanimated");
const getKeyboardAnimationConfigs = (easing, duration) => {
  'worklet';

  switch (easing) {
    case 'easeIn':
      return {
        easing: _reactNativeReanimated.Easing.in(_reactNativeReanimated.Easing.ease),
        duration
      };
    case 'easeOut':
      return {
        easing: _reactNativeReanimated.Easing.out(_reactNativeReanimated.Easing.ease),
        duration
      };
    case 'easeInEaseOut':
      return {
        easing: _reactNativeReanimated.Easing.inOut(_reactNativeReanimated.Easing.ease),
        duration
      };
    case 'linear':
      return {
        easing: _reactNativeReanimated.Easing.linear,
        duration
      };
    case 'keyboard':
      return {
        damping: 500,
        stiffness: 1000,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10
      };
  }
};
exports.getKeyboardAnimationConfigs = getKeyboardAnimationConfigs;
//# sourceMappingURL=getKeyboardAnimationConfigs.js.map