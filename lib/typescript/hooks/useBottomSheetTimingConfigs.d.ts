import type { WithTimingConfig } from 'react-native-reanimated';
/**
 * Generate timing animation configs.
 * @default
 * - easing: Easing.out(Easing.exp)
 * - duration 250
 * @param configs overridable configs.
 */
export declare const useBottomSheetTimingConfigs: (configs: WithTimingConfig) => WithTimingConfig;
