import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { useCustomScrollableInternal } from './useCustomScrollableInternal';
import {
  BottomSheetDraggableView,
  useBottomSheetInternal,
} from '@gorhom/bottom-sheet';
import { useAnimatedStyle } from 'react-native-reanimated';
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
    const { enableContentPanningGesture, animatedFooterHeight } =
      useBottomSheetInternal();
    //#endregion

    //#region styles
    const containerAnimatedStyle = useAnimatedStyle(() => ({
      marginBottom: animatedFooterHeight.value,
    }));
    const containerStyle = useMemo(
      () => [
        ...(style ? ('length' in style ? style : [style]) : []),
        containerAnimatedStyle,
      ],
      [style, containerAnimatedStyle]
    );
    //#endregion

    //#region effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollableRef.current);
    useFocusHook(handleSettingScrollable);
    //#endregion

    // here, we do not pass animatedProps that contain TODO
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
            style={containerStyle}
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
