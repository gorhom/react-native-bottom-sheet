import { useEffect, useRef } from 'react';
import Animated from 'react-native-reanimated';

export const useReactiveValue = (value: number) => {
  // ref
  const ref = useRef<Animated.Value<number>>(null);
  if (ref.current === null) {
    // @ts-ignore
    ref.current = new Animated.Value(value);
  }

  // effects
  useEffect(() => {
    if (ref.current) {
      ref.current.setValue(value);
    }
  }, [value]);

  return ref.current;
};
