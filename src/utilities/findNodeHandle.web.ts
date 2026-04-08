import {
  findNodeHandle as _findNodeHandle,
  type NodeHandle,
} from 'react-native';

export function findNodeHandle(
  componentOrHandle: Parameters<typeof _findNodeHandle>['0']
) {
  let nodeHandle: NodeHandle | null;
  try {
    nodeHandle = _findNodeHandle(componentOrHandle);
    if (nodeHandle) {
      return nodeHandle;
    }
  } catch {}

  try {
    // @ts-expect-error
    nodeHandle = componentOrHandle.getNativeScrollRef();
    if (nodeHandle) {
      return nodeHandle;
    }
  } catch {}

  // @ts-expect-error https://github.com/facebook/react-native/blob/a314e34d6ee875830d36e4df1789a897c7262056/packages/virtualized-lists/Lists/VirtualizedList.js#L1252
  nodeHandle = componentOrHandle._scrollRef;
  if (nodeHandle) {
    return nodeHandle;
  }

  console.warn('could not find scrollable ref!');
  return componentOrHandle;
}
