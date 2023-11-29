/// <reference types="react-native-reanimated" />
import { KeyboardEventEasing } from 'react-native';
import { KEYBOARD_STATE } from '../constants';
export declare const useKeyboard: () => {
    state: import("react-native-reanimated").SharedValue<KEYBOARD_STATE>;
    height: import("react-native-reanimated").SharedValue<number>;
    animationEasing: import("react-native-reanimated").SharedValue<KeyboardEventEasing>;
    animationDuration: import("react-native-reanimated").SharedValue<number>;
    shouldHandleKeyboardEvents: import("react-native-reanimated").SharedValue<boolean>;
};
