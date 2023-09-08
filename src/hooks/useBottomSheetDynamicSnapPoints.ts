import { useCallback } from 'react';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import {
  INITIAL_HANDLE_HEIGHT,
  INITIAL_SNAP_POINT,
} from '../components/bottomSheet/constants';
import useBottomSheetMaxHeight from './useBottomSheetMaxHeight';

/**
 * Provides dynamic content height calculating functionalities, by
 * replacing the placeholder `CONTENT_HEIGHT` with calculated layout.
 * If max height is supplied, the sheet will be dynamic height up to the defined maximum.
 * Max height works best when "CONTENT_HEIGHT" is supplied as the final or only snapPoint
 * @example
 * useBottomSheetDynamicSnapPoints([0, 'CONTENT_HEIGHT'], "80%")
 * @param initialSnapPoints your snap point with content height placeholder.
 * @param maxHeight A percentage string or number value to be used as a maximum height for dynamic snap points.
 * @returns {
 *  - animatedSnapPoints: an animated snap points to be set on `BottomSheet` or `BottomSheetModal`.
 *  - animatedHandleHeight: an animated handle height callback node to be set on `BottomSheet` or `BottomSheetModal`.
 *  - animatedContentHeight: an animated content height callback node to be set on `BottomSheet` or `BottomSheetModal`.
 *  - handleContentLayout: a `onLayout` callback method to be set on `BottomSheetView` component.
 *  - childViewMaxHeightStyle: a style prop that can applied to the BottomSheet's first child component to allow dynamic content height to be limited to a max height.
 * }
 */
export const useBottomSheetDynamicSnapPoints = (
  initialSnapPoints: Array<string | number>,
  maxHeight?: `${string}%` | number
) => {
  // variables
  const animatedContentHeight = useSharedValue(0);
  const animatedHandleHeight = useSharedValue(INITIAL_HANDLE_HEIGHT);
  const animatedSnapPoints = useDerivedValue(() => {
    if (
      animatedHandleHeight.value === INITIAL_HANDLE_HEIGHT ||
      animatedContentHeight.value === 0
    ) {
      return initialSnapPoints.map(() => INITIAL_SNAP_POINT);
    }
    const contentWithHandleHeight =
      animatedContentHeight.value + animatedHandleHeight.value;

    return initialSnapPoints.map(snapPoint =>
      snapPoint === 'CONTENT_HEIGHT' ? contentWithHandleHeight : snapPoint
    );
  }, []);

  type HandleContentLayoutProps = {
    nativeEvent: {
      layout: { height: number };
    };
  };
  // callbacks
  const handleContentLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }: HandleContentLayoutProps) => {
      animatedContentHeight.value = height;
    },
    [animatedContentHeight]
  );

  const childViewMaxHeightStyle = useBottomSheetMaxHeight(maxHeight);

  return {
    animatedSnapPoints,
    animatedHandleHeight,
    animatedContentHeight,
    childViewMaxHeightStyle,
    handleContentLayout,
  };
};
