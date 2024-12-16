"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollableContainer = void 0;
var _react = _interopRequireWildcard(require("react"));
var _bottomSheetRefreshControl = _interopRequireDefault(require("../bottomSheetRefreshControl"));
var _BottomSheetDraggableScrollable = require("./BottomSheetDraggableScrollable");
var _styles = require("./styles");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// biome-ignore lint: to be addressed
const ScrollableContainer = exports.ScrollableContainer = /*#__PURE__*/(0, _react.forwardRef)(function ScrollableContainer({
  nativeGesture,
  refreshControl: _refreshControl,
  refreshing,
  progressViewOffset,
  onRefresh,
  ScrollableComponent,
  ...rest
}, ref) {
  const Scrollable = /*#__PURE__*/(0, _jsxRuntime.jsx)(_BottomSheetDraggableScrollable.BottomSheetDraggableScrollable, {
    scrollableGesture: nativeGesture,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(ScrollableComponent, {
      ref: ref,
      ...rest
    })
  });
  return onRefresh ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_bottomSheetRefreshControl.default, {
    scrollableGesture: nativeGesture,
    refreshing: refreshing,
    progressViewOffset: progressViewOffset,
    onRefresh: onRefresh,
    style: _styles.styles.container,
    children: Scrollable
  }) : Scrollable;
});
//# sourceMappingURL=ScrollableContainer.android.js.map