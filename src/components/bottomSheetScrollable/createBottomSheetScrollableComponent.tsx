import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedProps } from 'react-native-reanimated';
import {
  SCROLLABLE_DECELERATION_RATE_MAPPER,
  SCROLLABLE_STATUS,
  type SCROLLABLE_TYPE,
} from '../../constants';
import {
  BottomSheetDraggableContext,
  NativeScrollGestureContext,
} from '../../contexts/gesture';
import {
  useBottomSheetContentContainerStyle,
  useBottomSheetInternal,
  useScrollableSetter,
  useScrollHandler,
  useStableCallback,
} from '../../hooks';
import { ScrollableContainer } from './ScrollableContainer';
import { useBottomSheetContentSizeSetter } from './useBottomSheetContentSizeSetter';

export function createBottomSheetScrollableComponent<T, P>(
  type: SCROLLABLE_TYPE,
  // biome-ignore lint: to be addressed!
  ScrollableComponent: any
) {
  return forwardRef<T, P>((props, ref) => {
    //#region props
    const {
      // hooks
      focusHook,
      scrollEventsHandlersHook,
      // props
      enableFooterMarginAdjustment = false,
      overScrollMode = 'never',
      keyboardDismissMode = 'interactive',
      showsVerticalScrollIndicator = true,
      contentContainerStyle: _providedContentContainerStyle,
      refreshing,
      onRefresh,
      progressViewOffset,
      refreshControl,
      // events
      onScroll,
      onScrollBeginDrag,
      onScrollEndDrag,
      onContentSizeChange,
      ...rest
      // biome-ignore lint: to be addressed!
    }: any = props;
    //#endregion

    //#region hooks
    const draggableGesture = useContext(BottomSheetDraggableContext);
    /**
     * Registers our native scroll gesture with the outer `BottomSheetDraggableView`,
     * which adds it to its `simultaneousWithExternalGesture` array on the pan.
     * This makes the simultaneousness bidirectional — required for RNGH on
     * Android to coordinate the pan and the native scroll without one
     * canceling the other.
     */
    const nativeScrollGestureCtx = useContext(NativeScrollGestureContext);
    const { scrollableRef, scrollableContentOffsetY, scrollHandler } =
      useScrollHandler(
        scrollEventsHandlersHook,
        onScroll,
        onScrollBeginDrag,
        onScrollEndDrag
      );
    const {
      animatedScrollableStatus: animatedScrollableState,
      enableContentPanningGesture,
    } = useBottomSheetInternal();
    const { setContentSize } = useBottomSheetContentSizeSetter();
    //#endregion

    if (!draggableGesture && enableContentPanningGesture) {
      throw "'Scrollable' cannot be used out of the BottomSheet!";
    }

    //#region variables
    const scrollableAnimatedProps = useAnimatedProps(
      () => ({
        decelerationRate:
          SCROLLABLE_DECELERATION_RATE_MAPPER[animatedScrollableState.value],
        showsVerticalScrollIndicator: showsVerticalScrollIndicator
          ? animatedScrollableState.value === SCROLLABLE_STATUS.UNLOCKED
          : showsVerticalScrollIndicator,
      }),
      [animatedScrollableState, showsVerticalScrollIndicator]
    );

    const scrollableGesture = useMemo(
      () =>
        draggableGesture
          ? Gesture.Native()
              // @ts-expect-error
              .simultaneousWithExternalGesture(draggableGesture)
              .shouldCancelWhenOutside(false)
          : undefined,
      [draggableGesture]
    );

    /**
     * Register this scrollable's native gesture with the outer
     * `BottomSheetDraggableView` so it can add the gesture to its pan's
     * `simultaneousWithExternalGesture` array, completing the bidirectional
     * simultaneousness declaration. This triggers a re-render of the parent
     * `BottomSheet` (state update), which recomputes the pan's `useMemo` and
     * re-attaches its `GestureDetector` with the relation now in place. A
     * ref-based approach would not work here because RNGH resolves the
     * gesture object eagerly and would see `null` at registration time;
     * subsequent ref mutations are not picked up.
     *
     * No cleanup on deps change: nulling the registration would re-render
     * the pan without the scroll in `simultaneousHandlers`, which feeds a
     * different `draggableGesture` back through context and rebuilds
     * `scrollableGesture`, which re-fires this effect — an infinite loop.
     * The parent setter is idempotent (first non-null registration wins),
     * so subsequent calls during the same component lifetime are no-ops.
     * Unmount cleanup is handled separately below.
     */
    useEffect(() => {
      if (!nativeScrollGestureCtx || !scrollableGesture) {
        return;
      }
      nativeScrollGestureCtx.setNativeScrollGesture(scrollableGesture);
    }, [scrollableGesture, nativeScrollGestureCtx]);

    /**
     * Unmount-only cleanup. Captures the latest context in a ref so the
     * cleanup callback always nulls the current registration when the
     * scrollable fully unmounts (e.g. when the bottom sheet closes).
     */
    const nativeScrollGestureCtxRef = useRef(nativeScrollGestureCtx);
    nativeScrollGestureCtxRef.current = nativeScrollGestureCtx;
    useEffect(() => {
      return () => {
        nativeScrollGestureCtxRef.current?.setNativeScrollGesture(null);
      };
    }, []);
    //#endregion

    //#region callbacks
    const handleContentSizeChange = useStableCallback(
      (contentWidth: number, contentHeight: number) => {
        setContentSize(contentHeight);
        if (onContentSizeChange) {
          onContentSizeChange(contentWidth, contentHeight);
        }
      }
    );
    //#endregion

    //#region styles
    const contentContainerStyle = useBottomSheetContentContainerStyle(
      enableFooterMarginAdjustment,
      _providedContentContainerStyle
    );
    //#endregion

    //#region effects
    // @ts-expect-error
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
    return (
      <ScrollableContainer
        ref={scrollableRef}
        nativeGesture={scrollableGesture}
        animatedProps={scrollableAnimatedProps}
        overScrollMode={overScrollMode}
        keyboardDismissMode={keyboardDismissMode}
        refreshing={refreshing}
        scrollEventThrottle={16}
        progressViewOffset={progressViewOffset}
        contentContainerStyle={contentContainerStyle}
        onRefresh={onRefresh}
        onScroll={scrollHandler}
        onContentSizeChange={handleContentSizeChange}
        setContentSize={setContentSize}
        ScrollableComponent={ScrollableComponent}
        refreshControl={refreshControl}
        {...rest}
      />
    );
    //#endregion
  });
}
