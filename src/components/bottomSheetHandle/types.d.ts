import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { BottomSheetVariables } from '../../types';

export interface BottomSheetHandleProps extends BottomSheetVariables {}

export interface BottomSheetDefaultHandleProps extends BottomSheetHandleProps {
  /**
   * View style to be applied to the handle container.
   * @type Animated.AnimateStyle<ViewStyle> | ViewStyle
   * @default undefined
   */
  style?: StyleProp<ViewStyle | Animated.AnimateStyle<ViewStyle>>;
  /**
   * View style to be applied to the handle indicator.
   * @type Animated.AnimateStyle<ViewStyle> | ViewStyle
   * @default undefined
   */
  indicatorStyle?: StyleProp<ViewStyle | Animated.AnimateStyle<ViewStyle>>;
  /**
   * Content to be added below the indicator.
   * @type React.ReactNode | React.ReactNode[];
   * @default undefined
   */
  children?: React.ReactNode | React.ReactNode[];
}
