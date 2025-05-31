import {
  type SharedValue,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import type { BottomSheetProps } from '../components/bottomSheet';
import {
  INITIAL_CONTAINER_HEIGHT,
  INITIAL_HANDLE_HEIGHT,
  INITIAL_SNAP_POINT,
} from '../components/bottomSheet/constants';
import { normalizeSnapPoint } from '../utilities';

/**
 * Convert percentage snap points to pixels in screen and calculate
 * the accurate snap points positions.
 * @param snapPoints provided snap points.
 * @param containerHeight BottomSheetContainer height.
 * @param contentHeight content size.
 * @param handleHeight handle size.
 * @param footerHeight footer size.
 * @param enableDynamicSizing
 * @param maxDynamicContentSize
 * @returns {SharedValue<number[]>}
 */
/**
 * Helper function to extract snap points from props
 */
const extractSnapPoints = (snapPoints: BottomSheetProps['snapPoints']) =>
 {
  'worklet';
  return snapPoints ? ('value' in snapPoints ? snapPoints.value : snapPoints) : []
};

export const useAnimatedSnapPoints = (
  snapPoints: BottomSheetProps['snapPoints'],
  containerHeight: SharedValue<number>,
  contentHeight: SharedValue<number>,
  handleHeight: SharedValue<number>,
  footerHeight: SharedValue<number>,
  enableDynamicSizing: BottomSheetProps['enableDynamicSizing'],
  maxDynamicContentSize: BottomSheetProps['maxDynamicContentSize']
): [SharedValue<number[]>, SharedValue<number>, SharedValue<boolean>] => {
  const dynamicSnapPointIndex = useSharedValue<number>(-1);
  
  const normalizedSnapPoints = useDerivedValue(() => {
    // Early exit if container layout is not ready
    if (containerHeight.value === INITIAL_CONTAINER_HEIGHT) {
      return [INITIAL_SNAP_POINT];
    }

    const rawSnapPoints = extractSnapPoints(snapPoints);

    // Normalize all provided snap points, converting percentage values to absolute values
    const normalizedSet = new Set(
      rawSnapPoints.map((snapPoint: string | number) =>
        normalizeSnapPoint(snapPoint, containerHeight.value)
      ) as number[]
    );

    // Return early if dynamic sizing is not enabled
    if (!enableDynamicSizing) {
      return Array.from(normalizedSet).sort((a, b) => b - a);
    }

    // Early exit if handle height is not calculated yet
    if (handleHeight.value === INITIAL_HANDLE_HEIGHT) {
      return [INITIAL_SNAP_POINT];
    }

    // Early exit if content height is not calculated yet
    if (contentHeight.value === INITIAL_CONTAINER_HEIGHT) {
      return [INITIAL_SNAP_POINT];
    }

    // Calculate dynamic snap point based on content height
    const maxContentSize = maxDynamicContentSize ?? containerHeight.value;
    const dynamicSnapPoint =
      containerHeight.value -
      Math.min(contentHeight.value + handleHeight.value, maxContentSize);

    // Add dynamic snap point to the set (automatically handles duplicates)
    normalizedSet.add(dynamicSnapPoint);

    // Convert to sorted array
    const sortedSnapPoints = Array.from(normalizedSet).sort((a, b) => b - a);

    // Update dynamic snap point index
    dynamicSnapPointIndex.value = sortedSnapPoints.indexOf(dynamicSnapPoint);

    return sortedSnapPoints;
  }, [
    snapPoints,
    containerHeight,
    handleHeight,
    contentHeight,
    footerHeight,
    enableDynamicSizing,
    maxDynamicContentSize,
    dynamicSnapPointIndex,
  ]);

  const hasDynamicSnapPoint = useDerivedValue(() => {
    // If dynamic sizing is enabled, return true
    if (enableDynamicSizing) {
      return true;
    }

    const rawSnapPoints = extractSnapPoints(snapPoints);

    // If any snap point is a string, return true
    return rawSnapPoints.some((snapPoint: string | number) => typeof snapPoint === 'string');
  });

  return [normalizedSnapPoints, dynamicSnapPointIndex, hasDynamicSnapPoint];
};
