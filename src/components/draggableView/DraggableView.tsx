import React, { useMemo, useRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import Animated, { event } from 'react-native-reanimated';
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
    contentPanGestureState,
    contentPanGestureTranslationY,
    contentPanGestureVelocityY,
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

  // callbacks
  const handleGestureEvent = useMemo(
    () =>
      event([
        {
          nativeEvent: {
            state: contentPanGestureState,
            translationY: contentPanGestureTranslationY,
            velocityY: contentPanGestureVelocityY,
          },
        },
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // effects

  return (
    <PanGestureHandler
      ref={panGestureRef}
      simultaneousHandlers={simultaneousHandlers}
      shouldCancelWhenOutside={false}
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleGestureEvent}
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
