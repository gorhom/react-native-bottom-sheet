import {
  withTiming,
  withSpring,
  AnimationCallback,
} from 'react-native-reanimated';
import { ANIMATION_CONFIGS, ANIMATION_METHOD } from '../constants';
import { SpringConfig } from 'react-native-reanimated/lib/typescript/reanimated2/animation/springUtils';

interface AnimateParams {
  point: number;
  velocity?: number;
  configs?: any;
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

  // detect animation type
  const type =
    'duration' in configs || 'easing' in configs
      ? ANIMATION_METHOD.TIMING
      : ANIMATION_METHOD.SPRING;

  if (type === ANIMATION_METHOD.TIMING) {
    return withTiming(point, configs as any, onComplete);
  } else {
    return withSpring(
      point,
      Object.assign({ velocity }, configs) as SpringConfig,
      onComplete
    );
  }
};
