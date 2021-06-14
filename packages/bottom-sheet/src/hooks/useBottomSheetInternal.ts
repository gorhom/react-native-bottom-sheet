import { useContext } from 'react';
import { BottomSheetInternalContext } from '../contexts/internal';

export const useBottomSheetInternal = () => {
  const context = useContext(BottomSheetInternalContext);

  if (context === null) {
    throw "'BottomSheetInternalContext' cannot be null!";
  }

  return context;
};
