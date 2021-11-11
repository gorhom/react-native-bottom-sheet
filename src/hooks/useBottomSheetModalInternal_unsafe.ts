import { useContext } from 'react';
import { BottomSheetModalInternalContext } from '../contexts';

export const useBottomSheetModalInternal_unsafe = () => {
  return useContext(BottomSheetModalInternalContext);
};
