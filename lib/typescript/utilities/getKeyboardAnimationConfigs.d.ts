import type { KeyboardEventEasing } from 'react-native';
export declare const getKeyboardAnimationConfigs: (easing: KeyboardEventEasing, duration: number) => {
    easing: (value: number) => number;
    duration: number;
    damping?: undefined;
    stiffness?: undefined;
    mass?: undefined;
    overshootClamping?: undefined;
    restDisplacementThreshold?: undefined;
    restSpeedThreshold?: undefined;
} | {
    damping: number;
    stiffness: number;
    mass: number;
    overshootClamping: boolean;
    restDisplacementThreshold: number;
    restSpeedThreshold: number;
    easing?: undefined;
    duration?: undefined;
};
