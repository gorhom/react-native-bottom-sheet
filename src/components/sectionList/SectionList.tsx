import React, {
  useImperativeHandle,
  useEffect,
  useRef,
  Ref,
  forwardRef,
  memo,
} from 'react';
import {
  SectionList as RNSectionList,
  SectionListProps as RNSectionListProps,
  ViewStyle,
} from 'react-native';
import isEqual from 'lodash.isequal';
import Animated from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import { useScrollableInternal, useBottomSheetInternal } from '../../hooks';
import type {
  BottomSheetSectionListProps,
  BottomSheetSectionListType,
} from './types';
import { styles } from './styles';

const AnimatedSectionList = Animated.createAnimatedComponent(
  RNSectionList
) as React.ComponentClass<
  Animated.AnimateProps<ViewStyle, RNSectionListProps<any>>,
  any
>;

const BottomSheetSectionListComponent = forwardRef(
  (props: BottomSheetSectionListProps<any>, ref: Ref<RNSectionList>) => {
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
    } = useScrollableInternal('SectionList');
    const {
      enableContentPanningGesture,
      containerTapGestureRef,
      decelerationRate,
    } = useBottomSheetInternal();
    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollableRef.current);
    useFocusHook(handleSettingScrollable);

    // render
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
          <AnimatedSectionList
            {...rest}
            // @ts-ignore
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

const BottomSheetSectionList = memo(BottomSheetSectionListComponent, isEqual);

export default (BottomSheetSectionList as any) as typeof BottomSheetSectionListType;
