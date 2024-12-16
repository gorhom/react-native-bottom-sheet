"use strict";

import { findNodeHandle } from 'react-native';
export function getRefNativeTag(ref) {
  return findNodeHandle(ref?.current) || null;
}
//# sourceMappingURL=getRefNativeTag.web.js.map