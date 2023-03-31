import * as React from 'react';
import {
  FlashList as ShopifyFlashList,
  FlashListProps,
} from '@shopify/flash-list';
import { SCROLLABLE_TYPE } from '../../constants';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
import type {
  BottomSheetFlashListMethods,
  BottomSheetFlashListProps,
} from './types';
import Animated from 'react-native-reanimated';
import BottomSheetScrollView from './BottomSheetScrollView';

const AnimatedShopifyFlashList =
  Animated.createAnimatedComponent(ShopifyFlashList);
const AnimatedFlashList = React.forwardRef<any, FlashListProps<any>>(
  (props, ref) => (
    <AnimatedShopifyFlashList
      ref={ref}
      // @ts-ignore
      renderScrollComponent={BottomSheetScrollView}
      {...props}
    />
  )
);

const BottomSheetFlashListComponent = createBottomSheetScrollableComponent<
  BottomSheetFlashListMethods,
  BottomSheetFlashListProps<any>
>(SCROLLABLE_TYPE.FLASHLIST, AnimatedFlashList);

const BottomSheetFlashList = React.memo(BottomSheetFlashListComponent);
BottomSheetFlashList.displayName = 'BottomSheetFlashList';

export default BottomSheetFlashList as <T>(
  props: BottomSheetFlashListProps<T>
) => ReturnType<typeof BottomSheetFlashList>;
