import { useContext } from 'react';
import {
  BottomSheetInternalContext,
  BottomSheetInternalContextType,
} from '../contexts/internal';

interface IUseBottomSheetInternal {
  (unsafe?: false): BottomSheetInternalContextType;
  (unsafe: true): BottomSheetInternalContextType | null;
}

export const useBottomSheetInternal: IUseBottomSheetInternal = ((
  unsafe = false
) => {
  const context = useContext(BottomSheetInternalContext);

  if (unsafe !== true && context === null) {
    throw "'useBottomSheetInternal' cannot be used out of the BottomSheet!";
  }

  return context;
}) as IUseBottomSheetInternal;
