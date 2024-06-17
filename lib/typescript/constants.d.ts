import Animated from 'react-native-reanimated';
declare const WINDOW_HEIGHT: number, WINDOW_WIDTH: number;
declare const SCREEN_HEIGHT: number, SCREEN_WIDTH: number;
declare enum GESTURE_SOURCE {
    UNDETERMINED = 0,
    SCROLLABLE = 1,
    HANDLE = 2,
    CONTENT = 3
}
declare enum SHEET_STATE {
    CLOSED = 0,
    OPENED = 1,
    EXTENDED = 2,
    OVER_EXTENDED = 3,
    FILL_PARENT = 4
}
declare enum SCROLLABLE_STATE {
    LOCKED = 0,
    UNLOCKED = 1,
    UNDETERMINED = 2
}
declare enum SCROLLABLE_TYPE {
    UNDETERMINED = 0,
    VIEW = 1,
    FLATLIST = 2,
    SCROLLVIEW = 3,
    SECTIONLIST = 4,
    VIRTUALIZEDLIST = 5
}
declare enum ANIMATION_STATE {
    UNDETERMINED = 0,
    RUNNING = 1,
    STOPPED = 2,
    INTERRUPTED = 3
}
declare enum ANIMATION_SOURCE {
    NONE = 0,
    MOUNT = 1,
    GESTURE = 2,
    USER = 3,
    CONTAINER_RESIZE = 4,
    SNAP_POINT_CHANGE = 5,
    KEYBOARD = 6
}
declare enum ANIMATION_METHOD {
    TIMING = 0,
    SPRING = 1
}
declare enum KEYBOARD_STATE {
    UNDETERMINED = 0,
    SHOWN = 1,
    HIDDEN = 2
}
declare const ANIMATION_EASING: Animated.EasingFunction;
declare const ANIMATION_DURATION = 250;
declare const ANIMATION_CONFIGS: {
    damping: number;
    stiffness: number;
    mass: number;
    overshootClamping: boolean;
    restDisplacementThreshold: number;
    restSpeedThreshold: number;
} | {
    duration: number;
    easing: Animated.EasingFunction;
};
declare const SCROLLABLE_DECELERATION_RATE_MAPPER: {
    2: number;
    0: number;
    1: number;
};
declare const MODAL_STACK_BEHAVIOR: {
    replace: string;
    push: string;
};
declare const KEYBOARD_BEHAVIOR: {
    readonly interactive: "interactive";
    readonly extend: "extend";
    readonly fillParent: "fillParent";
};
declare const KEYBOARD_BLUR_BEHAVIOR: {
    readonly none: "none";
    readonly restore: "restore";
};
declare const KEYBOARD_INPUT_MODE: {
    readonly adjustPan: "adjustPan";
    readonly adjustResize: "adjustResize";
};
declare const KEYBOARD_DISMISS_THRESHOLD = 12.5;
export { GESTURE_SOURCE, SHEET_STATE, ANIMATION_STATE, ANIMATION_METHOD, ANIMATION_SOURCE, SCROLLABLE_TYPE, SCROLLABLE_STATE, KEYBOARD_STATE, WINDOW_HEIGHT, WINDOW_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH, SCROLLABLE_DECELERATION_RATE_MAPPER, MODAL_STACK_BEHAVIOR, KEYBOARD_BEHAVIOR, KEYBOARD_BLUR_BEHAVIOR, KEYBOARD_INPUT_MODE, KEYBOARD_DISMISS_THRESHOLD, ANIMATION_CONFIGS, ANIMATION_EASING, ANIMATION_DURATION, };
