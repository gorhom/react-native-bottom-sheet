import Animated, { EasingNode } from 'react-native-reanimated';

export const DEFAULT_ANIMATION_EASING: Animated.EasingFunction = EasingNode.out(
  EasingNode.back(0.75)
);
export const DEFAULT_ANIMATION_DURATION = 500;
