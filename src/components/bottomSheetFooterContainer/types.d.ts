import type { NullableAccessibilityProps } from '../../types';
import type { BottomSheetProps } from '../bottomSheet';

export interface BottomSheetFooterContainerProps
  extends Required<Pick<BottomSheetProps, 'footerComponent'>>,
    Pick<NullableAccessibilityProps, 'accessible'> {}
