"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findNodeHandle = findNodeHandle;
var _reactNative = require("react-native");
function findNodeHandle(componentOrHandle) {
  try {
    return (0, _reactNative.findNodeHandle)(componentOrHandle);
  } catch {
    // @ts-ignore
    return componentOrHandle.getNativeScrollRef();
  }
}
//# sourceMappingURL=findNodeHandle.web.js.map