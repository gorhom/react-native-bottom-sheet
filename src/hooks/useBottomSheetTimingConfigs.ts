import { useMemo } from 'react';
import type { EasingFunction } from 'react-native';
import type {
  EasingFunctionFactory,
  ReduceMotion,
} from 'react-native-reanimated';
import { ANIMATION_DURATION, ANIMATION_EASING } from '../constants';

/**
 * this is needed to avoid TS4023
 * https://github.com/microsoft/TypeScript/issues/5711
 */
interface TimingConfig {
  duration?: number;
  easing?: EasingFunction | EasingFunctionFactory;
  reduceMotion?: ReduceMotion;
}

/**
 * Generate timing animation configs.
 * @default
 * - easing: Easing.out(Easing.exp)
 * - duration: 250
 * @param configs overridable configs.
 */
export const useBottomSheetTimingConfigs = (configs: TimingConfig) => {
  return useMemo(() => {
    const _configs: TimingConfig = {
      easing: configs.easing || ANIMATION_EASING,
      duration: configs.duration || ANIMATION_DURATION,
      reduceMotion: configs.reduceMotion,
    };

    return _configs;
  }, [configs.duration, configs.easing, configs.reduceMotion]);
};
