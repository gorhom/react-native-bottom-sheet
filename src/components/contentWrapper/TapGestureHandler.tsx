import { TapGestureHandler as RawTapGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const TapGestureHandler = Animated.createAnimatedComponent(
  RawTapGestureHandler
);

export default (TapGestureHandler as any) as typeof RawTapGestureHandler;
