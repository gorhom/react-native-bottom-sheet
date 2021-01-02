import Animated, {
  useWorkletCallback,
  withTiming,
} from 'react-native-reanimated';

export const useBottomSheetTimingConfigs = (
  configs: Animated.WithTimingConfig
) => {
  const animationConfig = useWorkletCallback(
    (point: number, _, callback: () => void) =>
      withTiming(point, configs, callback),
    [configs]
  );
  return animationConfig;
};
