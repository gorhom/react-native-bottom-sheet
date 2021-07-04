import { Platform } from 'react-native';
import Animated, {
  Easing,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ANIMATION_METHOD } from '../constants';

interface AnimateParams {
  point: number;
  velocity?: number;
  configs?: Animated.WithSpringConfig | Animated.WithTimingConfig;
  onComplete?: (isFinished: boolean) => void;
}

export const animate = ({
  point,
  configs = undefined,
  velocity = 0,
  onComplete,
}: AnimateParams) => {
  'worklet';

  if (!configs) {
    configs =
      Platform.OS === 'android'
        ? {
            duration: 250,
            easing: Easing.out(Easing.exp),
          }
        : {
            damping: 500,
            stiffness: 1000,
            mass: 3,
            overshootClamping: true,
            restDisplacementThreshold: 10,
            restSpeedThreshold: 10,
          };
  }

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
