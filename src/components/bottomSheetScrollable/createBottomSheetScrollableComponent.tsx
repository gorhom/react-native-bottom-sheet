import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Platform } from 'react-native';
import { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import BottomSheetRefreshControl from '../bottomSheetRefreshControl';
import {
  useScrollHandler,
  useScrollableSetter,
  useBottomSheetInternal,
} from '../../hooks';
import {
  SCROLLABLE_DECELERATION_RATE_MAPPER,
  SCROLLABLE_STATE,
  SCROLLABLE_TYPE,
} from '../../constants';
import { styles } from './styles';

export function createBottomSheetScrollableComponent<T, P>(
  type: SCROLLABLE_TYPE,
  ScrollableComponent: any
) {
  return forwardRef<T, P>((props, ref) => {
    // props
    const {
      // hooks
      focusHook,
      scrollEventsHandlersHook,
      // props
      overScrollMode = 'never',
      keyboardDismissMode = 'interactive',
      style,
      refreshing,
      onRefresh,
      progressViewOffset,
      refreshControl,
      ...rest
    }: any = props;

    //#region refs
    const nativeGestureRef = useRef<NativeViewGestureHandler>(null);
    const refreshControlGestureRef = useRef<NativeViewGestureHandler>(null);
    //#endregion

    //#region hooks
    const { scrollableRef, scrollableContentOffsetY, scrollHandler } =
      useScrollHandler(scrollEventsHandlersHook);
    const {
      enableContentPanningGesture,
      animatedFooterHeight,
      animatedScrollableState,
    } = useBottomSheetInternal();
    //#endregion

    //#region variables
    const scrollableAnimatedProps = useAnimatedProps(() => ({
      decelerationRate:
        SCROLLABLE_DECELERATION_RATE_MAPPER[animatedScrollableState.value],
      showsVerticalScrollIndicator:
        animatedScrollableState.value === SCROLLABLE_STATE.UNLOCKED,
    }));
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
    useScrollableSetter(
      scrollableRef,
      type,
      scrollableContentOffsetY,
      onRefresh !== undefined,
      focusHook
    );
    //#endregion

    //#region render
    if (Platform.OS === 'android') {
      const scrollableContent = (
        <NativeViewGestureHandler
          ref={nativeGestureRef}
          enabled={enableContentPanningGesture}
          shouldCancelWhenOutside={false}
        >
          <ScrollableComponent
            // @ts-ignore
            ref={scrollableRef}
            overScrollMode={overScrollMode}
            keyboardDismissMode={keyboardDismissMode}
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            animatedProps={scrollableAnimatedProps}
            style={containerStyle}
            {...rest}
          />
        </NativeViewGestureHandler>
      );
      return (
        <BottomSheetDraggableView
          nativeGestureRef={nativeGestureRef}
          refreshControlGestureRef={refreshControlGestureRef}
          style={styles.container}
        >
          {onRefresh ? (
            <BottomSheetRefreshControl
              ref={refreshControlGestureRef}
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressViewOffset={progressViewOffset}
              style={styles.container}
            >
              {scrollableContent}
            </BottomSheetRefreshControl>
          ) : (
            scrollableContent
          )}
        </BottomSheetDraggableView>
      );
    }
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
            keyboardDismissMode={keyboardDismissMode}
            scrollEventThrottle={16}
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={progressViewOffset}
            refreshControl={refreshControl}
            onScroll={scrollHandler}
            animatedProps={scrollableAnimatedProps}
            style={containerStyle}
          />
        </NativeViewGestureHandler>
      </BottomSheetDraggableView>
    );
    //#endregion
  });
}
