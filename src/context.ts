import { createContext, RefObject, Ref } from 'react';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

export interface BottomSheetInternalContextType {
  lastStartScrollY: Animated.Value<number>;
  dragY: Animated.Value<number>;
  velocityY: Animated.Value<number>;
  drawerGestureState: Animated.Value<State>;
  drawerOldGestureState: Animated.Value<State>;
  masterDrawerRef: Ref<TapGestureHandler>;
  decelerationRate: Animated.Value<number>;
  contentPaddingBottom: number;
  setScrollableRef: (ref: RefObject<any>) => void;
}

export const BottomSheetInternalContext = createContext<
  BottomSheetInternalContextType
>({
  lastStartScrollY: new Animated.Value(0),
  dragY: new Animated.Value(0),
  velocityY: new Animated.Value(0),
  drawerGestureState: new Animated.Value(State.UNDETERMINED),
  drawerOldGestureState: new Animated.Value(State.UNDETERMINED),
  masterDrawerRef: null,
  decelerationRate: new Animated.Value(0),
  contentPaddingBottom: 0,
  setScrollableRef: () => {},
});

export const BottomSheetInternalProvider = BottomSheetInternalContext.Provider;
