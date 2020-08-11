import { createContext, Ref, RefObject } from 'react';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Scrollable, ScrollableRef } from './types';

export interface BottomSheetInternalContextType {
  rootTapGestureRef: Ref<TapGestureHandler>;
  contentPanGestureState: Animated.Value<State>;
  contentPanGestureTranslationY: Animated.Value<number>;
  contentPanGestureVelocityY: Animated.Value<number>;
  scrollableContentOffsetY: Animated.Value<number>;
  disableIntervalMomentum: Animated.Node<number>;
  decelerationRate: Animated.Node<number>;
  setScrollableRef: (ref: ScrollableRef) => void;
  removeScrollableRef: (ref: RefObject<Scrollable>) => void;
}

// @ts-ignore
export const BottomSheetInternalContext = createContext<
  BottomSheetInternalContextType
>();

export const BottomSheetInternalProvider = BottomSheetInternalContext.Provider;

export interface BottomSheetContextType {
  snapTo: (index: number) => void;
  close: () => void;
}

// @ts-ignore
export const BottomSheetContext = createContext<BottomSheetContextType>();

export const BottomSheetProvider = BottomSheetContext.Provider;
