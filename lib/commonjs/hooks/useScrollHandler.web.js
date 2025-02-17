"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useScrollHandler = void 0;
var _react = require("react");
var _reactNative = require("react-native");
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../constants");
var _useBottomSheetInternal = require("./useBottomSheetInternal");
const useScrollHandler = (_, onScroll) => {
  //#region refs
  const scrollableRef = (0, _react.useRef)(null);
  //#endregion

  //#region variables
  const scrollableContentOffsetY = (0, _reactNativeReanimated.useSharedValue)(0);
  //#endregion

  //#region hooks
  const {
    animatedScrollableState,
    animatedAnimationState,
    animatedScrollableContentOffsetY
  } = (0, _useBottomSheetInternal.useBottomSheetInternal)();
  //#endregion

  //#region effects
  (0, _react.useEffect)(() => {
    // biome-ignore lint: to be addressed!
    const element = (0, _reactNative.findNodeHandle)(scrollableRef.current);
    let scrollOffset = 0;
    let supportsPassive = false;
    let maybePrevent = false;
    let lastTouchY = 0;
    let initialContentOffsetY = 0;
    const shouldLockInitialPosition = false;
    function handleOnTouchStart(event) {
      if (event.touches.length !== 1) {
        return;
      }
      initialContentOffsetY = element.scrollTop;
      lastTouchY = event.touches[0].clientY;
      maybePrevent = scrollOffset <= 0;
    }
    function handleOnTouchMove(event) {
      if (animatedScrollableState.value === _constants.SCROLLABLE_STATE.LOCKED) {
        return event.preventDefault();
      }
      if (maybePrevent) {
        maybePrevent = false;
        const touchY = event.touches[0].clientY;
        const touchYDelta = touchY - lastTouchY;
        if (touchYDelta > 0) {
          return event.preventDefault();
        }
      }
      return true;
    }
    function handleOnTouchEnd() {
      if (animatedScrollableState.value === _constants.SCROLLABLE_STATE.LOCKED) {
        const lockPosition = shouldLockInitialPosition ? initialContentOffsetY ?? 0 : 0;
        element.scroll({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
        scrollableContentOffsetY.value = lockPosition;
        return;
      }
    }
    function handleOnScroll(event) {
      scrollOffset = element.scrollTop;
      if (animatedAnimationState.value !== _constants.ANIMATION_STATE.RUNNING) {
        scrollableContentOffsetY.value = Math.max(0, scrollOffset);
        animatedScrollableContentOffsetY.value = Math.max(0, scrollOffset);
      }
      if (scrollOffset <= 0) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
      return true;
    }
    try {
      // @ts-ignore
      window.addEventListener('test', null, {
        // @ts-ignore
        // biome-ignore lint: to be addressed
        get passive() {
          supportsPassive = true;
        }
      });
    } catch (_e) {}
    element.addEventListener('touchstart', handleOnTouchStart, supportsPassive ? {
      passive: true
    } : false);
    element.addEventListener('touchmove', handleOnTouchMove, supportsPassive ? {
      passive: false
    } : false);
    element.addEventListener('touchend', handleOnTouchEnd, supportsPassive ? {
      passive: false
    } : false);
    element.addEventListener('scroll', handleOnScroll, supportsPassive ? {
      passive: false
    } : false);
    return () => {
      // @ts-ignore
      window.removeEventListener('test', null);
      element.removeEventListener('touchstart', handleOnTouchStart);
      element.removeEventListener('touchmove', handleOnTouchMove);
      element.removeEventListener('touchend', handleOnTouchEnd);
      element.removeEventListener('scroll', handleOnScroll);
    };
  }, [animatedAnimationState, animatedScrollableContentOffsetY, animatedScrollableState, scrollableContentOffsetY]);
  //#endregion

  return {
    scrollHandler: onScroll,
    scrollableRef,
    scrollableContentOffsetY
  };
};
exports.useScrollHandler = useScrollHandler;
//# sourceMappingURL=useScrollHandler.web.js.map