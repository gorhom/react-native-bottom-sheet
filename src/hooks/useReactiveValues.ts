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

      /**
       * if previous animated array has more values than the updated
       * array, we will need to set the extra values to the last
       * value of the updated array.
       */
      if (values.length < ref.current.length) {
        const lastValue = values[values.length - 1];
        for (let i = values.length - 1; i <= ref.current.length - 1; i++) {
          ref.current[i].setValue(lastValue);
        }
      }
    }
  }, [values]);

  return ref.current!;
};
