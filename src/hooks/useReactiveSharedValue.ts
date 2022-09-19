import { useEffect, useRef } from 'react';
import Animated, {
  cancelAnimation,
  makeMutable,
} from 'react-native-reanimated';
import type { Primitive } from '../types';

export const useReactiveSharedValue = <T>(
  value: T
): T extends Primitive ? Animated.SharedValue<T> : T => {
  const initialValueRef = useRef<T>(null);
  const valueRef = useRef<Animated.SharedValue<T>>(null);

  if (value && typeof value === 'object' && 'value' in value) {
    /**
     * if provided value is a shared value,
     * then we do not initialize another one.
     */
  } else if (valueRef.current === null) {
    // @ts-ignore
    initialValueRef.current = value;
    /**
     * if value is an object, then we need to
     * pass a clone.
     */
    if (typeof value === 'object') {
      // @ts-ignore
      valueRef.current = makeMutable({ ...value });
    } else {
      // @ts-ignore
      valueRef.current = makeMutable(value);
    }
  } else if (initialValueRef.current !== value) {
    valueRef.current.value = value as T;
  }

  useEffect(() => {
    return () => {
      if (valueRef.current) {
        cancelAnimation(valueRef.current);
      }
    };
  }, []);

  // @ts-ignore
  return valueRef.current ?? value;
};
