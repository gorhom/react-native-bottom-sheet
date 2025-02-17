"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollableContainer = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));
var _BottomSheetDraggableScrollable = require("./BottomSheetDraggableScrollable");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Detect if the current browser is Safari or not.
 */
const isWebkit = () => {
  // @ts-ignore
  return navigator.userAgent.indexOf('Safari') > -1;
};
const ScrollableContainer = exports.ScrollableContainer = /*#__PURE__*/(0, _react.forwardRef)(function ScrollableContainer({
  nativeGesture,
  ScrollableComponent,
  animatedProps,
  setContentSize,
  onLayout,
  ...rest
}, ref) {
  //#region refs
  const isInitialContentHeightCaptured = (0, _react.useRef)(false);
  //#endregion

  //#region callbacks
  const renderScrollComponent = (0, _react.useCallback)(props => /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.ScrollView, {
    ...props,
    animatedProps: animatedProps
  }), [animatedProps]);

  /**
   * A workaround a bug in React Native Web [#1502](https://github.com/necolas/react-native-web/issues/1502),
   * where the `onContentSizeChange` won't be call on initial render.
   */
  const handleOnLayout = (0, _react.useCallback)(event => {
    if (onLayout) {
      onLayout(event);
    }
    if (!isInitialContentHeightCaptured.current) {
      isInitialContentHeightCaptured.current = true;
      if (!isWebkit()) {
        return;
      }
      // @ts-ignore
      window.requestAnimationFrame(() => {
        // @ts-ignore
        setContentSize(event.nativeEvent.target.clientHeight);
      });
    }
  }, [onLayout, setContentSize]);
  //#endregion
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_BottomSheetDraggableScrollable.BottomSheetDraggableScrollable, {
    scrollableGesture: nativeGesture,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(ScrollableComponent, {
      ref: ref,
      ...rest,
      onLayout: handleOnLayout,
      renderScrollComponent: renderScrollComponent
    })
  });
});
//# sourceMappingURL=ScrollableContainer.web.js.map