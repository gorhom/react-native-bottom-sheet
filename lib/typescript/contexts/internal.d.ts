import { type RefObject } from 'react';
import type { State } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import type { AnimateToPositionType, BottomSheetGestureProps, BottomSheetProps } from '../components/bottomSheet/types';
import type { ANIMATION_STATE, KEYBOARD_STATE, SCROLLABLE_STATE, SCROLLABLE_TYPE, SHEET_STATE } from '../constants';
import type { Scrollable, ScrollableRef } from '../types';
export interface BottomSheetInternalContextType extends Partial<BottomSheetGestureProps>, Required<Pick<BottomSheetProps, 'enableContentPanningGesture' | 'enableOverDrag' | 'enablePanDownToClose' | 'enableDynamicSizing' | 'enableBlurKeyboardOnGesture' | 'overDragResistanceFactor'>> {
    animatedAnimationState: SharedValue<ANIMATION_STATE>;
    animatedSheetState: SharedValue<SHEET_STATE>;
    animatedScrollableState: SharedValue<SCROLLABLE_STATE>;
    animatedKeyboardState: SharedValue<KEYBOARD_STATE>;
    animatedContentGestureState: SharedValue<State>;
    animatedHandleGestureState: SharedValue<State>;
    animatedSnapPoints: SharedValue<number[]>;
    animatedPosition: SharedValue<number>;
    animatedIndex: SharedValue<number>;
    animatedContainerHeight: SharedValue<number>;
    animatedContentHeight: SharedValue<number>;
    animatedHighestSnapPoint: SharedValue<number>;
    animatedClosedPosition: SharedValue<number>;
    animatedFooterHeight: SharedValue<number>;
    animatedHandleHeight: SharedValue<number>;
    animatedKeyboardHeight: SharedValue<number>;
    animatedKeyboardHeightInContainer: SharedValue<number>;
    animatedScrollableType: SharedValue<SCROLLABLE_TYPE>;
    animatedScrollableContentOffsetY: SharedValue<number>;
    animatedScrollableOverrideState: SharedValue<SCROLLABLE_STATE>;
    isScrollableRefreshable: SharedValue<boolean>;
    isContentHeightFixed: SharedValue<boolean>;
    isInTemporaryPosition: SharedValue<boolean>;
    shouldHandleKeyboardEvents: SharedValue<boolean>;
    stopAnimation: () => void;
    animateToPosition: AnimateToPositionType;
    setScrollableRef: (ref: ScrollableRef) => void;
    removeScrollableRef: (ref: RefObject<Scrollable>) => void;
}
export declare const BottomSheetInternalContext: import("react").Context<BottomSheetInternalContextType | null>;
export declare const BottomSheetInternalProvider: import("react").Provider<BottomSheetInternalContextType | null>;
//# sourceMappingURL=internal.d.ts.map