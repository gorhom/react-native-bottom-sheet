"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _bottomSheetBackground = _interopRequireDefault(require("../bottomSheetBackground"));

var _styles = require("./styles");

var _reactNative = require("react-native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const BottomSheetBackgroundContainerComponent = ({
  animatedIndex,
  animatedPosition,
  backgroundComponent: _providedBackgroundComponent,
  backgroundStyle: _providedBackgroundStyle
}) => {
  const BackgroundComponent = _providedBackgroundComponent || _bottomSheetBackground.default;
  const backgroundStyle = (0, _react.useMemo)(() => _reactNative.StyleSheet.flatten([_styles.styles.container, _providedBackgroundStyle]), [_providedBackgroundStyle]);
  return _providedBackgroundComponent === null ? null : /*#__PURE__*/_react.default.createElement(BackgroundComponent, {
    pointerEvents: "none",
    animatedIndex: animatedIndex,
    animatedPosition: animatedPosition,
    style: backgroundStyle
  });
};

const BottomSheetBackgroundContainer = /*#__PURE__*/(0, _react.memo)(BottomSheetBackgroundContainerComponent);
BottomSheetBackgroundContainer.displayName = 'BottomSheetBackgroundContainer';
var _default = BottomSheetBackgroundContainer;
exports.default = _default;
//# sourceMappingURL=BottomSheetBackgroundContainer.js.map