"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _constants = require("../../constants");
var _utilities = require("../../utilities");
var _styles = require("./styles");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function BottomSheetContainerComponent({
  containerHeight,
  containerOffset,
  topInset = 0,
  bottomInset = 0,
  shouldCalculateHeight = true,
  detached,
  style,
  children
}) {
  const containerRef = (0, _react.useRef)(null);
  //#region styles
  const containerStyle = (0, _react.useMemo)(() => [style, _styles.styles.container, {
    top: topInset,
    bottom: bottomInset,
    overflow: detached ? 'visible' : 'hidden'
  }], [style, detached, topInset, bottomInset]);
  //#endregion

  //#region callbacks
  const handleContainerLayout = (0, _react.useCallback)(function handleContainerLayout({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) {
    containerHeight.value = height;
    containerRef.current?.measure((_x, _y, _width, _height, _pageX, pageY) => {
      if (!containerOffset.value) {
        return;
      }
      containerOffset.value = {
        top: pageY ?? 0,
        left: 0,
        right: 0,
        bottom: Math.max(0, _constants.WINDOW_HEIGHT - ((pageY ?? 0) + height + (_reactNative.StatusBar.currentHeight ?? 0)))
      };
    });
    (0, _utilities.print)({
      component: BottomSheetContainer.displayName,
      method: 'handleContainerLayout',
      category: 'layout',
      params: {
        height
      }
    });
  }, [containerHeight, containerOffset]);
  //#endregion

  //#region render
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    ref: containerRef,
    pointerEvents: "box-none",
    onLayout: shouldCalculateHeight ? handleContainerLayout : undefined,
    style: containerStyle,
    children: children
  });
  //#endregion
}
const BottomSheetContainer = /*#__PURE__*/(0, _react.memo)(BottomSheetContainerComponent);
BottomSheetContainer.displayName = 'BottomSheetContainer';
var _default = exports.default = BottomSheetContainer;
//# sourceMappingURL=BottomSheetContainer.js.map