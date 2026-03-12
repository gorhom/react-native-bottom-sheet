import React, { memo, useCallback, useMemo, useRef } from 'react';
import {
  Dimensions,
  Keyboard,
  type LayoutChangeEvent,
  StatusBar,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import {
  KEYBOARD_BEHAVIOR,
  WINDOW_HEIGHT,
} from '../../constants';
import { styles } from './styles';
import type { BottomSheetHostingContainerProps } from './types';

function BottomSheetHostingContainerComponent({
  containerLayoutState,
  layoutState,
  topInset = 0,
  bottomInset = 0,
  keyboardBehavior,
  shouldCalculateHeight = true,
  detached,
  style,
  children,
}: BottomSheetHostingContainerProps) {
  //#region refs
  const containerRef = useRef<View>(null);
  const initialWindow = Dimensions.get('window');
  const initialScreen = Dimensions.get('screen');
  const lastAcceptedDimensionsRef = useRef<{
    windowWidth: number;
    windowHeight: number;
    screenWidth: number;
    screenHeight: number;
  }>({
    windowWidth: initialWindow.width,
    windowHeight: initialWindow.height,
    screenWidth: initialScreen.width,
    screenHeight: initialScreen.height,
  });
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
  const shouldIgnoreKeyboardDrivenLayoutChange = useCallback(() => {
    // Only suppress those transient layout updates for the explicit
    // "keyboard should not move the sheet" configuration.
    if (keyboardBehavior !== KEYBOARD_BEHAVIOR.none) {
      return false;
    }

    if (!Keyboard.isVisible()) {
      return false;
    }

    const window = Dimensions.get('window');
    const screen = Dimensions.get('screen');
    const previous = lastAcceptedDimensionsRef.current;

    // If both window and screen metrics are unchanged, treat this as keyboard
    // layout churn rather than a real resize such as rotation.
    return (
      window.width === previous.windowWidth &&
      window.height === previous.windowHeight &&
      screen.width === previous.screenWidth &&
      screen.height === previous.screenHeight
    );
  }, [keyboardBehavior]);

  const handleLayoutEvent = useCallback(
    function handleLayoutEvent({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) {
      const window = Dimensions.get('window');
      const screen = Dimensions.get('screen');
      const ignoredKeyboardLayoutChange =
        shouldIgnoreKeyboardDrivenLayoutChange();

      if (ignoredKeyboardLayoutChange) {
        return;
      }

      lastAcceptedDimensionsRef.current = {
        windowWidth: window.width,
        windowHeight: window.height,
        screenWidth: screen.width,
        screenHeight: screen.height,
      };

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
    },
    [
      containerLayoutState,
      layoutState,
      shouldIgnoreKeyboardDrivenLayoutChange,
    ]
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
