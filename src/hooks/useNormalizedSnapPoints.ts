import Animated, { useDerivedValue } from 'react-native-reanimated';
import { normalizeSnapPoint } from '../utilities';
import type { BottomSheetProps } from '../components/bottomSheet';
import {
  INITIAL_CONTAINER_HEIGHT,
  INITIAL_SNAP_POINT,
} from '../components/bottomSheet/constants';

/**
 * Convert percentage snap points to pixels in screen and calculate
 * the accurate snap points positions.
 * @param providedSnapPoints provided snap points.
 * @param containerHeight BottomSheetContainer height.
 * @param topInset top inset.
 * @returns {Animated.SharedValue<number[]>}
 */
export const useNormalizedSnapPoints = (
  providedSnapPoints: BottomSheetProps['snapPoints'],
  containerHeight: Animated.SharedValue<number>,
  topInset: number
) => {
  const normalizedSnapPoints = useDerivedValue(() =>
    providedSnapPoints.map(snapPoint => {
      if (containerHeight.value === INITIAL_CONTAINER_HEIGHT) {
        return INITIAL_SNAP_POINT;
      }

      return normalizeSnapPoint(snapPoint, containerHeight.value, topInset);
    })
  );

  return normalizedSnapPoints;
};
