"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRefNativeTag = getRefNativeTag;

const isFunction = ref => typeof ref === 'function';

const hasNativeTag = ref => !!ref && typeof ref === 'object' && 'current' in (ref || {}) && '_nativeTag' in ((ref === null || ref === void 0 ? void 0 : ref.current) || {});
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


function getRefNativeTag(ref) {
  const refType = typeof ref;
  let nativeTag;

  if (isFunction(ref)) {
    nativeTag = ref();
  } else if (hasNativeTag(ref)) {
    nativeTag = ref.current._nativeTag;
  }

  if (!nativeTag || typeof nativeTag !== 'number') {
    throw new Error(`Unexpected nativeTag: ${refType}; nativeTag=${nativeTag} 

			createBottomSheetScrollableComponent's ScrollableComponent needs to return 
			a reference that contains a nativeTag to a Native HostComponent.

			ref=${ref}
			`);
  }

  return nativeTag;
}
//# sourceMappingURL=getRefNativeTag.js.map