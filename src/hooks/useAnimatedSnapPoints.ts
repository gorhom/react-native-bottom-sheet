import {
  type SharedValue,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import type { BottomSheetProps } from '../components/bottomSheet';
import { INITIAL_SNAP_POINT } from '../components/bottomSheet/constants';
import { INITIAL_LAYOUT_VALUE } from '../constants';
import type { LayoutState } from '../types';
import { normalizeSnapPoint } from '../utilities';

/**
 * Convert percentage snap points to pixels in screen and calculate
 * the accurate snap points positions.
 * @param snapPoints provided snap points.
 * @param containerHeight BottomSheetContainer height.
 * @param contentHeight content size.
 * @param handleHeight handle size.
 * @param enableDynamicSizing
 * @param maxDynamicContentSize
 * @returns {SharedValue<number[]>}
 */
export const useAnimatedSnapPoints = (
  snapPoints: BottomSheetProps['snapPoints'],
  layoutState: SharedValue<LayoutState>,
  enableDynamicSizing: BottomSheetProps['enableDynamicSizing'],
  maxDynamicContentSize: BottomSheetProps['maxDynamicContentSize']
): [SharedValue<number[]>, SharedValue<number>, SharedValue<boolean>] => {
  const dynamicSnapPointIndex = useSharedValue<number>(-1);
  const normalizedSnapPoints = useDerivedValue(() => {
    const { containerHeight } = layoutState.get();
    // early exit, if container layout is not ready
    const isContainerLayoutReady = containerHeight !== INITIAL_LAYOUT_VALUE;
    if (!isContainerLayoutReady) {
      return [INITIAL_SNAP_POINT];
    }

    // extract snap points from provided props
    const _snapPoints = snapPoints
      ? 'value' in snapPoints
        ? snapPoints.value
        : snapPoints
      : [];

    // normalized all provided snap points, converting percentage
    // values into absolute values.
    let _normalizedSnapPoints = _snapPoints.map(snapPoint =>
      normalizeSnapPoint(snapPoint, containerHeight)
    ) as number[];

    // return normalized snap points if dynamic sizing is not enabled
    if (!enableDynamicSizing) {
      return _normalizedSnapPoints;
    }

    const { handleHeight, contentHeight } = layoutState.get();

    // early exit, if handle height is not calculated yet.
    if (handleHeight === INITIAL_LAYOUT_VALUE) {
      return [INITIAL_SNAP_POINT];
    }

    // early exit, if content height is not calculated yet.
    if (contentHeight === INITIAL_LAYOUT_VALUE) {
      return [INITIAL_SNAP_POINT];
    }

    // calculate a new snap point based on content height.
    const dynamicSnapPoint =
      containerHeight -
      Math.min(
        contentHeight + handleHeight,
        maxDynamicContentSize !== undefined
          ? maxDynamicContentSize
          : containerHeight
      );

    // push dynamic snap point into the normalized snap points,
    // only if it does not exists in the provided list already.
    if (!_normalizedSnapPoints.includes(dynamicSnapPoint)) {
      _normalizedSnapPoints.push(dynamicSnapPoint);
    }

    // sort all snap points.
    _normalizedSnapPoints = _normalizedSnapPoints.sort((a, b) => b - a);

    // locate the dynamic snap point index.
    dynamicSnapPointIndex.value =
      _normalizedSnapPoints.indexOf(dynamicSnapPoint);

    return _normalizedSnapPoints;
  }, [
    snapPoints,
    layoutState,
    enableDynamicSizing,
    maxDynamicContentSize,
    dynamicSnapPointIndex,
  ]);

  const hasDynamicSnapPoint = useDerivedValue(() => {
    /**
     * if dynamic sizing is enabled, then we return true.
     */
    if (enableDynamicSizing) {
      return true;
    }

    // extract snap points from provided props
    const _snapPoints = snapPoints
      ? 'value' in snapPoints
        ? snapPoints.value
        : snapPoints
      : [];

    /**
     * if any of the snap points provided is a string, then we return true.
     */
    if (
      _snapPoints.length &&
      _snapPoints.find(snapPoint => typeof snapPoint === 'string')
    ) {
      return true;
    }

    return false;
  });

  return [normalizedSnapPoints, dynamicSnapPointIndex, hasDynamicSnapPoint];
};
