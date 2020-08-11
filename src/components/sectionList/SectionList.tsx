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
import DraggableView from '../draggableView';
import { useBottomSheetInternal } from '../../hooks';
import { useScrollableInternal } from '../../utilities/useScrollable';
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
      handleScrollEvent,
      handleSettingScrollable,
    } = useScrollableInternal('SectionList');
    const {
      rootTapGestureRef,
      disableIntervalMomentum,
      decelerationRate,
    } = useBottomSheetInternal();
    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollableRef.current!.getNode());
    useFocusHook(handleSettingScrollable);

    // render
    return (
      <DraggableView
        style={styles.container}
        nativeGestureRef={nativeGestureRef}
      >
        <NativeViewGestureHandler
          ref={nativeGestureRef}
          waitFor={rootTapGestureRef}
        >
          <AnimatedSectionList
            {...rest}
            // @ts-ignore
            ref={scrollableRef}
            overScrollMode="never"
            bounces={false}
            // @ts-ignore
            disableIntervalMomentum={disableIntervalMomentum}
            decelerationRate={decelerationRate}
            scrollEventThrottle={1}
            onScrollBeginDrag={handleScrollEvent}
          />
        </NativeViewGestureHandler>
      </DraggableView>
    );
  }
);

const BottomSheetSectionList = memo(BottomSheetSectionListComponent, isEqual);

export default (BottomSheetSectionList as any) as typeof BottomSheetSectionListType;
