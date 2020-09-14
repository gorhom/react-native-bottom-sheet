import { createContext, Ref, RefObject } from 'react';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';
import { Scrollable, ScrollableRef } from '../types';

export type BottomSheetInternalContextType = {
  contentWrapperTapGestureRef: Ref<TapGestureHandler>;
  contentPanGestureState: Animated.SharedValue<State>;
  contentPanGestureTranslationY: Animated.SharedValue<number>;
  contentPanGestureVelocityY: Animated.SharedValue<number>;
  handlePanGestureState: Animated.SharedValue<State>;
  handlePanGestureTranslationY: Animated.SharedValue<number>;
  handlePanGestureVelocityY: Animated.SharedValue<number>;
  scrollableContentOffsetY: Animated.SharedValue<number>;
  scrollableDecelerationRate: Animated.SharedValue<number>;
  setScrollableRef: (ref: ScrollableRef) => void;
  removeScrollableRef: (ref: RefObject<Scrollable>) => void;
};

// @ts-ignore
export const BottomSheetInternalContext = createContext<
  BottomSheetInternalContextType
>();

export const BottomSheetInternalProvider = BottomSheetInternalContext.Provider;
