import type Animated from 'react-native-reanimated';

export interface BottomSheetHandleProps {
  /**
   * Current sheet position index.
   * @type Animated.Value<number>
   */
  animatedIndex: Animated.Node<number>;
  /**
   * Current sheet position.
   * @type Animated.Value<number>
   */
  animatedPosition: Animated.Node<number>;
}
