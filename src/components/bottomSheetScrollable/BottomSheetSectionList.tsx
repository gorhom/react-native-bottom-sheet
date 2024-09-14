import { type ComponentProps, memo } from 'react';
import {
  type DefaultSectionT,
  SectionList as RNSectionList,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
import type {
  BottomSheetSectionListMethods,
  BottomSheetSectionListProps,
} from './types';

const AnimatedSectionList =
  Animated.createAnimatedComponent<ComponentProps<typeof RNSectionList>>(
    RNSectionList
  );

const BottomSheetSectionListComponent = createBottomSheetScrollableComponent<
  BottomSheetSectionListMethods,
  BottomSheetSectionListProps<never, DefaultSectionT>
>(SCROLLABLE_TYPE.SECTIONLIST, AnimatedSectionList);

const BottomSheetSectionList = memo(BottomSheetSectionListComponent);
BottomSheetSectionList.displayName = 'BottomSheetSectionList';

export default BottomSheetSectionList as <ItemT, SectionT = DefaultSectionT>(
  props: BottomSheetSectionListProps<ItemT, SectionT>
) => ReturnType<typeof BottomSheetSectionList>;
