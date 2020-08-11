import { useContext } from 'react';
import { BottomSheetInternalContext, BottomSheetContext } from './context';

export const useBottomSheetInternal = () => {
  return useContext(BottomSheetInternalContext);
};

export const useBottomSheet = () => {
  return useContext(BottomSheetContext);
};
