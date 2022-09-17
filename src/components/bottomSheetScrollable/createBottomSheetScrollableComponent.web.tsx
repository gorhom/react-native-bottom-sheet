import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
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
      enableFooterMarginAdjustment = false,
      overScrollMode = 'never',
      keyboardDismissMode = 'interactive',
      showsVerticalScrollIndicator = true,
      style,
      progressViewOffset,
      ...rest
    }: any = props;

    //#region hooks
    const { scrollableRef, scrollableContentOffsetY } = useScrollHandler(
      scrollEventsHandlersHook
    );
    const { animatedFooterHeight, animatedScrollableState } =
      useBottomSheetInternal();
    //#endregion

    //#region variables
    const scrollableAnimatedProps = useAnimatedProps(
      () => ({
        decelerationRate:
          SCROLLABLE_DECELERATION_RATE_MAPPER[animatedScrollableState.value],
        showsVerticalScrollIndicator: showsVerticalScrollIndicator
          ? animatedScrollableState.value === SCROLLABLE_STATE.UNLOCKED
          : showsVerticalScrollIndicator,
      }),
      [showsVerticalScrollIndicator]
    );
    //#endregion

    //#region styles
    const containerAnimatedStyle = useAnimatedStyle(
      () => ({
        marginBottom: enableFooterMarginAdjustment
          ? animatedFooterHeight.value
          : 0,
      }),
      [enableFooterMarginAdjustment]
    );
    const containerStyle = useMemo(() => {
      return enableFooterMarginAdjustment
        ? [
            ...(style ? ('length' in style ? style : [style]) : []),
            containerAnimatedStyle,
          ]
        : style;
    }, [enableFooterMarginAdjustment, style, containerAnimatedStyle]);
    //#endregion

    //#region effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollableRef.current);
    useScrollableSetter(
      scrollableRef,
      type,
      scrollableContentOffsetY,
      false,
      focusHook
    );
    //#endregion

    //#region render
    return (
      <ScrollableComponent
        animatedProps={scrollableAnimatedProps}
        {...rest}
        scrollEventThrottle={1}
        ref={scrollableRef}
        overScrollMode={overScrollMode}
        keyboardDismissMode={keyboardDismissMode}
        progressViewOffset={progressViewOffset}
        style={containerStyle}
      />
    );
    //#endregion
  });
}
