import { type RefObject, createContext } from 'react';
import type { State } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import type {
  AnimateToPositionType,
  BottomSheetGestureProps,
  BottomSheetProps,
} from '../components/bottomSheet/types';
import type {
  ANIMATION_STATUS,
  SCROLLABLE_STATUS,
  SCROLLABLE_TYPE,
  SHEET_STATE,
} from '../constants';
import type {
  AnimationState,
  KeyboardState,
  Scrollable,
  ScrollableRef,
  ScrollableState,
} from '../types';

export interface BottomSheetInternalContextType
  extends Partial<BottomSheetGestureProps>,
    Required<
      Pick<
        BottomSheetProps,
        | 'enableContentPanningGesture'
        | 'enableOverDrag'
        | 'enablePanDownToClose'
        | 'enableDynamicSizing'
        | 'enableBlurKeyboardOnGesture'
        | 'overDragResistanceFactor'
      >
    > {
  // animated states
  animatedAnimationState: SharedValue<AnimationState>;
  animatedSheetState: SharedValue<SHEET_STATE>;
  animatedKeyboardState: SharedValue<KeyboardState>;
  animatedContentGestureState: SharedValue<State>;
  animatedHandleGestureState: SharedValue<State>;

  // scrollable
  animatedScrollableState: SharedValue<ScrollableState>;
  animatedScrollableStatus: SharedValue<SCROLLABLE_STATUS>;

  // animated values
  animatedSnapPoints: SharedValue<number[]>;
  animatedPosition: SharedValue<number>;
  animatedIndex: SharedValue<number>;
  animatedContainerHeight: SharedValue<number>;
  animatedContentHeight: SharedValue<number>;
  animatedSheetHeight: SharedValue<number>;
  animatedHighestSnapPoint: SharedValue<number>;
  animatedClosedPosition: SharedValue<number>;
  animatedFooterHeight: SharedValue<number>;
  animatedHandleHeight: SharedValue<number>;
  isContentHeightFixed: SharedValue<boolean>;
  isInTemporaryPosition: SharedValue<boolean>;

  // methods
  stopAnimation: () => void;
  animateToPosition: AnimateToPositionType;
  setScrollableRef: (ref: ScrollableRef) => void;
  removeScrollableRef: (ref: RefObject<Scrollable>) => void;
}

export const BottomSheetInternalContext =
  createContext<BottomSheetInternalContextType | null>(null);

export const BottomSheetInternalProvider = BottomSheetInternalContext.Provider;
