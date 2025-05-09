import { type ComponentProps, memo } from 'react';
import { FlatList as RNFlatList } from 'react-native';
import Animated from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
import type {
  BottomSheetFlatListMethods,
  BottomSheetFlatListProps,
} from './types';

const AnimatedFlatList =
  Animated.createAnimatedComponent<ComponentProps<typeof RNFlatList>>(
    RNFlatList
  );

const BottomSheetFlatListComponent = createBottomSheetScrollableComponent<
  BottomSheetFlatListMethods,
  BottomSheetFlatListProps<never>
>(SCROLLABLE_TYPE.FLATLIST, AnimatedFlatList);

const BottomSheetFlatList = memo(BottomSheetFlatListComponent);
BottomSheetFlatList.displayName = 'BottomSheetFlatList';

export default BottomSheetFlatList as <T>(
  props: BottomSheetFlatListProps<T>
) => ReturnType<typeof BottomSheetFlatList>;
