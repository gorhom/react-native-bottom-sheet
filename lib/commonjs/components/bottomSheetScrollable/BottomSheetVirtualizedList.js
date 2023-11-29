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

const AnimatedVirtualizedList = _reactNativeReanimated.default.createAnimatedComponent(_reactNative.VirtualizedList);

const BottomSheetVirtualizedListComponent = (0, _createBottomSheetScrollableComponent.createBottomSheetScrollableComponent)(_constants.SCROLLABLE_TYPE.VIRTUALIZEDLIST, AnimatedVirtualizedList);
const BottomSheetVirtualizedList = /*#__PURE__*/(0, _react.memo)(BottomSheetVirtualizedListComponent);
BottomSheetVirtualizedList.displayName = 'BottomSheetVirtualizedList';
var _default = BottomSheetVirtualizedList;
exports.default = _default;
//# sourceMappingURL=BottomSheetVirtualizedList.js.map