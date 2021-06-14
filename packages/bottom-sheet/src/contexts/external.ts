import { createContext } from 'react';
import type { BottomSheetMethods } from '../types';

export const BottomSheetContext =
  createContext<BottomSheetMethods | null>(null);

export const BottomSheetProvider = BottomSheetContext.Provider;
