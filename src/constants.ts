import { Dimensions, Platform } from 'react-native';
import { Easing } from 'react-native-reanimated';

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

const KEYBOARD_DEFAULT_ANIMATION_CONFIGS = {
  damping: 500,
  stiffness: 1000,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10,
};

const KEYBOARD_DISMISS_THRESHOLD = 25;

const KEYBOARD_EASING_MAPPER = {
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInEaseOut: Easing.inOut(Easing.ease),
  linear: Easing.linear,
};

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
  KEYBOARD_DEFAULT_ANIMATION_CONFIGS,
  KEYBOARD_DISMISS_THRESHOLD,
  KEYBOARD_EASING_MAPPER,
};
