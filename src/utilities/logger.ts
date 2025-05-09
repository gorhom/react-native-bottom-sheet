interface PrintOptions {
  component?: string;
  category?: 'layout' | 'effect' | 'callback';
  method?: string;
  params?: Record<string, unknown> | string | number | boolean;
}

type Print = (options: PrintOptions) => void;

let _isLoggingEnabled = false;
let _excludeCategories: PrintOptions['category'][] | undefined;

const enableLogging = (excludeCategories?: PrintOptions['category'][]) => {
  if (!__DEV__) {
    console.warn('[BottomSheet] could not enable logging on production!');
    return;
  }

  _isLoggingEnabled = true;
  _excludeCategories = excludeCategories;
};

let print: Print = () => {};

if (__DEV__) {
  print = ({ component, method, params, category }) => {
    if (!_isLoggingEnabled) {
      return;
    }

    if (
      category &&
      _excludeCategories &&
      _excludeCategories.includes(category)
    ) {
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
    // biome-ignore lint/suspicious/noConsole: used for debugging
    console.log(`[${[component, method].filter(Boolean).join('::')}]`, message);
  };
}

Object.freeze(print);

export { print, enableLogging };
