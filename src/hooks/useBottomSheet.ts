import { useContext } from 'react';
import { BottomSheetContext } from '../contexts/external';

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);

  if (context === null) {
    throw "'BottomSheetContext' cannot be null!";
  }

  return context;
};
