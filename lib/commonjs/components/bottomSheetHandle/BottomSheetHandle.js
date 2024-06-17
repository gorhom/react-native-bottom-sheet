"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));

var _styles = require("./styles");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
  const indicatorStyle = (0, _react.useMemo)(() => [_styles.styles.indicator, ...[Array.isArray(_indicatorStyle) ? _indicatorStyle : [_indicatorStyle]]], [_indicatorStyle]); // render

  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: containerStyle,
    accessible: accessible !== null && accessible !== void 0 ? accessible : undefined,
    accessibilityRole: accessibilityRole !== null && accessibilityRole !== void 0 ? accessibilityRole : undefined,
    accessibilityLabel: accessibilityLabel !== null && accessibilityLabel !== void 0 ? accessibilityLabel : undefined,
    accessibilityHint: accessibilityHint !== null && accessibilityHint !== void 0 ? accessibilityHint : undefined
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: indicatorStyle
  }), children);
};

const BottomSheetHandle = /*#__PURE__*/(0, _react.memo)(BottomSheetHandleComponent);
BottomSheetHandle.displayName = 'BottomSheetHandle';
var _default = BottomSheetHandle;
exports.default = _default;
//# sourceMappingURL=BottomSheetHandle.js.map