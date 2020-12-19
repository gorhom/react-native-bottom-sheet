import type { PanGestureHandlerProperties } from 'react-native-gesture-handler';
import type { BottomSheetProps } from '../bottomSheet';
import type { BottomSheetHandleProps } from '../bottomSheetHandle';

export interface BottomSheetHandleContainerProps
  extends Pick<PanGestureHandlerProperties, 'simultaneousHandlers'>,
    Pick<BottomSheetProps, 'handleComponent'>,
    BottomSheetHandleProps {
  shouldMeasureHeight: boolean;
  snapPoints: Array<number>;
  animateToPoint: (point: number) => void;
  onMeasureHeight: (height: number) => void;
}
