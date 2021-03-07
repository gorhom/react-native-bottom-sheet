import Animated, { withSpring, withTiming } from 'react-native-reanimated';
import { ANIMATION_METHOD } from '../constants';

export const animate = (
  type: ANIMATION_METHOD,
  configs: Animated.WithSpringConfig | Animated.WithTimingConfig
) => {
  'worklet';
  if (type === ANIMATION_METHOD.TIMING) {
    return (point: number, _: number, callback: () => void) => {
      'worklet';
      return withTiming(point, configs as Animated.WithTimingConfig, callback);
    };
  } else {
    return (point: number, velocity: number = 0, callback: () => void) => {
      'worklet';
      // @ts-ignore
      configs.velocity = velocity;
      return withSpring(point, configs as Animated.WithSpringConfig, callback);
    };
  }
};
