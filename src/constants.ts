import { Dimensions, Platform } from 'react-native';
// @ts-expect-error Module '"react-native-reanimated"' has no exported member 'ReduceMotion'
import Animated, { Easing, ReduceMotion } from 'react-native-reanimated';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

enum GESTURE_SOURCE {
  UNDETERMINED = 0,
  SCROLLABLE,
  HANDLE,
  CONTENT,
}

enum SHEET_STATE {
  CLOSED = 0,
  OPENED,
  EXTENDED,
  OVER_EXTENDED,
  FILL_PARENT,
}

enum SCROLLABLE_STATE {
  LOCKED = 0,
  UNLOCKED,
  UNDETERMINED,
}

enum SCROLLABLE_TYPE {
  UNDETERMINED = 0,
  VIEW,
  FLATLIST,
  SCROLLVIEW,
  SECTIONLIST,
  VIRTUALIZEDLIST,
}

enum ANIMATION_STATE {
  UNDETERMINED = 0,
  RUNNING,
  STOPPED,
  INTERRUPTED,
}

enum ANIMATION_SOURCE {
  NONE = 0,
  MOUNT,
  GESTURE,
  USER,
  CONTAINER_RESIZE,
  SNAP_POINT_CHANGE,
  KEYBOARD,
}

enum ANIMATION_METHOD {
  TIMING,
  SPRING,
}

enum KEYBOARD_STATE {
  UNDETERMINED = 0,
  SHOWN,
  HIDDEN,
}

const ANIMATION_EASING: Animated.EasingFunction = Easing.out(Easing.exp);
const ANIMATION_DURATION = 250;

const ANIMATION_CONFIGS_IOS = {
  damping: 500,
  stiffness: 1000,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10,
  ...(ReduceMotion ? { reduceMotion: ReduceMotion.Never } : {}),
};

const ANIMATION_CONFIGS_ANDROID = {
  duration: ANIMATION_DURATION,
  easing: ANIMATION_EASING,
  ...(ReduceMotion ? { reduceMotion: ReduceMotion.Never } : {}),
};

const ANIMATION_CONFIGS =
  Platform.OS === 'ios' ? ANIMATION_CONFIGS_IOS : ANIMATION_CONFIGS_ANDROID;

const SCROLLABLE_DECELERATION_RATE_MAPPER = {
  [SCROLLABLE_STATE.UNDETERMINED]: 0,
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
  interactive: 'interactive',
  extend: 'extend',
  fillParent: 'fillParent',
} as const;

const KEYBOARD_BLUR_BEHAVIOR = {
  none: 'none',
  restore: 'restore',
} as const;

const KEYBOARD_INPUT_MODE = {
  adjustPan: 'adjustPan',
  adjustResize: 'adjustResize',
} as const;

const KEYBOARD_DISMISS_THRESHOLD = 12.5;

export {
  GESTURE_SOURCE,
  SHEET_STATE,
  ANIMATION_STATE,
  ANIMATION_METHOD,
  ANIMATION_SOURCE,
  SCROLLABLE_TYPE,
  SCROLLABLE_STATE,
  KEYBOARD_STATE,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SCROLLABLE_DECELERATION_RATE_MAPPER,
  MODAL_STACK_BEHAVIOR,
  KEYBOARD_BEHAVIOR,
  KEYBOARD_BLUR_BEHAVIOR,
  KEYBOARD_INPUT_MODE,
  KEYBOARD_DISMISS_THRESHOLD,
  ANIMATION_CONFIGS,
  ANIMATION_EASING,
  ANIMATION_DURATION,
};
