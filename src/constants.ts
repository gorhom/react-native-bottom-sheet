import { Dimensions } from 'react-native';

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

const MODAL_STACK_BEHAVIOR = {
  replace: 'replace',
  push: 'push',
};

export {
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  GESTURE,
  ANIMATION_STATE,
  MODAL_STACK_BEHAVIOR,
};
