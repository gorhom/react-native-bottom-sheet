import { createContext } from 'react';
import type { BottomSheetMethods, BottomSheetVariables } from '../types';

export const BottomSheetContext = createContext<
  (BottomSheetMethods & BottomSheetVariables) | null
>(null);

export const BottomSheetProvider = BottomSheetContext.Provider;
