import type Animated from 'react-native-reanimated';

export interface BottomSheetHandleProps {
  /**
   * Animated value to be used as a callback for the position index node internally.
   * @type Animated.Value<number>
   */
  animatedPositionIndex: Animated.SharedValue<number>;
}
