import Animated, { EasingNode as Easing } from 'react-native-reanimated';

export const DEFAULT_ANIMATION_EASING: Animated.EasingFunction = Easing.out(
  Easing.back(0.75)
);
export const DEFAULT_ANIMATION_DURATION = 500;
