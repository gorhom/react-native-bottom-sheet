import { WithSpringConfig, WithTimingConfig, AnimationCallback } from 'react-native-reanimated';
interface AnimateParams {
    point: number;
    velocity?: number;
    configs?: WithSpringConfig | WithTimingConfig;
    onComplete?: AnimationCallback;
}
export declare const animate: ({ point, configs, velocity, onComplete, }: AnimateParams) => number;
export {};
