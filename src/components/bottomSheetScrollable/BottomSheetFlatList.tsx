import { memo } from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
import type {
  BottomSheetFlatListMethods,
  BottomSheetFlatListProps,
} from './types';

const AnimatedFlatList =
  Animated.createAnimatedComponent<RNFlatListProps<any>>(RNFlatList);

const BottomSheetFlatListComponent = createBottomSheetScrollableComponent<
  BottomSheetFlatListMethods,
  BottomSheetFlatListProps<any>
>(SCROLLABLE_TYPE.FLATLIST, AnimatedFlatList);

const BottomSheetFlatList = memo(BottomSheetFlatListComponent);
BottomSheetFlatList.displayName = 'BottomSheetFlatList';

export default BottomSheetFlatList as <T>(
  props: BottomSheetFlatListProps<T>
) => ReturnType<typeof BottomSheetFlatList>;
