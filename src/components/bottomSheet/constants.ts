import Animated, { Easing } from 'react-native-reanimated';

const DEFAULT_ANIMATION_EASING: Animated.EasingFunction = Easing.out(
  Easing.exp
);
const DEFAULT_ANIMATION_DURATION = 500;
const DEFAULT_HANDLE_HEIGHT = 24;
const DEFAULT_ANIMATE_ON_MOUNT = false;

export {
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_HANDLE_HEIGHT,
  DEFAULT_ANIMATE_ON_MOUNT,
};
