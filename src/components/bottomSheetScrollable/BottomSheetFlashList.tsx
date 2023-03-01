import { memo } from 'react';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import Animated from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
import type {
  BottomSheetFlashListMethods,
  BottomSheetFlashListProps,
} from './types';

const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<any>>(FlashList);

const BottomSheetFlashListComponent = createBottomSheetScrollableComponent<
  BottomSheetFlashListMethods,
  BottomSheetFlashListProps<any>
>(SCROLLABLE_TYPE.FLASHLIST, AnimatedFlashList);

const BottomSheetFlashList = memo(BottomSheetFlashListComponent);
BottomSheetFlashList.displayName = 'BottomSheetFlashList';

export default BottomSheetFlashList as <T>(
  props: BottomSheetFlashListProps<T>
) => ReturnType<typeof BottomSheetFlashList>;
