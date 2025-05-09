import type React from 'react';
import { findNodeHandle as _findNodeHandle } from 'react-native';

export function findNodeHandle(
  componentOrHandle:
    | null
    | number
    // biome-ignore lint/suspicious/noExplicitAny: fix later
    | React.Component<any, any>
    // biome-ignore lint/suspicious/noExplicitAny: fix later
    | React.ComponentClass<any>
) {
  try {
    return _findNodeHandle(componentOrHandle);
  } catch {
    // @ts-ignore
    return componentOrHandle.getNativeScrollRef();
  }
}
