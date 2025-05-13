"use strict";

import { useContext } from 'react';
import { BottomSheetInternalContext } from '../contexts/internal';
export function useBottomSheetInternal(unsafe) {
  const context = useContext(BottomSheetInternalContext);
  if (unsafe !== true && context === null) {
    throw "'useBottomSheetInternal' cannot be used out of the BottomSheet!";
  }
  return context;
}
//# sourceMappingURL=useBottomSheetInternal.js.map