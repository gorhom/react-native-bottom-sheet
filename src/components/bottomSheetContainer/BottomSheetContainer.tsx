import React, { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import {
  measure,
  runOnJS,
  runOnUI,
  useAnimatedRef,
  useWorkletCallback,
} from 'react-native-reanimated';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants';
import { print } from '../../utilities';
import { styles } from './styles';
import type { BottomSheetContainerProps } from './types';

function BottomSheetContainerComponent({
  containerHeight,
  containerOffset,
  topInset = 0,
  bottomInset = 0,
  shouldCalculateHeight = true,
  children,
}: BottomSheetContainerProps) {
  //#region ref
  const containerRef = useAnimatedRef<View>();
  //#endregion

  //#region styles
  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        top: topInset,
        bottom: bottomInset,
      },
    ],
    [topInset, bottomInset]
  );
  //#endregion

  //#region callbacks
  const measureLayout = useWorkletCallback(() => {
    'worklet';
    const { height, width, pageX, pageY } = measure(containerRef);

    containerHeight.value = height;
    containerOffset.value = {
      top: pageY,
      left: pageX,
      right: WINDOW_WIDTH - (width + pageX),
      bottom: WINDOW_HEIGHT - (height + pageY),
    };

    runOnJS(print)({
      component: BottomSheetContainer.displayName,
      method: 'handleContainerLayout',
      params: {
        height,
        top: pageY,
        left: pageX,
        right: WINDOW_WIDTH - (width + pageX),
        bottom: WINDOW_HEIGHT - (height + pageY),
      },
    });
  });
  const handleContainerLayout = useCallback(
    function handleContainerLayout() {
      runOnUI(measureLayout)();
    },
    [measureLayout]
  );
  //#endregion

  //#region render
  return (
    <View
      ref={containerRef}
      pointerEvents="box-none"
      onLayout={shouldCalculateHeight ? handleContainerLayout : undefined}
      style={containerStyle}
      children={children}
    />
  );
  //#endregion
}

const BottomSheetContainer = memo(BottomSheetContainerComponent);
BottomSheetContainer.displayName = 'BottomSheetContainer';

export default BottomSheetContainer;
