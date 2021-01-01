import type { PanGestureHandlerProperties } from 'react-native-gesture-handler';
import type { BottomSheetProps } from '../bottomSheet';
import type { BottomSheetHandleProps } from '../bottomSheetHandle';

export interface BottomSheetHandleContainerProps
  extends Pick<PanGestureHandlerProperties, 'simultaneousHandlers'>,
    Pick<BottomSheetProps, 'handleComponent' | 'enableHandlePanningGesture'>,
    BottomSheetHandleProps {
  handlePanGestureHandler: any;
  shouldMeasureHeight: boolean;
  snapPoints: Array<number>;
  onMeasureHeight: (height: number) => void;
}
