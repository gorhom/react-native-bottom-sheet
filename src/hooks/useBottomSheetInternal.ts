import { useContext } from 'react';
import { BottomSheetInternalContext } from '../contexts/internal';

export const useBottomSheetInternal = () => {
  return useContext(BottomSheetInternalContext);
};
