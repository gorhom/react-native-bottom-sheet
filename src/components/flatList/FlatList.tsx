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
import {
  NativeViewGestureHandler,
  PanGestureHandler,
} from 'react-native-gesture-handler';
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
    const panGestureRef = useRef<PanGestureHandler>(null);
    const nativeGestureRef = useRef<NativeViewGestureHandler>(null);
    const flatListRef = useRef<RNFlatList>(null);

    // hooks
    const {
      rootTapGestureRef,
      sheetPanGestureState,
      sheetPanGestureTranslationY,
      sheetPanGestureVelocityY,
      scrollableContentOffsetY,
      setScrollableRef,
    } = useBottomSheetInternal();

    // callbacks
    const handleGestureEvent = useMemo(
      () =>
        event([
          {
            nativeEvent: {
              state: sheetPanGestureState,
              translationY: sheetPanGestureTranslationY,
              velocityY: sheetPanGestureVelocityY,
            },
          },
        ]),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => flatListRef.current!.getNode());
    useFocusHook(handleFocus);

    // render
    return (
      <PanGestureHandler
        ref={panGestureRef}
        simultaneousHandlers={[rootTapGestureRef, nativeGestureRef]}
        shouldCancelWhenOutside={false}
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleGestureEvent}
      >
        <Animated.View style={styles.container}>
          <NativeViewGestureHandler
            ref={nativeGestureRef}
            waitFor={rootTapGestureRef}
            simultaneousHandlers={panGestureRef}
          >
            <AnimatedFlatList
              {...rest}
              ref={flatListRef}
              overScrollMode="never"
              bounces={false}
              decelerationRate={0.99999}
              scrollEventThrottle={1}
              onScrollBeginDrag={handleScrollEvent}
              onScrollEndDrag={handleScrollEvent}
              onMomentumScrollBegin={handleScrollEvent}
              onMomentumScrollEnd={handleScrollEvent}
            />
          </NativeViewGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

export default (FlatList as any) as typeof BottomSheetFlatList;
