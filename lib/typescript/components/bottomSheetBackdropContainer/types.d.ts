import type { BottomSheetProps } from '../bottomSheet';
import type { BottomSheetBackdropProps } from '../bottomSheetBackdrop';

export interface BottomSheetBackdropContainerProps
  extends Pick<BottomSheetProps, 'backdropComponent'>,
    BottomSheetBackdropProps {}
