"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _portal = require("@gorhom/portal");
var _bottomSheet = _interopRequireDefault(require("../bottomSheet"));
var _hooks = require("../../hooks");
var _utilities = require("../../utilities");
var _constants = require("./constants");
var _id = require("../../utilities/id");
var _constants2 = require("../../constants");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const INITIAL_STATE = {
  mount: false,
  data: undefined
};
const BottomSheetModalComponent = /*#__PURE__*/(0, _react.forwardRef)(function BottomSheetModal(props, ref) {
  const {
    // modal props
    name,
    stackBehavior = _constants.DEFAULT_STACK_BEHAVIOR,
    enableDismissOnClose = _constants.DEFAULT_ENABLE_DISMISS_ON_CLOSE,
    onDismiss: _providedOnDismiss,
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
  const unmount = (0, _react.useCallback)(function unmount() {
    (0, _utilities.print)({
      component: BottomSheetModal.name,
      method: unmount.name
    });
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
  const handleGetState = (0, _react.useCallback)(() => {
    return bottomSheetRef.current?.getState() || _constants2.SHEET_STATE.CLOSED;
  }, []);
  //#endregion

  //#region bottom sheet modal methods
  const handlePresent = (0, _react.useCallback)(function handlePresent(_data) {
    requestAnimationFrame(() => {
      setState({
        mount: true,
        data: _data
      });
      mountSheet(key, ref, stackBehavior);
      (0, _utilities.print)({
        component: BottomSheetModal.name,
        method: handlePresent.name
      });
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [key, stackBehavior, mountSheet]);
  const handleDismiss = (0, _react.useCallback)(function handleDismiss(animationConfigs) {
    (0, _utilities.print)({
      component: BottomSheetModal.name,
      method: handleDismiss.name,
      params: {
        currentIndexRef: currentIndexRef.current,
        minimized: minimized.current
      }
    });
    /**
     * if modal is already been dismiss, we exit the method.
     */
    if (currentIndexRef.current === -1 && minimized.current === false) {
      return;
    }
    if (minimized.current || currentIndexRef.current === -1 && enablePanDownToClose) {
      unmount();
      return;
    }
    willUnmountSheet(key);
    forcedDismissed.current = true;
    bottomSheetRef.current?.forceClose(animationConfigs);
  }, [willUnmountSheet, unmount, key, enablePanDownToClose]);
  const handleMinimize = (0, _react.useCallback)(function handleMinimize() {
    (0, _utilities.print)({
      component: BottomSheetModal.name,
      method: handleMinimize.name,
      params: {
        minimized: minimized.current
      }
    });
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
  const handleRestore = (0, _react.useCallback)(function handleRestore() {
    (0, _utilities.print)({
      component: BottomSheetModal.name,
      method: handleRestore.name,
      params: {
        minimized: minimized.current,
        forcedDismissed: forcedDismissed.current
      }
    });
    if (!minimized.current || forcedDismissed.current) {
      return;
    }
    minimized.current = false;
    bottomSheetRef.current?.snapToIndex(restoreIndexRef.current);
  }, []);
  //#endregion

  //#region callbacks
  const handlePortalOnUnmount = (0, _react.useCallback)(function handlePortalOnUnmount() {
    (0, _utilities.print)({
      component: BottomSheetModal.name,
      method: handlePortalOnUnmount.name,
      params: {
        minimized: minimized.current,
        forcedDismissed: forcedDismissed.current
      }
    });
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
  const handleBottomSheetOnChange = (0, _react.useCallback)(function handleBottomSheetOnChange(_index, _position, _type) {
    (0, _utilities.print)({
      component: BottomSheetModal.name,
      method: handleBottomSheetOnChange.name,
      category: 'callback',
      params: {
        minimized: minimized.current,
        forcedDismissed: forcedDismissed.current
      }
    });
    currentIndexRef.current = _index;
    if (_providedOnChange) {
      _providedOnChange(_index, _position, _type);
    }
  }, [_providedOnChange]);
  const handleBottomSheetOnClose = (0, _react.useCallback)(function handleBottomSheetOnClose() {
    (0, _utilities.print)({
      component: BottomSheetModal.name,
      method: handleBottomSheetOnClose.name,
      category: 'callback',
      params: {
        minimized: minimized.current,
        forcedDismissed: forcedDismissed.current
      }
    });
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
    getState: handleGetState,
    // modal methods
    dismiss: handleDismiss,
    present: handlePresent,
    // internal
    minimize: handleMinimize,
    restore: handleRestore
  }));
  //#endregion

  // render
  // console.log('BottomSheetModal', index, mount, data);
  return mount ? /*#__PURE__*/_react.default.createElement(_portal.Portal, {
    key: key,
    name: key,
    handleOnMount: handlePortalRender,
    handleOnUpdate: handlePortalRender,
    handleOnUnmount: handlePortalOnUnmount
  }, /*#__PURE__*/_react.default.createElement(ContainerComponent, {
    key: key
  }, /*#__PURE__*/_react.default.createElement(_bottomSheet.default, _extends({}, bottomSheetProps, {
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
    children: typeof Content === 'function' ? Content({
      data
    }) : Content,
    $modal: true
  })))) : null;
});
const BottomSheetModal = /*#__PURE__*/(0, _react.memo)(BottomSheetModalComponent);
BottomSheetModal.displayName = 'BottomSheetModal';
var _default = exports.default = BottomSheetModal;
//# sourceMappingURL=BottomSheetModal.js.map