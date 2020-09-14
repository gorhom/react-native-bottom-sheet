import { useAnimatedProps, useAnimatedReaction } from 'react-native-reanimated';
import { useBottomSheetInternal } from '../useBottomSheetInternal';

export const useScrollableAnimatedProps = () => {
  // hooks
  const {
    animatedPosition,
    scrollableDecelerationRate,
  } = useBottomSheetInternal();

  // variables
  const animatedProps = useAnimatedProps(() => ({
    decelerationRate: scrollableDecelerationRate.value,
  }));

  // effects
  useAnimatedReaction(
    () => animatedPosition === 0,
    (shouldLimitDecelerationRate: boolean) => {
      const newDecelerationRate = shouldLimitDecelerationRate ? 0.0001 : 0.985;
      if (scrollableDecelerationRate.value !== newDecelerationRate) {
        scrollableDecelerationRate.value = newDecelerationRate;
      }
    }
  );

  return animatedProps;
};
