import type { RefObject } from 'react';

export function getRefNativeTag(ref: RefObject<any>) {
  return ref?.current || null;
}
