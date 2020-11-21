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
  ViewStyle,
} from 'react-native';
import isEqual from 'lodash.isequal';
import Animated from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import DraggableView from '../draggableView';
import { useScrollableInternal, useBottomSheetInternal } from '../../hooks';
import type {
  BottomSheetScrollViewType,
  BottomSheetScrollViewProps,
} from './types';
import { styles } from './styles';

const AnimatedScrollView = Animated.createAnimatedComponent(
  RNScrollView
) as React.ComponentClass<
  Animated.AnimateProps<ViewStyle, RNScrollViewProps>,
  any
>;

const BottomSheetScrollViewComponent = forwardRef(
  (props: BottomSheetScrollViewProps, ref: Ref<RNScrollView>) => {
    // props
    const { focusHook: useFocusHook = useEffect, ...rest } = props;

    // refs
    const nativeGestureRef = useRef<NativeViewGestureHandler>(null);

    // hooks
    const {
      scrollableRef,
      handleScrollEvent,
      handleSettingScrollable,
    } = useScrollableInternal('ScrollView');
    const {
      enabled,
      containerTapGestureRef,
      decelerationRate,
    } = useBottomSheetInternal();

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollableRef.current!.getNode());
    useFocusHook(handleSettingScrollable);

    return (
      <DraggableView
        nativeGestureRef={nativeGestureRef}
        gestureType="CONTENT"
        style={styles.container}
      >
        <NativeViewGestureHandler
          ref={nativeGestureRef}
          enabled={enabled}
          waitFor={containerTapGestureRef}
        >
          <AnimatedScrollView
            {...rest}
            ref={scrollableRef}
            overScrollMode="never"
            bounces={false}
            decelerationRate={decelerationRate}
            scrollEventThrottle={1}
            onScrollBeginDrag={handleScrollEvent}
          />
        </NativeViewGestureHandler>
      </DraggableView>
    );
  }
);

const BottomSheetScrollView = memo(BottomSheetScrollViewComponent, isEqual);

export default (BottomSheetScrollView as any) as typeof BottomSheetScrollViewType;
