import { createContext, RefObject } from 'react';
import type {
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
} from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';
import type {
  ANIMATION_STATE,
  SCROLLABLE_STATE,
  SHEET_STATE,
} from '../constants';
import type { Scrollable, ScrollableRef } from '../types';

export interface BottomSheetInternalContextType
  extends Pick<
    PanGestureHandlerProps,
    | 'activeOffsetY'
    | 'activeOffsetX'
    | 'failOffsetY'
    | 'failOffsetX'
    | 'waitFor'
    | 'simultaneousHandlers'
  > {
  // configs
  enableContentPanningGesture: boolean;

  // animated states
  animatedAnimationState: Animated.SharedValue<ANIMATION_STATE>;
  animatedSheetState: Animated.SharedValue<SHEET_STATE>;
  animatedScrollableState: Animated.SharedValue<SCROLLABLE_STATE>;

  // animated values
  animatedPosition: Animated.SharedValue<number>;
  animatedIndex: Animated.SharedValue<number>;
  scrollableContentOffsetY: Animated.SharedValue<number>;
  shouldHandleKeyboardEvents: Animated.SharedValue<boolean>;

  // methods
  contentPanGestureHandler: (event: PanGestureHandlerGestureEvent) => void;
  setScrollableRef: (ref: ScrollableRef) => void;
  removeScrollableRef: (ref: RefObject<Scrollable>) => void;
}

// @ts-ignore
export const BottomSheetInternalContext = createContext<BottomSheetInternalContextType>();

export const BottomSheetInternalProvider = BottomSheetInternalContext.Provider;
