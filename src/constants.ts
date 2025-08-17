import { Dimensions, Platform } from 'react-native';
import type Animated from 'react-native-reanimated';
import { Easing } from 'react-native-reanimated';
import type { SpringConfig, TimingConfig } from './types';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

enum GESTURE_SOURCE {
  UNDETERMINED = 0,
  SCROLLABLE = 1,
  HANDLE = 2,
  CONTENT = 3,
}

enum SHEET_STATE {
  CLOSED = 0,
  OPENED = 1,
  EXTENDED = 2,
  OVER_EXTENDED = 3,
  FILL_PARENT = 4,
}

enum SCROLLABLE_STATUS {
  LOCKED = 0,
  UNLOCKED = 1,
  UNDETERMINED = 2,
}

enum SCROLLABLE_TYPE {
  UNDETERMINED = 0,
  VIEW = 1,
  FLATLIST = 2,
  SCROLLVIEW = 3,
  SECTIONLIST = 4,
  VIRTUALIZEDLIST = 5,
}

enum ANIMATION_STATUS {
  UNDETERMINED = 0,
  RUNNING = 1,
  STOPPED = 2,
  INTERRUPTED = 3,
}

enum ANIMATION_SOURCE {
  NONE = 0,
  MOUNT = 1,
  GESTURE = 2,
  USER = 3,
  CONTAINER_RESIZE = 4,
  SNAP_POINT_CHANGE = 5,
  KEYBOARD = 6,
}

enum ANIMATION_METHOD {
  TIMING = 0,
  SPRING = 1,
}

enum KEYBOARD_STATUS {
  UNDETERMINED = 0,
  SHOWN = 1,
  HIDDEN = 2,
}

enum SNAP_POINT_TYPE {
  PROVIDED = 0,
  DYNAMIC = 1,
}

const ANIMATION_EASING: Animated.EasingFunction = Easing.out(Easing.exp);
const ANIMATION_DURATION = 250;

const ANIMATION_CONFIGS = Platform.select<TimingConfig | SpringConfig>({
  android: {
    duration: ANIMATION_DURATION,
    easing: ANIMATION_EASING,
  },
  default: {
    damping: 500,
    stiffness: 1000,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 10,
    restSpeedThreshold: 10,
  },
});

const SCROLLABLE_DECELERATION_RATE_MAPPER = {
  [SCROLLABLE_STATUS.UNDETERMINED]: 0,
  [SCROLLABLE_STATUS.LOCKED]: 0,
  [SCROLLABLE_STATUS.UNLOCKED]: Platform.select({
    ios: 0.998,
    android: 0.985,
    default: 1,
  }),
};

const MODAL_STACK_BEHAVIOR = {
  replace: 'replace',
  push: 'push',
  switch: 'switch',
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

const INITIAL_LAYOUT_VALUE = -999;
const INITIAL_CONTAINER_LAYOUT = {
  height: INITIAL_LAYOUT_VALUE,
  offset: {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
};

export {
  GESTURE_SOURCE,
  SHEET_STATE,
  ANIMATION_STATUS,
  ANIMATION_METHOD,
  ANIMATION_SOURCE,
  SCROLLABLE_TYPE,
  SCROLLABLE_STATUS,
  KEYBOARD_STATUS,
  SNAP_POINT_TYPE,
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
  INITIAL_LAYOUT_VALUE,
  INITIAL_CONTAINER_LAYOUT,
};
