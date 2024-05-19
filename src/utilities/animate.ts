import {
  WithSpringConfig,
  WithTimingConfig,
  withTiming,
  withSpring,
  AnimationCallback,
  // @ts-ignore
  ReduceMotion,
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
  configs = undefined,
  velocity = 0,
  onComplete,
}: AnimateParams) => {
  'worklet';

  if (!configs) {
    configs = ANIMATION_CONFIGS;
  }

  // Users might have an accessibililty setting to reduce motion turned on.
  // This prevents the animation from running when presenting the sheet, which results in
  // the bottom sheet not even appearing so we need to override it to ensure the animation runs.
  if (ReduceMotion) {
    // @ts-ignore
    configs.reduceMotion = ReduceMotion.Never;
  }

  // detect animation type
  const type =
    'duration' in configs || 'easing' in configs
      ? ANIMATION_METHOD.TIMING
      : ANIMATION_METHOD.SPRING;

  if (type === ANIMATION_METHOD.TIMING) {
    return withTiming(point, configs as WithTimingConfig, onComplete);
  } else {
    return withSpring(
      point,
      Object.assign({ velocity }, configs) as WithSpringConfig,
      onComplete
    );
  }
};
