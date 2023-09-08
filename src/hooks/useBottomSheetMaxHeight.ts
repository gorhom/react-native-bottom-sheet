import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MaxHeight = `${string}%` | number;

const getPercentageMaxHeight = (
  maxHeight: `${string}%`,
  safeMaxheightValue: number
) => {
  return safeMaxheightValue * (parseFloat(maxHeight) / 100);
};

const getNumberMaxHeight = (maxHeight: number, safeMaxheightValue: number) => {
  if (maxHeight > safeMaxheightValue) {
    return safeMaxheightValue;
  }
  return maxHeight;
};

const useBottomSheetMaxHeight = (maxHeight?: MaxHeight) => {
  const { height: deviceHeight } = useWindowDimensions();
  const { top: topSafeAreaInset } = useSafeAreaInsets();
  if (!maxHeight) {
    return undefined;
  }
  const safeDeviceHeight = deviceHeight - topSafeAreaInset;
  const maxHeightIsPercentage = typeof maxHeight === 'string';
  const maxHeightNumber = maxHeightIsPercentage
    ? getPercentageMaxHeight(maxHeight as `${string}%`, safeDeviceHeight)
    : getNumberMaxHeight(maxHeight as number, safeDeviceHeight);

  const childViewStyle = {
    maxHeight: maxHeightNumber,
  };

  return childViewStyle;
};

export default useBottomSheetMaxHeight;
