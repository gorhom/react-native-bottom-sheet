import { Dimensions, Platform } from 'react-native';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');

enum GESTURE {
  UNDETERMINED = 0,
  CONTENT,
  HANDLE,
}

enum SHEET_STATE {
  CLOSED = 0,
  OPENED,
  EXTENDED,
  OVER_EXTENDED,
  FULL_SCREEN,
}

enum SCROLLABLE_STATE {
  LOCKED = 0,
  UNLOCKED,
}

enum ANIMATION_STATE {
  UNDETERMINED = 0,
  RUNNING,
  STOPPED,
}

enum KEYBOARD_STATE {
  UNDETERMINED = 0,
  SHOWN,
  HIDDEN,
}

enum ANIMATION_METHOD {
  TIMING,
  SPRING,
}

const SCROLLABLE_DECELERATION_RATE_MAPPER = {
  [SCROLLABLE_STATE.LOCKED]: 0,
  [SCROLLABLE_STATE.UNLOCKED]: Platform.select({
    ios: 0.998,
    android: 0.985,
    default: 1,
  }),
};

const MODAL_STACK_BEHAVIOR = {
  replace: 'replace',
  push: 'push',
};

const KEYBOARD_BEHAVIOR = {
  none: 'none',
  extend: 'extend',
  fullScreen: 'fullScreen',
  interactive: 'interactive',
} as const;

const KEYBOARD_BLUR_BEHAVIOR = {
  none: 'none',
  restore: 'restore',
} as const;

const KEYBOARD_DISMISS_THRESHOLD = 12.5;

export {
  GESTURE,
  SHEET_STATE,
  ANIMATION_STATE,
  SCROLLABLE_STATE,
  KEYBOARD_STATE,
  ANIMATION_METHOD,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  SCROLLABLE_DECELERATION_RATE_MAPPER,
  MODAL_STACK_BEHAVIOR,
  KEYBOARD_BEHAVIOR,
  KEYBOARD_BLUR_BEHAVIOR,
  KEYBOARD_DISMISS_THRESHOLD,
};
