"use strict";

let _isLoggingEnabled = false;
let _excludeCategories;
const enableLogging = excludeCategories => {
  if (!__DEV__) {
    console.warn('[BottomSheet] could not enable logging on production!');
    return;
  }
  _isLoggingEnabled = true;
  _excludeCategories = excludeCategories;
};
let print = () => {};
if (__DEV__) {
  print = ({
    component,
    method,
    params,
    category
  }) => {
    if (!_isLoggingEnabled) {
      return;
    }
    if (category && _excludeCategories && _excludeCategories.includes(category)) {
      return;
    }
    let message = '';
    if (typeof params === 'object') {
      message = Object.keys(params).map(key => `${key}:${params[key]}`).join(' ');
    } else {
      message = `${params ?? ''}`;
    }
    // biome-ignore lint/suspicious/noConsole: used for debugging
    console.log(`[${[component, method].filter(Boolean).join('::')}]`, message);
  };
}
Object.freeze(print);
export { print, enableLogging };
//# sourceMappingURL=logger.js.map