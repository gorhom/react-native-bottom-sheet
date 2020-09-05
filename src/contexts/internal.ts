import { createContext, Ref, RefObject } from 'react';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';
import { Scrollable, ScrollableRef } from '../types';

export type BottomSheetInternalContextType = {
  rootTapGestureRef: Ref<TapGestureHandler>;
  contentPanGestureState: Animated.SharedValue<State>;
  contentPanGestureTranslationY: Animated.SharedValue<number>;
  contentPanGestureVelocityY: Animated.SharedValue<number>;
  scrollableContentOffsetY: Animated.SharedValue<number>;
  decelerationRate: Animated.Node<number>;
  setScrollableRef: (ref: ScrollableRef) => void;
  removeScrollableRef: (ref: RefObject<Scrollable>) => void;
};

// @ts-ignore
export const BottomSheetInternalContext = createContext<
  BottomSheetInternalContextType
>();

export const BottomSheetInternalProvider = BottomSheetInternalContext.Provider;
