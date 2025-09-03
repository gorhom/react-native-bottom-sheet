import React, { memo, useContext, useMemo } from 'react';
import { RefreshControl, type RefreshControlProps } from 'react-native';
import {
  Gesture,
  GestureDetector,
  type SimultaneousGesture,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { SCROLLABLE_STATUS } from '../../constants';
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
  const {
    animatedScrollableStatus: animatedScrollableState,
    enableContentPanningGesture,
  } = useBottomSheetInternal();
  //#endregion

  if (!draggableGesture && enableContentPanningGesture) {
    throw "'BottomSheetRefreshControl' cannot be used out of the BottomSheet!";
  }

  //#region variables
  const animatedProps = useAnimatedProps(
    () => ({
      enabled: animatedScrollableState.value === SCROLLABLE_STATUS.UNLOCKED,
    }),
    [animatedScrollableState.value]
  );

  const gesture = useMemo(
    () =>
      draggableGesture
        ? Gesture.Native()
            // @ts-ignore
            .simultaneousWithExternalGesture(
              ...draggableGesture.toGestureArray(),
              ...scrollableGesture.toGestureArray()
            )
            .shouldCancelWhenOutside(true)
        : undefined,
    [draggableGesture, scrollableGesture]
  );

  //#endregion

  // render
  if (gesture) {
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
  return (
    <AnimatedRefreshControl
      {...rest}
      onRefresh={onRefresh}
      animatedProps={animatedProps}
    />
  );
}

const BottomSheetRefreshControl = memo(BottomSheetRefreshControlComponent);
BottomSheetRefreshControl.displayName = 'BottomSheetRefreshControl';

export default BottomSheetRefreshControl;
