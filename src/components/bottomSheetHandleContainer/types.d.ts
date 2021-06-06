import type { PanGestureHandlerProperties } from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';
import type { BottomSheetProps } from '../bottomSheet';
import type { BottomSheetHandleProps } from '../bottomSheetHandle';
import type { useInteractivePanGestureHandlerConfigs } from '../../hooks/useInteractivePanGestureHandler';
import { ViewStyle } from 'react-native';

export interface BottomSheetHandleContainerProps
  extends Pick<PanGestureHandlerProperties, 'simultaneousHandlers'>,
    Pick<BottomSheetProps, 'handleComponent' | 'enableHandlePanningGesture'>,
    Pick<
      useInteractivePanGestureHandlerConfigs,
      | 'enableOverDrag'
      | 'enablePanDownToClose'
      | 'overDragResistanceFactor'
      | 'keyboardBehavior'
    >,
    BottomSheetHandleProps {
  handlePanGestureHandler: any;
  handleHeight: Animated.SharedValue<number>;
  style?: ViewStyle;
}
