"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useNormalizedSnapPoints = void 0;

var _reactNativeReanimated = require("react-native-reanimated");

var _utilities = require("../utilities");

var _constants = require("../components/bottomSheet/constants");

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
const useNormalizedSnapPoints = (snapPoints, containerHeight, contentHeight, handleHeight, enableDynamicSizing, maxDynamicContentSize) => {
  const normalizedSnapPoints = (0, _reactNativeReanimated.useDerivedValue)(() => {
    // early exit, if container layout is not ready
    const isContainerLayoutReady = containerHeight.value !== _constants.INITIAL_CONTAINER_HEIGHT;

    if (!isContainerLayoutReady) {
      return [_constants.INITIAL_SNAP_POINT];
    }

    const _snapPoints = snapPoints ? 'value' in snapPoints ? snapPoints.value : snapPoints : [];

    let _normalizedSnapPoints = _snapPoints.map(snapPoint => (0, _utilities.normalizeSnapPoint)(snapPoint, containerHeight.value));

    if (enableDynamicSizing) {
      if (handleHeight.value === _constants.INITIAL_HANDLE_HEIGHT) {
        return [_constants.INITIAL_SNAP_POINT];
      }

      if (contentHeight.value === _constants.INITIAL_CONTAINER_HEIGHT) {
        return [_constants.INITIAL_SNAP_POINT];
      }

      _normalizedSnapPoints.push(containerHeight.value - Math.min(contentHeight.value + handleHeight.value, maxDynamicContentSize !== undefined ? maxDynamicContentSize : containerHeight.value));

      _normalizedSnapPoints = _normalizedSnapPoints.sort((a, b) => b - a);
    }

    return _normalizedSnapPoints;
  }, [snapPoints, enableDynamicSizing, maxDynamicContentSize]);
  return normalizedSnapPoints;
};

exports.useNormalizedSnapPoints = useNormalizedSnapPoints;
//# sourceMappingURL=useNormalizedSnapPoints.js.map