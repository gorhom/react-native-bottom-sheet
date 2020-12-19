import { Dimensions } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');


enum GESTURE {
  UNDETERMINED = 0,
  CONTENT,
  HANDLE,
}

enum ANIMATION_STATE {
  UNDETERMINED = 0,
  RUNNING,
  STOPPED,
}

export { WINDOW_HEIGHT, WINDOW_WIDTH, GESTURE, ANIMATION_STATE };
