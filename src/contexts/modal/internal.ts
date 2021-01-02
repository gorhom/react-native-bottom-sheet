import { createContext, Ref } from 'react';
import type BottomSheet from '../../components/bottomSheet';
import type { BottomSheetModalStackBehavior } from '../../components/bottomSheetModal';

export interface BottomSheetModalInternalContextType {
  containerHeight: number;
  mountSheet: (
    key: string,
    ref: Ref<BottomSheet>,
    stackBehavior: BottomSheetModalStackBehavior
  ) => void;
  unmountSheet: (key: string) => void;
  willUnmountSheet: (key: string) => void;
}

// @ts-ignore
export const BottomSheetModalInternalContext = createContext<BottomSheetModalInternalContextType>();

export const BottomSheetModalInternalProvider =
  BottomSheetModalInternalContext.Provider;
