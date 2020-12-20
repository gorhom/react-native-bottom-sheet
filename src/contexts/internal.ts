import { createContext, Ref, RefObject } from 'react';
import type { TapGestureHandler } from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';
import { ANIMATION_STATE } from '../constants';
import type { Scrollable, ScrollableRef } from '../types';

export type BottomSheetInternalContextType = {
  enableContentPanningGesture: boolean;
  snapPointsCount: number;
  animatedPosition: Animated.SharedValue<number>;
  animatedIndex: Animated.SharedValue<number>;
  animationState: Animated.SharedValue<ANIMATION_STATE>;
  contentWrapperGestureRef: Ref<TapGestureHandler>;
  contentPanGestureHandler: any;
  scrollableContentOffsetY: Animated.SharedValue<number>;
  scrollableDecelerationRate: Animated.SharedValue<number>;
  setScrollableRef: (ref: ScrollableRef) => void;
  removeScrollableRef: (ref: RefObject<Scrollable>) => void;
};

// @ts-ignore
export const BottomSheetInternalContext = createContext<BottomSheetInternalContextType>();

export const BottomSheetInternalProvider = BottomSheetInternalContext.Provider;
