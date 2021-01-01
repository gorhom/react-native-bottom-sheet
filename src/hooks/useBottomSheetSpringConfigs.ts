import Animated, {
  useWorkletCallback,
  withSpring,
} from 'react-native-reanimated';

export const useBottomSheetSpringConfigs = (
  configs: Omit<Animated.WithSpringConfig, 'velocity'>
) => {
  const animationConfig = useWorkletCallback(
    (point: number, velocity: number = 0, callback: () => void) => {
      // @ts-ignore override velocity
      configs.velocity = velocity;
      return withSpring(point, configs, callback);
    },
    [configs]
  );
  return animationConfig;
};
