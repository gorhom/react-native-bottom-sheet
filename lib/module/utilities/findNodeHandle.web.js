"use strict";

import { findNodeHandle as _findNodeHandle } from 'react-native';
export function findNodeHandle(componentOrHandle) {
  try {
    return _findNodeHandle(componentOrHandle);
  } catch {
    // @ts-ignore
    return componentOrHandle.getNativeScrollRef();
  }
}
//# sourceMappingURL=findNodeHandle.web.js.map