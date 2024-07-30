import type { WithSpringConfig } from 'react-native-reanimated';
/**
 * Generate spring animation configs.
 * @param configs overridable configs.
 */
export declare const useBottomSheetSpringConfigs: (configs: Omit<WithSpringConfig, 'velocity'>) => Omit<WithSpringConfig, "velocity">;
