import {
  findNodeHandle as _findNodeHandle,
  type NodeHandle,
} from 'react-native';

/**
 * Type bridge for accessing undocumented React Native scroll component internals.
 * These properties exist at runtime but aren't exposed in RN's public type definitions.
 *
 * @see https://github.com/facebook/react-native/blob/main/packages/virtualized-lists/Lists/VirtualizedList.js#L1252
 */
interface ScrollComponentInternals {
  /** Available on ScrollView, FlatList, etc. to get the underlying native scroll ref */
  getNativeScrollRef?: () => NodeHandle | null;
  /** Internal property on VirtualizedList storing the scroll ref */
  _scrollRef?: NodeHandle | null;
}

export function findNodeHandle(
  componentOrHandle: Parameters<typeof _findNodeHandle>['0']
): NodeHandle | null | typeof componentOrHandle {
  // Early return for null/undefined (React 19 fix)
  if (componentOrHandle == null) {
    return null;
  }

  let nodeHandle: NodeHandle | null = null;

  try {
    nodeHandle = _findNodeHandle(componentOrHandle);
    if (nodeHandle) {
      return nodeHandle;
    }
  } catch {}

  // Type bridge: componentOrHandle may have scroll internals at runtime
  const scrollable = componentOrHandle as unknown as ScrollComponentInternals;

  try {
    if (typeof scrollable.getNativeScrollRef === 'function') {
      nodeHandle = scrollable.getNativeScrollRef();
      if (nodeHandle) {
        return nodeHandle;
      }
    }
  } catch {}

  if (scrollable._scrollRef != null) {
    return scrollable._scrollRef;
  }

  console.warn('could not find scrollable ref!');
  return componentOrHandle;
}
