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
import DraggableView from '../draggableView';
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
      handleScrollEvent,
      handleSettingScrollable,
    } = useScrollableInternal('FlatList');
    const {
      enabled,
      containerTapGestureRef,
      decelerationRate,
    } = useBottomSheetInternal();

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollableRef.current!.getNode());
    useFocusHook(handleSettingScrollable);

    // render
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
          <AnimatedFlatList
            {...rest}
            // @ts-ignore
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

const BottomSheetFlatList = memo(BottomSheetFlatListComponent, isEqual);

export default (BottomSheetFlatList as any) as typeof BottomSheetFlatListType;
