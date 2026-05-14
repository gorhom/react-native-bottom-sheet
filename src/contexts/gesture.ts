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

/**
 * Allows the inner scrollable component (`createBottomSheetScrollableComponent`)
 * to register its native scroll gesture with the outer `BottomSheetDraggableView`,
 * so the content pan gesture can declare `simultaneousWithExternalGesture(nativeScroll)`
 * — making the simultaneousness bidirectional.
 *
 * Without this, only the scroll side declares simultaneousness with the pan
 * (`Gesture.Native().simultaneousWithExternalGesture(panGesture)`). On Android
 * one-sided declaration is insufficient: the parent pan cancels the child native
 * scroll on every drag (visible symptom: `onBeginDrag` fires multiple times in
 * succession with zero `onScroll` events). Declaring on both sides resolves the
 * conflict and lets RNGH coordinate them correctly.
 *
 * State (not ref) is required because `simultaneousWithExternalGesture` resolves
 * at gesture-handler registration time. A ref whose `.current` is null at that
 * moment results in no relation being established; subsequent ref mutations
 * aren't picked up. Using state forces a re-render when the native gesture
 * mounts, recomputing the pan's `simultaneousHandlers` array and re-attaching
 * the GestureDetector with the relation now in place.
 */
export interface NativeScrollGestureContextType {
  nativeScrollGesture: Gesture | null;
  setNativeScrollGesture: (gesture: Gesture | null) => void;
}

export const NativeScrollGestureContext =
  createContext<NativeScrollGestureContextType | null>(null);
