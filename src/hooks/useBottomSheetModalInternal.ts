import { useContext } from 'react';
import { BottomSheetModalInternalContext } from '../contexts';

export const useBottomSheetModalInternal = () =>
  useContext(BottomSheetModalInternalContext);
