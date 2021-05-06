import type { PanGestureHandlerProperties } from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';
import type { BottomSheetProps } from '../bottomSheet';
import type { BottomSheetHandleProps } from '../bottomSheetHandle';

export interface BottomSheetHandleContainerProps
  extends Pick<PanGestureHandlerProperties, 'simultaneousHandlers'>,
    Pick<BottomSheetProps, 'handleComponent' | 'enableHandlePanningGesture'>,
    BottomSheetHandleProps {
  handlePanGestureHandler: any;

  handleHeight: Animated.SharedValue<number>;
}
