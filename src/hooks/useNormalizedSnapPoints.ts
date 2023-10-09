import Animated, { useDerivedValue } from 'react-native-reanimated';
import { normalizeSnapPoint } from '../utilities';
import type { BottomSheetProps } from '../components/bottomSheet';
import {
  INITIAL_CONTAINER_HEIGHT,
  INITIAL_HANDLE_HEIGHT,
  INITIAL_SNAP_POINT,
} from '../components/bottomSheet/constants';

/**
 * Convert percentage snap points to pixels in screen and calculate
 * the accurate snap points positions.
 * @param snapPoints provided snap points.
 * @param containerHeight BottomSheetContainer height.
 * @param contentHeight content size.
 * @param handleHeight handle size.
 * @param enableDynamicSizing
 * @param maxDynamicContentSize
 * @returns {Animated.SharedValue<number[]>}
 */
export const useNormalizedSnapPoints = (
  snapPoints: BottomSheetProps['snapPoints'],
  containerHeight: Animated.SharedValue<number>,
  contentHeight: Animated.SharedValue<number>,
  handleHeight: Animated.SharedValue<number>,
  enableDynamicSizing: BottomSheetProps['enableDynamicSizing'],
  maxDynamicContentSize: BottomSheetProps['maxDynamicContentSize']
) => {
  const normalizedSnapPoints = useDerivedValue(() => {
    // early exit, if container layout is not ready
    const isContainerLayoutReady =
      containerHeight.value !== INITIAL_CONTAINER_HEIGHT;
    if (!isContainerLayoutReady) {
      return [INITIAL_SNAP_POINT];
    }

    const _snapPoints = snapPoints
      ? 'value' in snapPoints
        ? snapPoints.value
        : snapPoints
      : [];

    let _normalizedSnapPoints = _snapPoints.map(snapPoint =>
      normalizeSnapPoint(snapPoint, containerHeight.value)
    ) as number[];

    if (enableDynamicSizing) {
      if (handleHeight.value === INITIAL_HANDLE_HEIGHT) {
        return [INITIAL_SNAP_POINT];
      }

      if (contentHeight.value === INITIAL_CONTAINER_HEIGHT) {
        return [INITIAL_SNAP_POINT];
      }

      _normalizedSnapPoints.push(
        containerHeight.value -
          Math.min(
            contentHeight.value + handleHeight.value,
            maxDynamicContentSize !== undefined
              ? maxDynamicContentSize
              : containerHeight.value
          )
      );

      _normalizedSnapPoints = _normalizedSnapPoints.sort((a, b) => b - a);
    }
    return _normalizedSnapPoints;
  }, [snapPoints, enableDynamicSizing, maxDynamicContentSize]);

  return normalizedSnapPoints;
};
