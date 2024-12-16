"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _portal = require("@gorhom/portal");
var _react = _interopRequireWildcard(require("react"));
var _hooks = require("../../hooks");
var _utilities = require("../../utilities");
var _id = require("../../utilities/id");
var _bottomSheet = _interopRequireDefault(require("../bottomSheet"));
var _constants = require("./constants");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const INITIAL_STATE = {
  mount: false,
  data: undefined
};

// biome-ignore lint/suspicious/noExplicitAny: Using 'any' allows users to define their own strict types for 'data' property.

// biome-ignore lint/suspicious/noExplicitAny: Using 'any' allows users to define their own strict types for 'data' property.
function BottomSheetModalComponent(props, ref) {
  const {
    // modal props
    name,
    stackBehavior = _constants.DEFAULT_STACK_BEHAVIOR,
    enableDismissOnClose = _constants.DEFAULT_ENABLE_DISMISS_ON_CLOSE,
    onDismiss: _providedOnDismiss,
    onAnimate: _providedOnAnimate,
    // bottom sheet props
    index = 0,
    snapPoints,
    enablePanDownToClose = true,
    animateOnMount = true,
    containerComponent: ContainerComponent = _react.default.Fragment,
    // callbacks
    onChange: _providedOnChange,
    // components
    children: Content,
    ...bottomSheetProps
  } = props;

  //#region state
  const [{
    mount,
    data
  }, setState] = (0, _react.useState)(INITIAL_STATE);
  //#endregion

  //#region hooks
  const {
    containerHeight,
    containerOffset,
    mountSheet,
    unmountSheet,
    willUnmountSheet
  } = (0, _hooks.useBottomSheetModalInternal)();
  const {
    removePortal: unmountPortal
  } = (0, _portal.usePortal)();
  //#endregion

  //#region refs
  const bottomSheetRef = (0, _react.useRef)(null);
  const currentIndexRef = (0, _react.useRef)(!animateOnMount ? index : -1);
  const nextIndexRef = (0, _react.useRef)(null);
  const restoreIndexRef = (0, _react.useRef)(-1);
  const minimized = (0, _react.useRef)(false);
  const forcedDismissed = (0, _react.useRef)(false);
  const mounted = (0, _react.useRef)(false);
  mounted.current = mount;
  //#endregion

  //#region variables
  const key = (0, _react.useMemo)(() => name || `bottom-sheet-modal-${(0, _id.id)()}`, [name]);
  //#endregion

  //#region private methods
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheetModal.name): used for debug only
  const resetVariables = (0, _react.useCallback)(function resetVariables() {
    (0, _utilities.print)({
      component: BottomSheetModal.name,
      method: resetVariables.name
    });
    currentIndexRef.current = -1;
    restoreIndexRef.current = -1;
    minimized.current = false;
    mounted.current = false;
    forcedDismissed.current = false;
  }, []);
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheetModal.name): used for debug only
  const unmount = (0, _react.useCallback)(function unmount() {
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheetModal.name,
        method: unmount.name
      });
    }
    const _mounted = mounted.current;

    // reset variables
    resetVariables();

    // unmount sheet and portal
    unmountSheet(key);
    unmountPortal(key);

    // unmount the node, if sheet is still mounted
    if (_mounted) {
      setState(INITIAL_STATE);
    }

    // fire `onDismiss` callback
    if (_providedOnDismiss) {
      _providedOnDismiss();
    }
  }, [key, resetVariables, unmountSheet, unmountPortal, _providedOnDismiss]);
  //#endregion

  //#region bottom sheet methods
  const handleSnapToIndex = (0, _react.useCallback)((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.snapToIndex(...args);
  }, []);
  const handleSnapToPosition = (0, _react.useCallback)((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.snapToPosition(...args);
  }, []);
  const handleExpand = (0, _react.useCallback)((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.expand(...args);
  }, []);
  const handleCollapse = (0, _react.useCallback)((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.collapse(...args);
  }, []);
  const handleClose = (0, _react.useCallback)((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.close(...args);
  }, []);
  const handleForceClose = (0, _react.useCallback)((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.forceClose(...args);
  }, []);
  //#endregion

  //#region bottom sheet modal methods
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheetModal.name): used for debug only
  // biome-ignore lint/correctness/useExhaustiveDependencies(ref): ref is a stable object
  const handlePresent = (0, _react.useCallback)(function handlePresent(_data) {
    requestAnimationFrame(() => {
      setState({
        mount: true,
        data: _data
      });
      mountSheet(key, ref, stackBehavior);
      ref;
      if (__DEV__) {
        (0, _utilities.print)({
          component: BottomSheetModal.name,
          method: handlePresent.name
        });
      }
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [key, stackBehavior, mountSheet]);
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheetModal.name): used for debug only
  const handleDismiss = (0, _react.useCallback)(function handleDismiss(animationConfigs) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheetModal.name,
        method: handleDismiss.name,
        params: {
          currentIndexRef: currentIndexRef.current,
          minimized: minimized.current
        }
      });
    }
    const animating = nextIndexRef.current != null;

    /**
     * early exit, if not minimized, it is in closed position and not animating
     */
    if (currentIndexRef.current === -1 && minimized.current === false && !animating) {
      return;
    }

    /**
     * unmount and early exit, if minimized or it is in closed position and not animating
     */
    if (!animating && (minimized.current || currentIndexRef.current === -1 && enablePanDownToClose)) {
      unmount();
      return;
    }
    willUnmountSheet(key);
    forcedDismissed.current = true;
    bottomSheetRef.current?.forceClose(animationConfigs);
  }, [willUnmountSheet, unmount, key, enablePanDownToClose]);
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheetModal.name): used for debug only
  const handleMinimize = (0, _react.useCallback)(function handleMinimize() {
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheetModal.name,
        method: handleMinimize.name,
        params: {
          minimized: minimized.current
        }
      });
    }
    if (minimized.current) {
      return;
    }
    minimized.current = true;

    /**
     * if modal got minimized before it finish its mounting
     * animation, we set the `restoreIndexRef` to the
     * provided index.
     */
    if (currentIndexRef.current === -1) {
      restoreIndexRef.current = index;
    } else {
      restoreIndexRef.current = currentIndexRef.current;
    }
    bottomSheetRef.current?.close();
  }, [index]);
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheetModal.name): used for debug only
  const handleRestore = (0, _react.useCallback)(function handleRestore() {
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheetModal.name,
        method: handleRestore.name,
        params: {
          minimized: minimized.current,
          forcedDismissed: forcedDismissed.current
        }
      });
    }
    if (!minimized.current || forcedDismissed.current) {
      return;
    }
    minimized.current = false;
    bottomSheetRef.current?.snapToIndex(restoreIndexRef.current);
  }, []);
  //#endregion

  //#region callbacks
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheetModal.name): used for debug only
  const handlePortalOnUnmount = (0, _react.useCallback)(function handlePortalOnUnmount() {
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheetModal.name,
        method: handlePortalOnUnmount.name,
        params: {
          minimized: minimized.current,
          forcedDismissed: forcedDismissed.current
        }
      });
    }
    /**
     * if modal is already been dismiss, we exit the method.
     */
    if (currentIndexRef.current === -1 && minimized.current === false) {
      return;
    }
    mounted.current = false;
    forcedDismissed.current = true;
    if (minimized.current) {
      unmount();
      return;
    }
    willUnmountSheet(key);
    bottomSheetRef.current?.close();
  }, [key, unmount, willUnmountSheet]);
  const handlePortalRender = (0, _react.useCallback)(function handlePortalRender(render) {
    if (mounted.current) {
      render();
    }
  }, []);
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheetModal.name): used for debug only
  const handleBottomSheetOnChange = (0, _react.useCallback)(function handleBottomSheetOnChange(_index, _position, _type) {
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheetModal.name,
        method: handleBottomSheetOnChange.name,
        category: 'callback',
        params: {
          minimized: minimized.current,
          forcedDismissed: forcedDismissed.current
        }
      });
    }
    currentIndexRef.current = _index;
    nextIndexRef.current = null;
    if (_providedOnChange) {
      _providedOnChange(_index, _position, _type);
    }
  }, [_providedOnChange]);
  const handleBottomSheetOnAnimate = (0, _react.useCallback)((fromIndex, toIndex) => {
    nextIndexRef.current = toIndex;
    if (_providedOnAnimate) {
      _providedOnAnimate(fromIndex, toIndex);
    }
  }, [_providedOnAnimate]);
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheetModal.name): used for debug only
  const handleBottomSheetOnClose = (0, _react.useCallback)(function handleBottomSheetOnClose() {
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheetModal.name,
        method: handleBottomSheetOnClose.name,
        category: 'callback',
        params: {
          minimized: minimized.current,
          forcedDismissed: forcedDismissed.current
        }
      });
    }
    if (minimized.current) {
      return;
    }
    if (enableDismissOnClose) {
      unmount();
    }
  }, [enableDismissOnClose, unmount]);
  //#endregion

  //#region expose methods
  (0, _react.useImperativeHandle)(ref, () => ({
    // sheet
    snapToIndex: handleSnapToIndex,
    snapToPosition: handleSnapToPosition,
    expand: handleExpand,
    collapse: handleCollapse,
    close: handleClose,
    forceClose: handleForceClose,
    // modal methods
    dismiss: handleDismiss,
    present: handlePresent,
    // internal
    minimize: handleMinimize,
    restore: handleRestore
  }));
  //#endregion

  // render
  return mount ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_portal.Portal, {
    name: key,
    handleOnMount: handlePortalRender,
    handleOnUpdate: handlePortalRender,
    handleOnUnmount: handlePortalOnUnmount,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(ContainerComponent, {
      children: /*#__PURE__*/(0, _react.createElement)(_bottomSheet.default, {
        ...bottomSheetProps,
        ref: bottomSheetRef,
        key: key,
        index: index,
        snapPoints: snapPoints,
        enablePanDownToClose: enablePanDownToClose,
        animateOnMount: animateOnMount,
        containerHeight: containerHeight,
        containerOffset: containerOffset,
        onChange: handleBottomSheetOnChange,
        onClose: handleBottomSheetOnClose,
        onAnimate: handleBottomSheetOnAnimate,
        $modal: true
      }, typeof Content === 'function' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(Content, {
        data: data
      }) : Content)
    }, key)
  }, key) : null;
}
const BottomSheetModal = /*#__PURE__*/(0, _react.memo)(/*#__PURE__*/(0, _react.forwardRef)(BottomSheetModalComponent));
BottomSheetModal.displayName = 'BottomSheetModal';
var _default = exports.default = BottomSheetModal;
//# sourceMappingURL=BottomSheetModal.js.map