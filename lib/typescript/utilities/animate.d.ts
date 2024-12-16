import { type AnimationCallback, type ReduceMotion, type WithSpringConfig, type WithTimingConfig } from 'react-native-reanimated';
interface AnimateParams {
    point: number;
    velocity?: number;
    configs?: WithSpringConfig | WithTimingConfig;
    overrideReduceMotion?: ReduceMotion;
    onComplete?: AnimationCallback;
}
export declare const animate: ({ point, configs, velocity, overrideReduceMotion, onComplete, }: AnimateParams) => number;
export {};
//# sourceMappingURL=animate.d.ts.map