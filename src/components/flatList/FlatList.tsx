import React, {
  forwardRef,
  useMemo,
  Ref,
  useRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
  ViewStyle,
} from 'react-native';
import Animated, { event } from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import DraggableView from '../draggableView';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetFlatListProps, BottomSheetFlatList } from './types';
import { styles } from './styles';

const AnimatedFlatList = Animated.createAnimatedComponent(
  RNFlatList
) as React.ComponentClass<
  Animated.AnimateProps<ViewStyle, RNFlatListProps<any>>,
  any
>;

const FlatList = forwardRef(
  (props: BottomSheetFlatListProps<any>, ref: Ref<RNFlatList>) => {
    // props
    const { focusHook: useFocusHook = useEffect, ...rest } = props;

    // refs
    const nativeGestureRef = useRef<NativeViewGestureHandler>(null);
    const flatListRef = useRef<RNFlatList>(null);

    // hooks
    const {
      rootTapGestureRef,
      scrollableContentOffsetY,
      setScrollableRef,
      removeScrollableRef,
    } = useBottomSheetInternal();

    // callbacks
    const handleScrollEvent = useMemo(
      () =>
        event([
          {
            nativeEvent: {
              contentOffset: { y: scrollableContentOffsetY },
            },
          },
        ]),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );
    const handleFocus = useCallback(() => {
      setScrollableRef(flatListRef);

      return () => {
        removeScrollableRef(flatListRef);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => flatListRef.current!.getNode());
    useFocusHook(handleFocus);

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
          <AnimatedFlatList
            {...rest}
            ref={flatListRef}
            overScrollMode="never"
            bounces={false}
            decelerationRate={0.99999}
            scrollEventThrottle={1}
            onScrollBeginDrag={handleScrollEvent}
          />
        </NativeViewGestureHandler>
      </DraggableView>
    );
  }
);

export default (FlatList as any) as typeof BottomSheetFlatList;
