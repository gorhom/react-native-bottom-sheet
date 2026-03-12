import { memo } from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
import type {
  BottomSheetScrollViewMethods,
  BottomSheetScrollViewProps,
} from './types';

const AnimatedScrollView =
  Animated.createAnimatedComponent(RNScrollView);

const BottomSheetScrollViewComponent = createBottomSheetScrollableComponent<
  BottomSheetScrollViewMethods,
  BottomSheetScrollViewProps
>(SCROLLABLE_TYPE.SCROLLVIEW, AnimatedScrollView);

const BottomSheetScrollView = memo(BottomSheetScrollViewComponent);
BottomSheetScrollView.displayName = 'BottomSheetScrollView';

export default BottomSheetScrollView as (
  props: BottomSheetScrollViewProps
) => ReturnType<typeof BottomSheetScrollView>;
