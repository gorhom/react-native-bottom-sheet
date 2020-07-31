import { createContext, RefObject } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import {
  NativeViewGestureHandler,
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

export interface BottomSheetInternalContextType {
  scrollComponentRef?: RefObject<NativeViewGestureHandler>;
  drawerContentRef?: RefObject<PanGestureHandler>;
  masterDrawerRef?: RefObject<TapGestureHandler>;
  decelerationRate: Animated.Value<number>;
  contentPaddingBottom: number;
  setScrollableRef: (ref: RefObject<any>) => void;
  removeScrollableRef: (ref: RefObject<any>) => void;
  onScrollBeginDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export const BottomSheetInternalContext = createContext<
  BottomSheetInternalContextType
>({
  scrollComponentRef: undefined,
  drawerContentRef: undefined,
  masterDrawerRef: undefined,
  decelerationRate: new Animated.Value(0),
  contentPaddingBottom: 0,
  setScrollableRef: () => {},
  removeScrollableRef: () => {},
  onScrollBeginDrag: () => {},
});

export const BottomSheetInternalProvider = BottomSheetInternalContext.Provider;
