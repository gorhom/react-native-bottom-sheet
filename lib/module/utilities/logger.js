let isLoggingEnabled = false;

const enableLogging = () => {
  if (!__DEV__) {
    console.warn('[BottomSheet] could not enable logging on production!');
    return;
  }

  isLoggingEnabled = true;
};

let print = () => {};

if (__DEV__) {
  print = ({
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
export { print, enableLogging };
//# sourceMappingURL=logger.js.map