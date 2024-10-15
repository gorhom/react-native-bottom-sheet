import {
  type AnimationCallback,
  type WithSpringConfig,
  type WithTimingConfig,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ANIMATION_CONFIGS, ANIMATION_METHOD } from '../constants';

interface AnimateParams {
  point: number;
  velocity?: number;
  configs?: WithSpringConfig | WithTimingConfig;
  onComplete?: AnimationCallback;
}

export const animate = ({
  point,
  configs,
  velocity = 0,
  onComplete,
}: AnimateParams) => {
  'worklet';

  if (!configs) {
    configs = ANIMATION_CONFIGS;
  }

  // detect animation type
  const type =
    'duration' in configs || 'easing' in configs
      ? ANIMATION_METHOD.TIMING
      : ANIMATION_METHOD.SPRING;

  if (type === ANIMATION_METHOD.TIMING) {
    return withTiming(point, configs as WithTimingConfig, onComplete);
  }

  return withSpring(
    point,
    Object.assign({ velocity }, configs) as WithSpringConfig,
    onComplete
  );
};
