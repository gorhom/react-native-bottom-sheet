import React, { useMemo } from 'react';
import { GESTURE_SOURCE } from '../../constants';
import {
  useGestureHandler,
  useBottomSheetInternal,
  useGestureEventsHandlersDefault,
} from '../../hooks';
import { BottomSheetGestureHandlersContext } from '../../contexts';
import type { BottomSheetGestureHandlersProviderProps } from './types';

const BottomSheetGestureHandlersProvider = ({
  gestureEventsHandlersHook:
    useGestureEventsHandlers = useGestureEventsHandlersDefault,
  children,
}: BottomSheetGestureHandlersProviderProps) => {
  // hooks
  const { animatedContentGestureState, animatedHandleGestureState } =
    useBottomSheetInternal();
  const { handleOnStart, handleOnActive, handleOnEnd } =
    useGestureEventsHandlers();

  // gestures
  const contentPanGestureHandler = useGestureHandler(
    GESTURE_SOURCE.SCROLLABLE,
    animatedContentGestureState,
    handleOnStart,
    handleOnActive,
    handleOnEnd
  );
  const handlePanGestureHandler = useGestureHandler(
    GESTURE_SOURCE.HANDLE,
    animatedHandleGestureState,
    handleOnStart,
    handleOnActive,
    handleOnEnd
  );

  // context value
  const contextValue = useMemo(
    () => ({ contentPanGestureHandler, handlePanGestureHandler }),
    [contentPanGestureHandler, handlePanGestureHandler]
  );
  return (
    <BottomSheetGestureHandlersContext.Provider value={contextValue}>
      {children}
    </BottomSheetGestureHandlersContext.Provider>
  );
};

export default BottomSheetGestureHandlersProvider;
