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
import type { BottomSheetContainerProps } from './types';

function BottomSheetContainerComponent({
  containerHeight,
  containerOffset,
  topInset = 0,
  bottomInset = 0,
  shouldCalculateHeight = true,
  detached,
  style,
  children,
}: BottomSheetContainerProps) {
  const containerRef = useRef<View>(null);
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
  const handleContainerLayout = useCallback(
    function handleContainerLayout({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) {
      containerHeight.value = height;

      containerRef.current?.measure(
        (_x, _y, _width, _height, _pageX, pageY) => {
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
        }
      );

      print({
        component: BottomSheetContainer.displayName,
        method: 'handleContainerLayout',
        category: 'layout',
        params: {
          height,
        },
      });
    },
    [containerHeight, containerOffset]
  );
  //#endregion

  //#region render
  return (
    <View
      ref={containerRef}
      pointerEvents="box-none"
      onLayout={shouldCalculateHeight ? handleContainerLayout : undefined}
      style={containerStyle}
    >
      {children}
    </View>
  );
  //#endregion
}

const BottomSheetContainer = memo(BottomSheetContainerComponent);
BottomSheetContainer.displayName = 'BottomSheetContainer';

export default BottomSheetContainer;
