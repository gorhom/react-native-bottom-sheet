import { createContext, Ref, RefObject } from 'react';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Scrollable } from './types';

export interface BottomSheetInternalContextType {
  rootTapGestureRef: Ref<TapGestureHandler>;
  sheetPanGestureState: Animated.Value<State>;
  sheetPanGestureTranslationY: Animated.Value<number>;
  sheetPanGestureVelocityY: Animated.Value<number>;
  scrollableContentOffsetY: Animated.Value<number>;
  disableIntervalMomentum: Animated.Node<number>;
  decelerationRate: Animated.Node<number>;
  setScrollableRef: (ref: RefObject<Scrollable>) => void;
  removeScrollableRef: (ref: RefObject<Scrollable>) => void;
}

// @ts-ignore
export const BottomSheetInternalContext = createContext<
  BottomSheetInternalContextType
>();

export const BottomSheetInternalProvider = BottomSheetInternalContext.Provider;
