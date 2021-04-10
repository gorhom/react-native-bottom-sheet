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
} from 'react-native';
import Animated from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import { useScrollableInternal, useBottomSheetInternal } from '../../hooks';
import type {
  BottomSheetFlatListProps,
  BottomSheetFlatListType,
} from './types';
import { styles } from './styles';

const AnimatedFlatList = Animated.createAnimatedComponent<RNFlatListProps<any>>(
  RNFlatList
);

const BottomSheetFlatListName = 'FlatList';

const BottomSheetFlatListComponent = forwardRef(
  (props: BottomSheetFlatListProps<any>, ref: Ref<RNFlatList>) => {
    // props
    const {
      focusHook: useFocusHook = useEffect,
      overScrollMode = 'never',
      ...rest
    } = props;

    // refs
    const nativeGestureRef = useRef<NativeViewGestureHandler>(null);

    // hooks
    const {
      scrollableRef,
      scrollableAnimatedProps,
      handleScrollEvent,
      handleSettingScrollable,
    } = useScrollableInternal(BottomSheetFlatListName);
    const { enableContentPanningGesture } = useBottomSheetInternal();

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollableRef.current);
    useFocusHook(handleSettingScrollable);

    // render
    return (
      <BottomSheetDraggableView
        nativeGestureRef={nativeGestureRef}
        style={styles.container}
      >
        <NativeViewGestureHandler
          ref={nativeGestureRef}
          enabled={enableContentPanningGesture}
          shouldCancelWhenOutside={false}
        >
          <AnimatedFlatList
            {...rest}
            // @ts-ignore
            ref={scrollableRef}
            overScrollMode={overScrollMode}
            scrollEventThrottle={16}
            onScrollBeginDrag={handleScrollEvent}
            // @ts-ignore
            animatedProps={scrollableAnimatedProps}
          />
        </NativeViewGestureHandler>
      </BottomSheetDraggableView>
    );
  }
);

const BottomSheetFlatList = memo(BottomSheetFlatListComponent);
BottomSheetFlatList.displayName = 'BottomSheetFlatList';

export default (BottomSheetFlatList as any) as typeof BottomSheetFlatListType;
