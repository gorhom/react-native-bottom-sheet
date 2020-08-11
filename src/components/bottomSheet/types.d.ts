import type React from 'react';
import type Animated from 'react-native-reanimated';
import type { BottomSheetHandleProps } from '../handle';

export interface BottomSheetProps {
  initialSnapIndex?: number;
  snapPoints: Array<string | number>;
  topInset?: number;
  animatedPosition?: Animated.Value<number>;
  animatedPositionIndex?: Animated.Value<number>;
  handleComponent?: React.FC<BottomSheetHandleProps>;
  children: React.ReactNode[] | React.ReactNode;
  onChange?: (index: number) => void;
}
