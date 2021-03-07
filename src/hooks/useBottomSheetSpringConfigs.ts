import Animated from 'react-native-reanimated';
import { ANIMATION_METHOD } from '../constants';
import { animate } from '../utilities';

/**
 * Generate spring animation configs.
 * @param configs overridable configs.
 */
export const useBottomSheetSpringConfigs = (
  configs: Omit<Animated.WithSpringConfig, 'velocity'>
) => {
  return animate(ANIMATION_METHOD.SPRING, configs);
};
