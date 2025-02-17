"use strict";

import { useContext } from 'react';
import { BottomSheetModalInternalContext } from '../contexts';
export function useBottomSheetModalInternal(unsafe) {
  const context = useContext(BottomSheetModalInternalContext);
  if (unsafe !== true && context === null) {
    throw "'BottomSheetModalInternalContext' cannot be null!";
  }
  return context;
}
//# sourceMappingURL=useBottomSheetModalInternal.js.map