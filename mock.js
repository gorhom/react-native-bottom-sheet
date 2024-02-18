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
const NOOP_VALUE = { value: 0 };

const BottomSheetModalProvider = ({ children }) => {
  return children;
};

const BottomSheetBackdrop = NOOP;

const BottomSheetComponent = props => {
  return props.children;
};

class BottomSheetModal extends React.Component {
  snapToIndex() {}
  snapToPosition() {}
  expand() {}
  collapse() {}
  close() {}
  forceClose() {}
  present() {}
  dismiss() {}

  render() {
    return this.props.children;
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

module.exports = {
  BottomSheetView: BottomSheetComponent,
  BottomSheetTextInput: ReactNative.TextInput,
  BottomSheetScrollView: ReactNative.ScrollView,
  BottomSheetSectionList: ReactNative.SectionList,
  BottomSheetFlatList: ReactNative.FlatList,
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
};
