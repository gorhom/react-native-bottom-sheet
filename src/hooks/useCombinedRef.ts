import { useCallback } from "react";

/**
 * Handles setting callback refs and MutableRefObjects.
 * @param ref The ref to use for the instance.
 * @param instance The instance being set.
 */
function setRef<TInstance>(ref: React.Ref<TInstance>, instance: TInstance) {
  if (ref instanceof Function) {
    ref(instance);
  } else if (ref != null) {
    // Force setting the ref.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    (ref as React.MutableRefObject<TInstance>).current = instance;
  }
}

export function combinedRef<TInstance>(refs: React.Ref<TInstance>[]) {
  return (instance: TInstance | null) => {
    for (const ref of refs) {
      setRef(ref, instance);
    }
  };
}

// CREDIT https://github.com/radix-ui/primitives/blob/main/packages/react/compose-refs/src/composeRefs.tsx
/**
 * Create a ref that passes its instance to multiple refs.
 * @param refs The refs that should receive the instance.
 * @returns The combined ref.
 */
export function useCombinedRef<TInstance>(...refs: React.Ref<TInstance>[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(combinedRef(refs), refs);
}
