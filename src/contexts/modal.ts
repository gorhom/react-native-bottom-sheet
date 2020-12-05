import { createContext, ReactNode } from 'react';
import type { BottomSheetModalConfigs } from '../types';

export type BottomSheetModalContextType = {
  present: (
    uniqueId: string,
    content: ReactNode,
    configs: BottomSheetModalConfigs
  ) => void;
  dismiss: (uniqueId: string) => void;
  dismissAll: () => void;
  snapTo: (uniqueId: string, index: number) => void;
  expand: (uniqueId: string) => void;
  collapse: (uniqueId: string) => void;
};

// @ts-ignore
export const BottomSheetModalContext = createContext<BottomSheetModalContextType>();

export const BottomSheetModalProvider = BottomSheetModalContext.Provider;
