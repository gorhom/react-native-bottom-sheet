import type { BottomSheetProps } from '../bottomSheet';
import type { BottomSheetBackgroundProps } from '../bottomSheetBackground';

export interface BottomSheetBackgroundContainerProps
  extends Pick<BottomSheetProps, 'backgroundComponent' | 'backgroundStyle'>,
    BottomSheetBackgroundProps {}
