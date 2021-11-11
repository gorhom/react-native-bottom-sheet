import { useContext } from 'react';
import { BottomSheetInternalContext } from '../contexts/internal';

export const useBottomSheetInternal_unsafe = () => {
  return useContext(BottomSheetInternalContext);
};
