import React, { memo, useCallback, useMemo } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import BottomSheetHandle from '../bottomSheetHandle';
import { useBottomSheetInternal } from '../../hooks';
import { print } from '../../utilities';
import type { BottomSheetHandleContainerProps } from './types';
import { INITIAL_HANDLE_HEIGHT } from '../bottomSheet/constants';

function BottomSheetHandleContainerComponent({
  animatedIndex,
  animatedPosition,
  simultaneousHandlers: _internalSimultaneousHandlers,
  enableHandlePanningGesture,
  handlePanGestureHandler,
  handleHeight,
  handleComponent: _providedHandleComponent,
}: BottomSheetHandleContainerProps) {
  //#region variables
  const {
    activeOffsetX,
    activeOffsetY,
    failOffsetX,
    failOffsetY,
    waitFor,
    simultaneousHandlers: _providedSimultaneousHandlers,
  } = useBottomSheetInternal();

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
  //#endregion

  //#region callbacks
  const getHandleContainerLayout = useMemo(
    () =>
      handleHeight.value === INITIAL_HANDLE_HEIGHT
        ? function handleContainerLayout({
            nativeEvent: {
              layout: { height },
            },
          }: LayoutChangeEvent) {
            if (height === handleHeight.value) {
              return;
            }
            handleHeight.value = height;

            print({
              component: BottomSheetHandleContainer.displayName,
              method: 'handleContainerLayout',
              params: {
                height,
              },
            });
          }
        : undefined,
    [handleHeight]
  );
  //#endregion

  //#region renders
  const renderHandle = useCallback(() => {
    if (_providedHandleComponent === null) {
      return null;
    }
    const HandleComponent =
      _providedHandleComponent === undefined
        ? BottomSheetHandle
        : _providedHandleComponent;

    return (
      <HandleComponent
        animatedIndex={animatedIndex}
        animatedPosition={animatedPosition}
      />
    );
  }, [animatedIndex, animatedPosition, _providedHandleComponent]);

  const shouldRenderHandle = _providedHandleComponent !== null;
  return shouldRenderHandle ? (
    <PanGestureHandler
      enabled={enableHandlePanningGesture}
      waitFor={waitFor}
      simultaneousHandlers={simultaneousHandlers}
      shouldCancelWhenOutside={false}
      activeOffsetX={activeOffsetX}
      activeOffsetY={activeOffsetY}
      failOffsetX={failOffsetX}
      failOffsetY={failOffsetY}
      onGestureEvent={handlePanGestureHandler}
    >
      <Animated.View
        accessible={true}
        accessibilityRole="adjustable"
        accessibilityLabel="Bottom Sheet handle"
        accessibilityHint="Drag up or down to extend or minimize the Bottom Sheet"
        onLayout={getHandleContainerLayout}
      >
        {renderHandle()}
      </Animated.View>
    </PanGestureHandler>
  ) : null;
  //#endregion
}

const BottomSheetHandleContainer = memo(BottomSheetHandleContainerComponent);
BottomSheetHandleContainer.displayName = 'BottomSheetHandleContainer';

export default BottomSheetHandleContainer;
