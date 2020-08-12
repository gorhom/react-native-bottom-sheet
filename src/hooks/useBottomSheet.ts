import { useContext } from 'react';
import { BottomSheetContext } from '../contexts/external';

export const useBottomSheet = () => {
  return useContext(BottomSheetContext);
};
