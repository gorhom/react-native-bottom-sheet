"use strict";

import { memo } from 'react';
import { FlatList as RNFlatList } from 'react-native';
import Animated from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
const AnimatedFlatList = Animated.createAnimatedComponent(RNFlatList);
const BottomSheetFlatListComponent = createBottomSheetScrollableComponent(SCROLLABLE_TYPE.FLATLIST, AnimatedFlatList);
const BottomSheetFlatList = /*#__PURE__*/memo(BottomSheetFlatListComponent);
BottomSheetFlatList.displayName = 'BottomSheetFlatList';
export default BottomSheetFlatList;
//# sourceMappingURL=BottomSheetFlatList.js.map