import { createContext, Ref, RefObject } from 'react';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';
import { Scrollable, ScrollableRef } from '../types';

export type BottomSheetInternalContextType = {
  enabled: boolean;
  containerTapGestureRef: Ref<TapGestureHandler>;
  contentPanGestureState: Animated.Value<State>;
  contentPanGestureTranslationY: Animated.Value<number>;
  contentPanGestureVelocityY: Animated.Value<number>;
  handlePanGestureState: Animated.Value<State>;
  handlePanGestureTranslationY: Animated.Value<number>;
  handlePanGestureVelocityY: Animated.Value<number>;
  scrollableContentOffsetY: Animated.Value<number>;
  decelerationRate: Animated.Node<number>;
  setScrollableRef: (ref: ScrollableRef) => void;
  removeScrollableRef: (ref: RefObject<Scrollable>) => void;
};

// @ts-ignore
export const BottomSheetInternalContext = createContext<
  BottomSheetInternalContextType
>();

export const BottomSheetInternalProvider = BottomSheetInternalContext.Provider;
