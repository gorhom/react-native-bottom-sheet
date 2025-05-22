import { findNodeHandle as _findNodeHandle } from 'react-native';

export function findNodeHandle(...[componentOrHandle]: Parameters<typeof _findNodeHandle>) {
  try {
    return _findNodeHandle(componentOrHandle);
  } catch {
    try {
      // @ts-ignore
      return componentOrHandle.getNativeScrollRef();
    } catch {
      // @ts-ignore
      return componentOrHandle._wrapperListRef?.getListRef()?.getScrollRef()
    }
  }
}
