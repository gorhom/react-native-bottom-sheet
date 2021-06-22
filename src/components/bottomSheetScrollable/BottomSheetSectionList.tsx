import { memo } from 'react';
import {
  DefaultSectionT,
  SectionList as RNSectionList,
  SectionListProps as RNSectionListProps,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
import type {
  BottomSheetSectionListMethods,
  BottomSheetSectionListProps,
} from './types';

const AnimatedSectionList =
  Animated.createAnimatedComponent<RNSectionListProps<any>>(RNSectionList);

const BottomSheetSectionListComponent = createBottomSheetScrollableComponent<
  BottomSheetSectionListMethods,
  BottomSheetSectionListProps<any, DefaultSectionT>
>(SCROLLABLE_TYPE.SECTIONLIST, AnimatedSectionList);

const BottomSheetSectionList = memo(BottomSheetSectionListComponent);
BottomSheetSectionList.displayName = 'BottomSheetSectionList';

export default BottomSheetSectionList as <ItemT, SectionT = DefaultSectionT>(
  props: BottomSheetSectionListProps<ItemT, SectionT>
) => ReturnType<typeof BottomSheetSectionList>;
