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

const AnimatedSectionList = _reactNativeReanimated.default.createAnimatedComponent(_reactNative.SectionList);

const BottomSheetSectionListComponent = (0, _createBottomSheetScrollableComponent.createBottomSheetScrollableComponent)(_constants.SCROLLABLE_TYPE.SECTIONLIST, AnimatedSectionList);
const BottomSheetSectionList = /*#__PURE__*/(0, _react.memo)(BottomSheetSectionListComponent);
BottomSheetSectionList.displayName = 'BottomSheetSectionList';
var _default = BottomSheetSectionList;
exports.default = _default;
//# sourceMappingURL=BottomSheetSectionList.js.map