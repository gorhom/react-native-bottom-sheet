import Animated, { withSpring, withTiming } from 'react-native-reanimated';
import { ANIMATION_METHOD } from '../constants';

export const animate = (
  point: number,
  configs: Animated.WithSpringConfig | Animated.WithTimingConfig,
  velocity: number,
  onComplete: () => void
) => {
  'worklet';

  // detect animation type
  const type =
    'duration' in configs || 'easing' in configs
      ? ANIMATION_METHOD.TIMING
      : ANIMATION_METHOD.SPRING;

  if (type === ANIMATION_METHOD.TIMING) {
    return withTiming(point, configs as Animated.WithTimingConfig, onComplete);
  } else {
    // @ts-ignore
    configs.velocity = velocity;
    return withSpring(point, configs as Animated.WithSpringConfig, onComplete);
  }
};
