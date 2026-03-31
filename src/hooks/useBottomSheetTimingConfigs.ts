import { useMemo } from 'react';
import type { EasingFunction } from 'react-native';
import type {
  EasingFunctionFactory,
  ReduceMotion,
} from 'react-native-reanimated';
import { ANIMATION_DURATION, ANIMATION_EASING } from '../constants';

interface TimingConfig {
  duration?: number;
  easing?: EasingFunction | EasingFunctionFactory;
  reduceMotion?: ReduceMotion;
}

export const useBottomSheetTimingConfigs = (configs: TimingConfig) => {
  return useMemo(
    () => ({
      easing: configs.easing || ANIMATION_EASING,
      duration: configs.duration || ANIMATION_DURATION,
      reduceMotion: configs.reduceMotion,
    }),
    [configs.duration, configs.easing, configs.reduceMotion]
  );
};
