import type React from 'react';
import type Animated from 'react-native-reanimated';
import type { BottomSheetHandleProps } from '../handle';

export interface BottomSheetProps extends BottomSheetAnimationConfigs {
  initialSnapIndex?: number;
  snapPoints: Array<string | number>;
  topInset?: number;
  animatedPosition?: Animated.Value<number>;
  animatedPositionIndex?: Animated.Value<number>;
  handleComponent?: React.FC<BottomSheetHandleProps>;
  children: React.ReactNode[] | React.ReactNode;
  onChange?: (index: number) => void;
}

export interface BottomSheetAnimationConfigs {
  /**
   * Snapping animation easing function.
   * @type Animated.EasingFunction
   * @default Easing.out(Easing.back(0.75))
   */
  animationEasing?: Animated.EasingFunction;
  /**
   * Snapping animation duration.
   * @type number
   * @default 500
   */
  animationDuration?: number;
}
