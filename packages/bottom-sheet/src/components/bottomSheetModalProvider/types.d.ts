import type { ReactNode } from 'react';
import type { BottomSheetModalPrivateMethods } from '../bottomSheetModal';

export interface BottomSheetModalRef {
  key: string;
  ref: {
    current: BottomSheetModalPrivateMethods;
  };
  willUnmount: boolean;
}

export interface BottomSheetModalProviderProps {
  children?: ReactNode;
}
