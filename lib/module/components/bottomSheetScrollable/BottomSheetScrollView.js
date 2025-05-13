"use strict";

import { memo } from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
const AnimatedScrollView = Animated.createAnimatedComponent(RNScrollView);
const BottomSheetScrollViewComponent = createBottomSheetScrollableComponent(SCROLLABLE_TYPE.SCROLLVIEW, AnimatedScrollView);
const BottomSheetScrollView = /*#__PURE__*/memo(BottomSheetScrollViewComponent);
BottomSheetScrollView.displayName = 'BottomSheetScrollView';
export default BottomSheetScrollView;
//# sourceMappingURL=BottomSheetScrollView.js.map