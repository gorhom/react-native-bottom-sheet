import type { WithSpringConfig } from 'react-native-reanimated';

export const useBottomSheetSpringConfigs = (
  configs: Omit<WithSpringConfig, 'velocity'>
) => {
  return configs;
};
