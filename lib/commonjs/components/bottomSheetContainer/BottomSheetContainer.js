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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
  const containerRef = (0, _react.useRef)(null); //#region styles

  const containerStyle = (0, _react.useMemo)(() => [style, _styles.styles.container, {
    top: topInset,
    bottom: bottomInset,
    overflow: detached ? 'visible' : 'hidden'
  }], [style, detached, topInset, bottomInset]); //#endregion
  //#region callbacks

  const handleContainerLayout = (0, _react.useCallback)(function handleContainerLayout({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) {
    var _containerRef$current;

    containerHeight.value = height;
    (_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : _containerRef$current.measure((_x, _y, _width, _height, _pageX, pageY) => {
      var _StatusBar$currentHei;

      if (!containerOffset.value) return;
      containerOffset.value = {
        top: pageY !== null && pageY !== void 0 ? pageY : 0,
        left: 0,
        right: 0,
        bottom: Math.max(0, _constants.WINDOW_HEIGHT - ((pageY !== null && pageY !== void 0 ? pageY : 0) + height + ((_StatusBar$currentHei = _reactNative.StatusBar.currentHeight) !== null && _StatusBar$currentHei !== void 0 ? _StatusBar$currentHei : 0)))
      };
    });
    (0, _utilities.print)({
      component: BottomSheetContainer.displayName,
      method: 'handleContainerLayout',
      params: {
        height
      }
    });
  }, [containerHeight, containerOffset, containerRef]); //#endregion
  //#region render

  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    ref: containerRef,
    pointerEvents: "box-none",
    onLayout: shouldCalculateHeight ? handleContainerLayout : undefined,
    style: containerStyle,
    children: children
  }); //#endregion
}

const BottomSheetContainer = /*#__PURE__*/(0, _react.memo)(BottomSheetContainerComponent);
BottomSheetContainer.displayName = 'BottomSheetContainer';
var _default = BottomSheetContainer;
exports.default = _default;
//# sourceMappingURL=BottomSheetContainer.js.map