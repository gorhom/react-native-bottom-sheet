import { createContext, RefObject, Ref } from 'react';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Scrollable } from './types';

export interface BottomSheetInternalContextType {
  rootTapGestureRef: Ref<TapGestureHandler>;
  sheetPanGestureState: Animated.Value<State>;
  sheetPanGestureTranslationY: Animated.Value<number>;
  sheetPanGestureVelocityY: Animated.Value<number>;
  scrollableContentOffsetY: Animated.Value<number>;
  setScrollableRef: (ref: RefObject<Scrollable>) => void;
}

export const BottomSheetInternalContext = createContext<
  BottomSheetInternalContextType
>({
  rootTapGestureRef: null,
  sheetPanGestureState: new Animated.Value(State.UNDETERMINED),
  sheetPanGestureTranslationY: new Animated.Value(0),
  sheetPanGestureVelocityY: new Animated.Value(0),
  scrollableContentOffsetY: new Animated.Value(0),
  setScrollableRef: () => {},
});

export const BottomSheetInternalProvider = BottomSheetInternalContext.Provider;
