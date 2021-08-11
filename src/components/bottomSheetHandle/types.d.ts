import type Animated from 'react-native-reanimated';
import { NullableAccessibilityProps } from '../../types';

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

export interface BottomSheetDefaultHandleProps
  extends Omit<BottomSheetHandleProps, 'animatedIndex' | 'animatedPosition'>,
    NullableAccessibilityProps {}
