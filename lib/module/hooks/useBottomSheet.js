"use strict";

import { useContext } from 'react';
import { BottomSheetContext } from '../contexts/external';
export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (context === null) {
    throw "'useBottomSheet' cannot be used out of the BottomSheet!";
  }
  return context;
};
//# sourceMappingURL=useBottomSheet.js.map