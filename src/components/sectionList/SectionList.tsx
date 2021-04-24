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
} from 'react-native';
import Animated from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import { useScrollableInternal, useBottomSheetInternal } from '../../hooks';
import type {
  BottomSheetSectionListProps,
  BottomSheetSectionListType,
} from './types';
import { styles } from './styles';

const AnimatedSectionList = Animated.createAnimatedComponent<
  RNSectionListProps<any>
>(RNSectionList);

const BottomSheetSectionListName = 'SectionList';

const BottomSheetSectionListComponent = forwardRef(
  (props: BottomSheetSectionListProps<any>, ref: Ref<RNSectionList>) => {
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
    } = useScrollableInternal(BottomSheetSectionListName);
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
          <AnimatedSectionList
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

const BottomSheetSectionList = memo(BottomSheetSectionListComponent);
BottomSheetSectionList.displayName = 'BottomSheetSectionList';

export default (BottomSheetSectionList as any) as typeof BottomSheetSectionListType;
