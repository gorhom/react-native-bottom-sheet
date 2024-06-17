"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableLogging = exports.print = void 0;
let isLoggingEnabled = false;

const enableLogging = () => {
  if (!__DEV__) {
    console.warn('[BottomSheet] could not enable logging on production!');
    return;
  }

  isLoggingEnabled = true;
};

exports.enableLogging = enableLogging;

let print = () => {};

exports.print = print;

if (__DEV__) {
  exports.print = print = ({
    component,
    method,
    params
  }) => {
    if (!isLoggingEnabled) {
      return;
    }

    let message = '';

    if (typeof params === 'object') {
      message = Object.keys(params).map(key => `${key}:${params[key]}`).join(' ');
    } else {
      message = `${params !== null && params !== void 0 ? params : ''}`;
    } // eslint-disable-next-line no-console


    console.log(`[${[component, method].filter(Boolean).join('::')}]`, message);
  };
}

Object.freeze(print);
//# sourceMappingURL=logger.js.map