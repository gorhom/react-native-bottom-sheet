import { createContext, RefObject } from 'react';
import type { State } from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';
import type {
  AnimateToPositionType,
  BottomSheetGestureProps,
  BottomSheetProps,
} from '../components/bottomSheet/types';
import type {
  ANIMATION_STATE,
  KEYBOARD_STATE,
  SCROLLABLE_STATE,
  SCROLLABLE_TYPE,
  SHEET_STATE,
} from '../constants';
import type { Scrollable, ScrollableRef } from '../types';

export interface BottomSheetInternalContextType
  extends Partial<BottomSheetGestureProps>,
    Required<
      Pick<
        BottomSheetProps,
        | 'enableContentPanningGesture'
        | 'enableOverDrag'
        | 'enablePanDownToClose'
        | 'overDragResistanceFactor'
      >
    > {
  // animated states
  animatedAnimationState: Animated.SharedValue<ANIMATION_STATE>;
  animatedSheetState: Animated.SharedValue<SHEET_STATE>;
  animatedScrollableState: Animated.SharedValue<SCROLLABLE_STATE>;
  animatedKeyboardState: Animated.SharedValue<KEYBOARD_STATE>;
  animatedContentGestureState: Animated.SharedValue<State>;
  animatedHandleGestureState: Animated.SharedValue<State>;

  // animated values
  animatedSnapPoints: Animated.SharedValue<number[]>;
  animatedPosition: Animated.SharedValue<number>;
  animatedIndex: Animated.SharedValue<number>;
  animatedContainerHeight: Animated.SharedValue<number>;
  animatedContentHeight: Animated.SharedValue<number>;
  animatedHighestSnapPoint: Animated.SharedValue<number>;
  animatedClosedPosition: Animated.SharedValue<number>;
  animatedFooterHeight: Animated.SharedValue<number>;
  animatedHandleHeight: Animated.SharedValue<number>;
  animatedKeyboardHeight: Animated.SharedValue<number>;
  animatedKeyboardHeightInContainer: Animated.SharedValue<number>;
  animatedScrollableType: Animated.SharedValue<SCROLLABLE_TYPE>;
  animatedScrollableContentOffsetY: Animated.SharedValue<number>;
  animatedScrollableOverrideState: Animated.SharedValue<SCROLLABLE_STATE>;
  isScrollableRefreshable: Animated.SharedValue<boolean>;
  isContentHeightFixed: Animated.SharedValue<boolean>;
  isInTemporaryPosition: Animated.SharedValue<boolean>;
  shouldHandleKeyboardEvents: Animated.SharedValue<boolean>;

  // methods
  stopAnimation: () => void;
  animateToPosition: AnimateToPositionType;
  setScrollableRef: (ref: ScrollableRef) => void;
  removeScrollableRef: (ref: RefObject<Scrollable>) => void;
}

export const BottomSheetInternalContext =
  createContext<BottomSheetInternalContextType | null>(null);

export const BottomSheetInternalProvider = BottomSheetInternalContext.Provider;
