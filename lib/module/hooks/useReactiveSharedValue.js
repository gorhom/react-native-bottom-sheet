import { useEffect, useRef } from 'react';
import { cancelAnimation, makeMutable } from 'react-native-reanimated';
export const useReactiveSharedValue = value => {
  var _valueRef$current;

  const initialValueRef = useRef(null);
  const valueRef = useRef(null);

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
      valueRef.current = makeMutable({ ...value
      });
    } else {
      // @ts-ignore
      valueRef.current = makeMutable(value);
    }
  } else if (initialValueRef.current !== value) {
    valueRef.current.value = value;
  }

  useEffect(() => {
    return () => {
      if (valueRef.current) {
        cancelAnimation(valueRef.current);
      }
    };
  }, []); // @ts-ignore

  return (_valueRef$current = valueRef.current) !== null && _valueRef$current !== void 0 ? _valueRef$current : value;
};
//# sourceMappingURL=useReactiveSharedValue.js.map