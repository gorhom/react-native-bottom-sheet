import { useMemo } from 'react';
import type { EasingFunction } from 'react-native';
import type { EasingFunctionFactory } from 'react-native-reanimated';
import { ANIMATION_DURATION, ANIMATION_EASING } from '../constants';

interface TimingConfig {
  duration?: number;
  easing?: EasingFunction | EasingFunctionFactory;
}

/**
 * Generate timing animation configs.
 * @default
 * - easing: Easing.out(Easing.exp)
 * - duration 250
 * @param configs overridable configs.
 */
export const useBottomSheetTimingConfigs = (configs: TimingConfig) => {
  return useMemo(() => {
    const _configs: TimingConfig = {
      easing: configs.easing || ANIMATION_EASING,
      duration: configs.duration || ANIMATION_DURATION,
    };

    return _configs;
  }, [configs.duration, configs.easing]);
};
