/** @TODO this should be fixed with reanimated alpha 7 */
// @ts-ignore
import { useAnimatedProps, useAnimatedReaction } from 'react-native-reanimated';
import { ANIMATION_STATE } from '../../constants';
import { useBottomSheetInternal } from '../useBottomSheetInternal';

export const useScrollableAnimatedProps = () => {
  // hooks
  const {
    animatedPosition,
    animationState,
    scrollableDecelerationRate,
  } = useBottomSheetInternal();

  // variables
  const animatedProps = useAnimatedProps(
    () => ({
      decelerationRate: scrollableDecelerationRate.value,
    }),
    /** @TODO this should be fixed with reanimated alpha 7 */
    // @ts-ignore
    []
  );

  // effects
  useAnimatedReaction(
    () =>
      animatedPosition.value !== 0 ||
      animationState.value === ANIMATION_STATE.RUNNING,
    (shouldLimitDecelerationRate: boolean) => {
      const newDecelerationRate = shouldLimitDecelerationRate ? 0 : 0.985;
      if (scrollableDecelerationRate.value !== newDecelerationRate) {
        scrollableDecelerationRate.value = newDecelerationRate;
      }
    },
    []
  );

  return animatedProps;
};
