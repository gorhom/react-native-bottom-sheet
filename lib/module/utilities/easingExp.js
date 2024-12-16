"use strict";

/**
 * A modified version of the default AnimatedEasing.exp,
 * to insure its value never goes below `0`.
 * @see https://github.com/software-mansion/react-native-reanimated/issues/1610
 * @param t number
 */
export const exp = t => {
  'worklet';

  return Math.min(Math.max(0, Math.pow(2, 10 * (t - 1))), 1);
};
//# sourceMappingURL=easingExp.js.map