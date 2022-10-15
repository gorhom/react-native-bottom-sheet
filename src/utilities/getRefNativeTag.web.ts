import type { RefObject } from 'react';
import { findNodeHandle } from 'react-native';

export function getRefNativeTag(ref: RefObject<any>) {
  return findNodeHandle(ref?.current) || null;
}
