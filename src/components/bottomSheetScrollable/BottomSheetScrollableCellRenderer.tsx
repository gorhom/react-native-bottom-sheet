import React, { memo } from 'react';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { ANIMATION_STATE } from '../../constants';
import { useBottomSheetInternal } from '../../hooks';

const BottomSheetScrollableCellRendererComponent = (props: any) => {
  const { animatedAnimationState } = useBottomSheetInternal();
  const containerAnimatedProps = useAnimatedProps(() => ({
    pointerEvents:
      animatedAnimationState.value === ANIMATION_STATE.RUNNING
        ? 'none'
        : 'auto',
  }));

  return <Animated.View animatedProps={containerAnimatedProps} {...props} />;
};

export const BottomSheetScrollableCellRenderer = memo(
  BottomSheetScrollableCellRendererComponent
);
