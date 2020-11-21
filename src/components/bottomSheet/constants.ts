import { Platform } from 'react-native';
import Animated from 'react-native-reanimated';

const {
  Easing: EasingV1,
  EasingNode: EasingV2,
} = require('react-native-reanimated');
const Easing = EasingV2 || EasingV1;

export const DEFAULT_ANIMATION_EASING: Animated.EasingFunction = Easing.out(
  Easing.back(0.75)
);
export const DEFAULT_ANIMATION_DURATION = 500;

export const NORMAL_DECELERATION_RATE = Platform.select({
  ios: 0.998,
  android: 0.985,
});

export const DEFAULT_ANIMATE_ON_MOUNT = false;
