import { useEffect, useRef } from 'react';
import Animated from 'react-native-reanimated';

export const useReactiveValues = (values: number[]) => {
  // ref
  const ref = useRef<Animated.Value<number>[]>(null);
  if (ref.current === null) {
    // @ts-ignore
    ref.current = [];
    values.map(value => {
      // @ts-ignore
      ref.current.push(new Animated.Value(value));
    });
  }

  // effects
  useEffect(() => {
    if (ref.current) {
      values.map((value, index) => {
        // @ts-ignore
        if (ref.current[index]) {
          // update current value
          // @ts-ignore
          ref.current[index].setValue(value);
        } else {
          // insert current value
          // @ts-ignore
          ref.current.push(new Animated.Value(value));
        }
      });
    }
  }, [values]);

  return ref.current!;
};
