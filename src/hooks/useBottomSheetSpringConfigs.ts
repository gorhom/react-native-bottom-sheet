import { useMemo } from 'react';

/**
 * Generate spring animation configs.
 * @param configs overridable configs.
 */
export const useBottomSheetSpringConfigs = (configs: Omit<any, 'velocity'>) => {
  return useMemo(() => configs, [configs]);
};
