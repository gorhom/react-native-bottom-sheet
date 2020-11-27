import { Platform } from 'react-native';
import Animated from 'react-native-reanimated';

const {
  Easing: EasingV1,
  EasingNode: EasingV2,
} = require('react-native-reanimated');
const Easing = EasingV2 || EasingV1;

// defaults
const DEFAULT_ANIMATION_EASING: Animated.EasingFunction = Easing.out(
  Easing.back(0.75)
);
const DEFAULT_ANIMATION_DURATION = 500;
const DEFAULT_ANIMATE_ON_MOUNT = false;
const DEFAULT_HANDLE_HEIGHT = 24;
const DEFAULT_ENABLE_CONTENT_PANNING_GESTURE = true;
const DEFAULT_ENABLE_HANDLE_PANNING_GESTURE = true;

const NORMAL_DECELERATION_RATE = Platform.select({
  ios: 0.998,
  android: 0.985,
});

export {
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_ANIMATE_ON_MOUNT,
  DEFAULT_HANDLE_HEIGHT,
  DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
  DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
  NORMAL_DECELERATION_RATE,
};
