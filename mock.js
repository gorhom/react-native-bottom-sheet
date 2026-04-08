/**
 * Mock implementation for test runners.
 *
 * Example:
 *
 * ```js
 * jest.mock('@gorhom/bottom-sheet', () => require('@gorhom/bottom-sheet/mock'));
 * ```
 */

const React = require('react');
const ReactNative = require('react-native');

const NOOP = () => {};
const NOOP_VALUE = { value: 0, set: NOOP, get: () => 0 };

const BottomSheetModalProvider = ({ children }) => {
  return children;
};

const BottomSheetBackdrop = NOOP;

const BottomSheetComponent = props => {
  return props.children;
};

class BottomSheetModal extends React.Component {
  // Store mock data passed via present
  data = null;

  snapToIndex() {}
  snapToPosition() {}
  expand() {}
  collapse() {}
  close() {
    this.data = null;
  }
  forceClose() {
    this.data = null;
  }
  present(data) {
    // Store data passed to present
    this.data = data;
    // Need to trigger a re-render somehow if component depends on this state,
    // but for basic mock, just storing is often enough.
  }
  dismiss() {
    this.data = null;
  }

  render() {
    const { children: Content } = this.props;
    return typeof Content === 'function'
      ? React.createElement(Content, { data: this.data })
      : Content;
  }
}

class BottomSheet extends React.Component {
  snapToIndex() {}
  snapToPosition() {}
  expand() {}
  collapse() {}
  close() {}
  forceClose() {}

  render() {
    return this.props.children;
  }
}

const useBottomSheet = () => ({
  snapToIndex: NOOP,
  snapToPosition: NOOP,
  expand: NOOP,
  collapse: NOOP,
  close: NOOP,
  forceClose: NOOP,

  animatedIndex: NOOP_VALUE,
  animatedPosition: NOOP_VALUE,
});

const useBottomSheetModal = () => ({
  dismiss: NOOP,
  dismissAll: NOOP,
});

const useBottomSheetAnimationConfigs = configs => configs;

const bottomSheetInternal = {
  stopAnimation: NOOP,
  animateToPosition: NOOP,
  setScrollableRef: NOOP,
  removeScrollableRef: NOOP,
};

const bottomSheetModalInternal = {
  mountSheet: NOOP,
  unmountSheet: NOOP,
  willUnmountSheet: NOOP,
};

const internalProxy = {
  get(target, prop) {
    return prop in target ? target[prop] : NOOP_VALUE;
  },
};

const useBottomSheetInternal = () =>
  new Proxy(bottomSheetInternal, internalProxy);

const useBottomSheetModalInternal = () =>
  new Proxy(bottomSheetModalInternal, internalProxy);

const useBottomSheetDynamicSnapPoints = () => ({
  animatedSnapPoints: NOOP_VALUE,
  animatedHandleHeight: NOOP_VALUE,
  animatedContentHeight: NOOP_VALUE,
  handleContentLayout: NOOP,
});

const GESTURE_SOURCE = {
  UNDETERMINED: 0,
  SCROLLABLE: 1,
  HANDLE: 2,
  CONTENT: 3,
};

const SHEET_STATE = {
  CLOSED: 0,
  OPENED: 1,
  EXTENDED: 2,
  OVER_EXTENDED: 3,
  FILL_PARENT: 4,
};

const SCROLLABLE_STATE = {
  LOCKED: 0,
  UNLOCKED: 1,
  UNDETERMINED: 2,
};

const SCROLLABLE_TYPE = {
  UNDETERMINED: 0,
  VIEW: 1,
  FLATLIST: 2,
  SCROLLVIEW: 3,
  SECTIONLIST: 4,
  VIRTUALIZEDLIST: 5,
};

const ANIMATION_STATE = {
  UNDETERMINED: 0,
  RUNNING: 1,
  STOPPED: 2,
  INTERRUPTED: 3,
};

const ANIMATION_SOURCE = {
  NONE: 0,
  MOUNT: 1,
  GESTURE: 2,
  USER: 3,
  CONTAINER_RESIZE: 4,
  SNAP_POINT_CHANGE: 5,
  KEYBOARD: 6,
};

const ANIMATION_METHOD = {
  TIMING: 0,
  SPRING: 1,
};

const KEYBOARD_STATE = {
  UNDETERMINED: 0,
  SHOWN: 1,
  HIDDEN: 2,
};

const SNAP_POINT_TYPE = {
  PROVIDED: 0,
  DYNAMIC: 1,
};

const ENUMS = {
  GESTURE_SOURCE,
  SHEET_STATE,
  SCROLLABLE_STATE,
  SCROLLABLE_TYPE,
  ANIMATION_STATE,
  ANIMATION_SOURCE,
  ANIMATION_METHOD,
  KEYBOARD_STATE,
  SNAP_POINT_TYPE,
};

const createBottomSheetScrollableComponent = (_type, ScrollableComponent) => {
  return ScrollableComponent;
};

module.exports = {
  BottomSheetView: BottomSheetComponent,
  BottomSheetTextInput: ReactNative.TextInput,
  BottomSheetScrollView: ReactNative.ScrollView,
  BottomSheetSectionList: ReactNative.SectionList,
  BottomSheetFlatList: ReactNative.FlatList,
  BottomSheetFlashList: ReactNative.FlatList,
  BottomSheetVirtualizedList: ReactNative.VirtualizedList,

  TouchableOpacity: ReactNative.TouchableOpacity,
  TouchableHighlight: ReactNative.TouchableHighlight,
  TouchableWithoutFeedback: ReactNative.TouchableWithoutFeedback,

  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetBackdrop,

  default: BottomSheet,

  useBottomSheet,
  useBottomSheetModal,
  useBottomSheetSpringConfigs: useBottomSheetAnimationConfigs,
  useBottomSheetTimingConfigs: useBottomSheetAnimationConfigs,
  useBottomSheetInternal,
  useBottomSheetModalInternal,
  useBottomSheetDynamicSnapPoints,

  ...ENUMS,
  createBottomSheetScrollableComponent,
};
