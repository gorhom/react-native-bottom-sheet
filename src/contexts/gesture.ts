import { createContext } from 'react';
import type { Gesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';
import type { GestureHandlersHookType } from '../types';

export interface BottomSheetGestureHandlersContextType {
  contentPanGestureHandler: ReturnType<GestureHandlersHookType>;
  handlePanGestureHandler: ReturnType<GestureHandlersHookType>;
}

export const BottomSheetGestureHandlersContext =
  createContext<BottomSheetGestureHandlersContextType | null>(null);

export const BottomSheetDraggableContext = createContext<Gesture | null>(null);
