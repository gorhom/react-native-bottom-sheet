import type Animated from 'react-native-reanimated';

export interface BottomSheetHandleProps {
  /**
   * Current sheet position index.
   * @type Animated.Value<number>
   */
  animatedIndex: Animated.SharedValue<number>;
  /**
   * Current sheet position.
   * @type Animated.Value<number>
   */
  animatedPosition: Animated.SharedValue<number>;
}
