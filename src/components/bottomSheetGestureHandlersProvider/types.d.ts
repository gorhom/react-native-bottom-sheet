import type { ReactChild } from 'react';
import type { BottomSheetProps } from '../bottomSheet/types';

export interface BottomSheetGestureHandlersProviderProps
  extends Pick<BottomSheetProps, 'gestureEventsHandlersHook'>,
    BottomSheetGestureCallbacks {
  children: ReactChild | ReactChild[];
}

export interface BottomSheetGestureCallbacks {
  onDragStart?: () => void;
  onDragEnd?: () => void;
}
