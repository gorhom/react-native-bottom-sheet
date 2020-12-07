import React, { memo, useCallback, useMemo } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import isEqual from 'lodash.isequal';
import BottomSheetHandle from '../bottomSheetHandle';
import type { BottomSheetHandleContainerProps } from './types';

const BottomSheetHandleContainerComponent = ({
  animatedIndex,
  animatedPosition,
  simultaneousHandlers,
  enableHandlePanningGesture,
  shouldMeasureHeight,
  handleComponent: _providedHandleComponent,
  onGestureEvent,
  onHandlerStateChange,
  onMeasureHeight,
}: BottomSheetHandleContainerProps) => {
  //#region variables
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

  console.log(
    'BottomSheetHandleContainer',
    'render',
    shouldRenderHandle,
    shouldMeasureHeight
  );
  return shouldRenderHandle ? (
    <PanGestureHandler
      simultaneousHandlers={simultaneousHandlers}
      shouldCancelWhenOutside={false}
      enabled={enableHandlePanningGesture}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        onLayout={shouldMeasureHeight ? handleOnLayout : undefined}
      >
        {renderHandle()}
      </Animated.View>
    </PanGestureHandler>
  ) : null;
  //#endregion
};

const BottomSheetHandleContainer = memo(
  BottomSheetHandleContainerComponent,
  isEqual
);

export default BottomSheetHandleContainer;
