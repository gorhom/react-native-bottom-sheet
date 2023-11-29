import { withTiming, withSpring } from 'react-native-reanimated';
import { ANIMATION_CONFIGS, ANIMATION_METHOD } from '../constants';
export const animate = ({
  point,
  configs = undefined,
  velocity = 0,
  onComplete
}) => {
  'worklet';

  if (!configs) {
    configs = ANIMATION_CONFIGS;
  } // detect animation type


  const type = 'duration' in configs || 'easing' in configs ? ANIMATION_METHOD.TIMING : ANIMATION_METHOD.SPRING;

  if (type === ANIMATION_METHOD.TIMING) {
    return withTiming(point, configs, onComplete);
  } else {
    return withSpring(point, Object.assign({
      velocity
    }, configs), onComplete);
  }
};
//# sourceMappingURL=animate.js.map