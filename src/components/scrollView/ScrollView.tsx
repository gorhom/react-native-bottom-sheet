import React, {
  useMemo,
  useRef,
  useImperativeHandle,
  useEffect,
  forwardRef,
  Ref,
} from 'react';
import {
  ScrollView as RNScrollView,
  ScrollViewProps as RNScrollViewProps,
  ViewStyle,
} from 'react-native';
import Reanimated from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '../../hooks';
import type {
  BottomSheetScrollView,
  BottomSheetScrollViewProps,
} from './types';

const AnimatedScrollView = Reanimated.createAnimatedComponent(
  RNScrollView
) as React.ComponentClass<
  Reanimated.AnimateProps<ViewStyle, RNScrollViewProps>,
  any
>;

const ScrollView = forwardRef(
  (props: BottomSheetScrollViewProps, ref: Ref<RNScrollView>) => {
    // props
    const {
      contentContainerStyle: _contentContainerStyle,
      focusHook: useFocusHook = useEffect,
      ...rest
    } = props;

    // refs
    const scrollViewRef = useRef<RNScrollView>(null);

    // hooks
    const {
      scrollComponentRef,
      masterDrawerRef,
      drawerContentRef,
      decelerationRate,
      contentPaddingBottom,
      setScrollableRef,
      removeScrollableRef,
      onScrollBeginDrag,
    } = useBottomSheetInternal();

    // styles
    const contentContainerStyle = useMemo(() => {
      return {
        // @ts-ignore
        ...(_contentContainerStyle ?? {}),
        paddingBottom:
          contentPaddingBottom +
          Math.max(_contentContainerStyle?.paddingBottom ?? 0, 0),
      };
    }, [_contentContainerStyle, contentPaddingBottom]);

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollViewRef.current!.getNode());
    useFocusHook(() => {
      setScrollableRef(scrollViewRef);
      return () => {
        removeScrollableRef(scrollViewRef);
      };
    }, [setScrollableRef, removeScrollableRef]);

    return (
      <NativeViewGestureHandler
        ref={scrollComponentRef}
        waitFor={masterDrawerRef}
        simultaneousHandlers={drawerContentRef}
      >
        <AnimatedScrollView
          {...rest}
          ref={scrollViewRef}
          overScrollMode="never"
          bounces={false}
          decelerationRate={decelerationRate}
          onScrollBeginDrag={onScrollBeginDrag}
          scrollEventThrottle={1}
          contentContainerStyle={contentContainerStyle}
        />
      </NativeViewGestureHandler>
    );
  }
);

export default (ScrollView as any) as typeof BottomSheetScrollView;
