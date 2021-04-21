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
import BottomSheetDraggableView from '../bottomSheetDraggableView';
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
      handleOnBeginDragEvent,
      handleOnContentSizeChange,
      handleSettingScrollable,
    } = useScrollableInternal('ScrollView');
    const {
      enableContentPanningGesture,
      containerTapGestureRef,
      decelerationRate,
    } = useBottomSheetInternal();

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollableRef.current);
    useFocusHook(handleSettingScrollable);

    return (
      <BottomSheetDraggableView
        nativeGestureRef={nativeGestureRef}
        gestureType="CONTENT"
        style={styles.container}
      >
        <NativeViewGestureHandler
          ref={nativeGestureRef}
          enabled={enableContentPanningGesture}
          waitFor={containerTapGestureRef}
        >
          <AnimatedScrollView
            {...rest}
            ref={scrollableRef}
            overScrollMode="never"
            bounces={false}
            decelerationRate={decelerationRate}
            scrollEventThrottle={16}
            onContentSizeChange={handleOnContentSizeChange}
            onScrollBeginDrag={handleOnBeginDragEvent}
          />
        </NativeViewGestureHandler>
      </BottomSheetDraggableView>
    );
  }
);

const BottomSheetScrollView = memo(BottomSheetScrollViewComponent, isEqual);

export default (BottomSheetScrollView as any) as typeof BottomSheetScrollViewType;
