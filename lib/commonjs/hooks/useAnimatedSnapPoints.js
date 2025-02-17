"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimatedSnapPoints = void 0;
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../components/bottomSheet/constants");
var _utilities = require("../utilities");
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
const useAnimatedSnapPoints = (snapPoints, containerHeight, contentHeight, handleHeight, footerHeight, enableDynamicSizing, maxDynamicContentSize) => {
  const dynamicSnapPointIndex = (0, _reactNativeReanimated.useSharedValue)(-1);
  const normalizedSnapPoints = (0, _reactNativeReanimated.useDerivedValue)(() => {
    // early exit, if container layout is not ready
    const isContainerLayoutReady = containerHeight.value !== _constants.INITIAL_CONTAINER_HEIGHT;
    if (!isContainerLayoutReady) {
      return [_constants.INITIAL_SNAP_POINT];
    }

    // extract snap points from provided props
    const _snapPoints = snapPoints ? 'value' in snapPoints ? snapPoints.value : snapPoints : [];

    // normalized all provided snap points, converting percentage
    // values into absolute values.
    let _normalizedSnapPoints = _snapPoints.map(snapPoint => (0, _utilities.normalizeSnapPoint)(snapPoint, containerHeight.value));

    // return normalized snap points if dynamic sizing is not enabled
    if (!enableDynamicSizing) {
      return _normalizedSnapPoints;
    }

    // early exit, if handle height is not calculated yet.
    if (handleHeight.value === _constants.INITIAL_HANDLE_HEIGHT) {
      return [_constants.INITIAL_SNAP_POINT];
    }

    // early exit, if content height is not calculated yet.
    if (contentHeight.value === _constants.INITIAL_CONTAINER_HEIGHT) {
      return [_constants.INITIAL_SNAP_POINT];
    }

    // calculate a new snap point based on content height.
    const dynamicSnapPoint = containerHeight.value - Math.min(contentHeight.value + handleHeight.value + footerHeight.value, maxDynamicContentSize !== undefined ? maxDynamicContentSize : containerHeight.value);

    // push dynamic snap point into the normalized snap points,
    // only if it does not exists in the provided list already.
    if (!_normalizedSnapPoints.includes(dynamicSnapPoint)) {
      _normalizedSnapPoints.push(dynamicSnapPoint);
    }

    // sort all snap points.
    _normalizedSnapPoints = _normalizedSnapPoints.sort((a, b) => b - a);

    // locate the dynamic snap point index.
    dynamicSnapPointIndex.value = _normalizedSnapPoints.indexOf(dynamicSnapPoint);
    return _normalizedSnapPoints;
  }, [snapPoints, containerHeight, handleHeight, contentHeight, footerHeight, enableDynamicSizing, maxDynamicContentSize, dynamicSnapPointIndex]);
  const hasDynamicSnapPoint = (0, _reactNativeReanimated.useDerivedValue)(() => {
    /**
     * if dynamic sizing is enabled, then we return true.
     */
    if (enableDynamicSizing) {
      return true;
    }

    // extract snap points from provided props
    const _snapPoints = snapPoints ? 'value' in snapPoints ? snapPoints.value : snapPoints : [];

    /**
     * if any of the snap points provided is a string, then we return true.
     */
    if (_snapPoints.length && _snapPoints.find(snapPoint => typeof snapPoint === 'string')) {
      return true;
    }
    return false;
  });
  return [normalizedSnapPoints, dynamicSnapPointIndex, hasDynamicSnapPoint];
};
exports.useAnimatedSnapPoints = useAnimatedSnapPoints;
//# sourceMappingURL=useAnimatedSnapPoints.js.map