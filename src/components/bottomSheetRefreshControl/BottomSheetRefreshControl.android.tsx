import React, { memo, useContext, useMemo } from 'react';
import { RefreshControl, type RefreshControlProps } from 'react-native';
import {
  Gesture,
  GestureDetector,
  type SimultaneousGesture,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { SCROLLABLE_STATE } from '../../constants';
import { BottomSheetDraggableContext } from '../../contexts/gesture';
import { useBottomSheetInternal } from '../../hooks';

const AnimatedRefreshControl = Animated.createAnimatedComponent(RefreshControl);

interface BottomSheetRefreshControlProps extends RefreshControlProps {
  scrollableGesture: SimultaneousGesture;
}

function BottomSheetRefreshControlComponent({
  onRefresh,
  scrollableGesture,
  ...rest
}: BottomSheetRefreshControlProps) {
  //#region hooks
  const draggableGesture = useContext(BottomSheetDraggableContext);
  const { animatedScrollableState } = useBottomSheetInternal();
  //#endregion

  if (!draggableGesture) {
    throw "'BottomSheetRefreshControl' cannot be used out of the BottomSheet!";
  }

  //#region variables
  const animatedProps = useAnimatedProps(
    () => ({
      enabled: animatedScrollableState.value === SCROLLABLE_STATE.UNLOCKED,
    }),
    [animatedScrollableState.value]
  );

  const gesture = useMemo(() => {
    return Gesture.Simultaneous(
      Gesture.Native().shouldCancelWhenOutside(false),
      scrollableGesture,
      draggableGesture
    );
  }, [draggableGesture, scrollableGesture]);
  //#endregion

  // render
  return (
    <GestureDetector gesture={gesture}>
      <AnimatedRefreshControl
        {...rest}
        onRefresh={onRefresh}
        animatedProps={animatedProps}
      />
    </GestureDetector>
  );
}

const BottomSheetRefreshControl = memo(BottomSheetRefreshControlComponent);
BottomSheetRefreshControl.displayName = 'BottomSheetRefreshControl';

export default BottomSheetRefreshControl;
