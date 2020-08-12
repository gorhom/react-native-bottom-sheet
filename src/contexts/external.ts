import { createContext } from 'react';
import type { BottomSheetMethods } from '../types';

// @ts-ignore
export const BottomSheetContext = createContext<BottomSheetMethods>();

export const BottomSheetProvider = BottomSheetContext.Provider;
