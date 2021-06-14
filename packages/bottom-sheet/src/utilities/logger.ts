interface PrintOptions {
  component?: string;
  method?: string;
  params?: Record<string, any> | string | number | boolean;
}

type Print = (options: PrintOptions) => void;

let isLoggingEnabled = false;

const enableLogging = () => {
  if (!__DEV__) {
    console.warn('[BottomSheet] could not enable logging on production!');
    return;
  }
  isLoggingEnabled = true;
};

let print: Print = () => {};

if (__DEV__) {
  print = ({ component, method, params }) => {
    if (!isLoggingEnabled) {
      return;
    }
    let message = '';

    if (typeof params === 'object') {
      message = Object.keys(params)
        .map(key => `${key}:${params[key]}`)
        .join(' ');
    } else {
      message = `${params ?? ''}`;
    }
    // eslint-disable-next-line no-console
    console.log(`[${[component, method].filter(Boolean).join('::')}]`, message);
  };
}

Object.freeze(print);

export { print, enableLogging };
