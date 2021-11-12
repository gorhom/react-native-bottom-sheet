import { useContext } from 'react';
import {
  BottomSheetModalInternalContext,
  BottomSheetModalInternalContextType,
} from '../contexts';

interface IUseBottomSheetModalInternal {
  (unsafe?: false): BottomSheetModalInternalContextType;
  (unsafe: true): BottomSheetModalInternalContextType | null;
}

export const useBottomSheetModalInternal: IUseBottomSheetModalInternal = ((
  unsafe = false
) => {
  const context = useContext(BottomSheetModalInternalContext);

  if (unsafe !== true && context === null) {
    throw "'BottomSheetModalInternalContext' cannot be null!";
  }

  return context;
}) as IUseBottomSheetModalInternal;
