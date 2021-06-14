import type {
  TouchableOpacity as RNTouchableOpacity,
  TouchableHighlight as RNTouchableHighlight,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
} from 'react-native';

import type {
  TouchableOpacity as RNGHTouchableOpacity,
  TouchableHighlight as RNGHTouchableHighlight,
  TouchableWithoutFeedback as RNGHTouchableWithoutFeedback,
} from 'react-native-gesture-handler';

import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  // @ts-ignore
} from './Touchables';

export default {
  TouchableOpacity: TouchableOpacity as
    | typeof RNTouchableOpacity
    | typeof RNGHTouchableOpacity,
  TouchableHighlight: TouchableHighlight as
    | typeof RNTouchableHighlight
    | typeof RNGHTouchableHighlight,
  TouchableWithoutFeedback: TouchableWithoutFeedback as
    | typeof RNTouchableWithoutFeedback
    | typeof RNGHTouchableWithoutFeedback,
};
