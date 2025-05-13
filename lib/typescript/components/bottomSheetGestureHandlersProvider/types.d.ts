import type { ReactChild } from 'react';
import type { BottomSheetProps } from '../bottomSheet/types';

export interface BottomSheetGestureHandlersProviderProps
  extends Pick<BottomSheetProps, 'gestureEventsHandlersHook'> {
  children: ReactChild | ReactChild[];
}
