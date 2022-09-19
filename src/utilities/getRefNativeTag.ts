const isFunction = (ref: unknown): ref is Function => typeof ref === 'function';

const hasNativeTag = (
  ref: unknown
): ref is { current: { _nativeTag: number } } =>
  !!ref &&
  typeof ref === 'object' &&
  'current' in (ref || {}) &&
  '_nativeTag' in ((ref as any)?.current || {});

/*
 * getRefNativeTag is an internal utility used by createBottomSheetScrollableComponent
 * to grab the native tag from the native host component. It only works when the ref
 * is pointing to a native Host component.
 *
 * Internally in the bottom-sheet library ref can be a function that returns a native tag
 * this seems to happen due to the usage of Reanimated's animated scroll components.
 *
 * This should be Fabric compatible as long as the ref is a native host component.
 * */
export function getRefNativeTag(ref: unknown) {
  const refType = typeof ref;
  let nativeTag: undefined | number;
  if (isFunction(ref)) {
    nativeTag = ref();
  } else if (hasNativeTag(ref)) {
    nativeTag = ref.current._nativeTag;
  }

  if (!nativeTag || typeof nativeTag !== 'number') {
    throw new Error(
      `Unexpected nativeTag: ${refType}; nativeTag=${nativeTag} 

			createBottomSheetScrollableComponent's ScrollableComponent needs to return 
			a reference that contains a nativeTag to a Native HostComponent.

			ref=${ref}
			`
    );
  }

  return nativeTag;
}
