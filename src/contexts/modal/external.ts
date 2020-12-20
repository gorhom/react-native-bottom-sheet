import { createContext } from 'react';

export interface BottomSheetModalContextType {
  dismiss: (key: string) => void;
  dismissAll: () => void;
}

// @ts-ignore
export const BottomSheetModalContext = createContext<BottomSheetModalContextType>();

export const BottomSheetModalProvider = BottomSheetModalContext.Provider;
