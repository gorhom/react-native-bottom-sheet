import React, { useMemo, useRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import Animated, {
  event,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetDraggableViewProps } from './types';
import { styles } from './styles';

const BottomSheetDraggableViewComponent = ({
  children,
  style,
  nativeGestureRef,
  ...rest
}: BottomSheetDraggableViewProps) => {
  // refs
  const panGestureRef = useRef<PanGestureHandler>(null);

  // hooks
  const {
    rootTapGestureRef,
    contentPanGestureHandler
  } = useBottomSheetInternal();

  // variables
  const simultaneousHandlers = useMemo(
    () =>
      nativeGestureRef
        ? [rootTapGestureRef, nativeGestureRef]
        : rootTapGestureRef,
    [rootTapGestureRef, nativeGestureRef]
  );

  // styles
  const containerStyle = useMemo(
    () => (style ? [styles.container, style] : styles.container),
    [style]
  );

  // effects

  return (
    <PanGestureHandler
      ref={panGestureRef}
      simultaneousHandlers={simultaneousHandlers}
      shouldCancelWhenOutside={false}
      onGestureEvent={contentPanGestureHandler}
    >
      <Animated.View style={containerStyle} {...rest}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

const BottomSheetDraggableView = memo(
  BottomSheetDraggableViewComponent,
  isEqual
);

export default BottomSheetDraggableView;
