import React, { useContext } from 'react';
import Animated from 'react-native-reanimated';

const gestureTranslationContext = React.createContext<
  Animated.SharedValue<number>
>({ value: 0 });

export const GestureTranslationProvider = gestureTranslationContext.Provider;

export const useGestureTranslationY = () => {
  return useContext(gestureTranslationContext);
};
