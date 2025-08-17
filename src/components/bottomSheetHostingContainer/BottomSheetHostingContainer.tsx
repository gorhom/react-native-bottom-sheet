import React, { memo, useCallback, useMemo, useRef } from 'react';
import {
  type LayoutChangeEvent,
  StatusBar,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import { WINDOW_HEIGHT } from '../../constants';
import { print } from '../../utilities';
import { styles } from './styles';
import type { BottomSheetHostingContainerProps } from './types';

function BottomSheetHostingContainerComponent({
  containerLayoutState,
  layoutState,
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
  const handleLayoutEvent = useCallback(
    function handleLayoutEvent({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) {
      if (containerLayoutState) {
        containerLayoutState.modify(state => {
          'worklet';
          state.height = height;
          return state;
        });
      }

      if (layoutState) {
        layoutState.modify(state => {
          'worklet';
          state.rawContainerHeight = height;
          return state;
        });
      }

      containerRef.current?.measure(
        (_x, _y, _width, _height, _pageX, pageY) => {
          const offset = {
            bottom: Math.max(
              0,
              WINDOW_HEIGHT -
                ((pageY ?? 0) + height + (StatusBar.currentHeight ?? 0))
            ),
            top: pageY ?? 0,
            left: 0,
            right: 0,
          };

          if (containerLayoutState) {
            containerLayoutState.modify(state => {
              'worklet';
              state.offset = offset;
              return state;
            });
          }

          if (layoutState) {
            layoutState.modify(state => {
              'worklet';
              state.containerOffset = offset;
              return state;
            });
          }
        }
      );

      if (__DEV__) {
        print({
          component: 'BottomSheetHostingContainer',
          method: 'handleLayoutEvent',
          category: 'layout',
          params: {
            height,
          },
        });
      }
    },
    [layoutState, containerLayoutState]
  );
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
