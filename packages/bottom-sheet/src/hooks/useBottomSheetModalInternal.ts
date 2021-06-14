import { useContext } from 'react';
import { BottomSheetModalInternalContext } from '../contexts';

export const useBottomSheetModalInternal = () => {
  const context = useContext(BottomSheetModalInternalContext);

  if (context === null) {
    throw "'BottomSheetModalInternalContext' cannot be null!";
  }

  return context;
};
