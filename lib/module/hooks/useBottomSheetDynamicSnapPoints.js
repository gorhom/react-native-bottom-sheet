import { useCallback, useEffect } from 'react';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { INITIAL_HANDLE_HEIGHT, INITIAL_SNAP_POINT } from '../components/bottomSheet/constants';
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

export const useBottomSheetDynamicSnapPoints = initialSnapPoints => {
  // variables
  const animatedContentHeight = useSharedValue(0);
  const animatedHandleHeight = useSharedValue(INITIAL_HANDLE_HEIGHT);
  const animatedSnapPoints = useDerivedValue(() => {
    if (animatedHandleHeight.value === INITIAL_HANDLE_HEIGHT || animatedContentHeight.value === 0) {
      return initialSnapPoints.map(() => INITIAL_SNAP_POINT);
    }

    const contentWithHandleHeight = animatedContentHeight.value + animatedHandleHeight.value;
    return initialSnapPoints.map(snapPoint => snapPoint === 'CONTENT_HEIGHT' ? contentWithHandleHeight : snapPoint);
  }, []);
  // callbacks
  const handleContentLayout = useCallback(({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) => {
    animatedContentHeight.value = height;
  }, [animatedContentHeight]); //#region effects

  useEffect(() => {
    console.warn('`useBottomSheetDynamicSnapPoints` will be deprecated in the next major release! please use the new introduce prop `enableDynamicSizing`.');
  }, []); //#endregion

  return {
    animatedSnapPoints,
    animatedHandleHeight,
    animatedContentHeight,
    handleContentLayout
  };
};
//# sourceMappingURL=useBottomSheetDynamicSnapPoints.js.map