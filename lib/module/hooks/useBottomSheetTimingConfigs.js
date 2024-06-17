import { useMemo } from 'react';
import { ANIMATION_DURATION, ANIMATION_EASING } from '../constants';
/**
 * Generate timing animation configs.
 * @default
 * - easing: Easing.out(Easing.exp)
 * - duration 250
 * @param configs overridable configs.
 */

export const useBottomSheetTimingConfigs = configs => {
  return useMemo(() => {
    const _configs = {
      easing: configs.easing || ANIMATION_EASING,
      duration: configs.duration || ANIMATION_DURATION
    };
    return _configs;
  }, [configs.duration, configs.easing]);
};
//# sourceMappingURL=useBottomSheetTimingConfigs.js.map