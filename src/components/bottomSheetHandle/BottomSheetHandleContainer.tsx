import React, { memo, useCallback, useMemo, useRef } from 'react';
import type { LayoutChangeEvent, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {
  type BoundingClientRect,
  useBottomSheetGestureHandlers,
  useBottomSheetInternal,
  useBoundingClientRect,
} from '../../hooks';
import { print } from '../../utilities';
import { DEFAULT_ENABLE_HANDLE_PANNING_GESTURE } from '../bottomSheet/constants';
import type { BottomSheetHandleContainerProps } from './types';

function BottomSheetHandleContainerComponent({
  animatedIndex,
  animatedPosition,
  simultaneousHandlers: _internalSimultaneousHandlers,
  enableHandlePanningGesture = DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
  handleComponent: HandleComponent,
  handleStyle: _providedHandleStyle,
  handleIndicatorStyle: _providedIndicatorStyle,
}: BottomSheetHandleContainerProps) {
  //#region refs
  const ref = useRef<View>(null);
  //#endregion

  //#region hooks
  const {
    animatedLayoutState,
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
  const simultaneousHandlers = useMemo<unknown[]>(() => {
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
      .enabled(enableHandlePanningGesture)
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
        simultaneousHandlers as never
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
      animatedLayoutState.modify(state => {
        'worklet';
        state.handleHeight = height;
        return state;
      });

      if (__DEV__) {
        print({
          component: 'BottomSheetHandleContainer',
          method: 'handleContainerLayout',
          category: 'layout',
          params: {
            height,
          },
        });
      }
    },
    [animatedLayoutState]
  );
  const handleBoundingClientRect = useCallback(
    ({ height }: BoundingClientRect) => {
      animatedLayoutState.modify(state => {
        'worklet';
        state.handleHeight = height;
        return state;
      });

      if (__DEV__) {
        print({
          component: 'BottomSheetHandleContainer',
          method: 'handleBoundingClientRect',
          category: 'layout',
          params: {
            height,
          },
        });
      }
    },
    [animatedLayoutState]
  );
  //#endregion

  //#region effects
  useBoundingClientRect(ref, handleBoundingClientRect);
  //#endregion

  //#region renders
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        ref={ref}
        onLayout={handleContainerLayout}
        key="BottomSheetHandleContainer"
      >
        <HandleComponent
          animatedIndex={animatedIndex}
          animatedPosition={animatedPosition}
          style={_providedHandleStyle}
          indicatorStyle={_providedIndicatorStyle}
        />
      </Animated.View>
    </GestureDetector>
  );
  //#endregion
}

const BottomSheetHandleContainer = memo(BottomSheetHandleContainerComponent);
BottomSheetHandleContainer.displayName = 'BottomSheetHandleContainer';

export default BottomSheetHandleContainer;
