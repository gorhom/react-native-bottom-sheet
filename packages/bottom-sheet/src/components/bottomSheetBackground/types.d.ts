import type Animated from 'react-native-reanimated';
import type { ViewProps } from 'react-native';

export interface BottomSheetBackgroundProps
  extends Pick<ViewProps, 'pointerEvents' | 'style'> {
  /**
   * Current sheet position index.
   * @type Animated.SharedValue<number>
   */
  animatedIndex: Animated.SharedValue<number>;
  /**
   * Current sheet position.
   * @type Animated.SharedValue<number>
   */
  animatedPosition: Animated.SharedValue<number>;
}
