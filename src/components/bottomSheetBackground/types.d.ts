import type Animated from 'react-native-reanimated';
import type { ViewProps } from 'react-native';

export interface BottomSheetBackgroundProps
  extends Pick<ViewProps, 'pointerEvents' | 'style'> {
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
