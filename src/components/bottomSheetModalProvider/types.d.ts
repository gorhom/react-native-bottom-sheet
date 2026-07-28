import type { ReactNode, RefObject } from 'react';
import type { BottomSheetModalPrivateMethods } from '../bottomSheetModal';

export interface BottomSheetModalRef {
  key: string;
  ref: RefObject<BottomSheetModalPrivateMethods>;
}

export interface BottomSheetModalProviderProps {
  children?: ReactNode;
}
