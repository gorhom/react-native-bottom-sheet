import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { useCustomScrollableInternal } from './useCustomScrollableInternal';
import {
  BottomSheetDraggableView,
  useBottomSheetInternal,
} from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';

export function createCustomBottomSheetScrollableComponent<T, P>(
  ScrollableComponent: any
) {
  return forwardRef<T, P>((props, ref) => {
    // props
    const {
      focusHook: useFocusHook = useEffect,
      overScrollMode = 'never',
      style,
      ...rest
    }: any = props;

    //#region refs
    const nativeGestureRef = useRef<NativeViewGestureHandler>(null);
    //#endregion

    //#region hooks
    const { scrollableRef, handleScrollEvent, handleSettingScrollable } =
      useCustomScrollableInternal();
    const { enableContentPanningGesture } = useBottomSheetInternal();
    //#endregion

    //#region effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollableRef.current);
    useFocusHook(handleSettingScrollable);
    //#endregion

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
          <ScrollableComponent
            {...rest}
            // @ts-ignore
            ref={scrollableRef}
            overScrollMode={overScrollMode}
            scrollEventThrottle={16}
            onScroll={handleScrollEvent}
            onScrollBeginDrag={handleScrollEvent}
            style={style}
          />
        </NativeViewGestureHandler>
      </BottomSheetDraggableView>
    );
    //#endregion
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
  },
});
