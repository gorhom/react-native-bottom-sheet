import Animated, { Easing } from 'react-native-reanimated';

export const DEFAULT_ANIMATION_EASING: Animated.EasingFunction = Easing.out(
  Easing.exp
);
export const DEFAULT_ANIMATION_DURATION = 500;

export enum GESTURE {
  UNDETERMINED = 0,
  CONTENT,
  HANDLE,
}

export enum ANIMATION_STATE {
  UNDETERMINED = 0,
  RUNNING,
  STOPPED,
}
