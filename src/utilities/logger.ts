interface PrintOptions {
  component?: string;
  method?: string;
  params?: Record<string, any> | string | number | boolean;
}

type Print = (options: PrintOptions) => void;

let isLoggingEnabled = false;

// __DEV__ global is by default not defined in React Native Web builds
const isDev = Boolean(typeof __DEV__ !== 'undefined' && __DEV__)

const enableLogging = () => {
  if (!isDev) {
    console.warn('[BottomSheet] could not enable logging on production!');
    return;
  }
  isLoggingEnabled = true;
};

let print: Print = () => {};

if (isDev) {
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
