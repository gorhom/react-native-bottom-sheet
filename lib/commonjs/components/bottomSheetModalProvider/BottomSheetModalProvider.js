"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _portal = require("@gorhom/portal");
var _react = _interopRequireWildcard(require("react"));
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../../constants");
var _contexts = require("../../contexts");
var _constants2 = require("../bottomSheet/constants");
var _bottomSheetContainer = _interopRequireDefault(require("../bottomSheetContainer"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const BottomSheetModalProviderWrapper = ({
  children
}) => {
  //#region layout variables
  const animatedContainerHeight = (0, _reactNativeReanimated.useSharedValue)(_constants2.INITIAL_CONTAINER_HEIGHT);
  const animatedContainerOffset = (0, _reactNativeReanimated.useSharedValue)(_constants2.INITIAL_CONTAINER_OFFSET);
  //#endregion

  //#region variables
  const sheetsQueueRef = (0, _react.useRef)([]);
  //#endregion

  //#region private methods
  const handleMountSheet = (0, _react.useCallback)((key, ref, stackBehavior) => {
    const _sheetsQueue = sheetsQueueRef.current.slice();
    const sheetIndex = _sheetsQueue.findIndex(item => item.key === key);
    const sheetOnTop = sheetIndex === _sheetsQueue.length - 1;

    /**
     * Exit the method, if sheet is already presented
     * and at the top.
     */
    if (sheetIndex !== -1 && sheetOnTop) {
      return;
    }

    /**
     * Minimize the current sheet if:
     * - it exists.
     * - it is not unmounting.
     * - stack behavior is 'replace'.
     */

    /**
     * Handle switch or replace stack behaviors, if:
     * - a modal is currently presented.
     * - it is not unmounting
     */
    const currentMountedSheet = _sheetsQueue[_sheetsQueue.length - 1];
    if (currentMountedSheet && !currentMountedSheet.willUnmount) {
      if (stackBehavior === _constants.MODAL_STACK_BEHAVIOR.replace) {
        currentMountedSheet.ref?.current?.dismiss();
      } else if (stackBehavior === _constants.MODAL_STACK_BEHAVIOR.switch) {
        currentMountedSheet.ref?.current?.minimize();
      }
    }

    /**
     * Restore and remove incoming sheet from the queue,
     * if it was registered.
     */
    if (sheetIndex !== -1) {
      _sheetsQueue.splice(sheetIndex, 1);
      ref?.current?.restore();
    }
    _sheetsQueue.push({
      key,
      ref,
      willUnmount: false
    });
    sheetsQueueRef.current = _sheetsQueue;
  }, []);
  const handleUnmountSheet = (0, _react.useCallback)(key => {
    const _sheetsQueue = sheetsQueueRef.current.slice();
    const sheetIndex = _sheetsQueue.findIndex(item => item.key === key);
    const sheetOnTop = sheetIndex === _sheetsQueue.length - 1;

    /**
     * Here we remove the unmounted sheet and update
     * the sheets queue.
     */
    _sheetsQueue.splice(sheetIndex, 1);
    sheetsQueueRef.current = _sheetsQueue;

    /**
     * Here we try to restore previous sheet position if unmounted
     * sheet was on top. This is needed when user dismiss
     * the modal by panning down.
     */
    const hasMinimizedSheet = sheetsQueueRef.current.length > 0;
    const minimizedSheet = sheetsQueueRef.current[sheetsQueueRef.current.length - 1];
    if (sheetOnTop && hasMinimizedSheet && minimizedSheet && !minimizedSheet.willUnmount) {
      sheetsQueueRef.current[sheetsQueueRef.current.length - 1].ref?.current?.restore();
    }
  }, []);
  const handleWillUnmountSheet = (0, _react.useCallback)(key => {
    const _sheetsQueue = sheetsQueueRef.current.slice();
    const sheetIndex = _sheetsQueue.findIndex(item => item.key === key);
    const sheetOnTop = sheetIndex === _sheetsQueue.length - 1;

    /**
     * Here we mark the sheet that will unmount,
     * so it won't be restored.
     */
    if (sheetIndex !== -1) {
      _sheetsQueue[sheetIndex].willUnmount = true;
    }

    /**
     * Here we try to restore previous sheet position,
     * This is needed when user dismiss the modal by fire the dismiss action.
     */
    const hasMinimizedSheet = _sheetsQueue.length > 1;
    if (sheetOnTop && hasMinimizedSheet) {
      _sheetsQueue[_sheetsQueue.length - 2].ref?.current?.restore();
    }
    sheetsQueueRef.current = _sheetsQueue;
  }, []);
  //#endregion

  //#region public methods
  const handleDismiss = (0, _react.useCallback)(key => {
    const sheetToBeDismissed = key ? sheetsQueueRef.current.find(item => item.key === key) : sheetsQueueRef.current[sheetsQueueRef.current.length - 1];
    if (sheetToBeDismissed) {
      sheetToBeDismissed.ref?.current?.dismiss();
      return true;
    }
    return false;
  }, []);
  const handleDismissAll = (0, _react.useCallback)(() => {
    sheetsQueueRef.current.map(item => {
      item.ref?.current?.dismiss();
    });
  }, []);
  //#endregion

  //#region context variables
  const externalContextVariables = (0, _react.useMemo)(() => ({
    dismiss: handleDismiss,
    dismissAll: handleDismissAll
  }), [handleDismiss, handleDismissAll]);
  const internalContextVariables = (0, _react.useMemo)(() => ({
    containerHeight: animatedContainerHeight,
    containerOffset: animatedContainerOffset,
    mountSheet: handleMountSheet,
    unmountSheet: handleUnmountSheet,
    willUnmountSheet: handleWillUnmountSheet
  }), [animatedContainerHeight, animatedContainerOffset, handleMountSheet, handleUnmountSheet, handleWillUnmountSheet]);
  //#endregion

  //#region renders
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_contexts.BottomSheetModalProvider, {
    value: externalContextVariables,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_contexts.BottomSheetModalInternalProvider, {
      value: internalContextVariables,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_bottomSheetContainer.default, {
        containerOffset: animatedContainerOffset,
        containerHeight: animatedContainerHeight
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_portal.PortalProvider, {
        children: children
      })]
    })
  });
  //#endregion
};
var _default = exports.default = BottomSheetModalProviderWrapper;
//# sourceMappingURL=BottomSheetModalProvider.js.map