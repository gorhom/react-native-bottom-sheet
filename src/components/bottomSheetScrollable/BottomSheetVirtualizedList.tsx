import { type ComponentProps, memo } from 'react';
import { VirtualizedList as RNVirtualizedList } from 'react-native';
import Animated from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
import type {
  BottomSheetVirtualizedListMethods,
  BottomSheetVirtualizedListProps,
} from './types';

const AnimatedVirtualizedList =
  Animated.createAnimatedComponent<ComponentProps<typeof RNVirtualizedList>>(
    RNVirtualizedList
  );

const BottomSheetVirtualizedListComponent =
  createBottomSheetScrollableComponent<
    BottomSheetVirtualizedListMethods,
    BottomSheetVirtualizedListProps<never>
  >(SCROLLABLE_TYPE.VIRTUALIZEDLIST, AnimatedVirtualizedList);

const BottomSheetVirtualizedList = memo(BottomSheetVirtualizedListComponent);
BottomSheetVirtualizedList.displayName = 'BottomSheetVirtualizedList';

export default BottomSheetVirtualizedList as <T>(
  props: BottomSheetVirtualizedListProps<T>
) => ReturnType<typeof BottomSheetVirtualizedList>;
