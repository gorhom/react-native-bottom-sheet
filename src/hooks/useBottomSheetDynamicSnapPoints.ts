import { useCallback } from 'react';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';

/**
 * Provides dynamic content height calculating functionalities, by
 * replacing the placeholder `CONTENT_HEIGHT` with calculated layout.
 * @example
 * [0, 'CONTENT_HEIGHT', '100%']
 * @param initialSnapPoints your snap point with content height placeholder.
 * @returns {
 *  - animatedSnapPoints: to provided to `BottomSheet` or `BottomSheetModal`.
 *  - animatedHandleHeight: an animated handle height callback node.
 *  - contentProps: props to be spread at `BottomSheetView` component.
 * }
 */
export const useBottomSheetDynamicSnapPoints = (
  initialSnapPoints: Array<string | number>
) => {
  // variables
  const animatedContentHeight = useSharedValue(0);
  const animatedHandleHeight = useSharedValue(0);
  const animatedSnapPoints = useDerivedValue(() => {
    const contentWithHandleHeight =
      animatedContentHeight.value + animatedHandleHeight.value;

    return initialSnapPoints.map(snapPoint =>
      snapPoint === 'CONTENT_HEIGHT' ? contentWithHandleHeight : snapPoint
    );
  });

  // callbacks
  const handleContentLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      animatedContentHeight.value = height;
    },
    [animatedContentHeight]
  );

  return {
    animatedSnapPoints,
    animatedHandleHeight,
    animatedContentHeight,
    handleContentLayout,
  };
};
