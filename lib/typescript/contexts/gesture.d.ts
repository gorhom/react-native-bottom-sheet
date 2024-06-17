/// <reference types="react" />
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
export interface BottomSheetGestureHandlersContextType {
    contentPanGestureHandler: (event: PanGestureHandlerGestureEvent) => void;
    handlePanGestureHandler: (event: PanGestureHandlerGestureEvent) => void;
    scrollablePanGestureHandler: (event: PanGestureHandlerGestureEvent) => void;
}
export declare const BottomSheetGestureHandlersContext: import("react").Context<BottomSheetGestureHandlersContextType | null>;
