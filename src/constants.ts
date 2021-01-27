import { Dimensions } from 'react-native';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');

enum GESTURE {
  UNDETERMINED = 0,
  CONTENT,
  HANDLE,
}

export { GESTURE, WINDOW_HEIGHT, WINDOW_WIDTH };
