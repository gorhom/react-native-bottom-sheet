"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBottomSheetDynamicSnapPoints = void 0;

var _react = require("react");

var _reactNativeReanimated = require("react-native-reanimated");

var _constants = require("../components/bottomSheet/constants");

/**
 * Provides dynamic content height calculating functionalities, by
 * replacing the placeholder `CONTENT_HEIGHT` with calculated layout.
 * @example
 * [0, 'CONTENT_HEIGHT', '100%']
 * @param initialSnapPoints your snap point with content height placeholder.
 * @returns {
 *  - animatedSnapPoints: an animated snap points to be set on `BottomSheet` or `BottomSheetModal`.
 *  - animatedHandleHeight: an animated handle height callback node to be set on `BottomSheet` or `BottomSheetModal`.
 *  - animatedContentHeight: an animated content height callback node to be set on `BottomSheet` or `BottomSheetModal`.
 *  - handleContentLayout: a `onLayout` callback method to be set on `BottomSheetView` component.
 * }
 * @deprecated will be deprecated in the next major release! please use the new introduce prop `enableDynamicSizing`.
 */
const useBottomSheetDynamicSnapPoints = initialSnapPoints => {
  // variables
  const animatedContentHeight = (0, _reactNativeReanimated.useSharedValue)(0);
  const animatedHandleHeight = (0, _reactNativeReanimated.useSharedValue)(_constants.INITIAL_HANDLE_HEIGHT);
  const animatedSnapPoints = (0, _reactNativeReanimated.useDerivedValue)(() => {
    if (animatedHandleHeight.value === _constants.INITIAL_HANDLE_HEIGHT || animatedContentHeight.value === 0) {
      return initialSnapPoints.map(() => _constants.INITIAL_SNAP_POINT);
    }

    const contentWithHandleHeight = animatedContentHeight.value + animatedHandleHeight.value;
    return initialSnapPoints.map(snapPoint => snapPoint === 'CONTENT_HEIGHT' ? contentWithHandleHeight : snapPoint);
  }, []);
  // callbacks
  const handleContentLayout = (0, _react.useCallback)(({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) => {
    animatedContentHeight.value = height;
  }, [animatedContentHeight]); //#region effects

  (0, _react.useEffect)(() => {
    console.warn('`useBottomSheetDynamicSnapPoints` will be deprecated in the next major release! please use the new introduce prop `enableDynamicSizing`.');
  }, []); //#endregion

  return {
    animatedSnapPoints,
    animatedHandleHeight,
    animatedContentHeight,
    handleContentLayout
  };
};

exports.useBottomSheetDynamicSnapPoints = useBottomSheetDynamicSnapPoints;
//# sourceMappingURL=useBottomSheetDynamicSnapPoints.js.map