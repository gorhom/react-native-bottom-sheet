import { useContext } from 'react';
import { BottomSheetInternalContext } from './context';

export const useBottomSheetInternal = () => {
  return useContext(BottomSheetInternalContext);
};
