import { useEffect, useRef } from 'react';
import Animated, {
  cancelAnimation,
  makeMutable,
} from 'react-native-reanimated';

export const useReactiveSharedValue = <T>(
  value: T
): Animated.SharedValue<T> => {
  const ref = useRef<Animated.SharedValue<T>>(null);

  if (ref.current === null) {
    // @ts-ignore
    ref.current = makeMutable(value);
  } else if (ref.current.value !== value) {
    ref.current.value = value;
  }

  useEffect(() => {
    return () => {
      if (ref.current) {
        cancelAnimation(ref.current);
      }
    };
  }, []);

  return ref.current;
};
