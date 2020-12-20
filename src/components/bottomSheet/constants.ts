import { Platform } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

const DEFAULT_ANIMATION_EASING: Animated.EasingFunction = Easing.out(
  Easing.exp
);
const DEFAULT_ANIMATION_DURATION = 500;
const DEFAULT_HANDLE_HEIGHT = 24;
const DEFAULT_ANIMATE_ON_MOUNT = false;

const DECELERATION_RATE = Platform.select({
  ios: 0.998,
  android: 0.985,
  default: 1,
});

export {
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_HANDLE_HEIGHT,
  DEFAULT_ANIMATE_ON_MOUNT,
  DECELERATION_RATE,
};
