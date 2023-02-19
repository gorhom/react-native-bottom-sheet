import React, { memo, useCallback, useMemo } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import BottomSheetHandle from '../bottomSheetHandle';
import {
  useBottomSheetGestureHandlers,
  useBottomSheetInternal,
} from '../../hooks';
import { print } from '../../utilities';
import { styles } from './styles';
import type { BottomSheetHandleContainerProps } from './types';

function BottomSheetHandleContainerComponent({
  animatedIndex,
  animatedPosition,
  simultaneousHandlers: _internalSimultaneousHandlers,
  enableHandlePanningGesture,
  handleHeight,
  handleComponent: _providedHandleComponent,
  handleStyle: _providedHandleStyle,
  handleIndicatorStyle: _providedIndicatorStyle,
}: BottomSheetHandleContainerProps) {
  //#region hooks
  const {
    activeOffsetX,
    activeOffsetY,
    failOffsetX,
    failOffsetY,
    waitFor,
    simultaneousHandlers: _providedSimultaneousHandlers,
  } = useBottomSheetInternal();
  const { handlePanGestureHandler } = useBottomSheetGestureHandlers();
  //#endregion

  //#region variables
  const simultaneousHandlers = useMemo<any>(() => {
    const refs = [];

    if (_internalSimultaneousHandlers) {
      refs.push(_internalSimultaneousHandlers);
    }

    if (_providedSimultaneousHandlers) {
      if (Array.isArray(_providedSimultaneousHandlers)) {
        refs.push(..._providedSimultaneousHandlers);
      } else {
        refs.push(_providedSimultaneousHandlers);
      }
    }

    return refs;
  }, [_providedSimultaneousHandlers, _internalSimultaneousHandlers]);

  const panGesture = useMemo(() => {
    let gesture = Gesture.Pan()
      .enabled(enableHandlePanningGesture!)
      .shouldCancelWhenOutside(false)
      .runOnJS(false)
      .onStart(handlePanGestureHandler.handleOnStart)
      .onChange(handlePanGestureHandler.handleOnChange)
      .onEnd(handlePanGestureHandler.handleOnEnd)
      .onFinalize(handlePanGestureHandler.handleOnFinalize);

    if (waitFor) {
      gesture = gesture.requireExternalGestureToFail(waitFor);
    }

    if (simultaneousHandlers) {
      gesture = gesture.simultaneousWithExternalGesture(
        simultaneousHandlers as any
      );
    }

    if (activeOffsetX) {
      gesture = gesture.activeOffsetX(activeOffsetX);
    }

    if (activeOffsetY) {
      gesture = gesture.activeOffsetY(activeOffsetY);
    }

    if (failOffsetX) {
      gesture = gesture.failOffsetX(failOffsetX);
    }

    if (failOffsetY) {
      gesture = gesture.failOffsetY(failOffsetY);
    }

    return gesture;
  }, [
    activeOffsetX,
    activeOffsetY,
    enableHandlePanningGesture,
    failOffsetX,
    failOffsetY,
    simultaneousHandlers,
    waitFor,
    handlePanGestureHandler.handleOnChange,
    handlePanGestureHandler.handleOnEnd,
    handlePanGestureHandler.handleOnFinalize,
    handlePanGestureHandler.handleOnStart,
  ]);
  //#endregion

  //#region callbacks
  const handleContainerLayout = useCallback(
    function handleContainerLayout({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) {
      handleHeight.value = height;

      print({
        component: BottomSheetHandleContainer.displayName,
        method: 'handleContainerLayout',
        params: {
          height,
        },
      });
    },
    [handleHeight]
  );
  //#endregion

  //#region renders
  const HandleComponent =
    _providedHandleComponent === undefined
      ? BottomSheetHandle
      : _providedHandleComponent;
  return HandleComponent !== null ? (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        key="BottomSheetHandleContainer"
        accessible={true}
        accessibilityRole="adjustable"
        accessibilityLabel="Bottom Sheet handle"
        accessibilityHint="Drag up or down to extend or minimize the Bottom Sheet"
        style={styles.container}
        onLayout={handleContainerLayout}
      >
        <HandleComponent
          animatedIndex={animatedIndex}
          animatedPosition={animatedPosition}
          style={_providedHandleStyle}
          indicatorStyle={_providedIndicatorStyle}
        />
      </Animated.View>
    </GestureDetector>
  ) : null;
  //#endregion
}

const BottomSheetHandleContainer = memo(BottomSheetHandleContainerComponent);
BottomSheetHandleContainer.displayName = 'BottomSheetHandleContainer';

export default BottomSheetHandleContainer;
