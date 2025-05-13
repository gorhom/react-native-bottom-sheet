"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = exports.default = exports.BottomSheetFlashList = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _BottomSheetScrollView = _interopRequireDefault(require("./BottomSheetScrollView"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// @ts-ignore

let FlashList;
// since FlashList is not a dependency for the library
// we try to import it using metro optional import
try {
  FlashList = require('@shopify/flash-list');
} catch (_) {}
const BottomSheetFlashListComponent = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  //#region props
  const {
    focusHook,
    scrollEventsHandlersHook,
    enableFooterMarginAdjustment,
    ...rest
    // biome-ignore lint: to be addressed!
  } = props;
  //#endregion

  (0, _react.useMemo)(() => {
    if (!FlashList) {
      throw 'You need to install FlashList first, `yarn install @shopify/flash-list`';
    }
  }, []);

  //#region render
  const renderScrollComponent = (0, _react.useMemo)(() => /*#__PURE__*/(0, _react.forwardRef)(
  // @ts-ignore
  ({
    data,
    ...props
  }, ref) => {
    return (
      /*#__PURE__*/
      // @ts-ignore
      (0, _jsxRuntime.jsx)(_BottomSheetScrollView.default, {
        ref: ref,
        ...props,
        focusHook: focusHook,
        scrollEventsHandlersHook: scrollEventsHandlersHook,
        enableFooterMarginAdjustment: enableFooterMarginAdjustment
      })
    );
  }), [focusHook, scrollEventsHandlersHook, enableFooterMarginAdjustment]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(FlashList.FlashList, {
    ref: ref,
    renderScrollComponent: renderScrollComponent,
    ...rest
  });
  //#endregion
});
const styles = exports.styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible'
  }
});
const BottomSheetFlashList = exports.BottomSheetFlashList = /*#__PURE__*/(0, _react.memo)(BottomSheetFlashListComponent);
var _default = exports.default = BottomSheetFlashList;
//# sourceMappingURL=BottomSheetFlashList.js.map