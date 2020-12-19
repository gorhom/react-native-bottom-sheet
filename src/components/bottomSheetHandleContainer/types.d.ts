import type { PanGestureHandlerProperties } from 'react-native-gesture-handler';
import type { BottomSheetProps } from '../bottomSheet';
import type { BottomSheetHandleProps } from '../bottomSheetHandle';

export interface BottomSheetHandleContainerProps
  extends Pick<
      PanGestureHandlerProperties,
      'simultaneousHandlers' | 'onHandlerStateChange' | 'onGestureEvent'
    >,
    Pick<BottomSheetProps, 'handleComponent'>,
    BottomSheetHandleProps {
  shouldMeasureHeight: boolean;
  onMeasureHeight: (height: number) => void;
}
