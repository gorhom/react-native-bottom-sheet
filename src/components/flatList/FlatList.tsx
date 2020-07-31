import React, {
  forwardRef,
  useMemo,
  Ref,
  useRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
  ViewStyle,
} from 'react-native';
import Reanimated from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '../../hooks';
import { BottomSheetFlatListProps, BottomSheetFlatList } from './types';

const AnimatedFlatList = Reanimated.createAnimatedComponent(
  RNFlatList
) as React.ComponentClass<
  Reanimated.AnimateProps<ViewStyle, RNFlatListProps<any>>,
  any
>;

const FlatList = forwardRef(
  (props: BottomSheetFlatListProps<any>, ref: Ref<RNFlatList>) => {
    // props
    const {
      contentContainerStyle: _contentContainerStyle,
      focusHook: useFocusHook = useEffect,
      ...rest
    } = props;

    // refs
    const flatListRef = useRef<RNFlatList>(null);

    // hooks
    const {
      masterDrawerRef,
      drawerContentRef,
      scrollComponentRef,
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
    useImperativeHandle(ref, () => flatListRef.current!.getNode());
    useFocusHook(() => {
      setScrollableRef(flatListRef);
      return () => {
        removeScrollableRef(flatListRef);
      };
    }, [setScrollableRef, removeScrollableRef]);

    // render
    return (
      <NativeViewGestureHandler
        ref={scrollComponentRef}
        waitFor={masterDrawerRef}
        simultaneousHandlers={drawerContentRef}
      >
        <AnimatedFlatList
          {...rest}
          ref={flatListRef}
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

export default (FlatList as any) as typeof BottomSheetFlatList;
