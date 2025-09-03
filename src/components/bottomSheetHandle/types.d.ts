import type React from 'react';
import type { View, ViewProps } from 'react-native';
import type { PanGestureHandlerProperties } from 'react-native-gesture-handler';
import type { AnimateProps, SharedValue } from 'react-native-reanimated';
import type { useInteractivePanGestureHandlerConfigs } from '../../hooks/useGestureHandler';
import type {
  BottomSheetVariables,
  NullableAccessibilityProps,
} from '../../types';
import type { BottomSheetProps } from '../bottomSheet';

export type BottomSheetHandleProps = BottomSheetVariables;
export interface BottomSheetDefaultHandleProps
  extends BottomSheetHandleProps,
    NullableAccessibilityProps {
  /**
   * View style to be applied to the handle container.
   * @type ViewStyle
   * @default undefined
   */
  style?: ViewProps['style'];
  /**
   * View style to be applied to the handle indicator.
   * @type ViewStyle
   * @default undefined
   */
  indicatorStyle?: ViewProps['style'];
  /**
   * Content to be added below the indicator.
   * @type React.ReactNode | React.ReactNode[];
   * @default undefined
   */
  children?: React.ReactNode | React.ReactNode[];
}

export type BottomSheetHandleContainerProps = Pick<
  PanGestureHandlerProperties,
  'simultaneousHandlers'
> & {
  handleComponent: React.FC<BottomSheetDefaultHandleProps>;
} & Pick<
    BottomSheetProps,
    'enableHandlePanningGesture' | 'handleIndicatorStyle' | 'handleStyle'
  > &
  Pick<
    useInteractivePanGestureHandlerConfigs,
    | 'enableOverDrag'
    | 'enablePanDownToClose'
    | 'overDragResistanceFactor'
    | 'keyboardBehavior'
  > &
  BottomSheetHandleProps;
