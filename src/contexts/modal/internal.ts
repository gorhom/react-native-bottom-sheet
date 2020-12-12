import { createContext, Ref } from 'react';
import type BottomSheet from '../../components/bottomSheet';

export interface BottomSheetModalInternalContextType {
  containerHeight: number;
  mountSheet: (key: string, ref: Ref<BottomSheet>) => void;
  unmountSheet: (key: string) => void;
  willUnmountSheet: (key: string) => void;
}

// @ts-ignore
export const BottomSheetModalInternalContext = createContext<BottomSheetModalInternalContextType>();

export const BottomSheetModalInternalProvider =
  BottomSheetModalInternalContext.Provider;
