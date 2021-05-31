import { useMemo } from 'react';
import Animated from 'react-native-reanimated';
import {
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_ANIMATION_EASING,
} from '../components/bottomSheet/constants';

/**
 * Generate timing animation configs.
 * @default
 * - easing: Easing.out(Easing.exp)
 * - duration 500
 * @param configs overridable configs.
 */
export const useBottomSheetTimingConfigs = (
  configs: Animated.WithTimingConfig
) => {
  return useMemo(() => {
    const _configs: Animated.WithTimingConfig = {
      easing: configs.easing || DEFAULT_ANIMATION_EASING,
      duration: configs.duration || DEFAULT_ANIMATION_DURATION,
    };

    return _configs;
  }, [configs.duration, configs.easing]);
};
