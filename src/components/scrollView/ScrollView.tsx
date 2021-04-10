import React, {
  useRef,
  useImperativeHandle,
  useEffect,
  forwardRef,
  Ref,
  memo,
} from 'react';
import {
  ScrollView as RNScrollView,
  ScrollViewProps as RNScrollViewProps,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import { useScrollableInternal, useBottomSheetInternal } from '../../hooks';
import type {
  BottomSheetScrollViewType,
  BottomSheetScrollViewProps,
} from './types';
import { styles } from './styles';

const AnimatedScrollView = Animated.createAnimatedComponent<RNScrollViewProps>(
  RNScrollView
);

const BottomSheetScrollViewName = 'ScrollView';

const BottomSheetScrollViewComponent = forwardRef(
  (props: BottomSheetScrollViewProps, ref: Ref<RNScrollView>) => {
    // props
    const {
      focusHook: useFocusHook = useEffect,
      overScrollMode = 'never',
      ...rest
    } = props;

    // refs
    const nativeGestureRef = useRef<NativeViewGestureHandler>(null);

    // hooks
    const {
      scrollableRef,
      scrollableAnimatedProps,
      handleScrollEvent,
      handleSettingScrollable,
    } = useScrollableInternal(BottomSheetScrollViewName);
    const { enableContentPanningGesture } = useBottomSheetInternal();

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollableRef.current);
    useFocusHook(handleSettingScrollable);

    return (
      <BottomSheetDraggableView
        nativeGestureRef={nativeGestureRef}
        style={styles.container}
      >
        <NativeViewGestureHandler
          ref={nativeGestureRef}
          enabled={enableContentPanningGesture}
          shouldCancelWhenOutside={false}
        >
          <AnimatedScrollView
            {...rest}
            // @ts-ignore
            ref={scrollableRef}
            overScrollMode={overScrollMode}
            scrollEventThrottle={16}
            onScrollBeginDrag={handleScrollEvent}
            // @ts-ignore
            animatedProps={scrollableAnimatedProps}
          />
        </NativeViewGestureHandler>
      </BottomSheetDraggableView>
    );
  }
);

const BottomSheetScrollView = memo(BottomSheetScrollViewComponent);
BottomSheetScrollView.displayName = 'BottomSheetScrollView';

export default (BottomSheetScrollView as any) as typeof BottomSheetScrollViewType;
