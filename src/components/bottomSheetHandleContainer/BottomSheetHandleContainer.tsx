import React, { memo, useCallback, useMemo } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import BottomSheetHandle from '../bottomSheetHandle';
import type { BottomSheetHandleContainerProps } from './types';
import { useBottomSheetInternal } from '../../hooks';

const BottomSheetHandleContainerComponent = ({
  animatedIndex,
  animatedPosition,
  simultaneousHandlers: _internalSimultaneousHandlers,
  enableHandlePanningGesture,
  shouldMeasureHeight,
  handlePanGestureHandler,
  onMeasureHeight,
  handleComponent: _providedHandleComponent,
}: BottomSheetHandleContainerProps) => {
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

  const shouldRenderHandle = useMemo(() => _providedHandleComponent !== null, [
    _providedHandleComponent,
  ]);
  //#endregion

  //#region callbacks
  const handleOnLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      onMeasureHeight(height);
    },
    [onMeasureHeight]
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

  // console.log(
  //   'BottomSheetHandleContainer',
  //   'render',
  //   shouldRenderHandle,
  //   shouldMeasureHeight
  // );
  return shouldRenderHandle ? (
    <PanGestureHandler
      enabled={enableHandlePanningGesture}
      waitFor={waitFor}
      simultaneousHandlers={simultaneousHandlers}
      shouldCancelWhenOutside={false}
      onGestureEvent={handlePanGestureHandler}
      activeOffsetX={activeOffsetX}
      activeOffsetY={activeOffsetY}
      failOffsetX={failOffsetX}
      failOffsetY={failOffsetY}
    >
      <Animated.View
        accessible={true}
        accessibilityRole="adjustable"
        accessibilityLabel="Bottom Sheet handle"
        accessibilityHint="Drag up or down to extend or minimize the Bottom Sheet"
        onLayout={shouldMeasureHeight ? handleOnLayout : undefined}
      >
        {renderHandle()}
      </Animated.View>
    </PanGestureHandler>
  ) : null;
  //#endregion
};

const BottomSheetHandleContainer = memo(BottomSheetHandleContainerComponent);
BottomSheetHandleContainer.displayName = 'BottomSheetHandleContainer';

export default BottomSheetHandleContainer;
