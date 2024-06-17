"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRefNativeTag = getRefNativeTag;
var _reactNative = require("react-native");
function getRefNativeTag(ref) {
  return (0, _reactNative.findNodeHandle)(ref?.current) || null;
}
//# sourceMappingURL=getRefNativeTag.web.js.map