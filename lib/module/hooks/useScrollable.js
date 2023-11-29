import { useCallback, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { getRefNativeTag } from '../utilities/getRefNativeTag';
import { SCROLLABLE_STATE, SCROLLABLE_TYPE } from '../constants';
export const useScrollable = () => {
  // refs
  const scrollableRef = useRef(null);
  const previousScrollableRef = useRef(null); // variables

  const animatedScrollableType = useSharedValue(SCROLLABLE_TYPE.UNDETERMINED);
  const animatedScrollableContentOffsetY = useSharedValue(0);
  const animatedScrollableOverrideState = useSharedValue(SCROLLABLE_STATE.UNDETERMINED);
  const isScrollableRefreshable = useSharedValue(false); // callbacks

  const setScrollableRef = useCallback(ref => {
    var _scrollableRef$curren, _scrollableRef$curren2;

    // get current node handle id
    let currentRefId = (_scrollableRef$curren = (_scrollableRef$curren2 = scrollableRef.current) === null || _scrollableRef$curren2 === void 0 ? void 0 : _scrollableRef$curren2.id) !== null && _scrollableRef$curren !== void 0 ? _scrollableRef$curren : null;

    if (currentRefId !== ref.id) {
      if (scrollableRef.current) {
        // @ts-ignore
        previousScrollableRef.current = scrollableRef.current;
      } // @ts-ignore


      scrollableRef.current = ref;
    }
  }, []);
  const removeScrollableRef = useCallback(ref => {
    var _scrollableRef$curren3, _scrollableRef$curren4;

    // find node handle id
    let id;

    try {
      id = getRefNativeTag(ref);
    } catch {
      return;
    } // get current node handle id


    let currentRefId = (_scrollableRef$curren3 = (_scrollableRef$curren4 = scrollableRef.current) === null || _scrollableRef$curren4 === void 0 ? void 0 : _scrollableRef$curren4.id) !== null && _scrollableRef$curren3 !== void 0 ? _scrollableRef$curren3 : null;
    /**
     * @DEV
     * when the incoming node is actually the current node, we reset
     * the current scrollable ref to the previous one.
     */

    if (id === currentRefId) {
      // @ts-ignore
      scrollableRef.current = previousScrollableRef.current;
    }
  }, []);
  return {
    scrollableRef,
    animatedScrollableType,
    animatedScrollableContentOffsetY,
    animatedScrollableOverrideState,
    isScrollableRefreshable,
    setScrollableRef,
    removeScrollableRef
  };
};
//# sourceMappingURL=useScrollable.js.map