import React, { useMemo, useRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import Animated, { event } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetDraggableViewProps } from './types';
import { styles } from './styles';

const BottomSheetDraggableViewComponent = ({
  nativeGestureRef,
  gestureType = 'HANDLE',
  style,
  children,
  ...rest
}: BottomSheetDraggableViewProps) => {
  // refs
  const panGestureRef = useRef<PanGestureHandler>(null);

  // hooks
  const {
    enabled,
    containerTapGestureRef,
    handlePanGestureState,
    handlePanGestureTranslationY,
    handlePanGestureVelocityY,
    contentPanGestureState,
    contentPanGestureTranslationY,
    contentPanGestureVelocityY,
  } = useBottomSheetInternal();

  // variables
  const simultaneousHandlers = useMemo(
    () =>
      nativeGestureRef
        ? [containerTapGestureRef, nativeGestureRef]
        : containerTapGestureRef,
    [containerTapGestureRef, nativeGestureRef]
  );

  // styles
  const containerStyle = useMemo(
    () => (style ? [styles.container, style] : styles.container),
    [style]
  );

  // callbacks
  const handleGestureEvent = useMemo(
    () =>
      gestureType === 'CONTENT'
        ? event([
            {
              nativeEvent: {
                state: contentPanGestureState,
                translationY: contentPanGestureTranslationY,
                velocityY: contentPanGestureVelocityY,
              },
            },
          ])
        : event([
            {
              nativeEvent: {
                state: handlePanGestureState,
                translationY: handlePanGestureTranslationY,
                velocityY: handlePanGestureVelocityY,
              },
            },
          ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gestureType]
  );

  // effects
  return (
    <PanGestureHandler
      ref={panGestureRef}
      enabled={enabled}
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
