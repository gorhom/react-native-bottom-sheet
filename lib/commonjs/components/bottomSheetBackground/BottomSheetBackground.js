"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _styles = require("./styles");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const BottomSheetBackgroundComponent = ({
  pointerEvents,
  style
}) => /*#__PURE__*/_react.default.createElement(_reactNative.View, {
  pointerEvents: pointerEvents,
  accessible: true,
  accessibilityRole: "adjustable",
  accessibilityLabel: "Bottom Sheet",
  style: [_styles.styles.container, style]
});

const BottomSheetBackground = /*#__PURE__*/(0, _react.memo)(BottomSheetBackgroundComponent);
BottomSheetBackground.displayName = 'BottomSheetBackground';
var _default = BottomSheetBackground;
exports.default = _default;
//# sourceMappingURL=BottomSheetBackground.js.map