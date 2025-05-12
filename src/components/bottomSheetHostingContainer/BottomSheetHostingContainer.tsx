import React, { memo, useMemo, useRef } from 'react';
import {
  type LayoutChangeEvent,
  StatusBar,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import { WINDOW_HEIGHT } from '../../constants';
import { useStableCallback } from '../../hooks';
import { print } from '../../utilities';
import { styles } from './styles';
import type { BottomSheetHostingContainerProps } from './types';

function BottomSheetHostingContainerComponent({
  containerHeight,
  containerOffset,
  topInset = 0,
  bottomInset = 0,
  shouldCalculateHeight = true,
  detached,
  style,
  children,
}: BottomSheetHostingContainerProps) {
  //#region refs
  const containerRef = useRef<View>(null);
  //#endregion

  //#region styles
  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      style,
      styles.container,
      {
        top: topInset,
        bottom: bottomInset,
        overflow: detached ? 'visible' : 'hidden',
      },
    ],
    [style, detached, topInset, bottomInset]
  );
  //#endregion

  //#region callbacks
  const handleLayoutEvent = useStableCallback(function handleLayoutEvent({
    nativeEvent: {
      layout: { height },
    },
  }: LayoutChangeEvent) {
    containerHeight.value = height;
    containerRef.current?.measure((_x, _y, _width, _height, _pageX, pageY) => {
      if (!containerOffset.value) {
        return;
      }
      containerOffset.value = {
        top: pageY ?? 0,
        left: 0,
        right: 0,
        bottom: Math.max(
          0,
          WINDOW_HEIGHT -
            ((pageY ?? 0) + height + (StatusBar.currentHeight ?? 0))
        ),
      };
    });

    if (__DEV__) {
      print({
        component: 'BottomSheetHostingContainer',
        method: 'handleLayoutEvent',
        category: 'layout',
        params: {
          height,
          top: containerOffset.value?.top,
          left: containerOffset.value?.left,
          right: containerOffset.value?.right,
          bottom: containerOffset.value?.bottom,
          WINDOW_HEIGHT,
        },
      });
    }
  });
  //#endregion

  //#region render
  return (
    <View
      ref={containerRef}
      pointerEvents="box-none"
      onLayout={shouldCalculateHeight ? handleLayoutEvent : undefined}
      style={containerStyle}
      collapsable={true}
    >
      {children}
    </View>
  );
  //#endregion
}

export const BottomSheetHostingContainer = memo(
  BottomSheetHostingContainerComponent
);
BottomSheetHostingContainer.displayName = 'BottomSheetHostingContainer';
