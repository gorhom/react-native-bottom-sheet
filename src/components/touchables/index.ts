import type {
  TouchableHighlight as RNTouchableHighlight,
  TouchableOpacity as RNTouchableOpacity,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
} from 'react-native';

import {
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  // @ts-ignore
} from './Touchables';

export default {
  TouchableOpacity: TouchableOpacity as never as typeof RNTouchableOpacity,
  TouchableHighlight:
    TouchableHighlight as never as typeof RNTouchableHighlight,
  TouchableWithoutFeedback:
    TouchableWithoutFeedback as never as typeof RNTouchableWithoutFeedback,
};
