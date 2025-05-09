import type { RefObject } from 'react';
import { findNodeHandle } from 'react-native';

export function getRefNativeTag(ref: RefObject<never>) {
  return findNodeHandle(ref?.current) || null;
}
