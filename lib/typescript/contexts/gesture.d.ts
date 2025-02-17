import type { Gesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';
import type { GestureHandlersHookType } from '../types';
export interface BottomSheetGestureHandlersContextType {
    contentPanGestureHandler: ReturnType<GestureHandlersHookType>;
    handlePanGestureHandler: ReturnType<GestureHandlersHookType>;
}
export declare const BottomSheetGestureHandlersContext: import("react").Context<BottomSheetGestureHandlersContextType | null>;
export declare const BottomSheetDraggableContext: import("react").Context<Gesture | null>;
//# sourceMappingURL=gesture.d.ts.map