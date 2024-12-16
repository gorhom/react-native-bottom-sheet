"use strict";

import { memo } from 'react';
import { SectionList as RNSectionList } from 'react-native';
import Animated from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
const AnimatedSectionList = Animated.createAnimatedComponent(RNSectionList);
const BottomSheetSectionListComponent = createBottomSheetScrollableComponent(SCROLLABLE_TYPE.SECTIONLIST, AnimatedSectionList);
const BottomSheetSectionList = /*#__PURE__*/memo(BottomSheetSectionListComponent);
BottomSheetSectionList.displayName = 'BottomSheetSectionList';
export default BottomSheetSectionList;
//# sourceMappingURL=BottomSheetSectionList.js.map