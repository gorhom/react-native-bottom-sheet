"use strict";

import { useMemo } from 'react';
import { ANIMATION_DURATION, ANIMATION_EASING } from '../constants';

/**
 * this is needed to avoid TS4023
 * https://github.com/microsoft/TypeScript/issues/5711
 */

/**
 * Generate timing animation configs.
 * @default
 * - easing: Easing.out(Easing.exp)
 * - duration: 250
 * @param configs overridable configs.
 */
export const useBottomSheetTimingConfigs = configs => {
  return useMemo(() => {
    const _configs = {
      easing: configs.easing || ANIMATION_EASING,
      duration: configs.duration || ANIMATION_DURATION,
      reduceMotion: configs.reduceMotion
    };
    return _configs;
  }, [configs.duration, configs.easing, configs.reduceMotion]);
};
//# sourceMappingURL=useBottomSheetTimingConfigs.js.map