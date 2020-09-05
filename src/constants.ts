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

export enum GESTURE {
  CONTENT = 0,
  HANDLE,
}
