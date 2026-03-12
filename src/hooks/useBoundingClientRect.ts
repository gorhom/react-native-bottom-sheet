import { type RefObject, useLayoutEffect } from 'react';
import type { View } from 'react-native';
import { isFabricInstalled } from '../utilities/isFabricInstalled';

export type BoundingClientRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

/**
 * A custom hook that retrieves the bounding client rectangle of a given `ref` element
 * and invokes a handler function with the layout information.
 *
 * This hook is designed to work with React Native's Fabric architecture and provides
 * support for both `unstable_getBoundingClientRect` and `getBoundingClientRect` methods.
 *
 * @param ref - A `RefObject` pointing to a `View` or `null`. The bounding client rectangle
 *              will be retrieved from this reference.
 * @param handler - A callback function that will be invoked with the layout information
 *                  of the referenced element.
 *
 * @remarks
 * - The hook uses `useLayoutEffect` to ensure the layout information is retrieved
 *   after the DOM updates.
 * - The `isFabricInstalled` function is used to determine if the Fabric architecture
 *   is available.
 * - The `unstable_getBoundingClientRect` method is used if available, falling back
 *   to `getBoundingClientRect` otherwise.
 *
 * @example
 * ```tsx
 * const ref = useRef<View | null>(null);
 * useBoundingClientRect(ref, (layout) => {
 *   console.log('Bounding client rect:', layout);
 * });
 * ```
 */
export function useBoundingClientRect(
  ref: RefObject<View | null>,
  handler: (layout: BoundingClientRect) => void
) {
  useLayoutEffect(() => {
    if (!isFabricInstalled()) {
      return;
    }

    const node = ref?.current as (View & {
      unstable_getBoundingClientRect?: () => BoundingClientRect;
      getBoundingClientRect?: () => BoundingClientRect;
    }) | null;

    if (!node) {
      return;
    }

    if (typeof node.unstable_getBoundingClientRect === 'function') {
      const layout = node.unstable_getBoundingClientRect();
      handler(layout);
      return;
    }

    if (typeof node.getBoundingClientRect === 'function') {
      const layout = node.getBoundingClientRect();
      handler(layout);
    }
  });
}
