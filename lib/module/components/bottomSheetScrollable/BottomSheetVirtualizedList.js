import { memo } from 'react';
import { VirtualizedList as RNVirtualizedList } from 'react-native';
import Animated from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
const AnimatedVirtualizedList = Animated.createAnimatedComponent(RNVirtualizedList);
const BottomSheetVirtualizedListComponent = createBottomSheetScrollableComponent(SCROLLABLE_TYPE.VIRTUALIZEDLIST, AnimatedVirtualizedList);
const BottomSheetVirtualizedList = /*#__PURE__*/memo(BottomSheetVirtualizedListComponent);
BottomSheetVirtualizedList.displayName = 'BottomSheetVirtualizedList';
export default BottomSheetVirtualizedList;
//# sourceMappingURL=BottomSheetVirtualizedList.js.map