"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _reactNative = require("react-native");

var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));

var _constants = require("../../constants");

var _createBottomSheetScrollableComponent = require("./createBottomSheetScrollableComponent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AnimatedScrollView = _reactNativeReanimated.default.createAnimatedComponent(_reactNative.ScrollView);

const BottomSheetScrollViewComponent = (0, _createBottomSheetScrollableComponent.createBottomSheetScrollableComponent)(_constants.SCROLLABLE_TYPE.SCROLLVIEW, AnimatedScrollView);
const BottomSheetScrollView = /*#__PURE__*/(0, _react.memo)(BottomSheetScrollViewComponent);
BottomSheetScrollView.displayName = 'BottomSheetScrollView';
var _default = BottomSheetScrollView;
exports.default = _default;
//# sourceMappingURL=BottomSheetScrollView.js.map