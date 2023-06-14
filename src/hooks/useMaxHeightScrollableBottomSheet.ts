import { useWindowDimensions } from 'react-native';
import { useDerivedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useBottomSheetDynamicSnapPoints } from './useBottomSheetDynamicSnapPoints';
type CSSHeight = `${number}%` | number;

export const useMaxHeightScrollableBottomSheet = (
  maxHeight?: CSSHeight | false
) => {
  const deviceHeight = useWindowDimensions().height;
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(['CONTENT_HEIGHT']);

  const derivedSnapPoints = useDerivedValue(() => {
    // we get the dynamic size from the animatedSnapPoints
    const dynamicHeight = animatedSnapPoints.value[0];
    // if no fillHeight is provided, we use the default height (50%)
    const fixedHeight = maxHeight === false ? undefined : maxHeight ?? '50%';
    if (!fixedHeight) return [dynamicHeight];
    // we calculate the fillHeight based on the device height
    const paredFixedHeight =
      typeof fixedHeight === 'number'
        ? fixedHeight
        : (parseInt(fixedHeight.replace('%', ''), 10) / 100) * deviceHeight;

    return typeof dynamicHeight === 'number' &&
      dynamicHeight <= paredFixedHeight
      ? [dynamicHeight]
      : [paredFixedHeight];
  }, [deviceHeight, maxHeight]);

  // changing the height of the inner scroll view
  // based on the snap point calculated above
  const innerScrollViewAnimatedStyles = useAnimatedStyle(() => {
    // we do not set maxHeight until the hook is ready
    // due to performance issues
    if (animatedHandleHeight.value === -999) return {};
    return {
      maxHeight: derivedSnapPoints.value[0],
    };
  }, []);

  return {
    animatedHandleHeight,
    animatedContentHeight,
    handleContentLayout,
    animatedSnapPoints: derivedSnapPoints,
    innerScrollViewAnimatedStyles,
  };
};
