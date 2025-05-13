"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));
var _constants = require("./constants");
var _styles = require("./styles");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const BottomSheetHandleComponent = ({
  style,
  indicatorStyle: _indicatorStyle,
  children,
  accessible = _constants.DEFAULT_ACCESSIBLE,
  accessibilityRole = _constants.DEFAULT_ACCESSIBILITY_ROLE,
  accessibilityLabel = _constants.DEFAULT_ACCESSIBILITY_LABEL,
  accessibilityHint = _constants.DEFAULT_ACCESSIBILITY_HINT
}) => {
  // styles
  const containerStyle = (0, _react.useMemo)(() => [_styles.styles.container, ...[Array.isArray(style) ? style : [style]]], [style]);
  const indicatorStyle = (0, _react.useMemo)(() => [_styles.styles.indicator, ...[Array.isArray(_indicatorStyle) ? _indicatorStyle : [_indicatorStyle]]], [_indicatorStyle]);

  // render
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNativeReanimated.default.View, {
    style: containerStyle,
    accessible: accessible ?? undefined,
    accessibilityRole: accessibilityRole ?? undefined,
    accessibilityLabel: accessibilityLabel ?? undefined,
    accessibilityHint: accessibilityHint ?? undefined,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
      style: indicatorStyle
    }), children]
  });
};
const BottomSheetHandle = /*#__PURE__*/(0, _react.memo)(BottomSheetHandleComponent);
BottomSheetHandle.displayName = 'BottomSheetHandle';
var _default = exports.default = BottomSheetHandle;
//# sourceMappingURL=BottomSheetHandle.js.map