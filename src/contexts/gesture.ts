import { createContext } from 'react';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

export interface BottomSheetGestureHandlersContextType {
  contentPanGestureHandler: (event: PanGestureHandlerGestureEvent) => void;
  handlePanGestureHandler: (event: PanGestureHandlerGestureEvent) => void;
  scrollablePanGestureHandler: (event: PanGestureHandlerGestureEvent) => void;
}

export const BottomSheetGestureHandlersContext =
  createContext<BottomSheetGestureHandlersContextType | null>(null);
