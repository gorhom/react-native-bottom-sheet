import {
  type AnimationCallback,
  type ReduceMotion,
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
  overrideReduceMotion?: ReduceMotion;
  onComplete?: AnimationCallback;
}

export const animate = ({
  point,
  configs,
  velocity = 0,
  overrideReduceMotion,
  onComplete,
}: AnimateParams) => {
  'worklet';

  if (!configs) {
    configs = ANIMATION_CONFIGS;
  }

  // Users might have an accessibility setting to reduce motion turned on.
  // This prevents the animation from running when presenting the sheet, which results in
  // the bottom sheet not even appearing so we need to override it to ensure the animation runs.
  // configs.reduceMotion = ReduceMotion.Never;

  if (overrideReduceMotion) {
    configs.reduceMotion = overrideReduceMotion;
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
