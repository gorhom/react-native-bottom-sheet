import type {
  TouchableOpacity as RNTouchableOpacity,
  TouchableHighlight as RNTouchableHighlight,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
} from 'react-native';

import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  // @ts-ignore
} from './Touchables';

export default {
  TouchableOpacity: TouchableOpacity as typeof RNTouchableOpacity,
  TouchableHighlight: TouchableHighlight as typeof RNTouchableHighlight,
  TouchableWithoutFeedback: TouchableWithoutFeedback as typeof RNTouchableWithoutFeedback,
};
