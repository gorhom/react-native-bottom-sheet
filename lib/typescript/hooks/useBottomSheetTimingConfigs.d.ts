import type { EasingFunction } from 'react-native';
import type { EasingFunctionFactory, ReduceMotion } from 'react-native-reanimated';
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
export declare const useBottomSheetTimingConfigs: (configs: TimingConfig) => TimingConfig;
export {};
//# sourceMappingURL=useBottomSheetTimingConfigs.d.ts.map