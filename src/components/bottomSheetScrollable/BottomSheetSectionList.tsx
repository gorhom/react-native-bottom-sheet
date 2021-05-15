import { memo } from 'react';
import {
  SectionList as RNSectionList,
  SectionListProps as RNSectionListProps,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
import type {
  BottomSheetSectionListMethods,
  BottomSheetSectionListProps,
} from './types';

const AnimatedSectionList = Animated.createAnimatedComponent<
  RNSectionListProps<any>
>(RNSectionList);

const BottomSheetSectionListComponent = createBottomSheetScrollableComponent<
  BottomSheetSectionListMethods,
  BottomSheetSectionListProps<any>
>(AnimatedSectionList);

const BottomSheetSectionList = memo(BottomSheetSectionListComponent);
BottomSheetSectionList.displayName = 'BottomSheetSectionList';

export default BottomSheetSectionList as <T>(
  props: BottomSheetSectionListProps<T>
) => ReturnType<typeof BottomSheetSectionList>;
