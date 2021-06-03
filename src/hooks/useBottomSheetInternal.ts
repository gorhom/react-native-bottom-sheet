import { useContext } from 'react';
import { BottomSheetInternalContext } from '../contexts/internal';

export const useBottomSheetInternal = () => {
  const context = useContext(BottomSheetInternalContext);

  if (context === null) {
    throw "'useBottomSheetInternal' cannot be used out of the BottomSheet!";
  }

  return context;
};
