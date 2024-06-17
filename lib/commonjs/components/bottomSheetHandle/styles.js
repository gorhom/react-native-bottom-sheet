"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = void 0;

var _reactNative = require("react-native");

var _constants = require("../../constants");

const styles = _reactNative.StyleSheet.create({
  container: {
    padding: 10
  },
  indicator: {
    alignSelf: 'center',
    width: 7.5 * _constants.WINDOW_WIDTH / 100,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
});

exports.styles = styles;
//# sourceMappingURL=styles.js.map