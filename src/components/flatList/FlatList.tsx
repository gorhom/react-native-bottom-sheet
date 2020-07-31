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

const AnimatedFlatList = Reanimated.createAnimatedComponent(
  RNFlatList
) as React.ComponentClass<
  Reanimated.AnimateProps<ViewStyle, RNFlatListProps<any>>,
  any
>;

type FlatListProps<T> = Omit<
  RNFlatListProps<T>,
  | 'overScrollMode'
  | 'bounces'
  | 'decelerationRate'
  | 'onScrollBeginDrag'
  | 'scrollEventThrottle'
>;

const FlatList = forwardRef(
  (props: FlatListProps<any>, ref: Ref<RNFlatList>) => {
    // props
    const { contentContainerStyle: _contentContainerStyle, ...rest } = props;

    // refs
    const flatListRef = useRef<RNFlatList>(null);

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
      const {
        //@ts-ignore
        paddingBottom = 0,
        // @ts-ignore
        ...restContentContainerStyle
      } = _contentContainerStyle;

      return {
        ...restContentContainerStyle,
        paddingBottom: contentPaddingBottom + Math.max(paddingBottom ?? 0, 0),
      };
    }, [_contentContainerStyle, contentPaddingBottom]);

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => flatListRef.current!.getNode());
    useEffect(() => {
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

export default (FlatList as any) as typeof RNFlatList;
