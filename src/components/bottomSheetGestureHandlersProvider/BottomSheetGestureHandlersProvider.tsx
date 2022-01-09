import React, { useMemo } from 'react';
import { GESTURE_SOURCE } from '../../constants';
import {
  useGestureHandler,
  useBottomSheetInternal,
  useGestureEventsHandlersDefault,
} from '../../hooks';
import { BottomSheetGestureHandlersContext } from '../../contexts';
import type { BottomSheetGestureHandlersProviderProps } from './types';
import { useSharedValue } from 'react-native-reanimated';

const BottomSheetGestureHandlersProvider = ({
  gestureEventsHandlersHook:
    useGestureEventsHandlers = useGestureEventsHandlersDefault,
  children,
}: BottomSheetGestureHandlersProviderProps) => {
  //#region variables
  const animatedGestureSource = useSharedValue<GESTURE_SOURCE>(
    GESTURE_SOURCE.UNDETERMINED
  );
  //#endregion

  //#region hooks
  const { animatedContentGestureState, animatedHandleGestureState } =
    useBottomSheetInternal();
  const { handleOnStart, handleOnActive, handleOnEnd } =
    useGestureEventsHandlers();
  //#endregion

  //#region gestures
  const contentPanGestureHandler = useGestureHandler(
    GESTURE_SOURCE.CONTENT,
    animatedContentGestureState,
    animatedGestureSource,
    handleOnStart,
    handleOnActive,
    handleOnEnd
  );

  const scrollablePanGestureHandler = useGestureHandler(
    GESTURE_SOURCE.SCROLLABLE,
    animatedContentGestureState,
    animatedGestureSource,
    handleOnStart,
    handleOnActive,
    handleOnEnd
  );

  const handlePanGestureHandler = useGestureHandler(
    GESTURE_SOURCE.HANDLE,
    animatedHandleGestureState,
    animatedGestureSource,
    handleOnStart,
    handleOnActive,
    handleOnEnd
  );
  //#endregion

  //#region context
  const contextValue = useMemo(
    () => ({
      contentPanGestureHandler,
      handlePanGestureHandler,
      scrollablePanGestureHandler,
      animatedGestureSource,
    }),
    [
      contentPanGestureHandler,
      handlePanGestureHandler,
      scrollablePanGestureHandler,
      animatedGestureSource,
    ]
  );
  //#endregion
  return (
    <BottomSheetGestureHandlersContext.Provider value={contextValue}>
      {children}
    </BottomSheetGestureHandlersContext.Provider>
  );
};

export default BottomSheetGestureHandlersProvider;
