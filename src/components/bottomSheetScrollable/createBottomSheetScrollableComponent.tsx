import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Platform } from 'react-native';
import { useAnimatedStyle } from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import BottomSheetRefreshControl from '../bottomSheetRefreshControl';
import { useScrollableInternal, useBottomSheetInternal } from '../../hooks';
import { SCROLLABLE_TYPE } from '../../constants';
import { styles } from './styles';

export function createBottomSheetScrollableComponent<T, P>(
  type: SCROLLABLE_TYPE,
  ScrollableComponent: any
) {
  return forwardRef<T, P>((props, ref) => {
    // props
    const {
      focusHook: useFocusHook = useEffect,
      overScrollMode = 'never',
      keyboardDismissMode = 'interactive',
      style,
      // refresh control
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
    const {
      scrollableRef,
      scrollableAnimatedProps,
      handleScrollEvent,
      handleSettingScrollable,
    } = useScrollableInternal(type, onRefresh !== undefined);
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

    //#region render
    if (Platform.OS === 'android') {
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
                  onScroll={handleScrollEvent}
                  animatedProps={scrollableAnimatedProps}
                  style={containerStyle}
                />
              </NativeViewGestureHandler>
            </BottomSheetRefreshControl>
          ) : (
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
                onScroll={handleScrollEvent}
                animatedProps={scrollableAnimatedProps}
                style={containerStyle}
              />
            </NativeViewGestureHandler>
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
            onScroll={handleScrollEvent}
            animatedProps={scrollableAnimatedProps}
            style={containerStyle}
          />
        </NativeViewGestureHandler>
      </BottomSheetDraggableView>
    );
    //#endregion
  });
}
