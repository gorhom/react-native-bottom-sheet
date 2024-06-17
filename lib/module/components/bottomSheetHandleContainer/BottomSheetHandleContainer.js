import React, { memo, useCallback, useMemo } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import BottomSheetHandle from '../bottomSheetHandle';
import { useBottomSheetGestureHandlers, useBottomSheetInternal } from '../../hooks';
import { print } from '../../utilities';

function BottomSheetHandleContainerComponent({
  animatedIndex,
  animatedPosition,
  simultaneousHandlers: _internalSimultaneousHandlers,
  enableHandlePanningGesture,
  handleHeight,
  handleComponent: _providedHandleComponent,
  handleStyle: _providedHandleStyle,
  handleIndicatorStyle: _providedIndicatorStyle
}) {
  //#region hooks
  const {
    activeOffsetX,
    activeOffsetY,
    failOffsetX,
    failOffsetY,
    waitFor,
    simultaneousHandlers: _providedSimultaneousHandlers
  } = useBottomSheetInternal();
  const {
    handlePanGestureHandler
  } = useBottomSheetGestureHandlers(); //#endregion
  //#region variables

  const simultaneousHandlers = useMemo(() => {
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
  }, [_providedSimultaneousHandlers, _internalSimultaneousHandlers]); //#endregion
  //#region callbacks

  const handleContainerLayout = useCallback(function handleContainerLayout({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) {
    handleHeight.value = height;
    print({
      component: BottomSheetHandleContainer.displayName,
      method: 'handleContainerLayout',
      params: {
        height
      }
    });
  }, [handleHeight]); //#endregion
  //#region renders

  const HandleComponent = _providedHandleComponent === undefined ? BottomSheetHandle : _providedHandleComponent;
  return HandleComponent !== null ? /*#__PURE__*/React.createElement(PanGestureHandler, {
    enabled: enableHandlePanningGesture,
    waitFor: waitFor,
    simultaneousHandlers: simultaneousHandlers,
    shouldCancelWhenOutside: false,
    activeOffsetX: activeOffsetX,
    activeOffsetY: activeOffsetY,
    failOffsetX: failOffsetX,
    failOffsetY: failOffsetY,
    onGestureEvent: handlePanGestureHandler
  }, /*#__PURE__*/React.createElement(Animated.View, {
    key: "BottomSheetHandleContainer",
    onLayout: handleContainerLayout
  }, /*#__PURE__*/React.createElement(HandleComponent, {
    animatedIndex: animatedIndex,
    animatedPosition: animatedPosition,
    style: _providedHandleStyle,
    indicatorStyle: _providedIndicatorStyle
  }))) : null; //#endregion
}

const BottomSheetHandleContainer = /*#__PURE__*/memo(BottomSheetHandleContainerComponent);
BottomSheetHandleContainer.displayName = 'BottomSheetHandleContainer';
export default BottomSheetHandleContainer;
//# sourceMappingURL=BottomSheetHandleContainer.js.map