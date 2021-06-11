import { memo } from 'react';
import {
  ScrollView as RNScrollView,
  ScrollViewProps as RNScrollViewProps,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { createCustomBottomSheetScrollableComponent } from './CreateCustomBottomSheetScrollableComponent';
import { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { BottomSheetScrollViewProps } from '../../../../../src/components/bottomSheetScrollable/types';

const AnimatedScrollView =
  Animated.createAnimatedComponent<RNScrollViewProps>(RNScrollView);

const BottomSheetScrollViewComponent =
  createCustomBottomSheetScrollableComponent<
    BottomSheetScrollViewMethods,
    BottomSheetScrollViewProps
  >(AnimatedScrollView);

const BottomSheetCustomScrollView = memo(BottomSheetScrollViewComponent);
BottomSheetCustomScrollView.displayName = 'BottomSheetCustomScrollView';

export default BottomSheetCustomScrollView as (
  props: BottomSheetScrollViewProps
) => ReturnType<typeof BottomSheetCustomScrollView>;
