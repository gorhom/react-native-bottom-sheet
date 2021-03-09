import { useMemo } from 'react';
import type Animated from 'react-native-reanimated';

/**
 * Generate spring animation configs.
 * @param configs overridable configs.
 */
export const useBottomSheetSpringConfigs = (
  configs: Omit<Animated.WithSpringConfig, 'velocity'>
) => {
  return useMemo(() => configs, [configs]);
};
