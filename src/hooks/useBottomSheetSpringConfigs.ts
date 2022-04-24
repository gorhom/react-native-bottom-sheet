import { useMemo } from 'react';
import type { WithSpringConfig } from 'react-native-reanimated';

/**
 * Generate spring animation configs.
 * @param configs overridable configs.
 */
export const useBottomSheetSpringConfigs = (
  configs: Omit<WithSpringConfig, 'velocity'>
) => {
  return useMemo(() => configs, [configs]);
};
