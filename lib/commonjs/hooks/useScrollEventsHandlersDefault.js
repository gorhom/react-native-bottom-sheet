"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useScrollEventsHandlersDefault = void 0;
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../constants");
var _useBottomSheetInternal = require("./useBottomSheetInternal");
const useScrollEventsHandlersDefault = (scrollableRef, scrollableContentOffsetY) => {
  // hooks
  const {
    animatedSheetState,
    animatedScrollableState,
    animatedAnimationState,
    animatedHandleGestureState,
    animatedScrollableContentOffsetY: rootScrollableContentOffsetY
  } = (0, _useBottomSheetInternal.useBottomSheetInternal)();

  //#region callbacks
  const handleOnScroll = (0, _reactNativeReanimated.useWorkletCallback)(({
    contentOffset: {
      y
    }
  }, context) => {
    /**
     * if sheet position is extended or fill parent, then we reset
     * `shouldLockInitialPosition` value to false.
     */
    if (animatedSheetState.value === _constants.SHEET_STATE.EXTENDED || animatedSheetState.value === _constants.SHEET_STATE.FILL_PARENT) {
      context.shouldLockInitialPosition = false;
    }

    /**
     * if handle gesture state is active, then we capture the offset y position
     * and lock the scrollable with it.
     */
    if (animatedHandleGestureState.value === _reactNativeGestureHandler.State.ACTIVE) {
      context.shouldLockInitialPosition = true;
      context.initialContentOffsetY = y;
    }
    if (animatedScrollableState.value === _constants.SCROLLABLE_STATE.LOCKED) {
      const lockPosition = context.shouldLockInitialPosition ? context.initialContentOffsetY ?? 0 : 0;
      // @ts-ignore
      (0, _reactNativeReanimated.scrollTo)(scrollableRef, 0, lockPosition, false);
      scrollableContentOffsetY.value = lockPosition;
      return;
    }
  }, [scrollableRef, scrollableContentOffsetY, animatedScrollableState, animatedSheetState]);
  const handleOnBeginDrag = (0, _reactNativeReanimated.useWorkletCallback)(({
    contentOffset: {
      y
    }
  }, context) => {
    scrollableContentOffsetY.value = y;
    rootScrollableContentOffsetY.value = y;
    context.initialContentOffsetY = y;

    /**
     * if sheet position not extended or fill parent and the scrollable position
     * not at the top, then we should lock the initial scrollable position.
     */
    if (animatedSheetState.value !== _constants.SHEET_STATE.EXTENDED && animatedSheetState.value !== _constants.SHEET_STATE.FILL_PARENT && y > 0) {
      context.shouldLockInitialPosition = true;
    } else {
      context.shouldLockInitialPosition = false;
    }
  }, [scrollableContentOffsetY, animatedSheetState, rootScrollableContentOffsetY]);
  const handleOnEndDrag = (0, _reactNativeReanimated.useWorkletCallback)(({
    contentOffset: {
      y
    }
  }, context) => {
    if (animatedScrollableState.value === _constants.SCROLLABLE_STATE.LOCKED) {
      const lockPosition = context.shouldLockInitialPosition ? context.initialContentOffsetY ?? 0 : 0;
      // @ts-ignore
      (0, _reactNativeReanimated.scrollTo)(scrollableRef, 0, lockPosition, false);
      scrollableContentOffsetY.value = lockPosition;
      return;
    }
    if (animatedAnimationState.value !== _constants.ANIMATION_STATE.RUNNING) {
      scrollableContentOffsetY.value = y;
      rootScrollableContentOffsetY.value = y;
    }
  }, [scrollableRef, scrollableContentOffsetY, animatedAnimationState, animatedScrollableState, rootScrollableContentOffsetY]);
  const handleOnMomentumEnd = (0, _reactNativeReanimated.useWorkletCallback)(({
    contentOffset: {
      y
    }
  }, context) => {
    if (animatedScrollableState.value === _constants.SCROLLABLE_STATE.LOCKED) {
      const lockPosition = context.shouldLockInitialPosition ? context.initialContentOffsetY ?? 0 : 0;
      // @ts-ignore
      (0, _reactNativeReanimated.scrollTo)(scrollableRef, 0, lockPosition, false);
      scrollableContentOffsetY.value = 0;
      return;
    }
    if (animatedAnimationState.value !== _constants.ANIMATION_STATE.RUNNING) {
      scrollableContentOffsetY.value = y;
      rootScrollableContentOffsetY.value = y;
    }
  }, [scrollableContentOffsetY, scrollableRef, animatedAnimationState, animatedScrollableState, rootScrollableContentOffsetY]);
  //#endregion

  return {
    handleOnScroll,
    handleOnBeginDrag,
    handleOnEndDrag,
    handleOnMomentumEnd
  };
};
exports.useScrollEventsHandlersDefault = useScrollEventsHandlersDefault;
//# sourceMappingURL=useScrollEventsHandlersDefault.js.map