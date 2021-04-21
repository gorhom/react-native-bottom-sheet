import React, {
  forwardRef,
  Ref,
  useRef,
  useImperativeHandle,
  useEffect,
  memo,
} from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
  ViewStyle,
} from 'react-native';
import isEqual from 'lodash.isequal';
import Animated from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import { useScrollableInternal, useBottomSheetInternal } from '../../hooks';
import type {
  BottomSheetFlatListProps,
  BottomSheetFlatListType,
} from './types';
import { styles } from './styles';

const AnimatedFlatList = Animated.createAnimatedComponent(
  RNFlatList
) as React.ComponentClass<
  Animated.AnimateProps<ViewStyle, RNFlatListProps<any>>,
  any
>;

const BottomSheetFlatListComponent = forwardRef(
  (props: BottomSheetFlatListProps<any>, ref: Ref<RNFlatList>) => {
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
    } = useScrollableInternal('FlatList');
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
          <AnimatedFlatList
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

const BottomSheetFlatList = memo(BottomSheetFlatListComponent, isEqual);

export default (BottomSheetFlatList as any) as typeof BottomSheetFlatListType;
