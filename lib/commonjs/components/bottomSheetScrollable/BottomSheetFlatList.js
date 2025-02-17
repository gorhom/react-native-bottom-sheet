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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const AnimatedFlatList = _reactNativeReanimated.default.createAnimatedComponent(_reactNative.FlatList);
const BottomSheetFlatListComponent = (0, _createBottomSheetScrollableComponent.createBottomSheetScrollableComponent)(_constants.SCROLLABLE_TYPE.FLATLIST, AnimatedFlatList);
const BottomSheetFlatList = /*#__PURE__*/(0, _react.memo)(BottomSheetFlatListComponent);
BottomSheetFlatList.displayName = 'BottomSheetFlatList';
var _default = exports.default = BottomSheetFlatList;
//# sourceMappingURL=BottomSheetFlatList.js.map