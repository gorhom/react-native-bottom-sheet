import { createContext } from 'react';

export interface BottomSheetModalContextType {
  dismiss: (key: string) => void;
  dismissAll: () => void;
}

export const BottomSheetModalContext =
  createContext<BottomSheetModalContextType | null>(null);

export const BottomSheetModalProvider = BottomSheetModalContext.Provider;
